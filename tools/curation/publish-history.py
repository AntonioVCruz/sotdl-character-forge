"""Preflight a reviewed history plan; changing GitHub requires --apply and its exact SHA256."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path


def output(*args, cwd=None):
    return subprocess.check_output(args, cwd=cwd)


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def remote_refs(url):
    return {ref: sha for sha, ref in (line.split() for line in output(
        "git", "ls-remote", "--heads", "--tags", url).decode().splitlines())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--approval", help="SHA256 of the reviewed plan; required with --apply")
    args = parser.parse_args()
    plan_path = args.plan.resolve()
    base = plan_path.parent
    plan_bytes = plan_path.read_bytes()
    digest = hashlib.sha256(plan_bytes).hexdigest()
    plan = json.loads(plan_bytes)
    repo = "AntonioVCruz/sotdl-character-forge"
    url = "https://github.com/" + repo + ".git"
    if plan["repository"] != repo or plan["remote"] != url:
        raise SystemExit("Unexpected repository")
    if args.apply and args.approval != digest:
        raise SystemExit("--apply requires the exact reviewed plan SHA256")
    filtered = base / "filtered.git"
    expected = {row["ref"]: row["old"] for row in plan["updates"]}
    if len(expected) != len(plan["updates"]) or remote_refs(url) != expected:
        raise SystemExit("Remote refs changed; repeat inventory and obtain a new reviewed plan")
    backup = dict(line.split(" ", 1)[::-1] for line in output(
        "git", "-C", str(base / "original.git"), "for-each-ref", "refs/heads/", "--format=%(objectname) %(refname)").decode().splitlines())
    if backup != expected:
        raise SystemExit("Original backup does not match the reviewed refs")
    if not all(isinstance(value, int) and value > 0 for value in plan["invalidateNpmCaches"]):
        raise SystemExit("Invalid cache IDs")
    subprocess.run([sys.executable, str(Path(__file__).with_name("history-audit.py")), str(filtered),
                    "--private-secrets", str(base / "secrets.private.json"), "--require-clean"],
                   stdout=subprocess.PIPE, check=True)
    for name, digest_key in [("protection-before.json", "protectionSnapshotSha256"),
                             ("protection-enable-force.json", "enableBodySha256"),
                             ("protection-restore.json", "restoreBodySha256")]:
        value = json.loads((base / name).read_text(encoding="utf-8"))
        if hashlib.sha256(canonical(value)).hexdigest() != plan[digest_key]:
            raise SystemExit("Protection plan changed")
    endpoint = f"repos/{repo}/branches/main/protection"
    current = json.loads(output("gh", "api", endpoint))
    if hashlib.sha256(canonical(current)).hexdigest() != plan["protectionSnapshotSha256"]:
        raise SystemExit("Branch protection changed; repeat review")
    push = ["git", "push", "--atomic"]
    for row in plan["updates"]:
        if not row["ref"].startswith("refs/heads/") or not all(re.fullmatch(r"[a-f0-9]{40}", row[k]) for k in ("old", "new")):
            raise SystemExit("Invalid ref update")
        subprocess.run(["git", "check-ref-format", row["ref"]], check=True)
        subprocess.run(["git", "cat-file", "-e", row["new"] + "^{commit}"], cwd=filtered, check=True)
        push.append(f'--force-with-lease={row["ref"]}:{row["old"]}')
    push.append(url)
    push.extend(f'{row["new"]}:{row["ref"]}' for row in plan["updates"])
    if not args.apply:
        subprocess.run(push[:3] + ["--dry-run"] + push[3:], cwd=filtered, check=True)
        print(json.dumps({"preflight": "passed", "branches": len(expected), "planSha256": digest,
                          "remoteModified": False, "protectionModified": False}))
        return
    # The plan is already validated. Always restore the original protections,
    # including when enabling force-push or the atomic update fails.
    try:
        output("gh", "api", "--method", "PUT", endpoint, "--input", str(base / "protection-enable-force.json"))
        subprocess.run(push, cwd=filtered, check=True)
    finally:
        output("gh", "api", "--method", "PUT", endpoint, "--input", str(base / "protection-restore.json"))
    if remote_refs(url) != {row["ref"]: row["new"] for row in plan["updates"]}:
        raise SystemExit("Post-publication refs differ; investigate before local migration")
    restored = json.loads(output("gh", "api", endpoint))
    if restored["allow_force_pushes"]["enabled"]:
        raise SystemExit("CRITICAL: force-push is still enabled")
    if hashlib.sha256(canonical(restored)).hexdigest() != plan["protectionSnapshotSha256"]:
        raise SystemExit("CRITICAL: protections differ from the original snapshot")
    for cache_id in plan["invalidateNpmCaches"]:
        if not isinstance(cache_id, int) or cache_id <= 0:
            raise SystemExit("Invalid cache ID")
        result = subprocess.run(["gh", "api", "--method", "DELETE", f"repos/{repo}/actions/caches/{cache_id}"], capture_output=True)
        if result.returncode and b"404" not in result.stderr:
            raise SystemExit("Cache invalidation failed; record remaining IDs")
    receipt = {"published": True, "planSha256": digest, "refs": remote_refs(url),
               "forcePushEnabled": restored["allow_force_pushes"]["enabled"],
               "localWorkspaceMigrated": False, "githubSupportPurgeCompleted": False}
    (base / "publication-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt))


if __name__ == "__main__":
    main()
