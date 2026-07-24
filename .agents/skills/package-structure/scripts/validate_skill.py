#!/usr/bin/env python3
"""Validate skill metadata and direct local references."""

from __future__ import annotations

import re
from pathlib import Path


root = Path(__file__).resolve().parent.parent
personal_root = "/" + "Users" + "/"
skill = (root / "SKILL.md").read_text()
metadata = (root / "agents/openai.yaml").read_text()
assert "$package-structure" in metadata
for path in root.rglob("*"):
    if path.is_file() and path.suffix in {".md", ".py", ".yaml", ".tmpl"}:
        assert personal_root not in path.read_text(errors="ignore"), path
for match in re.finditer(r"\]\((references/[^)]+)\)", skill):
    assert (root / match.group(1)).is_file(), match.group(1)
for forbidden in ("README.md", "CHANGELOG.md", "INSTALL.md"):
    assert not (root / forbidden).exists(), forbidden
print(f"validated metadata and references: {root}")
