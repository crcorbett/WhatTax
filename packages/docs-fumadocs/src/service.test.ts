import { describe, expect, it } from "@effect/vitest";
import { Effect, Match } from "effect";

import { makeFumadocsSourceLive } from "./live.layer.js";
import { FumadocsSource } from "./service.js";
import { makeFumadocsSourceTest } from "./test.layer.js";

const guide = {
  browserPath: "guides/example.mdx",
  frontmatter: {
    description: "A deterministic guide.",
    status: "draft",
    title: "Guide",
  },
  markdown: "# Guide",
  slugs: ["guides", "example"],
  sourcePath: "content/guides/example.mdx",
} as const;

describe("FumadocsSource", () => {
  it.effect(
    "uses the same named operations through the deterministic Layer",
    () =>
      Effect.gen(function* () {
        const source = yield* FumadocsSource;
        const page = yield* source.getPage(["guides", "example"]);
        const pages = yield* source.listPages();

        expect(page).toEqual(guide);
        expect(pages).toEqual([guide]);
      }).pipe(Effect.provide(makeFumadocsSourceTest([guide])))
  );

  it.effect("returns a tagged missing-page error", () =>
    Effect.gen(function* () {
      const source = yield* FumadocsSource;
      return yield* source.getPage(["missing"]);
    }).pipe(
      Effect.provide(makeFumadocsSourceTest([guide])),
      Effect.flip,
      Effect.tap((error) =>
        Effect.sync(() => {
          expect(error._tag).toBe("FumadocsPageNotFoundError");
        })
      )
    )
  );

  it.effect(
    "maps a thrown generated-loader failure to a safe tagged error",
    () =>
      Effect.gen(function* () {
        const source = yield* FumadocsSource;
        return yield* source.listPages();
      }).pipe(
        Effect.provide(
          makeFumadocsSourceLive({
            getPage: () => guide,
            listPages: () => {
              throw new Error("provider detail");
            },
          })
        ),
        Effect.flip,
        Effect.tap((error) =>
          Effect.sync(() => {
            expect(error._tag).toBe("FumadocsSourceLoadError");
            expect(error.message).toBe("The Fumadocs page listing failed.");
            expect(error.operation).toBe("listPages");
            expect(JSON.stringify(error)).not.toContain("provider detail");
          })
        )
      )
  );

  it.effect("rejects malformed generated representations at ingress", () =>
    Effect.gen(function* () {
      const source = yield* FumadocsSource;
      return yield* source.getPage(["guides", "example"]);
    }).pipe(
      Effect.provide(
        makeFumadocsSourceLive({
          getPage: () => ({ ...guide, markdown: 42 }),
          listPages: () => [guide],
        })
      ),
      Effect.flip,
      Effect.tap((error) =>
        Effect.sync(() => {
          expect(error._tag).toBe("FumadocsSourceLoadError");
          Match.value(error).pipe(
            Match.tags({
              FumadocsPageNotFoundError: (notFoundError) => {
                expect(notFoundError._tag).toBe("FumadocsSourceLoadError");
              },
              FumadocsSourceLoadError: (sourceError) => {
                expect(sourceError.operation).toBe("getPage");
              },
            }),
            Match.exhaustive
          );
        })
      )
    )
  );
});
