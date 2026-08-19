---
document_type: product-spec
lifecycle: current
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-19
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
| Package exports, Changeset, release, custom domain and DNS | N/A | No package or public-host contract changes are part of this goal. |

## Proof ceiling

Local checks prove the repository candidate and generated local Worker. A GitHub
workflow proves only its recorded run. Alchemy state proves only its recorded
state. Cloudflare readback proves the provider's reported Worker and version.
Public journeys prove observed behaviour at the returned URL. The final
receipt must keep these claims separate and must not turn a historical URL or
old provider readback into a current availability claim.
