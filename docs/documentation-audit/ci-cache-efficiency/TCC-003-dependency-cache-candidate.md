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

TCC-003 is accepted. Hosted Quality run `32342247926` at source
`fa2467e338c2dd41e04bc763533731b110d73f98` saved a cold Chromium cache in
attempt 1, then restored the exact Bun and Chromium keys in attempt 2. Both
attempts passed the complete nine-check graph. The warm attempt kept frozen Bun
installation, Playwright system-dependency installation and browser proof live.

## Candidate call graph

~~~text
Quality pull request or push to main
  -> checkout and complete main history
  -> exact Bun setup
  -> resolve `bun pm cache`
  -> restore event-scoped Bun package cache
  -> live `bun install --frozen-lockfile`
  -> save Bun package cache after install when the exact key missed
  -> resolve the Playwright browser path from the runner temporary directory
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
| Playwright Chromium | Explicit `ms-playwright` directory under GitHub's runner temporary directory and outside the checkout | event name, runner OS, runner architecture, resolved app-local Playwright version, `bun.lock` hash | operating-system packages, `node_modules`, non-Chromium browsers |

Pull requests and main use different event-name key segments. GitHub cache ref
scoping is a second boundary, so pull-request code cannot replace a trusted
main entry. No broad restore prefix crosses event, platform, Bun or Playwright
identity. A cache miss, corrupt entry or unavailable service continues to the
live install because cache steps are acceleration only.

## Local policy evidence

The workflow policy decodes the exact 14-step graph. It rejects mutable action
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

Run `32341511100` then passed the complete graph, but its non-fatal Chromium
save logged `Invalid pattern` because the path contained `..`. Run
`32342108554` separately rejected a follow-up that placed `runner.temp` in a
workflow-level expression, before any job started. The accepted workflow now
resolves `$RUNNER_TEMP/ms-playwright` through `GITHUB_ENV` inside the job. These
failures are retained as path-validation evidence and are not acceptance runs.

## Hosted acceptance

| Observation | Cold or earlier evidence | Warm exact-source evidence | Result |
| --- | --- | --- | --- |
| Bun packages | Run `32340895568` missed, installed 1,737 packages in 15.24s and saved the event-scoped key. | Run `32342247926` attempt 2 restored the exact 307 MB key, still ran frozen install and installed 1,737 packages in 1.65s; save skipped. | Package installation saved 13.59s. Restore itself took about 10s, so end-to-end setup savings are smaller. |
| Chromium binaries | Run `32342247926` attempt 1 missed, installed system packages, downloaded Chromium 1228 plus its supporting binaries in 22s and saved the 261 MB exact key in 5s. | Attempt 2 restored that exact key in 7s, still ran `--with-deps` in 10s, logged no browser download and skipped save. | The install step saved 12s; restore plus retained system setup saved about 5s against miss plus install, or about 10s when the cold save cost is included. |
| Complete Quality graph | Attempt 1 passed all nine ordered checks in a 4m44s job. | Attempt 2 passed all nine ordered checks, including docs browser proof, in a 5m03s job. | No overall job saving is claimed: release-graph variation added about 29s and outweighed dependency setup savings in this pair. |
| Cache-free fallback | Local forced release and verification graphs passed without GitHub cache services; earlier hosted Quality run `32323001841` passed before these dependency-cache steps existed. The accepted cold Chromium miss also continued through the live install. | Cache operations remain non-fatal and neither install can be skipped by a hit. | Evidence supports an uncached correctness path, not GitHub cache-service availability. |

The Chromium identity was Playwright `1.61.1`, Chromium revision `1228`, on
Linux X64 with the current `bun.lock` hash. This proves binary reuse for that
identity only. It does not prove operating-system packages were cached, and it
does not establish deployment, publication, provider or public-site state.

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

## Recovery

Rollback removes the four GitHub cache restore/save steps and three path or
identity steps while preserving exact Bun setup, frozen install, Playwright
`--with-deps`, Turbo bindings and the complete release graph.
