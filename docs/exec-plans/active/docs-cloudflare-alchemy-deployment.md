---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-docs-deployment-implementation-owner
last_reviewed: 2026-08-09
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
bounded delivery automation, and an accepted rollback path. The docs-app
Nitro/Vercel bridge is now retired locally after parity; final lifecycle
acceptance still requires claim-matched hosted requalification and the
report-only state boundary.

One thread goal coordinates the whole accepted SPEC. The sibling ledger remains
the milestone and acceptance owner.

## Status

| Task      | Status      | Evidence                                                                                                                                                                                                             |
| --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DCD-001` | completed   | Accepted at `669a8f3…` after exact dependency/integrity readback, both built-app oracles, docs-maintainer reconciliation, focused Changeset, independent closure, and all change-owned gates. |
| `DCD-002` | completed   | Accepted candidate `d9cb894…` passed fresh pre-deploy and pre-destroy state/provider readback, equal plans, Preview apply, the complete hosted/browser/screenshot contract, exact-stage teardown/absence, all gates and corrected-boundary independent review. |
| `DCD-003` | completed   | Accepted after fixed Production, separately Preview-qualified successor, successor Production, restored-source rollback, provider/hosted/screenshot readback, owner reconciliation, full verification and corrected-boundary independent review. |
| `DCD-004` | in_progress | Mutation workflow plan/deploy/teardown receipts now pass on the default branch, including Preview, fixed Production, rollback and PR-close no-op; report-only inventory remains an explicit capability stop because the read-only token cannot derive Alchemy's state-store bearer. The automation register remains `not-established` as an aggregate claim. |
| `DCD-005` | pending     | Docs-app bridge-retirement implementation is present and locally qualified at `d649a14…`; waits for exact-candidate hosted Preview/Production/rollback requalification, the report-only state boundary, fresh independent review and complete closeout evidence. |

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

### 2026-07-30 — DCD-003 fixed Production and normal rollback observation

The accepted DCD-002 candidate
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a` retained source-config digest
`8cca8bb6717fa857ffd34820eaa15f8538efc4484296d74e24cedac59268cbd3`,
lock digest
`6d5e4ce309f557483eba5638d7501c183e523822bf147b976d72d13908d4224b`
and deployment-input digest
`dc49b540f885bc7c254dba2ef1c634c5539bde1f93b1b864a7863049da1fcb39`.
Two fixed-stage create plans agreed on sanitized digest
`78f27f84192f60bde775224446ff01c59703e15a7d5227030155b0f98cf2c506`
and selected only `DocsBuild` plus `DocsWebsite`. The authorized Production
apply created Worker
`taxkitdocscloudflare-docswebsite-prod-ujphggiaxw5ryjev`, deployment
`6ba54ad9-b281-44dd-bfe5-2956776d8935`, version
`fab01e64-2ffa-4dc1-87f7-5497af95857a` and its stable read-back
`workers.dev` URL. Provider and Alchemy state version `7` agreed.

The complete hosted contract passed at the read-back URL: SSR, content-typed
immutable assets, successful server functions, malformed-input rejection,
direct/client `404`, hydration, no-document client navigation, focused
accessibility, clean desktop/mobile diagnostics and two opt-in requests
observing one module-scoped runtime construction in one observed isolate.
Reviewed desktop and mobile image digests were respectively
`2178f0005d757ff3fa6b3cd9cd54b00f4e255c105315ec17a1f3871bb36cb10f`
and
`86c685b85e2a016e96ca85ee94984ea4dd155094af66bbf6740dde41658eb9bd`.

A normal rollback rehearsal required a distinct source candidate rather than
misrepresenting same-source convergence as rollback. Existing reviewed commit
`c99984c9f89b79027ecb7ea147aa1322b92d2cdf` changed repository-only DCD-002
owners while leaving deployment-critical source config and lock inputs
unchanged. A clean frozen rebuild produced distinct path-bearing output and
deployment-input digest
`42b6584e8f786f123e953f63769efbd03abb629b62695917f5ba37dd926361e9`;
no byte-identity claim is made.

Candidate c999 first passed isolated `pr-1` equal create plan
`771fde06c1b012e488865be4095a521c1788d6379bf6154db19ed6ba31affbf8`,
provider/hosted/screenshot proof and equal destroy plan
`ca6feff415a97550efa625dd78c9c1a9a9720e929f6f6cfbb41fb781f5306d7a`.
Readback then proved that Preview Worker, URL and stage absent. Its Production
equal update plan
`0d8d2533e4d1975fee3956464a831eb9f819c831b53e9f6ef1c3c74e13e29ed6`
preserved the fixed Worker, URL and Alchemy instance while creating deployment
`bb2b004d-65f3-4a0d-9d73-3b0bff7aa8a6` and version
`0f7de178-8ca5-4573-a5a3-a35ea353cbe8`; hosted and screenshot proof passed.

Finally, two rollback plans restoring d9 agreed on digest
`4859d5b9977e07949baa4cfbba2495318ff21e8f89ac11a1a56c2696690d4fcb`.
The same normal deploy graph preserved Worker, URL and state instance while
creating deployment `bb00213f-f110-4732-a432-66825769e5a1` and version
`47e7f073-b629-44f7-ad0f-bebcc7c3513b`. Final state bundle
`6c1276f7dee956375e462c2a57e3b988f51f255297bce197aa34810ab3f4081f`
equals the initial d9 Production bundle, and the full hosted/screenshot
contract passed again. The latest dated readback observed restored d9; it is not
a timeless availability claim.

The verified mutation invocations were the runbook-owned
`ALCHEMY_PLAIN=1 CI=1 bunx alchemy deploy --dry-run --stage prod --profile default --yes`
(twice per candidate) followed by
`ALCHEMY_PLAIN=1 CI=1 bunx alchemy deploy --stage prod --profile default --yes`.
The c999 Preview used the already verified `pr-1` plan/deploy/destroy commands.
Each hosted invocation used `bun run --filter=docs test:cloudflare-hosted` with
the exact read-back URL, source, plan/config/lock/deployment-input,
Worker/deployment/version, environment, evidence path and recovery identity
inputs required by the runbook.

The cross-receipt validator now fails unless the successor Preview is
qualified and absent, two viewport classes bind each hosted provider identity,
Production deployment/version IDs change, Worker/URL/state identity remains
stable, and the restored bundle matches the initial accepted source. A
previously unvalidated absent-stage flag was corrected from identity agreement
to disagreement, and an exact c999 Git/credential receipt now prevents reuse of
d9 identity. The receipt records no token values.

Limitations and non-claims: Cloudflare billing subscription readback remained
forbidden, so no paid plan is claimed. Cooper accepted the standard usage model
and documented `workers.dev` business-critical limitation. This rehearsal did
not introduce broken content and does not prove byte promotion, direct-version
break glass, custom-domain/DNS state, release or publication. DCD-003 remains
`in_progress` until docs-maintainer reconciliation, broad verification and
fresh independent acceptance finish. Changeset impact is evidenced `N/A`
because this slice changes private deployment operations, repository-only
proof/Schemas and documentation, not package-facing behavior.

### 2026-07-30 — DCD-003 first adversarial false-green review

The required fresh independent reviewer returned `NOT READY` even though all
then-current decoders and gates passed. `DCD3-FG-001` showed that consistently
rebound delete/no-op plans could pass; `DCD3-FG-002` found accepted Preview,
credential and fixed-Worker fields in the initial Production preflight were not
cross-bound; `DCD3-FG-003` found successor/rollback authority and credential
fields could disagree; `DCD3-FG-004` found rollback evidence paths were
decorative; `DCD3-EVID-005` found initial and restored d9 manifests pointed to
the same later-overwritten filenames; and `DCD3-CLAIM-006` rejected timeless
“remains live” wording.

The earliest policy owner now enforces Preview create/destroy and Production
create/update actions, all accepted Preview source/config/lock/input and dated
credential identities, authority-operation pairing, credential validity at
preflight time, fixed Worker prefix/subdomain, rollback qualification, every
loaded rollback path and screenshot epoch semantics. Negative tests attack
destructive plan actions, accepted Preview/scope drift, authority mismatch,
rollback path substitution and restored bundle mismatch.

The initial and restored d9 manifests had independently recorded identical PNG
digests before the filename overwrite was noticed. They now explicitly share
content-addressed desktop/mobile bytes while retaining distinct
candidate/deployment/version/capture/review manifests; validation fails unless
both epoch manifests admit that deduplication and agree on path and digest.
No image was fabricated or relabelled as a distinct capture. Durable wording
now says only that the latest dated readback observed restored d9. DCD-003
remains `in_progress` pending corrected gates and adversarial closure.

Draft PR `#1` readback at remote head `c99984c…` still reports two failed
Quality aggregates. Both hosted logs show canonical `bun run verification`
passing and the later `bun run test` stage failing. The exact unchanged
`packages/scripts/src/release-readiness/evidence.boundary.test.ts` baseline was
already reproduced at the reviewed parent and branch head; no DCD-003 path
touches that owner or immutable HGI evidence. A later direct one-file diagnostic
was manually stopped after producing repeated timeout-only messages and is not
acceptance evidence. The change-owned DCD-003 repository verification passes;
the remote aggregate remains an explicitly retained unrelated baseline, not a
green CI claim.

### 2026-07-30 — DCD-003 independent closure and acceptance

The first two adversarial passes remained `NOT READY` until the executable
owner rejected plan-action substitution, detached Preview and credential
identity, authority-operation drift, decorative rollback paths, ambiguous
screenshot epochs and timeless availability wording. The final bounded review
returned `READY` after the durable suite added explicit late-readback and
expired-preflight attacks for Preview, initial Production, successor
Production and rollback Production. It also proved that distinct screenshot
paths remain valid while a shared path requires equal image digest, a
digest-addressed filename and explicit content-addressed admission in both
manifests.

The final focused policy run passed `16` tests with `44` expectations, and the
cross-receipt validator decoded the retained Production directory with zero
violations. Repository verification, docs/runbook/path checks, the Nitro
built-app regression oracle and diff hygiene passed before acceptance. The
review did not call providers and does not refresh the dated Cloudflare,
credential, availability, DNS, publication or release observations.

DCD-003 is accepted. DCD-004 is the next dependency-ready milestone. Production
is not destroyed, and no timeless availability claim is made.

### 2026-07-30 — DCD-004 automation admission grounding

DCD-004 began from clean local/upstream commit
`114bce654baad8377667c701988b4fdfc3b4685c`. Draft PR `#1` was open and draft
at that exact head against `main` `9c82bf9…`; its two Quality jobs were queued
at readback. The TaxKit repository reported zero GitHub environments and zero
repository Actions secrets, with default workflow permission `read`. This
establishes neither credential absence outside GitHub nor authority to create
environment resources; it means no hosted mutation workflow can yet claim a
protected environment or GitHub-hosted credential identity.

The current reference implementation was read from its remote `origin/main`
revision `0bdf6cd3e2c405b6ab1ce97a665b6fc26f20cc4c`, not a stale local
checkout. TaxKit adapts only exact-SHA checkout, frozen installation,
digest-bound two-phase mutation, non-cancellable mutation concurrency and
retained receipt principles. It rejects reference-specific stack, domain,
Axiom, AOX, secret, hard-coded URL/version and package-script machinery.

The local DCD-004 owner and negative workflow policy can proceed. Hosted
workflow execution remains a capability gate until the workflow exists on the
default branch and the named protected environments and secret identities are
available. Creating or weakening those GitHub resources is not inferred from
repository-edit or branch-push authority.

Read-only installed-version proof showed that the public `Cloudflare.state()`
Layer can inventory the exact stack without evaluating `alchemy.run.ts` under
the rejected `placeholder` stage. With state version `7`, it observed stack
`TaxKitDocsCloudflare`, only stage `prod`, and the two expected logical
resources. A separate authorized Production dry-run selected exactly
`DocsBuild` and `DocsWebsite` for update and performed no mutation. These
observations prove a viable DCD-004 readback implementation route; they do not
admit a workflow, refresh Cloudflare Worker/deployment/version availability or
replace the dated DCD-003 receipts.

The smallest unresolved capability is external rather than architectural:

- the reviewed workflow implementation must first exist on the default branch,
  which requires a merge and any draft-to-ready transition outside current Git
  authority;
- GitHub must have separately protected Preview, Production and Preview
  teardown environments; and
- those environments need narrowly scoped account/token secret identities
  supplied without exposing, copying or widening the current local OAuth
  credential outside an explicit credential-storage authority.

Until those conditions exist, DCD-004 remains `in_progress`. Do not add dormant
workflow command literals, auto-create unprotected environments, move provider
credentials into Quality, or claim a hosted workflow receipt. Recovery is to
retain the accepted manual runbook path and resume the workflow/code/control
slice only after the exact GitHub environments, credential principals and
default-branch execution path can be tested.

Both Quality runs for exact remote head `114bce6…` completed with the same
bounded result as earlier heads: canonical `bun run verification` passed, then
the aggregate `bun run test` boundary exited `1`. Hosted logs did not identify
a new DCD-003 or DCD-004 owner, and the previously reproduced unchanged
release-readiness evidence-boundary baseline remains the applicable
classification. This is not a green CI claim and does not relax the DCD-004
requirement to consume a successful exact-candidate Quality result before
workflow mutation.

The first local DCD-004 owner is now concrete:

- `tools/docs-deployment/automation.schemas.ts`,
  `automation-register.json`, `controls.json`, `automation.policy.ts` and
  `automation.policy.test.ts` own exactly three mutation contracts and one
  report-only orphan contract;
- `tools/docs-deployment/automation.check.runtime.ts`, reached by
  `bun run check:docs-deployment-automation`, decodes both registers, enforces
  exact per-class principals, credential/resource/denial sets, triggers,
  revision sources, Quality stops and cross-field identities, rejects every
  external establishment until a hosted receipt decoder exists, and reports
  the number of externally established entries;
- all four entries remain `not-established` with no receipt, matching the
  GitHub environment/secret/default-branch capability readback; and
- root verification and development Knip now reach the focused owner, while
  Quality's provider-free, read-only authority remains preserved.

Focused acceptance currently passes the deployment tool typecheck, the new
automation validator and `27` deployment-policy tests with `61` expectations.
This admits local desired state only; it is neither a hosted workflow receipt
nor DCD-004 completion.

The task-created provider-bound command is now exactly
`bun run check:docs-deployment-inventory`. It owns a small
`DocsDeploymentInventory` service/Layer, branded stage/resource/Worker
identities, tagged input/read/disagreement errors and one-time Schema decoding
of state and provider ingress. Its test Layer accepts agreement and rejects a
different physical Worker. The live command fails before state initialization
unless `CI=1`, cached state-store credentials exist and their account identity
matches the authenticated Cloudflare environment; it never emits credential
or account values.

The latest authorized execution observed state store `cloudflare-http` version
`7`, only stage `prod`, logical resources `DocsBuild` and `DocsWebsite`, and
one matching Alchemy-tagged physical Worker
`taxkitdocscloudflare-docswebsite-prod-ujphggiaxw5ryjev`. It performed no
mutation. The command is intentionally excluded from root verification and
Quality because it is provider-bound; this observation establishes neither
deployment/version identity, hosted behavior nor future availability.

The task-created report-only command is now exactly
`bun run check:docs-deployment-orphans`. It runs the existing supported
state/provider command plus the exact read-only `gh pr list` projection named
in the receipt Schema, decodes each source once and recomputes classification
before encoding. Its first execution exposed two bounded implementation
failures before success: the process graph initially lacked an Effect `Scope`,
then the byte collector passed `Array.from` as an indexed callback and failed
strict UTF-8 decoding. Both failures produced named non-mutating errors; the
runtime now owns scope and performs an explicit byte flatten.

The accepted dated report at
`docs/evidence/deployments/2026-07-30-orphan-inventory/report.json` observed
exact remote PR `#1` at `114bce6…`, only `prod` in Alchemy state, and the same
fixed Production Worker in Cloudflare. It found zero Preview stages and zero
orphan candidates, classifying PR `#1` only as a trusted open PR without a
stage. The receipt fixes mutation capability to `none` and automatic deletion
to `prohibited`; root deployment validation decodes it and recomputes the
classification. It is a dated read-only observation, not scheduled automation,
teardown authority, hosted behavior or future-state proof.

The fresh bounded reviewer returned `READY FOR PARTIAL RETENTION` for this
owner after independently attacking trusted, cross-repository, missing-PR and
missing-stage classifications, command identity, mutation capability and
receipt omission. It found only the exact existing inventory command and
bounded open-PR read reachable, with no provider client, write, apply, destroy
or deletion path. The final focused suite passed `27` tests with `61`
expectations; deployment validation decoded one orphan receipt with zero
violations, and full repository verification passed.

Docs-maintainer impact for this increment is `Change required` for the
deployment tool/Schemas/tests, dated evidence, package/Knip/Oxlint
reachability, architecture, testing, runbook, automation/control, active
SPEC/task/index and plan owners. `Preserve` applies to Quality's read-only,
provider-free authority, deployment-neutral docs packages, all earlier
deployment and HGI/HFI evidence, and the fixed Production resource. `N/A`
applies to a new Changeset, automatic deletion, workflow establishment,
credential storage, DNS/domain, third-party observability, release and
publication.

The fresh independent DCD-004 review initially returned `NOT READY FOR PARTIAL
RETENTION`. It proved that the first policy admitted additive credentials and
resources, floating candidate sources, omitted Quality stops and an arbitrary
non-null external receipt. The owning policy now compares the exact
per-automation principal, credential, resource, denial, trigger and revision
sets; Preview and Production require the exact-candidate Quality stop; any
`established` external state fails closed until a hosted receipt decoder
exists. Durable negative fixtures retain each attack. The same reviewer
re-ran the attacks and returned `READY FOR PARTIAL RETENTION`; this accepts
only the local desired-state and inventory owner, not DCD-004 or any hosted
workflow claim.

Changeset impact is evidenced `N/A` for this partial DCD-004 owner: it changes
repository-private deployment tooling, governance records and maintainer
documentation, not a version-managed package or public API. The unconsumed
DCD-001 docs-content patch Changeset remains the only package-facing Changeset
in this SPEC.

### 2026-08-01 — DCD-004 Quality repair and partial-retention successor

The prior red Quality classification is superseded for exact remote head
`630b3b5a4de4bfcadb5b0befb622dde9894a7d51`. GitHub Actions runs
`30690654403` and `30690655494` both completed successfully for the push and
draft-PR events. Their complete `release:check -- --ci` graphs passed; this is
hosted CI evidence only, not deployment or provider proof.

Three change-owned runner defects were corrected without widening authority:

- `34caed9b…` pins the route-rule subprocess to Oxlint's supported `unix`
  reporter so GitHub annotation mode cannot change its diagnostic contract;
- `b18d9307…` installs Chromium through the frozen app-local Playwright 1.61.1
  executable instead of the rejected floating `bunx` resolution; and
- `630b3b5a…` fetches complete checkout history and materialises the configured
  local `main` ref so the ninth Changesets gate can compare the candidate.

The intermediate red receipts remain disconfirming evidence: `34caed9b…`
advanced past workspace tests but lacked Chromium; `e736597b…` proved that
floating `bunx` installed a different Playwright browser revision and was
rejected; and `b18d9307…` advanced through build and browser proof but lacked
`main` comparison history. Quality still has `contents: read`, cancellable
workflow/ref concurrency, no provider credential and no deployment step.
Docs-maintainer impact for this correction is `Change required` for the Quality
executable policy, negative fixtures, testing/control/automation wording,
SPEC/task impact rows and this plan; deployment authority, provider state and
public availability remain `N/A`.

The already reviewed DCD-004 local desired-state, state/provider inventory and
report-only orphan owner remain the partial-retention candidate. DCD-004 stays
`in_progress`: no `.github/workflows/docs-*.yml`, protected environment,
GitHub-hosted credential principal or repeatable hosted workflow receipt has
yet been established. The next boundary is a fresh readback of those external
capabilities after this partial owner is committed.

That readback was performed at exact local/remote draft-PR head
`8f49e7eb8663d12b2e926a6226367a1618c770ca`. GitHub identified the executing
repository principal as an administrator, but returned zero environments,
zero Actions secrets and zero repository variables. The process exposed no
Cloudflare, Alchemy or Wrangler credential inputs, and a bounded Wrangler
identity preflight returned unauthenticated. Quality runs `30691041518` and
`30691043070` both completed successfully for this exact head. They prove the
hosted Quality graph for `8f49e7e…`; they do not establish a deployment
workflow, provider mutation, hosted docs runtime or public availability.

No environment, secret, workflow or provider resource was created. The exact
minimal external prerequisite is a separately provisioned narrow Cloudflare
principal with concrete `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN` values for the three named mutation environments, plus
a separately read-only `CLOUDFLARE_READ_API_TOKEN` for
`github-actions-report-only`. Each value must be attached through GitHub's
secret boundary only after account, operation/resource scope, duration and
revocation ownership readback. Local OAuth/cache state is not an acceptable CI
credential. Even after credential provisioning, PR-close teardown cannot be
proved until reviewed workflow code is on `main`; merge and PR-ready conversion
remain outside current authority. DCD-005 stays dependency-blocked behind this
DCD-004 external-state gate.

Docs-maintainer impact for this successor is `Change required` only for this
active capability record and the deployment runbook. Application/package code,
provider resources, automation external-state records, historical receipts,
public availability, DNS/domain, release and publication are `Preserve` or
`N/A`. No Changeset is required because the update is repository-private
operational evidence and exposes no public package behavior.

### 2026-08-02 — resumed authority and capability audit

Cooper resumed the blocked whole-SPEC goal and authorized the remaining
TaxKit-only GitHub environment/secret, Alchemy/Cloudflare, Preview, Production,
teardown and rollback operations for this implementation goal. The renewed
authority is recorded at
`docs/evidence/deployments/2026-08-02-authority-capability/receipt.json` and
does not widen the exclusions for custom-domain/DNS, unrelated resources,
credential disclosure/rotation/scope expansion, publication, merge or
pull-request-ready conversion.

The exact remote candidate is
`aabe7b69de164906699fb4646a8ecc5058d46178` on the open draft PR `#1`.
GitHub readback still reports no protected environment, Actions secret or
repository variable. A local Alchemy `default` OAuth profile is currently
authenticated for account identity `f9f94270a4a5af8af7010d891020922d`, with
scope-set digest
`de63872ab5516eb3389bd082782df3743676528eb289a9f99486a1de9c8892a2` and
expiry `2026-08-02T13:32:26.734Z`; only the digest is retained and the broad
profile is not copied into CI. Wrangler remains unauthenticated and concrete
narrow CI token values are unavailable. The runbook and automation register
therefore remain `not-established` for external workflow state, while local
Alchemy inventory is available under its separate read-only authority.

This is a capability stop for GitHub secret attachment and hosted workflow
execution, not a missing-approval stop. The smallest external prerequisite is
one account-scoped mutation token for the three named mutation environments
and one read-only token for `github-actions-report-only`, with account,
operation/resource scope, expiry and revocation owner readback. No empty
environment or broad OAuth secret is created as a substitute. Local workflow
owners may proceed, and authorized manual provider operations may use the
existing Alchemy profile only after fresh candidate, state, plan, lock and
readback checks.

### 2026-08-02 — Preview plan bound to aabe7b6

Fresh readback bound the remote branch and open draft PR `#1` to candidate
`aabe7b69de164906699fb4646a8ecc5058d46178`; both Quality check runs for that
candidate completed successfully. GitHub still has zero protected environments,
Actions secrets and repository variables. The local Alchemy `default` profile
read-only inventory agreed on account and existing fixed `prod` resources, with
no `pr-1` stage. The exact Cloudflare build/workerd proof passed, and two
sanitized `pr-1` plans were equal: only `DocsBuild` and `DocsWebsite` create,
projection digest
`bfcc34f06f954564e4e1d2576495516c47a8ff26ff8d1334bb57491966279239`. The
receipt is `docs/evidence/deployments/2026-08-02-preview-pr-1/plan-aabe7b6.json`.
The earlier “no Preview mutation” sentence is superseded by the dated
successor below; the plan receipt remains unchanged as the pre-mutation
identity.

### 2026-08-02 — current manual Preview, Production and rollback successor

After fresh candidate, account, state/provider and scope readback, the aabe
candidate was applied to isolated `pr-1`. Provider readback is retained at
`docs/evidence/deployments/2026-08-02-preview-pr-1/provider-aabe7b6.json` and
binds Worker
`taxkitdocscloudflare-docswebsite-pr-1-nd6tdg4svxvqz3ma`, its `workers.dev`
URL, deployment/version, Alchemy instance and assets. Hosted proof and the
candidate-bound desktop/mobile screenshot manifests passed all nine required
oracles. Two equal destroy dry-runs then removed only `DocsBuild` and
`DocsWebsite`; the teardown receipt proves Worker settings, hosted URL and
stage-resource absence.

The same accepted source was applied to fixed `prod` after two equal update
plans. Its provider readback, hosted proof and desktop/mobile screenshots are
retained under `docs/evidence/deployments/2026-07-30-production-prod/` with
the aabe suffix. A normal source-bound rollback was then performed from the
qualified d9 source in a fresh two-plan/equal-replan window. The rollback
provider/deployment/version and hosted/browser/screenshot proof are under
`rollback-aabe7b6-to-d9cb894/`; the final observed Worker identity is the
restored d9 source. This is a manual dated provider observation, not a claim
that the GitHub deployment workflows are established.

The deployment checker now decodes and validates these current-epoch receipts
in addition to preserving the immutable historical rollback chain. The
GitHub capability receipt still records zero protected environments, Actions
secrets and repository variables. DCD-004 therefore remains `in_progress` and
DCD-005 remains pending for repeatable workflow admission: the exact external
prerequisite is the two narrow token identities and protected-environment
readback named by the runbook. No empty environment or broad local OAuth
profile was stored as a substitute.

### 2026-08-02 — current branch and capability recheck

The repository-only evidence/checker successor is now exact remote head
`9f234041d37aa062b1d33cad30ecab2fb08b57fc` on draft PR `#1`; the two hosted
Quality runs for that head (`30750616385` and `30750618437`) passed. This
successor does not change the deployment build, runtime or provider-input
graph, so the provider receipts above remain explicitly bound to candidate
`aabe7b6…` rather than being relabelled as current hosted proof.

Fresh read-only inventory at this head agrees on the fixed `prod` stage and
the restored Worker/state identity, and the report-only orphan read finds the
open trusted PR without a Preview stage. GitHub still has zero protected
environments, Actions secrets and repository variables; the required narrow
CI token identities remain unavailable. DCD-004 and DCD-005 therefore retain
their existing statuses and non-claims. No new provider or GitHub mutation was
performed in this recheck.

### 2026-08-03 — token-administration capability stop

The preceding capability probe was recorded at branch
`35eeff77ac034c62d0d8f2fa8d319e2bd1f166ce`, with both remote Quality checks
green. A non-mutating invocation of the installed
Alchemy token-administration command, with standard input closed, reached its
Global API Key prompt and was interrupted with exit `130`; no secret was
entered and no token or provider resource was created. The authenticated
Alchemy OAuth profile has no API-token-write scope, and the supported command
does not use that profile. GitHub readback remains zero environments, Actions
secrets and repository variables.

This is a capability stop rather than an approval stop. The exact remaining
input is a securely custodied provider-admin action with Cloudflare account
`API Tokens > Write` permission (preferred account-owned route), or the
Global API Key/email required by the supported user-token route. The admin
must create one least-privilege mutation credential for the named TaxKit
Worker/assets and Alchemy state/control-plane operations and one separate
read-only inventory credential for the named state/Worker reads. Live API
permission groups must be resolved before creation; no all-permissions or
copied OAuth profile is acceptable. Retain only redacted identity/digest,
account/resource scope, expiry and revocation owner, then attach values to the
four exact protected environments named by the runbook. No placeholder
environment or secret was created. DCD-004 remains `in_progress` and DCD-005
remains `pending`; the manual Preview/Production/rollback receipts retain
their original candidate identities and are not relabelled as workflow proof.

### 2026-08-03 — Executor Cloudflare re-auth capability stop

The configured Executor Cloudflare connector was present, but its first live
account-owned permission-group read returned `connection_rejected` with
upstream HTTP `403` (the reported 403/9109 token-administration failure).
The call produced no accepted permission groups and no credential or provider
mutation. A configured connector is not an authenticated principal for this
operation; no retry or token creation was attempted.

The exact remaining prerequisite is completion of the secure Executor re-auth
handoff in the Executor UI. Once the refreshed connection is read back,
repeat the account-owned permission-group query, resolve least-privilege
groups against the actual Worker/assets and Alchemy state/control-plane calls,
then create and read back the two redacted credential identities before
touching GitHub environments. DCD-004 remains `in_progress` and DCD-005
remains `pending`; no current-head workflow, Preview or Production claim is
added by this capability read.

### 2026-08-04 — CI credential and protected-environment capability established

The refreshed secure provider connection returned account-owned permission
groups for account `f9f94270a4a5af8af7010d891020922d`. The successful
capability epoch is decoded from
`docs/evidence/deployments/2026-08-04-ci-capability/receipt.json`; the earlier
capability and re-auth stops remain immutable history. It created two active
credentials expiring `2026-09-03T23:59:59Z`: a mutation identity with Workers
Scripts Write, Workers Observability Write and Secrets Store Write, and a
separate inventory identity with only the corresponding Read groups. The
account resource scope and redacted ID digests are retained; secret values are
not. The current Alchemy state boundary is the account `alchemy-state-store`
Worker plus `StateStoreSecrets` Secrets Store, so no R2 permission is needed.

The four exact GitHub environments are reviewer-protected and their
names-only secret inventories match the workflow direction: mutation names in
Preview, Production and Preview teardown, and the read-only inventory name in
`github-actions-report-only`. The Executor GitHub connector lacks environment
secret administration, so the authenticated repository-admin path was used
and read back. No secret was written to this checkout or `.env.local`, and the
broad local OAuth profile remains outside CI.

This clears the credential/environment capability gate only. The automation
register deliberately remains `not-established` until the workflow files are
on the default branch and a fresh run retains exact-candidate provider/state,
hosted, screenshot, teardown and rollback receipts. DCD-004 remains
`in_progress`; DCD-005 remains `pending`. Merge/ready, custom-domain/DNS,
publication, release and unrelated resources remain separately bounded.

The first default-branch workflow dispatch has one platform-specific bootstrap
exception: because GitHub does not dispatch workflow files that exist only on a
PR branch, Preview may bind the already reviewed merged PR head and `pr-1` after
the workflow lands on `main`. Exact repository/head/Quality/account/stage/plan
checks remain mandatory, and every later Preview dispatch must be an open,
trusted draft PR. PR-close teardown is idempotent: an absent stage yields an
equal `noop` projection and no destroy; an existing exact stage requires equal
delete plans and exact absence readback. This does not advance any external
state entry without fresh workflow receipts.

The first default-branch teardown attempts are retained as bounded failure
observations. Run `30894963411` stopped at GitHub action resolution because an
action ref was one character short; run `30895606322` stopped before provider
access because pull-request `base.sha` was the pre-merge default-branch SHA.
The full action refs and current-default-branch source binding are corrected
in the successor candidate. Run `30895614894` reached the exact-stage dry-run
and then exposed a missing build prerequisite (`apps/docs/dist` was absent),
so no destroy or provider mutation occurred. The next workflow candidate must
install the pinned browser and build the exact Cloudflare input before the
equal dry-run; these failures do not establish any automation external state.

The successor teardown runs `30896950134` (automatic PR-close) and
`30896963746` (manual `pr-1`) passed source checkout, frozen install, browser
setup, docs validation, exact build and equal destroy dry-runs, then stopped at
`check:docs-deployment-inventory` because the ephemeral runner had no cached
`cloudflare-state-store` credential. They executed no destroy or provider
mutation. The next candidate adds the installed supported
`alchemy cloudflare bootstrap` command with `CI=0` to the three mutation
workflows immediately before plan/teardown. Each step first runs the
supported `alchemy login` command with `CI=1`, which persists only the
environment-method selector; bootstrap then materializes the account-matched
cache only for that runner before the inventory command is rerun under `CI=1`.
The report-only workflow remains separately credentialed and `not-established`;
this correction does not make a stronger claim.

### 2026-08-05 — default-branch workflow receipts and report-only stop

The reviewed workflow files are present on default branch
`1b6d36b765a5953f79b0932c127f01088603930f`. Preview plan/deploy runs
`30962576035`/`30962743727` used candidate
`eafeaad6c283ae6949ccf67636f39bec199b4e94`, stage `pr-10` and equal plan
digest `acb4f2eb005b68c5d2c1ad1d491cda8119010b92f558c0d05ee68b25ee62e437`.
Corrected exact-stage teardown runs `30964380634` (`pr-10`) and
`30964525980` (`pr-9`) proved provider/state absence; `30962555585` remains
the false-noop disconfirming observation. PR-close teardown
`30966977503` safely converged absent `pr-12` at the merged PR-12 head.
The merge-era PR-close run `30968741396` repeated the exact `pr-13` no-op at
default-branch candidate `936f3326a6100582ecd8ffb88b299985bc8db875`; its
equal digest and state/provider postcondition are retained under
`docs/evidence/deployments/2026-08-05-preview-pr-13/`.

Production plan/deploy pairs `30964647432`/`30964781776` and
`30965270740`/`30965398455` supplied fixed-stage deployment/provider/hosted
and screenshot evidence. Normal rollback plan/execution
`30965691430`/`30965797032` restored the prior source through a new
source-bound deployment/version. The claim-matched manifests are retained in
the two 2026-08-05 Production evidence directories.

Report-only run `30966300887` stopped before inventory because `GH_TOKEN` was
missing. After the workflow owner correction, `30967000841` reached
`deployment-inventory` but stopped because a read-only Cloudflare credential
cannot derive the installed Alchemy beta.64 HTTP state-store bearer without
the mutation-capable bootstrap path. The failure receipts are retained under
`docs/evidence/deployments/2026-08-05-orphan-inventory/`. No mutation or secret
disclosure occurred. Scheduled orphan detection remains an inconclusive
report-only path; the deployment register stays `not-established`, DCD-004
stays `in_progress`, and DCD-005 stays `pending` until this boundary and the
remaining parity/retirement proof are resolved.

### 2026-08-09 — docs-app bridge-retirement implementation candidate

The exact committed candidate `d649a14fe49122387e33a6de0547468e6a3e4967`
removes the docs app's Nitro/Vercel preset, `.vercel/output` harness,
`TAXKIT_DOCS_BUILD_TARGET` selector and docs-only Nitro dependency. `test:built`
now invokes the Cloudflare/workerd production-artifact proof;
`test:cloudflare-built` remains an explicit alias. The root Nitro catalog,
shared output declarations and any unrelated `apps/web` Nitro owner remain
preserved.

The clean-candidate receipt is
`docs/evidence/deployments/2026-08-09-local-bridge-retirement/receipt.json`.
`bun run --filter=docs test:built` passed SSR, assets/cache headers, direct and
client 404, hydration, server-function transport, no-document navigation,
accessibility, console/page cleanliness, runtime reuse, filesystem isolation
and local upload limits under the pinned Cloudflare Vite/workerd/Wrangler
graph. This is a local implementation and parity observation; it does not
establish hosted Preview/Production/rollback for this exact candidate or the
report-only Alchemy state boundary. DCD-004 remains `in_progress`, DCD-005
remains `pending`, and no completion claim is made. The first repository-wide
verification pass then identified the now-unreachable
`apps/docs/test/fixtures/visual-states.ts` after the bridge deletion; the
change-owned Knip finding was corrected by removing that fixture in
`117bbc4cf2866efbc19f50ccabb4013c39c120a8`, after which the full verification
graph passed.

### 2026-08-09 — report-only state-read boundary candidate

The installed Alchemy beta.64 state store has one bearer for both read and
write HTTP routes, and its `loginWithCloudflare` path uploads an ephemeral
edge-preview Worker to read the bearer from `StateStoreSecrets`. The separate
Cloudflare read token therefore cannot derive that bearer. The workflow
candidate now admits a protected `ALCHEMY_STATE_STORE_CREDENTIALS_JSON` secret
only in `github-actions-report-only`; it materializes the account-matched
cache and invokes only the existing inventory reader. The workflow contains
no Alchemy login, bootstrap, plan, deploy, destroy or state-write command.
This is an operational-read-only boundary, not a cryptographically read-only
state credential; the limitation and denied operations remain explicit. No
secret value is present in the repository. The candidate is not accepted until
the secret names/configuration and exact report-only run retain a dated
state/provider-agreement receipt; the automation register remains
`not-established` until then.
