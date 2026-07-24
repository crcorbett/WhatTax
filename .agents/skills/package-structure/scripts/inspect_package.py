#!/usr/bin/env python3
"""Print a compact package contract inventory."""

from __future__ import annotations

import json
import sys
from pathlib import Path


root = Path(sys.argv[1]).resolve(strict=True)
manifest = json.loads((root / "package.json").read_text())
print(json.dumps({
    "path": str(root),
    "name": manifest.get("name"),
    "scripts": manifest.get("scripts", {}),
    "exports": manifest.get("exports", {}),
    "sourceFiles": sorted(str(path.relative_to(root)) for path in (root / "src").rglob("*.ts")),
}, indent=2))
