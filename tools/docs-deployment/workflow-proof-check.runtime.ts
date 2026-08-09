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
    DeploymentWorkflowProviderReadback
  )(yield* Effect.promise(() => readJson(providerPath))).pipe(
    Effect.mapError(() => "provider readback failed Schema decoding")
  );
  const hosted = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowHostedProbe
  )(yield* Effect.promise(() => readJson(hostedPath))).pipe(
    Effect.mapError(() => "hosted probe failed Schema decoding")
  );
  const screenshotKinds = new Set(hosted.screenshots.map(({ kind }) => kind));
  const mismatch = [
    provider.candidateCommit !== candidateCommit,
    hosted.candidateCommit !== candidateCommit,
    provider.stage !== stage,
    hosted.stage !== stage,
    provider.acceptedPlanSha256 !== acceptedPlanSha256,
    hosted.acceptedPlanSha256 !== acceptedPlanSha256,
    provider.url !== hosted.url,
    provider.deploymentId !== hosted.deploymentId,
    provider.versionId !== hosted.versionId,
    provider.workerName !== hosted.workerName,
    hosted.diagnostics.length !== 0,
    hosted.screenshots.length !== 2,
    screenshotKinds.size !== 2,
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
