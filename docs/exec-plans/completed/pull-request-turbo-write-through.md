---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-08-20
review_trigger: PWC task, workflow policy, cache authority, hosted run, or successor change
successor: ../../product-specs/pull-request-turbo-write-through.md
tombstone: false
---

# Pull-request Turbo Write-through Cache Execution Plan

Spec: [Pull-request Turbo Write-through Cache](../../product-specs/pull-request-turbo-write-through.md)

Task list:
[`pull-request-turbo-write-through.tasks.json`](../../product-specs/pull-request-turbo-write-through.tasks.json)

## Outcome

PWC-001 changes token-bearing same-repository Quality pull requests from
Vercel Remote Cache read-only to read/write. Fork pull requests remain
secret-free and use the full local fallback. The existing Bun-download and
Chromium caches remain separate; `node_modules` stays live and uncached.

## Proof

- Candidate commit: `79762b3de2fc68ae937aeba6a0323587c6de420e`.
- Pull request: `#58`.
- Run `32351432522`, attempt 1: remote enabled, hash
  `8cf9ff8f2a792e94` missed under read/write, full job passed in 5m45s.
- Exact attempt 2: the same hash replayed remotely and the full job passed in
  54 seconds.
- Bun and Chromium primary keys hit on attempt 2, while frozen install took 4
  seconds and Playwright `--with-deps` took 15 seconds.
- Local empty-token fallback and full `bun run verification` passed.
- Detailed receipt:
  [`PWC-001-hosted-proof.md`](../../documentation-audit/pr-write-through-cache/PWC-001-hosted-proof.md).

No Changeset is required because this changes CI policy and maintainer
documentation only.

## Risk, recovery and non-claims

Cooper accepted same-repository pull-request access to the existing team-scoped
Vercel bearer. Forks remain secret-free under `pull_request`; policy rejects
`pull_request_target`. Rollback restores remote read-only for pull requests or
removes remote bindings while retaining every Quality command. The measured
84% same-commit difference is not a general forecast, and cache evidence does
not prove release, deployment, provider state, publication or public
availability.
