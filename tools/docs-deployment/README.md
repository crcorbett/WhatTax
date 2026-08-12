---
document_type: developer-guide
lifecycle: current
authority: supporting
owner: taxkit-deployment-tool-owner
last_reviewed: 2026-08-13
review_trigger: docs deployment command, receipt Schema, workflow adapter, provider inventory, authority, or proof change
---

# Docs deployment tooling

This directory owns repository-side validation, workflow receipt checks,
provider/state inventory and report-only orphan classification for the docs
application. Durable resource and proof policy lives in
[`../../docs/architecture/deployment.md`](../../docs/architecture/deployment.md);
operator procedure and authority live in
[`../../docs/runbooks/docs-deployment.md`](../../docs/runbooks/docs-deployment.md).

## Boundaries

- `schemas.ts`, `workflow-receipts.schemas.ts`,
  `workflow-check.schemas.ts`, `inventory.schemas.ts`, and
  `orphan-inventory.schemas.ts` own external representations and closed safe
  errors.
- `input.boundary.ts` owns repository-relative retained evidence reads.
- `workflow-check.boundary.ts` owns workflow-provided file, JSON and SHA-256
  ingress through Effect FileSystem, Crypto and Schema.
- Each `workflow-*-check.runtime.ts` file decodes its Config Schema, calls the
  shared boundary and one typed verification program, logs safe fields through
  Effect Console, provides Bun services and executes through
  `BunRuntime.runMain`.
- `inventory.runtime.ts` and `orphan-inventory.runtime.ts` are executable
  composition owners. Their services remain report-only unless a separately
  authorized workflow owns mutation.
- `alchemy.run.ts` remains the root Alchemy resource composition; this tool
  directory does not own the Worker graph.

The workflow adapters do not read `process.env`, use `Bun.file`, parse JSON
manually, orchestrate raw Promises, call `Effect.runPromise`, write through
`console`, or set process exit state. Config and receipt values decode once at
ingress and internal failures remain tagged as input, read or mismatch errors.
Logs and receipts contain safe identity only, never credential values or raw
provider payloads.

## Local verification

```sh
bun run check:docs-deployment:types
bun run check:docs-deployment-tools:types
bun run test:docs-deployment
bun run check:docs-deployment
```

The tests include adversarial Config/receipt fixtures and static adapter
contracts. The retained-evidence check validates historical claim matching.
These local commands do not dispatch workflows, access providers, deploy,
destroy, prove hosted behavior or grant operational authority.
