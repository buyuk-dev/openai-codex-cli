let s:plugin_root_dir = fnamemodify(resolve(expand('<sfile>:p')), ':h')

python3 << EOF

import sys
from os.path import normpath, join
import vim

plugin_root_dir = vim.eval("s:plugin_root_dir")
python_root_dir = normpath(join(plugin_root_dir, "..", ".."))

sys.path.insert(0, python_root_dir)


# Import pyhthon module that implements desired plugin's functionality.
import codex
def check_js_support():
    print( codex.languages.is_language_supported("javascript") )

EOF

function! CheckLanguageSupport()
    python3 check_js_support()
endfunction
