---
document_type: deployment-evidence-index
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-proof-owner
last_reviewed: 2026-07-30
review_trigger: docs deployment candidate, provider, stage, URL, proof, screenshot, teardown or rollback receipt change
---

# Docs deployment evidence

This route owns dated, sanitized observations for the docs Worker deployment.
It never turns an earlier observation into current provider truth.

## Local workerd

The DCD-001 command-owned ignored receipt is local-only and is bound to its
exact commit and deployment-input digests. It proves no provider state.

## Preview

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

## Production

`2026-07-30-production-prod/` binds Preview-accepted source `d9cb894…` to
fixed stage `prod`, its equal plan, preflight, stable provider Worker URL,
Alchemy/provider readback, full hosted proof and reviewed desktop/mobile
screenshots. It also retains the separately Preview-qualified `c99984c…`
successor, that Preview's teardown/absence, its Production update, and the
restored d9 readback. The latest dated provider observation served restored d9;
historical receipts do not establish current availability.

## Rollback

`2026-07-30-production-prod/rollback-receipt-d9cb894.json` cross-binds the
initial, successor and restored provider identities. The same Worker URL and
Alchemy instance survived both updates, deployment/version identities changed,
and the restored state bundle equals the initial d9 bundle. The successor and
target share deployment-critical configuration and lock identity while their
path-bearing clean outputs differ. This is normal source-bound rollback proof,
not byte promotion, direct provider-version rollback or recovery from
deliberately broken content.

Secrets, raw tokens, request bodies, credential values and unsanitized provider
output are forbidden. Historical release and harness evidence remains
unchanged.
