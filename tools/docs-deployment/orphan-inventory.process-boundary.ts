import { Effect, Match, Option, Redacted, Schema } from "effect";

import {
  DocsDeploymentOrphanInventoryInputError,
  DocsDeploymentOrphanInventoryReadError,
} from "./orphan-inventory.schemas.js";

export interface DocsDeploymentOrphanProcessConfig {
  readonly alchemyProfile: string;
  readonly cloudflareAccountId: string;
  readonly cloudflareApiToken: Redacted.Redacted<string>;
  readonly githubToken: Redacted.Redacted<string>;
  readonly home: string;
  readonly path: string;
  readonly stateStoreCredentialsJson: Option.Option<Redacted.Redacted<string>>;
}

export type DocsDeploymentOrphanProcessOperation =
  | "deployment-inventory"
  | "github-open-pull-requests";

export const makeDocsDeploymentChildEnvironment = (
  config: DocsDeploymentOrphanProcessConfig,
  operation: DocsDeploymentOrphanProcessOperation
): Readonly<Record<string, string>> =>
  Match.value(operation).pipe(
    Match.when("deployment-inventory", () => ({
      ALCHEMY_PROFILE: config.alchemyProfile,
      CI: "true",
      CLOUDFLARE_ACCOUNT_ID: config.cloudflareAccountId,
      CLOUDFLARE_API_TOKEN: Redacted.value(config.cloudflareApiToken),
      HOME: config.home,
      LANG: "C.UTF-8",
      PATH: config.path,
      ...Option.match(config.stateStoreCredentialsJson, {
        onNone: () => ({}),
        onSome: (value) => ({
          ALCHEMY_STATE_STORE_CREDENTIALS_JSON: Redacted.value(value),
        }),
      }),
    })),
    Match.when("github-open-pull-requests", () => ({
      CI: "true",
      GH_TOKEN: Redacted.value(config.githubToken),
      HOME: config.home,
      LANG: "C.UTF-8",
      PATH: config.path,
    })),
    Match.exhaustive
  );

const concatenateProcessBytes = (chunks: readonly Uint8Array[]): Uint8Array => {
  let byteLength = 0;
  for (const chunk of chunks) {
    byteLength += chunk.byteLength;
  }
  const output = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
};

const decodeProcessText = (
  operation: DocsDeploymentOrphanProcessOperation,
  stream: "stderr" | "stdout",
  chunks: readonly Uint8Array[]
) =>
  Effect.try({
    catch: () =>
      new DocsDeploymentOrphanInventoryInputError({
        target: `${operation}:${stream}-utf8`,
      }),
    try: () =>
      new TextDecoder("utf-8", { fatal: true }).decode(
        concatenateProcessBytes(chunks)
      ),
  });

const inventoryInputSuffix = (target: string): string =>
  Match.value(target).pipe(
    Match.when("CI=1", () => "ci"),
    Match.when("cached state-store account identity", () => "account"),
    Match.when(
      "missing cached Cloudflare state-store credentials",
      () => "missing-cache"
    ),
    Match.when(
      "invalid cached Cloudflare state-store credentials",
      () => "invalid-cache"
    ),
    Match.orElse(() => "credentials")
  );

const safeFailedOperation = (
  operation: DocsDeploymentOrphanProcessOperation,
  output: string
): string => {
  const cacheShape = Option.fromNullishOr(
    output.match(
      /FAIL \[inventory-input\] target=(?:missing|invalid) cached Cloudflare state-store credentials fileVisible=(true|false) fileJsonObject=(true|false)/u
    )
  );
  const safeFailure = Option.fromNullishOr(
    output.match(
      /FAIL \[(inventory-input|inventory-read|inventory-disagreement)\](?: operation=([A-Za-z0-9:_-]+)| target=(CI=1|missing cached Cloudflare state-store credentials|invalid cached Cloudflare state-store credentials|cached state-store account identity))?/u
    )
  );
  const suffix = Option.flatMap(safeFailure, (match) =>
    Option.match(Option.fromNullishOr(match[2]), {
      onNone: () =>
        Option.match(Option.fromNullishOr(match[3]), {
          onNone: () =>
            Option.fromNullishOr(match[1]).pipe(
              Option.map((category) => category.replace("inventory-", ""))
            ),
          onSome: (target) => Option.some(inventoryInputSuffix(target)),
        }),
      onSome: Option.some,
    })
  );
  const cacheShapeSuffix = Option.match(cacheShape, {
    onNone: () => "",
    onSome: (match) => `-file-visible-${match[1]}-json-object-${match[2]}`,
  });
  return Option.match(suffix, {
    onNone: () => operation,
    onSome: (value) => `${operation}:${value}${cacheShapeSuffix}`,
  });
};

export const restoreDocsDeploymentJsonCommand = <A>(
  operation: DocsDeploymentOrphanProcessOperation,
  exitCode: number,
  stdout: readonly Uint8Array[],
  stderr: readonly Uint8Array[],
  schema: Schema.ConstraintDecoder<A>
): Effect.Effect<
  A,
  | DocsDeploymentOrphanInventoryInputError
  | DocsDeploymentOrphanInventoryReadError
> =>
  Effect.gen(function* restoreProcessBoundary() {
    const [stdoutText, stderrText] = yield* Effect.all(
      [
        decodeProcessText(operation, "stdout", stdout),
        decodeProcessText(operation, "stderr", stderr),
      ],
      { concurrency: 2 }
    );
    if (exitCode !== 0) {
      return yield* new DocsDeploymentOrphanInventoryReadError({
        operation: safeFailedOperation(
          operation,
          `${stdoutText}\n${stderrText}`
        ),
      });
    }
    return yield* Schema.decodeUnknownEffect(Schema.fromJsonString(schema), {
      onExcessProperty: "error",
    })(stdoutText).pipe(
      Effect.mapError(
        () =>
          new DocsDeploymentOrphanInventoryInputError({
            target: `${operation}:json`,
          })
      )
    );
  });
