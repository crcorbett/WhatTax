import { Effect, Match, Schema } from "effect";

import { DeploymentWorkflowRunReadback } from "./workflow-receipts.schemas.js";

const program = Effect.gen(function* workflowRunCheck() {
  const receiptPath = process.env["TAXKIT_WORKFLOW_RUN_RECEIPT"];
  const candidateCommit = process.env["TAXKIT_WORKFLOW_RUN_CANDIDATE_COMMIT"];
  const workflowCommit = process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_COMMIT"];
  const workflowRunId = process.env["TAXKIT_WORKFLOW_RUN_ID"];
  const workflowPath = process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_PATH"];
  const workflowName = process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_NAME"];
  if (
    receiptPath === undefined ||
    candidateCommit === undefined ||
    workflowCommit === undefined ||
    workflowRunId === undefined ||
    workflowPath === undefined ||
    workflowName === undefined
  ) {
    return yield* Effect.fail("workflow run receipt inputs are incomplete");
  }
  const receipt = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowRunReadback,
    { onExcessProperty: "error" }
  )(yield* Effect.promise(() => Bun.file(receiptPath).json())).pipe(
    Effect.mapError(() => "workflow run receipt failed Schema decoding")
  );
  if (
    receipt.candidateCommit !== candidateCommit ||
    receipt.headSha !== workflowCommit ||
    receipt.workflowRunId !== workflowRunId ||
    receipt.path !== workflowPath ||
    receipt.workflowName !== workflowName ||
    receipt.headBranch !== "main" ||
    receipt.ref !== "refs/heads/main" ||
    receipt.status !== "completed" ||
    receipt.conclusion !== "success"
  ) {
    return yield* Effect.fail(
      "workflow run receipt does not match the completed default-branch run"
    );
  }
  yield* Effect.sync(() =>
    console.log(
      `Docs deployment workflow run: candidate=${candidateCommit}; workflow=${workflowCommit}; run=${workflowRunId}; path=${workflowPath}; conclusion=success.`
    )
  );
});

const main = async () => {
  try {
    await Effect.runPromise(program);
  } catch (error) {
    console.error(`FAIL [workflow-run] ${String(error)}`);
    process.exitCode = 1;
  }
};

Match.value(import.meta.main).pipe(
  Match.when(true, () => void main()),
  Match.orElse(() => false)
);
