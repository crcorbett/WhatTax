---
document_type: execution-plan
lifecycle: current
authority: canonical
owner: taxkit-harness-owner
last_reviewed: 2026-07-24
review_trigger: HFI task state, HE mapping, implementation finding, verification result, candidate identity, authority, or lifecycle change
successor: null
tombstone: false
---

# Harness foundation improvements execution plan

This plan implements
[`harness-foundation-improvements.md`](../../product-specs/harness-foundation-improvements.md)
and its
[`sibling task list`](../../product-specs/harness-foundation-improvements.tasks.json)
in strict dependency order. The structured accepted finding owner is
[`accepted-findings.json`](../../documentation-audit/harness-foundation/accepted-findings.json).

Authority permits repository-local reads, writes, verification, and task-scoped
local commits only after the named task gates pass. It stops before push, tag,
versioning, release, publication, deployment, provider access, recovery,
destructive operations, website design, public MDX, navigation, or public-copy
changes.

## Progress

- **HFI-001 — complete:** the TaxKit profile, audit scope, exact `HE-001`
  through `HE-004` register, accepted crosswalk, templates, local Schemas, and
  focused decode proof passed the task and root gates. The bounded acceptance
  record is
  [`HFI-001-validation.json`](../../documentation-audit/harness-foundation/HFI-001-validation.json).
- **HFI-002 — pending on HFI-001:** migrate the six complete canonical skill
  trees, two profiles, declared extras, receipt, references, and Claude links.
- **HFI-003 — pending on HFI-001 and HFI-002:** enforce the final repository
  state through one focused Effect-native gate in normal verification.
- **HFI-004 — pending on HFI-003:** freeze the candidate, run the five retained
  journeys, obtain fresh independent review, and qualify one new epoch.
- **HFI-005 — pending on HFI-004:** reconcile semantic owners and move this plan
  to completed history.

## HFI-001 acceptance record

- Bounded outcome: replace the prose-only handoff with schema-valid repository
  owners before any dependent correction.
- Current owner: `taxkit-harness-owner`.
- Required evidence: profile, scope, findings, accepted crosswalk, templates,
  Effect Schema decoding, missing-mapping rejection, docs/path/skill checks,
  root verification, diff check, and no-Changeset decision.
- Recovery: correct the owning record/Schema or revert only HFI-001 paths; do
  not begin the skill migration while a finding mapping is invalid.
- No-Changeset: HFI-001 changes repository planning/governance records and
  local validation source only; package installation, exports, public API,
  runtime behavior, and public documentation are unchanged.

## Preserved boundaries

HGI-203 through HGI-205 release proof, four runbooks, authority model, controls,
and CI graph remain unchanged. HGI-206 remains the previous target-specific
epoch and cannot qualify the 24 July skill changes. `docs-writer` remains
public-copy-only; no public copy is authored in this plan.
