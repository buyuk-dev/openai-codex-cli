# OpenAI Codex beta test environment

## Content

1. codex.py: interactive script enabling playground-like environment to test Codex completion.
2. vim-codex: vim plugin that enables autocompletion with OpenAI Codex.

I was recently granted access to the beta of OpenAI codex, and decided to setup this repo to
share the scripts and environment I use for playing around with the Codex API.

All tools in this repo require python3 with openai package installed. You can do this with the following command:

    python3 -m pip install openai


## Interactive prompt

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

### Installation steps for vim8 with python3 support:

    mkdir -p ~/.vim/pack/bundle/start
    cd ~/.vim/pack/bundle/start
    git clone git@github.com:buyuk-dev/openai-codex-cli.git


### Usage

You can either call the completion function or add a mapping to the ~/.vimrc file like so:

    // Direct call:
    :call GenerateCodexCompletion()

    // Using command shorthand:
    :GenerateCodexCompletion
    
    // Add to .vimrc to map to Ctrl + Space key combo.
    map <C-@> :GenerateCodexCompletion <CR>
    
Additional commands supported by the plugin:

1. DetermineSourceLanguage()            // Plugin attempts to determine which programming language is used in the current buffer.
2. CheckLanguageSupport("javascript")   // Check if the language is supported by the plugin.
3. let b:codex_lang = "python"          // Variable that can be set to force the use of a specific programming language.
