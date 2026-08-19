import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import { Stage } from "alchemy/Stage";
import * as Effect from "effect/Effect";

import {
  decodeDocsDeploymentStage,
  docsCloudflareStackName,
  docsWorkerCompatibilityDate,
  docsWorkerCompatibilityFlags,
  docsWorkerObservability,
  docsWorkerResourceId,
} from "./apps/docs/src/lib/build/cloudflare-stack.js";

export default Alchemy.Stack(
  docsCloudflareStackName,
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const stack = yield* Stack;
    const stage = yield* Stage.pipe(Effect.flatMap(decodeDocsDeploymentStage));
    const worker = yield* Cloudflare.Website.Vite(docsWorkerResourceId, {
      assets: {
        runWorkerFirst: true,
      },
      compatibility: {
        date: docsWorkerCompatibilityDate,
        flags: [...docsWorkerCompatibilityFlags],
      },
      observability: docsWorkerObservability,
      rootDir: "apps/docs",
      url: true,
    });

    return {
      logicalResourceId: docsWorkerResourceId,
      stackName: stack.name,
      stage,
      workerName: worker.workerName,
      workerUrl: worker.url,
    };
  })
);
