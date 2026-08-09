import { Schema } from "effect";

import { DocsDeploymentStage } from "../../apps/docs/src/lib/build/docs-deployment-stage.js";

const CommitSha = Schema.String.check(Schema.isPattern(/^[a-f0-9]{40}$/u));
const Sha256 = Schema.String.check(Schema.isPattern(/^[a-f0-9]{64}$/u));
const ProviderIdentity = Schema.String.check(
  Schema.isPattern(/^[A-Za-z0-9._:/-]+$/u)
);
const WorkersDevUrl = Schema.String.check(
  Schema.isPattern(/^https:\/\/[^/]+\.workers\.dev\/?$/u)
);

export const DeploymentWorkflowProviderReadback = Schema.Struct({
  acceptedPlanSha256: Sha256,
  candidateCommit: CommitSha,
  configSha256: Sha256,
  deploymentId: ProviderIdentity,
  deploymentInputSha256: Sha256,
  lockfileSha256: Sha256,
  schemaVersion: Schema.Literal(1),
  stage: DocsDeploymentStage,
  url: WorkersDevUrl,
  versionId: ProviderIdentity,
  workerName: ProviderIdentity,
});
export type DeploymentWorkflowProviderReadback =
  typeof DeploymentWorkflowProviderReadback.Type;

const WorkflowScreenshot = Schema.Struct({
  kind: Schema.Literals(["desktop", "mobile"]),
  path: Schema.String.check(
    Schema.isPattern(
      /^docs\/evidence\/deployments\/(?!.*\.\.(?:\/|$))[A-Za-z0-9._/-]+$/u
    )
  ),
  sha256: Sha256,
  viewport: Schema.Struct({
    deviceScaleFactor: Schema.Number,
    height: Schema.Int,
    width: Schema.Int,
  }),
});

export const DeploymentWorkflowHostedProbe = Schema.Struct({
  acceptedPlanSha256: Sha256,
  candidateCommit: CommitSha,
  deploymentId: ProviderIdentity,
  diagnostics: Schema.Array(Schema.String),
  screenshots: Schema.Tuple([WorkflowScreenshot, WorkflowScreenshot]),
  stage: DocsDeploymentStage,
  url: WorkersDevUrl,
  versionId: ProviderIdentity,
  workerName: ProviderIdentity,
});
export type DeploymentWorkflowHostedProbe =
  typeof DeploymentWorkflowHostedProbe.Type;

export const DeploymentWorkflowTeardownReadback = Schema.Struct({
  candidateCommit: CommitSha,
  configSha256: Sha256,
  deploymentInputSha256: Sha256,
  lockfileSha256: Sha256,
  providerWorkerAbsent: Schema.Literal(true),
  schemaVersion: Schema.Literal(1),
  stage: Schema.String.check(Schema.isPattern(/^pr-[1-9]\d*$/u)),
  stateStageAbsent: Schema.Literal(true),
});
export type DeploymentWorkflowTeardownReadback =
  typeof DeploymentWorkflowTeardownReadback.Type;

export const DeploymentWorkflowExternalReceipt = Schema.Struct({
  acceptedPlanSha256: Schema.NullOr(Sha256),
  automationId: Schema.Literals([
    "docs-preview-delivery",
    "docs-production-delivery",
    "docs-preview-teardown",
    "docs-orphan-inventory",
  ]),
  candidateCommit: CommitSha,
  environment: Schema.Literals([
    "taxkit-docs-preview",
    "taxkit-docs-production",
    "taxkit-docs-preview-teardown",
    "github-actions-report-only",
  ]),
  hostedProofPath: Schema.NullOr(Schema.NonEmptyString),
  lockGroup: Schema.NonEmptyString,
  nonClaims: Schema.NonEmptyArray(Schema.NonEmptyString),
  observedAt: Schema.String.check(
    Schema.isPattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u)
  ),
  planPath: Schema.NullOr(Schema.NonEmptyString),
  postcondition: Schema.NonEmptyString,
  principal: Schema.NonEmptyString,
  providerReadbackPath: Schema.NullOr(Schema.NonEmptyString),
  schemaVersion: Schema.Literal(1),
  stage: DocsDeploymentStage,
  workflowCommit: CommitSha,
  workflowPath: Schema.NonEmptyString,
  workflowReceiptPath: Schema.NonEmptyString,
  workflowRunId: Schema.NonEmptyString,
});
export type DeploymentWorkflowExternalReceipt =
  typeof DeploymentWorkflowExternalReceipt.Type;
