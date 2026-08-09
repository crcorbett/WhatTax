import { Effect, Match, Schema } from "effect";

import { DeploymentPlanReceipt } from "./schemas.js";

const program = Effect.gen(function* workflowPlanCheck() {
  const planPath = process.env["TAXKIT_WORKFLOW_PLAN_RECEIPT"];
  const candidateCommit = process.env["TAXKIT_WORKFLOW_PLAN_CANDIDATE_COMMIT"];
  const stage = process.env["TAXKIT_WORKFLOW_PLAN_STAGE"];
  const acceptedPlanSha256 = process.env["TAXKIT_WORKFLOW_PLAN_SHA256"];
  const requireReplan =
    process.env["TAXKIT_WORKFLOW_PLAN_REQUIRE_REPLAN"] === "1";
  if (
    planPath === undefined ||
    candidateCommit === undefined ||
    stage === undefined ||
    acceptedPlanSha256 === undefined
  ) {
    return yield* Effect.fail("workflow plan inputs are incomplete");
  }
  const plan = yield* Schema.decodeUnknownEffect(DeploymentPlanReceipt)(
    yield* Effect.promise(() => Bun.file(planPath).json())
  ).pipe(Effect.mapError(() => "workflow plan failed Schema decoding"));
  const { projection } = plan;
  const canonicalProjection = {
    candidate: {
      deploymentInputSha256: projection.candidate.deploymentInputSha256,
      exactCommit: projection.candidate.exactCommit,
      lockfileSha256: projection.candidate.lockfileSha256,
    },
    configSha256: projection.configSha256,
    logicalResources: projection.logicalResources,
    redaction: projection.redaction,
    schemaVersion: projection.schemaVersion,
    stack: projection.stack,
    stage: projection.stage,
  };
  const projectionDigest = new Bun.CryptoHasher("sha256")
    .update(JSON.stringify(canonicalProjection))
    .digest("hex");
  if (
    plan.acceptedPlanSha256 !== acceptedPlanSha256 ||
    projectionDigest !== acceptedPlanSha256 ||
    plan.projection.candidate.exactCommit !== candidateCommit ||
    plan.projection.stage !== stage ||
    (requireReplan && plan.replanSha256 !== acceptedPlanSha256)
  ) {
    return yield* Effect.fail(
      "workflow plan identity, projection digest or equal-replan postcondition mismatch"
    );
  }
  yield* Effect.sync(() =>
    console.log(
      `Docs deployment workflow plan: candidate=${candidateCommit}; stage=${stage}; digest=${acceptedPlanSha256}; schema=1; equalReplan=${plan.replanSha256 !== null}.`
    )
  );
});

const main = async () => {
  try {
    await Effect.runPromise(program);
  } catch (error) {
    console.error(`FAIL [workflow-plan] ${String(error)}`);
    process.exitCode = 1;
  }
};

Match.value(import.meta.main).pipe(
  Match.when(true, () => void main()),
  Match.orElse(() => false)
);
