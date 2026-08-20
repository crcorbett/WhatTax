---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: dependency-cache key, GitHub cache scope, checkout action, runner runtime, hosted run, live install, rollback, or retirement change
---

# SDC shared dependency-cache and checkout proof

## Accepted result

Retain content-addressed Bun-package and Playwright Chromium keys without an
event-name segment, and retain the exact checkout v7.0.1 pin in all five
workflows. Pull-request run `32357219491` passed twice on the same immutable
implementation commit. Attempt 1 created the new dependency caches; attempt 2
restored both exact keys while frozen Bun installation, Playwright system setup
and the complete Quality graph remained live.

## Exact identity

| Field | Value |
| --- | --- |
| Pull request | `#59` |
| Source commit | `05fc7328db6d9468c0e616d498155213f4357b03` |
| Tested pull-request merge commit | `dbedb4726eb93bf25319951b75b7a5114c162c5d` |
| Base commit | `2c53f90dcdb5c8b84d6f023cb93e0b93ffaca124` |
| Workflow run | `32357219491` |
| Attempt 1 job | `96388883326` |
| Attempt 2 job | `96390114626` |
| Checkout pin | `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1` |

The official `v7.0.1` tag resolved to the recorded checkout commit before the
repository pin changed. Both hosted attempts downloaded and executed that
exact action. Attempt 2 completed with no check-run annotations.

## Cache and live-install observation

The exact Bun key was:

```text
bun-packages-Linux-X64-7ad7dfb1284f274e4135933b45f5e355366dd6b650748d7a0d5b0b3e386f1884-ed054af6fdfbcd84c7791555163364b47a782f2478431fb8d6389001050fb6d2
```

The exact Chromium key was:

```text
playwright-chromium-Linux-X64-1.61.1-ed054af6fdfbcd84c7791555163364b47a782f2478431fb8d6389001050fb6d2
```

Attempt 1 missed and saved both keys. The job passed in 3m29s. Bun frozen
installation took 19 seconds and the Bun save took seven seconds; Playwright
`--with-deps` took 30 seconds and its save took four seconds.

Attempt 2 hit both exact keys and skipped both saves. The job passed in 54
seconds. Bun restore took six seconds and frozen installation still ran for two
seconds. Chromium restore took four seconds and Playwright `--with-deps` still
ran for 12 seconds. This proves reusable pull-request-ref entries and live
installation for the exact pair. The 2m35s whole-job difference also includes
Vercel Turbo hits and normal runner variation, so it is not attributed to the
two GitHub caches alone.

The event-free key allows GitHub's documented lookup to find a matching
default-branch entry after this workflow revision reaches `main`. This run
cannot prove that cross-ref restore because `main` still uses the predecessor
key until merge. GitHub's ref scope, not a TaxKit secret or workflow condition,
keeps pull-request writes unavailable to `main` and sibling pull requests.

## Local and policy proof

- `bun run check:quality-workflow`: passed with the content-addressed,
  ref-scoped report.
- `bun run test:quality-workflow`: 18 tests passed, including event-name,
  `node_modules`, install, action-pin and authority regressions.
- `bun run test:docs-deployment`: 57 tests and 443 assertions passed after all
  four deployment/receipt workflows were bound to the shared keys and exact
  checkout pin.
- `bun run check:docs-deployment-automation`, `bun run check:docs`, `bun run
  check:runbooks` and `bun run check:repository-paths`: passed.
- `bun run verification`: passed, including lint, formatting, skills, both
  Knip graphs and 23 workspace typecheck tasks.
- `git diff --check`: passed.
- No Changeset is required because this changes CI policy and maintainer
  documentation only.

## Risk, rollback and limits

Default-branch caches may be readable by fork pull requests, so the retained
paths contain only package downloads and browser binaries. They contain no
secret, credential, `node_modules`, provider state, receipt or source tree.
Pull-request writes remain ref-scoped. Frozen installation, Chromium system
setup and every command remain authoritative on hit, miss and cache outage.

Rollback restores the event-name segment or removes the dependency-cache
restore/save steps, while retaining frozen installation and the complete
workflow graph. Checkout rollback restores the prior full SHA if a runner
compatibility problem appears.

The evidence proves only the named local checks, pull-request commit, merge
commit, workflow, key pair and same-ref reuse. It does not prove a future
pull-request restore from `main`, general time savings, deployment, teardown,
provider state, publication, release, registry state or public behaviour.
