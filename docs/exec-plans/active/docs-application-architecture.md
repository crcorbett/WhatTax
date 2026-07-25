---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-07-25
review_trigger: task acceptance, implementation discovery, proof result, or lifecycle change
successor: null
tombstone: false
---

# TaxKit docs application architecture execution plan

Spec:
[TaxKit docs application architecture](../../product-specs/docs-application-architecture.md)

Task list:
[`docs-application-architecture.tasks.json`](../../product-specs/docs-application-architecture.tasks.json)

## Goal

Implement `DOCS-APP-001` through `DOCS-APP-006` sequentially so authored
content belongs to `packages/docs-content`, reusable Fumadocs source access is
a narrow generic Effect service in `packages/docs-fumadocs`, and `apps/docs`
owns TanStack Start execution, routing, UI and built-browser behavior.

Installed dependency versions and `bun.lock` are preserved. Search, SEO,
hosting, deployment, publication, versioning and public-site proof are outside
this plan.

## Status

| Task | Status | Evidence |
| --- | --- | --- |
| `DOCS-APP-001` | completed | Package-owned content, navigation, examples, validation, lifecycle bindings and focused proof accepted. |
| `DOCS-APP-002` | completed | Generic service/live/test Layers, compiled-config ordering and Knip reachability accepted. |
| `DOCS-APP-003` | completed | Canonical content service, app server runtime, safe error and import-boundary slice accepted. |
| `DOCS-APP-004` | completed | Native route outcomes, built HTTP/browser harness and approved HGI-203 journey-epoch amendment accepted. |
| `DOCS-APP-005` | completed | Router-native MDX links, navigation focus, responsive disclosure and accessibility proof accepted. |
| `DOCS-APP-006` | in progress | Production reachability, clean-candidate proof and retained evidence are in progress. |

## Baseline

- Implementation target: `3f4730daf4447b47a63cbe6470af6d550f8ee4b4`,
  equal to `origin/main` when implementation began.
- Accepted uncommitted inputs: this SPEC, its sibling task list and their
  product-spec index pointer.
- Frozen installed graph: Bun `1.3.14`; no dependency or lockfile changes are
  authorized.
- Current known closeout baseline: canonical verification reaches Knip, then
  cannot load the two docs configs because the compiled
  `@taxkit/docs-fumadocs/config` target is absent. `DOCS-APP-002` owns that
  correction without ignores or suppressions.

## Execution and recovery

Each task is a complete vertical slice. The primary owner reviews the changed
call graph, schemas, errors, Effect shape, import direction, helper admission,
documentation impact and focused evidence before committing and starting the
dependent task. A failed slice remains active with exact evidence and is
corrected at its earliest semantic owner. Recovery uses ordinary Git history
back to the last accepted task commit; generated source, build output and raw
browser output are never rollback state.

The final screenshot set is captured only after all non-visual gates pass on a
clean committed implementation candidate. It belongs under this plan at
`screenshots/<full-candidate-commit>/` and may contain only the bounded
`DAR-013` manifest and PNG set.

Cooper authorized one narrow `DOCS-APP-004` governance amendment on 2026-07-25.
It may decouple immutable HGI-203 evidence from the evolving current critical
journey owner through an exact historical snapshot and focused validator
change. It may not rewrite, re-date or re-attribute the historical packet,
weaken its digest, fabricate an attempt, change authority stops or broaden into
versioning, publication, deployment or provider work.

## Validation log

### 2026-07-25 — implementation admission and `DOCS-APP-001` baseline

- Read the approved SPEC and task list together with repository, package,
  Effect service, frontend, content, testing, lifecycle and documentation
  owner contracts.
- Confirmed `HEAD` and `origin/main` both resolve to
  `3f4730daf4447b47a63cbe6470af6d550f8ee4b4`.
- Confirmed authored content currently has one app-owned source:
  `apps/docs/content`, `apps/docs/navigation.json` and
  `apps/docs/examples`.
- Confirmed generation and validation point back to those app paths from
  `packages/docs-content`.
- Recorded the approved task order, primary-owner review bar and rollback
  boundary before changing implementation.

### 2026-07-25 — `DOCS-APP-001` accepted

- Moved all 61 MDX files, four checked examples, navigation and its JSON Schema
  from the app into `packages/docs-content`.
- Byte comparison against the implementation target proved all 61 MDX files
  and all four examples are unchanged. Navigation remains `draft`, retains the
  same seven sections and changes only its owning `contentRoot`.
- Generation, validation, example type checking, app compilation and browser
  source resolution now consume the package-owned paths. No live package,
  app, documentation-policy or architecture path names the removed app-owned
  roots.
- Updated the public owner policy, HGI-207 lifecycle decision, lint boundary,
  Quality-workflow mutation fixture, docs-maintainer profile and its
  content-addressed overlay receipt. The dated HGI-207 source receipt remains
  unchanged as historical pre-relocation evidence.
- Added `.changeset/quiet-docs-own.md` for a patch to the private
  `@taxkit/docs-content` package. No versioning ran.
- Focused proof passed:
  - `bun run docs:validate` — zero issues.
  - `bun run --filter=@taxkit/docs-content test` — three tests passed.
  - `bun run --filter=@taxkit/docs-content check-types`.
  - `bun run --filter=@taxkit/docs-content build`.
  - `bun run --filter=docs check-types`.
  - `bun run docs:build`.
  - `bun run --filter=docs test:browser` — seven tests passed; this remains a
    component route-boundary claim, not built SSR or hydration proof.
  - `bun run check:docs` — zero violations; 62 public artifacts.
  - `bun run check:repository-paths`.
  - `bun run verification`.
  - `git diff --check`.
- Primary-owner review accepted `TDA-001` and preservation of `TDA-P01`,
  `TDA-P03` and `TDA-P04`. Package versions and dependency declarations are
  unchanged; the current and target `bun.lock` SHA-256 is
  `a917cbcf81d6917deb9876718494cfe2a6ca3d337d106d4813e6cc6bc84ba792`.

### 2026-07-25 — `DOCS-APP-004` release-evidence contract discovery

- Added and passed the app-owned built-production HTTP/Playwright harness,
  including built SSR, hydration, client navigation, direct HTTP 404,
  pending/error states, request counts, diagnostics and bounded provisional
  screenshots. Its verified invocation is
  `bun run --filter=docs test:built`.
- Backfilled that invocation into the approved SPEC/task pair, app README,
  frontend/testing owners and `docs/verification/critical-journeys.json`.
- Focused docs boundaries, docs types, docs build, browser tests, built-app
  tests, screenshot mode, docs policy, repository paths, lint, format, Knip and
  governance tests pass. The lockfile remains unchanged.
- Canonical verification stops at `bun run check:runbooks`. The exact
  diagnostic is one `accepted-handoff` violation at
  `docs/evidence/releases/HGI-203-local.json`.
- Root cause: the accepted HGI-203 packet records SHA-256
  `13b7c960ff7b5f5fef236cff4cef800409f822e6be2a552eaa78b64be2d8ad5a`
  for the historical five-journey inventory. The required current docs journey
  has changed truthfully to include the built-app harness, so its bytes no
  longer match that historical packet.
- Updating the old packet would falsely attribute the new built-app proof to
  its 2026-07-22 attempt. Changing the runbook policy to support a historical
  journey snapshot or a superseding evidence epoch changes an explicitly
  excluded governance owner, so implementation stopped for acceptance.
- Cooper then authorized only the snapshot/epoch correction. The retained
  `docs/evidence/releases/HGI-203-critical-journeys.json` has SHA-256
  `13b7c960ff7b5f5fef236cff4cef800409f822e6be2a552eaa78b64be2d8ad5a`,
  exactly matching the immutable packet. The runbook validator now decodes the
  historical and current inventories separately and rejects substituting the
  current owner for the old digest.

### 2026-07-25 — `DOCS-APP-004` accepted

- Missing content now reaches TanStack's framework-native not-found channel;
  direct built requests return HTTP 404, while expected source/preload failures
  remain schema-encoded and defects/interruptions remain framework-owned.
- App-owned pending, recoverable error, not-found and framework-error leaves
  keep a stable shell and accept only readonly values/callbacks.
- `bun run --filter=docs test:built` owns an ephemeral built-production server,
  readiness, cleanup, direct SSR/body/status assertions, hydration diagnostics,
  server-function navigation and bounded screenshot mode.
- The exact invocation is synchronized across the SPEC/tasks, app README,
  frontend/testing owners and current critical journey.
- The immutable HGI-203 packet, summary, attempt, manifests and validation
  receipt are unchanged. Its retained journey snapshot is byte-identical to
  semantic commit `f3a7bdf4e63fcc6ce9dedaf963337def9f65c3a5` and matches
  packet SHA-256
  `13b7c960ff7b5f5fef236cff4cef800409f822e6be2a552eaa78b64be2d8ad5a`.
- `bun run check:runbooks` passes; 18 focused policy tests include rejection of
  current-owner substitution. Harness governance and its 12 tests pass.
- Full DOCS-APP-004 proof passed: docs import boundaries, six codec tests, app
  runtime test, docs types/build, seven browser tests, built SSR/hydration/404
  proof, docs/path policy, lint, formatting, skills, Quality policy,
  development/production Knip and all 23 Turbo type-check tasks.
- Canonical `bun run verification` is green. The built proof observed
  `SSR=200`, `missing=404`, `documents=1`, `serverFunctions=2` and
  `diagnostics=0`. These are local candidate claims only; no deployment,
  provider, public-site, release or publication behavior was observed.
- Primary-owner review accepted `TDA-004`, preservation of `TDA-P02` and
  `TDA-P05`, the route/container/leaf split, process lifetime, historical
  evidence migration and rollback. `bun.lock` remains unchanged.

### 2026-07-25 — `DOCS-APP-002` accepted

- Replaced callback-per-operation loader helpers with the generic
  `FumadocsSource` service, named `getPage`/`listPages` Effects, generic page
  Schemas, safe lookup/load errors, a generated-adapter live Layer and decoded
  deterministic test Layer.
- The live adapter contains unknown provider ingress, promise/throw handling
  and Schema decoding. Service values contain no provider page, raw client,
  callback or unknown field, and the provider-failure test proves raw detail
  does not escape the tagged error.
- Removed the unused root barrel, duplicate generic meta, page-tree contract
  and callback source exports. The generic render entry remains
  production-used by the app.
- Updated the existing content Layer and app composition in the same vertical
  slice so no production consumer retained the deleted callback API.
- Added explicit docs-fumadocs build edges to direct docs-content generation,
  tests and types, direct app types/build, and both Knip commands. After a
  frozen install with no changes, removing `dist` and running `bun run knip`
  rebuilt `dist/config.js` before loading either docs config.
- Baseline Knip candidates were resolved at their semantic owners:
  - `policy.runtime.test.ts` is a development Knip entry and executes three
    validation tests;
  - docs-content `@effect/vitest` is used by that reachable test, while
    docs-fumadocs uses it for service substitution/error tests;
  - `validateMdxComponentPolicy` is called by production validation and its
    focused accepted/rejected test.
  No ignore, issue suppression or workspace exclusion was added.
- `.changeset/quiet-docs-own.md` now records patch impact for both private docs
  packages. Package versions, installed declarations and `bun.lock` remain
  unchanged.
- Focused proof passed:
  - `bun install --frozen-lockfile` — 681 installs checked, no changes.
  - docs-fumadocs test/types/build — two files and six tests passed.
  - docs-content test/types, app types/build and browser harness.
  - clean `dist` absence, `bun run knip`, compiled config existence and both
    config-consumer loads.
  - lint, format, documentation/path checks and `bun run verification`.
- Primary-owner review accepted the generic substitution point, safe errors,
  one-ingress decoding, lazy Layers, compiled export graph, retirement set and
  `TDA-002`/`TDA-P01` outcome.

### 2026-07-25 — `DOCS-APP-003` accepted

- `DocsContentServiceLive` now maps generic source failures to safe
  content-owned tagged errors and decodes generic page values into canonical
  TaxKit values. The deterministic content test Layer composes over
  `FumadocsSource` test fixtures and proves accepted, missing and malformed
  content without leaking raw fixture data.
- Removed `runtime.client.ts`, the unused router service context,
  `route-runtime.ts` and the isomorphic runtime indirection. The app now owns
  one module-scoped server `ManagedRuntime`, an explicit disposal operation and
  a focused test proving service reuse and test-owned disposal.
- Moved service acquisition and Effect execution into an app-owned
  `.server.ts` server-function implementation. The browser-reachable loader
  retains only the TanStack transport stub and a dynamic server import.
- Added an AST-based app import audit that rejects static server-only content,
  Fumadocs service, generated-source and runtime imports from
  browser-reachable modules, rejects browser runtime execution, and verifies
  the removed browser runtime stays absent.
- Preserved the existing schema-encoded `Exit` transport and its success,
  expected failure, malformed representation, defect and interruption corpus.
  The programmatic browser route harness still proves only component transport
  restoration and framework boundaries, not built SSR or hydration.
- Focused proof passed:
  - `bun run docs:validate` — zero issues.
  - docs-fumadocs tests — two files and six tests passed.
  - docs-content tests — two files and six tests passed.
  - docs-content types/build, docs app types/build and the focused docs
    boundary command.
  - docs browser harness — seven tests passed.
  - `bun run knip`, documentation policy, repository path policy and
    `git diff --check`.
  - `bun run verification`, including development and production Knip and all
    23 Turbo type-check tasks. The existing docs-content missing-output warning
    remains owned by `DOCS-APP-006`.
- Primary-owner review accepted the final generated source ->
  `FumadocsSource` -> `DocsContentService` -> app server runtime graph,
  canonical errors, runtime lifetime, removal set and browser-negative proof.
  Package versions and dependency declarations are unchanged; `bun.lock`
  remains
  `a917cbcf81d6917deb9876718494cfe2a6ca3d337d106d4813e6cc6bc84ba792`.

### 2026-07-25 — `DOCS-APP-005` accepted

- The app-owned MDX adapter now classifies root-relative, query-only and
  authored relative `.mdx` links as TanStack destinations while retaining
  ordinary anchors for external, protocol-relative, mail, download,
  repository-source and same-document destinations. Query and fragment
  suffixes survive `.mdx` removal.
- Sidebar, home and MDX route links set one app-owned focus intent which the
  destination heading consumes after client navigation. Initial hydration does
  not set the intent. The responsive route container owns disclosure, current
  item scrolling and retry callbacks; rendering leaves remain service- and
  runtime-free.
- Added the visible-on-focus skip link, one main landmark, labelled/current
  navigation, 3px focus-visible treatment, mobile disclosure and
  no-animation reduced-motion baseline.
- Built behavior passed with `SSR=200`, direct missing `404`, zero document
  requests across real sidebar and authored-MDX navigation, five total
  document requests, eight server-function requests and zero diagnostics.
  Focus, browser history, keyboard, landmark, mobile, contrast and
  reduced-motion assertions also passed.
- Ten focused app tests passed, including the internal/external/query/fragment
  link-classification corpus. Seven programmatic browser route tests passed.
  App types, docs build and the built production harness passed.
- The ignored provisional DAR-013 set under
  `tmp/docs-built/provisional-screenshots/` was recaptured and visually
  reviewed. The representative page, current-item mobile disclosure, first-tab
  skip link, pending, recoverable error and not-found states are readable,
  unclipped and machine-path/secret safe. Reduced-motion PNG `07` is correctly
  not applicable because no visually relevant transition exists. These images
  do not prove the separate behavioral assertions.
- Negative scope review found no `fumadocs-ui`, shared `packages/ui`, search
  service/schema/index/UI, browser Effect runtime or presentation service
  acquisition. `TDA-008` remains deferred.
- `bun run check:docs`, `bun run check:repository-paths`, canonical
  `bun run verification` and `git diff --check` passed. The two-package patch
  Changeset remains accurate, dependency declarations are unchanged and
  `bun.lock` retains
  `a917cbcf81d6917deb9876718494cfe2a6ca3d337d106d4813e6cc6bc84ba792`.
- Primary-owner review accepted the link semantics, route/container/leaf
  boundary, interaction evidence, accessibility foundation and bounded visual
  evidence for `TDA-005`, `TDA-007` and `TDA-P05`.

### 2026-07-25 — `DOCS-APP-006` candidate preparation

- Added the named docs-content `generate` command and a Turbo task whose exact
  inputs include content, navigation, source config, canonical schemas and the
  package manifest, whose output is `.source/**`, and whose dependency is the
  compiled docs-fumadocs build. The content build executes that named
  generation command; the docs app follows both package builds.
- Development and production Knip now build generated content first. Production
  analysis models `apps/docs`, `@taxkit/docs-content` and
  `@taxkit/docs-fumadocs` rather than excluding those workspaces. It admits only
  generated `.source/browser.ts` and `.source/server.ts` through
  `--no-gitignore`; tests, fixtures and the unused generated dynamic entry
  remain outside the production graph. No ignore, issue suppression or
  workspace exclusion was added.
- The prior candidates were investigated individually:
  `policy.runtime.test.ts` and docs-content `@effect/vitest` execute three
  validation tests; `validateMdxComponentPolicy` moved to a focused
  schema-decoding ingress imported by production validation and its rejected
  fixture. The unused app runtime disposal export was removed, and MDX link
  classification now has one focused app policy module consumed by production
  rendering and tests.
- A clean proof removed docs-content `.source`, docs-fumadocs `dist`, and docs
  app output before `bun install --frozen-lockfile`. Bun checked 681 installs
  across 806 packages with no changes. Development and production Knip then
  recreated the compiled config/generated source and passed.
- The built harness now rejects a candidate that is not the exact checked-out
  40-character commit or has tracked/untracked changes. Its bounded manifest
  records the candidate, clean precondition, built-output digest, exact capture
  command, Chromium version, timestamp, safe repository-relative owners,
  expected/observed postconditions, PNG digests, reviewer, limitations,
  non-claims and the reduced-motion not-applicable evidence.
- Focused pre-candidate proof passed: content validation; six
  docs-fumadocs tests; six docs-content tests; ten app server tests; seven app
  browser route tests; package/app types and builds; and built HTTP/browser
  proof with SSR `200`, missing `404`, zero client-navigation document requests
  and zero diagnostics.
- An initial Turbo draft made the content build depend on the named generation
  task while also executing it, so canonical type checking ran the generator
  twice and one process aborted on memory allocation. The duplicate edge was
  removed; the build still executes the named command, the task retains its
  explicit contract, and the focused 23-task graph plus fresh canonical
  verification pass.
- Final candidate commit, candidate-bound screenshot capture, primary-owner
  visual acceptance and lifecycle closeout remain pending. No screenshot is
  claimed as behavioral proof and no external state is claimed.

## Documentation impact

The SPEC documentation-impact ledger is authoritative. This plan records task
evidence and path-level completion; it does not duplicate architecture policy.
Runbooks and operations change only for the explicitly authorized HGI-203
journey-epoch amendment. Commands, environments, authority stops and the
immutable historical packet/receipt set remain preserved.
