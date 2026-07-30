import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import * as docsConfig from "@taxkit/docs-content/source.config";
import viteReact from "@vitejs/plugin-react";
import * as Effect from "effect/Effect";
import fumadocsMdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { docsBuildTargetConfig } from "./src/lib/build/docs-build-target";

export default defineConfig(async ({ command }) => {
  const useSourceWorkspacePackages = command !== "build";
  const buildTarget = Effect.runSync(docsBuildTargetConfig);

  return {
    plugins: [
      await fumadocsMdx(docsConfig, {
        configPath: "../../packages/docs-content/source.config.ts",
        outDir: "../../packages/docs-content/.source",
      }),
      buildTarget === "cloudflare"
        ? cloudflare({ viteEnvironment: { name: "ssr" } })
        : undefined,
      tanstackStart({
        server: {
          entry: "server",
        },
      }),
      viteReact(),
      buildTarget === "nitro"
        ? nitro({
            preset: "vercel",
            vercel: {
              functions: {
                runtime: "nodejs22.x",
              },
            },
          })
        : undefined,
    ],
    resolve: {
      conditions: useSourceWorkspacePackages ? ["source"] : undefined,
      tsconfigPaths: true,
    },
    ssr: {
      noExternal: [/^@taxkit\/docs-content/u, /^@taxkit\/docs-fumadocs/u],
      resolve: useSourceWorkspacePackages
        ? {
            conditions: ["source", "node"],
          }
        : undefined,
    },
  };
});
