import { Effect, Match, Schema } from "effect";

import { DeploymentWorkflowTeardownReadback } from "./workflow-receipts.schemas.js";

const program = Effect.gen(function* workflowTeardownProofCheck() {
  const readbackPath = process.env["TAXKIT_WORKFLOW_TEARDOWN_READBACK"];
  const candidateCommit = process.env["TAXKIT_WORKFLOW_CANDIDATE_COMMIT"];
  const stage = process.env["TAXKIT_WORKFLOW_STAGE"];
  if (
    readbackPath === undefined ||
    candidateCommit === undefined ||
    stage === undefined
  ) {
    return yield* Effect.fail("workflow teardown proof inputs are incomplete");
  }
  const readback = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowTeardownReadback
  )(yield* Effect.promise(() => Bun.file(readbackPath).json())).pipe(
    Effect.mapError(() => "teardown readback failed Schema decoding")
  );
  if (
    readback.candidateCommit !== candidateCommit ||
    readback.stage !== stage ||
    !readback.stateStageAbsent ||
    !readback.providerWorkerAbsent
  ) {
    return yield* Effect.fail(
      "workflow teardown readback does not prove exact stage absence"
    );
  }
  yield* Effect.sync(() =>
    console.log(
      `Docs deployment teardown proof: candidate=${candidateCommit}; stage=${stage}; state/provider absence agree.`
    )
  );
});

const main = async () => {
  try {
    await Effect.runPromise(program);
  } catch (error) {
    console.error(`FAIL [workflow-teardown-proof] ${String(error)}`);
    process.exitCode = 1;
  }
};

Match.value(import.meta.main).pipe(
  Match.when(true, () => void main()),
  Match.orElse(() => false)
);
