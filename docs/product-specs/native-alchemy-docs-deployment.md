---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: docs deployment candidate, Git identity, workflow run, provider readback, public journey, screenshot, teardown, rollback, or credential capability change
successor: null
tombstone: false
---

# Native Alchemy docs deployment

## Outcome

Run the current TaxKit docs application through its native Alchemy and
Cloudflare workflows and prove the result at each boundary. The deployment
candidate must be an exact pushed commit. Preview must be accepted before
Production. Provider readback, public behaviour, browser checks and screenshots
must agree with the same candidate and plan identity.

This is a deployment and evidence goal. It does not change the docs content,
custom domains, DNS, package publication or release process.

## Authority and scope

The approving principal is Cooper, the TaxKit repository and product owner. The
approved operations are limited to the named TaxKit docs resources and their
supporting Alchemy state boundary:

- create the exact `codex/` candidate branch, commit the current working tree,
  push it and create or update one trusted draft pull request;
- land the reviewed workflow and application candidate on `main` when the
  repository workflow requires default-branch bootstrap;
- run Preview plan/deploy/readback and exact-stage teardown;
- run fixed Production plan/deploy/readback after Preview acceptance;
- run normal source-bound rollback only if a recovery operation is required.

The operation uses the existing protected environments and their redacted
credential readbacks. No credential values may enter logs, receipts or source.
Custom-domain, DNS, unrelated Cloudflare resources, release, publication and
force-push operations remain outside scope.

## Requirements

### `DPL-001` — exact candidate and local proof

Use the current native `Cloudflare.Website.Vite("DocsWebsite")` composition.
The Website.Vite asset policy must use Cloudflare's default asset-first
routing for this TanStack Start app; Worker-first routing is not accepted when
the hosted asset journey returns a 404.
Run the repository's focused checks and built Worker/browser proof. Record the
base revision, final candidate commit, installed Alchemy/Effect versions and
the local proof limits before provider access.

The TanStack Start client and server environments must consume one generated
Fumadocs collection result per Vite build. The Fumadocs generator's `buildStart`
hook is therefore shared and deduplicated; a client/server MDX or syntax-
highlighting mismatch that produces a React hydration error is a failed
deployment, even when the initial SSR response and static assets are healthy.

### `DPL-002` — Git and workflow bootstrap

Create one exact candidate commit and push it to the admitted remote branch.
Create or update one same-repository trusted draft PR. If GitHub requires the
workflow files on `main`, complete the approved merge/bootstrap step and read
back the resulting default-branch SHA before dispatching provider workflows.

### `DPL-003` — Preview acceptance

Dispatch Preview `plan` and `deploy` for the exact draft-PR head. Require the
native one-resource plan, equal plan digests, protected environment, Alchemy
state/provider agreement, the workers.dev URL, hosted HTTP/browser proof,
desktop/mobile screenshots and zero diagnostics. Retain the Preview stage
until Production has consumed its accepted receipt, then prove exact-stage
teardown and absence. The hosted probe allows only a short bounded wait for
Cloudflare route propagation; a persistent 404 or any other proof failure
remains a failed deployment.

### `DPL-004` — Production acceptance

Dispatch Production `plan` and `deploy` only from the Preview-accepted exact
candidate and plan receipt. Read back the fixed Production Worker, deployment
version and URL, then run the hosted HTTP/browser and screenshot journeys.
Record whether rollback was required; never claim rollback proof without a
separate source-bound operation and readback.

### `DPL-005` — evidence and closeout

Encode sanitised receipts for Git, workflow, plan, provider, hosted, screenshot
and teardown observations. Update the runbook, deployment architecture,
automation register, evidence index and this SPEC/task/plan together. State
what was proved, what remains historical, and every skipped or unavailable
proof layer.

## Documentation impact

| Surface | Decision | Owner/postcondition |
| --- | --- | --- |
| Current SPEC, tasks and active plan | Change required | They own this deployment goal and its acceptance state. |
| Deployment architecture and runbook | Change required | They route the native workflow procedure, authority and recovery. |
| Workflow, receipt and automation owners | Change required | They record the exact candidate-bound external observations. |
| Public docs content, navigation and design | Preserve | Deployment does not change authored content or presentation. |
| Historical deployment evidence | Preserve | Previous receipts remain dated observations and are not rewritten. |
| Fumadocs/Vite build boundary | Change required | The shared generator hook owns one generated MDX source for the client/server build and prevents hydration drift. |
| Package exports, Changeset, release, custom domain and DNS | N/A | No package or public-host contract changes are part of this goal. |

## Proof ceiling

Local checks prove the repository candidate and generated local Worker. A GitHub
workflow proves only its recorded run. Alchemy state proves only its recorded
state. Cloudflare readback proves the provider's reported Worker and version.
Public journeys prove observed behaviour at the returned URL. The final
receipt must keep these claims separate and must not turn a historical URL or
old provider readback into a current availability claim.

## Closeout observation — 2026-08-20

All five DPL tasks are complete for candidate
`7a23bf3eb286a44f2e06775750105ffe9cc09d3e`, merged to `main` at
`72dea00022e3d196d7021ec0b677ea9631d6a4d5`, with the final documentation
closeout merged by PR #52 at `a86994a5e8cec1ba6220620e244afdc0d29eaed1`.
Preview was accepted by runs
`32301004640` and `32301180775`; Production consumed that exact Preview
receipt and was accepted by runs `32301473695` and `32301629287`. Both hosted
journeys passed with zero diagnostics and reviewed desktop/mobile screenshots.
Exact-stage teardown then proved `pr-51` and the older accepted `pr-50` absent
in runs `32300321743` and `32302090160`. No rollback was required. The dated
receipts are indexed in
`docs/evidence/deployments/README.md`; this closeout does not add a custom
domain, DNS, release, publication, byte-promotion or permanent-availability
claim.

The final remote Quality readback is bounded and claim-matched: PR #52 head
`1cbcf2d119527db65868c2fc42d196f1d31c606f` passed Quality in run
`32304045477`; the duplicate push run `32304009721` completed as cancelled
only during Chromium installation; and post-merge `main` Quality passed in
run `32305069327`. The cancellation is retained as runner evidence and does
not weaken or bypass the Quality admission contract. Preview teardown run
`32305072590` and receipt reconciliation run `32305214604` passed. Local and
remote `main` were reconciled to `a86994a5e8cec1ba6220620e244afdc0d29eaed1`
without discarding the prior dirty candidate, which remains preserved outside
the repository history.
