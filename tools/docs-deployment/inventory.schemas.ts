import { Schema } from "effect";

import { DocsDeploymentStage } from "../../apps/docs/src/lib/build/docs-deployment-stage.js";

const DocsDeploymentLogicalResourceId = Schema.Literals([
  "DocsBuild",
  "DocsWebsite",
]).pipe(Schema.brand("taxkit/DocsDeploymentLogicalResourceId"));

const DocsDeploymentWorkerName = Schema.NonEmptyString.pipe(
  Schema.brand("taxkit/DocsDeploymentWorkerName")
);

const DocsDeploymentWorkerUrl = Schema.URLFromString.pipe(
  Schema.brand("taxkit/DocsDeploymentWorkerUrl")
);

export const PersistedDocsDeploymentResource = Schema.Struct({
  attr: Schema.optional(Schema.Unknown),
  fqn: Schema.NonEmptyString,
  instanceId: Schema.NonEmptyString,
  logicalId: DocsDeploymentLogicalResourceId,
  resourceType: Schema.Literals(["Command.Build", "Cloudflare.Worker"]),
  status: Schema.NonEmptyString,
});

export const PersistedDocsWorkerAttributes = Schema.Struct({
  tags: Schema.optional(Schema.Array(Schema.NonEmptyString)),
  url: DocsDeploymentWorkerUrl,
  workerName: DocsDeploymentWorkerName,
});

export const ProviderDocsWorker = Schema.Struct({
  tags: Schema.optional(Schema.Array(Schema.NonEmptyString)),
  workerName: DocsDeploymentWorkerName,
});

const InventoryResource = Schema.Struct({
  instanceId: Schema.NonEmptyString,
  logicalId: DocsDeploymentLogicalResourceId,
  resourceType: Schema.Literals(["Command.Build", "Cloudflare.Worker"]),
  status: Schema.NonEmptyString,
  workerName: Schema.optional(DocsDeploymentWorkerName),
  workerUrl: Schema.optional(DocsDeploymentWorkerUrl),
});

const InventoryStage = Schema.Struct({
  resources: Schema.Array(InventoryResource),
  stage: DocsDeploymentStage,
});

const InventoryProviderWorker = Schema.Struct({
  logicalId: DocsDeploymentLogicalResourceId,
  stage: DocsDeploymentStage,
  workerName: DocsDeploymentWorkerName,
});

export const DocsDeploymentInventoryReport = Schema.Struct({
  agreement: Schema.Literal("state-provider-agree"),
  nonClaims: Schema.NonEmptyArray(Schema.NonEmptyString),
  providerWorkers: Schema.Array(InventoryProviderWorker),
  stack: Schema.Literal("TaxKitDocsCloudflare"),
  stages: Schema.Array(InventoryStage),
  stateStore: Schema.Struct({
    id: Schema.NonEmptyString,
    version: Schema.Int.check(Schema.isGreaterThanOrEqualTo(1)),
  }),
});

export type DocsDeploymentInventoryReport =
  typeof DocsDeploymentInventoryReport.Type;

export class DocsDeploymentInventoryInputError extends Schema.TaggedErrorClass<DocsDeploymentInventoryInputError>()(
  "DocsDeploymentInventoryInputError",
  {
    target: Schema.NonEmptyString,
  }
) {}

export class DocsDeploymentInventoryReadError extends Schema.TaggedErrorClass<DocsDeploymentInventoryReadError>()(
  "DocsDeploymentInventoryReadError",
  {
    operation: Schema.NonEmptyString,
  }
) {}

export class DocsDeploymentInventoryDisagreementError extends Schema.TaggedErrorClass<DocsDeploymentInventoryDisagreementError>()(
  "DocsDeploymentInventoryDisagreementError",
  {
    findings: Schema.NonEmptyArray(Schema.NonEmptyString),
  }
) {}
