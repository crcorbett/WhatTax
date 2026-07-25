---
status: canonical
last_reviewed: 2026-07-25
source_of_truth: package-root
confidence: high
---

# @taxkit/docs-fumadocs

## Scope

This private compiled package owns the narrow reusable Fumadocs boundary:
shared MDX compile configuration, generic source representation Schemas, safe
tagged source errors, the named `FumadocsSource` Effect service, its
generated-loader live Layer factory, deterministic test Layer and the generic
render primitives used by the docs app.

It does not own TaxKit frontmatter, navigation, content roots, generated
collection locations, routes, app layout or runtime execution.

## Exports

| Export | Use |
| --- | --- |
| `@taxkit/docs-fumadocs/config` | Build-time shared `fumadocs-mdx` and Effect Schema bridging. |
| `@taxkit/docs-fumadocs/schemas` | Generic decoded page and code-block representations. |
| `@taxkit/docs-fumadocs/errors` | Safe generic lookup and source-load errors. |
| `@taxkit/docs-fumadocs/service` | Named `getPage` and `listPages` service contract. |
| `@taxkit/docs-fumadocs/live` | One generated-collection adapter at Layer construction. |
| `@taxkit/docs-fumadocs/test` | Deterministic decoded fixture Layer. |
| `@taxkit/docs-fumadocs/render` | Browser-safe generic picture and code-block primitives. |

The live Layer is the only boundary that accepts generated-provider
representations. It wraps provider throws and promises, decodes each value
through the package Schemas and exposes only canonical service values and safe
tagged errors. Consumers call named service operations; they do not pass
callbacks or receive raw provider pages.

## Build ordering

`source`, `types` and `default` package conditions point to source and compiled
artifacts explicitly. Direct docs-content generation/tests, docs app
types/build and both Knip commands build this package first so config loading
never depends on stale pre-existing `dist`.

```txt
bun run --filter=@taxkit/docs-fumadocs test
bun run --filter=@taxkit/docs-fumadocs check-types
bun run --filter=@taxkit/docs-fumadocs build
```

The package defines services and Layers only. It does not construct an
application runtime or execute Effects.

## Related docs

- `docs/product-specs/docs-application-architecture.md`
- `docs/architecture/content-and-posts.md`
- `docs/architecture/package-ownership.md`
- `docs/architecture/package-boundaries.md`
- `docs/architecture/effect-services.md`
