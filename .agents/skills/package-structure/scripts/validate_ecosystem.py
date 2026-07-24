#!/usr/bin/env python3
"""Run a scoped stale-pattern scan over implementation examples."""

from __future__ import annotations

import re
import sys
from pathlib import Path


root = Path(sys.argv[1]).resolve(strict=True)
patterns = {
    "generic client callback": re.compile(r"readonly\s+(use|withClient)\s*[:(]"),
    "raw identifier primitive": re.compile(r"\bid\s*:\s*string\b"),
    "runtime class policy": re.compile(r"\binstanceof\b"),
    "legacy service tag": re.compile(r"Context\.Tag\b"),
    "legacy package builder": re.compile(r"\btsdown\b"),
}
failures: list[str] = []
for path in root.rglob("*"):
    if not path.is_file() or path.suffix not in {".ts", ".tsx"}:
        continue
    if any(part in {"node_modules", "dist", ".git", "negative-fixtures", "vendor"} for part in path.parts):
        continue
    if path.parts[-3:] == ("tools", "oxlint", "policy.test.ts") or path.parts[-3:] == ("tools", "oxlint", "policy.ts"):
        continue
    text = path.read_text(errors="ignore")
    for label, pattern in patterns.items():
        if pattern.search(text):
            failures.append(f"{path}: {label}")
if failures:
    print("\n".join(failures), file=sys.stderr)
    raise SystemExit(1)
print(f"ecosystem scan passed: {root}")
