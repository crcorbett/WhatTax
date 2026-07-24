import { Effect, Schema } from "effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";

import { GovernanceInputError } from "./schemas.js";

export const readGovernanceJson = <A>(
  repositoryRoot: string,
  target: string,
  schema: Schema.ConstraintDecoder<A>
): Effect.Effect<A, GovernanceInputError, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* readGovernanceJsonAtBoundary() {
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const source = yield* fileSystem
      .readFileString(path.join(repositoryRoot, target))
      .pipe(Effect.mapError(() => new GovernanceInputError({ target })));

    return yield* Schema.decodeUnknownEffect(Schema.fromJsonString(schema), {
      onExcessProperty: "error",
    })(source).pipe(
      Effect.mapError(() => new GovernanceInputError({ target }))
    );
  });

export const repositoryRootFromUrl = (source: URL) =>
  Path.Path.pipe(
    Effect.flatMap((path) => path.fromFileUrl(source)),
    Effect.mapError(
      () => new GovernanceInputError({ target: "repository-root" })
    )
  );
