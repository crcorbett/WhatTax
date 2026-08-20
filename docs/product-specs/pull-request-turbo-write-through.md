---
document_type: product-spec
lifecycle: active
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: pull-request trust, Turbo cache mode, credential, task input/output, dependency install, or hosted proof change
successor: null
tombstone: false
status: active
source_of_truth: docs
confidence: high
---

# Pull-request Turbo Write-through Cache

## Decision

TaxKit will let same-repository pull requests read and write the existing
Vercel Remote Cache. This allows a pull-request run to populate deterministic
Turbo results for its own rerun and for later runs with the same task hash.
Fork pull requests receive no `TURBO_TOKEN`, so they continue through Turbo's
complete local fallback even though the configured cache mode is read/write.

The Bun package-download cache and Playwright Chromium cache remain separate
GitHub Actions caches. TaxKit will not cache `node_modules` in this slice.
Every run still executes `bun install --frozen-lockfile`, installs Chromium
system dependencies, and runs the complete nine-check Quality graph.

Task plan:
[pull-request-turbo-write-through.tasks.json](./pull-request-turbo-write-through.tasks.json)

## Evidence and problem

The implemented predecessor deliberately made pull requests remote read-only.
That prevents a same-repository pull request from warming Vercel for its own
rerun. Cooper approved the wider write boundary on 2026-08-20 because TaxKit's
same-repository contributors are trusted to run code with the existing
team-scoped remote-cache token.

Installed-package caching is a different mechanism from Turbo output caching.
Current evidence does not support adding it:

- final main Quality run `32348857043` restored the Bun package cache in about
  7 seconds and completed frozen install in about 2 seconds;
- warm Preview attempt 2 of run `32345183087` restored the Bun package cache in
  about 10 seconds and completed frozen install in about 1 second;
- the current checkout's `node_modules` is about 1.4 GB and contains 2,755
  symbolic links, while Bun's download cache is about 7.5 GB.

Saving, transferring and extracting another large, platform-sensitive tree is
therefore likely to cost more than the 1–2 seconds it could remove. It could
also restore stale workspace links or native package state. Reconsider this
only if at least three warm hosted runs show frozen installation taking 10
seconds or more, and a lockfile/Bun/OS/architecture-keyed spike proves a lower
total restore-plus-validation time without stale links.

## Current and target call graph

```text
Current same-repository pull request
  -> TURBO_CACHE=local:rw,remote:r
  -> read an existing Vercel task result
  -> run a miss locally without uploading it

Target same-repository pull request
  -> TURBO_CACHE=local:rw,remote:rw
  -> read an existing Vercel task result
  -> run a miss locally and upload the deterministic result
  -> exact rerun or later matching task hash can reuse it

Fork pull request
  -> no repository TURBO_TOKEN
  -> full local Turbo fallback
  -> complete live Quality graph
```

The GitHub cache path remains:

```text
restore Bun package downloads
  -> bun install --frozen-lockfile recreates node_modules live
restore Playwright Chromium binary
  -> Playwright installs operating-system dependencies live
  -> complete nine-check Quality graph
```

## Goals

- Enable Vercel Remote Cache read/write for token-bearing pull-request runs,
  main and the existing trusted deployment and receipt workflows.
- Let a same-repository pull request warm deterministic Turbo tasks for exact
  reruns and later matching hashes.
- Preserve fork fallback, read-only repository permissions, current triggers,
  cancellation, timeout and the complete release graph.
- Preserve separate Bun-download and Chromium caches plus live installation.
- Record the accepted same-repository token risk and claim-matched hosted
  write/read proof.

## Non-goals

- No `pull_request_target`, fork secret exposure or deployment credential.
- No cache of `node_modules`, operating-system packages, provider state,
  credentials, receipts or mutable external observations.
- No skipped command, affected-only graph, path filter or release-check change.
- No token creation, rotation, scope expansion or provider-project change.
- No package, API, SDK, public docs or application-runtime change.
- No Changeset because this changes repository CI policy and maintainer docs
  only.

## Authority and risk

The principal is `taxkit-ci-release-maintainer`. The resource is the existing
TaxKit Vercel team Remote Cache. Same-repository pull-request code can use the
existing team-scoped `TURBO_TOKEN`; this means such code could deliberately
upload cache objects or attempt to misuse or disclose a bearer whose provider
scope covers the selected team's projects. Cooper has accepted this boundary
for trusted same-repository contributors. Content addressing reduces
accidental replacement but is not a security boundary when task inputs are
incomplete or a bearer is leaked.

Fork pull requests remain untrusted. GitHub does not provide repository secrets
to their `pull_request` runs, and the workflow must never change to
`pull_request_target`. Repository permissions remain `contents: read`.
Rollback restores Quality to `local:rw,remote:r` for pull requests, or removes
the remote bindings entirely, without changing the uncached graph. Suspected
credential disclosure requires separate token revocation under the existing
authority owner.

## Acceptance and proof

- The workflow and Schema-backed policy require
  `TURBO_CACHE=local:rw,remote:rw` and keep one repository-secret binding.
- Negative tests reject remote read-only regression, missing identity,
  `pull_request_target`, step overrides, `node_modules` caches and skipped live
  installs.
- A same-repository pull-request run logs Vercel Remote Cache enabled and
  completes a cacheable miss under read/write mode.
- An exact rerun of that immutable revision records a remote hit for at least
  one task written by the pull-request run.
- Empty-token local proof completes through the local fallback.
- The focused checks, docs checks, runbook checks and `bun run verification`
  pass. Hosted cache evidence proves only the named task/revision and does not
  prove release, deployment, provider state, publication or public behaviour.

## Documentation impact ledger

| Surface | Decision | Owner and verification |
| --- | --- | --- |
| Quality workflow, policy and fixtures | Change required | `.github/workflows/quality.yml` and `tools/quality-workflow/`; `bun run check:quality-workflow` and `bun run test:quality-workflow`. |
| CI controls and automation authority | Change required | `tools/quality-workflow/controls.json`, `automation-register.json`, Schemas and policy cross-checks. |
| CI architecture, standards, authority and recovery | Change required | Current maintainer owners; `bun run check:docs` and `bun run check:runbooks`. |
| Predecessor SPEC and lifecycle indexes | Change required | Link this successor without rewriting dated predecessor evidence. |
| Bun package and Chromium cache implementation | Preserve | Existing paths, keys, non-fatal actions and live install order remain unchanged. |
| `node_modules` cache | Preserve as prohibited | Measured warm install does not justify a second large cache; existing negative fixture remains. |
| Turbo task graph and deployment workflows | Preserve | No task input/output or provider-boundary change. |
| Packages, API, SDK, runtime and public docs | N/A | No consumer-facing contract changes. |
| Changeset | N/A | CI policy and maintainer documentation only. |
