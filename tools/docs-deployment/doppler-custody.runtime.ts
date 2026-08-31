import { homedir } from "node:os";

import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Console, Effect, Match } from "effect";
import * as Path from "effect/Path";

import { checkDopplerCustody } from "./doppler-custody.boundary.js";

const program = Effect.gen(function* dopplerCustodyCheck() {
  const path = yield* Path.Path;
  yield* checkDopplerCustody(
    process.cwd(),
    path.join(homedir(), ".doppler", ".doppler.yaml")
  );
  yield* Console.log("Doppler custody check passed.");
}).pipe(
  Effect.tapErrorTag("DopplerCustodyError", (error) =>
    Console.error(`FAIL [doppler-custody] reason=${error.reason}`)
  ),
  Effect.provide(BunServices.layer)
);

Match.value(import.meta.main).pipe(
  Match.when(true, () =>
    BunRuntime.runMain(program, { disableErrorReporting: true })
  ),
  Match.orElse(() => false)
);
