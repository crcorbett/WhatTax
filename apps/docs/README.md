---
status: canonical
last_reviewed: 2026-07-25
source_of_truth: app-root
confidence: high
---

# Docs app

This private TanStack Start app renders the public TaxKit developer
documentation.

It owns routes, the app shell, navigation presentation, app-local MDX component
composition and browser rendering. It does not own canonical docs schemas,
validation policy or generated Fumadocs source access; those live in
`@taxkit/docs-content`. Reusable Fumadocs integration lives in
`@taxkit/docs-fumadocs`.

## Content root

Public MDX content lives in:

```txt
packages/docs-content/content
```

Each top-level section owns an `index.mdx` file. Later content tasks can add
child pages below the matching section directory.

## Navigation contract

The public docs navigation is defined in:

```txt
packages/docs-content/navigation.json
```

The required top-level sections are:

- Start
- SDK
- API
- Guides
- Concepts
- Contributing
- Reference

The navigation file is the source of truth for sidebar order until a docs
runtime owns a generated or typed navigation API. It is decoded and validated
by `@taxkit/docs-content`.

## Runtime graph

```ts
Production: docs page

browser
  -> TanStack route loader
    -> createServerFn
      -> dynamic .server module
        -> one app-owned ManagedRuntime
          -> DocsContentService
            -> @taxkit/docs-content live layer
              -> @taxkit/docs-fumadocs FumadocsSource
              -> TaxKit generated collection adapter
              -> packages/docs-content/.source/server
              -> schema-decoded navigation.json representation
        -> schema-encoded Exit representation
    -> TanStack SSR hydration or client-navigation transport
      -> direct route-root restore and Result match
        -> @taxkit/docs-content/client
          -> Fumadocs compiled MDX module
        -> @taxkit/docs-fumadocs/render
        -> app-local MDX component map
```

## Commands

```txt
bun run --filter=docs dev
bun run --filter=docs check-import-boundaries
bun run --filter=docs test
bun run --filter=docs test:browser
bun run --filter=docs test:built
bun run --filter=docs test:cloudflare-built
bun run --filter=docs build:cloudflare
bun run --filter=docs check-types
bun run --filter=docs build
bun run --filter=docs preview
bun run --filter=@taxkit/docs-content check-examples
bun run docs:validate
```

`@taxkit/docs-content` `check-types` includes `check-examples`, so the
package-owned public examples stay connected to current SDK/API/calculator
exports.

Run `build` before `preview`. Turbo orders the package-owned content build
before the app, while a direct Vite app build regenerates the same package-owned
source through `source.config.ts`; both paths compile
`@taxkit/docs-fumadocs/config` first. `dev` and `preview` expose the app through
`https://docs.taxkit.localhost` with portless.

`test:browser` runs the programmatic TanStack client-route harness in Chromium.
It proves success, expected failures, malformed transport and framework error
boundaries after `Route.useLoaderData`; it does not prove SSR or hydration. Use
the built app for initial SSR, hydration and real client-navigation proof.

`test:built` builds the production app and executes the generated Nitro/Vercel
function plus static assets through a command-owned ephemeral local server. It
asserts a known page in the HTTP response before browser JavaScript, hydration
without warnings or errors, real sidebar and authored-MDX client transitions
with zero document requests, browser back/forward, heading focus without
stealing initial-hydration focus, pending state, framework-native client
not-found behavior and a direct HTTP 404. It also checks the skip link,
landmarks, labelled/current navigation, mobile disclosure, representative
contrast and reduced-motion rendering. The command owns browser/server cleanup.
Add `-- --screenshots` for the bounded provisional DAR-013 PNG/manifest set;
final evidence additionally supplies the exact candidate with
`--candidate=<full-candidate-commit>`. Screenshot review supplements these
behavioral assertions and cannot prove request type, focus behavior, contrast,
motion suppression, HTTP status, hydration or console cleanliness.

`build:cloudflare` selects the exact official Cloudflare Vite adapter and emits
the deployable no-bundle Worker at `dist/server/index.js` plus `dist/client`
assets. `test:cloudflare-built` rebuilds that target, strips provider
credentials from the child environment, performs a Wrangler dry-run, and runs
an isolated output-only copy under real workerd. It reuses the built-app
behavioral contract for SSR, assets, server functions, 404, hydration,
no-document navigation, accessibility and console cleanliness, and adds
concurrent-isolate, filesystem, binding, compressed-upload-size, local
readiness-timing and immutable asset-header oracles. The local timing is not a
Cloudflare CPU-startup-limit receipt. The exact verified invocation is:

```sh
bun run --filter=docs test:cloudflare-built
```

This is local workerd evidence only. It does not prove Alchemy state, a
Cloudflare deployment, a `workers.dev` URL, Preview, Production or rollback.
The Nitro `test:built` path remains an independent migration oracle until the
accepted deployment SPEC retires it.

Root `alchemy.run.ts` composes the same output through public Alchemy
`Command.Build` and `Cloudflare.Worker({ bundle: false })`. `apps/docs` owns
the build target and asset headers; root owns provider composition and
Alchemy owns the physical Worker name. `.wrangler/**` and `dist/**` are
ignored generated proof/build output and are never deployment receipts.

`check-import-boundaries` rejects server-only content, service, generated-source
and runtime imports from browser-reachable app modules. The docs app has no
browser Effect runtime. Its `.server.ts` loader module is the only route edge
that acquires `DocsContentService`, and the module-scoped server runtime is
reused for the server isolate. The runtime factory exposes disposal so focused
tests and future host lifecycle integration can release its Layer; the current
hosting adapter does not provide an application shutdown hook.

The Worker entry accepts the exact
`x-taxkit-docs-runtime-proof: construction-count` opt-in header and returns a
non-secret construction count plus random isolate identifier. This temporary
deployment-migration channel proves reuse across requests; it is not a public
API. Review it when the runtime, Worker entry, privacy boundary or proof
channel changes. Retire it after an equally strong non-public provider oracle
exists; otherwise retain its bounded one-identifier/two-header carrying cost
explicitly through migration parity.

The app-local MDX adapter classifies root-relative, query-only and authored
relative `.mdx` destinations as TanStack routes while keeping external,
protocol-relative, mail, download, repository-source and same-document
destinations as anchors. It removes an authored `.mdx` suffix before any query
or fragment without changing either suffix. Sidebar, home and MDX route links
set one app-owned navigation-focus intent; the destination heading consumes it
after a client transition. Initial hydration does not set that intent. The
route container owns responsive navigation state and retry commands; render
leaves receive readonly values and callbacks and do not acquire services or
execute runtimes.

## Authoring rules

Before writing or reviewing public docs, read:

- [Documentation style](../../docs/standards/documentation-style.md)
- [Documentation writing](../../docs/standards/documentation-writing.md)
- [Documentation templates](../../docs/standards/documentation-templates.md)
- [Documentation review](../../docs/standards/documentation-review.md)
- [Documentation architecture](../../docs/standards/documentation-architecture.md)
- [Documentation user journeys](../../docs/standards/documentation-user-journeys.md)

Use the matching template and user journey for each page. If a repeated page
shape does not have a template, add the template before writing more pages in
that shape.

The required frontmatter `status` is schema-validated. `draft` means authored,
locally renderable, visibly labelled candidate content, not accepted-current
truth, publication, deployment, availability, accuracy, or user visibility.
`published` means explicitly accepted current public documentation, still not
runtime or external availability proof. Preserve draft pages unless explicit
page-level acceptance records their transition. `bun run check:docs` enforces
status representation and path ownership without asserting external state.

## Validation graph

```ts
Tests: docs runtime

docs change
  -> @taxkit/docs-content validate
    -> frontmatter and navigation schemas
    -> local links and allowed MDX components
    -> example and OpenAPI reference checks
  -> @taxkit/docs-content check-examples
    -> TypeScript example compilation
  -> docs build
    -> TanStack Start and Fumadocs rendering
```

## Guardrails

- Do not import raw `packages/docs-content/content` files from route loaders.
- Do not import `@taxkit/docs-content/server` or generated `.source/server`
  modules from browser code.
- Do not statically import content services, live Layers or the server runtime
  from browser-reachable route modules. Keep execution behind the app-owned
  `.server.ts` server-function implementation.
- Do not add a browser Effect runtime. Browser routes restore the encoded
  transport value and render canonical values.
- Keep app-specific MDX components in `src/lib/mdx/components.tsx`.
- Use TanStack `Link` for internal docs routes so navigation runs the client
  loader and server-function RPC. Use ordinary anchors for external URLs.
- Keep browser boundary tests programmatic. Do not add production test routes.
- Keep direct loader restoration and top-level `Result` matching in the route
  root. Compose semantic page landmarks route-high, and pass focused readonly
  values and callbacks to section and leaf components.
- Keep local presentation commands in leaves. Remote or domain commands remain
  with the route action or nearest policy-owning container.
- Put loading, empty and recoverable error UI at the smallest owning boundary
  and preserve constrained component footprints.
- Put generic Fumadocs primitives in `@taxkit/docs-fumadocs` only when they
  are reusable outside this app.
- Use [Documentation style](../../docs/standards/documentation-style.md) and
  the related standards suite before writing or reviewing public docs.
- Apply [Abstraction
  admission](../../docs/design-docs/abstraction-admission.md) before adding a
  shared hook, provider, component family or package.
