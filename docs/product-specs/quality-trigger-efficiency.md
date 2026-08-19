---
document_type: product-spec
lifecycle: active
authority: canonical
owner: taxkit-product-owner
last_reviewed: 2026-08-20
review_trigger: workflow trigger, CI policy, release graph, or proof change
successor: null
tombstone: false
---

# Quality Trigger Efficiency

## Purpose

Remove a known duplicate from the hosted Quality graph without weakening
coverage. Pull requests remain the check for feature branches; a push to
`main` remains the post-merge check. A feature-branch push must not start a
second copy of the same graph.

## Scope

This slice changes only the Quality workflow trigger contract, its
Schema-backed policy and tests, and the owning CI documentation. It does not
change the nine release checks, browser setup, concurrency policy, deployment
workflows, credentials, or external provider state.

## Call graph

```text
feature branch push
  -> pull_request event
    -> one read-only Quality graph

merge to main
  -> push event on main
    -> one read-only Quality graph
```

The policy rejects path filters and any push branch other than `main`, so a
new boundary cannot be skipped and the known duplicate cannot return.

## Acceptance

- `.github/workflows/quality.yml` has `pull_request` and `push: main` only.
- `bun run check:quality-workflow` accepts the workflow and rejects a
  `codex/**` push branch.
- The canonical CI documentation describes the trigger split and its reason.
- Local repository verification passes; hosted CI is checked on the resulting
  pull request before merge.

## Impact ledger

| Surface | Decision | Owner and reason |
| --- | --- | --- |
| Workflow and policy | Change required | `.github/workflows/quality.yml` and `tools/quality-workflow/` own the executable trigger contract and negative fixture. |
| CI architecture and standards | Change required | `docs/architecture/testing-and-quality.md` and `docs/standards/controls.md` explain coverage and the no-duplicate rule. |
| Harness profile | Change required | `docs/verification/repository-harness-profile.json` records the current hosted route. |
| SPEC, tasks and plan | Change required | This SPEC, its task list, the product-spec index and the active/completed plan preserve intent and proof. |
| Package/API/SDK/runtime behavior | N/A | No package, public contract, app runtime, or deployment behavior changes. |
| Changesets | N/A | This is repository CI policy and documentation; no package contract changes. |
| Provider, credentials and deployment state | N/A | No external mutation is authorised or required. |

## Verification and limits

Required local checks are the focused Quality workflow policy check, docs and
runbook checks, and the repository verification command. The hosted pull
request Quality run proves the checked-in workflow on GitHub. These checks do
not prove deployment, publication, registry state, or public-site behaviour.

Rollback is a revert of the single workflow/policy/documentation commit. A
broader CI efficiency review is deliberately separate and may propose further
changes only after inspecting evidence from this repository and its current
hosted checks.
