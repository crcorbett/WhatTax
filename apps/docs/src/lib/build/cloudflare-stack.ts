import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { DocsDeploymentStage } from "./docs-deployment-stage.js";

export const docsCloudflareStackName = "TaxKitDocsCloudflare";
export const docsWorkerResourceId = "DocsWebsite";
export const docsWorkerCompatibilityDate = "2026-06-24";
export const docsWorkerCompatibilityFlags = ["nodejs_compat"] as const;

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
