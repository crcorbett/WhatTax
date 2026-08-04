import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

const DocsBuildTarget = Schema.Literals(["nitro", "cloudflare"]);

export const docsBuildTargetConfig = Config.schema(
  Schema.String,
  "TAXKIT_DOCS_BUILD_TARGET"
).pipe(
  Config.withDefault("nitro"),
  Config.mapOrFail((value) =>
    Schema.decodeUnknownEffect(DocsBuildTarget)(value).pipe(
      Effect.mapError((error) => new Config.ConfigError(error))
    )
  )
);
