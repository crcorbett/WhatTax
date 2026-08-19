---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-13
review_trigger: native Alchemy docs resource, development path, deployment graph, inventory, workflow, or proof change
successor: null
tombstone: false
---

# Native Alchemy docs integration

## Outcome

TaxKit's TanStack Start docs application uses the installed Alchemy release's
first-class `Cloudflare.Website.Vite` resource for build, local Cloudflare
development and deployment. The implementation has one Alchemy-owned website
resource rather than a separately coordinated `Command.Build` and prebuilt
`Cloudflare.Worker` pair.

The report-only provider inventory remains available for deployment preflight
and readback. The scheduled GitHub-PR orphan classifier, its `gh pr list`
dependency and its nested TaxKit child-process adapter are retired: they were
an ephemeral control whose repository-wide credential and contributor model
was not justified. Historical receipts remain immutable evidence only.

Implementation is accepted in
[`native-alchemy-docs-integration.tasks.json`](./native-alchemy-docs-integration.tasks.json)
and the [completed execution plan](../exec-plans/completed/native-alchemy-docs-integration.md).
The [terminal audit](../documentation-audit/native-alchemy-docs-integration/terminal-audit.json)
records the exact source authority, local proof, residual exceptions and
external non-claims.

## Exact source authority

The implementation target starts at clean `origin/main`
`2091891b02ba9cb12aee2051ceb716401a74c70c` with Alchemy
`2.0.0-beta.64` and Effect `4.0.0-beta.100` installed.

Alchemy beta.64 is inspected from tag `v2.0.0-beta.64`, commit
`31edd3c4b2f0f3310fad07f5423aee20cf72be8d`. The authoritative paths are
`packages/alchemy/src/Cloudflare/Website/Vite.ts`,
`packages/alchemy/src/Cloudflare/Workers/Vite.ts`, the Worker providers and
`examples/cloudflare-tanstack`. Durable TaxKit files record the immutable
revision, never the workstation checkout path.

The installed source proves that `Cloudflare.Website.Vite` is a public
`alchemy/Cloudflare` export in beta.64. It injects Alchemy's Cloudflare Vite
plugin, builds the TanStack application through Vite, deploys the resulting
SSR Worker and assets as one logical resource, and runs the Vite development
server under `alchemy dev`.

## Requirements

### `NAI-001` — one native website resource

Root `alchemy.run.ts` must retain the existing stack name, stage decoding,
compatibility, Worker-first assets, observability and output identity while
replacing `DocsBuild` plus `DocsWebsite` with one
`Cloudflare.Website.Vite("DocsWebsite")` resource rooted at `apps/docs`.

### `NAI-002` — authoritative and provider-free development paths

The authoritative Cloudflare-integrated development command must use
`alchemy dev`. A fast infrastructure-free Vite command may remain separately
named. Standalone provider-free build and workerd proof may keep the official
Cloudflare Vite plugin only behind Alchemy's documented injection guard, so an
Alchemy-run process can never install two Cloudflare plugin stacks.

### `NAI-003` — graph-aligned deployment proof

Preview, Production and teardown workflows, plan Schemas, inventory decoding,
tests and current documentation must expect one `DocsWebsite`
`Cloudflare.Worker` logical resource. Previously retained two-resource
receipts remain decodable historical evidence and are not rewritten.

### `NAI-004` — retire the ephemeral orphan audit

Remove the scheduled orphan workflow, root command, current automation entry,
orphan Schemas/services/runtime, `gh pr list` dependency and child-process
boundary. Preview teardown remains the explicit PR-close lifecycle owner.
Provider inventory remains an in-process Effect/Alchemy readback used by the
deployment workflows; it must not gain mutation authority.

### `NAI-005` — proof and closeout

Prove the native graph statically against the exact beta.64 API, build the
docs app without a prebuilt workspace artifact, exercise SSR/hydration/client
navigation/server functions/malformed data/404/console cleanliness through
the built Cloudflare artifact, update current owners, and run full repository
verification. No external deployment or provider mutation is part of this
goal.

## Documentation impact

| Surface | Decision | Owner/postcondition |
| --- | --- | --- |
| Current SPEC, tasks and plan | Change required | These files own current intent and close together. |
| Alchemy composition and docs app commands | Change required | `alchemy.run.ts`, `apps/docs/package.json`, `apps/docs/vite.config.ts` and `apps/docs/README.md` describe one guarded native path. |
| Deployment architecture, runbook and workflows | Change required | Current graph, commands and exact resource expectations use `DocsWebsite` only. |
| Orphan automation and process tooling | Change required | Current surfaces are removed; historical evidence remains intact. |
| Public MDX, navigation and visual design | Preserve | No content or presentation behavior changes. |
| Historical deployment evidence and completed plans | Preserve | Past observations remain truthful for their recorded candidates. |
| Package publication, domain/DNS and provider state | N/A | No Changeset, publication, external deployment, DNS or provider mutation. |

## Non-goals

- No Preview, Production, teardown, credential, state, DNS or Cloudflare
  mutation.
- No package publication, versioning, tag or release.
- No public docs content, navigation or design change.
- No generalized GitHub contributor lifecycle system. A future need must earn
  a provider-neutral design rather than revive the deleted helper by default.
- No workstation path or reference-repository identity in durable files.

## Acceptance

- `Cloudflare.Website.Vite` is the only docs application resource in
  `alchemy.run.ts`.
- `alchemy dev` is admitted and the Vite config prevents duplicate Cloudflare
  plugin injection.
- current plans, inventory and workflows expect only `DocsWebsite`.
- no current orphan workflow, `check:docs-deployment-orphans`, `gh pr list` or
  deployment child-process boundary remains.
- focused deployment, docs server/browser/built-artifact, documentation,
  runbook, portability and full verification gates pass.
- a terminal audit records the exact Alchemy revision, checks, limitations and
  explicit non-claims.

All acceptance conditions are satisfied by the working-tree candidate based on
`2091891b02ba9cb12aee2051ceb716401a74c70c`. No final commit identity or
external deployment state is claimed by this SPEC.
