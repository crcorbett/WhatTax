import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { AlchemyContextLive, AuthProviders } from "alchemy";
import { ArtifactStore, createArtifactStore } from "alchemy/Artifacts";
import {
  CredentialsStore,
  credentialsFilePath,
} from "alchemy/Auth/Credentials";
import { LoggingCli } from "alchemy/Cli/LoggingCli";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import { Stage } from "alchemy/Stage";
import {
  Config,
  Console,
  Effect,
  FileSystem,
  Layer,
  Match,
  Schema,
} from "effect";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

import { docsCloudflareStackName } from "../../apps/docs/src/lib/build/cloudflare-stack.js";
import {
  DocsDeploymentInventoryInputError,
  DocsDeploymentInventoryReport,
} from "./inventory.schemas.js";
import {
  DocsDeploymentInventory,
  DocsDeploymentInventoryLive,
} from "./inventory.service.js";

const InventoryRuntimeConfig = Schema.Struct({
  CI: Schema.Literals(["1", "true"]),
});
const CachedStateStoreCredentials = Schema.Struct({
  accountId: Schema.NonEmptyString,
  authToken: Schema.RedactedFromValue(Schema.NonEmptyString),
  url: Schema.URLFromString,
});

const deploymentStack = {
  actions: {},
  bindings: {},
  name: docsCloudflareStackName,
  resources: {},
  stage: "prod",
};

const platformLayer = Layer.mergeAll(
  BunServices.layer,
  FetchHttpClient.layer,
  LoggingCli,
  Layer.succeed(AuthProviders, {}),
  Layer.succeed(ArtifactStore, createArtifactStore()),
  Layer.succeed(Stack, deploymentStack),
  Layer.succeed(Stage, "prod")
);
const runtimeLayer = Layer.merge(
  platformLayer,
  AlchemyContextLive.pipe(Layer.provide(platformLayer))
);
const cloudflareApiLayer = Cloudflare.CloudflareApiLive().pipe(
  Layer.provideMerge(runtimeLayer)
);
const inventoryDependencies = Layer.merge(
  Cloudflare.state().pipe(Layer.provideMerge(runtimeLayer)),
  Cloudflare.Workers.LiveWorkerProvider().pipe(
    Layer.provideMerge(cloudflareApiLayer)
  )
);
const inventoryLayer = Layer.merge(
  DocsDeploymentInventoryLive,
  inventoryDependencies
);

const readInventoryProgram = Effect.gen(function* readInventoryProgram() {
  const inventory = yield* DocsDeploymentInventory;
  const report = yield* inventory.read();
  const encoded = yield* Schema.encodeUnknownEffect(
    DocsDeploymentInventoryReport
  )(report);
  yield* Console.log(JSON.stringify(encoded, null, 2));
});

const program = Effect.gen(function* inventoryProgram() {
  yield* Config.schema(InventoryRuntimeConfig).pipe(
    Effect.mapError(
      () => new DocsDeploymentInventoryInputError({ target: "CI=1" })
    )
  );
  const profile = yield* Config.string("ALCHEMY_PROFILE").pipe(
    Config.withDefault("default")
  );
  const credentialsStore = yield* CredentialsStore;
  const currentEnvironment = yield* yield* Cloudflare.CloudflareEnvironment;
  const cachedStateCredentials = yield* credentialsStore.read<unknown>(
    profile,
    "cloudflare-state-store"
  );
  if (cachedStateCredentials === undefined) {
    const fileSystem = yield* FileSystem.FileSystem;
    const fileShape = yield* fileSystem
      .readFileString(credentialsFilePath(profile, "cloudflare-state-store"))
      .pipe(
        Effect.map((contents) => {
          try {
            const parsed: unknown = JSON.parse(contents);
            return {
              fileJsonObject: parsed !== null && typeof parsed === "object",
              fileVisible: true,
            };
          } catch {
            return { fileJsonObject: false, fileVisible: true };
          }
        }),
        Effect.catch(() =>
          Effect.succeed({ fileJsonObject: false, fileVisible: false })
        )
      );
    yield* Console.error(
      `FAIL [inventory-input] target=missing cached Cloudflare state-store credentials fileVisible=${fileShape.fileVisible} fileJsonObject=${fileShape.fileJsonObject}`
    );
    return yield* new DocsDeploymentInventoryInputError({
      target: "missing cached Cloudflare state-store credentials",
    });
  }
  const decodedStateCredentials = yield* Schema.decodeUnknownEffect(
    CachedStateStoreCredentials
  )(cachedStateCredentials).pipe(
    Effect.mapError(
      () =>
        new DocsDeploymentInventoryInputError({
          target: "invalid cached Cloudflare state-store credentials",
        })
    )
  );
  if (decodedStateCredentials.accountId !== currentEnvironment.accountId) {
    return yield* new DocsDeploymentInventoryInputError({
      target: "cached state-store account identity",
    });
  }
  return yield* readInventoryProgram.pipe(Effect.provide(inventoryLayer));
}).pipe(
  Effect.tapErrorTag("DocsDeploymentInventoryInputError", (error) =>
    Console.error(`FAIL [inventory-input] target=${error.target}`)
  ),
  Effect.tapErrorTag("DocsDeploymentInventoryReadError", (error) =>
    Console.error(`FAIL [inventory-read] operation=${error.operation}`)
  ),
  Effect.tapErrorTag("DocsDeploymentInventoryDisagreementError", (error) =>
    Console.error(`FAIL [inventory-disagreement] ${error.findings.join("; ")}`)
  ),
  Effect.provide(cloudflareApiLayer),
  Effect.scoped
);

Match.value(import.meta.main).pipe(
  Match.when(true, () => BunRuntime.runMain(program)),
  Match.orElse(() => false)
);
