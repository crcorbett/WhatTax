import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Clock, Config, Console, Effect, Layer, Match, Schema } from "effect";
import * as Path from "effect/Path";

import {
  DocsDeploymentOrphanInventoryPolicyError,
  DocsDeploymentOrphanInventoryReceipt,
} from "./orphan-inventory.schemas.js";
import {
  DocsDeploymentOrphanSources,
  DocsDeploymentOrphanSourcesLive,
  inspectDocsDeploymentOrphanInventoryReceipt,
  makeDocsDeploymentOrphanInventoryReceipt,
} from "./orphan-inventory.service.js";

const repositoryRootUrl = new URL("../..", import.meta.url);
const OrphanInventoryRuntimeConfig = Schema.Struct({
  CI: Schema.Literals(["1", "true"]),
});
const runtimeLayer = Layer.merge(
  BunServices.layer,
  DocsDeploymentOrphanSourcesLive.pipe(Layer.provide(BunServices.layer))
);

const program = Effect.gen(function* orphanInventoryProgram() {
  yield* Config.schema(OrphanInventoryRuntimeConfig);
  const path = yield* Path.Path;
  const repositoryRoot = yield* path.fromFileUrl(repositoryRootUrl);
  const sources = yield* DocsDeploymentOrphanSources;
  const [openPullRequests, deploymentInventory] = yield* Effect.all(
    [
      sources.readOpenPullRequests(repositoryRoot),
      sources.readDeploymentInventory(repositoryRoot),
    ],
    { concurrency: 2 }
  );
  const observedAt = new Date(yield* Clock.currentTimeMillis).toISOString();
  const receipt = makeDocsDeploymentOrphanInventoryReceipt(
    observedAt,
    openPullRequests,
    deploymentInventory
  );
  const findings = inspectDocsDeploymentOrphanInventoryReceipt(receipt);
  if (findings.length > 0) {
    return yield* new DocsDeploymentOrphanInventoryPolicyError({
      findings: [findings[0] ?? "orphan inventory policy failed"],
    });
  }
  const encoded = yield* Schema.encodeUnknownEffect(
    DocsDeploymentOrphanInventoryReceipt
  )(receipt);
  yield* Console.log(JSON.stringify(encoded, null, 2));
}).pipe(
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryInputError", (error) =>
    Console.error(`FAIL [orphan-input] target=${error.target}`)
  ),
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryReadError", (error) =>
    Console.error(`FAIL [orphan-read] operation=${error.operation}`)
  ),
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryPolicyError", (error) =>
    Console.error(`FAIL [orphan-policy] ${error.findings.join("; ")}`)
  ),
  Effect.provide(runtimeLayer),
  Effect.scoped
);

Match.value(import.meta.main).pipe(
  Match.when(true, () => BunRuntime.runMain(program)),
  Match.orElse(() => false)
);
