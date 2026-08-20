---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-execution-plan-owner
last_reviewed: 2026-08-20
review_trigger: APT task, workflow, environment, reviewer, policy, proof, rollback, or successor change
successor: ../../product-specs/automatic-preview-teardown-admission.md
tombstone: false
---

# Automatic Preview Teardown Admission Execution Plan

Spec: [Automatic Preview Teardown Admission](../../product-specs/automatic-preview-teardown-admission.md)

Task list:
[`automatic-preview-teardown-admission.tasks.json`](../../product-specs/automatic-preview-teardown-admission.tasks.json)

## APT-001 — in progress

The teardown workflow and current automation owners now share
`taxkit-docs-preview`. Focused policy proof passed before the required reviewer
was removed. The live readback then found zero Preview protection rules, the
same two Cloudflare secret names and the unchanged Production reviewer. The
bounded receipt is
[`APT-001-github-environment-readback.json`](../../documentation-audit/automatic-preview-teardown/APT-001-github-environment-readback.json).

PR #59 merged as `6535b2840c8eeea4bc462fdf317304f03d9aa144` and
main Quality passed. Teardown run `32364848093` started without approval, then
stopped before dry-run or destroy because Turbo status text surrounded the
inventory JSON consumed by `jq`. Its sanitized preflight showed no `pr-59`
stage or Worker, but it is not an accepted no-op receipt. Reconciliation run
`32364954781` retained a bounded failure receipt and exposed a separate
success-promotion condition bug. The failure evidence is
[`APT-002-first-automatic-run-failure.json`](../../documentation-audit/automatic-preview-teardown/APT-002-first-automatic-run-failure.json).

The current corrective slice keeps the inventory command behind Turbo, writes
machine JSON directly from the Effect runtime to the named temporary report,
and limits positive reconciliation to successful source runs. Merge that slice,
then dispatch reviewed `main` for closed same-repository PR #59. Require the
formal no-op and successful reconciliation receipts before environment
retirement.

Do not change Production, Cloudflare credentials, Alchemy resources or manual
recovery. Keep the old teardown environment until the corrected run is
accepted. Then delete the unused environment and close the SPEC.

No Changeset is required because the slice changes repository deployment
policy and GitHub environment settings only.
