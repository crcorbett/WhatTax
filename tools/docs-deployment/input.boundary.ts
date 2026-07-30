import { Effect, Schema } from "effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";

import { DocsDeploymentInputError } from "./schemas.js";

export const readDeploymentJson = <A>(
  repositoryRoot: string,
  target: string,
  schema: Schema.ConstraintDecoder<A>
): Effect.Effect<
  A,
  DocsDeploymentInputError,
  FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* readDeploymentJsonAtBoundary() {
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const source = yield* fileSystem
      .readFileString(path.join(repositoryRoot, target))
      .pipe(Effect.mapError(() => new DocsDeploymentInputError({ target })));

    return yield* Schema.decodeUnknownEffect(Schema.fromJsonString(schema), {
      onExcessProperty: "error",
    })(source).pipe(
      Effect.mapError(() => new DocsDeploymentInputError({ target }))
    );
  });

export const readDeploymentSha256 = (
  repositoryRoot: string,
  target: string
): Effect.Effect<
  string,
  DocsDeploymentInputError,
  FileSystem.FileSystem | Path.Path
> =>
  Effect.gen(function* readDeploymentSha256AtBoundary() {
    const fileSystem = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const bytes = yield* fileSystem
      .readFile(path.join(repositoryRoot, target))
      .pipe(Effect.mapError(() => new DocsDeploymentInputError({ target })));
    return new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
  });
