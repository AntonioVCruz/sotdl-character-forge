"""Read-only Git history audit. Emit hashes, paths and counts, never matched values."""
import argparse
import json
import re
import subprocess
from pathlib import Path

LOCAL_ROOTS = tuple("curation/" + name + "/" for name in (
    "entries", "segments", "normalized", "normalization", "corrections", "history", "pilot", "reports"))
PURCHASE = re.compile(r"\((?:order\s*)?#\d{4,}\)", re.IGNORECASE)


def git(repo, *args, data=None):
    return subprocess.check_output(["git", "-C", str(repo), *args], input=data)


def contains_purchase(text):
    if PURCHASE.search(text):
        return True
    # JSON may escape punctuation and digits. Inspect decoded strings as well.
    def visit(value):
        if isinstance(value, str):
            return bool(PURCHASE.search(value))
        if isinstance(value, dict):
            return any(visit(v) for v in value.values())
        if isinstance(value, list):
            return any(visit(v) for v in value)
        return False
    try:
        return visit(json.loads(text))
    except (ValueError, RecursionError):
        return any(contains_purchase(line) for line in text.splitlines()) if "\n" in text and all(
            line.startswith("{") for line in text.splitlines() if line.strip()) else False


def audit(repo, secrets=()):
    refs = [dict(zip(("ref", "sha"), line.split(" ", 1))) for line in git(
        repo, "for-each-ref", "--format=%(refname) %(objectname)").decode().splitlines()]
    commits = git(repo, "rev-list", "--all").decode().splitlines()
    paths = set()
    for commit in commits:
        for record in git(repo, "ls-tree", "-rz", commit).split(b"\0"):
            if not record:
                continue
            path = record.split(b"\t", 1)[1].decode("utf-8", "surrogateescape")
            if path.startswith(("rules/", *LOCAL_ROOTS)):
                paths.add(path)
    reachable = git(repo, "rev-list", "--objects", "--all", "--no-object-names").splitlines()
    objects = git(repo, "cat-file", "--batch-check", data=b"\n".join(reachable) + b"\n").decode().splitlines()
    candidates = [line.split()[0] for line in objects if line.split()[1] in ("blob", "commit", "tag")]
    process = subprocess.Popen(["git", "-C", str(repo), "cat-file", "--batch"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    hits = []
    blob_count = 0
    try:
        for oid in candidates:
            process.stdin.write((oid + "\n").encode()); process.stdin.flush()
            header = process.stdout.readline().decode().split()
            size = int(header[2]); content = process.stdout.read(size)
            if len(content) != size or process.stdout.read(1) != b"\n":
                raise RuntimeError("Invalid Git batch framing")
            blob_count += header[1] == "blob"
            text = content.decode("utf-8", "replace")
            marker = contains_purchase(text)
            known = any(value in text for value in secrets)
            if marker or known:
                hits.append({"oid": oid, "type": header[1], "buyerPattern": marker, "knownValue": known})
    finally:
        process.stdin.close(); process.stdout.close()
        if process.wait() != 0:
            raise RuntimeError("Git object audit failed")
    return {"refs": refs, "commits": len(commits), "reachableObjects": len(reachable),
            "blobsScanned": blob_count, "protectedPaths": sorted(paths), "sensitiveObjects": hits,
            "clean": not paths and not hits}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repository", type=Path)
    parser.add_argument("--private-secrets", type=Path, help="Private JSON array; contents never printed")
    parser.add_argument("--require-clean", action="store_true")
    parser.add_argument("--output", type=Path, help="Write UTF-8 JSON report and print only counts")
    args = parser.parse_args()
    secrets = json.loads(args.private_secrets.read_text(encoding="utf-8")) if args.private_secrets else []
    result = audit(args.repository.resolve(), secrets)
    report = json.dumps(result, ensure_ascii=True, indent=2) + "\n"
    if args.output:
        args.output.write_text(report, encoding="utf-8")
        print(json.dumps({k: len(v) if isinstance(v, list) else v for k, v in result.items()}))
    else:
        print(report, end="")
    if args.require_clean and not result["clean"]:
        raise SystemExit(1)
