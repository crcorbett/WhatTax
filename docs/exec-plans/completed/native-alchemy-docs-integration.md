---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-08-13
review_trigger: retained NAI evidence, source authority, limitation, or successor correction
successor: ../../product-specs/native-alchemy-docs-integration.md
tombstone: false
---

# Native Alchemy docs integration execution plan

This completed plan implemented the
[`native-alchemy-docs-integration.md`](../../product-specs/native-alchemy-docs-integration.md)
SPEC and its
[`task ledger`](../../product-specs/native-alchemy-docs-integration.tasks.json).

## Completed slices

- **NAI-001 — complete:** exact Alchemy beta.64 source was inspected at
  `31edd3c4b2f0f3310fad07f5423aee20cf72be8d`; the root now owns one
  `Website.Vite` resource.
- **NAI-002 — complete:** `alchemy dev` is authoritative, the standalone
  plugin is guarded by Alchemy's injection signal, and a clean Vite build
  resolves the docs packages from source.
- **NAI-003 — complete:** v2 plan/workflow contracts own one `DocsWebsite`
  resource plus only the bounded retired-build deletion. Historical v1
  receipts remain unchanged, and the current automation entries are
  `not-established` until fresh native-graph provider proof exists.
- **NAI-004 — complete:** the scheduled orphan workflow, root command,
  current automation/control entries, GitHub query, Schemas, services,
  runtime and child-process boundary are removed. PR-close teardown remains
  the cleanup owner.
- **NAI-005 — complete:** clean workerd/browser/screenshot proof, focused
  deployment checks, documentation and runbook gates, lint, both Knip graphs,
  all workspace type tasks and canonical `bun run verification` pass. The
  [terminal audit](../../documentation-audit/native-alchemy-docs-integration/terminal-audit.json)
  records exact evidence and non-claims.

## Retained execution rules

1. Inspect exact installed source before changing a beta Alchemy API.
2. Keep `alchemy.run.ts` a thin deterministic composition root.
3. Update current owners and focused proof in the same slice; never rewrite
   historical receipts to resemble a successor graph.
4. No Changeset was required because the changed app, infrastructure tooling
   and maintainer documentation are private.

## Proof ceiling

Local source, type, test, Vite build, workerd, browser and screenshot evidence
proves the repository candidate and generated local artifact. It does not
establish an Alchemy provider plan, Preview, Production, teardown, current
Cloudflare state or public availability.
