import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Config, Console, Effect, Match } from "effect";

import { prepareWorkflowArtifact } from "./workflow-artifact.js";
import {
  WorkflowArtifactConfig,
  WorkflowArtifactPreparationError,
} from "./workflow-artifact.schemas.js";

const program = Effect.gen(function* workflowArtifactRuntime() {
  const config = yield* Config.schema(WorkflowArtifactConfig).pipe(
    Effect.mapError(
      () =>
        new WorkflowArtifactPreparationError({
          path: "environment",
          reason: "config",
        })
    )
  );
  yield* prepareWorkflowArtifact(
    config.TAXKIT_WORKFLOW_ARTIFACT_MODE,
    config.TAXKIT_WORKFLOW_ARTIFACT_SOURCE,
    config.TAXKIT_WORKFLOW_ARTIFACT_UPLOAD
  );
  yield* Console.log(
    `Workflow artifact prepared: mode=${config.TAXKIT_WORKFLOW_ARTIFACT_MODE}.`
  );
}).pipe(
  Effect.tapErrorTag("WorkflowArtifactPreparationError", (error) =>
    Console.error(
      `FAIL [workflow-artifact] reason=${error.reason} path=${error.path}`
    )
  ),
  Effect.provide(BunServices.layer)
);

Match.value(import.meta.main).pipe(
  Match.when(true, () =>
    BunRuntime.runMain(program, { disableErrorReporting: true })
  ),
  Match.orElse(() => false)
);
