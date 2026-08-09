---
document_type: deployment-evidence-index
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-proof-owner
last_reviewed: 2026-08-10
review_trigger: docs deployment candidate, provider, stage, URL, proof, screenshot, teardown or rollback receipt change
---

# Docs deployment evidence

This route owns dated, sanitized observations for the docs Worker deployment.
It never turns an earlier observation into current provider truth.

## 2026-08-03 capability probe

The installed token-administration command was invoked with closed standard
input solely to test capability. It stopped at the supported Global API Key
prompt and exited `130` when interrupted; no credential value was supplied and
no provider mutation occurred. The current Alchemy OAuth profile lacks
API-token-write capability, and GitHub readback still reports no protected
environment, Actions secret or repository variable. The required provider-admin
action and secure token-custody contract are recorded in the
[docs deployment runbook](../../runbooks/docs-deployment.md) and active plan.
This observation is a capability stop, not workflow, Preview, Production,
teardown or rollback proof.

## 2026-08-03 Executor connector re-auth stop

The configured Executor Cloudflare connector was present but rejected the
first account-owned permission-group read with `connection_rejected` and
upstream HTTP `403` (reported 403/9109). No permission-group data, token value
or provider mutation was retained. The secure re-auth handoff must be
completed in the Executor UI before any live permission resolution or token
creation can proceed. This is not workflow, Preview, Production, teardown or
rollback proof.

## 2026-08-04 CI credential and environment capability

The secure provider connection successfully resolved account-owned permission
groups and created separate, expiring mutation and report-only credentials for
the TaxKit docs Worker and Alchemy Cloudflare state boundary. The sanitized
receipt is `2026-08-04-ci-capability/receipt.json`. It retains token names,
redacted ID prefixes/digests, account resource scope, exact permission groups,
expiry and revocation owner; no token value or request body is retained. The
state resources are the account `alchemy-state-store` Worker and
`StateStoreSecrets` Secrets Store. The provider readback required no R2, route
or DNS permission.

GitHub readback found exactly four reviewer-protected environments with only
direction-specific secret names. The Executor GitHub connector lacks an
environment-secret administration operation, so the authenticated repository
administrator path performed the attachment and names-only readback. Secret
values were not written to the checkout or any `.env.local` file.

This is a capability receipt only. It does not establish that a workflow has
run from the default branch, that Preview or Production is currently serving,
or that teardown, rollback, custom-domain/DNS, publication or release proof
exists. The earlier failed capability and re-auth receipts remain unchanged.

## Local workerd

The DCD-001 command-owned ignored receipt is local-only and is bound to its
exact commit and deployment-input digests. It proves no provider state.

## Preview

The resumed 2026-08-02 capability epoch is retained at
`2026-08-02-authority-capability/receipt.json`. It records Cooper's renewed
TaxKit-only authority, the exact draft candidate, GitHub environment/secret
absence, the local Alchemy profile identity and scope digest, and the narrow
CI-token capability stop. It contains no credential value and does not
establish a workflow, Preview, Production, teardown or rollback outcome.

Each Preview directory binds one trusted PR head, stage, accepted plan digest,
provider Worker/deployment/version/assets/URL readback, hosted behavioral proof,
bounded desktop/mobile screenshot manifests, teardown or explicit stop, and
limitations. The initial
`2026-07-30-preview-preflight/authority-preflight.json` receipt stops before
state initialization or mutation because the exact local candidate is not a
GitHub PR head. The sibling `git-authority.json` records Cooper's successor
authority for the exact branch/push/draft-PR recovery; it is an authorization
receipt, not proof that any Git or provider mutation succeeded. The sibling
`git-readback.json` records the successful exact remote branch and draft-PR
identity that derives Preview stage `pr-1`; it proves no provider state.

`2026-07-30-preview-pr-1/` preserves the complete successor chain. The
accepted candidate is
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a`; exact pre-deploy and
pre-destroy receipts bind Git, state, provider, source, lock, configuration
and deployment-input identities. An independently decoded sanitized
credential readback pins the account and scope-set digest used by both
mutation preflights without retaining any credential value. Two equal create
plans and two equal destroy plans selected only `DocsBuild` and `DocsWebsite`.
The dated provider readback binds the exact Worker, deployment/version,
assets, observability settings and provider URL. Hosted HTTP/browser proof and
one reviewed, byte-bound desktop/mobile screenshot pair passed before
exact-stage teardown. The teardown receipt then proves the Worker, hosted URL
and `pr-1` stage resources absent. The failed apply, superseded plans and the
insufficient `0d714e6…` observation remain disconfirming history; none
describes current provider state.

The resumed 2026-08-02 candidate
`aabe7b69de164906699fb4646a8ecc5058d46178` was deployed to the isolated
`pr-1` stage after two equal create plans. Its provider readback, hosted
HTTP/browser proof and reviewed desktop/mobile screenshots are retained in
`2026-08-02-preview-pr-1/provider-aabe7b6.json`,
`2026-08-02-preview-pr-1/hosted-proof-aabe7b6.json`,
`2026-08-02-preview-pr-1/screenshot-desktop-aabe7b6.json` and
`2026-08-02-preview-pr-1/screenshot-mobile-aabe7b6.json`. The candidate then
passed two equal delete dry-runs and exact-stage teardown; the matching Worker,
hosted URL and state resources were absent in the postcondition readback. The
destroy plan and teardown receipt remain candidate-bound in the same directory.
This is a dated Preview observation and does not establish current availability
after teardown, Production, rollback, custom-domain, DNS, release or
publication behavior.

## Production

`2026-07-30-production-prod/` binds Preview-accepted source `d9cb894…` to
fixed stage `prod`, its equal plan, preflight, stable provider Worker URL,
Alchemy/provider readback, full hosted proof and reviewed desktop/mobile
screenshots. It also retains the separately Preview-qualified `c99984c…`
successor, that Preview's teardown/absence, its Production update, and the
restored d9 readback. The latest dated provider observation served restored d9;
historical receipts do not establish current availability.

The resumed aabe candidate has a separate dated chain in the same directory:
`plan-aabe7b6.json`, `predeploy-aabe7b6.json`, `provider-aabe7b6.json`,
`hosted-proof-aabe7b6.json` and the two screenshot manifests. It proved a
same-source Production update against the fixed Worker URL. The subsequent
`rollback-aabe7b6-to-d9cb894/` hosted and screenshot receipts, together with
`rollback-plan-aabe7b6-to-d9cb894.json`,
`rollback-predeploy-aabe7b6-to-d9cb894.json` and
`rollback-provider-aabe7b6-to-d9cb894.json`, prove a normal source-bound
redeploy to d9 and a changed provider deployment/version with the same Worker
identity. The final dated provider observation is restored d9; neither chain
establishes current public availability or repeatable GitHub workflow proof.

## Rollback

`2026-07-30-production-prod/rollback-receipt-d9cb894.json` cross-binds the
initial, successor and restored provider identities. The same Worker URL and
Alchemy instance survived both updates, deployment/version identities changed,
and the restored state bundle equals the initial d9 bundle. The successor and
target share deployment-critical configuration and lock identity while their
path-bearing clean outputs differ. This is normal source-bound rollback proof,
not byte promotion, direct provider-version rollback or recovery from
deliberately broken content.

The resumed two-transition rehearsal is intentionally retained as a separate
current-epoch evidence set rather than being inserted into the immutable
historical rollback receipt. Its preflight, equal plan, provider readback,
hosted proof and screenshot manifests are claim-matched and validated by the
deployment checker, while the historical three-transition receipt remains
unchanged.

## 2026-08-05 default-branch workflow epoch

The merged implementation revision is
`1b6d36b765a5953f79b0932c127f01088603930f`. Default-branch Preview plan and
deploy runs `30962576035` and `30962743727` used candidate
`eafeaad6c283ae6949ccf67636f39bec199b4e94`, stage `pr-10` and accepted plan
digest `acb4f2eb005b68c5d2c1ad1d491cda8119010b92f558c0d05ee68b25ee62e437`.
The workflow's provider readback is retained with the `pr-10` evidence; the
hosted HTTP/browser and screenshot manifests are retained under
`2026-08-05-preview-pr-10/`. Corrected exact-stage teardown runs
`30964380634` (`pr-10`, digest
`f6eab33a87f5011c46fd24cd689872271ba4d0ac2c7e2fdf11010b188d21dd11`) and
`30964525980` (`pr-9`, digest
`42d417acbcb28da0d1e4fd9dbe4a7e04285c95f2963859ee8c9e4a105e2a1bc3`) prove
provider Worker and state absence. The earlier `30962555585` false no-op is
retained as disconfirming evidence. PR-close teardown `30966977503` safely
recorded an absent-stage no-op for `pr-12` at the merged PR-12 head.
The merge-era PR-close run `30968741396` independently converged absent
`pr-13` at default-branch candidate
`936f3326a6100582ecd8ffb88b299985bc8db875`; its equal no-op digest and
state/provider postcondition are retained in
`2026-08-05-preview-pr-13/teardown-noop-30968741396.json`.

Production plan/deploy runs `30964647432` and `30964781776` deployed the
Preview-qualified `eafeaad6…` source to fixed stage `prod`. Successor plan and
deploy runs `30965270740` and `30965398455` qualified `aabe7b69…`; rollback
plan and execution runs `30965691430` and `30965797032` restored the
`eafeaad6…` source through the normal source-bound graph. The current
Production Worker, deployment/version and Alchemy state identities are bound
by `2026-08-05-production-prod-eafeaad/` and
`2026-08-05-production-prod-aabe7b6/`; hosted proof, rollback proof and the
bounded desktop/mobile screenshot manifests are retained there. These are
claim-matched dated observations, not custom-domain, DNS, publication or
byte-promotion claims.

The first report-only orphan run `30966300887` stopped before inventory because
`GH_TOKEN` was not bound. The corrected run `30967000841` reached
`deployment-inventory` and stopped because the separate read-only Cloudflare
token cannot derive Alchemy beta.64's HTTP state-store bearer without the
mutation-capable bootstrap path. The two inconclusive receipts are
`2026-08-05-orphan-inventory/failed-30966300887.json` and
`2026-08-05-orphan-inventory/failed-30967000841.json`. No provider mutation or
secret disclosure occurred; scheduled orphan detection remains report-only and
inconclusive. The deployment automation register therefore remains
`not-established` even though the three mutation workflow classes have dated
success receipts.

Secrets, raw tokens, request bodies, credential values and unsanitized provider
output are forbidden. Historical release and harness evidence remains
unchanged.

## 2026-08-09 local bridge-retirement candidate

`2026-08-09-local-bridge-retirement/receipt.json` binds the clean committed
candidate `d649a14fe49122387e33a6de0547468e6a3e4967` to the docs-app
Cloudflare/workerd built proof. The candidate removes the docs-app Nitro/Vercel
bridge, makes `test:built` the canonical built proof, and preserves the
independent `apps/web` Nitro owner. SSR, assets, cache headers, 404 behavior,
hydration, server-function transport, no-document navigation, accessibility,
console cleanliness, runtime reuse, filesystem isolation and local upload
limits passed. This is local evidence only; it does not establish hosted
requalification for this candidate or the report-only Alchemy state boundary.

## 2026-08-09 report-only state-read candidate

The successor workflow candidate uses the protected
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` secret only in
`github-actions-report-only` to materialize the account-matched Alchemy cache
before the report-only inventory command. The workflow has no Alchemy login,
bootstrap, plan, deploy, destroy or state-write path. Beta.64's bearer is not
cryptographically read-only, so this candidate carries an explicit
operational-read-only limitation. A dated workflow receipt is required before
the automation register can advance from `not-established`; no state,
provider, absence or teardown claim is made by this candidate alone.

## 2026-08-09 report-only cache-ingress stop

The exact candidate `39f389c24f819046b2bd57e7cb3bd8674eed0941` passed Quality
and the protected report-only materialization step. The job's names-only probe
confirmed the expected home-relative cache file, keys, account-id length, URL
host and bearer length without exposing a value. The inventory process then
stopped at `deployment-inventory:missing-cache` because installed Alchemy
beta.64 returned no value from `CredentialsStore.read`.

The bounded failure receipt is
`2026-08-09-orphan-inventory/failed-31313055223.json`; the full workflow log and
artifact remain at run `31313055223`. This does not establish Alchemy state,
Cloudflare/provider agreement, an orphan set, teardown, hosted behavior or any
mutation. The report-only automation register therefore remains
`not-established`. The next owner is the Alchemy beta.64 cache-ingress boundary:
repair or replace it with a supported non-mutating state-read path, then rerun
from a fresh candidate. The earlier failed receipts remain unchanged.

## 2026-08-09 report-only public state-client successor

Candidate `9dd779d70ccf661081856c3b5f07474b406db7ba` replaces the nested
`Cloudflare.state()` construction in the report-only inventory owner with
Alchemy beta.64's public `makeHttpStateStore` service. The cache is decoded once
through the existing Schema boundary; a nested process may decode the same
protected JSON credential only when it cannot see that cache. The state client
exposes the inventory's read operations only, and the mutation/bootstrap
workflows are unchanged.
The local `bun run check:docs-deployment-inventory` proof returned
`state-provider-agree`, state-store version `7`, one `prod` stage and one
provider Worker. No credential value is retained.

The exact hosted successor run `31315231020` checked out this candidate but
remained queued without a runner or pending environment request and was
cancelled after the bounded wait. Its cancellation receipt is
`2026-08-09-orphan-inventory/cancelled-31315231020.json`. This supersedes the
cache-ingress repair as the current implementation owner, but it does not
establish hosted state/provider agreement; the report-only automation register
remains `not-established` and scheduled orphan detection remains inconclusive.

## 2026-08-09 report-only hosted successor

Candidate `70be77e64c93d20cd82c5e02e33db9c92a94f0d7` passed the protected
`github-actions-report-only` workflow in run `31316752464`. Cache materialization
and its names-only shape check passed, and the nested inventory command used the
bounded protected-JSON fallback when its process could not see the home-relative
cache. The Schema-decoded report returned `state-provider-agree`, state-store
version `7`, one `prod` stage, one matching Worker, no Preview stages and no
orphan candidates; the read-only artifact was uploaded successfully.

The claim-matched receipt is
`2026-08-09-orphan-inventory/report-31316752464.json`. This proves the exact
branch-bound report-only read and no mutation, not hosted application behavior,
deployment/version identity, teardown, rollback or future availability. The
automation register remains `not-established` until the reviewed workflow runs
from the default branch source; DCD-004 and DCD-005 therefore remain open.

## 2026-08-10 current candidate hosted epoch

The current b59e4ee candidate has separate dated Preview and Production
evidence. Preview `pr-15` includes equal plan/replan, Alchemy and Cloudflare
readback, hosted HTTP/browser/accessibility/console/cache-header proof and one
desktop/mobile screenshot pair under
`2026-08-10-preview-pr-15/`. The protected teardown run `31318663989` proves
the exact stage and former workers.dev URL absent. Because teardown executes
reviewed default-branch code, `teardown-workflow-b59e4ee.json` keeps the removed
candidate and reviewed implementation SHA as distinct identities.

Production uses fixed `prod` and retains the final b59e4ee deployment/readback,
hosted proof and screenshot pair under `2026-08-10-production-prod/`. The
`rollback/` directory retains the normal source-bound eafeaad redeploy,
provider/version readback, hosted proof and screenshot pair. The final
Production URL is the provider workers.dev URL; custom-domain, DNS, paid-plan,
release, publication and byte-promotion claims remain outside this evidence
epoch.

Protected report-only run `31319845724` passed for the open branch candidate and
returned state/provider agreement for one prod stage and Worker with no Preview
orphan. The wrapper receipt is
`2026-08-09-orphan-inventory/report-31319845724.json`; it remains branch-bound
until the reviewed default-branch workflow source is read back. No secret value
is retained in any evidence file.

## 2026-08-10 current default-branch Preview epoch

Reviewed default-branch SHA `94392cc57c7328525110a7e992c04d4dfc1eebff`
planned and deployed candidate `c602593b4e23e784a6c9e2b912c3084dcfc9b9f3`
for deterministic `pr-23`. Plan `31336277416` and deploy `31336358628` bound
the accepted/equal-replan digest, account/state, configuration,
deployment-input and lockfile identities. The successful deploy read back the
Worker, deployment/version transition and workers.dev URL, then passed the
hosted HTTP, SSR/assets, server-function, 404, hydration/navigation,
accessibility, cache/header, console and desktop/mobile screenshot checks.
The reconciler `31336453638` API-read the completed main workflow and retained
the exact workflow input/run, provider, hosted and screenshot artifact at
`https://github.com/crcorbett/taxkit/actions/runs/31336453638`. This is a
current Preview observation; it is not a Production, teardown, rollback,
custom-domain, DNS, publication or aggregate automation-establishment claim.

The PR-close teardown `31335980866` read back state/provider agreement and the
two expected delete actions for `pr-23`, but the pinned Alchemy beta.64
`destroy --dry-run` returned exit 1 with empty stderr. No destroy was attempted
and no absence receipt exists; the reconciler `31336548279` failed closed and
the Worker remains present. The earlier hosted-harness failure
`31336102494` and cancelled duplicate teardown dispatch `31336476804` remain
disconfirming/non-mutating history. Production and rollback were not attempted
after this stop. No secret value is retained in any evidence file.

## 2026-08-10 current main-sourced Preview promotion

After the merge of the reviewed workflow correction at default-branch SHA
`bc2ac82f48cce67a6ee5b1b6caf9e8903bf9c182`, Preview candidate
`cbcb86878379cc2a126a8e48bee256aa33096c79` was planned as deterministic
`pr-24`. Plan run `31337945701` produced the update projection and accepted
digest `1a9492fb7a656ddab44565fcc224e502d56dbd04287a31d53aefdb343af0278f`.
Deploy run `31338052297` completed the equal replan, provider/state readback and
hosted HTTP/browser contract. It binds deployment
`bd7c847d-150a-4f27-8d12-e5f5549f0186`, version
`e763909b-22ca-4ef2-a6f9-3de826291526`, prior version
`6b831c22-9f93-47a9-b0da-8227b56017a9`, stage `pr-24`, account/state identity
and the provider workers.dev URL. Hosted diagnostics were empty; SSR/assets,
server-function transport, malformed input, 404, no-reload navigation,
accessibility, cache/header, console and module-scoped runtime checks passed.
The retained desktop/mobile PNG digests are
`128c8f300d1911111fd3fc22a89289efc6961df29582421a53bd77e9ff8c82cf` and
`9ebc4108397d334eedff97d8ae79ddc103ee61a62bf87a995becf3715b32c945`.

The completion reconciler `31338154055` API-read the completed `main` workflow
and retained the exact workflow input/run, plan, provider, hosted and screenshot
artifacts. The promoted receipt is
`2026-08-10-preview-pr-24/workflow-receipt-31338052297.json`; it is the first
current default-branch positive Preview automation receipt and advances only
`docs-preview-delivery`. The `pr-24` teardown attempt
`31337384729` remains a failed/non-claim beta.64 dry-run with no destroy or
absence readback, so Production, rollback, teardown and report-only automation
entries remain unestablished. No secret value is retained in this evidence
epoch.
