" Plugin code based on the following blog post:
" http://candidtim.github.io/vim/2017/08/11/write-vim-plugin-in-python.html

let s:plugin_root_dir = fnamemodify(resolve(expand('<sfile>:p')), ':h')
let b:codex_lang = 'none'

python3 << EOF

import sys
from os.path import normpath, join
import vim

plugin_root_dir = vim.eval("s:plugin_root_dir")
python_root_dir = normpath(join(plugin_root_dir, "..", ".."))
sys.path.insert(0, python_root_dir)

import codex

def get_codex_language_option():
    return vim.eval("b:codex_lang")

def check_language_support(lang):
    return codex.languages.is_language_supported(lang)

def get_current_filename():
    return vim.eval("expand('%:t')")

def get_current_file_extension():
    return vim.eval("expand('%:e')")

def get_language_from_extension():
    filename = get_current_filename()
    extension = get_current_file_extension()
    ext2lang = {
        "js": "javascript",
        "cpp": "cpp",
        "cxx": "cxx",
        "py": "python",
        "html": "html",
        "h": "cpp",
        "hpp": "cpp",
        "vim": "vim",
    }
    if extension in ext2lang:
        return ext2lang[extension]


def determine_source_language():
    """ Attempts to determine the programming language used in current buffer.
    """
    lang = get_codex_language_option()
    if lang == "none":
        lang = get_language_from_extension()
        vim.command(f"let b:codex_lang='{lang}'")
    return lang


def generate_codex_completion():
    """ Request Codex completion, using current buffer lines
        0 up to and including current cursor position.

        After completion is injected into the buffer,
        move to the first line after the completed sequence.
    """
    lang = determine_source_language()
    if lang is None or not codex.languages.is_language_supported(lang):
        print(f"Error: language {lang} is not supported.")
        return

    row, col = vim.current.window.cursor
    context = vim.current.buffer[:row]
    completion = codex.codex("\n".join(context), None, language=lang, concat=False)

    vim.current.buffer[row-1] = context[-1] + completion[0]
    vim.current.buffer.append(completion[1:], row)
    vim.current.window.cursor = row + len(completion), len(completion[-1])

EOF


function! DetermineSourceLanguage()
    python3 print(determine_source_language())
endfunction

function! CheckLanguageSupport(lang)
    python3 print(check_language_support(vim.eval("a:lang")))
endfunction

function! GenerateCodexCompletion()
    python3 generate_codex_completion()
endfunction


command! -nargs=1 CheckLanguageSupport call CheckLanguageSupport(<f-args>)
command! -nargs=0 GenerateCodexCompletion call GenerateCodexCompletion(<f-args>)
command! -nargs=0 DetermineSourceLanguage call DetermineSourceLanguage(<f-args>)
