import { describe, expect, test } from "vitest";

import { classifyDocsHref } from "./components";

describe("docs MDX link policy", () => {
  test.each([
    ["../sdk/plain-sdk.mdx", "/guides/example", "/sdk/plain-sdk"],
    [
      "../sdk/plain-sdk.mdx?mode=safe#errors",
      "/guides/example",
      "/sdk/plain-sdk?mode=safe#errors",
    ],
    ["/reference/index.mdx", "/guides/example", "/reference/index"],
    [
      "?mode=safe#errors",
      "/guides/example",
      "/guides/example?mode=safe#errors",
    ],
  ])("classifies %s as router-native", (href, currentPath, expected) => {
    expect(classifyDocsHref(href, currentPath)).toEqual({
      kind: "router",
      to: expected,
    });
  });

  test.each([
    ["#errors"],
    ["https://example.com/docs"],
    ["mailto:maintainer@example.com"],
    ["//cdn.example.com/file"],
    ["../../../../packages/sdk/typescript/src/index.ts"],
  ])("retains %s as an ordinary anchor", (href) => {
    expect(classifyDocsHref(href, "/guides/example")).toEqual({
      href,
      kind: "anchor",
    });
  });
});
