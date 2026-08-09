---
document_type: execution-plan-index
lifecycle: current
authority: canonical
owner: taxkit-documentation-owner
last_reviewed: 2026-08-10
review_trigger: active execution-plan admission, lifecycle, dependency, or successor change
successor: null
tombstone: false
---

# Active exec plans

Live implementation plans belong here while work is in progress. Maintainer
lifecycle is owned by [`../../README.md`](../../README.md).

Current implementation:

- [Docs Cloudflare and Alchemy deployment](./docs-cloudflare-alchemy-deployment.md)
  executes the accepted five-slice SPEC from its reviewed planning commit.
  DCD-001 is accepted locally after both built-app oracles, documentation
  reconciliation, independent closure and change-owned gates passed for the
  official Cloudflare Vite output plus public Alchemy prebuilt-Worker
  composition. DCD-004 now has one promoted main-sourced Preview receipt for
  `pr-24`; Production, teardown, rollback and report-only remain separately
  gated. The earlier unsupported Website.Vite seam and Worker-first asset
  failure remain retained evidence; DCD-002 starts after the coherent DCD-001
  commit.

Completed harness work is retained under
[`../completed/harness-foundation-improvements.md`](../completed/harness-foundation-improvements.md)
and
[`../completed/harness-governance-documentation.md`](../completed/harness-governance-documentation.md).
The completed docs application migration and its bounded local screenshot
evidence are retained under
[`../completed/docs-application-architecture.md`](../completed/docs-application-architecture.md).
