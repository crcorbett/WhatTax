---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-docs-deployment-implementation-owner
last_reviewed: 2026-07-30
review_trigger: DCD task transition, implementation discovery, proof result, authority stop, or rollback
successor: null
tombstone: false
---

# Docs Cloudflare and Alchemy deployment execution plan

Spec:
[Docs Cloudflare and Alchemy deployment](../../product-specs/docs-cloudflare-alchemy-deployment.md)

Task list:
[`docs-cloudflare-alchemy-deployment.tasks.json`](../../product-specs/docs-cloudflare-alchemy-deployment.tasks.json)

## Goal

Implement `DCD-001` through `DCD-005` sequentially so the docs app has a
qualified Cloudflare Worker artifact, isolated Preview, fixed Production,
bounded delivery automation, and an accepted rollback path before the temporary
Nitro/Vercel bridge is retired.

One thread goal coordinates the whole accepted SPEC. The sibling ledger remains
the milestone and acceptance owner.

## Status

| Task      | Status      | Evidence                                                                                                                                                                                                             |
| --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCD-001` | completed   | Accepted at `669a8f3…` after exact dependency/integrity readback, both built-app oracles, docs-maintainer reconciliation, focused Changeset, independent closure, and all change-owned gates. |
| `DCD-002` | completed   | Accepted candidate `d9cb894…` passed fresh pre-deploy and pre-destroy state/provider readback, equal plans, Preview apply, the complete hosted/browser/screenshot contract, exact-stage teardown/absence, all gates and corrected-boundary independent review. |
| `DCD-003` | pending     | The accepted `DCD-002` Preview identity now permits fixed Production and normal rollback work under the same bounded authority, subject to exact identity and safe-plan preflight.                                  |
| `DCD-004` | pending     | Waits for accepted manual Preview and Production paths.                                                                                                                                                              |
| `DCD-005` | pending     | Waits for accepted automation and complete parity evidence.                                                                                                                                                          |

## Baseline

- Implementation target:
  `96a825cebd22798044678389851be6ee9154d1df`.
- Reviewed planning parent:
  `9c82bf9613b1342375ff670c46ee34cc8347af1d`.
- Initial worktree: clean.
- DCD-001 dependency baseline: Effect/Platform `4.0.0-beta.98`; Alchemy
  absent; TanStack Start `1.167.65`; Vite `8.0.14`; Nitro
  `3.0.260429-beta`.
- DCD-001 candidate: exact Effect/Platform `4.0.0-beta.100`, Alchemy
  `2.0.0-beta.64`, `@cloudflare/vite-plugin@1.47.0`,
  `wrangler@4.114.0`, and plugin-owned `workerd@1.20260722.1`.

## Authority and stops

Current authority permits repository implementation, local dependency changes,
local Cloudflare/workerd proof, documentation, this active plan, coherent local
commits, and sequential ledger work.

Cooper, acting as TaxKit repository and product owner, granted the provider
authority envelope upfront on 2026-07-30 Australia/Melbourne:

- executing principal: this implementation thread using only the existing
  authenticated Cloudflare, Alchemy and GitHub identities available to the
  TaxKit deployment workflow or authorized local environment;
- resources: only the TaxKit docs Worker/assets, narrowly required Alchemy
  remote state/control-plane resources, deterministic isolated Preview stages
  and the single fixed Production stage defined by the SPEC;
- environments: trusted isolated Preview and fixed Production at provider
  `workers.dev` URLs;
- operations: credential/account preflight, sanitized plan and equal replan,
  create/update/deploy, provider and state readback, hosted behavioral and
  screenshot proof, Preview teardown/absence proof, Production deploy, and
  normal rollback/redeploy rehearsal;
- duration/revocation: this implementation goal only, until completion,
  explicit revocation, or a safety/identity mismatch;
- audit: retain sanitized candidate, commit, plan/config digest,
  account/stage/resource, state, Worker/deployment/version, URL, hosted proof,
  screenshot, teardown/rollback and postcondition receipts without exposing
  secrets; and
- rollback: use the SPEC/runbook's normal source-bound rollback/redeploy and
  provider readback path.

Custom-domain/DNS work, unrelated resources, credential disclosure/rotation or
scope expansion, third-party observability, package publication/release,
merge, force-push, branch deletion, PR-ready conversion and unrelated mutation
remain unauthorized. The exact branch, push, draft PR/readback and later
accepted-slice pushes are admitted by the dated successor Git receipt. Wrong
identity or account, unsafe drift, secret-exposure risk, destructive scope
beyond the named resources, or provider contradiction remains a mandatory
safety stop.
The target-owned runbook and first provider receipt must restate this envelope
before DCD-002 mutates anything.

DCD-001 also stops if beta.64 has no supported provider-free deployable
Worker/assets seam, the exact dependency graph is incompatible, a request-time
filesystem or unsupported Node dependency has no accepted owner, or
the compressed bundle limit fails or later provider startup qualification
contradicts the candidate without a clear in-scope correction.

## Execution and recovery

Each DCD task is a complete vertical slice. The primary owner reviews its
changed call graph, Schemas, Config, errors, Effect/runtime shape, helper
admission, documentation impact, focused proof, limitations and Changeset
decision before committing and starting the dependent task.

DCD-001 retains the current Nitro/Vercel built harness as an independent
regression oracle. Recovery returns to the reviewed beta.98/Nitro graph through
ordinary Git history and retains failed compatibility or runtime evidence; it
does not add wrappers, access providers, or weaken an oracle.

## DCD-001 impact ledger

| Surface                                                       | Decision                   | Initial obligation                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SPEC/tasks/plan                                               | Change required            | Keep observed paths, exact commands, evidence and task state synchronized.                                                                                                                                                                   |
| Root manifest/lock                                            | Change required            | Freeze the accepted beta.100/beta.64 graph without unrelated upgrades.                                                                                                                                                                       |
| Docs app build/runtime                                        | Change required            | Add only the Schema-decoded official Cloudflare build branch and provider-free Worker harness; preserve route/React/ManagedRuntime ownership.                                                                                                |
| Root composition                                              | Change required            | Add public `Command.Build` plus `Cloudflare.Worker({ bundle: false })` composition without a provider package.                                                                                                                               |
| Architecture/READMEs                                          | Change required            | Update durable deployment, frontend, testing, package ownership and entry-point pointers with observed behavior.                                                                                                                             |
| Content/Fumadocs packages                                     | Change required / Preserve | Workerd proved eager generated-source filesystem reachability in docs-content; bundle navigation and lazy-load validation policy there while preserving deployment-neutral ownership and all docs-fumadocs code.                             |
| Turbo/Knip/ignore/lint boundaries                             | Change required / Preserve | Reach root Alchemy through development and production Knip, admit only exact new config/test/process adapters to existing lint boundary lists, ignore transient `.wrangler`, and preserve Turbo until retirement evidence requires a change. |
| Nitro/Vercel harness                                          | Preserve temporarily       | Keep it independent until DCD-005 parity and retirement.                                                                                                                                                                                     |
| Runbooks/provider authority/automation/hosted screenshots/DNS | N/A in DCD-001             | No provider procedure, external receipt, credential or mutation is admitted by local proof.                                                                                                                                                  |
| Changesets                                                    | Change required            | The docs-content Worker-compatibility behavior change requires patch Changeset `.changeset/fresh-workers-render.md`; retain it unconsumed.                                                                                                   |

## Validation log

### 2026-07-29 — implementation admission

- Confirmed inherited HEAD
  `96a825cebd22798044678389851be6ee9154d1df` and a clean worktree.
- Loaded the approved SPEC, sibling ledger, repository router, docs router,
  repository-local implementation/documentation/provider-boundary skills, local
  profile and material harness invariants.
- Created one active coordination goal for DCD-001 through DCD-005 before any
  repository edit.
- No dependency, source, provider, credential, deployment, public URL, rollback
  or external-state claim exists yet.

### 2026-07-29 — DCD-001 provider-free seam stop

- Read exact `alchemy@2.0.0-beta.64` package source and npm metadata. Package
  integrity is
  `sha512-gjDKSezvKSR9SMcyb6OajAWHcMMOWwZo3l5MKYVeO6O1PktOz4KMncP05j1IWwryG6BAu8/a/s2shtsn6TeEsA==`.
- `src/Cloudflare/Workers/WorkerProvider.ts` privately imports `./Vite.ts` and
  calls `viteBuild` during deployable Worker preparation.
- `src/Cloudflare/Workers/LocalWorkerProvider.ts` calls `viteDev`; documented
  `alchemy dev` therefore runs Vite development under workerd and does not emit
  the collected production Worker/assets result.
- `src/Cloudflare/Workers/index.ts` does not export the Vite module. The
  package's more-specific `./Cloudflare/*` export maps
  `alchemy/Cloudflare/Workers/Vite` to a nonexistent `Vite/index` module.
  Isolated exact-version probes under both Bun and Node therefore fail module
  resolution; the package-wide wildcard does not rescue the import.
- The exact internal graph uses
  `@distilled.cloud/cloudflare-vite-plugin@0.13.8` and
  `@distilled.cloud/cloudflare-runtime@0.13.8`, which pins
  `workerd@1.20260704.1`. Cloudflare's separately published official Vite
  plugin would build a different artifact and is not an acceptable substitute.
- DeepWiki independently identified no provider-free production-emission API,
  but its indexed file model predates this exact beta.64 layout; the npm
  tarball and official docs remain the authority.
- Exact `alchemy@2.0.0-beta.65` and current upstream revision
  `f998d999b039941ac7d529de1e6e545757c7454a` retain the same split and export
  map, so there is no published exact successor with the missing seam.
- Beta.64 does publish a different supported composition:
  `Command.Build` can own an external build output and
  `Cloudflare.Worker({ bundle: false })` can upload a prebuilt Worker plus
  assets without rebundling. Pairing those with exact
  `@cloudflare/vite-plugin@1.47.0` would replace Website.Vite's Distilled
  plugin and preserve same-artifact proof. Cooper accepted that material
  architecture amendment on 2026-07-29 and reaffirmed it on 2026-07-30.
- No dependency, app, Alchemy composition, harness or provider change was
  attempted while the stop condition was unresolved. Cooper subsequently
  authorized the bounded official-Cloudflare-build/public-Alchemy-prebuilt
  composition spike; the failed Website.Vite evidence remains retained and
  disconfirming.

Limitations and non-claims: this is dependency/source evidence only. It does
not prove that TaxKit builds for Cloudflare, runs in workerd, satisfies Worker
limits, or can deploy. No provider, remote state, credential or external
resource was accessed.

### 2026-07-30 — resumed DCD-001 candidate

- Froze Effect, Platform Bun/Node, Effect Vitest
  `4.0.0-beta.100`, Alchemy `2.0.0-beta.64`,
  `@cloudflare/vite-plugin@1.47.0`, and Wrangler `4.114.0`; the official
  plugin resolves workerd `1.20260722.1`.
- The independent review caught prerelease-caret drift before acceptance:
  Platform Bun/Node had resolved `@effect/platform-node-shared` beta.102 and
  Alchemy had resolved `@effect/sql-d1` beta.102, both requiring Effect
  beta.102. Root overrides now constrain both to exact beta.100. Frozen
  readback shows every resolved Effect 4 package on beta.100.
- npm metadata and the lockfile agree on package integrity:
  Effect `sha512-K4ed+BS3HyE+NoAZ8pJss2DpuK41mb856IO7ZlPfnwBXbq8oTtAAurrsVnwe2hzPamIuaZp/Pq4/xp9qORYv8Q==`,
  Platform Bun
  `sha512-UyH4bgzlV3aJOXbUr/3Zej3MBPe9TDrdkwStLDpVn9Yc6dKIKOJBd0G/8+OQhunGAuCL9a4SaNvwhkMJajahrg==`,
  Platform Node
  `sha512-nH5xgxOLfPj5Bi0/o4OaDsR98Z59lHKGty+TDqckg7zRz6jry82hGW982NRPduzX0MJloDsGp/3rfeN4Hu7Keg==`,
  Platform Node Shared
  `sha512-PMsCXQeK2wnlmnqGCc79oqK9CX8ipZvoHxAy/CRojMF+zHIluxh61L3pzWAYEbMb19Be4Bxgqs7gK2hiV8H8Pg==`,
  SQL D1
  `sha512-PBxlUPYAapFbm3GbYX6TVkVFtr+NyFVCzDPuMxxXTY0zlR8K10fH+RBqxUIDLcKsA4ho9GW2ljFkLOB9mLhpyg==`,
  Effect Vitest
  `sha512-WoxrzPuxc+4QXb+7D1j8PwaBb9zVxHM2yw0sDz7fXij1Sx7X7T6LkYJ7m2xzWbfskIXxIdXVA+NnDSF8qAOGsw==`,
  Alchemy
  `sha512-gjDKSezvKSR9SMcyb6OajAWHcMMOWwZo3l5MKYVeO6O1PktOz4KMncP05j1IWwryG6BAu8/a/s2shtsn6TeEsA==`,
  Cloudflare Vite plugin
  `sha512-WyGNYtJ2nzcJXtlwCHTO5S5+flFaYhfH5WfFfx6IpGf2Y/oNwyizEW9mNSImpg65PWmDs1715Pk/vGSKKtYJ1w==`,
  Wrangler
  `sha512-M65P25t5UHA1TIJfgZXDcj+YzVobgKdRguM2QPz0xnxLFuOcuE3ErgllDht0iaho7MS4o0g/Bb4YK2+GT+bibg==`,
  and workerd
  `sha512-NycKuc1x2onvsRfGGpM093vRlLFU2zHDAM0+APpccfg4+gZxDGCH27RmdDvkeBuoZyYqgLo3oAfF6re4mvC3vQ==`.
  Alchemy's Effect/Platform peer floors are beta.100; the official plugin and
  Wrangler resolve their exact workerd line while Alchemy's unused private
  Distilled path retains separate workerd `1.20260704.1`.
- Added the Schema-decoded `cloudflare` build target and public Alchemy
  `Command.Build("DocsBuild")` to `Cloudflare.Worker("DocsWebsite",
  bundle: false)` composition. It consumes the same
  `dist/server/index.js` and `dist/client` output exercised locally.
- The first Worker-first routing attempt returned an asset `404`; official
  asset-first routing is now retained, with immutable `/assets/*` policy owned
  by `apps/docs/public/_headers`.
- The first request-time workerd attempt exposed eager filesystem reachability
  through docs-content validation policy. The earliest owner now bundles
  navigation and lazy-loads the validation-only policy. No deployment concern
  entered either content package.
- `bun run --filter=docs test:cloudflare-built` passed against an isolated
  copy containing only the emitted `dist` tree. It recorded SSR `200`, native
  `404`, immutable assets, three server-function requests, zero
  client-navigation document reloads, zero browser diagnostics, one
  module-scoped runtime construction across sequential/concurrent requests,
  one stable isolate identity across nine concurrent requests, an observed
  pinned-workerd descendant with no surviving observed descendant,
  `515.37 KiB` compressed upload, approximately `3,062.48 KiB` uncompressed
  upload, `888.20 ms` local process-to-first-response and `103.56 ms`
  first-response-request observations, and normalized deployment-input digest
  `d775395d4e2040dbe105fce6618265c40b7056dcc8a346e90a603839a77ca56f`.
  Local timing is not Cloudflare CPU-startup-limit validation.
- The proof used a minimal allowlisted environment for build, Wrangler, Git
  readback and Chromium, used Wrangler dry-run and local mode only, found no
  bindings or stateful resources, and did not initialize Alchemy state or
  contact Cloudflare.
- The app-owned opt-in runtime proof headers expose only a construction count
  and random isolate identifier. They are temporary migration instrumentation,
  not a public API; DCD-005 retires them after an equally strong non-public
  provider oracle exists, or retains their explicit bounded carrying cost if
  no such oracle exists.
- The independent Nitro harness remained green when run after its build/type
  prerequisites. Concurrent Knip/build commands in the shared checkout twice
  removed and regenerated docs-fumadocs output while a candidate build was
  consuming it; the independent reviewer confirmed that overlap and stopped
  all build commands. Isolated reruns passed. Acceptance serializes commands
  that mutate shared ignored build output; this is proof-orchestration
  evidence, not a Worker runtime or dependency failure.

The exact-commit DCD-001 rerun is bound to
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`. It proves no Preview,
Production, provider state, public URL, teardown or rollback claim.

### 2026-07-30 — bounded independent DCD-001 review

The independent reviewer inspected the SPEC/task crosswalk, dependency graph,
Worker harness, runtime/authority boundaries and documentation without editing
tracked files or accessing providers. Findings required: exact beta.100
transitive overrides; generated local/deploy compatibility comparison; an
exact navigation-bound successful `/_serverFn/` response; minimal child
environment allowlisting; positive pinned-workerd descendant identity and
cleanup; normalized deploy-input hashing; removal of the false one-second
startup comparison; explicit runtime-instrumentation ownership; and a focused
docs-content Changeset. Each finding is corrected in this slice. The review
also confirmed the live runtime has no scoped acquisition/finalizer/timer and
that Nitro remains an independent oracle. Its final read-only closure confirmed
those corrections; the only stale machine-ledger decision it found is corrected
to `change_required` for the retained patch Changeset. Exact-commit workerd
readback remains intentionally post-commit.

Validation:

- `bun install --frozen-lockfile` passed with 889 installs across 1,097
  packages and no lock change. Exact package/lock readback resolves Effect,
  Platform Bun/Node/Node Shared, SQL D1 and Effect Vitest to beta.100,
  Alchemy beta.64, Cloudflare Vite plugin 1.47.0, Wrangler 4.114.0 and the
  official-plugin workerd 1.20260722.1.
- Focused package/app checks passed: docs-content 2 files/6 tests,
  docs-fumadocs 2/6, docs server 2/11, docs browser 1/7, route boundary 6,
  docs validation zero issues, import boundaries, docs type check,
  deployment-composition type check, and repository-wide 23/23 Turbo type
  tasks.
- Both built-app oracles passed serially. Nitro recorded SSR `200`, missing
  `404`, zero client-navigation documents, eight server-function requests and
  zero diagnostics. The final pre-commit Cloudflare run recorded the
  candidate identity and observations above.
- `bun run lint`, `bun run test:oxlint` (35 tests), development Knip,
  production Knip, `bun run check:quality-workflow`, and
  `bun run test:quality-workflow` (10 tests including the isolated mutation
  suite) passed.
- Docs-maintainer closeout passed: docs types; documentation policy with 815
  inspected and zero violations; four-runbook validation with zero
  violations/zero execution; repository paths over 804 tracked files; 21
  skill tests; Changeset status; format check; JSON decode; and
  `git diff --check`.
- `bun run check:harness-governance` stopped at the checkout's
  `canonical-skill-tree` baseline before reaching a claim about this change.
  This slice does not alter the canonical skill tree or its receipt, and the
  mismatch remains the one explicit repository-verification limitation rather
  than being repaired outside DCD-001. Because `bun run verification` stops at
  that owner, every subsequent verification owner was also run directly and
  passed.

## 2026-07-30 — DCD-002 authority and trusted-candidate preflight

Cooper's dated authority envelope is now recorded in the target runbook,
authority model and Schema-decoded receipt. Read-only preflight observed:

- exact local candidate
  `669a8f3bc484ddf5975f40940c8bdc14e6f1ba11` on detached `HEAD`;
- authenticated GitHub principal `crcorbett`, but GitHub returned no commit
  object for that SHA and therefore no trusted PR head or number;
- authenticated Alchemy `default` Cloudflare OAuth profile for sanitized
  account `f9f94270a4a5af8af7010d891020922d`;
- an independently expired Wrangler session and no Cloudflare environment
  credential; and
- zero Alchemy state, plan, deployment, teardown or provider mutation.

The exact stop is retained at
`docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json`.
Push and PR creation remain outside scope, so inventing `pr-N` would violate
the trusted-candidate and exact-stage contract. DCD-002 remains `in_progress`;
DCD-003 through DCD-005 remain dependency-blocked, not approval-blocked.

The local tool owner now also reuses the app-owned branded stage Schema and
defines the exact sanitized plan projection/digest, provider readback, hosted
oracle and screenshot manifest contracts required after the candidate gate.
Four focused policy tests prove the current preflight receipt, stable journey
inventory, canonical plan/provider/screenshot binding and rejection of secret
admission. No future provider command literal is recorded before execution.

The provider-free regression oracles were rerun after extracting that shared
stage owner. The Cloudflare/workerd path remained green with SSR `200`,
immutable assets, native `404`, three server-function requests, zero
client-navigation document reloads, zero diagnostics, `515.37 KiB` compressed
upload, `1,258.60 ms` local process-to-first-response and `216.15 ms` local
first-response-request observations. The independent Nitro/Vercel path remained
green with SSR `200`, native `404`, zero client-navigation document reloads,
seven server-function requests and zero diagnostics. These are local
regression observations only; neither is hosted Preview or provider proof.

The smallest recovery is separate authority to publish this exact commit and
create or identify its trusted PR, followed by fresh identity preflight. The
provider authority already granted does not need to be repeated. No rollback
is required because mutation count is zero.

### 2026-07-30 — successor Git authority

Cooper authorized one branch
`codex/docs-cloudflare-alchemy-deployment` rooted at exact DCD-001 candidate
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`, its push to `origin`, one draft
pull request against `main`, exact remote/PR readback, and later coherent
accepted-slice pushes to the same branch. The Schema-decoded pre-mutation
receipt is
`docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json`.
It preserves the validated uncommitted DCD-002 work and retains merge,
force-push, branch deletion, conversion to ready, release/tag/publication and
unrelated GitHub mutation as explicit stops.

Remote and GitHub readback subsequently confirmed draft pull request `#1`,
base `main` at `9c82bf9613b1342375ff670c46ee34cc8347af1d`, and head
`codex/docs-cloudflare-alchemy-deployment` at exact DCD-001 candidate
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`. The exact receipt is
`docs/evidence/deployments/2026-07-30-preview-preflight/git-readback.json`;
the derived Preview stage is `pr-1`. No provider/state claim follows from
this Git readback.

Changeset impact is evidenced `N/A` for this partial DCD-002 owner admission:
it changes repository operations, documentation, validation and receipts only;
no package export, runtime behavior or published package contract changes.

### 2026-07-30 — superseded Preview observation and evidence gap

Three focused Alchemy corrections followed the retained failed apply:

- `12c09122a388ffbad666630f3796ff404ea7aad7` aligned root composition
  with the emitted server/assets output;
- `3cf2a626ee6bb4b315cd0c0633d3c3c1decd379b` deferred Worker upload until
  the command-owned build completed;
- `e4e3dd9c703928c365612a698673a19493568b33` admitted provider
  `workers.dev` routing; and
- `0d714e61e3d61fdf3c4632758ed9b716b3d793a8` passed the app-owned
  `_headers` file through public `Cloudflare.Worker` asset configuration after
  hosted readback exposed Cloudflare's default revalidation policy.

Each correction invalidated the preceding candidate and plan. Candidate
`0d714e6…` was rebuilt from a clean detached worktree with a frozen lock and
the exact DCD-001 dependency graph. Its identities are:

- lock SHA-256
  `6d5e4ce309f557483eba5638d7501c183e523822bf147b976d72d13908d4224b`;
- configuration SHA-256
  `fd12cc9d24dd9cb70dc0d0d16e5401325219c1c337464cc9b7379a9185cb2f62`;
- normalized deployment-input SHA-256
  `2c460d445ac557db00450cbc6b9f7d4051fb057dab505cc871405f9436d65616`;
- assets SHA-256
  `fbdda0f0394afbb7b2809f5123ca86139d5b7ddd51422b2221fb172b9cff87fd`;
  and
- Worker-modules SHA-256
  `8af51492d85db13d172444abb84eb8e7cab7dcb5c950a7f3eb8772d656c3120e`.

Two sanitized plans agreed on digest
`f65aeb059b887e85842d9bc7cb44d5d8e93b6bf98fb1c51e2d23ff266af5e2e9`
and selected only `DocsBuild` plus `DocsWebsite` in stack
`TaxKitDocsCloudflare`, stage `pr-1`. The authorized apply produced physical
Worker
`taxkitdocscloudflare-docswebsite-pr-1-gmbqzfy4li5fshhm`, deployment
`01a2afad-33d5-4b28-af6b-879625f3dcb2`, version
`bb5b595b-dd5c-4f66-b48f-e16ec2d8ddcb` and its provider-read-back
`workers.dev` URL. Alchemy state version `7` and independent Cloudflare
readback agreed on the Worker, stage, assets and URL. Provider settings
confirmed compatibility date `2026-06-24`, `nodejs_compat`, invocation-log
persistence enabled and traces disabled.

The exact hosted command created by this slice passed initial SSR, native asset
content type and immutable caching, server-function success and malformed-input
rejection, direct/client `404`, hydration, Reference navigation with zero
document requests, focused accessibility, empty browser diagnostics and one
module-scoped runtime construction across two observed requests in one
observed isolate. Its reviewed evidence includes:

- desktop `1440x1000` PNG SHA-256
  `2178f0005d757ff3fa6b3cd9cd54b00f4e255c105315ec17a1f3871bb36cb10f`;
  and
- mobile `390x844` PNG SHA-256
  `86c685b85e2a016e96ca85ee94984ea4dd155094af66bbf6740dde41658eb9bd`.

Two destroy dry-runs agreed on digest
`fc9b66099f3566c764dded626fa4ec1ee9f687c7e41fde9bca7a8dbc3fd9b4b3`.
The authorized exact-stage destroy then removed the Preview. Cloudflare
settings and the hosted URL returned `404`, matching Worker inventory was
empty, and Alchemy listed no `pr-1` stage or resources. State version `7`
returned `{}` from `getOutput` after deletion; the receipt records that
bounded quirk instead of using it as the primary absence oracle.

Receipts live under
`docs/evidence/deployments/2026-07-30-preview-pr-1/`. The original failed
apply, superseded plan identities and all non-claims remain unchanged.
Independent review found that this observation lacked exact pre-mutation
state/provider receipts, did not fail on isolate mismatch, did not observe
mobile request failures, did not require public caching, and did not fully
bind screenshots or state readback. It is historical disconfirming evidence,
not DCD-002 acceptance. This observation proves neither a currently available Preview nor Production,
rollback, public-domain, DNS, release or publication state. Account billing
plan/cost remains unverified because the subscription endpoint returned
`403`. Changeset impact remains evidenced `N/A`: DCD-002 changes a private app,
root deployment composition, repository operations/proof and documentation,
not a published package contract.

A fresh closeout probe confirmed the default Alchemy OAuth identity still
resolves sanitized account `f9f94270a4a5af8af7010d891020922d` with expiry
`2026-07-30T18:25:04.972Z`. Installed beta.64's generic
`alchemy state stages/resources` CLI cannot inventory this stack because it
evaluates `alchemy.run.ts` under its internal `placeholder` stage and TaxKit's
fail-closed stage Schema rejects that value. The accepted receipt instead uses
direct Schema-decoded Cloudflare and state-store readback. TaxKit will not
weaken stage admission or branch on an upstream internal sentinel. DCD-004 must
own a supported repeatable state/provider readback command before workflow
admission.

### 2026-07-30 — fresh candidate-bound Preview requalification

Focused correction `d9cb8945529fb72158e59ca0daf02a98e1e4de1a` added the
fail-closed hosted evidence inputs and was pushed as the exact draft PR `#1`
head. A clean detached checkout with frozen lock
`6d5e4ce309f557483eba5638d7501c183e523822bf147b976d72d13908d4224b`
passed local workerd and retained Nitro built-app proof. Canonical source
configuration digest
`8cca8bb6717fa857ffd34820eaa15f8538efc4484296d74e24cedac59268cbd3`
and path-sorted emitted-output manifests bind deployment-input digest
`dc49b540f885bc7c254dba2ef1c634c5539bde1f93b1b864a7863049da1fcb39`.

Before deploy, direct Cloudflare readback found zero matching TaxKit Workers
and public Alchemy state-service readback found no `pr-1` stage/resources.
The existing 27-scope OAuth capability set has retained digest
`de63872ab5516eb3389bd082782df3743676528eb289a9f99486a1de9c8892a2`;
its breadth is a limitation, while operation authority remained restricted to
the exact two-resource plan. Two plans selected only `DocsBuild` and
`DocsWebsite` for creation and agreed on canonical projection digest
`97a6b9f44b250b7aad3146df5f72bf05e5a8e13f089460ed4aace035a9f256b2`.

The authorized apply created Worker
`taxkitdocscloudflare-docswebsite-pr-1-cvy3nfe2aq574ufb`, deployment
`7d018c5a-ddc1-4865-9a42-f85a563cff80`, version
`6025d469-df8f-4bda-88d2-eaee4545723f` and its read-back `workers.dev` URL.
Cloudflare and state version `7` agreed on stage, Worker and assets; the
structured provider receipt also records invocation-log persistence and
disabled traces. Compatibility date and flags remain build-composition
evidence from DCD-001 rather than a DCD-002 provider-readback claim.

The corrected hosted owner passed initial SSR, native assets with `public,
max-age=31536000, immutable`, server-function success and malformed-input
rejection, direct/client `404`, hydration, no-document navigation, focused
accessibility, empty desktop/mobile diagnostics, and equality of two opt-in
isolate observations with one module-scoped runtime construction. The reviewed
candidate-qualified desktop/mobile PNG digests are
`2178f0005d757ff3fa6b3cd9cd54b00f4e255c105315ec17a1f3871bb36cb10f`
and
`86c685b85e2a016e96ca85ee94984ea4dd155094af66bbf6740dde41658eb9bd`.

Before teardown, provider/state identities still matched and two exact-stage
destroy dry-runs agreed on projection digest
`da82698225817ed2476fe869ee665c575da7f11b05d6465e1e356018f2718649`.
Destroy removed only the two named resources. Final readback found zero
matching Workers, Worker settings and hosted URL `404`, and no `pr-1`
stage/resources. Cloudflare briefly served the deleted hostname after
settings/state absence; acceptance waited for URL `404`. DCD-002 remained
`in_progress` at that observation until full gates and fresh independent
review passed.

The first fresh adversarial review then found two executable false-green
boundaries: a self-consistent hosted receipt was not cross-bound to the
canonical provider readback, and the deploy preflight's account comparison was
tautological while its scope digest lacked an independent expected identity.
It also found current focused tests still using the historical teardown chain
and one overstated compatibility-readback sentence. The evidence-policy owner
now compares the complete hosted provider record, decodes a minimal sanitized
credential readback and binds its account, scope digest, expiry, profile,
candidate and stage to both mutation preflights. Negative tests reject hosted,
account, scope and destroy-target mismatches; current tests use only the
`d9cb894…` acceptance chain while runtime validation still decodes the older
chain as disconfirming history. The compatibility claim is narrowed above.

The same independent reviewer re-ran those attacks and returned `READY` with
no remaining finding. Focused types, fourteen policy tests, the complete
receipt validator, runbook validation and `git diff --check` passed after the
correction. Final repository verification and docs-maintainer reconciliation
closed the proportional profile/runbook requalification. DCD-002 is accepted;
the Preview remains absent and this evidence proves neither Production nor
rollback. Changeset impact is evidenced `N/A`: this slice changes the private
docs app, root deployment composition, repository-only proof/control owners
and maintainer documentation, with no new package-facing behavior beyond the
already retained DCD-001 Changeset.
