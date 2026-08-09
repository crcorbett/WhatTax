---
document_type: runbook
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-operation-owner
last_reviewed: 2026-08-10
review_trigger: docs deployment candidate, Cloudflare or Alchemy identity/state, stage, plan, provider readback, teardown, rollback, credential or authority change
---

# Docs deployment

Owner: `taxkit-docs-deployment-operation-owner`

## Identity and resource scope

This runbook owns one TaxKit docs Worker/assets deployment composed by root
`alchemy.run.ts`, the narrowly required Alchemy state-store resources, isolated
`pr-N` Preview stages and the single fixed `prod` stage. It does not own a
custom domain, DNS, unrelated provider resources, third-party observability,
application state services, credentials or repository publication.

## Preconditions

Read `docs/operations/authority-model.md`,
`docs/verification/docs-deployment-journeys.json`,
`docs/evidence/deployments/README.md`, and the applicable dated receipt below
that route, including
`docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json`
and
`docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json`,
then verify the successor
`docs/evidence/deployments/2026-07-30-preview-preflight/git-readback.json`.
Run `bun run check:docs-deployment` for the currently admitted Schema-decoded
owners.

Bind the exact source commit, clean checkout, trusted PR number/head for
Preview, build/config digest, Alchemy stack/stage, account/profile, credential
source and expiry/revocation, expected logical resource IDs and intended
operation. Provider output is unknown ingress: decode and sanitize it before
retention. Never print a token, secret, request body or raw profile.

## Authority

Cooper, TaxKit repository/product owner, granted this implementation thread
authority on 2026-07-30 Australia/Melbourne for the exact resources,
environments and operations recorded in
`docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json`.
It lasts only for this implementation goal until completion, explicit
revocation or a safety/identity mismatch.

That receipt independently admits credential/account preflight, state
bootstrap/adoption, Preview plan/deploy/destroy, Production plan/deploy,
normal source-bound rollback/redeploy and bounded Alchemy reconciliation.
Approval does not waive candidate, account, stage, plan equality, exact-target,
redaction or provider/state agreement.

Cooper's successor Git authority is recorded separately in
`docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json`.
It admits creating
`codex/docs-cloudflare-alchemy-deployment` at exact candidate
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`, pushing that branch to
`origin`, creating one draft pull request against `main`, reading back its
identity, and subsequently pushing coherent accepted DCD slices to that same
branch. Merge, force-push, branch deletion, conversion from draft to ready,
release/tag/publication, custom-domain/DNS and unrelated mutation remain
outside the envelope.

The resumed 2026-08-02 authority epoch is recorded in
`docs/evidence/deployments/2026-08-02-authority-capability/receipt.json`.
It extends the same named TaxKit resources to protected GitHub environment
creation, narrow secret attachment, Preview/Production/teardown workflow
execution and rollback, while preserving the exclusions above. The readback
found the authenticated GitHub administrator and local Alchemy `default`
profile, but no protected environment, Actions secret or repository variable;
the local OAuth scope set is retained only as a digest and is not copied into
CI. Wrangler CLI authentication and concrete narrow CI token values remain
unavailable. This is a capability stop, not a missing-approval stop: do not
create empty environments, attach a broad OAuth value, or claim hosted
workflow proof until the named token identities are supplied and read back.
That paragraph describes the 2026-08-02 epoch and is superseded for
credential/environment capability by the dated 2026-08-04 receipt below;
workflow proof remains separately gated.

### 2026-08-03 — token-administration capability stop

A bounded capability probe invoked the installed Alchemy Cloudflare token
administration command with its standard input closed. The command reached its
supported Global API Key prompt and exited with status `130` when interrupted;
no key, email or token value was supplied and no provider mutation occurred.
The installed command is a user-token path that requires a Global API Key and
email; it does not consume the authenticated Alchemy OAuth profile. The
profile's redacted scope readback contains no Cloudflare API-token write
capability, so it cannot create the account-owned CI credentials.

The smallest provider-side prerequisite is an account administrator operating
through a secure, non-chat custody channel with Cloudflare's `API Tokens >
Write` account permission (preferred account-owned route), or the separately
custodied Global API Key and email required by the user-token route. That
administrator must create two distinct credentials: a mutation credential
limited to the exact TaxKit Worker/assets and Alchemy state/control-plane
operations, and a read-only inventory credential limited to the exact state
and Worker inventory reads. Resolve the live permission groups against the
actual supported API calls and account catalog; do not guess a scope set or
use an all-permissions option.

Only after creation may the operator provide the credential values through the
authorized secret-custody path. Read back and retain only redacted token
identity/name or digest, account and resource restrictions, expiry and
revocation owner. Then create and protect exactly
`taxkit-docs-preview`, `taxkit-docs-production`,
`taxkit-docs-preview-teardown` and `github-actions-report-only`, attaching the
mutation values only to the first three and the read-only value only to the
last. Empty environments, placeholder secrets and the broad local OAuth
profile are not valid substitutes. The current approval permits later
ready/merge operations, but those remain gated on this credential readback,
workflow execution, hosted receipts and final branch checks.

### 2026-08-03 — Executor Cloudflare re-auth capability stop

Executor Personal exposed a configured Cloudflare connector, but the first
live account-owned permission-group read was rejected before any token
operation. The connector returned `connection_rejected` with upstream HTTP
`403`; this is the reported provider 403/9109 token-administration condition.
No permission-group result, credential value or provider mutation was accepted
from that call. Do not treat the saved connection's presence as proof of
usable authentication and do not retry token creation through the rejected
connection.

The smallest next action is completion of the secure Executor re-auth handoff
in the Executor UI, followed by a fresh account-owned permission-group read.
After that read succeeds, resolve the live least-privilege groups for the
named Worker/assets and Alchemy state/control-plane operations, create the
separate mutation and read-only credentials, and continue with protected
environment attachment. Until the re-authenticated connection and group
readback agree, DCD-004 remains capability-gated and no GitHub environment,
secret, Preview or Production workflow claim may advance.

### 2026-08-04 — CI credential and protected-environment capability established

The secure provider connection was refreshed and an account-owned permission
group read succeeded for account `f9f94270a4a5af8af7010d891020922d`. The
successful, redacted readback is
`docs/evidence/deployments/2026-08-04-ci-capability/receipt.json`; the earlier
2026-08-02 capability stop remains immutable history. The mutation credential
`taxkit-docs-ci-mutation-20260804` is active through `2026-09-03T23:59:59Z`
with Workers Scripts Write, Workers Observability Write and Secrets Store
Write. The separate inventory credential
`taxkit-docs-ci-inventory-20260804` has the matching expiry and only the
corresponding Read groups. Both are recorded by redacted ID prefix and digest;
no value is present in the repository or receipt.

The provider resource scope read back as the account resource
`com.cloudflare.api.account.f9f94270a4a5af8af7010d891020922d:*`. The installed
`Cloudflare.state()` implementation uses the account `alchemy-state-store`
Worker and `StateStoreSecrets` Secrets Store; no R2 bucket, route or DNS
permission was added. Cloudflare exposes these permission groups at account
scope, so this receipt makes no unsupported per-Worker restriction claim.

The four exact GitHub environments are now reviewer-protected and contain
only their direction-specific secret names: mutation names in Preview,
Production and Preview teardown, and the read-only inventory name in
`github-actions-report-only`. The Executor GitHub connector has no
environment-secret administration operation, so the authenticated repository
administrator path performed the write and names-only readback. Values were
handed directly through the secret boundary and were not written to the
checkout or `.env.local`; the broad local OAuth profile was not copied.

This establishes credential capability and protected environment identity, not
workflow execution. `tools/docs-deployment/automation-register.json` remains
`not-established` until the workflows run from the default branch and retain
candidate-bound provider, hosted, screenshot, teardown and rollback receipts.
The environment deployment branch policy is intentionally unset; the
workflow's exact trusted-source and commit checks remain mandatory.

### 2026-08-04 — default-branch workflow bootstrap boundary

GitHub will not dispatch a workflow file that exists only on a pull-request
branch. The first Preview workflow dispatch is therefore a bounded bootstrap
exception: after the reviewed workflow lands on the default branch, it may bind
the already reviewed merged PR head and its deterministic `pr-N` stage. The
workflow still checks the exact repository, head SHA, Quality result, account,
stage and plan identities. Every later Preview dispatch must use an open,
trusted draft PR; a merged PR is not a general Preview admission path.

PR-close teardown is convergent and safe when no stage exists. Its equal dry-run
projection records `noop` for both logical resources and performs no destroy;
when both exact `DocsBuild` and `DocsWebsite` resources exist, it records equal
`delete` actions, destroys only that `pr-N` stage, and requires absence readback.
This bootstrap exception and no-op postcondition do not establish workflow,
hosted or teardown success until a default-branch run retains its dated,
candidate-bound receipts. The current automation register remains
`not-established`.

### Workflow proof and receipt contract

The protected Preview and Production workflows build the exact candidate, run
the existing `test:cloudflare-hosted` owner (including HTTP, browser,
accessibility, console, cache/header and bounded desktop/mobile screenshot
proof), then run `bun run check:docs-deployment-workflow-proof` against the
sanitized provider and hosted identities. The workflow retains the raw hosted
output separately, filters a strict Schema receipt, copies the PNG bytes into
the artifact-owned `docs/evidence/deployments/` subtree, and recomputes each
image digest before success. Provider readback includes the account and
Alchemy state-store identities plus the pre-mutation version when one exists;
the latter is required for source-bound rollback. A workflow observation is
not a durable deployment claim until its exact candidate, run, environment,
plan, provider, hosted, screenshot-byte and postcondition receipt is promoted
under `docs/evidence/deployments/` and Schema-decoded by the automation owner.

Production mutation additionally requires `accepted_preview_run_id`. That run
must be a successful `Docs Preview Deployment` from `main` for the exact
candidate; the downloaded provider and hosted receipts are Schema-checked and
must agree on candidate, the exact deterministic `pr-N` Preview stage, plan
digest, Worker, URL, deployment, version and zero diagnostics before the
Production plan is admitted. A caller-supplied commit, digest or `pr-*` prefix
without that receipt and exact PR binding is not Preview acceptance.

Teardown reads the exact `pr-N` stage and Worker before mutation, rejects any
unexpected action/resource projection, and requires both Alchemy stage absence
and provider Worker absence afterward. A zero-action projection is a valid
convergent no-op only when the preflight already proved the exact stage absent;
it is never inferred from an empty or malformed plan. The teardown provider
readback is a separate absence Schema, not an application deployment receipt.

The report-only inventory bounds the GitHub pull-request read to 1,000 rows and
fails closed at that bound because completeness is then unknown. Its scheduled
workflow remains reviewer-protected and therefore report-only/manual rather
than unattended automation; no automatic orphan deletion is admitted.

The first post-merge observations are retained as failure evidence: run
`30894963411` stopped before any provider step because the checkout action ref
was abbreviated; the full ref correction is `4fb8ea3…`, merged to `main` as
`ed94f8c…`. The automatic close event for PR `#2` (`30895606322`) also stopped
before provider access because the event's pre-merge `base.sha` was stale. The
teardown owner now binds pull-request events to the current default-branch
`github.sha` (or the explicitly supplied reviewed SHA for manual dispatch),
then rechecks the live `main` ref. A later teardown attempt must also install
the pinned browser and build the exact deployment input before hashing it;
absence of `apps/docs/dist` is a build failure, not a safe no-op.

The next default-branch teardown attempts (`30896950134` for the automatic
PR-close event and `30896963746` for the manual `pr-1` dispatch) passed checkout,
frozen install, browser setup, docs validation, exact build and equal destroy
dry-runs, then stopped at the inventory command because an ephemeral runner had
no cached `cloudflare-state-store` credential. Neither run destroyed a stage or
mutated a provider resource. The mutation workflows now run the installed
supported `ALCHEMY_PLAIN=1 CI=0 bunx alchemy cloudflare bootstrap --profile
"$ALCHEMY_PROFILE" --worker-name alchemy-state-store` command immediately before
planning or teardown. It first runs the supported `alchemy login` command with
`CI=1` to persist only the `method: "env"` profile selector; the token remains
an environment secret. Bootstrap then materializes the account-matched state
credential cache only in the runner and keeps the subsequent inventory command
read-only. The report-only workflow remains separately credentialed and is not
established by this correction.

## Procedure

Run `bun run check:docs-deployment` before an admitted operation. It validates
only current repository owners and executes no provider operation.

The current authorized local Preview observation was bound to draft PR `#1`,
candidate `aabe7b69de164906699fb4646a8ecc5058d46178`, stage `pr-1`, and the
equal sanitized plan receipt
`docs/evidence/deployments/2026-08-02-preview-pr-1/plan-aabe7b6.json`. Its
projection admits only `DocsBuild` and `DocsWebsite` creation, with plan
digest `bfcc34f06f954564e4e1d2576495516c47a8ff26ff8d1334bb57491966279239`.
The local workerd candidate proof passed before planning. The candidate then
passed provider readback, hosted HTTP/browser/accessibility/console/cache
proof, reviewed desktop/mobile screenshots, two equal destroy dry-runs and
exact-stage absence readback. The retained receipts are in
`docs/evidence/deployments/2026-08-02-preview-pr-1/`; they are dated evidence
only and do not establish Preview availability after teardown.

The same candidate was then read back at fixed `prod`, hosted-verified and
screen-captured using the receipts under
`docs/evidence/deployments/2026-07-30-production-prod/`. A normal source-bound
rollback to `d9cb894…` was subsequently hosted-verified and read back under
`rollback-aabe7b6-to-d9cb894/`. The final provider observation is the restored
d9 Worker identity. These manual receipts do not establish repeatable hosted
workflow execution; the protected environment and narrow CI-token gate below
still controls DCD-004/DCD-005 workflow claims.

### Provider inventory

Read back the executing principal, exact account, plan/entitlement,
`workers.dev` subdomain, credential source/scope/expiry and existing exact
resource inventory. Keep only sanitized identities. Stop if Alchemy and the
independent provider reader disagree.

The supported repeatable state/provider readback invocation is:

```sh
bun run check:docs-deployment-inventory
```

It uses Alchemy's public `makeHttpStateStore` plus the public Cloudflare Worker
Provider `list()` operation. It requires `CI=1`, the protected state-store
credential and agreement between that credential's account identity and the
current Cloudflare environment before state initialization. The workflow
materializes the cache as the primary ingress; the nested report-only process
may decode the same protected JSON credential directly only when it cannot see
that cache. It decodes state and provider output once, filters provider
inventory by exact Alchemy stack tags, and fails on state/Worker disagreement.
It prints no account ID, token or raw provider response. Do not place it in
root verification: it is a credentialed, provider-bound observation whose
exact execution belongs in an authorized operation or report-only workflow.

Mutation workflows must first materialize the ephemeral cache with the
installed Alchemy Cloudflare bootstrap command recorded above. The command is
account/stage control-plane preparation, not application deployment; it must
run with the mutation credential, retain no credential file beyond the runner,
and stop on account, state-store or version disagreement. The report-only
workflow may not reuse that mutation step or the local OAuth profile.

### Alchemy state bootstrap, adoption and recovery

Treat Alchemy state as a separate control-plane lifecycle. Before application
planning, establish whether the exact account already has the expected
`alchemy-state-store`, its version, credential binding and stack inventory.
Bootstrap or adopt only under the recorded state envelope. Do not use
`--adopt`, `--force`, state clear or teardown as a shortcut. Retain pre/post
state identity, provider readback, backup/recovery posture and any drift.

Installed Alchemy `plan` builds provider and state Layers. Its
`Cloudflare.state()` initializer can bootstrap, upgrade, refresh credentials
or prompt when state is missing or stale. Therefore it is not the state
inventory command: complete and receipt the state boundary before planning.

### Preview plan and deploy

Require an exact GitHub trusted PR head and derive only `pr-N`. Build the exact
candidate, produce a sanitized canonical plan projection bound to candidate,
stack, stage, config and logical resources, and retain its digest. Enter one
exclusive non-cancellable stage authority window, replan, require equal
digests, then apply without adoption or force.

The verified manual Preview plan and apply invocations are:

```sh
ALCHEMY_PLAIN=1 CI=1 bunx alchemy plan --stage pr-1 --profile default
ALCHEMY_PLAIN=1 CI=1 bunx alchemy deploy --stage pr-1 --profile default --yes
```

The `pr-1` literal is historical evidence for draft PR `#1`, not a template
for another pull request. Before either invocation, verify the current trusted
head, recompute the source/lock/config/deployment-input identities, run and
retain two equal plans, and prove the plan contains only `DocsBuild` and
`DocsWebsite` in that exact stage.

Read back the physical Worker, deployment/version, assets, `workers.dev` URL,
built-in invocation-log persistence and disabled traces. Use only that URL for
HTTP, SSR, assets, server-function, 404/error, header/cache, browser hydration,
no-reload navigation, accessibility and console proof. Capture one reviewed
desktop and one mobile screenshot plus manifest. Screenshots supplement every
other oracle.

After independent Cloudflare and Alchemy-state readback supplies the exact
values, the verified hosted proof invocation is:

```sh
TAXKIT_DOCS_HOSTED_URL="${READ_BACK_WORKERS_DEV_URL}" \
TAXKIT_DOCS_CANDIDATE_COMMIT="${EXACT_CANDIDATE_COMMIT}" \
TAXKIT_DOCS_ACCOUNT_ID="${READ_BACK_ACCOUNT_ID}" \
TAXKIT_DOCS_STATE_STORE_ID="${READ_BACK_STATE_STORE_ID}" \
TAXKIT_DOCS_DEPLOYMENT_ID="${READ_BACK_DEPLOYMENT_ID}" \
TAXKIT_DOCS_VERSION_ID="${READ_BACK_VERSION_ID}" \
TAXKIT_DOCS_PREVIOUS_VERSION_ID="${READ_BACK_PREVIOUS_VERSION_ID}" \
TAXKIT_DOCS_WORKER_NAME="${READ_BACK_WORKER_NAME}" \
TAXKIT_DOCS_STAGE="${READ_BACK_STAGE}" \
TAXKIT_DOCS_ENVIRONMENT="${ACCEPTED_ENVIRONMENT}" \
TAXKIT_DOCS_PLAN_SHA256="${ACCEPTED_PLAN_SHA256}" \
TAXKIT_DOCS_CONFIG_SHA256="${ACCEPTED_CONFIG_SHA256}" \
TAXKIT_DOCS_DEPLOYMENT_INPUT_SHA256="${ACCEPTED_DEPLOYMENT_INPUT_SHA256}" \
TAXKIT_DOCS_LOCKFILE_SHA256="${ACCEPTED_LOCKFILE_SHA256}" \
TAXKIT_DOCS_EVIDENCE_DIRECTORY="${DATED_EVIDENCE_DIRECTORY}" \
TAXKIT_DOCS_ROLLBACK_RECOVERY_IDENTITY="${ROLLBACK_RECOVERY_IDENTITY}" \
bun run --filter=docs test:cloudflare-hosted
```

Do not derive these inputs from an accepted plan or Alchemy output alone.
Decode the current Cloudflare deployment/settings and Alchemy state output,
require agreement, then retain only the sanitized receipt.

### Preview destroy

Inside the same exact-stage lock, re-read candidate, state, Worker and stage.
Preview destroy must select only that `pr-N` stage. Retain the destroy plan,
apply receipt and provider/state absence readback. Never broaden a missing or
ambiguous target.

The verified `pr-1` destroy dry-run and apply invocations are:

```sh
ALCHEMY_PLAIN=1 CI=1 bunx alchemy destroy --dry-run --stage pr-1 --profile default --yes
ALCHEMY_PLAIN=1 CI=1 bunx alchemy destroy --stage pr-1 --profile default --yes
```

Run the dry-run twice and require the same sanitized digest before destroy.
Afterward, independently require the exact Worker settings endpoint and hosted
URL to return `404`, matching Worker inventory to be empty, and the Alchemy
stage/resource inventory to contain no `pr-1` resources.

### Production plan and deploy

Require an accepted Preview for the same source and the separate Production
envelope. Use only fixed stage `prod`; re-run the same accepted-source build
and describe it as a same-source rebuild unless byte identity is proved.
Repeat canonical plan/equal-replan, provider readback, hosted behavioral proof
and bounded screenshots against the stable read-back `workers.dev` URL.

The verified fixed-stage plan/apply invocations are:

```sh
ALCHEMY_PLAIN=1 CI=1 bunx alchemy deploy --dry-run --stage prod --profile default --yes
ALCHEMY_PLAIN=1 CI=1 bunx alchemy deploy --stage prod --profile default --yes
```

Run the dry-run twice and accept only equal sanitized projections selecting
`DocsBuild` and `DocsWebsite`. Immediately before apply, bind the candidate,
lock, source/config and deployment-input digests to accepted Preview evidence;
then re-read credentials, account, exact `prod` state and matching Worker
inventory. Run the hosted proof command above with environment `production`
and only the provider/state-agreed URL and deployment/version identity.

### Normal rollback

Select the retained last-known-good source, keep the same stack, `prod` stage
and physical Worker identity, read the current Production version immediately
before mutation, and require the source-bound recovery identity and expected
current version to match. Run the normal build/plan/equal-replan/deploy path,
then prove the resulting provider version and hosted postcondition. A prior
version ID or successful API response alone is insufficient.

The verified rollback uses the same two invocations above with the restored
source candidate and `TAXKIT_DOCS_ENVIRONMENT=rollback` for hosted proof. The
hosted harness explicitly accepts that bounded rollback environment and emits
a rollback screenshot manifest; it required a
distinct deployment/version after apply, the same Worker name, URL and Alchemy
instance, and the target's expected state bundle. Requalify any successor in
isolated Preview first and remove that Preview only after retaining its proof.
Do not describe a same-source rebuild as byte promotion unless byte identity is
independently established.

### Break-glass version rollback

Break-glass provider-version rollback is not the normal path. It requires a
new exact authority receipt naming the version, incident, postcondition and
source reconciliation owner before use.

### Alchemy reconciliation

When provider and Alchemy state disagree, stop application mutation. Inventory
both sides, retain the contradiction, identify the authoritative exact
resource and use the smallest separately receipted reconciliation. Never clear
state, adopt, force, rename or delete based only on a logical-name guess.

## Evidence and postcondition

All dated receipts live under `docs/evidence/deployments/`. Each accepted
provider operation binds source, plan/config digest, account, stack/stage,
state, Worker/deployment/version/assets/URL, proof, screenshot digests,
reviewer, limitations and postcondition. The current
`docs/evidence/deployments/2026-07-30-preview-pr-1/` chain records one
successful candidate-bound Preview observation and exact-stage teardown. Its
earlier failed apply and superseded plans remain unchanged.

The accepted DCD-002 requalification files are:

- `docs/evidence/deployments/2026-07-30-preview-pr-1/git-readback-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/credential-readback-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/predeploy-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/provider-readback-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/hosted-proof-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-desktop-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-mobile-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/predestroy-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/destroy-plan-d9cb894.json`;
  and
- `docs/evidence/deployments/2026-07-30-preview-pr-1/teardown-d9cb894.json`.

The retained disconfirming DCD-002 files include:

- `docs/evidence/deployments/2026-07-30-preview-pr-1/failed-apply.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-0d714e6.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/provider-readback-0d714e6.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/hosted-proof-0d714e6.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-desktop-0d714e6.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-mobile-0d714e6.json`;
- `docs/evidence/deployments/2026-07-30-preview-pr-1/destroy-plan-0d714e6.json`;
  and
- `docs/evidence/deployments/2026-07-30-preview-pr-1/teardown-0d714e6.json`.

The accepted DCD-003 Production and rollback route is
`docs/evidence/deployments/2026-07-30-production-prod/`. Its initial d9 plan,
preflight, provider, hosted and screenshot receipts bind the first fixed
Production. The `rollback-successor-preview-*` records bind the separately
qualified c999 Preview and exact-stage teardown; the
`rollback-successor-production-*` records bind its fixed-Worker update. The
`rollback-*d9cb894` records bind the restored source, while
`rollback-receipt-d9cb894.json` cross-checks all three Production identities,
Preview absence and the restored bundle. `bun run check:docs-deployment`
Schema-decodes each JSON owner and verifies every retained PNG digest.

The exact DCD-003 sidecars are:

- `docs/evidence/deployments/2026-07-30-production-prod/plan-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/predeploy-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/provider-readback-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/hosted-proof-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/screenshot-desktop-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/screenshot-mobile-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-git-readback-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-credential-readback-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-plan-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-predeploy-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-provider-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-hosted-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-screenshot-desktop-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-screenshot-mobile-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-destroy-plan-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-predestroy-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-preview-teardown-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-plan-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-predeploy-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-provider-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-hosted-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-screenshot-desktop-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-successor-production-screenshot-mobile-c99984c.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-plan-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-predeploy-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-provider-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-hosted-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-screenshot-desktop-d9cb894.json`;
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-screenshot-mobile-d9cb894.json`;
  and
- `docs/evidence/deployments/2026-07-30-production-prod/rollback-receipt-d9cb894.json`.

## Rollback

Preview rollback is exact-stage destroy with absence readback. Production
rollback is the normal source-bound redeploy above. State bootstrap/adoption
rolls back only through its retained state/provider recovery procedure; the
state store is not destroyed as application cleanup.

## Escalation

Escalate identity/account mismatch, stale or overbroad credentials, missing
trusted PR head, plan inequality, provider/state contradiction, unsafe destroy,
secret exposure, failed hosted proof or rollback mismatch to Cooper and the
exact target owner. Retain the failed receipt without broadening authority.

## Repeatable automation admission

The deployment-only desired-state and control records live in
`tools/docs-deployment/automation-register.json` and
`tools/docs-deployment/controls.json`; validate them with
`bun run check:docs-deployment-automation`. They admit Preview, Production,
Preview teardown and report-only orphan inventory without changing the
read-only Quality workflow.

An automation is not operational merely because its local record validates.
Before marking its `externalState` as `established`, require all of:

1. reviewed workflow code on the default branch;
2. the exact protected GitHub environment named by the record;
3. a narrowly scoped credential identity supplied without repository or log
   disclosure;
4. an exact candidate/default-branch source and non-cancellable stage lock;
5. accepted canonical plan digest plus equal replan for mutation;
6. state/provider and hosted postcondition readback; and
7. a retained dated receipt named in `externalState.receipt`.

The receipt must also name Schema-decoded `workflowRunPath` and
`workflowInputPath` files under the owned evidence route. The workflow-run
readback must show the expected workflow name, exact workflow path, a successful
completed run, `refs/heads/main`, `headBranch: main`, and a head SHA equal to
the workflow source commit recorded by the outer receipt. The separate
workflow-input readback is emitted by the reviewed workflow from its dispatch
inputs and must bind the same run/path/source commit, operation and exact
deployment candidate input to the outer receipt. The source head and candidate
are intentionally distinct when a reviewed default-branch workflow builds a PR
head. Promotion rejects branch-only, synthetic or detached input metadata. The
successful workflow owners retain both files in the run artifact; a failed or
cancelled run has no success readback and cannot be promoted. The
named plan receipt is decoded and its operation, projection
digest, candidate, stage and equal-replan identity are checked again during
external-state promotion; a teardown projection may contain only two deletes
or two no-ops, never a mixed or unexpected action. Hosted promotion additionally
requires `preview` with `pr-N` for Preview, `production` or `rollback` with
`prod` for Production, and exactly one desktop plus one mobile screenshot whose
retained PNG bytes hash to the manifest.

The current register intentionally records all four entries as
`not-established` until each record's complete receipt contract is satisfied.
The 2026-08-04 capability receipt records the exact protected environment
identities and redacted narrow credential readback; the current workflow epoch
below records successful mutation-class runs, while the report-only state
boundary remains unresolved. Do not create an unprotected or empty
environment, copy the broad local OAuth credential into GitHub, or invent an
unexecuted command merely to advance the task. Continue to use this manual
runbook under the exact authority envelope until every required workflow
receipt and read-only state boundary is retained.

For a future positive report-only admission, the outer workflow receipt must
name a dedicated `reportPath` decoded as
`DocsDeploymentOrphanInventoryReceipt`. `providerReadbackPath` is reserved for
mutation provider identity or teardown absence receipts and must remain null
for orphan inventory; a report that is merely present in an artifact, or is
decoded as a mutation provider receipt, is not state/provider proof.

The 2026-08-02 successor readback at draft-PR head `aabe7b6…` confirmed
repository-admin capability but still found zero GitHub environments, zero
Actions secrets, zero repository variables, no Cloudflare/Alchemy process
inputs and no authenticated Wrangler principal. A valid local Alchemy OAuth
profile was read back separately for the exact account and state/provider
inventory; it is broader than a CI token and must not be reused as a GitHub
secret. The smallest CI prerequisite is an independently provisioned narrow
Cloudflare principal whose concrete values can be stored without disclosure as
`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` in `taxkit-docs-preview`,
`taxkit-docs-production` and `taxkit-docs-preview-teardown`, plus a separately
read-only `CLOUDFLARE_READ_API_TOKEN` and the separately scoped
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` in `github-actions-report-only`. The
latter is a redacted JSON credential cache containing only the account-matched
state-store URL, account identity and bearer; it is materialized ephemerally
and used only by the read-only inventory command. Installed Alchemy beta.64
has no cryptographic read-only state bearer, so this is an operational
read-only boundary: the workflow has no login, bootstrap, deploy, destroy or
state-write path, and the limitation remains an explicit non-claim. Before
storage, read back the account, allowed operation/resource set, duration and
revocation owner against the matching automation record. Creating empty
environments, substituting the broad local OAuth profile or widening the
Cloudflare principal is not recovery. PR-close teardown also remains gated on
reviewed workflow code being present on the default branch; merge and PR-ready
authority are separate.

PR-close teardown must run reviewed default-branch implementation code, derive
only exact `pr-N`, share that stage's non-cancellable mutation lock, and prove
state/provider/URL absence. Scheduled orphan inventory is report-only: it may
compare open pull requests, exact TaxKit stages and exact TaxKit Workers, but
has no provider-write, state-write or automatic-deletion authority. An
incomplete inventory is an inconclusive report, not destroy permission.

The report-only workflow is permitted to materialise its read-only state bearer
only after it verifies `refs/heads/main`, `GITHUB_REF_NAME=main`, and that
`GITHUB_SHA` equals the live default-branch ref. Manual dispatch on another
branch is rejected before dependency installation or secret use. Preview and
teardown reject a non-positive or non-numeric PR number before Alchemy cache
bootstrap. A normal rollback must use the accepted Preview provider receipt's
source-bound recovery identity; a caller-supplied identity or expected version
alone is not a last-known-good proof. The rollback provider/hosted receipt must
also show a non-null pre-mutation version and a different resulting deployment
version; a no-op version readback is not rollback proof.

The exact authorized operator invocation is:

```sh
bun run check:docs-deployment-orphans
```

It runs the existing state/provider inventory plus one exact GitHub open-PR
read, Schema-decodes both sources, recomputes every classification and emits no
credential, account value or raw provider response. Retain its JSON at a dated
deployment-evidence route. The 2026-07-30 receipt observed only fixed
Production, no Preview stage or orphan candidate, and one trusted open PR
without a stage. Do not turn that observation into deletion or absence proof
for a later provider epoch.

## 2026-08-05 workflow execution epoch

The reviewed workflow files are now on the default branch at
`1b6d36b765a5953f79b0932c127f01088603930f`. The bounded default-branch
bootstrap ran Preview plan/deploy as `30962576035`/`30962743727` for candidate
`eafeaad6c283ae6949ccf67636f39bec199b4e94`, stage `pr-10`, with equal plan
digest `acb4f2eb005b68c5d2c1ad1d491cda8119010b92f558c0d05ee68b25ee62e437`.
The corrected teardown runs `30964380634` (`pr-10`) and `30964525980`
(`pr-9`) performed exact delete/absence readback; `30962555585` remains a
false-noop disconfirming receipt. PR-close run `30966977503` derived `pr-12`
from the closed draft and safely converged to an absent-stage no-op.
After the reviewed slice merged, run `30968741396` repeated the PR-close
teardown against default-branch candidate
`936f3326a6100582ecd8ffb88b299985bc8db875`; its equal `pr-13` no-op and
state/provider postcondition are retained under
`docs/evidence/deployments/2026-08-05-preview-pr-13/`.

Production plan/deploy runs `30964647432`/`30964781776` deployed the
Preview-qualified source to fixed `prod`. Runs `30965270740`/`30965398455`
qualified the successor, and rollback plan/execution
`30965691430`/`30965797032` restored the prior source through a new
source-bound deployment/version. Provider, state, hosted, screenshot and
rollback receipts are routed under
`docs/evidence/deployments/2026-08-05-production-prod-eafeaad/` and
`2026-08-05-production-prod-aabe7b6/`.

The first report-only run `30966300887` stopped before the GitHub open-PR read
because `GH_TOKEN` was not bound. The correction bound the GitHub-provided
token, but run `30967000841` then stopped at `deployment-inventory`: a
read-only Cloudflare token cannot derive Alchemy beta.64's HTTP state-store
bearer without the mutation-capable bootstrap path. The two failed receipts
are retained under
`docs/evidence/deployments/2026-08-05-orphan-inventory/`. Do not copy a
mutation token or local OAuth profile into report-only inventory. A later
successor may materialize the separately reviewed
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` cache, but only with the workflow's
read-only command path and an explicit limitation that beta.64's bearer is not
cryptographically read-only. Until that successor receipt exists, the
scheduled inventory is inconclusive and grants no teardown or deletion
authority. The executable deployment register therefore remains
`not-established` as an aggregate claim despite the dated mutation workflow
successes.

### 2026-08-09 — operational report-only state-read candidate

The exact report-only workflow candidate materializes
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` into the default Alchemy credential
cache after frozen installation, validates account identity, URL and bearer
shape with `jq`, and then invokes only `bun run check:docs-deployment-orphans`.
It does not run `alchemy login`, `alchemy cloudflare bootstrap`, `alchemy
plan`, `alchemy deploy`, `alchemy destroy` or any state-write operation. The
secret is scoped only to `github-actions-report-only`, alongside
`CLOUDFLARE_READ_API_TOKEN`; no value is stored in the repository. This is an
operational-read-only boundary because beta.64's bearer has no native read-only
scope. The candidate remains unaccepted until a names-only environment
readback and exact workflow receipt prove state/provider agreement.

### 2026-08-09 — report-only Alchemy cache-ingress stop

The protected job for exact candidate `39f389c24f819046b2bd57e7cb3bd8674eed0941`
materialized `ALCHEMY_STATE_STORE_CREDENTIALS_JSON` under the runner's expected
home-relative Alchemy cache. Its names-only preflight observed the expected
keys, account-id length, URL host and bearer length, while retaining no secret
value. The inventory command nevertheless stopped with
`deployment-inventory:missing-cache`: installed Alchemy beta.64's
`CredentialsStore.read` returned no cached value.

Retain the bounded receipt at
`docs/evidence/deployments/2026-08-09-orphan-inventory/failed-31313055223.json`
and the full workflow log/artifact under run `31313055223`. This is a capability
stop, not an approval stop. Do not broaden the report-only token, copy the local
OAuth profile, invoke login/bootstrap, or infer an orphan, state, provider,
teardown or deletion result. The report-only register remains
`not-established`. The next operation is a supported non-mutating Alchemy
beta.64 cache-ingress repair or replacement, followed by a fresh exact-candidate
run and successor receipt; until then scheduled orphan detection stays
report-only and inconclusive.

### 2026-08-09 — public state-client successor and hosted runner stop

Candidate `9dd779d70ccf661081856c3b5f07474b406db7ba` now constructs the
report-only state reader with Alchemy beta.64's public `makeHttpStateStore`
after the existing Schema-decoded, account-matched cache ingress. The nested
process has a bounded fallback to decode the same protected JSON credential
when cache visibility differs, avoiding the nested `Cloudflare.state()` layer
while retaining the public Cloudflare Worker Provider read and leaving all
mutation/bootstrap paths unchanged. The local inventory command returned
state/provider agreement, state-store version `7`, one `prod` stage and one
Worker.

The exact hosted successor run `31315231020` checked out this candidate but
remained queued without a runner or pending environment request and was
cancelled after the bounded wait. Retain
`docs/evidence/deployments/2026-08-09-orphan-inventory/cancelled-31315231020.json`.
This is a hosted capability stop, not an approval or provider-state result:
the report-only automation register remains `not-established`, no orphan or
teardown claim is made, and the next action is to retry the protected workflow
when hosted runner admission is available.

### 2026-08-09 — report-only hosted successor

Candidate `70be77e64c93d20cd82c5e02e33db9c92a94f0d7` passed the protected
`github-actions-report-only` workflow `31316752464`. Cache materialization and
the names-only shape check passed; the nested inventory command then used the
bounded protected-JSON fallback when its child process could not see the
home-relative cache. The report returned state/provider agreement, state-store
version `7`, one `prod` stage, one matching Worker, no Preview stages and no
orphan candidates. The artifact was uploaded and the receipt is
`docs/evidence/deployments/2026-08-09-orphan-inventory/report-31316752464.json`.

This establishes the exact branch-bound report-only read and no mutation. It
does not establish hosted application behavior, deployment/version identity,
teardown, rollback or future availability. The automation register remains
`not-established` until this workflow runs from the reviewed default-branch
source; keep DCD-004 and DCD-005 open until that source-bound lifecycle is
accepted.

### 2026-08-10 — current provider evidence epoch

Candidate b59e4ee has claim-matched Preview `pr-15`, exact-stage teardown,
fixed Production and normal rollback/redeploy receipts under
`docs/evidence/deployments/2026-08-10-preview-pr-15/` and
`docs/evidence/deployments/2026-08-10-production-prod/`. The Preview hosted
contract and bounded desktop/mobile screenshots passed before run
`31318663989` proved state/provider and former workers.dev URL absence. The
Production receipt binds the stable provider Worker and URL; rollback to
eafeaad changed deployment/version identity, passed the hosted contract, and
was followed by the final b59e4ee redeploy. These are provider workers.dev
observations only: custom-domain, DNS, billing tier/cost, release, publication
and byte-promotion claims remain excluded.

The PR-close teardown receipt records the reviewed default-branch implementation
SHA separately from the deployed candidate because the workflow intentionally
does not execute pull-request code. The protected report-only run
`31319845724` passed for the open branch candidate and returned state/provider
agreement with no Preview/orphan candidates; it remains branch-bound until the
reviewed default-branch source is read back. Do not advance the aggregate
automation register or close DCD-004 from this branch-bound receipt.

## Stop conditions

Stop before unrelated `versioning`, `commit`, `push`, `tag`, `release`,
`registry-publication`, `deployment`, `provider-access`, or
`recovery-mutation`. Within the dated approval, stop on candidate, identity,
account, scope, stage, digest, state, resource, URL, redaction or postcondition
mismatch. A tool being authenticated is not evidence that the target is safe.

## Limitations

The failed preflight remains historical evidence that the exact DCD-001 commit
was not previously a GitHub PR head. The successor Git readback proves only
that draft PR `#1` initially admitted stage `pr-1`; later focused correction
commits invalidated its candidate identity and required fresh plans.

The accepted DCD-002 requalification chain is bound to
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a`. It required two opt-in
requests to observe the same Preview isolate and one module-scoped runtime
construction; it does not prove global isolate reuse. The broad existing
OAuth capability exceeds this operation and is recorded by scope-set digest;
authority did not expand beyond the exact TaxKit resources. Cloudflare's billing
subscription endpoint remained forbidden, so the receipt does not establish a
specific paid plan or future cost. Alchemy state version `7` returned an empty
object from `getOutput` after stage/resource inventory proved absence; the
teardown receipt records that bounded behavior rather than treating the empty
object as the primary absence oracle. Installed beta.64's generic
`alchemy state stages/resources` commands evaluate the application stack under
an internal `placeholder` stage, which TaxKit's fail-closed stage Schema
rejects. DCD-002 therefore used direct Schema-decoded state-store and
Cloudflare readback. Do not admit that internal sentinel into deployable stage
identity or use the failing generic command as an absence oracle; DCD-004 must
provide a supported repeatable readback owner before workflow admission.
Historical receipts cannot establish current provider state. The report-only
`check:docs-deployment-inventory` command now uses Alchemy's public
`makeHttpStateStore` after Schema-decoding the account-matched cache, with the
same protected JSON credential as a bounded nested-process fallback, plus the
Worker Provider `list()` operation; the mutation composition retains its
separate `Cloudflare.state()` layer. Its latest local authorized read observed
state/provider agreement for only `prod`, `DocsBuild` and `DocsWebsite`. This
does not establish hosted workflow execution, deployment/version identity,
application behavior or future availability. The earlier `0d714e6…` chain is
not accepted because it lacked exact pre-mutation state/provider receipts and
complete hosted/screenshot/state false-green oracles.

The DCD-003 fixed Production readback is bound to restored source
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a`, Worker
`taxkitdocscloudflare-docswebsite-prod-ujphggiaxw5ryjev` and its read-back
`workers.dev` URL. Cloudflare recommends a route or custom domain for
business-critical traffic; Cooper explicitly accepted that limitation and the
standard usage model for this initial endpoint. Billing subscription readback
remained forbidden, so no paid tier or future cost is established. The
rollback successor and target share deployment-critical config/lock identity,
and the rehearsal did not introduce broken content. It proves the normal
source-bound path, not byte promotion or disaster recovery from a known-bad
release. Initial and restored d9 screenshot manifests recorded identical
desktop/mobile digests; they intentionally share content-addressed PNG bytes
while retaining separate epoch/provider/reviewer manifests. Treat shared image
paths without that digest equality and explicit limitation as a false green.

## Non-claims

The accepted Preview receipt does not establish a currently available Preview.
The DCD-003 receipts establish dated fixed Production and normal source-bound
rollback observations only; they do not establish a custom-domain/DNS route,
paid plan, byte promotion, known-bad-content recovery, release or publication.
Screenshots do not replace provider, HTTP, browser, accessibility, console,
cache-header, teardown or rollback proof.
