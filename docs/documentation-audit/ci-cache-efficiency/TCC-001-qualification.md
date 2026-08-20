---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC-001 authority decision, workflow, Turbo, Bun, Playwright, or hosted-run change
---

# TCC-001 cache qualification

## Result

The technical cache candidates are suitable for a smallest vertical spike.
Cooper's 2026-08-20 successor approval selected the
`cooper-corbetts-projects` Hobby team and authorised the complete SPEC
implementation under
[`TCC-001-cache-authority.json`](./TCC-001-cache-authority.json).

The dedicated empty Vercel project `taxkit-ci-cache` now exists, Vercel Remote
Cache is enabled for the selected team, and the GitHub repository variable
`TURBO_TEAM` reads back as `cooper-corbetts-projects`. A project-scoped Vercel
token named `taxkit-turbo-ci-2026-08-20` was created with an expiry of
2026-11-18. Its bearer was transferred directly into GitHub's encrypted
`TURBO_TOKEN` repository secret and a 1Password API Credential item in the
Corbett Family `taxkit` vault, then removed from the system clipboard. No
workflow binding exists yet. The bounded names-only readback is
[`TCC-001-provider-readback.json`](./TCC-001-provider-readback.json).

The read-only authority used for this audit is
[`TCC-001-read-only-authority.json`](./TCC-001-read-only-authority.json).

## Current call graph

~~~text
Quality pull request or push to main
  -> checkout full history
  -> set up Bun 1.3.14
  -> bun install --frozen-lockfile
  -> Playwright install --with-deps chromium
  -> check:quality-workflow
  -> release:check -- --ci
       -> verification
       -> test
       -> build
       -> docs:validate
       -> SDK packed-artifact check
       -> SDK downstream validation
       -> API smoke
       -> docs browser test
       -> Changeset status

Preview / Production / Teardown / Receipt workflows
  -> live checkout, install and candidate admission
  -> deterministic repository checks and provider-free builds
  -> live GitHub, artifact, Alchemy or Cloudflare reads/mutations
  -> live provider, hosted and receipt readback
~~~

Turbo currently owns workspace `build`, `generate`, `check-types` and `test`.
The root `verification`, mixed root `test`, `docs:validate` and `release:check`
commands are direct scripts, so their deterministic parts cannot yet be shared
as Turbo root-task results. Remote caching is disabled.

Vercel's current
[external CI/CD contract](https://vercel.com/docs/monorepos/remote-caching#use-remote-caching-from-external-cicd)
uses a Vercel Access Token in `TURBO_TOKEN` and a team slug in `TURBO_TEAM`.
Its [token guidance](https://vercel.com/kb/guide/how-do-i-use-a-vercel-api-access-token)
supports selecting a team scope and expiry. These provider capabilities do not
select TaxKit's team or authorise creating and attaching the token.

## Hosted cold baseline

GitHub's timestamps produce the following claim-matched observations:

| Quality run | Event and source | End-to-end feedback | Worker job | Bun install | Chromium setup | Release graph |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| [32316014670](https://github.com/crcorbett/taxkit/actions/runs/32316014670) | push, `13276d8` | 266s | 262s | 13s | 26s | 216s |
| [32305069327](https://github.com/crcorbett/taxkit/actions/runs/32305069327) | push, `a86994a` | 1,585s | 1,581s | 16s | 1,319s | 238s |
| [32304045477](https://github.com/crcorbett/taxkit/actions/runs/32304045477) | pull request, `1cbcf2d` | 564s | 558s | 14s | 298s | 238s |

Queue delay was zero in GitHub's run-level timestamps; job setup added four to
six seconds before the worker steps. Synchronous maintainer attention and time
from successful CI to human acceptance are not recorded by these runs and are
therefore unknown. The evidence supports a browser-download and repeated-work
problem; it does not yet measure warm-cache savings.

## Local forced baseline

- Bun: `1.3.14`.
- Turbo: `2.9.14`.
- Playwright: resolved `1.61.1`; Chromium is stored outside the checkout.
- Bun global package cache: the user-level Bun install cache returned by
  `bun pm cache`, outside the checkout.
- Platform: `Darwin-arm64`.
- `bunx turbo run build --force`: 14/14 tasks passed with zero cache hits in
  12.27s Turbo time and 12.32s wall time.
- `bunx turbo run check-types --force`: 23/23 tasks passed with zero cache hits
  in 25.71s Turbo time and 25.77s wall time.
- Both commands explicitly reported remote caching disabled. The first build
  attempt was invalid because the local macOS sandbox denied Chromium startup;
  the same command passed outside that restriction.

## Turbo input, output and environment audit

The dry graph found 14 runnable build tasks, 14 runnable type-check tasks and
six runnable package-test tasks across the 15-package scope. Existing task
inputs include package source/configuration and the resolved dependency graph.
No task declares environment variables or pass-through environment variables.

Before remote writes are enabled:

- narrow build outputs by package where the current shared `dist`, `.source`,
  `.output` and `.vercel/output` list overstates real outputs;
- add explicit environment inputs for any task whose output changes with
  deployment mode, runtime mode, source conditions or browser behaviour;
- map deterministic root checks to `//#task` entries without making a root
  script call itself;
- keep credentials out of task inputs, outputs and replayed logs;
- retain `cache: false` for persistent development, cleanup and every live
  provider/state boundary.

## Command classification

| Class | Route through Turbo cache | Keep live |
| --- | --- | --- |
| Workspace build, generation, type checks and deterministic tests | Yes, after input/output audit | No |
| Root lint, format check, documentation checks, repository-path checks and deterministic policy tests | Yes, as explicit root tasks | No |
| Provider-free docs build | Yes, with complete browser/platform/environment inputs | No |
| Frozen dependency install and Playwright/system dependency install | No | Yes; their download data uses separate GitHub caches |
| Git history, GitHub run/artifact queries and candidate identity | No | Yes |
| Provider plan, deploy, teardown, state reconciliation and hosted readback | No | Yes |
| Receipt creation, promotion and any checker with unrepresented external input | Only after every external input is materialised and hashed | Yes by default |

## Proposed cache identities

- Turbo: Turbo's task hash plus audited global dependencies and declared
  environment inputs. Vercel team and access are runtime settings, not source
  inputs or logged output.
- Bun packages: event trust class + runner OS/architecture + `.bun-version`
  digest + `bun.lock` digest. Cache only Bun's global package cache, never
  `node_modules`.
- Playwright Chromium: event trust class + runner OS/architecture + resolved
  Playwright version `1.61.1` + lockfile digest. Set an explicit browser path
  outside the checkout. Keep `--with-deps`; a restored browser binary does not
  prove system packages are installed.

Restore may fall back to a narrower exact-version prefix only within the same
trust class. Save occurs only after successful installation. A miss, corrupt
entry or cache-service failure must run the full install and command path.

## Target event matrix

| Event | Turbo engine | Proposed remote access | Bun/Chromium save | Current decision |
| --- | --- | --- | --- | --- |
| Local | All eligible commands | Explicit opt-in for `cooper-corbetts-projects`; developer-managed credentials only | Local tool caches only | Team selected; no automatic local login |
| Pull request from same repository | All eligible commands | Remote read-only through `--cache=local:rw,remote:r`; no ordinary remote write | PR trust-class entries | CLI mode verified; hosted enforcement remains to be proved |
| Pull request from a fork | All eligible commands | No secret exposure; complete local/fallback execution unless a credential-free safe design is accepted | Fork-safe restore, no trusted save | Preserve safe fallback |
| Push to main | All eligible commands | Trusted read/write | Trusted main entries | `TURBO_TOKEN` and `TURBO_TEAM` names read back; workflow binding starts in TCC-002 |
| Preview, Production, Teardown and Receipt | Eligible deterministic commands only | Trusted read/write; live provider/state work bypasses Turbo | Trusted workflow entries | Credential names read back; workflow binding starts in TCC-004 |

Using `pull_request_target` is excluded. A cache hit cannot replace a Quality
check, candidate identity, deployment plan, provider readback, receipt or
public browser proof.

## Authority readback and stop condition

GitHub and Vercel identified the current user as `crcorbett`. GitHub reports
repository admin permission and the environments `github-actions-report-only`,
`taxkit-docs-preview`, `taxkit-docs-preview-teardown` and
`taxkit-docs-production`. No repository or environment secret/variable name
matched `TURBO`, `VERCEL` or `CACHE`.

Vercel read back the selected team ID `team_1LX7ZujbijowTv8J9k0aU7nD`, owner
role and enabled Remote Cache state. The empty project
`prj_5AOSvL1mowN48x15MnwhvRWPZc9k` narrows the credential scope and has no
deployment or Git link. GitHub read back the non-secret `TURBO_TEAM` variable.
GitHub also read back the encrypted `TURBO_TOKEN` secret name. 1Password read
back item `taxkit-turbo-ci-2026-08-20` in the Corbett Family `taxkit` vault. No
provider returned the bearer value, and the system clipboard was cleared. The
parent audit accepts this bounded authority, event matrix and fallback design
for TCC-002 workflow mutation.

## Smallest next spike

1. Add one harmless deterministic root task and audited Turbo inputs.
2. Bind the approved Vercel team and cache-only credential to one trusted
   Quality event without changing release order.
3. Run the same candidate once with cache bypass and twice with remote cache.
4. Compare task hashes, hit/miss logs, exit status and the four clocks.
5. Remove the binding and retain the uncached graph if isolation, fallback or
   measured benefit fails.

This qualification proves no provider mutation, deployment, publication,
Production state, public availability or warm-cache saving.

## Verification

Passed on 2026-08-20:

- `bun pm cache`
- `bunx turbo run build --force`
- `bunx turbo run check-types --force`
- `bun run check:quality-workflow`
- `bun run check:docs`
- `bun run check:runbooks`
- `bun run check:repository-paths`
- authority-envelope field validation against the checked-in Schema
- `git diff --check`

Names-only provider readback also confirmed the dedicated empty project, token
scope and expiry, GitHub `TURBO_TOKEN` secret, GitHub `TURBO_TEAM` variable and
1Password item. The parent audit accepted TCC-001 after this verification.
