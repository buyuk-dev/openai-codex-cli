""" This module contains language-specific configurations
    for supported programming languages.
"""


CONFIG = {
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


def is_language_supported(language: str) -> bool:
    """ Check if configuration for the specified programming language is available.
    """
    return language in CONFIG
