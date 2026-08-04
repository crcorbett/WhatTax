import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

const workflowPaths = {
  orphan: ".github/workflows/docs-orphan-inventory.yml",
  preview: ".github/workflows/docs-preview.yml",
  production: ".github/workflows/docs-production.yml",
  teardown: ".github/workflows/docs-preview-teardown.yml",
} as const;

const readWorkflow = (path: string) => readFile(path, "utf-8");

describe("docs deployment workflow admission", () => {
  test("keeps every deployment workflow exact-SHA and pinned", async () => {
    for (const path of [
      workflowPaths.orphan,
      workflowPaths.preview,
      workflowPaths.production,
      workflowPaths.teardown,
    ]) {
      const source = await readWorkflow(path);
      expect(source).not.toContain("pull_request_target");
      expect(source).toContain(
        "actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5"
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

  test("installs the browser needed by the docs build before provider mutation", async () => {
    for (const path of [
      workflowPaths.preview,
      workflowPaths.production,
      workflowPaths.teardown,
    ]) {
      const source = await readWorkflow(path);
      expect(source).toContain(
        "apps/docs/node_modules/.bin/playwright install --with-deps chromium"
      );
    }
  });

  test("materializes only the ephemeral Alchemy state-store cache before inventory", async () => {
    for (const path of [
      workflowPaths.preview,
      workflowPaths.production,
      workflowPaths.teardown,
    ]) {
      const source = await readWorkflow(path);
      expect(source).toContain(
        'ALCHEMY_PLAIN=1 CI=0 bunx alchemy cloudflare bootstrap --profile "$ALCHEMY_PROFILE" --worker-name alchemy-state-store'
      );
    }
  });

  test("keeps mutation locks non-cancellable and report-only work cancellable", async () => {
    for (const path of [workflowPaths.preview, workflowPaths.production]) {
      const source = await readWorkflow(path);
      expect(source).toContain("cancel-in-progress: false");
      expect(source).toContain("CLOUDFLARE_ACCOUNT_ID");
      expect(source).toContain("CLOUDFLARE_API_TOKEN");
      expect(source).toContain(
        'test "$ACCEPTED_PLAN_SHA256" = "$replan_sha256"'
      );
      expect(source).toContain("replanSha256");
    }
    const teardown = await readWorkflow(workflowPaths.teardown);
    expect(teardown).toContain("cancel-in-progress: false");
    expect(teardown).toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(teardown).toContain("CLOUDFLARE_API_TOKEN");
    const orphan = await readWorkflow(workflowPaths.orphan);
    expect(orphan).toContain("cancel-in-progress: true");
    expect(orphan).toContain("CLOUDFLARE_READ_API_TOKEN");
    expect(orphan).not.toContain("alchemy deploy");
    expect(orphan).not.toContain("alchemy destroy");
  });

  test("uses the four exact protected environment identities", async () => {
    const [preview, production, teardown, orphan] = await Promise.all([
      readWorkflow(workflowPaths.preview),
      readWorkflow(workflowPaths.production),
      readWorkflow(workflowPaths.teardown),
      readWorkflow(workflowPaths.orphan),
    ]);
    expect(preview).toContain("environment: taxkit-docs-preview");
    expect(production).toContain("environment: taxkit-docs-production");
    expect(teardown).toContain("environment: taxkit-docs-preview-teardown");
    expect(orphan).toContain("environment: github-actions-report-only");
  });

  test("keeps the first default-branch bootstrap source-bound", async () => {
    const preview = await readWorkflow(workflowPaths.preview);
    expect(preview).toContain(
      'test "$(jq -r .head.sha <<<"$pr_json")" = "$CANDIDATE_SHA"'
    );
    expect(preview).toContain('test "$(jq -r .merged <<<"$pr_json")" = "true"');
    expect(preview).toContain('test "$(jq -r .draft <<<"$pr_json")" = "true"');
  });

  test("binds PR-close teardown to the current default-branch source", async () => {
    const teardown = await readWorkflow(workflowPaths.teardown);
    const githubExpression = [
      "$",
      "{{ inputs.reviewed_workflow_sha || github.sha }}",
    ].join("");
    expect(teardown).toContain(`REVIEWED_WORKFLOW_SHA: ${githubExpression}`);
    expect(teardown).not.toContain("github.event.pull_request.base.sha");
  });
});
