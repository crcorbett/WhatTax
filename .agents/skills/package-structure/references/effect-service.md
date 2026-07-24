# Effect service rules

Use the installed Effect version and repository exemplars. For Effect v4:

- Define application capabilities with `Context.Service`.
- Keep live/test Layers in implementation subpaths.
- Use `Schema.decodeUnknownEffect` immediately for unknown provider output.
- Use `Config.schema` for meaningful configuration and redact secrets.
- Map expected failures into tagged application errors without runtime
  class-identity branching. Preserve useful safe context and causes.
- Put retry, timeout, concurrency, interruption, and resource scope at the
  operation or adapter that owns them.
- Keep `Effect.runPromise`/runtime execution at application, framework, CLI, or
  adapter boundaries.

Reject these API shapes:

- generic `use`, `run`, or `withClient` callbacks over an SDK;
- a raw-client accessor or unconstrained generic result;
- raw `id: string` when an owning brand exists;
- manually threaded primitive config when an owning Config Schema exists;
- pass-through readers/mappers/forwarders used once;
- provider DTOs returned before decoding.

One readable generator is not automatically monolithic. Extract only stable
policy, demonstrated reuse, I/O, or resource lifetime.
