#!/usr/bin/env python

import os
import argparse
from typing import Optional

import openai
openai.api_key = os.getenv("OPENAI_API_KEY")


# CODEX GLOBAL STATE
g_source, g_prompt = [], ""

g_last_cmd = None
g_last_cmd_args = list()
g_last_cmd_kwargs = dict()

def get_source() -> Optional[list[str]]:
    """ Returns a multiline string representation of the source code.
    """
    global g_source
    return "\n".join(g_source)

def set_source(source: list[str]):
    """ Sets value of the source code.
    """
    global g_source
    g_source = source

def get_prompt() -> Optional[str]:
    """ Returns string representation of the current prompt value.
    """
    global g_prompt
    return g_prompt

def set_prompt(prompt: str):
    """ Sets value of the current prompt.
    """
    global g_prompt
    g_prompt = prompt

def save(source : str, path : str):
    """ Save input string in a file located in given path.
    """
    with open(path, "w") as file_:
        file_.write(source)

def load(path : str) -> list[str]:
    """ Returns source loaded from the file located under given path.
    """
    with open(path, "r") as file_:
        lines = file_.read()
        return lines.splitlines()


# CODEX INTERFACE COMMANDS

def on_save(path, *args, **kwargs):
    """ Handler for the .save <path> command.
    """
    print(f"Saving code to {path} ...")
    save(get_source(), path)


def on_load(path, *args, **kwargs):
    """ Handler for the .load <path> command.
    """
    print(f"Loading context from {path} ...")
    set_source(load(path))

def on_erase(*args, **kwargs):
    """ Handler for the .erase command.
    """
    set_source(get_source().splitlines()[:-1])

def on_exit(*args, **kwargs):
    """ Handler for the .exit command.
    """
    print("Goodbye...")
    exit()

def on_help(*args, **kwargs):
    """ Handler for the .help command.
        Will print available dot commands.
    """
    print("""
    .save <path>  : save current context to the file
    .load <path>  : replace current context with the content loaded from a file
    .erase        : remove last line of the current context
    .exit         : exit from the script
    .help         : print this help message
    .             : repeat last command that was executed
    """)
    input("Press Enter to continue...")

def on_repeat_last_cmd(*args, **kwargs):
    """ Handler for the . command.
    """
    global g_last_cmd
    global g_last_cmd_args
    global g_last_cmd_kwargs

    if g_last_cmd is None:
        print("Command history is empty...")
    else:
        g_last_cmd(*g_last_cmd_args, **g_last_cmd_kwargs)


COMMANDS = {
    ".save" : on_save,
    ".exit" : on_exit,
    ".load" : on_load,
    ".erase": on_erase,
    ".help": on_help,
    ".": on_repeat_last_cmd
}


# PROGRAMMING LANGUAGES SUPPORT

LANGUAGE_CONFIG = {
    "javascript": {
        "prompt": "// {}",
        "stop": "//",
        "hint": "// --- JavaScript ---"
    },
    "python": {
        "prompt": "# {}",
        "stop": "#",
        "hint": "#/usr/bin/env python3"
    },
    "cpp": {
        "prompt": "// {}",
        "stop": "//",
        "hint": "// --- CPP ---"
    },
    "html": {
        "prompt": "<!-- {} -->",
        "stop": "<!--",
        "hint": "<!doctype html>"
    }
}


# CODEX API

def format_prompt(source: str, prompt: Optional[str], language) -> str:
    """ Format source and prompt into a soure code that will be fed into Codex API for completion.
    """
    if language not in LANGUAGE_CONFIG:
        raise KeyError("Unknown language: {language}...")

    context = source
    if len(prompt) > 0:
        comment = LANGUAGE_CONFIG[language]["prompt"].format(prompt)
        context = f"{context}\n\n{comment}"

    return context   


def codex(source: str, prompt: Optional[str], max_tokens: int = 64, language: str = 'javascript', temperature=0.1) -> str:
    """ Write code with the help from openAI Codex API.
        * context : source code which AI is supposed to complete
        * prompt  : natural language command that will be appended as a comment to the source. 
    """
    context = format_prompt(source, prompt, language)
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=context,
        max_tokens=max_tokens,
        temperature=temperature,
        stop=LANGUAGE_CONFIG[language]["stop"]
    )
    return "{}{}".format(context, response["choices"][0]["text"]).splitlines()


# PARSING CLI ARGS AND EXECUTING MAIN LOOP
def update_last_command(command, args=list(), kwargs=dict()):
    global g_last_cmd
    global g_last_cmd_args
    global g_last_cmd_kwargs
    g_last_cmd = command
    g_last_cmd_args = args
    g_last_cmd_kwargs = kwargs 


def handle_command_prompt(prompt):
    """ Handle .<command> [<args> ...] prompt.
    """
    cmd, *args = prompt.split()
    if not cmd in COMMANDS.keys():
        print("Unknown command...")
    else:
        command = COMMANDS[cmd]
        command(*args)

        if cmd != ".":
            update_last_command(command, args)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--language",
        choices=["cpp", "javascript", "python", "html"],
        default="javascript",
        help="Hint which programming language should be used for generated code."
    )
    parser.add_argument(
        "--context",
        nargs="?",
        const=None,
        default=None,
        help="Path to the context file."
    )
    parser.add_argument("--temperature", type=float, default=0.1)
    args = parser.parse_args()

    if args.context is not None:
        set_source(load(args.context))
    else:
        set_source([LANGUAGE_CONFIG[args.language]["hint"]])

    while True:
        os.system("clear")
        print(get_source())

        prompt = input("# ")
        if prompt.startswith("."):
            handle_command_prompt(prompt)
        else:
            set_source(
                codex(
                    get_source(),
                    prompt,
                    max_tokens=64,
                    language=args.language,
                    temperature=args.temperature
                )
            )

