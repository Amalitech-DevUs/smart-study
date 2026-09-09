"""
merge_questions.py

Merges a batch of newly transcribed questions into the master seed/questions.json
file. Run this from inside content-database/ (same folder as seed/).

Usage (PowerShell):
    python seed/merge_questions.py seed/english_2021_p1.json

This appends the new batch onto the existing array in seed/questions.json and
writes it back. It does NOT deduplicate or validate against the DB — that's
handled by import_questions.py, which is idempotent and safe to re-run.
"""

import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) != 2:
        print("Usage: python seed/merge_questions.py <path_to_new_batch.json>")
        sys.exit(1)

    new_batch_path = Path(sys.argv[1])
    master_path = Path("seed/questions.json")

    if not master_path.exists():
        print(f"ERROR: {master_path} not found. Run this from content-database/.")
        sys.exit(1)
    if not new_batch_path.exists():
        print(f"ERROR: {new_batch_path} not found.")
        sys.exit(1)

    with master_path.open(encoding="utf-8") as f:
        existing = json.load(f)
    with new_batch_path.open(encoding="utf-8") as f:
        new_batch = json.load(f)

    if not isinstance(existing, list) or not isinstance(new_batch, list):
        print("ERROR: both files must contain a JSON array.")
        sys.exit(1)

    before = len(existing)
    combined = existing + new_batch

    with master_path.open("w", encoding="utf-8") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)

    print(f"Merged {len(new_batch)} new questions into {master_path}")
    print(f"Total questions: {before} -> {len(combined)}")


if __name__ == "__main__":
    main()
