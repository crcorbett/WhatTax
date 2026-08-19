---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-08-20
review_trigger: DPL task, candidate, workflow run, provider readback, public journey, screenshot, teardown, rollback or capability change
successor: ../../product-specs/native-alchemy-docs-deployment.md
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
- **DPL-002 — complete:** commit `7a23bf3eb286a44f2e06775750105ffe9cc09d3e`,
  merge it to `main` through PR #51, and pass the exact-candidate Quality
  checks.
- **DPL-003 — complete:** Preview plan/deploy runs `32301004640` and
  `32301180775` passed with equal plans, provider readback, hosted proof and
  screenshots; exact stages `pr-51` and the prior accepted `pr-50` were later
  torn down with absence readback.
- **DPL-004 — complete:** Production plan/deploy runs `32301473695` and
  `32301629287` consumed the Preview receipt and passed fixed-Worker provider,
  hosted and screenshot proof. The source-bound recovery identity is retained;
  no rollback was needed.
- **DPL-005 — complete:** dated sanitised receipts, screenshots, task/spec,
  runbook and automation register agree. The final closeout records exact
  claims, non-claims and cleanup evidence.

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

The exact PR-close teardown run `32285607142` then destroyed only the
`pr-48` stage and read back `providerWorkerAbsent: true` for its former Worker.
The retained provider and hosted failure artifacts remain intact; no other
Preview stage or Production was changed.

Quality run `32287793567` then completed the browser install, policy checks and
deployment tests but failed the repository lint with
`no-use-before-define` in the new built-probe abort classifier. The classifier
now receives its already-bound origin explicitly; this is a code correction,
not a runner or provider result, and the candidate must pass a fresh Quality
run before deployment work continues.
The merged candidate's pull-request Quality run `32289715529` passed, while
the duplicate push run `32289705420` timed out in `playwright install
--with-deps` after 30 minutes. The first Preview plan `32291448965` stopped at
the exact Quality check before Alchemy login, planning, provider mutation or
hosted proof. The deployment admission is being tightened to require one
completed exact-candidate Quality success, reject pending attempts and failed
completed attempts, and tolerate only cancelled historical reruns beside that
success. This is a workflow-gate correction; it does not establish Preview or
Production.

The correction is carried by open PR `#50`, exact head `56b95cc…`; its
pull-request Quality run must pass before the PR is merged and the Preview
plan is retried.

## 2026-08-20 — Production hydration mismatch correction

Production deploy run `32296155483` completed the provider mutation and readback
for candidate `305bed06140407488986008469e78809251c88eb`, but its hosted browser
proof failed with React error `#418`. The public Worker returned the expected
SSR page and assets; a direct Playwright check found one page error in the
client bundle while the root and navigation markers were present. Preview run
`32295694051` did not show that error for the same source candidate.

The public asset comparison isolated the failure to separately compiled MDX
chunks: the Production client chunk used different Shiki output from the
server-rendered module, so React replaced a Suspense boundary during hydration.
This is a failed Production observation, not an acceptance receipt. The
sanitised provider readback is retained under the deployment evidence route;
the hosted proof is intentionally empty because the browser contract failed.

The next candidate wraps the Fumadocs Vite generator's `buildStart` hook with a
single shared Promise. TanStack Start builds client and server environments in
one Vite builder, while Fumadocs writes the generated collection modules from
`buildStart`. Generating that shared source exactly once prevents the two
environments from observing different compiled MDX content. Local proof after
the correction shows one MDX generation event, deterministic Vite output and
zero built-browser diagnostics. The fresh provider-backed Preview and
Production receipts for this exact commit are recorded below.

## 2026-08-20 — accepted Preview, Production and exact cleanup

The corrected candidate `7a23bf3eb286a44f2e06775750105ffe9cc09d3e` passed the
merged default-branch Quality checks and the native Alchemy workflow graph.
Preview used `pr-51`, plan digest
`268d59fe8593e9ab0e35a576f03796cd3ad84427a10ad4d7cc10f66385ff944f`, run
`32301180775`, Worker deployment `7c626c74-825a-45f4-b526-4ad8ff7e38cf`, and
version `b6adab26-b5a2-4cb3-8d74-06603c729f0b`. The hosted contract passed with
zero diagnostics and reviewed desktop/mobile screenshots.

Production consumed that exact Preview receipt. Plan/deploy run
`32301629287` used fixed `prod`, plan digest
`8bf3c669f67f8d74adc37219da41382930f363128c9c401973862726cc0de6db`, Worker
deployment `1f79f9c3-a326-408c-a0e1-85b439070793`, version
`e951d0cf-a5f4-48e7-aebf-03230562a980`, and recovery identity
`production-32301629287`. Hosted SSR, hydration, navigation, server-function,
malformed-input, 404, accessibility, console and screenshot checks passed.

After Production acceptance, teardown run `32300321743` proved exact `pr-51`
state and Worker absence. A current-workflow manual teardown run
`32302090160` proved the older accepted `pr-50` stage and Worker absent. The
superseded PR-close `pr-50` run `32295516940` stopped before checkout because
its recorded workflow revision was no longer the current default branch; it
made no provider mutation and remains disconfirming history.

The receipts are retained under the four dated directories in
`docs/evidence/deployments/2026-08-20-*`. This establishes only the recorded
workers.dev observations and exact-stage cleanup. It does not claim custom
domain/DNS, package publication, release, byte promotion or a permanent
availability guarantee. No rollback was performed because the accepted
Production hosted proof passed; the previous version identity remains in the
provider receipt for source-bound recovery.
