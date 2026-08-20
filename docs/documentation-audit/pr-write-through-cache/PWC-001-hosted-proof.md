---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: pull-request trust, Turbo cache mode, token scope, task hash, hosted run, dependency install, rollback, or retirement change
---

# PWC-001 pull-request write-through proof

## Accepted result

Retain Vercel Remote Cache read/write for token-bearing same-repository pull
requests. Exact pull-request run `32351432522` proved a miss and later remote
hit for the same immutable commit and task hash. Fork pull requests remain
secret-free and use local fallback. The complete Quality graph remained live.

## Exact identity

| Field | Value |
| --- | --- |
| Pull request | `#58` |
| Source commit | `79762b3de2fc68ae937aeba6a0323587c6de420e` |
| Workflow run | `32351432522` |
| Attempt 1 job | `96371230416` |
| Attempt 2 job | `96372954042` |
| Turbo mode | `local:rw,remote:rw` |
| Proved task hash | `8cf9ff8f2a792e94` |

Attempt 1 reported Vercel Remote Cache enabled, missed hash
`8cf9ff8f2a792e94`, completed the task successfully and passed the full job in
5m45s. Under read/write mode, that successful completion was eligible for
upload. Attempt 2 used the exact same source commit, reported Remote Cache
enabled and replayed that exact hash as a remote hit. This establishes that the
pull-request run wrote a reusable result; mode alone would not have proved it.

Attempt 2 passed the full job in 54 seconds. The 4m51s difference, about 84%,
is accepted only for this same-commit pair. It combines many Turbo hits and
normal runner variation, so it is not a general forecast for every pull
request or a claim that the release graph was skipped.

## Dependency-cache and live-install observation

Attempt 2 restored the exact pull-request Bun key in 7 seconds and the exact
Playwright Chromium key in 2 seconds. Both save steps were skipped because the
primary keys hit. The workflow still ran `bun install --frozen-lockfile` for 4
seconds and Playwright `install --with-deps chromium` for 15 seconds, including
live operating-system package checks and installation.

This observation supports retaining the existing cache split:

- Turbo caches deterministic command outputs and logs in Vercel;
- GitHub caches Bun's package downloads;
- GitHub separately caches the Chromium browser binary;
- `node_modules` remains uncached and is recreated by frozen install.

The current installed tree is about 1.4 GB and contains 2,755 symbolic links.
The predecessor's warm hosted frozen installs were 1–2 seconds; this attempt
was 4 seconds. None reaches the SPEC's 10-second requalification trigger, so a
second large installed-tree cache remains rejected.

## Local and policy proof

- `bun run check:quality-workflow`: passed.
- `bun run test:quality-workflow`: 17 tests passed, including remote read-only
  regression, `pull_request_target`, `node_modules` cache and skipped-install
  negative fixtures.
- Empty-token smoke with `TURBO_CACHE=local:rw,remote:rw`: Turbo reported remote
  caching disabled and completed the real local policy command.
- `bun run check:docs`, `bun run check:runbooks` and
  `bun run check:repository-paths`: passed.
- `bun run verification`: passed after all 1,128 staged repository files,
  including the new SPEC and plan, entered the path inventory.
- `git diff --cached --check`: passed.
- No Changeset is required because this changes CI policy and maintainer
  documentation only.

## Risk, rollback and limits

Cooper accepted that trusted same-repository pull-request code can access the
existing team-scoped Vercel bearer, whose provider scope covers the selected
team's projects. Content-addressed task identity reduces accidental overlap but
does not prevent deliberate bearer misuse or an unsafe hit caused by incomplete
task inputs. Contributor trust, token scope, Turbo inputs/outputs and any
suspected disclosure remain review triggers.

Forks receive no repository secret under `pull_request`; the policy rejects
`pull_request_target`. Rollback restores pull requests to
`local:rw,remote:r`, or removes remote bindings entirely while retaining the
complete local graph. Suspected disclosure requires revocation under the
existing authority owner.

The two attempts prove only this commit, hash and workflow. They do not prove
future hit rates, provider isolation, release, deployment, publication,
registry state, public availability or external consumer behaviour.
