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
| `DOCS-APP-003` | pending | Depends on `DOCS-APP-002`. |
| `DOCS-APP-004` | pending | Depends on `DOCS-APP-003`. |
| `DOCS-APP-005` | pending | Depends on `DOCS-APP-004`. |
| `DOCS-APP-006` | pending | Depends on `DOCS-APP-005`. |

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

## Documentation impact

The SPEC documentation-impact ledger is authoritative. This plan records task
evidence and path-level completion; it does not duplicate architecture policy.
Runbooks and operations remain evidenced not applicable and must not change.
