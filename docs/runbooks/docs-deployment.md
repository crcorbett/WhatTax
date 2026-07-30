---
document_type: runbook
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-operation-owner
last_reviewed: 2026-07-30
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

## Procedure

Run `bun run check:docs-deployment` before an admitted operation. It validates
only current repository owners and executes no provider operation.

### Provider inventory

Read back the executing principal, exact account, plan/entitlement,
`workers.dev` subdomain, credential source/scope/expiry and existing exact
resource inventory. Keep only sanitized identities. Stop if Alchemy and the
independent provider reader disagree.

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
TAXKIT_DOCS_DEPLOYMENT_ID="${READ_BACK_DEPLOYMENT_ID}" \
TAXKIT_DOCS_VERSION_ID="${READ_BACK_VERSION_ID}" \
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
and physical Worker identity, run the normal build/plan/equal-replan/deploy
path, then prove provider version and hosted postcondition. A prior version ID
or successful API response alone is insufficient.

The verified rollback used the same two invocations above with the restored
source candidate and environment `rollback` for hosted proof. It required a
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
Historical receipts cannot establish current provider state. The earlier
`0d714e6…` chain is not accepted because it lacked exact pre-mutation
state/provider receipts and complete hosted/screenshot/state false-green
oracles.

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
