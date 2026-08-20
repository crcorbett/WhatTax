---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: dependency-cache key, GitHub cache scope, checkout action, runner runtime, workflow policy, or hosted proof change
successor: null
tombstone: false
status: implemented
source_of_truth: docs
confidence: high
---

# Shared Dependency Cache and Checkout Upgrade

## Implemented outcome

SDC-001 and SDC-002 are complete. Pull request #59 run `32357219491` passed
twice on source commit `05fc7328db6d9468c0e616d498155213f4357b03`.
Attempt 1 created the new content-addressed Bun and Chromium cache entries;
attempt 2 restored both exact keys and passed in 54 seconds. Checkout v7.0.1
ran by exact commit, frozen Bun installation and Playwright system setup stayed
live, and the complete Quality graph passed. The bounded receipt is
[`SDC-hosted-proof.md`](../documentation-audit/shared-dependency-cache-and-checkout/SDC-hosted-proof.md).

## Overview

TaxKit lets pull requests restore content-identical Bun package downloads
and Playwright Chromium binaries that `main` has already saved. GitHub will
continue to isolate writes by Git ref, so a pull-request cache cannot replace a
default-branch cache. The same slice upgrades every workflow from the pinned
checkout v4.2.0 commit to the pinned checkout v7.0.1 commit.

Task plan:
[shared-dependency-cache-and-checkout.tasks.json](./shared-dependency-cache-and-checkout.tasks.json)

## Problem and evidence

The previous keys included `github.event_name`. Identical Bun, lockfile, runner
and Playwright inputs therefore produce different keys for `pull_request`,
`push`, `workflow_dispatch` and `workflow_run`. GitHub already searches the
current ref and then the default branch for a matching cache, while caches
created by a pull request remain scoped to that pull request's merge ref. The
event-name segment blocks this safe default-branch reuse before GitHub can
apply its normal scope rules.

Recent hosted Quality evidence showed about 28 seconds of combined Bun and
Chromium download-cache setup difference between cold and warm runs. This is a
step-level observation, not a forecast for every job. Frozen installation and
Chromium system-package setup remain live.

All five workflows previously pinned `actions/checkout` v4.2.0. Hosted runs
warned
that Node.js 20 actions are deprecated. Checkout v7.0.1 uses the newer action
runtime and retains the inputs TaxKit already uses. TaxKit remains a Bun
repository: checkout only places Git source in the runner workspace, then
`setup-bun`, `bun install --frozen-lockfile` and Bun-owned commands run the
repository.

## Current and target call graphs

```text
Previous dependency-cache path
  -> workflow event name enters the cache key
  -> identical pull_request and push inputs produce different keys
  -> pull request cannot find the matching main key
  -> live Bun and Chromium installation continues
```

```text
Implemented dependency-cache path
  -> OS, architecture, Bun version, lockfile and Playwright version form the key
  -> GitHub searches the current ref and then the default branch
  -> pull request may restore a matching main cache
  -> pull-request saves remain isolated to the pull-request merge ref
  -> live Bun and Chromium installation continues
```

```text
Implemented workflow bootstrap
  -> pinned actions/checkout v7.0.1 places reviewed Git source in the workspace
  -> pinned setup-bun installs the repository Bun version
  -> GitHub caches restore downloads only
  -> bun install --frozen-lockfile recreates node_modules live
  -> Playwright installs required browser/system components live
  -> the complete owning Quality or deployment graph runs
```

## Goals

- Let pull requests and trusted workflows restore content-identical default-
  branch Bun and Chromium caches.
- Keep cache writes isolated by GitHub's ref scope.
- Preserve exact cache invalidation by OS, architecture, Bun version, lockfile
  and resolved Playwright version.
- Keep cache failure non-fatal and every install, policy, provider and proof
  command live.
- Upgrade all five checkout pins to the exact v7.0.1 commit and reject a
  partial or floating upgrade.
- Record hosted proof against one immutable pull-request revision.

## Non-goals

- No `node_modules`, operating-system-package, provider-state, receipt,
  credential or source cache.
- No `restore-keys`, partial-match fallback, path filtering or shortened
  Quality graph.
- No Turbo task/configuration, Vercel credential or remote-cache authority
  change.
- No Preview teardown, deployment, publication, release or provider mutation.
- No package, API, SDK, application-runtime or public-documentation change.
- No Changeset because this changes repository CI policy and maintainer
  documentation only.

## Ownership, authority and safety

The Quality workflow, `tools/quality-workflow/` policy and the four docs
workflow contracts own executable state. The CI release maintainer owns the
Quality cache and checkout policy. The docs deployment automation owner owns
the reviewed-source and provider-bound workflow contracts.

GitHub's cache service, not the key text, scopes writes by ref. A fork pull
request may read a matching default-branch cache, so cache paths must remain
limited to public package downloads and Chromium binaries. Secrets and
credentials must never enter a key or cached path. Pull-request writes remain
unavailable to `main` and sibling pull requests. Rollback restores the former
event-name keys or removes the dependency-cache steps while retaining every
live install and command.

Checkout v7.0.1 is pinned to
`3d3c42e5aac5ba805825da76410c181273ba90b1`. It uses Node.js 24 internally and
requires an Actions runner new enough to execute Node.js 24 actions. TaxKit's
hosted `ubuntu-latest` Quality run is the acceptance boundary. This does not
add Node.js to TaxKit's repository toolchain or replace Bun.

## Acceptance and proof

- All Bun keys omit event name and retain OS, architecture, `.bun-version` and
  `bun.lock` identity.
- All Chromium keys omit event name and retain OS, architecture, resolved
  app-local Playwright version and `bun.lock` identity.
- Policy fixtures reject event-name regression, missing invalidation inputs,
  `restore-keys`, `node_modules`, skipped installs and mutable action pins.
- All five workflows use the exact checkout v7.0.1 SHA while preserving their
  existing fetch depth, reviewed ref and credential-persistence settings.
- Focused workflow, docs, runbook, repository-path and full verification checks
  pass locally.
- A hosted pull-request Quality run on the immutable implementation revision
  passes with checkout v7.0.1 and records the exact shared Bun/Chromium keys.
- Hosted cache proof does not establish deployment, provider state,
  publication, release or public behaviour.

## Documentation impact ledger

| Surface | Decision | Owner and verification |
| --- | --- | --- |
| Five GitHub Actions workflows | Change required | `.github/workflows/*.yml`; use the exact checkout v7.0.1 SHA and content-only dependency keys without changing triggers, permissions, concurrency or commands. |
| Quality policy, Schema and fixtures | Change required | `tools/quality-workflow/`; `bun run check:quality-workflow` and `bun run test:quality-workflow`. |
| Deployment workflow contracts | Change required | `tools/docs-deployment/workflow.contract.test.ts`; `bun run test:docs-deployment` and `bun run check:docs-deployment-automation`. |
| CI and deployment architecture, standards and recovery | Change required | `README.md`, `docs/architecture/testing-and-quality.md`, `docs/architecture/deployment.md`, `docs/standards/controls.md`, `docs/operations/authority-model.md`, `docs/operations/automation-register.md`, and `docs/runbooks/docs-deployment.md`. |
| SPEC, task and active-plan routes | Change required | This SPEC, sibling task list, product-spec index and active execution-plan index. |
| Teardown lifecycle and Alchemy graph | Preserve | The PR-close trigger, protected environment, exact `pr-N` derivation, reviewed-main checkout, equal destroy plans, mutation and absence readback do not change. |
| Turbo/Vercel Remote Cache | Preserve | No task graph, mode, token, team or provider resource changes. |
| Packages, API, SDK, public docs and Changesets | N/A | No install, export, runtime or consumer-facing behaviour changes. |
| Skills and agent instructions | N/A | Existing repository-local PRD and documentation routes already govern this work. |

## References

- [GitHub dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
- [actions/checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
- [Testing and quality](../architecture/testing-and-quality.md)
- [Controls and automation governance](../standards/controls.md)
- [Docs deployment runbook](../runbooks/docs-deployment.md)
