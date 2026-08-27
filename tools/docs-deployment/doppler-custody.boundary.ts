import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Record from "effect/Record";
import * as Schema from "effect/Schema";
import { parse } from "yaml";

import {
  DopplerCustodyError,
  DopplerUserConfig,
} from "./local-doppler.schemas.js";

const KeyringReference = Schema.String.check(
  Schema.isPattern(/^secret-[a-z0-9-]+$/iu)
);

const readDopplerConfig = (configPath: string) =>
  Effect.gen(function* readConfig() {
    const fileSystem = yield* FileSystem.FileSystem;
    const info = yield* fileSystem
      .stat(configPath)
      .pipe(
        Effect.mapError(
          () => new DopplerCustodyError({ reason: "config-file" })
        )
      );
    if (info.mode % 0o100 !== 0) {
      return yield* new DopplerCustodyError({ reason: "config-mode" });
    }
    const contents = yield* fileSystem
      .readFileString(configPath)
      .pipe(
        Effect.mapError(
          () => new DopplerCustodyError({ reason: "config-file" })
        )
      );
    const unknownConfig = yield* Effect.try({
      catch: () => new DopplerCustodyError({ reason: "config-shape" }),
      try: (): unknown => parse(contents),
    });
    return yield* Schema.decodeUnknownEffect(DopplerUserConfig)(
      unknownConfig
    ).pipe(
      Effect.mapError(() => new DopplerCustodyError({ reason: "config-shape" }))
    );
  });

export const checkDopplerCustody = (
  repositoryRoot: string,
  configPath: string
) =>
  Effect.gen(function* dopplerCustody() {
    const path = yield* Path.Path;
    const config = yield* readDopplerConfig(configPath);
    const root = `${path.resolve(repositoryRoot)}${path.sep}`;
    const token = Option.map(
      Array.reduce(
        Record.toEntries(config.scoped),
        Option.none<{ readonly scopeLength: number; readonly token: string }>(),
        (selected, entry) => {
          const [scope, options] = entry;
          const normalizedScope = `${path.resolve(scope)}${path.sep}`;
          const scopedToken = options.token;
          if (
            scopedToken === undefined ||
            scopedToken.length === 0 ||
            !root.startsWith(normalizedScope)
          ) {
            return selected;
          }
          return Option.match(selected, {
            onNone: () =>
              Option.some({
                scopeLength: normalizedScope.length,
                token: scopedToken,
              }),
            onSome: (current) =>
              normalizedScope.length > current.scopeLength
                ? Option.some({
                    scopeLength: normalizedScope.length,
                    token: scopedToken,
                  })
                : selected,
          });
        }
      ),
      (selected) => selected.token
    );
    const selectedToken = yield* Option.match(token, {
      onNone: () =>
        Effect.fail(new DopplerCustodyError({ reason: "scoped-token" })),
      onSome: Effect.succeed,
    });
    yield* Schema.decodeUnknownEffect(KeyringReference)(selectedToken).pipe(
      Effect.mapError(
        () => new DopplerCustodyError({ reason: "system-keyring-reference" })
      )
    );
  });
