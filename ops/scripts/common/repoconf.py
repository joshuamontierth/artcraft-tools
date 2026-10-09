#!/usr/bin/env python3
"""repoconf.py: read ops/config/repos.json for shell scripts (stdlib only, Python 3.8+).

  repoconf.py names [--only a,b]          -> one repo name per line
  repoconf.py get <repo> <field>          -> scalar value, or list values separated by spaces
  repoconf.py args <repo> <field>         -> argument list (one per line) with placeholders expanded:
                                             {port} {token_file} {work_dir}
  repoconf.py workdir <repo> / tokenfile <repo>
On Linux: work_dir = ~/ArtCraft/<Title>, token_file = ~/.local/state/artcraft/tokens/<repo>-control.token
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.normpath(os.path.join(HERE, "..", "..", "config", "repos.json"))


def load():
    with open(CONFIG, "r", encoding="utf-8") as f:
        return json.load(f)["repos"]


def find(name):
    for r in load():
        if r["name"] == name:
            return r
    sys.exit("unknown repo: %s" % name)


def work_dir(r):
    return os.path.join(os.path.expanduser("~"), "ArtCraft", r["title"])


def token_file(r):
    base = os.environ.get("XDG_STATE_HOME") or os.path.join(os.path.expanduser("~"), ".local", "state")
    return os.path.join(base, "artcraft", "tokens", "%s-control.token" % r["name"])


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    cmd = argv[0]
    if cmd == "names":
        only = None
        if len(argv) >= 3 and argv[1] == "--only" and argv[2]:
            only = set(x.strip() for x in argv[2].replace(" ", ",").split(",") if x.strip())
        for r in load():
            if only is None or r["name"] in only:
                print(r["name"])
        return 0
    r = find(argv[1])
    if cmd == "get":
        v = r.get(argv[2])
        if v is None:
            return 0
        print(" ".join(str(x) for x in v) if isinstance(v, list) else ("true" if v is True else "false" if v is False else v))
        return 0
    if cmd == "args":
        v = r.get(argv[2]) or []
        for a in v:
            print(str(a).replace("{port}", str(r.get("control_port"))).replace("{token_file}", token_file(r)).replace("{work_dir}", work_dir(r)))
        return 0
    if cmd == "workdir":
        print(work_dir(r))
        return 0
    if cmd == "tokenfile":
        print(token_file(r))
        return 0
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
