import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import { Stage } from "alchemy/Stage";
import * as Effect from "effect/Effect";

import {
  decodeDocsDeploymentStage,
  docsCloudflareStackName,
  docsWorkerAssetHeaders,
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
        // Cloudflare Workers Assets does not infer the app-owned `_headers`
        // file when the config is passed through Website.Vite. Pass the same
        // closed header policy through the native Alchemy asset config so
        // fingerprinted assets retain their immutable cache contract.
        headers: docsWorkerAssetHeaders,
        // Let Cloudflare serve fingerprinted Vite assets directly before the
        // TanStack Start Worker handles application routes. This is the
        // supported full-stack default and keeps missing assets as real 404s.
        runWorkerFirst: false,
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
