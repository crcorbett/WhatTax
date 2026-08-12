---
document_type: execution-plan
lifecycle: active
authority: supporting
owner: taxkit-execution-owner
last_reviewed: 2026-08-13
review_trigger: APP-IAC task state, finding, implementation evidence, gate, exception, or candidate change
successor: ../../product-specs/strict-apps-and-iac.md
tombstone: false
---

# Strict apps and IaC execution plan

This active plan implements
[`strict-apps-and-iac.md`](../../product-specs/strict-apps-and-iac.md) and its
[`sibling task list`](../../product-specs/strict-apps-and-iac.tasks.json). The
accepted audit crosswalk is
[`accepted-findings.json`](../../documentation-audit/strict-apps-iac/accepted-findings.json).

The governing goal is active. Repository-local implementation and
passing-gated commits are authorized. External deployment, provider mutation,
DNS, package publication, versioning, tags and releases remain outside scope.

## Progress

- **APP-IAC-001 — complete:** five workflow verifiers now use Schema-owned
  Config, a shared Effect FileSystem/Crypto/JSON boundary, closed tagged
  errors, Console and exact Bun runtime entrypoints. The decoder allowlist
  contracted from five executables to one boundary; 50 deployment tests,
  focused types/lint/format/docs checks and root verification pass. Evidence:
  [`APP-IAC-001-validation.json`](../../documentation-audit/strict-apps-iac/APP-IAC-001-validation.json).
- **APP-IAC-002 — active:** correct inventory credential, Config, process,
  decoding and semantic collection ownership while preserving report-only
  behavior.
- **APP-IAC-003 — pending:** move docs runtime proof identity and state behind
  application-owned Effect composition and prove lifetime deterministically.
- **APP-IAC-004 — pending:** add the smallest focused recurrence-prevention
  control and adversarial fixtures earned by the three root corrections.
- **APP-IAC-005 — pending:** perform the fresh terminal audit, run all gates,
  record bounded residuals, and close lifecycle owners together.

## Execution rules

For each slice:

1. Confirm exact installed beta.100 or beta.64 API source before using it.
2. Correct the earliest semantic owner without compatibility wrappers or
   helper sprawl.
3. Update task, owner docs, impact ledger and bounded validation evidence in
   the same slice.
4. Run focused types/tests, docs/runbook gates where affected, root
   verification and `git diff --check`.
5. Record a Changeset only for package-facing behavior; otherwise record the
   no-Changeset basis.
6. Commit only a coherent passing slice. Do not push or cross an external
   boundary under this plan.

## Preserved boundaries

The root Alchemy resource graph, package versions, completed deployment proof,
deployment operations, docs content/Fumadocs ownership, public docs behavior
and provider state remain unchanged unless direct implementation evidence
shows that the accepted SPEC cannot be satisfied without a separately admitted
decision.
