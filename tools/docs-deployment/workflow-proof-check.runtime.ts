import { Effect, Match, Schema } from "effect";

import {
  DeploymentWorkflowHostedProbe,
  DeploymentWorkflowProviderReadback,
} from "./workflow-receipts.schemas.js";

const readJson = async (path: string) =>
  JSON.parse(await Bun.file(path).text());

const program = Effect.gen(function* workflowProofCheck() {
  const providerPath = process.env["TAXKIT_WORKFLOW_PROVIDER_READBACK"];
  const hostedPath = process.env["TAXKIT_WORKFLOW_HOSTED_PROBE"];
  const candidateCommit = process.env["TAXKIT_WORKFLOW_CANDIDATE_COMMIT"];
  const stage = process.env["TAXKIT_WORKFLOW_STAGE"];
  const acceptedPlanSha256 = process.env["TAXKIT_WORKFLOW_PLAN_SHA256"];
  const screenshotRoot =
    process.env["TAXKIT_WORKFLOW_SCREENSHOT_ROOT"] ?? process.cwd();
  if (
    providerPath === undefined ||
    hostedPath === undefined ||
    candidateCommit === undefined ||
    stage === undefined ||
    acceptedPlanSha256 === undefined
  ) {
    return yield* Effect.fail("workflow proof inputs are incomplete");
  }
  const provider = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowProviderReadback,
    { onExcessProperty: "error" }
  )(yield* Effect.promise(() => readJson(providerPath))).pipe(
    Effect.mapError(() => "provider readback failed Schema decoding")
  );
  const hosted = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowHostedProbe,
    { onExcessProperty: "error" }
  )(yield* Effect.promise(() => readJson(hostedPath))).pipe(
    Effect.mapError(() => "hosted probe failed Schema decoding")
  );
  const screenshotDigests = yield* Effect.promise(() =>
    Promise.all(
      hosted.screenshots.map(async (screenshot) => {
        const file = Bun.file(`${screenshotRoot}/${screenshot.path}`);
        if (!(await file.exists())) {
          throw new Error(`screenshot bytes are absent: ${screenshot.path}`);
        }
        return new Bun.CryptoHasher("sha256")
          .update(await file.arrayBuffer())
          .digest("hex");
      })
    )
  ).pipe(Effect.mapError(() => "workflow screenshot bytes could not be read"));
  const screenshotKinds = new Set(hosted.screenshots.map(({ kind }) => kind));
  let expectedEnvironment: "preview" | "production" | "rollback";
  if (stage === "prod") {
    expectedEnvironment =
      hosted.environment === "rollback" ? "rollback" : "production";
  } else {
    expectedEnvironment = "preview";
  }
  const expectedPreviewPrNumber =
    stage === "prod" ? null : Number.parseInt(stage.slice(3), 10);
  const mismatch = [
    provider.accountId !== hosted.accountId,
    provider.stateStoreId !== hosted.stateStoreId,
    provider.candidateCommit !== candidateCommit,
    hosted.candidateCommit !== candidateCommit,
    provider.configSha256 !== hosted.configSha256,
    provider.deploymentInputSha256 !== hosted.deploymentInputSha256,
    provider.lockfileSha256 !== hosted.lockfileSha256,
    provider.stage !== stage,
    hosted.stage !== stage,
    provider.previewPrNumber !== hosted.previewPrNumber,
    provider.previewPrNumber !== expectedPreviewPrNumber,
    hosted.previewPrNumber !== expectedPreviewPrNumber,
    hosted.environment !== expectedEnvironment,
    provider.previousVersionId !== hosted.previousVersionId,
    provider.rollbackRecoveryIdentity !== hosted.rollbackRecoveryIdentity,
    provider.acceptedPlanSha256 !== acceptedPlanSha256,
    hosted.acceptedPlanSha256 !== acceptedPlanSha256,
    provider.url !== hosted.url,
    provider.deploymentId !== hosted.deploymentId,
    provider.versionId !== hosted.versionId,
    provider.workerName !== hosted.workerName,
    hosted.diagnostics.length !== 0,
    hosted.screenshots.length !== 2,
    screenshotKinds.size !== 2 ||
      !screenshotKinds.has("desktop") ||
      !screenshotKinds.has("mobile"),
    hosted.screenshots.some(
      (screenshot, index) => screenshot.sha256 !== screenshotDigests[index]
    ),
  ].some(Boolean);
  if (mismatch) {
    return yield* Effect.fail(
      "workflow provider/hosted proof identity or diagnostics mismatch"
    );
  }
  yield* Effect.sync(() =>
    console.log(
      `Docs deployment workflow proof: candidate=${candidateCommit}; stage=${stage}; provider/hosted identity agree; screenshots=desktop,mobile; diagnostics=0.`
    )
  );
});

const main = async () => {
  try {
    await Effect.runPromise(program);
  } catch (error) {
    console.error(`FAIL [workflow-proof] ${String(error)}`);
    process.exitCode = 1;
  }
};

Match.value(import.meta.main).pipe(
  Match.when(true, () => void main()),
  Match.orElse(() => false)
);
