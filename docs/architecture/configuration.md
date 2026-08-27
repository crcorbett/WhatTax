---
status: canonical
last_reviewed: 2026-08-28
source_of_truth: docs
confidence: medium
---

# Configuration

TaxKit configuration uses Effect `Config`, `ConfigProvider` and Schema.
Package-owned runtime contracts define reusable schemas. Apps compose those
schemas into runtime-specific configs and provide values from their own
environment sources.

## Ownership

Packages that own a runtime contract MUST export the reusable config Schema,
type and config fragments for that contract. If the package owns a public env
namespace, such as `SERVICE_*`, the package config fragment MUST own that
namespace too.

Apps MUST define runtime-specific config modules that compose package schemas
with app-local settings. Those modules own config sources such as process env
or Vite env, app-local defaults and runtime-specific provider selection. They
must not re-declare package-owned config keys or prefixes.

## Governed operator configuration

Doppler is the owner for TaxKit's operator-set credentials and their related
environment identities. It is not the owner for host-created values, GitHub
event data, Alchemy-generated state credentials or TaxKit evidence paths.

The current environment map is:

| Purpose | Config | Values |
| --- | --- | --- |
| Credentialed local docs development | `taxkit/dev` | Cloudflare account and development token |
| Trusted Quality and receipt reconciliation | `taxkit/ci` | Turbo team and token |
| Preview and exact-stage teardown | `taxkit/stg_preview` | Cloudflare account and Preview token |
| Production and rollback | `taxkit/prd` | Cloudflare account and Production token |

Ordinary API/web development, portless values, `CI`, GitHub refs and runner
paths, Playwright paths, `TAXKIT_WORKFLOW_*` inputs, `ALCHEMY_PROFILE` and
Alchemy's state-store bearer/encryption values remain with their current
owners. No unused fixed staging config exists.

Local credentialed commands use a fixed repository adapter, not ambient
selection or a committed `.doppler.yaml`. The adapter strips ambient Doppler
and governed provider values, passes `--no-read-env`, `--no-fallback`,
`--no-check-version` and an exact `--only-secrets` list, then starts Bun with
`--no-env-file`. Alchemy receives an intentionally empty dotenv file. The
developer login is scoped to this checkout and must be a system-keyring
reference verified by the pass/fail-only custody command.

GitHub's reviewed target uses read-only, expiring service tokens bound to one
config. The `ci` bridge is repository-scoped; Preview and Production provider
bridges live in their different protected environments. Workflows verify safe
Doppler project/config metadata and pass only named action outputs to exact
consumer steps. Exact-claim OIDC needs a successor review and is not a second
current path.

The local, Quality, receipt, Preview and teardown repository source paths are
implemented. Preview and teardown select only `taxkit/stg_preview`; Preview
selects `taxkit/ci` separately for the two provider-free Turbo consumers, while
teardown stays local-cache-only and cannot fetch `ci`. Production still uses
its retained direct GitHub environment values until DCG-004 is accepted.

The TaxKit Doppler project/configs and GitHub bridges do not yet exist, so no
hosted fetch is claimed. Creating them remains a separately approved operation.
No implemented workflow silently falls back between Doppler and a direct
legacy value.

## Pattern

Package exports schema, type and a config fragment:

```ts
import { Config, Schema } from "effect";

export const ServiceConfigSchema = Schema.Struct({
  baseUrl: Schema.URLFromString,
});

export type ServiceConfig = Schema.Schema.Type<typeof ServiceConfigSchema>;

export interface ServiceConfigFragment {
  readonly service: ServiceConfig;
}

export const ServiceConfigFragment = {
  service: Config.schema(ServiceConfigSchema),
} satisfies Config.Wrap<ServiceConfigFragment>;

export const ServiceServerEnvConfigFragment = {
  service: Config.schema(ServiceConfigSchema).pipe(Config.nested("SERVICE")),
} satisfies Config.Wrap<ServiceConfigFragment>;

export const ServiceViteEnvConfigFragment = {
  service: Config.schema(ServiceConfigSchema).pipe(
    Config.nested("VITE_SERVICE")
  ),
} satisfies Config.Wrap<ServiceConfigFragment>;
```

App composes package config fragments into app config:

```ts
import { ServiceServerEnvConfigFragment } from "@owner/service/config";
import { Config } from "effect";

export const AppServerConfig = Config.all({
  ...ServiceServerEnvConfigFragment,
});
```

Runtime module provides values through a runtime source and generic naming
convention:

```ts
import { ConfigProvider } from "effect";

export const AppServerConfigProviderLive = ConfigProvider.layer(
  ConfigProvider.fromEnv().pipe(ConfigProvider.constantCase)
);
```

This maps a schema key such as `baseUrl` to `SERVICE_BASE_URL`.

For Vite client env, use the same Effect env provider shape over
`import.meta.env`:

```ts
export const AppClientConfigProviderLive = ConfigProvider.layer(
  ConfigProvider.fromEnv({ env: import.meta.env }).pipe(
    ConfigProvider.constantCase
  )
);
```

When composed with `ServiceViteEnvConfigFragment`, this maps `baseUrl` to
`VITE_SERVICE_BASE_URL`.

## Guardrails

- MUST export schemas, types and keyed config fragments from package config
  entrypoints.
- Package config fragments MUST own package-specific config namespaces and env
  prefixes such as `SERVICE` or `VITE_SERVICE`.
- MUST compose package schemas from app-owned `config.server.ts` and
  `config.client.ts` modules when runtime values differ. Apps should spread
  package config fragments instead of re-declaring package-owned keys or
  prefixes.
- Apps SHOULD use `ConfigProvider.constantCase` at the runtime provider source
  when env names follow a screaming-snake convention.
- Avoid custom `ConfigProvider.mapInput` functions when package-owned
  `Config.nested(...)` fragments and app-level `constantCase` express the
  mapping.
- Do not export package `Config` values that hard-code app-specific env names;
  package-owned env namespaces are allowed and should live with the package
  config fragment.
- Keep one-off config error transformation inline at the runtime callsite.
- Use Effect `Config`, `ConfigProvider`, `Schema`, `Layer` and platform
  runtime primitives for configuration. Do not parse `process.env` or
  `import.meta.env` by hand when an Effect config/schema composition can own
  the shape.
- Provider credentials and other semantic values use owner-named Schemas with
  `Config.schema`; use `Schema.Redacted` or `Schema.RedactedFromValue` according
  to the actual ingress representation. Do not expose primitive config values
  through service APIs or unwrap secrets before final adapter construction.
- Do not use Doppler fallback files, Bun or Alchemy `.env` loading, raw token
  command arguments, broad GitHub secret injection, or `doppler configure
  debug` for governed commands.

## Related Docs

- [Effect services](./effect-services.md)
- [Package ownership](./package-ownership.md)
- [API and SDK](./api-and-sdk.md)
- [Frontend](./frontend.md)
