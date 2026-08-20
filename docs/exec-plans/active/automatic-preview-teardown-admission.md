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

Do not change Production, Cloudflare credentials, Alchemy resources or manual
recovery. Keep the old teardown environment while the default branch still
references it. After merge, require one fresh automatic PR-close absence or
no-op receipt before deleting the unused environment and closing the SPEC.

No Changeset is required because the slice changes repository deployment
policy and GitHub environment settings only.
