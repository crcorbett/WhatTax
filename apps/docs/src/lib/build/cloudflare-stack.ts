import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export const docsCloudflareStackName = "TaxKitDocsCloudflare";
export const docsWorkerResourceId = "DocsWebsite";
export const docsWorkerCompatibilityDate = "2026-06-24";
export const docsWorkerCompatibilityFlags = ["nodejs_compat"] as const;
export const docsWorkerAssetOutputDirectory = "client";
export const docsWorkerAssetHeaders =
  "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n";
export const docsWorkerGeneratedMain = "index.js";

const PreviewStage = Schema.String.check(Schema.isPattern(/^pr-[1-9]\d*$/u));

const DocsDeploymentStage = Schema.Union([
  Schema.Literals(["prod"]),
  PreviewStage,
]).pipe(Schema.brand("taxkit/DocsDeploymentStage"));

export const decodeDocsDeploymentStage = (value: unknown) =>
  Schema.decodeUnknownEffect(DocsDeploymentStage)(value).pipe(
    Effect.mapError((error) => new Config.ConfigError(error)),
  );

export const docsWorkerObservability = {
  enabled: true,
  headSamplingRate: 1,
  logs: {
    enabled: true,
    headSamplingRate: 1,
    invocationLogs: true,
    persist: true,
  },
  traces: {
    enabled: false,
    headSamplingRate: 0,
    persist: false,
  },
} as const;
