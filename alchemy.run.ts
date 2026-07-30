import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Command from "alchemy/Command";
import * as Output from "alchemy/Output";
import { Stack } from "alchemy/Stack";
import { Stage } from "alchemy/Stage";
import * as Effect from "effect/Effect";

import {
  decodeDocsDeploymentStage,
  docsCloudflareStackName,
  docsWorkerAssetOutputDirectory,
  docsWorkerCompatibilityDate,
  docsWorkerCompatibilityFlags,
  docsWorkerGeneratedMain,
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
    const build = yield* Command.Build("DocsBuild", {
      command: "bun run build:cloudflare",
      cwd: "apps/docs",
      memo: false,
      outdir: "dist",
    });
    const worker = yield* Cloudflare.Worker(docsWorkerResourceId, {
      assets: Output.interpolate`${build.outdir}/${docsWorkerAssetOutputDirectory}`,
      bundle: false,
      compatibility: {
        date: docsWorkerCompatibilityDate,
        flags: [...docsWorkerCompatibilityFlags],
      },
      main: Output.interpolate`${build.outdir}/server/${docsWorkerGeneratedMain}`,
      observability: docsWorkerObservability,
      subdomain: {
        enabled: true,
        previewsEnabled: false,
      },
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
