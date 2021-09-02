# Testing grounds for the OpenAI Codex and GPT-3 Beta

I was recently granted access to the beta of OpenAI codex, and decided to setup this repo to
share the scripts and environment I use for playing around with the Codex API.


codex.py script is my command line interface for interactively working with codex completion.
It allows semi-interactive way of using the API for writing code by providing natural language
description of steps. It requires some manual tweaking currently, as the entire content of the
script needs to be wrapped within the window.onload function, but with some tinkering i may be able
to fix this issue in the future.


To use the script install openai package using pip install openai command.

Basic usage:

    python codex.py --language {javascript, cpp, python, html} --context <path> --temperature=0.1

Default language is javascript, as its the one i played the most with for its quick and easy
visual setup with simple html.

Context flag allows specifying an input file which is loaded and passed as a starting point for
the completion.

The script works in infinite loop, every iteration expects user to type in a prompt in english,
which will be appended to the existing context in a form of source code comment. After user
confirms the prompt by pressing enter button, the context is formatted properly depending on the
selected language, and the request is made to the OpenAI Codex API for a completion sequence.

After receiving the response, the completion is appended to the context and the source view is
updated. If the completion is too short due to the max_tokens limit (currently hardcoded to
64 tokens based on the value from the openai playground), user can pass empty string as a next
prompt (by just pressing enter without typing anything in) to repeat the request to get more
tokens.

There may be more token / bandwidth-friendly approach to code completion, which i may discover
in the future. Any suggestions are welcome as well.

The prompt in the codex.py script also supports some additional commands that begin with a dot
character:

    .exit   // exit from the script
    .save <path> // save current context in the file <path>
    .load <path> // replace current context with the content loaded from <path>
    .erase  // remove last line from the current context
    .help   // print list of available commands
    .       // this is a special command used to repeat last command that was executed.

## Vim plugin

Plugin is currently capable of injecting the completion after the current line into the current buffer.
Completion is triggered by GenerateCodexCompletion command.

Currently hardcoded for javascript completion.
