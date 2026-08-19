---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-execution-owner
last_reviewed: 2026-08-19
review_trigger: DPL task, candidate, workflow run, provider readback, public journey, screenshot, teardown, rollback or capability change
successor: null
tombstone: false
---

# Native Alchemy docs deployment execution plan

This plan implements the
[`native-alchemy-docs-deployment.md`](../../product-specs/native-alchemy-docs-deployment.md)
SPEC and its
[`task ledger`](../../product-specs/native-alchemy-docs-deployment.tasks.json).

## Progress

- **DPL-001 — complete:** local native deployment contracts, documentation
  checks and built Worker/browser proof passed in the deployment worktree.
- **DPL-002 — in progress:** create the exact candidate commit, push the admitted
  branch, create or update the trusted draft PR, and complete default-branch
  workflow bootstrap if required.
- **DPL-003 — pending:** run and accept Preview before Production.
- **DPL-004 — pending:** run and accept fixed Production from the Preview
  receipt.
- **DPL-005 — pending:** retain sanitised receipts, update current owners and
  close with exact claims and non-claims.

## Operating rules

1. Read live GitHub and Cloudflare identities before each mutation.
2. Keep the exact candidate, workflow revision, stage, plan digest, provider
   Worker/version and public URL bound in every receipt.
3. Never print or persist credential values, state payloads, raw provider
   responses or workstation paths.
4. Stop on unexpected resources, identity mismatch, unequal plans, unsafe
   drift, missing protected credentials or contradictory provider readback.
5. Use the current deployment runbook for rollback, teardown and escalation.

## Proof ceiling

Local checks, workflow results, Alchemy state, Cloudflare readback and public
journeys are separate claims. This plan will not claim current public
availability, rollback or cleanup without the matching dated observation.

## Candidate correction

The first native candidate used Worker-first asset routing. Three Preview
deploy attempts reached a live SSR page but returned `404` for its referenced
fingerprinted CSS asset, including after an exact stage teardown and clean
recreate. The current candidate changes `runWorkerFirst` to `false`, matching
Cloudflare's asset-first full-stack default and the local built contract. The
failed workflow runs remain disconfirming evidence; they are not deployment
acceptance.

The hosted probe now has a six-attempt, two-second bounded retry for transient
route `404`/`5xx` responses during Worker propagation. It does not retry the
expected missing-route `404`, and it does not turn a persistent response or a
later browser/proof failure into success.

The hosted browser proof waits for `domcontentloaded`, the hydrated TanStack
router, and then the required rendered UI before asserting client navigation,
server-function transport and screenshots. It does not wait for Playwright's
unbounded `networkidle` state: Cloudflare edge connections can remain open
after the document and assets are usable, which otherwise creates a false
timeout without changing the application journey being tested.

The Preview and Production deployment workflows install the pinned Chromium
binary without `--with-deps`. Three exact Preview deploy attempts reached the
runner only and stalled in the system-package installation before Alchemy
planning or provider mutation. GitHub's managed Ubuntu image supplies the
browser runtime dependencies; the hosted proof still runs the same pinned
Playwright browser and assertions. The cancelled attempts remain runner-only
failure evidence and are not deployment receipts.

The first merged workflow candidate also exposed a race in the SDK downstream
release check: the temporary consumer's `src` directory was created in the
same unbounded Effect batch as its file writes. The validator now creates that
directory before the bounded file-write batch. The local downstream gate passes
after this correction; the earlier CI failure remains retained as evidence for
the rejected candidate and is not a provider or deployment result.

Preview run `32281782913` then created and read back the exact `pr-46`
`DocsWebsite` Worker, but hosted proof stopped at the no-document-reload
oracle (`2` document requests instead of `1`). The `useHydrated()` marker was
still observable before React's click handler was ready. The next candidate
uses an app-owned post-effect interactivity marker; the failed `pr-46` Worker
must remain a retained failure observation until its exact teardown proves
absence.

Preview run `32283638059` then created and read back the exact `pr-47`
`DocsWebsite` Worker. The desktop no-document-reload and server-function
checks passed, but the mobile proof timed out after opening navigation because
the route-owned navigation handler was not yet observable as ready. The next
candidate adds a post-effect marker on the documentation navigation itself and
requires both the root and navigation markers before browser interactions.
The failed `pr-47` Worker remains a retained failure observation until its
exact teardown proves absence.

Preview run `32285790999` created and read back the exact `pr-48` Worker, but
the hosted browser journey observed one same-origin TanStack server-function
prefetch cancelled with `net::ERR_ABORTED`. The required navigation,
transport, route, mobile and screenshot assertions had otherwise reached their
endpoints. The browser probes now classify only that exact same-origin
`/_serverFn/` cancellation as an expected navigation prefetch abort; all other
request failures remain diagnostics and fail the proof. The failed `pr-48`
Worker remains a retained failure observation until its exact teardown proves
absence.
