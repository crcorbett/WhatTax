---
name: effect-client-wrapper
description: Design, implement, or review a typed Effect service around a third-party SDK, API client, callback library, or Promise-based provider. Use for provider adapters, service Layers, external-client configuration, request and response Schemas, typed provider errors, retries, and test Layers. Enforce named operations, branded identifiers, Schema-backed Config, immediate output decoding, flat Effects, and the explicit rejection of generic use callbacks, raw clients, primitive config, instanceof, and unchecked SDK outputs.
---

# Effect Client Wrapper

Create a semantic adapter owned by the application, not a generic Effect-shaped escape hatch around an SDK.

## Establish the boundary

1. Read applicable repository instructions, architecture docs, lint rules, installed Effect and SDK versions, and representative services and Layers.
2. Identify the owner of every request, response, identifier, configuration value, error, retry policy, and runtime boundary.
3. Use DeepWiki through Executor MCP only for the upstream Effect or SDK repository. Reconcile it with installed types and local conventions.
4. Prefer extending an existing semantic adapter over creating a parallel client abstraction.

## Define the public service

- Expose named domain/provider operations such as `getCustomer`, `sendMessage`, or `renderImage`.
- Accept owning Schema-derived inputs and branded identifiers. Never substitute raw `id: string`.
- Return only decoded application-owned or explicitly provider-owned Schema types.
- Keep the raw SDK instance private to the live Layer or adapter module.
- Provide a live Layer and a mock/test Layer at the same service contract.

Do not expose a generic `use`, `run`, `withClient`, callback, unconstrained generic result, or raw-client accessor. Those APIs erase operation ownership, output provenance, retry policy, and testability.

## Implement each operation linearly

Use the locally installed Effect APIs. A named operation should read as one flat program:

1. validate or encode the typed request at the outbound boundary;
2. call exactly one SDK operation through `Effect.tryPromise`, callback adaptation, or the repository's boundary primitive;
3. map rejection immediately into an owner-named typed Schema error with safe diagnostics;
4. decode the unknown SDK result immediately with the owning output Schema;
5. apply operation-specific retry, timeout, tracing, metrics, and redaction policy;
6. return the decoded value without another wrapper layer.

Use `Effect.gen`, meaningful `Effect.fn`, or local equivalents for readable sequential work. Keep one-use request mapping, rejection mapping, and decoding beside the operation. Extract only demonstrated reuse, stable domain policy, or a real I/O boundary.

## Configure safely

- Model semantic configuration with Schema and `Config`/`ConfigProvider`, using the repository's supported API.
- Give configuration an owner-named structure rather than passing independent primitive strings and numbers through the codebase.
- Keep secrets redacted and unwrap them only for immediate SDK construction.
- Construct the SDK once in the live Layer unless its documented lifecycle requires scoped acquisition and release.
- Override configuration in tests through a test `ConfigProvider` or the repository's established Layer mechanism.

## Model failures explicitly

- Use owner-named Schema-tagged errors for expected configuration, transport, rate-limit, authentication, provider, and decode failures when those distinctions affect callers.
- Preserve safe provider codes, operation names, retryability, and diagnostic context; do not place unchecked `unknown` payloads in public tagged errors.
- Use tagged catches or pattern matching. Never use `instanceof` for provider-error policy.
- Treat truly unexpected failures as defects only when callers cannot reasonably recover.

## Test and enforce

Test service operations through mock/test Layers and test the live adapter boundary narrowly. Cover success, request encoding, provider rejection mapping, output decode failure, redaction, timeout/retry policy, and non-idempotent retry exclusion.

Update affected architecture docs, READMEs, lint/custom rules and fixtures, CI commands, SPEC/tasks, and repository-owned skills. Add the narrowest reliable static or stale-pattern check the repository supports.

Acceptance requires zero examples or public APIs containing:

- a generic SDK `use` callback or raw-client accessor;
- a raw `id: string` where an owning branded ID exists;
- primitive/manual semantic configuration in place of Schema-backed `Config`;
- `instanceof` provider-error branching;
- an SDK result escaping without immediate Schema decoding;
- a one-use wrapper/helper that merely forwards, maps, reads one property, or hides the SDK call.

Run the repository's actual format, lint, typecheck, test, build, boundary, skill-validation, and stale-pattern checks appropriate to the change. Do not invent commands or claim the wrapper is safe when any prohibited pattern remains.
