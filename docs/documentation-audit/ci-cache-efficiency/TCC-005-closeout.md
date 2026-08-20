---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: cache provider, workflow, key, action, task input, hosted result, carrying cost, rollback, or retirement change
---

# TCC-005 cache-efficiency closeout

## Terminal decision

Retain all three cache layers. The Vercel Remote Cache produced the strongest
measured saving for repeated deterministic work. Bun-package and Chromium
caches reduced their own repeated setup, but total-job variation means no
general end-to-end saving is claimed for those layers. Every cache remains
acceleration only; live install, browser, release, candidate, plan, provider,
hosted and receipt boundaries keep their existing authority.

## Final call graph

~~~text
pull request Quality
  -> live checkout, frozen install and Chromium/system setup
  -> eligible Turbo tasks with local read/write and remote read-only
  -> complete ordered nine-check release graph

main Quality
  -> live checkout, frozen install and Chromium/system setup
  -> eligible Turbo tasks with local and remote read/write
  -> complete ordered nine-check release graph

trusted Preview, Production, teardown and receipt workflows
  -> live exact-source and authority checks
  -> event-scoped Bun cache; Chromium cache where browser work exists
  -> live frozen and pinned browser installs
  -> eligible deterministic checks/builds through Turbo remote read/write
  -> live external input, plan, mutation, provider, hosted and receipt work
~~~

Fork pull requests receive no repository cache secret. Local remote-cache use
is explicit and developer-managed. A missing token, cache miss or cache-service
failure leaves the full local command graph runnable.

## Measured observations

| Layer and exact evidence | Cold | Warm | Accepted result |
| --- | ---: | ---: | --- |
| Vercel Remote Cache, main Quality run `32337825523`, source `ee463744b9d923fb5733b5777907ee8480bde463` | Attempt 1: 5m36s worker, 5m40s feedback; eligible hash `44e6cd988f5b2785` missed and wrote. | Attempt 2: 1m09s worker, 1m13s feedback; the same hash replayed. | 4m27s worker saving, about 79%, for this same-commit pair. The complete nine-check graph and browser proof still passed. |
| Bun packages, Quality run `32342247926` and earlier cold run `32340895568` | Cold frozen install: 15.24s. | Exact 307 MB key restored; frozen install: 1.65s. | Install step saved 13.59s, partly offset by about 10s restore time. |
| Chromium, Quality run `32342247926`, source `fa2467e338c2dd41e04bc763533731b110d73f98` | Attempt 1: 22s install plus 5s save after a miss. | Attempt 2: 7s restore plus 10s retained `--with-deps` setup, with no browser download. | About 5s against miss plus install, or 10s when the cold save is included. The warm total job was 19s slower, so no total-job saving is claimed. |
| Trusted Preview plan, run `32345183087`, candidate `bae3731748ef90eb7b6d6885115ee6eb76775d8a` | Attempt 1: 50s worker, 71s feedback; Bun and Chromium missed and saved; four eligible Turbo tasks hit remotely. | Attempt 2: 48s worker, 70s feedback; exact Bun and Chromium keys restored and the same Turbo tasks hit. | Dependency setup fell by about 15s, but other setup variation left only 2s worker and 1s feedback improvement. Both live plans had digest `f76ead54005da979c1a4de49652bb2c7400c99896d6a79c353b7c5909b038b40`. |

The Turbo main pair needed no protected-environment review. Each Preview
attempt needed one protected-environment approval. GitHub does not measure
active reviewer time or the interval from a green run to parent acceptance, so
synchronous maintainer attention and time to accepted outcome remain unknown.
That missing clock is retained as a limitation, not converted into a saving.

## Control acceptance

| Control | Owner | Carrying cost | Review trigger | Retirement condition |
| --- | --- | --- | --- | --- |
| Vercel Remote Cache | `taxkit-ci-release-maintainer`; authority metadata in the operational authority model | Team-scoped token rotation, GitHub secret/variable upkeep, Turbo input/output review and provider availability | Token, team, event mode, task input/output, log content or provider contract change | Remove bindings if isolation fails, stale output is observed, provider cost outweighs measured value or fallback no longer works. |
| Bun package cache | Quality and docs-workflow owners | GitHub cache storage/transfer, action updates and key maintenance | Bun version, lockfile, OS/architecture, cache path, action pin or install behaviour change | Remove restore/save steps if warm setup no longer helps, entries are unsafe/stale or live frozen install stops being reliable. |
| Playwright Chromium cache | Quality and docs-workflow owners | Large cache storage/transfer and browser-version/path maintenance | Playwright version, browser revision, OS/architecture, path, action pin or system-dependency policy change | Remove restore/save steps if transfer exceeds download value, identity cannot be exact or live browser proof diverges. |

Disconfirming evidence is retained: a missing project-scoped Vercel token fell
back locally; strict Turbo environment handling first omitted the browser path;
one Chromium path was invalid for cache save; a workflow-level runner context
was rejected by GitHub; and the warm dependency Quality job was slower overall.
These observations justify the narrow keys, runtime path resolution, live
installs, non-fatal cache operations and bounded performance claims.

## Bypass, rollback and non-claims

- Use `TURBO_FORCE=true` for an uncached Turbo reproduction. Missing remote
  credentials also falls back to local execution.
- Cache rollback removes only the relevant `TURBO_*` bindings or GitHub cache
  restore/save steps. Preserve frozen installation, browser installation and
  the full release/deployment proof graph.
- Do not destroy, redeploy, alter provider state or revoke unrelated
  credentials as cache recovery.
- No cache receipt proves publication, package release, deployment,
  Production, provider state, public availability or external-consumer
  behaviour.

## Documentation impact

| Owner | Decision | Evidence |
| --- | --- | --- |
| Workflows, Turbo tasks, policy, controls and automation registers | Preserve | Checked-in controls already own exact actions, keys, event authority, task treatment and fallback; final local and hosted proof matched them. |
| Testing/deployment architecture and release/deployment runbooks | Preserve | Current owners already describe the final call graph, bypass, rollback and proof ceilings. |
| SPEC, task list, product index and execution-plan indexes | Change required | They must record the terminal `retain` outcome and completed lifecycle. |
| Documentation-audit index and dated evidence | Change required | They must route this closeout and accepted TCC-004 hosted proof. |
| Public docs, API, SDK, packages, harness profile and critical journeys | N/A | Cache acceleration changes no public contract or consumer-visible journey. |
| Changeset | N/A | CI configuration, repository tooling and maintainer documentation only; package installation, exports and runtime behaviour are unchanged. |
