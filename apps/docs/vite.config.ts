import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import * as docsConfig from "@taxkit/docs-content/source.config";
import viteReact from "@vitejs/plugin-react";
import fumadocsMdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";

export default defineConfig(async () => {
  const alchemyOwnsCloudflareVite =
    // oxlint-disable-next-line effect/no-process-outside-boundaries -- Vite configuration is the exact host boundary for Alchemy's documented process-local injection signal.
    process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

  const docsMdx = await fumadocsMdx(docsConfig, {
    configPath: "../../packages/docs-content/source.config.ts",
    outDir: "../../packages/docs-content/.source",
  });
  const originalDocsMdxBuildStart = docsMdx.buildStart;
  if (typeof originalDocsMdxBuildStart !== "function") {
    throw new TypeError("Fumadocs Vite plugin must expose a buildStart hook.");
  }
  let docsMdxBuildStartResult: Promise<unknown> | undefined;
  const docsMdxForBuild = {
    ...docsMdx,
    buildStart: () => {
      docsMdxBuildStartResult ??= Promise.resolve(originalDocsMdxBuildStart());
      return docsMdxBuildStartResult;
    },
    sharedDuringBuild: true,
  };

  return {
    plugins: [
      // Fumadocs writes the generated collection modules during buildStart.
      // TanStack Start uses Vite's client and server environments, so leave
      // this generator in the shared build phase and do not run it once per
      // environment. Otherwise the two MDX transforms can observe different
      // generated content and React can reject hydration in the deployed app.
      docsMdxForBuild,
      ...(alchemyOwnsCloudflareVite
        ? []
        : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
      tanstackStart({
        server: {
          entry: "server",
        },
      }),
      viteReact(),
    ],
    resolve: {
      conditions: ["source"],
      tsconfigPaths: true,
    },
    ssr: {
      noExternal: [/^@taxkit\/docs-content/u, /^@taxkit\/docs-fumadocs/u],
      resolve: {
        conditions: ["source", "node"],
      },
    },
  };
});
