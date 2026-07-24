---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-07-24
review_trigger: HFI task state, HE mapping, implementation finding, verification result, candidate identity, authority, or lifecycle change
successor: ../../product-specs/harness-foundation-improvements.md
tombstone: false
---

# Harness foundation improvements execution plan

This completed plan implemented
[`harness-foundation-improvements.md`](../../product-specs/harness-foundation-improvements.md)
and its
[`sibling task list`](../../product-specs/harness-foundation-improvements.tasks.json)
in strict dependency order. The structured accepted finding owner is
[`accepted-findings.json`](../../documentation-audit/harness-foundation/accepted-findings.json).

Authority permitted repository-local reads, writes, verification, and
task-scoped local commits only after the named task gates passed. Work stopped
before push, tag, versioning, release, publication, deployment, provider
access, recovery, destructive operations, website design, public MDX,
navigation, or public-copy changes.

## Progress

- **HFI-001 — complete:** the TaxKit profile, audit scope, exact `HE-001`
  through `HE-004` register, accepted crosswalk, templates, local Schemas, and
  focused decode proof passed the task and root gates. The bounded acceptance
  record is
  [`HFI-001-validation.json`](../../documentation-audit/harness-foundation/HFI-001-validation.json).
- **HFI-002 — complete:** six canonical trees, two profiles, two unchanged
  declared extras, the content-addressed receipt, all references, and eight
  relative Claude links passed focused and root verification. The accepted
  Oxfmt exclusion prevents repository formatting from invalidating the
  canonical digest. Evidence:
  [`HFI-002-validation.json`](../../documentation-audit/harness-foundation/HFI-002-validation.json).
- **HFI-003 — complete after independent-review correction:** the Effect-native gate decodes repository-local
  owners once at ingress, accepts the migrated profile/audit/skill state, and
  rejects all nine named adversarial defects. Root verification invokes it
  exactly once; the unchanged Quality workflow inherits it through the
  existing release graph. The first post-commit path check exposed and then
  corrected two literal private-looking adversarial fixture values before a
  new HFI-004 candidate was frozen. Independent clean-clone review then exposed
  host-specific non-executable modes in the initial tree receipt; the
  enforceable receipt now normalizes regular files to Git-portable `0644` or
  `0755` semantics. Adversarial review of the corrected candidate then exposed
  that Git uses the owner-execute bit specifically: `0654` must remain
  non-executable while `0744` is executable. That candidate is retained as
  rejected, and the corrected normalizer plus focused proof must pass before
  another candidate can be frozen. Fresh HFI-004 review then proved the gate
  did not reject the exact volatile profile lifecycle/owner shape that
  invalidated the previous candidate. The corrected gate now enforces the
  maintained lifecycle and stable index owners and rejects the exact volatile
  shape. Evidence:
  [`HFI-003-validation.json`](../../documentation-audit/harness-foundation/HFI-003-validation.json).
- **HFI-004 — complete:** candidate `03716bf` passed the five retained journeys
  and fresh independent review, then HFI-005 proved its profile still named
  volatile active SPEC/plan lifecycle paths. That accepted evidence is retained
  but invalidated; the stable-profile successor must rerun every candidate-bound
  gate, journey and review. Fresh successor review found and corrected a
  post-candidate evaluator boundary that still prohibited the two required
  epoch/effectiveness semantic-owner changes. The same review then rejected
  successor `f12c324` because normal governance accepted the old volatile
  lifecycle shape. Both candidate identities are retained; neither can be
  promoted. Candidate `7c8a96e` contains the committed fail-closed correction
  and passed every focused/full gate, all five fresh journeys, exact epoch
  validation, and fresh independent acceptance with no unresolved findings.
  Evidence:
  [`epoch-validation.json`](../../documentation-audit/harness-foundation/epoch-validation.json).
- **HFI-005 — complete:** the accepted epoch/effectiveness and maintainer
  routes, HE crosswalk, implemented SPEC/tasks, product-spec inventory, and
  historical plan indexes agree. Final bounded evidence is
  [`closeout-validation.json`](../../documentation-audit/harness-foundation/closeout-validation.json).

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
