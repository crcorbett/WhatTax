---
document_type: automation-register
lifecycle: current
authority: canonical
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-10
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
The report-only workflow instead materializes the separately scoped
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` cache beside its Cloudflare read token.
It invokes only the inventory reader and has no login, bootstrap, deploy,
destroy or state-write command. Beta.64 does not expose a cryptographically
read-only state bearer, so this operational read-only boundary is retained as
an explicit limitation and must not be reused by mutation workflows.

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

### 2026-08-10 current candidate readback

The protected report-only workflow run `31319845724` passed for branch candidate
b59e4ee and retained state/provider agreement for one fixed `prod` stage and
Worker with no Preview/orphan candidates at
`docs/evidence/deployments/2026-08-09-orphan-inventory/report-31319845724.json`.
This receipt is intentionally branch-bound. The four register entries remain
`externalState.status: not-established` until the same workflow file and
report-only owner are read back from the reviewed default branch; no provider
mutation, state write, teardown or credential-scope expansion is inferred.

Each admitted mutation workflow now enforces the remaining boundary in its
own YAML: the initial plan and equal replan reject every action/resource outside
`DocsBuild` and `DocsWebsite`; provider inventory and the latest Wrangler
deployment are bound to the candidate, stage, plan, account, Alchemy state,
Worker, URL, version and pre-mutation version; and the shared hosted proof
checker must pass after strict receipt filtering and screenshot-byte digest
recomputation before the provider artifact is accepted.
Production downloads and Schema-checks a successful `main` Preview receipt
identified by `accepted_preview_run_id`, its workflow path and exact
`accepted_preview_pr_number`/`pr-N` stage. Teardown records a separate
Schema-decoded absence readback, checks the live PR is closed for both event and
manual dispatch, and rejects a false no-op or unexpected action. These workflow
artifacts still require promotion into a dated repository receipt before an
entry can move to `externalState.status: established`.

The positive admission path is explicit: decode one outer
`DeploymentWorkflowExternalReceipt`, then decode its plan/provider/hosted (or
teardown absence) paths; for `docs-orphan-inventory`, decode its dedicated
`reportPath` as `DocsDeploymentOrphanInventoryReceipt` rather than treating the
report as a provider deployment receipt. Recompute retained screenshot bytes
and cross-check workflow path, source SHA, environment, principal, stage lock,
plan/config/deployment/lockfile identity, account/state identity, deterministic
PR stage, provider/hosted identity and postconditions. A stale branch-bound
receipt remains historical and cannot establish the current default-branch
automation class. The report-only schedule is protected by a reviewer gate;
until that gate is intentionally removed, scheduled inventory is manual/report
only and must not be described as unattended detection. The orphan reader
requests at most 1,000 pull requests and fails closed at the bound.

Production's authority record admits `production-deploy` and
`production-rollback` as separate operations under the same protected
principal and fixed-stage lock; a rollback receipt cannot be promoted through
deploy-only authority.

The live workflow owners also Schema-decode the plan/replan or teardown
projection before mutation. Production accepts both the Preview provider/
hosted artifact and its canonical plan artifact. The separate read-only
`workflow_run` receipt workflow fetches the completed source run and matching
artifact after the triggering workflow ends; a triggering job cannot assert its
own completed status. A future established receipt must name strict workflow-run
and workflow-input readbacks proving the expected workflow name and exact
workflow path. Preview, Production and report-only API heads must be `main` and
match the outer workflow commit; automatic PR-close teardown instead records the
pull-request API head separately while its `workflowCommit` and
`refs/heads/main` identify the reviewed implementation that was checked out.
The reconciler must verify that reviewed commit exists and is an ancestor of
current `main` before validating the artifact. The workflow input must bind the
same run/path/source, operation and exact deployment candidate input to the
outer candidate. Synthetic workflow IDs or branch-bound output cannot establish
external state. Promotion checks hosted environment/stage semantics,
one desktop and one mobile screenshot with retained bytes, positive numeric PR
identity before Preview bootstrap, and a rollback identity sourced from the
accepted Preview provider receipt. Report-only dispatch is rejected unless its
ref and SHA are the reviewed default branch before bearer materialisation.
The reconciler is governed by `docs-workflow-receipt-reconciliation` in the
deployment control register; it adds no provider mutation or credential
authority and does not create a fifth deployment automation entry.
