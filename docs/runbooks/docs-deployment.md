---
document_type: runbook
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-operation-owner
last_reviewed: 2026-08-24
review_trigger: docs deployment candidate, Cloudflare or Alchemy identity/state, stage, plan, provider readback, teardown, rollback, credential or authority change
---

# Docs deployment

Owner: `taxkit-docs-deployment-operation-owner`

## Identity and resource scope

This runbook owns the TaxKit docs deployment made by root `alchemy.run.ts`.
The current graph has one
`Cloudflare.Website.Vite("DocsWebsite")` resource. Alchemy `2.0.0-beta.64`
owns the Vite build, assets, Worker and resource lifecycle.

Preview uses the exact `pr-N` stage for one same-repository pull request.
Production uses the fixed `prod` stage. The runbook also covers the narrowly
required Alchemy state store and read-only provider checks. It does not cover
custom domains, DNS, unrelated Cloudflare resources, credentials, package
publication or repository releases.

## Preconditions

Before an operation, read the current authority model at
`docs/operations/authority-model.md`, the journey register at
`docs/verification/docs-deployment-journeys.json`, and the history router at
`docs/evidence/deployments/README.md`.

Record these exact values before dispatch:

- the named person approving the operation;
- `plan`, `deploy`, `destroy` or `rollback`;
- the exact candidate commit and reviewed default-branch workflow commit;
- the pull-request number and `pr-N` stage, or the fixed `prod` stage;
- the expected Cloudflare account and the protected GitHub environment;
- the accepted plan digest and any earlier receipt identity required by the
  workflow;
- the expected postcondition, evidence route and recovery owner.

The candidate must have a successful Quality result. Preview candidates must
come from the same repository. Use the environment-scoped credential already
attached to `taxkit-docs-preview` or `taxkit-docs-production`; do not copy it
into a local file, command, log or receipt.

## Authority

Workflow access is not approval. The named approver must grant the exact
operation, candidate, stage, provider account, protected environment and
expected result. Production also needs the existing protected-environment
review.

Workflow YAML owns environment selection, GitHub permissions, concurrency,
the provider commands and their order. The typed `workflow-evidence` command
only calculates shared identities, decodes provider output and writes
sanitised evidence. It cannot grant authority or run Alchemy, Wrangler or an
arbitrary command.

Alchemy login/bootstrap is mutation-capable in beta.64. It may refresh the
provider credential, read a short-lived edge-preview secret, and create or
upgrade state-store resources. Authorise it as part of the exact workflow
operation. Its receipt proves only that the bounded step completed; it does
not prove that no provider state changed.

The Cloudflare token is available only to the named bootstrap, plan,
replan/apply and destroy steps that need it. It must not be moved to a job,
checkout, install, repository check, hosted proof or artefact upload.

Production plan, deploy and rollback share the fixed non-cancellable
`taxkit-docs-production-prod` group. Preview deploy and teardown share the
exact non-cancellable `taxkit-docs-preview-pr-N` group. These GitHub locks do
not cover a manual CLI. Do not run a manual Alchemy mutation while the matching
workflow is queued or running. Break-glass manual work needs a separately
authorised sole-writer period and state/provider readback before and after it.
There is intentionally no external lease.

## Procedure

1. Confirm the preconditions and run the provider-free repository check
   `bun run check:docs-deployment`. Run the required Quality checks for the
   candidate. Local success does not prove GitHub, Alchemy or Cloudflare state.
2. Dispatch `Docs Preview Deployment` or `Docs Production Deployment` from
   reviewed default-branch workflow code. Supply every exact workflow input.
   Use `operation=plan` first. Do not bypass the protected environment or edit
   the workflow during a run.

   Use these exact input names:

   - Preview plan: `operation=plan`, `candidate_sha=<exact trusted PR head>` and
     `pr_number=<positive same-repository PR number>`; leave
     `accepted_plan_sha256` empty.
   - Preview deploy: the same `candidate_sha` and `pr_number`,
     `operation=deploy`, and
     `accepted_plan_sha256=<digest from the accepted Preview plan run>`.
   - Production plan: `operation=plan`,
     `candidate_sha=<exact accepted candidate>`,
     `accepted_preview_commit=<same exact candidate>`,
     `accepted_preview_plan_sha256=<accepted Preview plan digest>`,
     `accepted_preview_run_id=<successful Preview run>`, and
     `accepted_preview_pr_number=<that Preview PR>`; leave
     `accepted_plan_sha256`, `rollback_expected_current_version_id` and
     `rollback_recovery_identity` empty.
   - Production deploy: use the same five candidate/Preview values,
     `operation=deploy`, and
     `accepted_plan_sha256=<digest from the accepted Production plan run>`;
     leave both rollback inputs empty.
   - Production rollback: use the same five candidate/Preview values,
     `operation=rollback`,
     `accepted_plan_sha256=<digest from the accepted rollback plan run>`,
     `rollback_expected_current_version_id=<fresh current Production version>`
     and `rollback_recovery_identity=<identity from the accepted Preview
     provider receipt>`.

   Do not reuse a plan digest across a changed candidate, stage, lockfile or
   configuration. A placeholder, shortened commit or caller-supplied value
   without its named receipt is not an accepted input.
3. The workflow checks candidate and Quality identity, installs frozen
   dependencies, and runs provider-free docs checks. It then performs the
   authorised bootstrap and runs `alchemy plan`. Alchemy owns the Vite build;
   do not add a second build process.
4. The typed evidence command decodes the raw plan with the single beta.64
   parser. Accept only one `DocsWebsite` `create`, `update` or `noop` action for
   deploy. The plan receipt must bind the exact candidate, lockfile,
   configuration, stage and sanitised plan digest. Stop on another resource,
   another action, malformed output or identity mismatch.
5. Review the plan receipt. For deploy, dispatch the same workflow with the
   exact accepted plan digest. The workflow replans and requires an equal
   digest before apply. It then reads back the exact Alchemy stage, one
   `DocsWebsite` Worker, Cloudflare deployment/version and workers.dev host,
   and runs the hosted HTTP/browser proof.
6. Keep the workflow receipt, provider readback and hosted proof separate.
   Reconcile the completed GitHub run before accepting the receipt. A
   successful source check is not provider proof; provider readback is not
   public-host proof.
7. When a same-repository Preview pull request closes, `Docs Preview Teardown`
   runs from reviewed default-branch code in the same
   `taxkit-docs-preview` environment. It rechecks the closed pull request,
   takes the same `pr-N` lock, compares two destroy plans, destroys only that
   stage, and proves state and Worker absence. An already absent stage is a
   valid no-change result, not an invented delete.

   The automatic close event supplies the PR and reviewed default-branch
   identity. For a separately authorised manual teardown dispatch, supply
   exactly `pr_number=<closed same-repository PR>` and
   `reviewed_workflow_sha=<current reviewed main commit>`. Do not supply the PR
   head as the workflow SHA.

The shared Preview environment has no required reviewer, so automatic
pull-request-close cleanup can use the same narrow credential as Preview
deploy. A new receipt is not an open prerequisite for this same-environment
automatic teardown. Require a fresh receipt if the environment, reviewer rule,
credential scope, teardown source binding or lock control changes.

For integrated local Cloudflare development, use the repository-owned
`docs:dev:cloudflare` script. This is development only. It does not replace the
workflow authority or receipt path.

## Evidence and postcondition

Retain sanitised receipts with the exact candidate, workflow run, operation,
stage, account identity, plan digest, provider identity, postcondition and
non-claims. Do not retain a bearer token, temporary secret-bearing URL, raw
profile or machine-local path.

The current journey definitions live at
`docs/verification/docs-deployment-journeys.json`. Immutable dated provider,
hosted, failure, cancellation, no-op, rollback and teardown records are routed
through `docs/evidence/deployments/README.md`. Use those records as history;
do not copy their old commands into this runbook.

A deployment is accepted only when the exact workflow receipt, Alchemy stage,
Cloudflare Worker/version and hosted result agree. Teardown is accepted only
when the exact stage and Worker are absent, or when the decoded plan and
readback both prove they were already absent. Preserve failed, cancelled,
superseded and no-op attempts with their limits.

### Retired history

Some dated evidence refers to the former `DocsBuild` resource. That name is
history only. It is not a current resource, command, plan expectation or
recovery instruction.

## Rollback

For a normal Production rollback, use `Docs Production Deployment` with
`operation=rollback`. Supply the exact accepted recovery candidate, its
accepted Preview receipt identity, the expected current Production version and
the recovery identity required by the workflow. The fixed Production lock and
protected-environment review still apply.

The workflow must recheck the current version before mutation, plan the exact
candidate, require provider/state agreement, apply through Alchemy and repeat
provider and hosted proof. A source revert or successful workflow alone is not
rollback proof.

If the current provider version is unknown, Alchemy state differs from
Cloudflare, or the workflow was interrupted during bootstrap, deploy, rollback
or destroy, do not retry. Treat the outcome as unknown. Establish one
authorised writer, read back Alchemy state and Cloudflare inventory, record the
result, then choose a new exact recovery operation.

## Escalation

Escalate to the repository owner and deployment operation owner when candidate,
stage, account, plan, state, provider, workflow or hosted identities disagree.
Include the exact run and receipt IDs, the last known safe state, the stopped
step, whether provider mutation may have started, and the proposed read-only
checks. Do not include secrets or raw temporary URLs.

Ask the protected-environment reviewer to reject the run if the requested
operation is broader than the recorded authority. Ask the Cloudflare account
owner to resolve an account or inventory mismatch. Ask the repository owner to
approve any new workflow, credential scope, lock design or recovery mutation.

## Stop conditions

Stop before `versioning`, `commit`, `push`, `tag`, `release`,
`registry-publication`, `deployment`, `provider-access` or
`recovery-mutation` when its named authority is absent or unclear.

Also stop when any of these occurs:

- the candidate, workflow, pull request, stage, account or environment differs
  from the approved identity;
- Quality is missing, pending or failed;
- the plan contains another resource, an unsupported action or malformed
  beta.64 output;
- replan differs from the accepted digest;
- Alchemy state and Cloudflare readback disagree;
- a matching manual mutation or workflow is already active;
- a token, secret-bearing URL or machine-local path may have entered evidence;
- bootstrap or provider mutation was interrupted and readback has not resolved
  the outcome.

## Limitations

GitHub concurrency does not lock manual CLI mutation or another system. The
repository does not use an external lease. Normal concurrent manual mutation
is unsupported.

Alchemy beta.64 bootstrap can change provider or state-store data before plan
output. A plan-only workflow is therefore not wholly read-only. Remote and Bun
caches can save time but do not replace frozen installation, live provider
commands or receipt checks.

The workers.dev readback covers the provider-managed host only. This runbook
does not establish a custom domain. Retained artefacts may expire from GitHub;
the repository fixture manifest keeps only sanitised plan bytes, source
identity and digests, not credentials or full provider responses.

## Non-claims

Local checks do not prove a GitHub workflow ran. A GitHub success does not by
itself prove provider state. An Alchemy plan does not authorise apply. Provider
readback does not prove the public site journey. A hosted HTTP response does not
prove DNS or a custom domain.

This runbook does not authorise Production deploy, rollback, DNS change,
credential creation or rotation, package publication, release, broad
Cloudflare cleanup or unrelated provider mutation. Historical receipts do not
prove current state, and the sanitised beta.64 fixtures prove parser
compatibility only.
