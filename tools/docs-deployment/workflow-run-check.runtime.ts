import { Effect, Match, Schema } from "effect";

import { DeploymentWorkflowRunReadback } from "./workflow-receipts.schemas.js";

const isTeardownPath = (workflowPath: string) =>
  workflowPath.endsWith("docs-preview-teardown.yml");

const isOrphanPath = (workflowPath: string) =>
  workflowPath.endsWith("docs-orphan-inventory.yml");

const isAllowedEvent = (workflowPath: string, workflowEvent: string) => {
  if (isTeardownPath(workflowPath)) {
    return (
      workflowEvent === "pull_request" || workflowEvent === "workflow_dispatch"
    );
  }
  if (isOrphanPath(workflowPath)) {
    return (
      workflowEvent === "schedule" || workflowEvent === "workflow_dispatch"
    );
  }
  return workflowEvent === "workflow_dispatch";
};

const hasSourceIdentityMismatch = (
  workflowPath: string,
  workflowEvent: string,
  workflowHeadBranch: string,
  workflowHeadSha: string,
  workflowCommit: string
) =>
  !isAllowedEvent(workflowPath, workflowEvent) ||
  (!isTeardownPath(workflowPath) &&
    (workflowHeadBranch !== "main" || workflowHeadSha !== workflowCommit));

interface WorkflowRunInputs {
  readonly receiptPath: string | undefined;
  readonly candidateCommit: string | undefined;
  readonly workflowCommit: string | undefined;
  readonly workflowRunId: string | undefined;
  readonly workflowEvent: string | undefined;
  readonly workflowHeadBranch: string | undefined;
  readonly workflowHeadSha: string | undefined;
  readonly workflowPath: string | undefined;
  readonly workflowName: string | undefined;
}

const hasAllInputs = (
  inputs: WorkflowRunInputs
): inputs is Required<WorkflowRunInputs> =>
  [
    inputs.candidateCommit,
    inputs.receiptPath,
    inputs.workflowCommit,
    inputs.workflowEvent,
    inputs.workflowHeadBranch,
    inputs.workflowHeadSha,
    inputs.workflowName,
    inputs.workflowPath,
    inputs.workflowRunId,
  ].every((value) => value !== undefined);

const program = Effect.gen(function* workflowRunCheck() {
  const inputs = {
    candidateCommit: process.env["TAXKIT_WORKFLOW_RUN_CANDIDATE_COMMIT"],
    receiptPath: process.env["TAXKIT_WORKFLOW_RUN_RECEIPT"],
    workflowCommit: process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_COMMIT"],
    workflowEvent: process.env["TAXKIT_WORKFLOW_RUN_EVENT"],
    workflowHeadBranch: process.env["TAXKIT_WORKFLOW_RUN_HEAD_BRANCH"],
    workflowHeadSha: process.env["TAXKIT_WORKFLOW_RUN_HEAD_SHA"],
    workflowName: process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_NAME"],
    workflowPath: process.env["TAXKIT_WORKFLOW_RUN_WORKFLOW_PATH"],
    workflowRunId: process.env["TAXKIT_WORKFLOW_RUN_ID"],
  };
  if (!hasAllInputs(inputs)) {
    return yield* Effect.fail("workflow run receipt inputs are incomplete");
  }
  const {
    receiptPath,
    candidateCommit,
    workflowCommit,
    workflowRunId,
    workflowEvent,
    workflowHeadBranch,
    workflowHeadSha,
    workflowPath,
    workflowName,
  } = inputs;
  if (receiptPath === undefined) {
    return yield* Effect.fail("workflow run receipt path is missing");
  }
  const receipt = yield* Schema.decodeUnknownEffect(
    DeploymentWorkflowRunReadback,
    { onExcessProperty: "error" }
  )(yield* Effect.promise(() => Bun.file(receiptPath).json())).pipe(
    Effect.mapError(() => "workflow run receipt failed Schema decoding")
  );
  if (
    receipt.candidateCommit !== candidateCommit ||
    receipt.workflowCommit !== workflowCommit ||
    receipt.workflowRunId !== workflowRunId ||
    receipt.path !== workflowPath ||
    receipt.workflowName !== workflowName ||
    receipt.event !== workflowEvent ||
    receipt.headBranch !== workflowHeadBranch ||
    receipt.headSha !== workflowHeadSha ||
    receipt.ref !== "refs/heads/main" ||
    receipt.status !== "completed" ||
    receipt.conclusion !== "success"
  ) {
    return yield* Effect.fail(
      "workflow run receipt does not match the completed source run"
    );
  }
  if (
    hasSourceIdentityMismatch(
      workflowPath,
      workflowEvent,
      workflowHeadBranch,
      workflowHeadSha,
      workflowCommit
    )
  ) {
    return yield* Effect.fail(
      "workflow run receipt does not match the allowed source/event identity"
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
