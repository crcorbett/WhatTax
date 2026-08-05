---
document_type: deployment-evidence-index
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-proof-owner
last_reviewed: 2026-08-05
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
