---
document_type: architecture
lifecycle: current
authority: canonical
owner: taxkit-architecture-owner
last_reviewed: 2026-08-10
review_trigger: deployment target, runtime adapter, provider resource, state, domain, or rollback change
---

# Deployment

The docs app has a locally qualified Cloudflare Worker build and an Alchemy
deployment composition. DCD-002 established one dated, exact-candidate Preview
observation and safely removed that isolated stage. DCD-003 deployed the same
accepted source to fixed stage `prod`, qualified a distinct successor through
Preview and Production, and restored the accepted source through the normal
Alchemy graph while preserving the Worker URL and state identity. Earlier
failed Preview attempts remain historical disconfirming evidence, not current
provider truth.

## Scope

This doc owns durable deployment and resource boundaries. Exact operator
steps belong in the target-owned deployment runbook; current implementation
intent and task state belong in the active SPEC and execution plan.

## Current runtime shape

- `apps/api` runs as a Bun HTTP server and serves `/api/*`.
- `apps/web` builds through Vite/TanStack Start and calls `apps/api` over HTTP.
- `apps/docs` owns one Cloudflare build mode. Exact
  `@cloudflare/vite-plugin@1.47.0` emits `dist/server/index.js`, its server
  modules and `dist/client` assets. The former docs-app Nitro/Vercel bridge was
  retired after local parity; `apps/web` remains a separate Nitro owner.
- Root `alchemy.run.ts` owns one `TaxKitDocsCloudflare` stack, branded
  `pr-<number>` or `prod` stage admission, the mutation composition's
  `Cloudflare.state()`, one `Command.Build`, and one logical `DocsWebsite`
  Worker. It uploads the plugin-produced output through
  `Cloudflare.Worker({ bundle: false })`; Alchemy owns the physical Worker
  name. The separate report-only inventory owner uses Alchemy's public
  `makeHttpStateStore` after Schema-decoding the account-matched cache, with a
  fallback to the same protected JSON credential only when a nested process
  cannot see that cache, so it cannot bootstrap, write or delete state.
- The Worker uses compatibility date `2026-06-24`, `nodejs_compat`, default
  asset-first full-stack routing, a provider Worker URL, built-in invocation
  logs and disabled traces. Hashed `/assets/*` responses are immutable.
- The initial app has no runtime bindings, secrets or stateful application
  service. KV, D1, R2, Durable Objects, Queues, Hyperdrive, Cron, custom
  domains, DNS and third-party observability are absent.
- `tools/docs-deployment/automation-register.json` and `controls.json` own the
  Schema-decoded desired state for three mutating workflow classes and one
  report-only orphan inventory. Their validator still reports zero externally
  established automations because the aggregate register is fail-closed. The
  four workflow owners are on the reviewed default branch and the three
  mutation classes have dated provider/hosted receipts. The report-only owner
  has a dated branch-bound state/provider success, but its reviewed
  default-branch source run is still required before the register can claim
  complete external establishment.
- `@taxkit/api-http` builds as a package and exposes health, generated docs,
  OpenAPI JSON, metadata and public calculation route contracts.
- `@taxkit/sdk` builds as a private package for local and downstream
  validation. It has not been published to npm.

## Docs deployment graph

```text
frozen source and lock
  -> apps/docs build (or build:cloudflare compatibility alias)
    -> Cloudflare Vite plugin
      -> dist/server/index.js plus modules
      -> dist/client assets
  -> root Alchemy Command.Build
    -> Cloudflare.Worker("DocsWebsite", bundle: false)
      -> isolated pr-N Worker or fixed prod Worker
      -> read-back workers.dev URL
```

The local command copies only emitted output to a temporary directory, removes
checkout paths from the generated Wrangler config, strips provider credential
variables, runs Wrangler dry-run and then runs the same no-bundle module graph
under workerd. Local proof does not establish provider state or deployment.

`bun run check:docs-deployment-inventory` is the separate credentialed,
provider-bound readback owner. It compares exact `TaxKitDocsCloudflare` state
stages/resources with account Worker enumeration through public installed
Alchemy APIs, fails on disagreement and emits only sanitized identities and
non-claims. It is deliberately outside root verification and does not build,
plan, apply, destroy or prove hosted behavior.

Ephemeral GitHub runners do not retain Alchemy's derived
`cloudflare-state-store` credential after a plan or apply. The three mutation
workflows therefore run the supported `alchemy cloudflare bootstrap` operation
with `CI=0` immediately before planning or teardown. A preceding supported
`alchemy login` with `CI=1` writes only the `method: "env"` profile selector;
bootstrap then refreshes only the account-matched state-store cache for that
runner, and the inventory command reads the cache under `CI=1`. This does not
grant the report-only workflow mutation authority and does not copy the local
OAuth profile into CI.

`bun run check:docs-deployment-orphans` composes that readback with an exact
read-only GitHub open-PR query. Its Schema-decoded receipt classifies each
`pr-N` stage as trusted-active, untrusted or an orphan candidate and separately
reports trusted open PRs without a stage. It has no provider-write or deletion
operation. A candidate is only a dated human-review input, never teardown
authority.

The accepted Preview requalification used candidate
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a` at deterministic stage `pr-1`.
Alchemy created one prebuilt Worker/assets resource after two equal sanitized
plans. Cloudflare readback and hosted proof agreed on the physical Worker,
deployment/version, assets, provider URL, invocation-log persistence and
disabled traces. The `/assets/*` cache contract required the root composition
to pass the app-owned `_headers` file through the public Worker asset
configuration. Exact-stage destroy subsequently removed the Preview Worker
and stage resources. These dated observations prove neither current Preview
availability nor Production.

The earlier `0d714e6…` observation remains retained because it exposed the
asset-header correction, but it lacked complete pre-mutation and
candidate/screenshot/state bindings. It is trajectory evidence, not the
accepted Preview chain.

The accepted DCD-003 Production evidence first rebuilt exact Preview-qualified
source `d9cb894…` into fixed stage `prod`. Cloudflare and Alchemy readback
agreed on Worker
`taxkitdocscloudflare-docswebsite-prod-ujphggiaxw5ryjev`, stable provider URL,
assets, deployment/version and state instance. The full hosted and bounded
screenshot contract passed.

The normal rollback rehearsal then qualified repository successor `c99984c…`
through a temporary isolated `pr-1` Preview, removed that Preview, deployed it
through the same fixed Production graph, and redeployed `d9cb894…`. The two
Production updates retained the Worker name, URL and Alchemy instance while
creating distinct deployment/version identities; final state restored the
initial d9 bundle hash. Deployment-critical source configuration and lock
identity were unchanged, but path-bearing clean-build output differed, so this
is source-bound rollback evidence—not byte promotion or recovery from known
broken content.

Preview owns an isolated deterministic stage and is destroyed only through
exact-stage readback. Production owns the fixed `prod` stage and stable
provider URL. The latest dated readback observed restored `d9cb894…`; it is not
a timeless availability claim.
Custom-domain attachment is a future successor and must preserve the
Production Worker identity and deployment contract.

## 2026-08-05 workflow observation

The reviewed deployment workflows are on default branch
`1b6d36b765a5953f79b0932c127f01088603930f`. The Preview plan/deploy pair
`30962576035`/`30962743727` and corrected exact-stage teardowns
`30964380634`/`30964525980` supplied claim-matched state/provider receipts for
the `pr-10`/`pr-9` stages. The PR-close teardown `30966977503` safely produced
an absent-stage no-op for `pr-12`. Production plan/deploy pairs
`30964647432`/`30964781776` and `30965270740`/`30965398455` plus rollback
`30965691430`/`30965797032` supplied fixed-stage deployment, hosted,
screenshot and source-bound restore evidence. These are dated workflow
observations; they do not change the provider-neutral architecture or imply a
custom domain, DNS, publication or byte-promotion claim.

Merge-era PR-close run `30968741396` repeated the exact-stage no-op for `pr-13`
at default-branch candidate `936f3326a6100582ecd8ffb88b299985bc8db875` and
read back state/provider agreement with no matching Preview Worker. Its
sanitized receipt is retained under
`docs/evidence/deployments/2026-08-05-preview-pr-13/`.

The report-only orphan workflow has a separate unresolved boundary. Run
`30966300887` stopped before inventory because `GH_TOKEN` was missing; after
that owner correction, `30967000841` reached deployment inventory but could not
derive Alchemy beta.64's HTTP state-store bearer with the read-only Cloudflare
token. The mutation bootstrap path is not permitted for report-only inventory.
Therefore the deployment register remains `not-established` as an aggregate
state claim, and scheduled orphan detection remains an inconclusive,
non-mutating report rather than an absence or teardown signal.

## 2026-08-09 docs-app bridge-retirement observation

The clean candidate `d649a14fe49122387e33a6de0547468e6a3e4967` is the first
docs-app revision whose canonical `test:built` proof runs the Cloudflare Vite
output under local workerd. The docs-app Nitro/Vercel preset, target selector
and `.vercel/output` harness are removed; the independent `apps/web` Nitro
owner and shared root output declarations remain. The bounded local receipt is
`docs/evidence/deployments/2026-08-09-local-bridge-retirement/receipt.json`.
It proves the local artifact and behavior contract only. It does not establish
hosted requalification for this candidate or resolve the separate report-only
Alchemy state-store boundary.

## 2026-08-10 current hosted deployment epoch

The current b59e4ee candidate has claim-matched provider and hosted evidence
for isolated Preview `pr-15`, exact-stage teardown, fixed Production and a
normal source-bound rollback/redeploy. Preview and Production both use the
provider-owned workers.dev URL; the stable Production Worker identity is
retained through rollback and final redeploy. The teardown workflow's reviewed
implementation SHA is recorded separately from the removed PR candidate
because PR-close recovery intentionally executes default-branch code.

This epoch does not establish custom-domain/DNS routing, a paid plan or cost,
byte promotion, release/publication or future availability. The report-only
workflow's branch-bound state/provider receipt remains separate from hosted
application proof and does not advance the automation register until a
reviewed default-branch source readback exists.

The workflow contract is intentionally narrower than the application graph:
Preview and Production derive a canonical plan projection, reject unexpected
Alchemy resources on both the initial plan and equal replan, then read back the
exact stage, Worker, account/state identity, deployment, version and
pre-mutation version before running the shared hosted proof owner. The hosted
workflow output is split into a retained raw diagnostic and a strict
Schema-decoded receipt; screenshot bytes are copied into the artifact route and
their digests are recomputed. Production consumes a successful,
Schema-decoded Preview workflow receipt, exact workflow path and deterministic
`pr-N` binding rather than trusting caller-supplied source or plan fields.
The mutation jobs Schema-decode the initial plan, equal replan and teardown
projection before apply/destroy; Production also downloads and checks the
accepted Preview plan artifact. A promoted external receipt must carry a
Schema-decoded successful `main` workflow-run readback whose path/ref/head
matches its workflow commit, and its hosted receipt must match stage semantics
with exactly one desktop and one mobile screenshot. Report-only dispatch is
forced to the reviewed default branch before installing dependencies or
materialising the state bearer, while Preview rejects non-numeric PR identity
before provider bootstrap. Rollback recovery identity is bound to the accepted
Preview provider receipt.
Teardown has a target-specific preflight and exact state/Worker absence
postcondition, including a distinct Schema-decoded absence receipt for a safe
no-op; both pull-request events and manual teardown recheck that the PR is
closed. The scheduled orphan workflow is reviewer-protected and remains a
report-only/manual signal; its 1,000-row pull-request bound fails closed when
inventory completeness is unknown. These controls are desired-state and
dated-receipt owners, not claims that the current branch or public domain is
available.

## Local runtime shape

Run the API, web app and docs app as separate local processes:

```sh
bun run --filter=api dev
bun run --filter=web dev
bun run --filter=docs dev
```

`apps/api` dev runs through portless as `https://api.taxkit.localhost`.
`apps/web` dev injects that URL into `TAXKIT_API_BASE_URL` and
`VITE_TAXKIT_API_BASE_URL` before serving through portless as
`https://taxkit.localhost`. `apps/docs` serves through portless as
`https://docs.taxkit.localhost`. Production deployment should provide
equivalent API base URL environment values explicitly.

The focused Cloudflare candidate proof is:

```sh
bun run --filter=docs test:built
```

It proves the emitted no-bundle Worker and assets locally under real workerd;
`test:cloudflare-built` is an explicit alias. The former Nitro/Vercel receipt
remains historical migration evidence, not a live build path. Local agreement
does not prove provider or public availability.

## Guardrails

- Do not couple engine packages to deployment providers.
- Keep provider composition at root and app build semantics in `apps/docs`;
  do not add an infrastructure package or expose a raw provider client.
- Decode stage and provider readback representations at their ingress and keep
  physical names and URLs provider-owned.
- Treat `.wrangler/**` and `apps/docs/dist/**` as ignored generated output.
- Keep normal docs requests independent of repository files. Generated
  Fumadocs raw-text access and validation policy may retain Node filesystem
  code only behind their non-runtime operations.
- Keep server-only handlers behind explicit server exports.
- Keep local, workerd, Preview, Production, provider-state, rollback and future
  domain claims separate.
- Provider mutation requires the named authority, sanitized plan/equal replan,
  stage lock, readback and receipt defined by the deployment runbook.
- Treat workflow code, protected GitHub environments, credential identities and
  dated hosted receipts as separate establishment conditions. Do not infer any
  of them from the local automation register.

## Related docs

- [API and SDK](./api-and-sdk.md)
- [Frontend](./frontend.md)
- [Testing and quality](./testing-and-quality.md)
- [Docs deployment runbook](../runbooks/docs-deployment.md)
- [Dated deployment evidence](../evidence/deployments/README.md)
