import { Schema } from "effect";

import { DocsDeploymentStage } from "../../apps/docs/src/lib/build/docs-deployment-stage.js";
import { DocsDeploymentInventoryReport } from "./inventory.schemas.js";

export const docsDeploymentOpenPullRequestsCommand =
  "gh pr list --repo crcorbett/taxkit --state open --limit 1000 --json headRefOid,isCrossRepository,isDraft,number,state,url" as const;
const docsDeploymentOpenPullRequestsLegacyCommand =
  "gh pr list --repo crcorbett/taxkit --state open --limit 100 --json headRefOid,isCrossRepository,number,state,url" as const;
export const docsDeploymentStateProviderInventoryCommand =
  "bun run check:docs-deployment-inventory" as const;

const CommitSha = Schema.String.check(Schema.isPattern(/^[a-f0-9]{40}$/u)).pipe(
  Schema.brand("taxkit/DocsDeploymentCommitSha")
);

export const GitHubOpenPullRequest = Schema.Struct({
  headRefOid: CommitSha,
  isCrossRepository: Schema.Boolean,
  isDraft: Schema.optional(Schema.Boolean),
  number: Schema.Int.check(Schema.isGreaterThan(0)),
  state: Schema.Literal("OPEN"),
  url: Schema.URLFromString,
});
export type GitHubOpenPullRequest = typeof GitHubOpenPullRequest.Type;

export const PreviewStageClassification = Schema.Struct({
  classification: Schema.Literals([
    "active-trusted-preview",
    "untrusted-preview-stage",
    "orphan-candidate",
  ]),
  prNumber: Schema.Int.check(Schema.isGreaterThan(0)),
  pullRequest: Schema.NullOr(GitHubOpenPullRequest),
  stage: DocsDeploymentStage,
  workerNames: Schema.Array(Schema.NonEmptyString),
});

export const DocsDeploymentOrphanInventoryReceipt = Schema.Struct({
  automaticDeletion: Schema.Literal("prohibited"),
  mutationCapability: Schema.Literal("none"),
  nonClaims: Schema.NonEmptyArray(Schema.NonEmptyString),
  observedAt: Schema.String.check(
    Schema.isPattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u)
  ),
  previewStages: Schema.Array(PreviewStageClassification),
  repository: Schema.Literal("crcorbett/taxkit"),
  schemaVersion: Schema.Literal(1),
  sources: Schema.Struct({
    deploymentInventory: Schema.Struct({
      command: Schema.Literal(docsDeploymentStateProviderInventoryCommand),
      report: DocsDeploymentInventoryReport,
    }),
    github: Schema.Struct({
      command: Schema.Literals([
        docsDeploymentOpenPullRequestsCommand,
        docsDeploymentOpenPullRequestsLegacyCommand,
      ]),
      openPullRequests: Schema.Array(GitHubOpenPullRequest),
    }),
  }),
  trustedPullRequestsWithoutStage: Schema.Array(GitHubOpenPullRequest),
});
export type DocsDeploymentOrphanInventoryReceipt =
  typeof DocsDeploymentOrphanInventoryReceipt.Type;

export class DocsDeploymentOrphanInventoryInputError extends Schema.TaggedErrorClass<DocsDeploymentOrphanInventoryInputError>()(
  "DocsDeploymentOrphanInventoryInputError",
  {
    target: Schema.NonEmptyString,
  }
) {}

export class DocsDeploymentOrphanInventoryReadError extends Schema.TaggedErrorClass<DocsDeploymentOrphanInventoryReadError>()(
  "DocsDeploymentOrphanInventoryReadError",
  {
    operation: Schema.NonEmptyString,
  }
) {}

export class DocsDeploymentOrphanInventoryPolicyError extends Schema.TaggedErrorClass<DocsDeploymentOrphanInventoryPolicyError>()(
  "DocsDeploymentOrphanInventoryPolicyError",
  {
    findings: Schema.NonEmptyArray(Schema.NonEmptyString),
  }
) {}
