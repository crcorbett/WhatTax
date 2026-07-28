---
document_type: product-spec
lifecycle: proposed
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-07-28
review_trigger: accepted TK-CF finding, dependency constraint, Cloudflare or Alchemy contract, deployment authority, proof boundary, or implementation discovery
successor: null
tombstone: false
---

# Docs Cloudflare and Alchemy deployment

## Overview

TaxKit will deploy the completed TanStack Start documentation application to
Cloudflare Workers through Alchemy. Preview and Production are both required
initial outcomes:

- a trusted pull request receives an isolated `pr-<number>` stage and provider
  Worker URL; and
- one fixed `prod` stage owns the stable provider Worker URL used for the
  initial public Production deployment.

A custom domain is a future successor. It must attach to the same Production
Worker identity and must not block or redefine the initial deployment
contract.

This SPEC is proposed implementation intent. It does not establish a
Cloudflare account, plan, Workers subdomain, credential, Alchemy state store,
Preview, Production deployment, public availability, rollback, or DNS state.
No active execution plan exists for this work. The sibling task ledger requires
one to be created only when implementation begins.

## Target and comparative evidence

TaxKit planning target:

- `origin/main`:
  `9c82bf9613b1342375ff670c46ee34cc8347af1d`;
- current local proof: Nitro/Vercel generated output and the implemented
  `taxkit-docs-runtime` local journey; and
- current dependency baseline: Effect/Platform `4.0.0-beta.98`, TanStack Start
  `1.167.65`, TanStack Router `1.169.2`, Vite `8.0.14` from the lockfile, and
  Nitro `3.0.260429-beta`.

Site comparative target:

- `origin/main`:
  `1fe3f7fc3182e3305542ceac8bd97a6dcd2df42e`;
- Alchemy `2.0.0-beta.64`;
- Effect, `@effect/platform-bun`, `@effect/platform-node`, and
  `@effect/vitest` `4.0.0-beta.100`; and
- a current `Cloudflare.Website.Vite` TanStack Start resource using
  `nodejs_compat`, compatibility date `2026-06-24`, Worker-first assets,
  Cloudflare remote state, and separate Preview/Production deployment
  composition.

Site is trajectory evidence, not TaxKit policy. TaxKit must not copy Site
names, domains, provider identifiers, AOX/Axiom resources, credentials,
bindings, historical receipts, hard-coded proof inputs, or custom-domain
assumptions.

Official package metadata at this SPEC revision requires Alchemy
`2.0.0-beta.64` to use Effect and the optional Platform peers at
`>=4.0.0-beta.100`. The selected exact graph is therefore:

| Dependency | Target exact pin |
| --- | --- |
| `alchemy` | `2.0.0-beta.64` |
| `effect` | `4.0.0-beta.100` |
| `@effect/platform-bun` | `4.0.0-beta.100` |
| `@effect/platform-node` | `4.0.0-beta.100` |
| `@effect/vitest` | `4.0.0-beta.100` |

The existing TanStack, React, Vite, Fumadocs, TypeScript and Effect language
service versions remain unchanged unless the first vertical slice produces a
specific incompatibility. No dependency may use `latest`.

Relevant upstream contracts:

- [Alchemy TanStack Start](https://alchemy.run/cloudflare/frontend/tanstack-start/)
- [Alchemy Vite Website](https://alchemy.run/cloudflare/frontend/vite/)
- [Alchemy state store](https://alchemy.run/state-store/)
- [Cloudflare workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)
- [Cloudflare Node compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
- [Cloudflare Worker limits](https://developers.cloudflare.com/workers/platform/limits/)

## Accepted-finding crosswalk

All accepted findings retain their investigation IDs. `TK-CF-009` is revised
by Cooper's dependency decision.

| Finding | Accepted correction | Requirements | Tasks |
| --- | --- | --- | --- |
| `TK-CF-001` | The Vercel Build Output is not the Cloudflare deployment artifact. Add an app-owned Cloudflare Vite mode and root Alchemy Website composition. | `DCD-003`, `DCD-004` | `DCD-001`, `DCD-005` |
| `TK-CF-002` | Use a bounded dual-build migration. Retire Nitro only after local workerd, Preview, Production and rollback parity. | `DCD-003`, `DCD-011` | `DCD-001`, `DCD-005` |
| `TK-CF-003` | Keep app semantics app-owned and deployment composition root-owned. Reject a provider/infrastructure package. | `DCD-003`, `DCD-009` | `DCD-001`, `DCD-002`, `DCD-004` |
| `TK-CF-004` | Make isolated Preview and fixed-stage Production mandatory initial outcomes using provider Worker URLs. | `DCD-005`, `DCD-007` | `DCD-002`, `DCD-003` |
| `TK-CF-005` | Treat Alchemy state, stage locking, teardown and orphan inventory as an explicit bounded control-plane lifecycle. | `DCD-008`, `DCD-009` | `DCD-002`, `DCD-004` |
| `TK-CF-006` | Split provider/state/Preview/Production/teardown/rollback authority and Schema-decode config and receipts without exposing credentials. | `DCD-008`, `DCD-009` | `DCD-002`, `DCD-003`, `DCD-004` |
| `TK-CF-007` | Bind exact candidate, plan, provider readback, hosted behavior, screenshots and rollback in dated receipts. | `DCD-005`, `DCD-006`, `DCD-007`, `DCD-010` | `DCD-002`, `DCD-003`, `DCD-005` |
| `TK-CF-008` | Qualify module-scoped runtime reuse, generated content, Node imports, filesystem absence and limits under workerd. | `DCD-004` | `DCD-001`, `DCD-005` |
| `TK-CF-009` | Upgrade Effect/Platform and Alchemy together to the exact beta.100/beta.64 graph in the first Cloudflare slice and prove the whole affected repository. | `DCD-002` | `DCD-001` |
| `TK-CF-010` | Add the minimum deployment runbook, authority/control owners and separate small deployment-evidence route without rewriting historical evidence. | `DCD-008`, `DCD-010`, `DCD-012` | `DCD-002`, `DCD-004`, `DCD-005` |
| `TK-CF-011` | Keep custom domain/DNS/certificate work deferred; later attachment preserves the Production Worker identity. | `DCD-001`, `DCD-007`, `DCD-011` | `DCD-003`, `DCD-005` |
| `TK-CF-012` | Reuse Site's Website/Vite, exact-source, state and proof principles while rejecting AOX, hard-coded provider identities, custom-domain coupling and unsafe concurrency. | `DCD-003`, `DCD-008`, `DCD-010` | `DCD-001`, `DCD-004`, `DCD-005` |

Applicable harness invariants are `HC-OUTCOME-001`, `HC-CTX-001`,
`HC-BOUNDARY-001`, `HC-DOC-001`, `HC-PROOF-001`, `HC-AUTH-001`,
`HC-AUTO-001`, `HC-DEPENDENCY-001`, `HC-EVIDENCE-001`, and
`HC-LIFETIME-001`.

## Problem

`apps/docs/vite.config.ts` unconditionally installs the Nitro Vite plugin with
the Vercel preset. `apps/docs/scripts/test-built.tsx` imports the generated
`.vercel/output/functions/__server.func/index.mjs` and serves
`.vercel/output/static`. Turbo also records `.output/**` and
`.vercel/output/**` as production build outputs.

The source application already has the Web-standard Worker entry:

```ts
Current runtime source

request
  -> apps/docs/src/server.ts
    -> createStartHandler(defaultStreamHandler)
      -> TanStack Start routes and server functions
```

The missing boundary is the Cloudflare build/resource composition. Alchemy
builds TanStack Start directly through Vite and does not consume the Vercel
Build Output API. Replacing the adapter immediately would also remove
TaxKit's only independent built SSR/hydration/navigation regression oracle
before workerd and provider proof exist.

The current repository also has no deployment runbook, Cloudflare authority
envelopes, Alchemy state owner, mutating workflow controls, hosted screenshot
contract, provider-bound evidence route, or rollback receipt.

## Goals

- Upgrade the complete Effect/Platform baseline and add Alchemy at the exact
  accepted compatible pins in the first Cloudflare vertical slice.
- Add the smallest app-owned Cloudflare build mode and root-owned
  `Cloudflare.Website.Vite` composition.
- Execute the real emitted Worker bundle under workerd before provider access.
- Prove an isolated trusted-PR Preview at its read-back provider URL and safely
  tear it down or stop with a complete missing-authority receipt.
- Prove one fixed Production stage at a stable provider Worker URL, including
  normal rollback/redeploy.
- Add repeatable Preview, Production and PR-close teardown workflows only after
  the first manual authorized vertical paths are understood.
- Bind source, config, plan, dependency, Alchemy state, Worker,
  deployment/version, hosted behavior and screenshots in dated evidence.
- Retire Nitro/Vercel and `.vercel/output` only after Cloudflare parity.
- Keep architecture, runbook, controls, README pointers and focused proof
  synchronized within each vertical slice.

## Non-goals

- A custom domain, DNS record, zone adoption, certificate or route.
- Cloudflare Pages.
- Multi-account, multi-region or multi-cloud design.
- Gradual rollout, traffic splitting or version aliases.
- A generic infrastructure/provider package or helper framework.
- Third-party observability or Site AOX/Axiom machinery.
- Application KV, D1, R2, Durable Objects, Queues, Hyperdrive or Cron.
- Automatic orphan deletion.
- Speculative application secrets or public runtime configuration.
- A browser Effect runtime, raw provider-client escape hatch, generic provider
  callback API, or app route that performs provider operations.
- Expanding every hosted assertion into a release critical journey.
- Rewriting HGI-203, HGI-206, HFI, completed docs-app evidence, or completed
  execution plans.
- Package publication, versioning, tag, release or public-domain proof.

## Requirements

### `DCD-001` — claim boundaries and outcome

The accepted outcome is a Cloudflare Worker deployment contract for the docs
app with isolated Preview, fixed Production, safe teardown and normal rollback.
Local Vite, local workerd, Preview, Production, provider state, deployment
authority and future public-domain claims remain separate.

The initial public endpoint is the read-back Production `workers.dev` URL. A
future domain may attach to the same Worker but is not an acceptance condition
for this SPEC.

### `DCD-002` — coordinated Effect and Alchemy graph

The first implementation slice changes the root catalog and lockfile to the
exact beta.100/beta.64 graph listed above. It must:

- use frozen dependency installation after the lockfile is regenerated;
- verify npm integrity and Alchemy peer constraints against the accepted pins;
- run focused tests and the full affected repository graph;
- record any Effect API corrections at their existing semantic owners rather
  than adding compatibility wrappers; and
- stop if a repository owner cannot migrate without an additional dependency
  or architecture decision.

This is one dependency decision serving the first Cloudflare path, not a
standalone modernization programme. `alchemy@2.0.0-beta.64` remains a
prerelease carrying cost. Its owner must review an upstream peer/resource
contract change, a provider incident, a non-convergent plan, a security
advisory, or a stable Alchemy release. Removal means returning to the last
accepted dependency graph and removing the unaccepted Cloudflare composition;
retirement means a separately proved stable successor or removal of this
deployment route.

### `DCD-003` — build and resource ownership

`apps/docs` owns:

- Schema-decoded build mode;
- Cloudflare-compatible Vite resolution and SSR bundle policy;
- the smallest build-policy module only if `vite.config.ts` cannot keep the
  decoded branch readable; and
- the existing Web Fetch handler, generated source and runtime boundaries.

Root `alchemy.run.ts` owns:

- one stack name;
- `Cloudflare.providers()`;
- `Cloudflare.state()`;
- stage selection; and
- one `Cloudflare.Website.Vite` logical resource named `DocsWebsite`, including
  exact compatibility date `2026-06-24`, `nodejs_compat`, Worker-first assets,
  and the initial observability policy.

Alchemy beta.64 sets `ALCHEMY_CLOUDFLARE_VITE_INJECTED=1` while its
Cloudflare Vite plugin is active. The app must Schema-decode that exact
installed-version signal to omit Nitro only for the Alchemy build. It must not
copy Site's command-line heuristic or install a second Cloudflare plugin. The
compatibility date is a TaxKit candidate pin only after DCD-001 proves it under
workerd; Site's use is comparative evidence, not acceptance.

Initial observability uses only Cloudflare's built-in invocation logs, with
traces disabled, no custom fields, no request body, header, cookie, credential
or secret capture, and no third-party destination. DCD-001 must read back the
exact supported Website option and document its sampling/persistence and
plan/cost semantics without provider access; DCD-002 must confirm the applied
provider setting. If beta.64 cannot express that bounded policy, observability
remains disabled and the gap is retained for DCD-005 rather than inheriting an
undocumented default.

Alchemy owns the physical Worker name. TaxKit must read it back and must not
hard-code a generated Worker name or URL.

Repository deployment commands and provider readback belong under
`tools/docs-deployment/**`. Add a tool-local named Effect service with
live/test Layers only if direct Cloudflare API calls are required. It must
expose named operations, immediately decode provider output, use branded
identities and tagged errors, and expose neither a raw client nor a generic
callback.

Build configuration and provider ingress use `Config.schema` or an
owner-composed `ConfigProvider`; no module manually parses semantic environment
primitives. Primary operations remain flat, lazy Effects at their real I/O
owners. Expected plan, provider, state and proof failures stay in typed tagged
error channels without `instanceof` policy.

Deployment work does not move frontend ownership. Server-function transport
restoration remains route-high, the direct route root owns outcome matching,
policy-owning containers own remote commands, and leaves receive readonly
values and callbacks. Browser code constructs no Effect runtime and receives
no provider or deployment client.

Do not add a package. `packages/docs-content` and `packages/docs-fumadocs`
remain deployment-neutral unless workerd proves an owning runtime-filesystem
defect.

### `DCD-004` — local Worker qualification

The repository currently has no workerd, Wrangler, Miniflare or Workers test
pool dependency, and Alchemy's Website resource builds while preparing its
resource. The first slice must therefore establish a supported provider-free
seam before claiming local Worker proof:

- select and exact-pin an official workerd-compatible harness dependency or
  tool supported by the accepted Cloudflare/Vite graph;
- identify the public Alchemy/TanStack Worker module and asset output that is
  also the deployable Website input, rather than testing a parallel artifact;
- retain package integrity, lockfile reachability and a negative proof that no
  provider or remote-state access was required; and
- stop if beta.64 exposes no supported provider-free artifact seam.

Only after that evidence exists may the slice create and record the exact
repository command that builds and executes the Worker. Do not invent that
command in advance; before the slice completes, update this SPEC, the sibling
ledger and `apps/docs/README.md` with the verified invocation.

Local workerd proof must cover:

- initial SSR body and status before browser JavaScript;
- static asset status, content type and non-HTML body;
- server-function transport;
- direct HTTP 404 and framework-native not-found UI;
- hydration without warnings or errors;
- client navigation with a server-function request and no new document
  request;
- one module-scoped `ManagedRuntime` per isolate rather than per request;
- sequential and concurrent isolate reuse without request-state leakage;
- no runtime filesystem access;
- no unsupported Node API call;
- bundle size and startup time against the selected Cloudflare plan limits;
  and
- clean frozen dependency and Knip/Turbo reachability.

The selected compatibility date makes Cloudflare's Node compatibility,
including `node:fs` emulation and `process.env` population, available. Its
presence is not proof that the application is filesystem-independent or that
secret values cannot enter the bundle or logs. The current generated source
may retain build-time filesystem imports. Failure occurs if the emitted Worker
can execute a filesystem path at request time, contains unexpected public or
secret configuration, or carries an unacceptable bundle/startup cost. If that
happens, the earliest correction is the owning
`packages/docs-content/src/{service,live.layer,validation/policy}.ts` boundary;
the deployment layer must not hide it.

The current module-scoped runtime remains correct if instrumentation proves one
construction per isolate. Cloudflare exposes no dependable application
shutdown hook, so completion also requires evidence that the runtime owns no
mandatory shutdown flush or leaked long-lived handle.

### `DCD-005` — isolated Preview

A trusted pull request uses branded stage identity `pr-<number>` and one
isolated Website resource. Before mutation:

- the exact candidate remains the current trusted PR head;
- Quality and local workerd proof pass for that candidate;
- the Cloudflare account, plan and Workers subdomain are read back;
- Alchemy remote state is explicitly bootstrapped or adopted;
- the Preview principal, credential scope/duration/revocation, resource,
  environment, approval and teardown authority are recorded; and
- a separately authorized non-mutating plan operation emits a sanitized,
  candidate/stage/config-bound plan projection and digest for human review.

The sanitized projection is Schema-owned and canonical: it includes the exact
source, dependency, Alchemy version, compatibility/build configuration, stack,
stage and logical resource identity, excludes ANSI, timestamps and secrets,
and does not claim that Alchemy supplies a native stable digest. A later
protected deploy operation accepts that exact digest, reacquires the stage
lock, rechecks candidate freshness, replans and rejects inequality before
applying. Plan work is cancellable and non-mutating; apply is queued and
non-cancellable.

Alchemy state bootstrap or adoption must complete under its separate authority
envelope before this application plan. If the installed plan path can create,
adopt or update provider/state resources, it is not the non-mutating review
phase and must stop rather than combine plan approval with apply authority.
After apply, proof must bind source/config/manifest/lock/Alchemy digests,
Alchemy stack/stage/resource output, Worker name, provider URL, latest
deployment/version and hosted behavior. A provider response without matching
state and candidate identity is a failure.

Teardown uses the same stage lock and exact `pr-<number>` target. It must
read the current PR and provider/state identities before destroy and prove
absence afterwards. If teardown authority is missing, stop without broad
cleanup and retain the exact unresolved resource and escalation owner.

### `DCD-006` — hosted screenshot contract

Preview and Production each retain one representative desktop and one
representative mobile screenshot rather than duplicating the complete local
visual corpus.

Each environment's screenshot manifest must Schema-decode:

- exact source commit;
- environment and stage;
- read-back URL;
- Worker, deployment and version identity;
- source/config/plan/dependency digests;
- viewport;
- browser name and exact version;
- image path and SHA-256 digest;
- expected and observed visual state;
- reviewer and review time;
- limitations and non-claims; and
- the applicable rollback/recovery identity.

The capture is valid only for the named candidate/runtime/build/config set.
Any change to one of those inputs invalidates the applicable screenshot set.
A screenshot mismatch fails the visual claim and retains both the mismatch and
expected-state description.

Screenshots supplement but never replace HTTP status, SSR content, asset,
hydration, navigation-request, server-function, accessibility, console,
cache/header or provider-readback assertions. A visually correct image is an
explicit false green for those other claims.

### `DCD-007` — fixed Production and rollback

Production uses one branded `prod` stage, the same logical Website resource
and a stable read-back `workers.dev` URL. It requires:

- accepted Preview evidence for the exact source/config/dependency identity;
- exact-SHA checkout and frozen installation;
- a separately reviewed Production plan projection/digest followed by a
  protected deploy approval and equal replan;
- a separately scoped Production principal;
- provider and Alchemy state readback;
- hosted HTTP/browser/accessibility/console/cache/header proof;
- bounded desktop/mobile screenshots; and
- an identified last-known-good candidate before mutation.

Production is a same-source rebuild unless byte identity is independently
proved. Promotion evidence must compare source, lockfile, package manifest,
Alchemy source, compatibility settings and build configuration, not claim that
the Preview bytes were promoted.

Cloudflare documents `workers.dev` as suitable for getting started and
recommends a route or custom domain for business-critical production traffic.
The fixed initial `workers.dev` endpoint remains an accepted product decision,
but Production authority must explicitly accept the account plan, subdomain,
cost/limits and this hostname-availability limitation. The later custom-domain
successor is the operational retirement trigger; it is not a blocker for the
initial Production slice.

Normal rollback redeploys a reverted or previously accepted exact candidate
through the same Production graph and repeats provider and hosted proof. Direct
Cloudflare version rollback is break-glass only, uses a separate authority
envelope, and requires immediate provider/Alchemy reconciliation.

The later custom-domain successor must preserve stack, stage, logical Website
resource and Worker identity. Domain/DNS/certificate authority and receipts
remain outside this SPEC.

### `DCD-008` — repeatable workflows and controls

After one authorized Preview and Production path are understood, admit the
smallest three mutating workflow classes:

- Preview plan/deploy/proof;
- Production plan/deploy/proof; and
- PR-close Preview teardown.

Also admit one report-only orphan inventory. It may compare open PRs, Alchemy
stages and Cloudflare resources; it must not destroy anything.

Each workflow must use exact-SHA checkout, pinned actions, frozen installation
and a two-phase contract. A cancellable, non-mutating plan operation emits the
candidate/stage/config-bound sanitized digest receipt. A separately invoked
protected deploy operation accepts that digest, reacquires a stage-scoped
`cancel-in-progress: false` mutation lock, rechecks freshness, replans, rejects
inequality, and only then applies. A newer mutation queues; it does not
interrupt an apply.

Alchemy beta.64 exposes no evidenced distributed remote-state lock. The
stage-scoped GitHub concurrency group is a repository orchestration lock, not
a provider lock. Manual DCD-002/DCD-003 operations therefore require one named
principal and an exclusive authority window, with provider/state drift
readback before and after mutation; any concurrent or out-of-band mutation is
a stop. Automated mutations remain subject to the same drift oracle.

Mutating admission belongs to the narrow target owner
`tools/docs-deployment/**`. It Schema-decodes automation/control records and
negative fixtures for deployment only; `tools/quality-workflow/**` and
`.github/workflows/quality.yml` remain unchanged read-only owners. Automation
records must name signal, immutable state, authority, convergence,
idempotence, cancellation, proof, stopping, recovery, escalation, carrying
cost, review trigger and retirement. Do not add a generic workflow framework
or lint rule.

Preview deploy credentials are available only to trusted same-repository pull
requests through a protected environment. Forks and untrusted candidates stop,
and no candidate code runs through `pull_request_target`. PR-close teardown
may use that event only if it checks out a reviewed default-branch
implementation commit, never the pull-request head, derives only the numeric
PR stage, and performs exact state/provider readback before destroy.

### `DCD-009` — authority, state, config and secrets

Use one new canonical target-owned runbook,
`docs/runbooks/docs-deployment.md`. It contains distinct sections and
authority envelopes for:

- provider inventory;
- Alchemy state bootstrap/adoption and recovery;
- Preview plan/deploy/readback;
- Preview destroy;
- Production plan/deploy/readback;
- normal rollback;
- break-glass version rollback; and
- Alchemy reconciliation.

One runbook is sufficient because these operations share the same docs
deployment target and recovery graph. The Alchemy state section must still
separate its account-wide resources, principal, lifecycle, backup/recovery,
drift, orphan detection and retirement from an application stage. The existing
four runbooks remain canonical; the contract changes from exactly four to
exactly five.

Remote state carries an account-wide Worker, state Durable Object and secret
material plus ongoing drift/recovery work. Review it on an Alchemy upgrade,
state-schema change, provider disagreement, orphaned stage, credential
rotation, failed destroy or recovery incident. Retire it only after every
TaxKit stack has been destroyed or migrated with provider absence/readback and
a separately authorized state-resource retirement receipt. A non-convergent
plan, unrecoverable state, or unexplained resource is disconfirming evidence
and stops application mutation.

Provider credentials remain workflow/runbook inputs and are never Worker
bindings. Public `VITE_*` values require an explicit app-owned Schema and are
never secret. Non-public Worker bindings require Schema-backed Config and
redaction at ingress. The initial docs deployment has no evidenced runtime
binding or secret, so none is added speculatively.

Every consequential operation records principal, identity source, exact
operation/resource/environment, scope, duration/revocation, approval,
readback, rollback and escalation. Missing fields are a stop, not permission
to widen credentials.

### `DCD-010` — proof, evidence and false greens

Preserve `docs/verification/critical-journeys.json` and the immutable
HGI-203/HGI-206/HFI evidence. Create one small separate deployment claim owner,
`docs/verification/docs-deployment-journeys.json`, with exactly:

- `taxkit-docs-workerd`;
- `taxkit-docs-preview`;
- `taxkit-docs-production`; and
- `taxkit-docs-deployment-rollback`.

This supporting inventory does not join local release closure and does not
retroactively change `taxkit-docs-runtime`. Dated receipts and screenshot
manifests live below `docs/evidence/deployments/`; raw provider logs and secret
values do not.

The target-owned deployment proof policy must Schema-decode this inventory and
reconcile each journey ID with its dated receipt and oracle class. DCD-002
creates and backfills the focused validator invocation; DCD-005 reruns it.

Hosted false-green failures include:

- stale candidate or receipt;
- wrong Worker or stage;
- provider/state disagreement;
- wrong-host redirect;
- asset fallback returning HTML;
- screenshot-only acceptance;
- hydration or console warnings hidden by a screenshot;
- client navigation that issues a document request;
- absent server-function transport;
- unsafe or incomplete destroy;
- cache status claimed without a matching cache policy; and
- rollback that restores content without restoring expected provider identity.

### `DCD-011` — bridge lifetime and retirement

The dual Nitro/Cloudflare path is temporary. Its carrying cost is two build
graphs, two artifact contracts and duplicate built-proof maintenance. Review
it after every adapter, TanStack, Vite, Effect, Alchemy or docs runtime change.

Retire Nitro, its Vercel preset, `.vercel/output`, `.output`, related Turbo and
clean-script entries, and the temporary dual-path policy only when:

- the workerd journey covers all relevant built-harness behavior;
- accepted exact-candidate Preview and Production receipts exist;
- normal rollback/redeploy is accepted;
- Worker runtime, assets, headers/cache and console proof reach parity;
- the Cloudflare built harness becomes the sole local production-artifact
  oracle; and
- no package/content owner depends on the Vercel path.

Disconfirming evidence is a Cloudflare path that cannot reproduce an accepted
SSR, server-function, navigation, accessibility, error or lifecycle behavior
without an unaccepted architecture expansion. In that state, keep the bridge,
retain the failure and seek the smallest product decision.

### `DCD-012` — documentation and lifecycle

Every vertical slice updates its executable owner, architecture/README
pointers, controls, proof and task status together. Do not accumulate a final
documentation cleanup task.

Materially revised legacy `status: canonical` architecture owners migrate to
the current metadata contract. Architecture owns durable design; the new
runbook owns exact procedures; code/config/Schemas/workflows own desired state;
dated receipts own provider observations; and this SPEC/tasks own active
intent. Retire duplicated procedure prose after the runbook owns it.

Implementation begins only after an active execution plan is created and
routed from `docs/exec-plans/active/README.md`. On accepted completion, move
that plan to completed history and update SPEC/task/index lifecycle. This
draft creates no active plan.

## Current and target trees

```text
Current
apps/docs/
  package.json
  vite.config.ts                  # TanStack + Nitro Vercel preset
  src/server.ts                   # Web Fetch handler
  src/lib/runtime.server.ts       # module-scoped ManagedRuntime
  scripts/test-built.tsx          # .vercel/output oracle
packages/docs-content/            # deployment-neutral content/runtime owner
packages/docs-fumadocs/           # deployment-neutral Fumadocs owner
turbo.json                        # .output/.vercel outputs
knip.production.json              # docs Vite entries, no Alchemy entry
```

```text
Target during migration
alchemy.run.ts
apps/docs/
  vite.config.ts
  src/server.ts
  src/lib/build/config.ts           # only if the tested build policy earns extraction
  scripts/test-built.tsx          # retained Nitro oracle until DCD-005
  package.json
tools/docs-deployment/
  schemas.ts                        # stage, plan, authority, readback and proof
  deployment-specific automation/control policy
  provider boundary and command owners created by their owning task
.github/workflows/
  quality.yml                     # preserved read-only
  docs-preview.yml
  docs-production.yml
  docs-preview-teardown.yml
docs/runbooks/docs-deployment.md
docs/verification/docs-deployment-journeys.json
docs/evidence/deployments/
```

No new package is added. The exact tool filenames and executable command
invocations are backfilled by the task that proves them.

## Call and resource graphs

```ts
Local workerd: target

exact source + frozen lock
  -> app-owned build branch on Alchemy's injected Vite signal
    -> root Alchemy Website composition in provider-free build mode
      -> supported deployable Worker module + static assets
        -> exact-pinned workerd-compatible harness
          -> HTTP and Playwright oracles
          -> runtime-construction/filesystem/limit instrumentation
```

```ts
Preview: target

trusted PR head
  -> local Quality and workerd receipt
  -> branded pr-<number> stage
  -> separately authorized non-mutating sanitized plan + digest receipt
  -> human acceptance
  -> protected deploy approval + stage lock + equal replan
  -> Alchemy Cloudflare remote state
    -> Cloudflare.Website.Vite("DocsWebsite")
      -> isolated Worker + assets + workers.dev URL
  -> provider/state readback
  -> hosted HTTP/browser + desktop/mobile screenshot receipt
```

```ts
Production: target

accepted Preview source/config/dependency identity
  -> separately authorized fixed prod-stage plan + digest receipt
  -> human acceptance + protected deploy approval + stage lock + equal replan
  -> same Alchemy stack and Website logical resource
    -> stable Production Worker + assets + workers.dev URL
  -> latest fully promoted deployment/version readback
  -> hosted HTTP/browser + desktop/mobile screenshot receipt
```

```ts
Teardown: target

closed PR + exact pr-<number> stage + teardown authority
  -> same stage mutation lock
  -> open-PR/state/provider preflight
  -> destroy plan
  -> exact-stage destroy
  -> state/provider absence readback
```

```ts
Normal rollback: target

failed Production receipt + last-known-good accepted candidate
  -> exact reverted/previous source
  -> Production plan + approval + equal replan
  -> fixed prod stage redeploy
  -> provider/state identity readback
  -> hosted behavior and bounded visual proof
```

## Failure and stop contract

| Failure | Required response |
| --- | --- |
| Incompatible beta.100/beta.64 graph | Stop `DCD-001`, retain package/lock/test evidence, and seek a dependency decision; do not add compatibility wrappers or fall back silently. |
| No supported provider-free Worker seam | Stop `DCD-001`, retain exact Alchemy/Vite source evidence, and do not test a parallel artifact or access provider state. |
| Worker build or Node compatibility failure | Correct the earliest app/package runtime owner or stop with the unsupported API and bundle path. |
| Runtime filesystem leakage | Correct `packages/docs-content` only if the workerd stack proves request-time reachability. |
| Per-request runtime construction or isolate leak | Correct the app runtime owner and keep Nitro bridge until the oracle passes. |
| Stale candidate | Stop before plan/apply and retain the observed PR/SHA mismatch. |
| Plan drift | Reject apply when the accepted and current sanitized digests differ. |
| Concurrent or out-of-band mutation | Stop on provider/state drift; a GitHub concurrency group is not a distributed Alchemy lock. |
| Wrong Worker/stage | Stop proof and mutation; do not redirect the oracle to a convenient URL. |
| Provider/state disagreement | Stop promotion/teardown and route reconciliation through the deployment runbook. |
| Unsafe destroy | Retain the resource, stop, and escalate; never broaden a delete selector. |
| Hosted false green | Reject the applicable claim and retain HTTP/browser/provider/screenshot evidence separately. |
| Screenshot mismatch | Retain the mismatch, expected state and reviewer decision; do not override behavioral failures. |
| Rollback mismatch | Stop closure until provider identity and hosted behavior match the rollback target. |
| Credential overreach or unknown revocation | Stop before provider access and request a narrower authority envelope. |

## Authority gates

| Gate | Must exist before |
| --- | --- |
| Account, plan, Workers subdomain and read-only provider inventory receipt | First Preview plan |
| Alchemy state bootstrap/adoption principal and recovery identity | First stateful plan/apply |
| Preview deploy and separate destroy principals/scopes | First Preview mutation |
| Protected Preview environment and trusted-PR decision | First Preview mutation |
| Production principal, approver, stable Worker identity, account/plan/subdomain, workers.dev limitation and cost/limit acceptance | First Production mutation |
| Last-known-good candidate and normal rollback authority | First Production mutation |
| GitHub workflow principals, protected environments and stage-lock policy | Repeatable automation |
| Zone/hostname/DNS/certificate authority | Future custom-domain successor only |

These gates do not block writing or reviewing this SPEC.

## Evidence and screenshot retention

Each dated deployment evidence directory contains only bounded, sanitized
manifests, receipts and the representative PNGs required by `DCD-006`. It
records retention owner, review trigger, carrying cost and retirement:

- owner: `taxkit-docs-deployment-operation-owner`;
- carrying cost: provider identity review plus at most two representative
  screenshots per accepted environment/candidate observation;
- review trigger: candidate/runtime/build/config/provider contract or rollback;
- retirement: a successor receipt explicitly supersedes an active observation;
  historical accepted/failed receipts remain addressable; and
- disconfirming evidence: digest/readback/oracle mismatch, expired artifact,
  absent reviewer or an image without its manifest.

Raw provider logs, credentials and mutable dashboards remain outside Git.

## Fixed downstream-impact ledger

| Surface | Decision | Paths and implementation obligation |
| --- | --- | --- |
| SPEC/tasks/index | Change required | This SPEC, `docs-cloudflare-alchemy-deployment.tasks.json`, and `docs/product-specs/index.md`; create an active plan only when `DCD-001` starts. |
| Root manifest and lock | Change required | `package.json`, `bun.lock`; exact Effect/Platform beta.100 and Alchemy beta.64 graph. |
| Docs app manifest/build/runtime | Change required | `apps/docs/package.json`, `vite.config.ts`, optional `src/lib/build/**`, `src/server.ts`, runtime owners and `scripts/test-built.tsx`; add the exact local harness dependency only after DCD-001 proves the supported seam and preserve route/React ownership. |
| Other workspace manifests | Preserve | Catalog consumers receive beta.100 through the root catalog and require proportional qualification, not textual churn, unless the upgrade proves a workspace-owned manifest change. |
| Content packages | Preserve | `packages/docs-content/**`, `packages/docs-fumadocs/**`; change only if workerd proves an owning filesystem defect. |
| Root deployment composition | Change required | New `alchemy.run.ts`; no infrastructure package. |
| Turbo/Knip/ignore | Change required | `turbo.json`, `knip.production.json`, `.gitignore`; reachability and bridge retirement. |
| Architecture | Change required | `docs/architecture/deployment.md`, `frontend.md`, `testing-and-quality.md`, `package-ownership.md`; migrate materially edited legacy metadata. |
| Root/app/package READMEs | Change required / Preserve | Update `README.md` and `apps/docs/README.md` pointers; preserve docs-content/docs-fumadocs READMEs unless their runtime contract changes. |
| Runbooks/router/profile | Change required | `docs/runbooks/docs-deployment.md`, `docs/runbooks/README.md`, `docs/runbooks/recovery.md`, `docs/README.md`, `tools/documentation/runbook-contract.json`, runbook Schemas/policy/tests, `.agents/skills/docs-maintainer/references/repository-profile.md`, `docs/verification/repository-harness-profile.json`, `docs/verification/effectiveness.md`, `tools/skills/canonical-skill-baseline.json`, and a proportional successor entry in `docs/verification/harness-epochs.md`; preserve prior epoch and HFI receipts. |
| Authority | Change required | `docs/operations/authority-model.md` and machine-checked runbook authority records. |
| Automation/controls/CI | Change required | Deployment-only Schema/policy/fixtures under `tools/docs-deployment/**`, `docs/operations/automation-register.md`, `docs/standards/controls.md`, `.github/workflows/docs-*.yml`; preserve `tools/quality-workflow/**` and `.github/workflows/quality.yml` as independently read-only. |
| Local/browser proof | Change required | Existing docs tests plus task-created workerd/provider commands under `tools/docs-deployment/**`; reuse the implemented browser harness. |
| Deployment journeys/evidence | Change required | New `docs/verification/docs-deployment-journeys.json` and `docs/evidence/deployments/**`; preserve current release journeys and immutable evidence. |
| Screenshots | Change required | Bounded Preview/Production PNGs plus Schema-decoded manifests under the dated deployment evidence route. |
| Secrets/config | Change required / N/A | Add deployment/receipt Schemas and authority metadata; application runtime secret or binding is N/A until evidenced. Never store values. |
| DNS/custom domain | N/A | No zone, route, domain, certificate, hostname, DNS workflow or task. Preserve the future identity boundary in architecture only. |
| Application stateful services | N/A | No KV, D1, R2, application Durable Object, Queue, Hyperdrive or Cron. Alchemy remote state is control-plane state only. |
| Observability | Change required / N/A | Root Website composition explicitly enables the bounded built-in invocation-log policy after local source/config qualification and DCD-002 provider readback, or records it disabled pending DCD-005; traces, custom telemetry and third-party destinations are N/A. |
| New package/service/lint | N/A unless proved | No package or lint rule. Add a tool-local provider service only if direct readback needs a real substitution boundary. |
| HGI/HFI/completed history | Preserve | HGI-203, HGI-206, HFI and completed docs-app SPEC/tasks/plan/evidence remain unchanged. |
| Release/Changesets | N/A | All currently affected workspaces are private and no package export/consumer contract changes. Re-evaluate only if an owning package contract changes. |
| Public docs copy/navigation | Preserve | No MDX, navigation taxonomy, lifecycle or public copy change. |
| Skills/AGENTS | Change required / Preserve | Update only the TaxKit docs-maintainer repository profile because its exact runbook count changes; preserve `AGENTS.md` and other skills unless routing evidence proves a stale pointer. |

## Progressive implementation slices

### Slice 1 — upgraded local Cloudflare candidate

Upgrade the exact Effect/Platform and Alchemy graph, add the app Cloudflare
mode and root Website composition, run the emitted Worker under workerd, and
retain Nitro as an independent oracle. Observable outcome: one frozen local
candidate passes SSR, assets, server functions, 404, hydration/navigation,
runtime reuse, filesystem and limit proof.

### Slice 2 — first end-to-end Preview

Add only the deployment runbook, authority/state/receipt owners required for a
separately authorized Preview. Plan, deploy, read back, prove and visually
review one isolated trusted-PR Worker. Teardown it safely or retain a precise
authority stop. Observable outcome: one exact candidate has a dated provider
Preview receipt and bounded screenshots.

### Slice 3 — first end-to-end Production

Use the accepted Preview source/config/dependency identity to deploy fixed
Production at its stable provider URL, prove it, capture screenshots and test
normal rollback/redeploy. Observable outcome: one accepted Production
deployment and one accepted recovery observation.

### Slice 4 — make delivery repeatable

Admit the three mutating workflows and report-only orphan inventory. Add
stage-scoped locks, protected environments, equal replans, exact-SHA checks,
receipts and PR-close teardown without changing Quality's read-only contract.
Observable outcome: repeatable provider operations enforce the same contracts
proved manually.

### Slice 5 — parity and bridge retirement

Close remaining cache/header/logging, failure, lifecycle, docs and evidence
gaps. Prove Preview/Production/rollback parity, then remove Nitro/Vercel and
dual-path assumptions. Observable outcome: Cloudflare is the sole production
build/deployment route and historical proof remains available.

## Verification contract

Only current repository commands are named here:

```text
bun install --frozen-lockfile
bun run docs:validate
bun run --filter=@taxkit/docs-content test
bun run --filter=@taxkit/docs-fumadocs test
bun run --filter=docs test
bun run --filter=docs test:browser
bun run --filter=docs test:built
bun run --filter=docs check-types
bun run docs:build
bun run check:quality-workflow
bun run check:docs
bun run check:runbooks
bun run check:repository-paths
bun run test:skills
bun run verification
git diff --check
```

Each task that creates a workerd, provider, screenshot, teardown or rollback
command must execute it successfully at its claimed boundary and replace its
descriptive ledger gate with the exact verified invocation before that task
can complete.

Local checks do not prove a hosted Preview, Production deployment, provider
state, public availability or rollback. Provider proof requires separately
authorized readback and hosted journey receipts.

## Acceptance criteria

- All five vertical slices are accepted in dependency order.
- Effect/Platform beta.100 and Alchemy beta.64 are exact, frozen and
  repository-wide qualified.
- Preview and Production exist at read-back provider Worker URLs and are bound
  to exact candidates.
- Preview teardown and Production rollback have accepted readback.
- Desktop/mobile screenshot manifests satisfy `DCD-006` without substituting
  for behavioral proof.
- The deployment runbook, authority, automation, control and evidence owners
  agree.
- Quality remains independently read-only and cancellable.
- Custom-domain/DNS work and unnecessary resources remain absent.
- Nitro/Vercel and `.vercel/output` are removed only after Cloudflare parity.
- Historical HGI/HFI/docs-app evidence remains unchanged.
- The completed implementation records exact commands, receipts, limitations,
  non-claims, carrying costs and retirement state.

## References

- [Docs application architecture](./docs-application-architecture.md)
- [Deployment architecture](../architecture/deployment.md)
- [Frontend architecture](../architecture/frontend.md)
- [Testing and quality](../architecture/testing-and-quality.md)
- [Package ownership](../architecture/package-ownership.md)
- [Authority model](../operations/authority-model.md)
- [Runbook index](../runbooks/README.md)
- [Sibling implementation tasks](./docs-cloudflare-alchemy-deployment.tasks.json)
