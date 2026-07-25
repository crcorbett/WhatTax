import { describe, expect, it } from "@effect/vitest";
import { Effect, Option, Schema } from "effect";

import { DocsSourcePath } from "../schemas.js";
import {
  getNavigation,
  validateContent,
  validateMdxComponentPolicy,
  validationSummary,
} from "./policy.js";

describe("docs content validation policy", () => {
  it.effect("decodes navigation through the canonical schema", () =>
    Effect.gen(function* () {
      const navigation = yield* getNavigation;

      expect(navigation.contentRoot).toBe("packages/docs-content/content");
      expect(navigation.primaryNavigation.length).toBeGreaterThan(0);
    })
  );

  it.effect("validates the current public docs corpus", () =>
    Effect.gen(function* () {
      const result = yield* validateContent;

      expect(result.issues).toEqual([]);
      expect(Option.isNone(validationSummary(result))).toBe(true);
    })
  );

  it.effect(
    "validates MDX component usage outside code spans and fences",
    () => {
      const source = Schema.decodeUnknownSync(DocsSourcePath)(
        "content/start/quickstart.mdx"
      );

      return Effect.gen(function* () {
        const safeIssues = yield* validateMdxComponentPolicy(
          source,
          [
            "`SdkCalculatorRunResponse<Report>` is inline code.",
            "```tsx",
            "<UnsafeComponent />",
            "```",
          ].join("\n")
        );
        const unsafeIssues = yield* validateMdxComponentPolicy(
          source,
          "<UnsafeComponent />"
        );

        expect(safeIssues).toEqual([]);
        expect(unsafeIssues).toMatchObject([
          {
            message: "MDX component not allowed: UnsafeComponent",
            path: [source],
          },
        ]);
      });
    }
  );
});
