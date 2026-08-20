---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: Preview environment, required reviewer, teardown workflow, Alchemy stage, credential, provider readback, or hosted proof change
successor: null
tombstone: false
status: implemented
source_of_truth: docs
confidence: high
---

# Automatic Preview Teardown Admission

## Implemented outcome

TaxKit now lets a trusted same-repository PR-close event clean up its exact
Alchemy Preview stage without a second human approval. Preview deploy and
teardown share `taxkit-docs-preview`, which already holds the required
narrow Cloudflare secret names. Production remains separately protected.

Alchemy recommends automatic `alchemy destroy --stage pr-N --yes` on PR close
and isolates each stage's state and physical resources. TaxKit keeps stronger
repository checks around that command: reviewed default-branch code, exact
stage decoding, a shared non-cancellable lock, two equal dry-runs, a closed
resource allow-list and independent state/provider/URL absence proof.

Task plan:
[automatic-preview-teardown-admission.tasks.json](./automatic-preview-teardown-admission.tasks.json)

## Problem and evidence

Before this slice, both `taxkit-docs-preview` and
`taxkit-docs-preview-teardown` required the same reviewer. GitHub blocked the
whole job before source, stage, inventory or plan checks, so the reviewer could
not inspect the deletion plan. The Preview environment contains exactly
`CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN`; the teardown workflow needs those same secret names.
The separate environment and blind approval add feedback delay without adding
Alchemy stage isolation.

The accepted settings mutation removed the Preview reviewer and read back zero
protection rules with the same two secret names. Production still requires
`crcorbett`. Corrected automatic teardown run `32367035323` and receipt
reconciliation run `32367125582` passed for exact stage `pr-60`, after which
the unused teardown environment was removed. The bounded settings receipt is
[`APT-001-github-environment-readback.json`](../documentation-audit/automatic-preview-teardown/APT-001-github-environment-readback.json).

## Call graphs

```text
Former PR-close cleanup
  -> taxkit-docs-preview-teardown reviewer approval
  -> reviewed main source and exact closed PR checks
  -> Alchemy exact pr-N inventory and two equal dry-runs
  -> allowed destroy or proved no-op
  -> state, provider and former-URL absence receipt
```

```text
Merged PR-close cleanup
  -> trusted same-repository PR closes against main
  -> taxkit-docs-preview releases its narrow credential without a reviewer
  -> reviewed main source and exact closed PR checks
  -> Alchemy exact pr-N inventory and two equal dry-runs
  -> allowed destroy or proved no-op
  -> state, provider and former-URL absence receipt
```

## First automatic run and correction

PR #59 merged as `6535b2840c8eeea4bc462fdf317304f03d9aa144`.
Main Quality passed and teardown run `32364848093` started without approval,
which proves the new admission path. It stopped before dry-run or destroy: the
Turbo-routed inventory command produced valid JSON plus Turbo status text on
standard output, and `jq` rejected the mixed file. The retained sanitized
inventory showed state/provider agreement and no `pr-59` stage or Worker, but
the failed run cannot establish the required no-op receipt.

The focused correction keeps every command behind Turbo while the Effect
inventory runtime writes machine JSON directly to a named temporary file. It
also stops the completed-run reconciler from entering positive promotion for a
failed source run. The bounded failure receipt is
[`APT-002-first-automatic-run-failure.json`](../documentation-audit/automatic-preview-teardown/APT-002-first-automatic-run-failure.json).

PR #60 merged the correction as
`34b065b6bbab695234628dffb7925d59fb6eaaee`. Its pull-request and main
Quality runs passed. Automatic teardown run `32367035323` started without
approval, produced two equal no-op plans for exact stage `pr-60`, and proved
that both the Alchemy state stage and Cloudflare Worker were absent. Separate
reconciliation run `32367125582` validated the completed run and promoted the
receipt. The old environment was then removed; a repository environment-list
readback retained only report-only, Preview and Production. The terminal
receipt is
[`APT-003-automatic-noop-and-retirement.json`](../documentation-audit/automatic-preview-teardown/APT-003-automatic-noop-and-retirement.json).

## Scope and boundaries

In scope:

- bind `.github/workflows/docs-preview-teardown.yml` to
  `taxkit-docs-preview`;
- remove the required reviewer from `taxkit-docs-preview` and retain names-only
  secret readback;
- update current automation policy, register, tests and durable owners;
- establish teardown external proof only from a fresh default-branch PR-close
  receipt proving the new environment identity; and
- remove the unused `taxkit-docs-preview-teardown` environment only after the
  workflow change reaches `main`, no default-branch workflow references it,
  and the corrected no-op and reconciliation receipts pass.

Out of scope:

- a manual-recovery environment or new manual procedure;
- Production approval, credentials or workflow changes;
- changes to Alchemy resources, stage naming, state or Cloudflare scope;
- running a teardown before the reviewed workflow reaches `main`;
- deployment, DNS, custom-domain, release or publication changes.

## Authority, safety and rollback

Cooper approved this exact automatic-cleanup change on 2026-08-20. The GitHub
setting mutations were limited to removing the `taxkit-docs-preview` reviewer
and, after accepted proof, deleting the unused teardown environment. Secret
values remained unread and unchanged. Production was not changed.

The automatic destroy remains authorised only by the trusted close event plus
the executable source, stage, resource, plan and provider checks. Unknown,
mixed, Production, foreign or state/provider-disagreeing plans stop before
destroy. Rollback restores the Preview required reviewer and the former
workflow environment binding.

## Acceptance and proof

- The Preview environment has no required reviewer and still exposes only the
  two required secret names to its jobs.
- Preview and teardown workflows both reference `taxkit-docs-preview`;
  Production still references `taxkit-docs-production`.
- Policy rejects a return to the separate teardown binding or a changed
  exact-stage safety graph.
- Focused deployment checks and `bun run verification` pass.
- Hosted Quality passes for the candidate branch.
- After merge, same-repository PR-close run `32367035323` started without
  approval and produced an accepted exact-stage no-op receipt before the old
  environment was removed.

The retained run proves exact `pr-60` absence, not deletion of a live Worker or
absence of other Preview stages. It does not establish public availability,
Production mutation, release or publication.

## Impact ledger

| Surface | Decision | Owner and reason |
| --- | --- | --- |
| Workflow and GitHub environment | Change required | `.github/workflows/docs-preview-teardown.yml` and live `taxkit-docs-preview` protection own execution and credential admission. |
| Automation policy, register and tests | Change required | `tools/docs-deployment/` must enforce the shared environment and reopen teardown external proof. |
| Architecture, authority, standards and runbook | Change required | `docs/architecture/deployment.md`, `docs/operations/{authority-model,automation-register}.md`, `docs/standards/controls.md` and `docs/runbooks/docs-deployment.md` own the durable boundary and recovery. |
| SPEC, tasks, plan and dated evidence | Change required | This SPEC, sibling task list, active plan, indexes and `docs/documentation-audit/automatic-preview-teardown/` own current intent and bounded readback. |
| Historical receipts and Schemas | Preserve | Existing schemas and dated evidence must continue decoding the former environment epoch. |
| App, packages, API, SDK and public docs | N/A | No application or consumer contract changes. |
| Skills and agent instructions | N/A | Existing Alchemy, PRD and documentation routes already own the required method. |
| Changeset | N/A | This changes repository workflow policy and GitHub settings, not a package contract. |

## References

- [Alchemy CI](https://alchemy.run/environments/ci/)
- [Alchemy stages](https://alchemy.run/environments/stages/)
- [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [Deployment architecture](../architecture/deployment.md)
- [Docs deployment runbook](../runbooks/docs-deployment.md)
