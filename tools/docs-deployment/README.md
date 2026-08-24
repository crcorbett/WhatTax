---
document_type: developer-guide
lifecycle: current
authority: supporting
owner: taxkit-deployment-tool-owner
last_reviewed: 2026-08-13
review_trigger: docs deployment command, receipt Schema, workflow adapter, provider inventory, authority, or proof change
---

# Docs deployment tooling

This directory owns repository-side validation, workflow receipt checks and
provider/state inventory for the docs application. Durable resource policy
lives in [`../../docs/architecture/deployment.md`](../../docs/architecture/deployment.md);
operator procedure and authority live in
[`../../docs/runbooks/docs-deployment.md`](../../docs/runbooks/docs-deployment.md).

## Current boundaries

- `schemas.ts`, `workflow-receipts.schemas.ts`, `workflow-check.schemas.ts` and
  `inventory.schemas.ts` own current external representations and closed safe
  errors. `schemas.ts` also decodes immutable historical v1/v2 receipts, while
  current v2 plans admit only the native one-resource graph. Historical
  decoders are not current deployment admission.
- `input.boundary.ts` owns repository-relative retained-evidence reads.
- `workflow-check.boundary.ts` owns workflow-provided file, JSON and SHA-256
  ingress through Effect FileSystem, Crypto and Schema.
- `inventory-credentials.boundary.ts` owns Alchemy state-store credential
  ingress. It distinguishes absent, malformed and unreadable inputs, rejects
  excess fields, keeps the bearer redacted and checks account identity before
  state construction.
- Each `workflow-*-check.runtime.ts` file decodes its Config Schema, calls the
  shared boundary and one typed verification program, logs safe fields through
  Effect Console, provides Bun services and executes once through
  `BunRuntime.runMain`.
- `workflow-evidence.schemas.ts`, `workflow-evidence.ts` and
  `workflow-evidence.runtime.ts` form one closed command with `bootstrap`,
  `plan`, `replan` and `provider` modes. It calculates shared tracked-file identities, reuses
  the beta.64 plan projection and provider inventory Schemas, decodes bounded
  Wrangler JSON, and encodes sanitised bootstrap, plan, provider and GitHub
  output files. Its only child process is fixed `git ls-files`; it cannot choose
  or run Alchemy, Wrangler, GitHub or another executable.
- `inventory.runtime.ts` is the provider/state readback composition owner. It
  remains read-only unless a separately authorized workflow owns mutation.
- `strict-boundaries.policy.ts` checks the named application and deployment
  adapters for ambient host access, raw concurrency, lost workflow/credential
  boundaries and unmanaged docs runtime state.
- Root `alchemy.run.ts` owns the native
  `Cloudflare.Website.Vite("DocsWebsite")` resource. This directory does not
  build or spawn the docs app.
- `workflow-plan-projection.ts` is the single beta.64-bound host adapter for
  Alchemy's text plan output. It admits only the current native Website
  resource and fails closed on any other resource line.

The retired orphan classifier has no current workflow, command, Schema,
service, runtime or child-process boundary. Its immutable JSON receipts remain
historical evidence; they are not a contributor-lifecycle system.

The one remaining Promise host bridge is `apps/docs/src/server.ts`: TanStack's
Cloudflare `fetch` callback crosses into the app-owned `ManagedRuntime` through
`runPromise`. This is a framework adapter, not domain execution ownership.

## Local verification

```sh
bun run check:docs-deployment:types
bun run check:docs-deployment-tools:types
bun run test:docs-deployment
bun run check:docs-deployment
```

The focused tests cover Config and receipt boundaries, every workflow-evidence
mode, credential failures, account mismatch, plan/resource admission,
workflow identity, deterministic output encoding, secret-negative failures,
historical receipt classification and static adapter contracts. Root
`verification` invokes them once. These local commands do not dispatch
workflows, access providers, deploy, destroy, prove hosted behavior or grant
operational authority.
