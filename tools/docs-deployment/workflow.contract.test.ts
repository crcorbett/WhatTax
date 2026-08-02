import { describe, expect, test } from "bun:test";

const workflows = {
  preview: ".github/workflows/docs-preview.yml",
  production: ".github/workflows/docs-production.yml",
  teardown: ".github/workflows/docs-preview-teardown.yml",
  orphan: ".github/workflows/docs-orphan-inventory.yml",
} as const;

const readWorkflow = async (path: string) => Bun.file(path).text();

describe("docs deployment workflow admission", () => {
  test("keeps every deployment workflow exact-SHA and pinned", async () => {
    for (const path of Object.values(workflows)) {
      const source = await readWorkflow(path);
      expect(source).not.toContain("pull_request_target");
      expect(source).toContain(
        "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d"
      );
      expect(source).toContain(
        "oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6"
      );
      expect(source).toContain(
        "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a"
      );
      expect(source).toContain("bun install --frozen-lockfile");
      expect(source).toContain("persist-credentials: false");
    }
  });

  test("keeps mutation locks non-cancellable and report-only work cancellable", async () => {
    for (const path of [workflows.preview, workflows.production]) {
      const source = await readWorkflow(path);
      expect(source).toContain("cancel-in-progress: false");
      expect(source).toContain("CLOUDFLARE_ACCOUNT_ID");
      expect(source).toContain("CLOUDFLARE_API_TOKEN");
      expect(source).toContain('test "$ACCEPTED_PLAN_SHA256" = "$replan_sha256"');
      expect(source).toContain("replanSha256");
    }
    const teardown = await readWorkflow(workflows.teardown);
    expect(teardown).toContain("cancel-in-progress: false");
    expect(teardown).toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(teardown).toContain("CLOUDFLARE_API_TOKEN");
    const orphan = await readWorkflow(workflows.orphan);
    expect(orphan).toContain("cancel-in-progress: true");
    expect(orphan).toContain("CLOUDFLARE_READ_API_TOKEN");
    expect(orphan).not.toContain("alchemy deploy");
    expect(orphan).not.toContain("alchemy destroy");
  });

  test("uses the four exact protected environment identities", async () => {
    const [preview, production, teardown, orphan] = await Promise.all(
      Object.values(workflows).map(readWorkflow)
    );
    expect(preview).toContain("environment: taxkit-docs-preview");
    expect(production).toContain("environment: taxkit-docs-production");
    expect(teardown).toContain("environment: taxkit-docs-preview-teardown");
    expect(orphan).toContain("environment: github-actions-report-only");
  });
});
