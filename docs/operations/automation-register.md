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

The current register has three positive external-state entries: the
main-sourced Preview receipt for `pr-24`, the fixed Production receipt, and the
reviewed default-branch report-only receipt. Preview teardown remains
`externalState.status: "not-established"` because its hosted beta.64 dry-run
has not reached destroy or absence readback. This is executable desired-state
admission, not a claim that an unestablished workflow has never run. Historical default-branch
epochs under `docs/evidence/deployments/2026-08-05-*` and
`2026-08-10-*` remain separate dated observations. The report-only run
`30967000841` remains inconclusive because its read-only Cloudflare credential
cannot derive Alchemy beta.64's HTTP state-store bearer without
mutation-capable bootstrap. The first report-only failure `30966300887`
(missing `GH_TOKEN`) and the corrected failure are both retained. The
report-only workflow has no teardown or deletion authority. Quality remains
independently cancellable and without provider credentials or provider
mutation authority.

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

### 2026-08-10 main-sourced Preview readback and teardown stop

The merged main workflow produced a successful, claim-matched Preview epoch:
plan `31336277416`, deploy `31336358628`, and reconciler
`31336453638` all bind reviewed main SHA
`94392cc57c7328525110a7e992c04d4dfc1eebff`, candidate
`c602593b4e23e784a6c9e2b912c3084dcfc9b9f3`, stage `pr-23`, provider/state
identities and hosted/screenshot proof. The reconciler artifact is retained,
but it is not promoted into a repository outer receipt while the aggregate
mutation lifecycle remains incomplete.

The PR-close teardown `31335980866` is the corresponding reviewed-main
readback. It agreed on the `pr-23` state/provider inventory and exact delete
projection, then stopped because the pinned Alchemy beta.64 dry-run returned
exit 1 with empty stderr. No destroy or absence claim exists; reconciler run
`31336548279` failed closed. At that historical point all four deployment
entries remained
`externalState.status: not-established`; no Production or rollback run is
admitted from that failed teardown epoch. The next owner is hosted beta.64 runner
requalification or a separately reviewed supported correction, not promotion
of the non-zero plan output.

### 2026-08-10 main-sourced Preview promotion

Default-branch SHA `bc2ac82f48cce67a6ee5b1b6caf9e8903bf9c182` planned candidate
`cbcb86878379cc2a126a8e48bee256aa33096c79` for `pr-24` in run `31337945701`.
The equal-replan/deploy run `31338052297` and completion reconciler
`31338154055` produced a strict API-bound workflow receipt with matching
candidate, source, plan/config/deployment/lockfile, account/state, Worker,
deployment/version, hosted and desktop/mobile screenshot identities. The
promoted receipt is
`docs/evidence/deployments/2026-08-10-preview-pr-24/workflow-receipt-31338052297.json`;
only `docs-preview-delivery` is now `externalState: established`.

This does not advance Production, rollback, Preview teardown or report-only.
The corresponding `pr-24` teardown run `31337384729` stopped at the pinned
beta.64 dry-run with no destroy or absence readback, so the Worker remains
present. The report-only schedule remains reviewer-gated and report-only.

### 2026-08-10 current Production and report-only promotion

The reviewed default-branch Production epoch used source
`fef1dfca39d56d28b1f5956e4604af1cc659672b` and candidate
`cbcb86878379cc2a126a8e48bee256aa33096c79`. Plan run `31342982776`, deploy
run `31343083326`, rollback run `31343236244` and final redeploy
`31343392260` were each API-reconciled (`31343175981`, `31343339747` and
`31343498809`). The final Production receipt is
`docs/evidence/deployments/2026-08-10-production-prod-fef1dfc/workflow-receipt-31343392260.json`;
the nested rollback receipt preserves the prior/current version transition and
the accepted Preview recovery identity. The receipt is the only current
Production external-state admission; it does not imply a custom domain, DNS,
publication or byte-promotion claim.

The reviewed default-branch report-only run `31344401196` and reconciler
`31344453019` are promoted through the dedicated `reportPath` receipt at
`docs/evidence/deployments/2026-08-10-orphan-inventory-main-53d936/workflow-receipt-31344401196.json`.
It proves state/provider agreement and no mutation/deletion capability. The
report-only workflow remains protected/manual rather than unattended. The four
register entries therefore now read three `established` and one
`not-established`; the latter is the exact Preview teardown class, whose
`31343533595`/`31343687718` dry-runs stopped before destroy.
