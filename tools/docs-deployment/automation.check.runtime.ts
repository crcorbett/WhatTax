import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Console, Effect, Match, Schema } from "effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";

import { inspectDeploymentAutomationRegisters } from "./automation.policy.js";
import {
  DeploymentAutomationInputError,
  DeploymentAutomationPolicyError,
  DeploymentAutomationRegister,
  DeploymentControlRegister,
} from "./automation.schemas.js";

const repositoryRootUrl = new URL("../..", import.meta.url);

const readJson = <A>(
  repositoryRoot: string,
  target: string,
  schema: Schema.ConstraintDecoder<A>
): Effect.Effect<
  A,
  DeploymentAutomationInputError,
  FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* readAutomationJson() {
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const source = yield* fileSystem
      .readFileString(path.join(repositoryRoot, target))
      .pipe(
        Effect.mapError(() => new DeploymentAutomationInputError({ target }))
      );
    return yield* Schema.decodeUnknownEffect(Schema.fromJsonString(schema), {
      onExcessProperty: "error",
    })(source).pipe(
      Effect.mapError(() => new DeploymentAutomationInputError({ target }))
    );
  });

export const checkDocsDeploymentAutomation = (repositoryRoot: string) =>
  Effect.gen(function* checkDocsDeploymentAutomationProgram() {
    const [automations, controls] = yield* Effect.all([
      readJson(
        repositoryRoot,
        "tools/docs-deployment/automation-register.json",
        DeploymentAutomationRegister
      ),
      readJson(
        repositoryRoot,
        "tools/docs-deployment/controls.json",
        DeploymentControlRegister
      ),
    ]);
    const findings = inspectDeploymentAutomationRegisters(
      automations,
      controls
    );
    const [firstFinding, ...remainingFindings] = findings;
    if (firstFinding !== undefined) {
      return yield* new DeploymentAutomationPolicyError({
        findings: [firstFinding, ...remainingFindings],
      });
    }
    return {
      automationCount: automations.length,
      controlCount: controls.length,
      externalStateEstablished: automations.filter(
        (entry) => entry.externalState.status === "established"
      ).length,
    };
  });

const program = Effect.gen(function* main() {
  const path = yield* Path.Path;
  const repositoryRoot = yield* path.fromFileUrl(repositoryRootUrl);
  const result = yield* checkDocsDeploymentAutomation(repositoryRoot);
  yield* Console.info(
    `Docs deployment automation validation: automations=${result.automationCount}; controls=${result.controlCount}; externalStateEstablished=${result.externalStateEstablished}; violations=0.`
  );
}).pipe(
  Effect.tapErrorTag("DeploymentAutomationInputError", (error) =>
    Console.error(
      `FAIL [automation-input] target=${error.target}; recovery=repair the Schema-decoded deployment automation register.`
    )
  ),
  Effect.tapErrorTag("DeploymentAutomationPolicyError", (error) =>
    Console.error(
      error.findings
        .map(
          (item) =>
            `FAIL [${item.invariant}] target=${item.target}; recovery=${item.recovery}`
        )
        .join("\n")
    )
  ),
  Effect.provide(BunServices.layer)
);

Match.value(import.meta.main).pipe(
  Match.when(true, () => BunRuntime.runMain(program)),
  Match.orElse(() => false)
);
