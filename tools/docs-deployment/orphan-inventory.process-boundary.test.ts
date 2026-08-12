import { describe, expect, test } from "bun:test";

import * as BunServices from "@effect/platform-bun/BunServices";
import {
  Effect,
  Layer,
  Match,
  Option,
  Record,
  Redacted,
  Result,
  Schema,
} from "effect";

import {
  makeDocsDeploymentChildEnvironment,
  restoreDocsDeploymentJsonCommand,
} from "./orphan-inventory.process-boundary.js";
import {
  DocsDeploymentOrphanSources,
  DocsDeploymentOrphanSourcesLive,
} from "./orphan-inventory.service.js";

const textBytes = (value: string): readonly Uint8Array[] => [
  new TextEncoder().encode(value),
];
const Output = Schema.Struct({ ok: Schema.Literal(true) });

describe("docs deployment orphan process boundary", () => {
  test("passes only operation-owned environment values to each child", () => {
    const config = {
      alchemyProfile: "default",
      cloudflareAccountId: "account-123",
      cloudflareApiToken: Redacted.make("cloudflare-secret"),
      githubToken: Redacted.make("github-secret"),
      home: "/safe/home",
      path: "/safe/bin",
      stateStoreCredentialsJson: Option.some(Redacted.make("state-secret")),
    };
    const providerEnvironment = makeDocsDeploymentChildEnvironment(
      config,
      "deployment-inventory"
    );
    const githubEnvironment = makeDocsDeploymentChildEnvironment(
      config,
      "github-open-pull-requests"
    );

    expect(Record.keys(providerEnvironment).toSorted()).toEqual([
      "ALCHEMY_PROFILE",
      "ALCHEMY_STATE_STORE_CREDENTIALS_JSON",
      "CI",
      "CLOUDFLARE_ACCOUNT_ID",
      "CLOUDFLARE_API_TOKEN",
      "HOME",
      "LANG",
      "PATH",
    ]);
    expect(providerEnvironment).not.toHaveProperty("GH_TOKEN");
    expect(Record.keys(githubEnvironment).toSorted()).toEqual([
      "CI",
      "GH_TOKEN",
      "HOME",
      "LANG",
      "PATH",
    ]);
    expect(githubEnvironment).not.toHaveProperty("CLOUDFLARE_API_TOKEN");
    expect(githubEnvironment).not.toHaveProperty(
      "ALCHEMY_STATE_STORE_CREDENTIALS_JSON"
    );
    const cacheOnlyEnvironment = makeDocsDeploymentChildEnvironment(
      { ...config, stateStoreCredentialsJson: Option.none() },
      "deployment-inventory"
    );
    expect(cacheOnlyEnvironment).not.toHaveProperty(
      "ALCHEMY_STATE_STORE_CREDENTIALS_JSON"
    );
  });

  test("restores valid UTF-8 and JSON exactly once", async () => {
    const result = await restoreDocsDeploymentJsonCommand(
      "deployment-inventory",
      0,
      textBytes('{"ok":true}'),
      [],
      Output
    ).pipe(Effect.runPromise);
    expect(result).toEqual({ ok: true });
  });

  test("maps malformed UTF-8 and JSON to closed safe input errors", async () => {
    const [invalidUtf8, invalidJson] = await Effect.all([
      restoreDocsDeploymentJsonCommand(
        "deployment-inventory",
        0,
        [new Uint8Array([0xc3, 0x28])],
        [],
        Output
      ).pipe(Effect.result),
      restoreDocsDeploymentJsonCommand(
        "deployment-inventory",
        0,
        textBytes("{malformed"),
        [],
        Output
      ).pipe(Effect.result),
    ]).pipe(Effect.runPromise);

    Match.value(invalidUtf8).pipe(
      Match.tag("Failure", ({ failure }) =>
        Match.value(failure).pipe(
          Match.tag("DocsDeploymentOrphanInventoryInputError", (error) =>
            expect(error.target).toBe("deployment-inventory:stdout-utf8")
          ),
          Match.orElse(() => expect.unreachable())
        )
      ),
      Match.orElse(() => expect.unreachable())
    );
    Match.value(invalidJson).pipe(
      Match.tag("Failure", ({ failure }) =>
        Match.value(failure).pipe(
          Match.tag("DocsDeploymentOrphanInventoryInputError", (error) =>
            expect(error.target).toBe("deployment-inventory:json")
          ),
          Match.orElse(() => expect.unreachable())
        )
      ),
      Match.orElse(() => expect.unreachable())
    );
  });

  test("maps non-zero exits to classified safe operations without raw diagnostics", async () => {
    const secret = "must-never-enter-the-error";
    const result = await restoreDocsDeploymentJsonCommand(
      "deployment-inventory",
      1,
      [],
      textBytes(
        `FAIL [inventory-input] target=invalid cached Cloudflare state-store credentials fileVisible=true fileJsonObject=true ${secret}`
      ),
      Output
    ).pipe(Effect.result, Effect.runPromise);

    Result.match(result, {
      onFailure: (failure) => {
        expect(failure._tag).toBe("DocsDeploymentOrphanInventoryReadError");
        expect(JSON.stringify(failure)).not.toContain(secret);
        Match.value(failure).pipe(
          Match.tag("DocsDeploymentOrphanInventoryReadError", (error) =>
            expect(error.operation).toBe(
              "deployment-inventory:invalid-cache-file-visible-true-json-object-true"
            )
          ),
          Match.orElse(() => expect.unreachable())
        );
      },
      onSuccess: () => expect.unreachable(),
    });
  });

  test("rejects excess JSON fields", async () => {
    const result = await restoreDocsDeploymentJsonCommand(
      "github-open-pull-requests",
      0,
      textBytes('{"ok":true,"secret":"forbidden"}'),
      [],
      Output
    ).pipe(Effect.result, Effect.runPromise);
    expect(Result.isFailure(result)).toBe(true);
  });

  test("maps a child spawn failure without exposing injected secrets", async () => {
    const secret = "spawn-secret-must-remain-redacted";
    const config = {
      alchemyProfile: "default",
      cloudflareAccountId: "account-123",
      cloudflareApiToken: Redacted.make(secret),
      githubToken: Redacted.make(secret),
      home: "/",
      path: "/path-with-no-executables",
      stateStoreCredentialsJson: Option.some(Redacted.make(secret)),
    };
    const result = await Effect.gen(function* spawnFailureFixture() {
      const sources = yield* DocsDeploymentOrphanSources;
      return yield* sources.readOpenPullRequests("/");
    }).pipe(
      Effect.provide(
        DocsDeploymentOrphanSourcesLive(config).pipe(
          Layer.provide(BunServices.layer)
        )
      ),
      Effect.scoped,
      Effect.result,
      Effect.provide(BunServices.layer),
      Effect.runPromise
    );

    Result.match(result, {
      onFailure: (failure) => {
        expect(JSON.stringify(failure)).not.toContain(secret);
        Match.value(failure).pipe(
          Match.tag("DocsDeploymentOrphanInventoryReadError", (error) =>
            expect(error.operation).toBe("github-open-pull-requests")
          ),
          Match.orElse(() => expect.unreachable())
        );
      },
      onSuccess: () => expect.unreachable(),
    });
  });
});
