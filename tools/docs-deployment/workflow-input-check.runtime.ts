import { Effect, Match, Schema } from "effect";

import { DeploymentWorkflowInputReadback } from "./workflow-receipts.schemas.js";

const program = Effect.gen(function* workflowInputCheck() {
  const inputPath = process.env["TAXKIT_WORKFLOW_INPUT_RECEIPT"];
  const candidateCommit = process.env["TAXKIT_WORKFLOW_INPUT_CANDIDATE_COMMIT"];
  const workflowCommit = process.env["TAXKIT_WORKFLOW_INPUT_WORKFLOW_COMMIT"];
  const workflowRunId = process.env["TAXKIT_WORKFLOW_INPUT_RUN_ID"];
  const workflowPath = process.env["TAXKIT_WORKFLOW_INPUT_WORKFLOW_PATH"];
  const operation = process.env["TAXKIT_WORKFLOW_INPUT_OPERATION"];
  const prNumber = process.env["TAXKIT_WORKFLOW_INPUT_PR_NUMBER"];
  if (
    inputPath === undefined ||
    candidateCommit === undefined ||
    workflowCommit === undefined ||
    workflowRunId === undefined ||
    workflowPath === undefined ||
    operation === undefined
  ) {
    return yield* Effect.fail("workflow input receipt inputs are incomplete");
  }
  const input = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowInputReadback,
    { onExcessProperty: "error" }
  )(yield* Effect.promise(() => Bun.file(inputPath).json())).pipe(
    Effect.mapError(() => "workflow input receipt failed Schema decoding")
  );
  const expectedPrNumber =
    prNumber === undefined || prNumber.length === 0
      ? null
      : Number.parseInt(prNumber, 10);
  if (
    input.candidateCommit !== candidateCommit ||
    input.workflowCommit !== workflowCommit ||
    input.workflowRunId !== workflowRunId ||
    input.workflowPath !== workflowPath ||
    input.operation !== operation ||
    input.prNumber !== expectedPrNumber
  ) {
    return yield* Effect.fail(
      "workflow input receipt does not match the source, run, operation or candidate"
    );
  }
  yield* Effect.sync(() =>
    console.log(
      `Docs deployment workflow input: candidate=${candidateCommit}; workflow=${workflowCommit}; run=${workflowRunId}; operation=${operation}; source=refs/heads/main.`
    )
  );
});

const main = async () => {
  try {
    await Effect.runPromise(program);
  } catch (error) {
    console.error(`FAIL [workflow-input] ${String(error)}`);
    process.exitCode = 1;
  }
};

Match.value(import.meta.main).pipe(
  Match.when(true, () => void main()),
  Match.orElse(() => false)
);
