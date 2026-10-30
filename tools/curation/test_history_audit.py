import json
import subprocess
import tempfile
import unittest
from pathlib import Path

import importlib.util
spec = importlib.util.spec_from_file_location('history_audit', Path(__file__).with_name('history-audit.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
audit, contains_purchase = module.audit, module.contains_purchase


class HistoryAuditTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="sotdl-history-audit-")
        self.root = Path(self.directory.name)
        self.run_git("init", "--quiet")
        self.run_git("config", "user.name", "History Audit Fixture")
        self.run_git("config", "user.email", "fixture@example.invalid")

    def tearDown(self):
        self.directory.cleanup()

    def run_git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.root), *args], stderr=subprocess.PIPE)

    def commit(self, message="fixture"):
        self.run_git("add", "--all")
        self.run_git("commit", "--quiet", "-m", message)

    def test_history_is_checked_even_when_tip_is_clean(self):
        private = self.root / "curation/entries/book/rule.jsonl"
        private.parent.mkdir(parents=True)
        marker = "Synthetic Buyer (order #" + "2468" + "1357" + ")"
        private.write_text(json.dumps({"snippet": marker}), encoding="utf-8")
        self.commit()
        private.unlink()
        (self.root / "README.md").write_text("Safe fixture", encoding="utf-8")
        self.commit()
        report = audit(self.root)
        self.assertFalse(report["clean"])
        self.assertIn("curation/entries/book/rule.jsonl", report["protectedPaths"])
        self.assertEqual(len(report["sensitiveObjects"]), 1)
        self.assertNotIn(marker, json.dumps(report))

    def test_decoded_json_and_commit_messages_are_checked(self):
        digits = "2468" + "1357"
        text = '{"snippet":"\\u0028order #' + digits + '\\u0029"}'
        self.assertTrue(contains_purchase(text))
        (self.root / "fixture.json").write_text(text, encoding="utf-8")
        self.commit("metadata (order #" + digits + ")")
        report = audit(self.root)
        self.assertEqual({hit["type"] for hit in report["sensitiveObjects"]}, {"blob", "commit"})
        self.assertNotIn(digits, json.dumps(report))

    def test_clean_refs_pass_and_known_literals_are_not_emitted(self):
        (self.root / "README.md").write_text("Synthetic private token", encoding="utf-8")
        self.commit()
        self.run_git("branch", "another-ref")
        self.assertTrue(audit(self.root)["clean"])
        report = audit(self.root, ["Synthetic private token"])
        self.assertFalse(report["clean"])
        self.assertEqual(len(report["refs"]), 2)
        self.assertNotIn("Synthetic private token", json.dumps(report))


if __name__ == "__main__":
    unittest.main()
