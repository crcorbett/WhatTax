import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import {
  Clock,
  Config,
  Console,
  Effect,
  Layer,
  Match,
  Option,
  Schema,
} from "effect";
import * as Path from "effect/Path";

import {
  DocsDeploymentOrphanInventoryInputError,
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
const OrphanInventoryRuntimeConfig = Config.unwrap({
  alchemyProfile: Config.string("ALCHEMY_PROFILE").pipe(
    Config.withDefault("default")
  ),
  ci: Config.schema(Schema.Literals(["1", "true"]), "CI"),
  cloudflareAccountId: Config.schema(
    Schema.NonEmptyString,
    "CLOUDFLARE_ACCOUNT_ID"
  ),
  cloudflareApiToken: Config.redacted("CLOUDFLARE_API_TOKEN"),
  githubToken: Config.redacted("GH_TOKEN"),
  home: Config.schema(Schema.NonEmptyString, "HOME"),
  path: Config.schema(Schema.NonEmptyString, "PATH"),
  stateStoreCredentialsJson: Config.redacted(
    "ALCHEMY_STATE_STORE_CREDENTIALS_JSON"
  ).pipe(Config.option),
});

const readOrphanInventory = Effect.fn(function* orphanInventoryProgram() {
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
      findings: [
        Option.fromNullishOr(findings[0]).pipe(
          Option.getOrElse(() => "orphan inventory policy failed")
        ),
      ],
    });
  }
  const encoded = yield* Schema.encodeUnknownEffect(
    DocsDeploymentOrphanInventoryReceipt
  )(receipt);
  yield* Console.log(JSON.stringify(encoded, null, 2));
});

const program = OrphanInventoryRuntimeConfig.pipe(
  Effect.mapError(
    () =>
      new DocsDeploymentOrphanInventoryInputError({
        target: "environment",
      })
  ),
  Effect.flatMap((config) =>
    readOrphanInventory().pipe(
      Effect.provide(
        DocsDeploymentOrphanSourcesLive(config).pipe(
          Layer.provide(BunServices.layer)
        )
      )
    )
  ),
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryInputError", (error) =>
    Console.error(`FAIL [orphan-input] target=${error.target}`)
  ),
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryReadError", (error) =>
    Console.error(`FAIL [orphan-read] operation=${error.operation}`)
  ),
  Effect.tapErrorTag("DocsDeploymentOrphanInventoryPolicyError", (error) =>
    Console.error(`FAIL [orphan-policy] ${error.findings.join("; ")}`)
  ),
  Effect.provide(BunServices.layer),
  Effect.scoped
);

Match.value(import.meta.main).pipe(
  Match.when(true, () => BunRuntime.runMain(program)),
  Match.orElse(() => false)
);
