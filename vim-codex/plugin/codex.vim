" Plugin code based on the following blog post:
" http://candidtim.github.io/vim/2017/08/11/write-vim-plugin-in-python.html

let s:plugin_root_dir = fnamemodify(resolve(expand('<sfile>:p')), ':h')

python3 << EOF

import sys
from os.path import normpath, join
import vim

plugin_root_dir = vim.eval("s:plugin_root_dir")
python_root_dir = normpath(join(plugin_root_dir, "..", ".."))
sys.path.insert(0, python_root_dir)

import codex

def check_language_support(lang):
    print( codex.languages.is_language_supported(lang) )

def get_syntax_language():
    return "javascript"

def generate_codex_completion():
    row, col = vim.current.window.cursor
    context = vim.current.buffer[:row]
    completion = codex.codex("\n".join(context), None, language=get_syntax_language(), concat=False)
    vim.current.buffer.append(completion, row)
EOF

function! CheckLanguageSupport(lang)
    python3 check_language_support(vim.eval("a:lang"))
endfunction


function! GenerateCodexCompletion()
    python3 generate_codex_completion()
endfunction


command! -nargs=1 CheckLanguageSupport call CheckLanguageSupport(<f-args>)
command! -nargs=0 GenerateCodexCompletion call GenerateCodexCompletion(<f-args>)
