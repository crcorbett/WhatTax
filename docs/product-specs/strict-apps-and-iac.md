---
document_type: product-spec
lifecycle: active
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-13
review_trigger: APP-IAC task state, installed dependency version, runtime boundary, enforcement, proof, or exception change
successor: null
tombstone: false
---

# Strict apps and IaC

## Overview

TaxKit's documentation app and Alchemy/Cloudflare tooling already deliver a
working end-to-end architecture. This successor hardens its internal
boundaries without reopening the completed deployment project or changing the
resource graph.

The accepted audit found four root corrections: workflow verifier executables
still use untyped host primitives; deployment inventory still manually parses
credential and process boundaries; docs runtime proof instrumentation owns
mutation and randomness outside Effect; and repository enforcement did not
prevent those patterns. The structured source is
[`accepted-findings.json`](../documentation-audit/strict-apps-iac/accepted-findings.json).

Implementation follows
[`strict-apps-and-iac.tasks.json`](./strict-apps-and-iac.tasks.json) and the
[active execution plan](../exec-plans/active/strict-apps-and-iac.md).

## Outcome

The apps and deployment-tooling surface must have:

- one Schema decode at each unknown or representation ingress
- closed tagged errors through internal Effect programs
- Config-owned environment and redacted secret handling
- platform services for filesystem, process, console, time, randomness,
  concurrency and resource lifetime
- one application-owned runtime with narrow TanStack, Bun and Alchemy host
  adapters
- deterministic failure and lifetime tests
- secret-negative structured diagnostics and claim-matched receipts
- a focused executable control that prevents the accepted defects from
  recurring
- a terminal audit with every residual recorded as a named, bounded, tested
  exception

## Exact baseline and source authority

The audited target is clean `origin/main` commit
`fa60c88ccc0429d8eef465d71a624e36c4ca093c`.

Installed versions at that target are:

| Surface | Exact installed version |
| --- | --- |
| Bun | `1.3.14` |
| Effect, Platform and Vitest integration | `4.0.0-beta.100` |
| Effect language service | `0.87.0` |
| Alchemy | `2.0.0-beta.64` |
| Cloudflare Vite plugin | `1.47.0` |
| Wrangler | `4.114.0` |
| TanStack React Start | `1.167.65` |
| TanStack React Router | `1.169.2` |
| Fumadocs core | `16.9.3` |
| Fumadocs MDX | `14.3.2` |
| Vite | `8.0.11` |

Installed package source and types are authoritative for every implementation
call. An inspected Effect v4 source checkout at revision
`1caab3cc30f626efbf15e59d74f539a487e5c85c`, package version
`4.0.0-beta.93`, provides version-qualified trajectory evidence only. An
available Effect v3 checkout was explicitly rejected. DeepWiki guidance for
Effect-TS/effect and alchemy-run/alchemy was consulted on 2026-08-13, but
cannot override pinned beta.100 or beta.64 source.

No implementation may use Effect v3 guidance.

## Problem

The current root Alchemy composition is intentionally small and the docs app
owns one ManagedRuntime. Those foundations should remain. The problem is in
adjacent executable and proof boundaries:

- workflow verifiers read `process.env`, use `Bun.file`, `JSON.parse`, raw
  promises, async callbacks, thrown errors, string failures and manual console
  execution
- inventory credential fallback conflates absence and invalidity through
  `null`/`undefined` and performs manual JSON parsing
- the orphan inventory live service reads ambient environment below its
  composition boundary and retains representation-level process handling
- runtime proof identity uses module mutation and global random UUID generation
  without an Effect service or deterministic test seam
- existing general lint and tests accepted all of the above

This matters because these tools own evidence and authority boundaries. A
proof command must fail through a typed, safe, inspectable channel before its
claim is trusted.

## Call graphs

```text
Current workflow verifier

process.env + Bun.file + JSON.parse
  -> raw Promise/async orchestration
    -> Schema decode mixed with host failures
      -> string error / console / process.exitCode
```

```text
Target workflow verifier

Bun executable host
  -> BunRuntime.runMain
    -> Config.schema ingress
      -> platform FileSystem/Path/Crypto services
        -> Schema decodeUnknownEffect
          -> typed verification Effect
            -> Console with secret-negative tagged errors
```

```text
Target docs server

TanStack fetch callback
  -> application-owned runtime adapter
    -> server handler Effect/program boundary
      -> runtime probe service with managed identity/state
        -> Schema-safe proof headers
```

```text
Preserved Alchemy composition

Alchemy.Stack
  -> Stage service
    -> Schema-decoded DocsDeploymentStage
      -> one app-owned Command.Build
        -> one prebuilt Cloudflare.Worker
          -> typed outputs
```

## Requirements

### `AIR-001` — workflow verification boundary

All five workflow verifier executables must decode a single Config-owned input
contract, use Effect platform services for files and executable concerns,
decode receipt JSON with owning Schemas, model closed tagged errors, and use
`BunRuntime.runMain` as the only final host execution seam. Screenshot byte
proof must use Effect-managed concurrency and preserve exact ordered identity.

### `AIR-002` — inventory, credentials and child processes

The inventory executable and orphan-source live Layer must distinguish absent,
malformed, account-mismatched and valid credential inputs without null
sentinels or secret output. Environment is decoded at composition and injected
as typed values. Process stdout, stderr, exit, UTF-8 and JSON are restored once
at the adapter. Semantic membership uses an Effect collection where it carries
domain meaning. Inventory remains report-only.

### `AIR-003` — docs runtime ownership

The docs application must continue to own one ManagedRuntime while moving
proof identity and mutable lifetime state behind an application-owned Effect
service or explicit managed construction value. Randomness and state must be
injectable and deterministic in tests. TanStack callbacks remain narrow
adapters; route, SSR, hydration and server-function transport remain unchanged.

### `AIR-004` — recurrence prevention

After the root corrections, add the smallest stable focused rule or
architecture test that rejects the evidenced anti-patterns in governed app and
deployment runtime source. It must include adversarial valid and invalid
fixtures, avoid broad textual false positives, and name any unavoidable host
adapter exception with owner, reason and proof.

### `AIR-005` — terminal audit and closeout

Re-audit apps, Alchemy composition, workflow/inventory tooling, package
exports, configuration, tests and owning docs from the final candidate. Every
accepted finding must have task evidence. Any residual must be a named,
bounded, tested exception with carrying cost, review trigger and retirement
condition. Run the full repository gates and reconcile lifecycle owners in the
same slice.

## Preserve

- Keep `alchemy.run.ts` thin; do not introduce a generic IaC framework or
  provider wrapper.
- Keep the current Worker/assets resource graph, stage naming, remote-state
  semantics, observability policy, package versions and deployment commands.
- Keep `packages/docs-content` and `packages/docs-fumadocs`
  deployment-neutral.
- Keep route loaders, route-root restoration, Schema-encoded Exit transport,
  SSR, hydration and client navigation contracts.
- Keep completed DCD evidence immutable and historical.
- Keep report-only inventory separate from mutation authority.

## Non-goals

- No Preview, Production, rollback, teardown or provider mutation.
- No domain, DNS, custom-hostname or account-policy changes.
- No package versioning, publication, tag or release.
- No visual redesign, docs information-architecture change or public-copy
  expansion.
- No Effect, Alchemy, TanStack, Fumadocs, Cloudflare or Vite upgrade in this
  SPEC.
- No mechanical replacement of every array, object, string, promise or host
  API where it does not own semantics.
- No copied checkout path or reference-repository identity in durable files.

## Error and observability contract

Internal programs expose closed `Schema.TaggedError` families by operation.
Boundary diagnostics may include stable operation, target, stage and receipt
identity, but never credential values, authorization headers, state payloads,
raw provider error bodies or unrestricted process output. Defects remain
distinguishable as configuration, file, decoding, process, identity,
verification or internal defects. Expected failures do not become defects and
defects are not silently collapsed into expected failures.

## Testing and proof

Each slice runs its focused types and tests before root verification. Required
evidence includes:

- malformed/missing Config and receipt inputs
- missing/unreadable/malformed files and screenshot bytes
- deterministic concurrency and ordered screenshot digest comparison
- absent, malformed, account-mismatched and valid credentials
- child-process spawn, exit, UTF-8 and JSON failures
- stable runtime construction and isolate identity under injected randomness
- SSR, hydration, client navigation, server-function, 404 and console-clean
  docs journeys
- adversarial enforcement fixtures
- exact package/export/config checks and a fresh terminal source audit

Proof remains layered: local static checks do not prove built behavior; built
and browser checks do not prove hosted behavior; historical hosted receipts do
not prove current provider state.

## Documentation impact ledger

- **Change required:** this SPEC, sibling tasks, active plan, structured audit,
  validation receipts and lifecycle indexes.
- **Change required:** `tools/docs-deployment/README.md`, deployment
  architecture, frontend runtime architecture and testing/quality guidance
  where implementation changes their owned contract.
- **Change required:** exact tests, verification routing and exceptions earned
  by implementation.
- **Preserve:** completed deployment SPEC/plan/receipts, runbook authority and
  command procedures unless a direct invocation change is proven.
- **Preserve:** public docs content and Fumadocs/content package ownership.
- **N/A:** Changeset unless an app/package-facing runtime or exported behavior
  changes; each task records the evidence-backed decision.
- **N/A:** external deployment, provider, registry, release, DNS and hosted-CI
  receipts.

## Completion criteria

The SPEC is complete only when APP-IAC-001 through APP-IAC-005 are complete,
the structured crosswalk and terminal audit agree, focused and repository-wide
verification pass from the final candidate, owning documentation is current,
and no unnamed strictness exception remains. Completion does not establish any
external state.
