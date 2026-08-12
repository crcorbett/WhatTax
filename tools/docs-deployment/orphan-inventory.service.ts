import {
  Context,
  Effect,
  HashSet,
  Layer,
  Match,
  Option,
  Schema,
  Stream,
} from "effect";
import type * as Scope from "effect/Scope";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import type { DocsDeploymentInventoryReport } from "./inventory.schemas.js";
import { DocsDeploymentInventoryReport as InventoryReportSchema } from "./inventory.schemas.js";
import type {
  DocsDeploymentOrphanProcessConfig,
  DocsDeploymentOrphanProcessOperation,
} from "./orphan-inventory.process-boundary.js";
import {
  makeDocsDeploymentChildEnvironment,
  restoreDocsDeploymentJsonCommand,
} from "./orphan-inventory.process-boundary.js";
import type {
  DocsDeploymentOrphanInventoryReceipt,
  GitHubOpenPullRequest,
} from "./orphan-inventory.schemas.js";
import {
  docsDeploymentOpenPullRequestsCommand,
  docsDeploymentStateProviderInventoryCommand,
  DocsDeploymentOrphanInventoryInputError,
  DocsDeploymentOrphanInventoryReadError,
  GitHubOpenPullRequest as OpenPullRequestSchema,
  PreviewStageClassification,
} from "./orphan-inventory.schemas.js";

const repository = "crcorbett/taxkit" as const;
const githubPullRequestResultLimit = 1000;
const githubArgs = [
  "pr",
  "list",
  "--repo",
  repository,
  "--state",
  "open",
  "--limit",
  "1000",
  "--json",
  "headRefOid,isCrossRepository,isDraft,number,state,url",
] as const;

const previewStageNumber = (stage: string): number =>
  Number.parseInt(stage.slice("pr-".length), 10);

export const makeDocsDeploymentOrphanInventoryReceipt = (
  observedAt: string,
  openPullRequests: readonly GitHubOpenPullRequest[],
  deploymentInventory: DocsDeploymentInventoryReport
): DocsDeploymentOrphanInventoryReceipt => {
  const previewStages = deploymentInventory.stages
    .filter((entry) => entry.stage !== "prod")
    .map((entry) => {
      const prNumber = previewStageNumber(entry.stage);
      const pullRequest = Option.fromNullishOr(
        openPullRequests.find((candidate) => candidate.number === prNumber)
      ).pipe(Option.getOrNull);
      const classification = Match.value(pullRequest).pipe(
        Match.when(null, () => "orphan-candidate" as const),
        Match.when(
          (candidate) =>
            candidate.isCrossRepository || candidate.isDraft === false,
          () => "untrusted-preview-stage" as const
        ),
        Match.orElse(() => "active-trusted-preview" as const)
      );
      return {
        classification,
        prNumber,
        pullRequest,
        stage: entry.stage,
        workerNames: entry.resources.flatMap((resource) =>
          resource.logicalId === "DocsWebsite" &&
          resource.workerName !== undefined
            ? [resource.workerName]
            : []
        ),
      };
    })
    .toSorted((left, right) => left.prNumber - right.prNumber);
  const previewStageNumbers = HashSet.fromIterable(
    previewStages.map((entry) => entry.prNumber)
  );
  const trustedPullRequestsWithoutStage = openPullRequests
    .filter(
      (pullRequest) =>
        !pullRequest.isCrossRepository &&
        !HashSet.has(previewStageNumbers, pullRequest.number)
    )
    .toSorted((left, right) => left.number - right.number);
  return {
    automaticDeletion: "prohibited",
    mutationCapability: "none",
    nonClaims: [
      "An orphan candidate is report-only and is not deletion authority or proof that a resource should be destroyed.",
      "This dated read does not establish hosted behavior, future provider state, deployment, teardown, DNS, release or publication.",
    ],
    observedAt,
    previewStages,
    repository,
    schemaVersion: 1,
    sources: {
      deploymentInventory: {
        command: docsDeploymentStateProviderInventoryCommand,
        report: deploymentInventory,
      },
      github: {
        command: docsDeploymentOpenPullRequestsCommand,
        openPullRequests,
      },
    },
    trustedPullRequestsWithoutStage,
  };
};

export const inspectDocsDeploymentOrphanInventoryReceipt = (
  receipt: DocsDeploymentOrphanInventoryReceipt
): readonly string[] => {
  const expected = makeDocsDeploymentOrphanInventoryReceipt(
    receipt.observedAt,
    receipt.sources.github.openPullRequests,
    receipt.sources.deploymentInventory.report
  );
  return Schema.toEquivalence(Schema.Array(PreviewStageClassification))(
    receipt.previewStages,
    expected.previewStages
  ) &&
    Schema.toEquivalence(Schema.Array(OpenPullRequestSchema))(
      receipt.trustedPullRequestsWithoutStage,
      expected.trustedPullRequestsWithoutStage
    )
    ? []
    : [
        "orphan-inventory-classification: open pull requests, Alchemy stages and Cloudflare Workers must produce the exact report-only classification",
      ];
};

export interface DocsDeploymentOrphanSourcesShape {
  readonly readDeploymentInventory: (
    repositoryRoot: string
  ) => Effect.Effect<
    DocsDeploymentInventoryReport,
    | DocsDeploymentOrphanInventoryInputError
    | DocsDeploymentOrphanInventoryReadError,
    Scope.Scope
  >;
  readonly readOpenPullRequests: (
    repositoryRoot: string
  ) => Effect.Effect<
    readonly GitHubOpenPullRequest[],
    | DocsDeploymentOrphanInventoryInputError
    | DocsDeploymentOrphanInventoryReadError,
    Scope.Scope
  >;
}

export class DocsDeploymentOrphanSources extends Context.Service<
  DocsDeploymentOrphanSources,
  DocsDeploymentOrphanSourcesShape
>()("taxkit/DocsDeploymentOrphanSources") {}

export const DocsDeploymentOrphanSourcesLive = (
  processConfig: DocsDeploymentOrphanProcessConfig
) =>
  Layer.effect(
    DocsDeploymentOrphanSources,
    Effect.gen(function* makeDocsDeploymentOrphanSourcesLive() {
      const childProcesses = yield* ChildProcessSpawner.ChildProcessSpawner;

      const readJsonCommand = <A>(
        repositoryRoot: string,
        command: string,
        args: readonly string[],
        expectedCommand: string,
        operation: DocsDeploymentOrphanProcessOperation,
        schema: Schema.ConstraintDecoder<A>
      ): Effect.Effect<
        A,
        | DocsDeploymentOrphanInventoryInputError
        | DocsDeploymentOrphanInventoryReadError,
        Scope.Scope
      > =>
        Effect.gen(function* readJsonCommandOutput() {
          if ([command, ...args].join(" ") !== expectedCommand) {
            return yield* new DocsDeploymentOrphanInventoryInputError({
              target: `${operation}:command-identity`,
            });
          }
          const handle = yield* childProcesses
            .spawn(
              ChildProcess.make(command, args, {
                cwd: repositoryRoot,
                env: makeDocsDeploymentChildEnvironment(
                  processConfig,
                  operation
                ),
                extendEnv: false,
                forceKillAfter: "2 seconds",
                stderr: "pipe",
                stdin: "ignore",
                stdout: "pipe",
              })
            )
            .pipe(
              Effect.mapError(
                () => new DocsDeploymentOrphanInventoryReadError({ operation })
              )
            );
          const [stdout, stderr] = yield* Effect.all(
            [
              Stream.runCollect(handle.stdout),
              Stream.runCollect(handle.stderr),
            ],
            { concurrency: 2 }
          );
          const exitCode = yield* handle.exitCode;
          const decoded = yield* restoreDocsDeploymentJsonCommand(
            operation,
            Number(exitCode),
            [...stdout],
            [...stderr],
            schema
          );
          if (
            operation === "github-open-pull-requests" &&
            Array.isArray(decoded) &&
            decoded.length >= githubPullRequestResultLimit
          ) {
            return yield* new DocsDeploymentOrphanInventoryInputError({
              target: "incomplete GitHub pull-request inventory",
            });
          }
          return decoded;
        }).pipe(
          Effect.catchTag(
            "PlatformError",
            () => new DocsDeploymentOrphanInventoryReadError({ operation })
          )
        );

      return DocsDeploymentOrphanSources.of({
        readDeploymentInventory: (repositoryRoot) =>
          readJsonCommand(
            repositoryRoot,
            "bun",
            ["run", "check:docs-deployment-inventory"],
            docsDeploymentStateProviderInventoryCommand,
            "deployment-inventory",
            InventoryReportSchema
          ),
        readOpenPullRequests: (repositoryRoot) =>
          readJsonCommand(
            repositoryRoot,
            "gh",
            githubArgs,
            docsDeploymentOpenPullRequestsCommand,
            "github-open-pull-requests",
            Schema.Array(OpenPullRequestSchema)
          ),
      });
    })
  );
