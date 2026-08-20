---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC-003 workflow, cache action, path, key, event scope, install order, hosted run, or acceptance change
---

# TCC-003 dependency-cache candidate

## Current decision

TCC-003 remains an implementation candidate until one cold and one warm hosted
Quality run prove both GitHub cache layers and the complete browser graph. The
checked-in workflow and policy establish the intended path, key, order and
fallback only; they do not yet prove a hosted restore or saving.

## Candidate call graph

~~~text
Quality pull request or push to main
  -> checkout and complete main history
  -> exact Bun setup
  -> resolve `bun pm cache`
  -> restore event-scoped Bun package cache
  -> live `bun install --frozen-lockfile`
  -> save Bun package cache after install when the exact key missed
  -> resolve app-local Playwright version
  -> restore event-scoped Chromium binary cache
  -> live `playwright install --with-deps chromium`
  -> save Chromium cache after install when the exact key missed
  -> Turbo policy task
  -> live nine-check release orchestrator and Turbo-backed leaves
~~~

Cache restore/save uses `actions/cache` v6.1.0 pinned to
`55cc8345863c7cc4c66a329aec7e433d2d1c52a9`. Each cache step is non-fatal.
The install steps and Quality graph remain authoritative.

## Paths and identities

| Cache | Path | Exact key inputs | Excluded |
| --- | --- | --- | --- |
| Bun packages | Runtime output of `bun pm cache`, outside the checkout | event name, runner OS, runner architecture, `.bun-version` hash, `bun.lock` hash | `node_modules`, Turbo outputs, browser binaries |
| Playwright Chromium | Explicit `.cache/ms-playwright` directory beside the GitHub workspace and outside the checkout | event name, runner OS, runner architecture, resolved app-local Playwright version, `bun.lock` hash | operating-system packages, `node_modules`, non-Chromium browsers |

Pull requests and main use different event-name key segments. GitHub cache ref
scoping is a second boundary, so pull-request code cannot replace a trusted
main entry. No broad restore prefix crosses event, platform, Bun or Playwright
identity. A cache miss, corrupt entry or unavailable service continues to the
live install because cache steps are acceleration only.

## Local policy evidence

The workflow policy decodes the exact 13-step graph. It rejects mutable action
pins, `node_modules` paths, missing event/Bun/lockfile/Playwright identities,
trusted-key reuse, skipped installs, changed `--with-deps`, fatal cache steps,
early saves and any release-graph replacement. The automation register names
the GitHub dependency caches and retains no deployment, publication, release,
provider-write or credential-write grant.

Cold hosted run `32340895568` disconfirmed the first candidate after both cache
miss/install/save paths succeeded: Turbo's strict environment mode did not pass
the explicit browser path into `docs#build`, which then looked in the default
directory and failed with a missing Chromium executable. The correction names
`PLAYWRIGHT_BROWSERS_PATH` as an explicit `build` and `test:browser` task input.
The failed run is retained as path-propagation evidence, not browser or Quality
acceptance.

## Documentation impact

| Owner | Decision | Reason |
| --- | --- | --- |
| Quality workflow, Turbo task inputs, policy, controls and automation register | Change required | They own the exact cache actions, event authority, paths, keys, environment propagation, install order and fallback. |
| Testing architecture and CI controls | Change required | They own the dependency-cache call graph and proof limits. |
| Root and release-readiness READMEs | Change required | They must distinguish download reuse from Turbo task replay and live installs. |
| Operational authority model | Change required | It owns the bounded GitHub cache write authority and denied operations. |
| Public docs, API and SDK contracts | N/A | No runtime, tax rule, HTTP or package contract changes. |
| Changeset | N/A | Repository CI tooling only. |
| Harness profile and consumer journeys | N/A | A dependency download cache does not create a consumer-visible claim. |

## Hosted acceptance still required

1. Run one hosted Quality candidate with both exact keys absent. Record misses,
   successful installs, successful saves and the complete docs browser
   postcondition.
2. Rerun the exact source and event. Record exact Bun and Chromium hits,
   retained frozen/system installation and the complete docs browser
   postcondition.
3. Compare worker, Bun install, Chromium setup and release-graph time without
   attributing operating-system package time to the Chromium binary cache.
4. Prove the complete graph with dependency caches absent or unavailable, then
   accept, revise or remove TCC-003 before TCC-004.

Rollback removes the four GitHub cache restore/save steps and two identity
steps while preserving exact Bun setup, frozen install, Playwright
`--with-deps`, Turbo bindings and the complete release graph.
