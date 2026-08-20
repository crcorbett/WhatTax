---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: cache provider, workflow, action pin, release graph, dependency, browser, authority, or proof change
successor: null
tombstone: false
status: implemented
source_of_truth: docs
confidence: medium
---

# Turbo and CI Cache Efficiency

## Implemented outcome

The completed implementation retains three separate cache layers:

1. Turborepo task outputs and logs through Vercel Remote Cache.
2. Bun's global package cache through GitHub Actions cache.
3. Playwright's Chromium browser cache through GitHub Actions cache.

Every eligible deterministic Turbo task must use the same cache engine in pull
requests, pushes to main, trusted Preview/Production/Teardown/Receipt
workflows and explicit local opt-in. This includes root-level repository
commands that are migrated to Turbo root tasks as well as existing workspace
tasks. Vercel Remote Cache read/write authority must still be event-scoped so a
pull request cannot overwrite trusted main entries or expose a deployment
credential. Bun packages and Chromium use separate GitHub-hosted cache entries
and must remain usable when a cache is absent.

TCC-001 through TCC-005 are complete. Same-commit main evidence reduced one
Turbo-backed Quality worker from 5m36s to 1m09s. Exact warm Bun and Chromium
entries reduced their own setup steps, although job-level variation means no
general end-to-end dependency-cache saving is claimed. A trusted Preview
plan-only run and its exact rerun recorded remote Turbo hits, cold then warm
dependency-cache behaviour, an unchanged plan digest and no deploy step. The
terminal decision is `retain`; dated measurements and their limits are in
[`TCC-005-closeout.md`](../documentation-audit/ci-cache-efficiency/TCC-005-closeout.md).

This SPEC does not reopen the implemented Quality Trigger Efficiency SPEC. That
SPEC still owns the pull-request and main trigger split.

Task plan:
[ci-cache-efficiency.tasks.json](./ci-cache-efficiency.tasks.json)

## Problem and evidence

TaxKit's current Quality workflow has no Vercel Remote Cache, GitHub Actions
dependency cache, or Playwright browser cache. The repository already ignores
the local .turbo directory, but no cache is shared between fresh runners.

The current hosted baseline is materially uneven:

- [Quality run 32316014670](https://github.com/crcorbett/taxkit/actions/runs/32316014670)
  took 266 seconds. Bun installation took 13 seconds, Chromium setup 26
  seconds, and the release graph 216 seconds.
- [Quality run 32305069327](https://github.com/crcorbett/taxkit/actions/runs/32305069327)
  took 1,585 seconds. Chromium setup alone took about 1,319 seconds.
- [Quality run 32304045477](https://github.com/crcorbett/taxkit/actions/runs/32304045477)
  took 564 seconds, including about 298 seconds of Chromium setup.
- Successful Preview, Production, Teardown and receipt runs repeatedly spend
  about 14–18 seconds installing dependencies and 8–10 seconds installing
  Chromium where browser proof is used.

The executable owners are:

- [.github/workflows/quality.yml](../../.github/workflows/quality.yml)
- [turbo.json](../../turbo.json)
- [package.json](../../package.json)
- [tools/quality-workflow check](../../tools/quality-workflow/check.runtime.ts)
- [tools/docs-deployment check](../../tools/docs-deployment/check.runtime.ts)
- [testing and quality](../architecture/testing-and-quality.md)
- [CI controls](../standards/controls.md)

The current release graph remains the source of truth:

~~~ts
root release:check
  -> @taxkit/scripts release-readiness
    -> bun run verification
    -> bun run test
    -> bun run build
    -> bun run docs:validate
    -> SDK packed-artifact check
    -> SDK downstream validation
    -> API smoke
    -> docs browser test
    -> Changeset status
~~~

## Goals

- Reduce repeated network downloads and repeated deterministic Turbo work on
  fresh GitHub-hosted runners.
- Route every eligible deterministic root and workspace command through
  Turbo's task graph so local and remote Turbo caching applies consistently.
- Preserve all nine release checks, their order, their failure behaviour and
  their current pull-request and main coverage.
- Apply the Vercel Remote Cache policy to pull requests, main, manual
  deployment/receipt workflows and explicit local opt-in, not only main runs.
- Make every cache hit, miss, fallback and bypass observable.
- Keep cache contents outside the source checkout.
- Use exact lockfile, Bun, operating-system and Playwright-version inputs for
  cache identity.
- Ensure cache failure falls back to a complete uncached run.
- Keep provider cache authority separate from deployment, publication and
  production authority.
- Measure worker duration, feedback latency, synchronous maintainer attention
  and time to accepted outcome for cold and warm observations.

## Non-goals

- No affected-package selection, path filters, or skipped release checks.
- No multi-job Quality redesign in the first cache slice.
- No GitHub Actions cache of node_modules in the first slice.
- No caching of provider plans, state stores, deployment receipts, source
  files, credentials, or hosted proof as an authority substitute.
- No promotion of a cached documentation build from Preview into Production.
- No Turbo replay for dependency installation, browser installation or other
  commands whose correctness depends on live operating-system state.
- No Turbo replay for candidate identity, provider mutation/readback, receipt
  promotion or other stateful release-proof boundaries.
- No pull_request_target execution or deployment, publication or production
  credential exposure to pull-request code. Any pull-request cache credential
  needs an explicit cache-only/read-safe or isolated design and authority
  envelope.
- No automatic local developer login, Vercel team linking or committed
  provider token; local remote-cache use is explicit and developer-managed.
- No package, SDK, API, public docs, or runtime behaviour change.
- No Changeset, because the proposed change is CI configuration, repository
  tooling and maintainer documentation only.

## Current and target call graphs

### Quality: current

~~~ts
Quality pull_request or push main
  -> full-history checkout
  -> Bun setup
  -> bun install --frozen-lockfile
  -> Playwright install
  -> quality workflow policy check
  -> release:check -- --ci
    -> complete nine-check release graph
~~~

### Quality: target

~~~ts
Quality pull_request or push main
  -> full-history checkout
  -> Bun setup
  -> restore Bun package cache
  -> restore Playwright browser cache
  -> bun install --frozen-lockfile
  -> Playwright install with the existing dependency policy
  -> quality workflow policy check
  -> run every eligible root and workspace task through Turbo
    -> complete nine-check release graph
  -> read/write Vercel Remote Cache under the approved event policy
  -> save successful Bun and Playwright entries in the event-appropriate scope
~~~

The pull-request graph remains complete even when all caches miss. A pull
request must use either an approved read-safe remote-cache credential or an
event-isolated cache namespace; it must never receive a deployment credential
or write trusted main entries. This is a cache-safety constraint, not a reason
to remove pull-request remote caching from the target.

### Deployment: target

~~~ts
Trusted Preview, Production, Teardown or Receipt workflow
  -> exact existing candidate and stage preflight
  -> restore Bun package and, where applicable, Playwright browser caches
  -> frozen install and browser setup
  -> run eligible root and workspace checks/builds through Turbo with Vercel
     Remote Cache
  -> existing provider plan, mutation, readback and hosted proof live
  -> existing exact artifact and receipt reconciliation
~~~

Provider-bound commands, external artifact download, receipt promotion and
other stateful deployment boundaries remain live. A cached provider-free build
or checker may accelerate those workflows, but it never supplies candidate,
provider, hosted or receipt authority.

### Command classification

Turbo owns deterministic repository work: workspace builds, tests, type checks,
generation, root-level validators and the report-only release graph after the
root-task audit. The implementation may use Turbo's `//#` root-task support to
wrap commands that currently live only in the root `package.json`.

The following remain explicit live steps around that graph: `bun install`,
Playwright and operating-system dependency installation, candidate identity and
receipt writes, external workflow/artifact reads, provider plans and mutations,
provider/hosted readback, and any command whose input cannot be represented in
the Turbo hash. They are not silently treated as cacheable merely to make the
graph look faster.

## Cache design

### Turborepo and Vercel Remote Cache

Turborepo's external CI integration uses TURBO_TOKEN and TURBO_TEAM. The first
slice shall:

- make remote caching available to every eligible Turbo invocation in Quality,
  deployment and receipt workflows, plus explicit local opt-in;
- use an event-scoped cache authority matrix: trusted workflows may read/write
  the TaxKit cache, pull requests must use an approved read-safe credential or
  isolated namespace, and no event may write trusted main entries from
  untrusted code;
- use a narrowly scoped Vercel token whose authority is limited to the TaxKit
  team remote cache;
- keep the team slug in a non-secret GitHub variable or equivalent
  maintainer-owned configuration;
- avoid printing the token or any cache-authentication response;
- preserve a complete local graph when the token, network or cache service is
  unavailable;
- audit turbo.json task inputs, outputs and environment sensitivity before
  accepting remote hits;
- migrate cacheable root commands to explicit Turbo root tasks without
  self-recursive package scripts;
- add globalEnv, globalDependencies or task-specific inputs only where
  repository evidence shows they are required for correct invalidation;
- retain the full Quality and deployment proof graphs even when Turbo replays a
  cached task; and
- prove remote-cache hits in pull-request/main and at least one trusted
  deployment or receipt workflow, plus a forced uncached run for the same
  source candidate.

The cache contains Turbo task artifacts and logs, not source authority. Task
logs must not contain credentials or provider response secrets. Remote-cache
availability is an acceleration dependency, not a release-readiness
dependency.

### Bun package cache

Bun stores downloaded registry packages in its global cache. The workflow shall
resolve or set an explicit cache directory outside the checkout, restore it
with a full-SHA GitHub Actions cache action, then continue to run
bun install --frozen-lockfile.

The initial key must vary by at least:

- runner operating system;
- .bun-version;
- bun.lock digest.

The first slice must not cache node_modules. Bun must still recreate the
workspace installation from the frozen lockfile so that missing packages,
platform-specific links and lifecycle scripts remain visible.

### Playwright Chromium cache

Bun's package cache does not contain Chromium. Playwright downloads browser
binaries into its own operating-system cache, so Chromium needs a separate
GitHub Actions cache.

The workflow shall:

- use an explicit Playwright browser directory outside the checkout;
- restore the directory before the existing Playwright install command;
- key it by operating system and the lockfile-resolved Playwright version;
- run the existing browser install and complete browser proof after restore;
- save only after a successful browser install;
- verify the installed Chromium identity with the existing browser tooling; and
- record that --with-deps may still install operating-system packages even
  when the Chromium binary is cached.

This cache must not be treated as proof that the runner's system dependencies
are present.

### GitHub Actions cache policy

Any new cache action must be pinned to a full commit SHA and recorded in the
existing workflow policy. Restore and save operations must have separate,
reviewable conditions. Pull-request code must not overwrite a cache used by
trusted main runs; if pull requests write, their cache namespace must be
isolated and the credential must be explicitly approved for that purpose.

Cache keys must not include secrets. Cache misses, cache-service errors and
cache-version changes must continue through the uncached path. A cache hit is
an optimisation observation, not a correctness assertion.

## Authority and security

Enabling Vercel Remote Cache and creating TURBO_TOKEN are external provider
and credential operations. This SPEC does not create the Vercel setting, GitHub
secret, GitHub variable or token.

Before implementation, the authority envelope must name:

- the approving principal and authenticated Vercel/GitHub identity;
- the exact TaxKit team remote-cache resource;
- read/write authority for local opt-in, pull request, main, deployment and
  receipt events separately;
- token expiry and revocation owner;
- the GitHub environment and workflow paths that may receive each credential;
- the pull-request read-safe or isolated-write design and its non-exfiltration
  controls;
- the cache artifact and log retention boundary;
- the rollback action and last-known-good workflow revision; and
- provider, GitHub and hosted readback.

Stop before workflow secret attachment if the team, token scope, expiry,
revocation or readback identity is unknown. A repository edit or available
credential does not grant this authority.

## Rollout and rollback

1. Establish the current cold baseline, classify every workflow command and
   validate Turbo task inputs.
2. Route eligible Quality root/workspace commands through Turbo and enable
   Vercel Remote Cache for pull requests and main under the approved event
   matrix.
3. Add Bun and Playwright caches to every Quality event with event-appropriate
   restore/save behaviour.
4. Extend the same eligible Turbo and GitHub cache treatment to the four
   deployment/receipt workflows while keeping provider boundaries live.
5. Review measured savings, cache correctness, cache storage, credential
   exposure and hosted cancellation behaviour.

Each slice must be independently revertible. The last-known-good baseline is
the current one-job Quality workflow at the revision recorded by the task
plan. Rollback removes the cache environment and restore/save steps while
leaving the complete uncached graph in place. A remote-cache outage must not
require a provider or production rollback.

## Acceptance criteria

- bun run check:quality-workflow accepts the complete cache-aware Quality
  workflow and rejects missing action pins, unsafe pull-request credentials,
  writes into the trusted main cache namespace, skipped release checks and
  cache-only success.
- The complete nine-check Quality graph still runs on every configured pull
  request and push to main.
- Pull-request and main runs each record a Vercel Remote Cache hit for an
  eligible Turbo task, and the same candidate passes a forced uncached run.
- At least one trusted deployment or receipt workflow records a remote Turbo
  cache hit while its provider, hosted and receipt steps still execute live.
- A cold and warm GitHub Actions run show the Bun package cache and the
  Playwright Chromium cache behaving as intended.
- A lockfile, Bun version, operating system or resolved Playwright version
  change prevents unsafe cache reuse.
- bun install --frozen-lockfile and the existing browser install remain in the
  workflow; neither cache replaces deterministic installation.
- The four deployment workflows preserve exact candidate, stage, provider
  readback, hosted proof, artifact and receipt controls.
- Cache service failure or absence falls back to the complete uncached path.
- The owning policy, controls, architecture, runbooks, SPEC/task indexes and
  dated evidence are updated in the same implementation slice.
- No package contract changes and no Changeset are required.
- The measured result is classified as retain, revise, remove or inconclusive;
  no general speed claim is made from one run.

## Verification and proof

### Local structural proof

The implementation must run:

~~~text
bun run check:quality-workflow
bun run test:quality-workflow
bun run check:docs
bun run check:runbooks
bun run check:repository-paths
bun run check:docs-deployment
bun run check:docs-deployment-automation
bun run test:docs-deployment
bun run verification
git diff --check
~~~

The implementation must also run forced uncached Turbo commands for the
affected tasks, using the repository-local Turbo version:

~~~text
bunx turbo run build --force
bunx turbo run check-types --force
~~~

### Hosted cache proof

For each cache layer, retain a bounded receipt containing the immutable source
revision, workflow path, run ID, event, runner, cache key digest, hit/miss
observation, step duration, postcondition, rollback identity, limitations and
non-claims.

Hosted proof must distinguish:

- a remote Turbo cache hit from a local Turbo cache hit;
- a Bun package-cache hit from a successful bun install;
- a Chromium binary hit from successful system-dependency installation;
- a faster worker from lower GitHub queue time; and
- local checks from Vercel, GitHub Actions or deployment actuality.

No cache receipt establishes package publication, deployment, production
availability, public-site behaviour or external consumer behaviour.

## Impact ledger

| Surface | Decision | Owner, required work and proof |
| --- | --- | --- |
| Quality workflow | Change required | .github/workflows/quality.yml; add event-scoped Vercel Remote Cache and Bun/Playwright cache restore/save without changing triggers, permissions, timeout, concurrency or the nine-check call graph. Prove with bun run check:quality-workflow and hosted Quality runs. |
| Quality policy and negative fixtures | Change required | tools/quality-workflow/policy.ts, policy.test.ts, controls.json, automation-register.json; enforce full-SHA cache actions, safe pull-request authority, namespace isolation, fallback and complete graph. Prove with bun run check:quality-workflow and bun run test:quality-workflow. |
| Turbo task graph | Change required | turbo.json and the affected root/workspace package manifests; audit task inputs, outputs and environment sensitivity, then register cacheable root tasks and update only evidenced invalidation rules. Prove forced, pull-request and trusted remote-hit runs. |
| Root commands and release orchestration | Change required | package.json and packages/scripts/README.md; keep @taxkit/scripts as the orchestration owner while routing cacheable root commands through Turbo root tasks. Candidate-mode release and other stateful proof commands remain live. Prove the canonical release command and the root-task graph. |
| Bun and Playwright versions | Preserve | .bun-version, bun.lock and apps/docs/package.json; no dependency or browser-version upgrade is part of this SPEC. |
| Deployment workflow wiring | Change required | Four .github/workflows/docs-*.yml files; add Vercel Remote Cache for eligible Turbo commands plus Bun/Playwright cache setup, while preserving provider, artifact and readback boundaries. Prove with tools/docs-deployment checks and authorised hosted workflow receipts. |
| Deployment policy and contracts | Change required | tools/docs-deployment/workflow.contract.test.ts, automation policy and controls; reject cache steps that bypass exact candidate, plan, mutation, readback or receipt checks. |
| CI standards and quality architecture | Change required | docs/standards/controls.md and docs/architecture/testing-and-quality.md; document cache authority, trust boundaries, fallback and proof ceilings. |
| Deployment architecture and operations | Change required | docs/architecture/deployment.md, docs/runbooks/release-readiness.md and docs/runbooks/docs-deployment.md for cache troubleshooting, bypass, rollback and provider stop conditions. |
| Automation register | Change required | docs/operations/automation-register.md and machine-readable Quality/deployment registers; record owner, signal, cache authority, proof, failure, rollback, escalation and retirement. |
| Evidence and release closure | Change required | A dated bounded cache receipt under the existing evidence route; use the existing taxkit-release-closure journey and do not add a new consumer journey for an optimisation. |
| Critical-journey inventory | N/A | Cache acceleration does not add a consumer-visible journey; the existing release-closure journey remains the operator boundary. |
| Harness profile | N/A | No journey owner, repository identity or harness route changes; cache evidence remains dated and separate from the profile. |
| Root, app and package READMEs | Change required where command routing changes | Keep user-facing commands, package exports and app runtime behaviour stable; update README.md and packages/scripts/README.md only to record the Turbo root-task ownership and live proof boundaries. |
| Public docs, API, SDK and package behaviour | N/A | No public or package contract changes are in scope. |
| Skills, AGENTS.md and skill metadata | N/A | Existing PRD, docs-maintainer and CI-policy routes already cover this work; no new skill or instruction is required. |
| .gitignore and generated trees | Preserve | .turbo, node_modules, dist and temporary trees remain ignored; no generated cache is committed. |
| Changesets and versioning | N/A | No package installation, export or runtime behaviour changes. Record the explicit no-Changeset rationale in the implementation task. |
| Provider credentials and external cache state | Change required outside the repository | Use a run-specific authority envelope for local, pull-request, main, deployment and receipt cache access; do not add standing provider authority to the repository. Stop on unknown principal, team, token scope, expiry, revocation or readback. |
| Authority model | Change required | docs/operations/authority-model.md; record the exact cache resource, event-specific credential scope, PR isolation/read-safety, retention, revocation, rollback and provider/GitHub readback. |
| Product SPEC and lifecycle indexes | Change required | This SPEC, sibling tasks, docs/product-specs/index.md and the active-plan route must point to the proposed intent. Create an execution plan only when implementation begins. |

## References

Local owners:

- [Documentation router](../README.md)
- [Testing and quality](../architecture/testing-and-quality.md)
- [CI controls](../standards/controls.md)
- [Deployment architecture](../architecture/deployment.md)
- [Release-readiness runbook](../runbooks/release-readiness.md)
- [Docs deployment runbook](../runbooks/docs-deployment.md)
- [Authority model](../operations/authority-model.md)
- [Product SPEC task-list guide](./writing-task-lists.md)

External implementation references, to be rechecked at implementation time:

- [Vercel Remote Caching](https://vercel.com/docs/monorepos/remote-caching)
- [Turborepo task configuration and root tasks](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks)
- [Turborepo remote caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Bun global cache](https://bun.sh/docs/pm/global-cache)
- [Bun install and CI guidance](https://bun.sh/docs/pm/cli/install)
- [Playwright browser cache paths](https://playwright.dev/docs/browsers)
- [oven-sh/setup-bun](https://github.com/oven-sh/setup-bun/blob/main/README.md)
