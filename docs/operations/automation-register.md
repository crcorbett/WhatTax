---
document_type: automation-register
lifecycle: current
authority: canonical
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-05
review_trigger: workflow, signal, authority, proof, stopping, escalation, rollback, or retirement change
---

# TaxKit automation registers

The read-only Quality and context-candidate register is
[`tools/quality-workflow/automation-register.json`](../../tools/quality-workflow/automation-register.json).
It is validated by `bun run check:quality-workflow`; each entry has structured
signal and immutable-revision state, a named principal bound to one resource and
environment, per-run proof and nonclaims, fail-closed stop/escalation,
rollback/recovery owners and commands, and successor-gated retirement. The
validator checks those cross-field identities rather than accepting prose by
length or keywords. `externalState.status` remains `not-established` and its
nonclaims must match the proof envelope.

Quality CI is convergent validation of one immutable revision with `contents:
read`; its CI report has no candidate identity or attempt-receipt claim.
Documentation/context freshness is not an unattended editor: it stages an
untrusted report-only candidate outside canonical/default retrieval, excludes
prior candidates and mutable/generated evidence, and requires a named reviewer,
separate publisher, publication status and last-known-good recovery before any
canonical edit.

Neither entry grants release, publication, deployment, provider, credential, or
external-state authority. A green local or hosted result does not establish
that GitHub ran, nor any tag, registry, deployment, provider or public
availability consequence.

The distinct docs deployment owner is
[`tools/docs-deployment/automation-register.json`](../../tools/docs-deployment/automation-register.json).
It is decoded and cross-checked with the deployment-only control register by
`bun run check:docs-deployment-automation`. It admits exactly four desired
classes: trusted Preview delivery, fixed Production delivery, exact-stage
Preview teardown, and report-only orphan inventory. The three mutation records
require separately protected environments, non-cancellable stage locks,
accepted/equal replans, narrow credential identities, provider/state readback,
bounded receipts and fail-closed recovery. Teardown executes reviewed
default-branch code rather than pull-request-head code. Orphan inventory is
cancellable, separately read-only credentialed and unable to delete.

Because GitHub runners are ephemeral, each mutation workflow refreshes the
account-matched Alchemy `cloudflare-state-store` cache with the installed
`alchemy cloudflare bootstrap` command before it reads provider/state
postconditions. The preceding `alchemy login` command persists only the
environment-method selector; the token remains a GitHub environment secret.
That preparation is bounded to the named state-store control plane and is not
available to report-only inventory; no local OAuth profile is copied into CI.

The local operator command `bun run check:docs-deployment-orphans` now proves
the report-only data path against one dated observation. It compared the exact
open PR set with Schema-decoded Alchemy/Worker inventory, found no Preview
stage and therefore no orphan candidate, and retained PR `#1` as an open
trusted PR without a stage. This does not establish the scheduled/manual
GitHub automation class or grant teardown authority.

The four deployment records still intentionally have
`externalState.status: "not-established"`. This is executable desired-state
admission, not a claim that no workflow has run. The current default-branch
epoch retained under
`docs/evidence/deployments/2026-08-05-*` supplies successful Preview,
Production, rollback and teardown observations for the three mutation classes,
but the report-only run `30967000841` remains inconclusive because its
read-only Cloudflare credential cannot derive Alchemy beta.64's HTTP
state-store bearer without mutation-capable bootstrap. The first report-only
failure `30966300887` (missing `GH_TOKEN`) and the corrected failure are both
retained. Until a separately reviewed non-mutating state boundary exists, the
aggregate register must remain `not-established`; the report-only workflow has
no teardown or deletion authority. Quality remains independently cancellable
and without provider credentials or provider mutation authority.
