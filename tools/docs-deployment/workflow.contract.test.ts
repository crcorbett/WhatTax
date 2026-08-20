import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

const workflowPaths = {
  preview: ".github/workflows/docs-preview.yml",
  production: ".github/workflows/docs-production.yml",
  receipts: ".github/workflows/docs-deployment-workflow-receipts.yml",
  teardown: ".github/workflows/docs-preview-teardown.yml",
} as const;

const readWorkflow = (path: string) => readFile(path, "utf-8");
const workflowRunApiReadback = [
  'run_json="$(gh api "repos/',
  "$",
  "{GITHUB_REPOSITORY}/actions/runs/",
  "$",
  '{SOURCE_RUN_ID}")"',
].join("");
const cacheActionSha = "55cc8345863c7cc4c66a329aec7e433d2d1c52a9";
const cacheRestoreAction = `actions/cache/restore@${cacheActionSha}`;
const cacheSaveAction = `actions/cache/save@${cacheActionSha}`;
const checkoutAction =
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1";

describe("docs deployment workflow admission", () => {
  test("keeps every deployment workflow exact-SHA and pinned", async () => {
    for (const path of [
      workflowPaths.preview,
      workflowPaths.production,
      workflowPaths.teardown,
    ]) {
      const source = await readWorkflow(path);
      expect(source).not.toContain("pull_request_target");
      expect(source).toContain(checkoutAction);
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
        "apps/docs/node_modules/.bin/playwright install chromium"
      );
      expect(source).not.toContain(
        "apps/docs/node_modules/.bin/playwright install --with-deps chromium"
      );
    }
  });

  test("keeps remote, Bun and Chromium caches bounded to live setup", async () => {
    const [preview, production, receipts, teardown] = await Promise.all([
      readWorkflow(workflowPaths.preview),
      readWorkflow(workflowPaths.production),
      readWorkflow(workflowPaths.receipts),
      readWorkflow(workflowPaths.teardown),
    ]);
    const workflowEntries = [
      ["preview", preview],
      ["production", production],
      ["receipts", receipts],
      ["teardown", teardown],
    ] as const;
    const turboTeamBinding = ["TURBO_TEAM: $", "{{ vars.TURBO_TEAM }}"].join(
      ""
    );
    const turboTokenBinding = [
      "TURBO_TOKEN: $",
      "{{ secrets.TURBO_TOKEN }}",
    ].join("");
    const bunCacheKeyPrefix = ["bun-packages-$", "{{ runner.os }}-"].join("");
    const playwrightCacheKeyPrefix = [
      "playwright-chromium-$",
      "{{ runner.os }}-",
    ].join("");
    for (const [, source] of workflowEntries) {
      expect(source).toContain(checkoutAction);
      expect(source).toContain("TURBO_CACHE: local:rw,remote:rw");
      expect(source).toContain(turboTeamBinding);
      expect(source).toContain(turboTokenBinding);
      expect(source).toContain(cacheRestoreAction);
      expect(source).toContain(cacheSaveAction);
      expect(source).toContain('echo "path=$(bun pm cache)"');
      expect(source).toContain(bunCacheKeyPrefix);
      expect(source).not.toContain(
        ["bun-packages-$", "{{ github.event_name }}"].join("")
      );
      expect(source).toContain("hashFiles('.bun-version')");
      expect(source).toContain("hashFiles('bun.lock')");
      expect(source).toContain("bun install --frozen-lockfile");
      expect(source).not.toContain("path: node_modules");
      expect(source.indexOf(cacheRestoreAction)).toBeLessThan(
        source.indexOf("bun install --frozen-lockfile")
      );
      expect(source.indexOf(cacheSaveAction)).toBeGreaterThan(
        source.indexOf("bun install --frozen-lockfile")
      );
      expect(source).toContain(
        "steps.bun-cache-restore.outputs.cache-hit != 'true'"
      );
    }
    for (const [name, source] of workflowEntries) {
      const expectedActionCount = name === "receipts" ? 1 : 2;
      expect(source.split(cacheRestoreAction)).toHaveLength(
        expectedActionCount + 1
      );
      expect(source.split(cacheSaveAction)).toHaveLength(
        expectedActionCount + 1
      );
      if (name === "receipts") {
        expect(source).not.toContain("playwright-chromium-");
        continue;
      }
      expect(source).toContain(
        'echo "PLAYWRIGHT_BROWSERS_PATH=$RUNNER_TEMP/ms-playwright"'
      );
      expect(source).toContain(playwrightCacheKeyPrefix);
      expect(source).not.toContain(
        ["playwright-chromium-$", "{{ github.event_name }}"].join("")
      );
      expect(source).toContain("steps.playwright-identity.outputs.version");
      expect(source.indexOf("playwright-cache-restore")).toBeLessThan(
        source.indexOf("playwright install chromium")
      );
      expect(source.lastIndexOf(cacheSaveAction)).toBeGreaterThan(
        source.indexOf("playwright install chromium")
      );
      expect(source).toContain(
        "steps.playwright-cache-restore.outputs.cache-hit != 'true'"
      );
    }
  });

  test("routes repository checks through cache-safe Turbo tasks", async () => {
    const [packageSource, turboSource] = await Promise.all([
      readFile("package.json", "utf-8"),
      readFile("turbo.json", "utf-8"),
    ]);
    expect(packageSource).toContain(
      '"docs:build": "turbo run build --filter=docs"'
    );
    for (const command of [
      "check:docs-deployment-inventory",
      "check:docs-deployment-workflow-proof",
      "check:docs-deployment-workflow-input",
      "check:docs-deployment-workflow-run",
      "check:docs-deployment-workflow-plan",
      "check:docs-deployment-workflow-teardown-proof",
    ]) {
      expect(packageSource).toContain(`turbo run //#${command}:task`);
      expect(turboSource).toContain(`"//#${command}:task": {`);
    }
    expect(turboSource.split('"cache": false')).toHaveLength(9);
    expect(turboSource).toContain('"passThroughEnv": ["TAXKIT_*"]');
    expect(turboSource).toContain(
      '"passThroughEnv": ["ALCHEMY_PROFILE", "CLOUDFLARE_*", "TAXKIT_*"]'
    );
  });

  test("materializes only the ephemeral Alchemy state-store cache before inventory", async () => {
    for (const path of [
      workflowPaths.preview,
      workflowPaths.production,
      workflowPaths.teardown,
    ]) {
      const source = await readWorkflow(path);
      expect(source).toContain(
        'ALCHEMY_PLAIN=1 CI=1 bunx alchemy login --profile "$ALCHEMY_PROFILE" > /dev/null'
      );
      expect(source).toContain(
        'ALCHEMY_PLAIN=1 CI=0 bunx alchemy cloudflare bootstrap --profile "$ALCHEMY_PROFILE" --worker-name alchemy-state-store'
      );
    }
  });

  test("builds provider-free proof and hashes the native Website inputs before mutation", async () => {
    for (const path of [workflowPaths.preview, workflowPaths.production]) {
      const source = await readWorkflow(path);
      expect(source).toContain("run: bun run docs:build");
      expect(source).toContain(
        "git ls-files -z -- alchemy.run.ts apps/docs packages/docs-content packages/docs-fumadocs"
      );
      expect(source).not.toContain("find apps/docs/dist");
    }
  });

  test("keeps mutation locks non-cancellable", async () => {
    const planCancellation = [
      "cancel-in-progress: ",
      "$",
      "{{ inputs.operation == 'plan' }}",
    ].join("");
    for (const path of [workflowPaths.preview, workflowPaths.production]) {
      const source = await readWorkflow(path);
      expect(source).toContain("checks: read");
      expect(source).toContain(planCancellation);
      expect(source).toContain("CLOUDFLARE_ACCOUNT_ID");
      expect(source).toContain("CLOUDFLARE_API_TOKEN");
      expect(source).toContain(
        'test "$ACCEPTED_PLAN_SHA256" = "$replan_sha256"'
      );
      expect(source).toContain("unexpected_replan_resources");
      expect(source).toContain("wrangler deployments list");
      expect(source).toContain(
        'bun apps/docs/scripts/test-cloudflare-hosted.tsx > "$RUNNER_TEMP/docs-deployment/hosted-proof.raw.json"'
      );
      expect(source).toContain(
        'previousVersionId:(if .previousVersionId == "" then null else .previousVersionId end)'
      );
      expect(source).toContain("check:docs-deployment-workflow-proof");
      expect(source).toContain("check:docs-deployment-workflow-plan");
      expect(source).toContain("TAXKIT_WORKFLOW_PLAN_OPERATION");
      expect(source).toContain("TAXKIT_DOCS_CANDIDATE_COMMIT");
      expect(source).toContain("hosted-proof.raw.json");
      expect(source).toContain("hosted-proof.json");
      expect(source).toContain("TAXKIT_WORKFLOW_SCREENSHOT_ROOT");
      expect(source).toContain("sed -E 's:/*$::'");
      expect(source).toContain("check:docs-deployment-workflow-input");
      expect(source).toContain("workflow-input.json");
      expect(source).not.toContain("Materialize successful");
      expect(source).not.toContain("workflow-run.json");
      expect(source).toContain("all_replan_resources");
      expect(source).toContain("docs/evidence/deployments");
      expect(source).toContain("configSha256");
      expect(source).toContain("deploymentInputSha256");
      expect(source).toContain("lockfileSha256");
      expect(source).toContain("replanSha256");
    }
    const production = await readWorkflow(workflowPaths.production);
    expect(production).toContain(
      'hosted_rollback_identity="$TAXKIT_DOCS_ROLLBACK_RECOVERY_IDENTITY"'
    );
    expect(production).toContain(
      'hosted_rollback_identity="production-$GITHUB_RUN_ID"'
    );
    expect(production).toContain(
      'test "$hosted_rollback_identity" = "$(jq -er \'.rollbackRecoveryIdentity\' "$RUNNER_TEMP/docs-deployment/provider-readback.json")"'
    );
    expect(production).toContain(
      'env -u TAXKIT_DOCS_PREVIEW_PR_NUMBER \\\n            TAXKIT_DOCS_ROLLBACK_RECOVERY_IDENTITY="$hosted_rollback_identity" \\\n            bun apps/docs/scripts/test-cloudflare-hosted.tsx'
    );
    const teardown = await readWorkflow(workflowPaths.teardown);
    expect(teardown).toContain("cancel-in-progress: false");
    expect(teardown).toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(teardown).toContain("CLOUDFLARE_API_TOKEN");
    expect(teardown).toContain("provider-inventory-before.json");
    expect(teardown).toContain("provider-inventory-pre-destroy.json");
    expect(teardown).toContain("provider-inventory-pre-destroy.stderr.txt");
    expect(teardown).toContain("provider-inventory-pre-destroy.attempts.txt");
    expect(teardown).toContain("read_inventory");
    expect(teardown).toContain("inventory_status");
    expect(teardown).toContain("stderr_bytes");
    expect(teardown).toContain("stage_count_before");
    expect(teardown).toContain("unexpected_destroy_resources");
    expect(teardown).toContain(
      "grep -Ev '^[[][0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]+)?[]] [A-Z]+ '"
    );
    expect(teardown).toContain("grep -E '^[[][^]]+[]] '");
    expect(teardown).toContain(
      "grep -Ev '^[[](DocsBuild|DocsWebsite)[]] (delete|noop)$'"
    );
    expect(teardown).toContain(
      "grep -E '^[[](DocsBuild|DocsWebsite)[]] delete$'"
    );
    expect(teardown).toContain("printf '%s' \"$destroy_resource_lines\"");
    expect(teardown).toContain("dry_run_status");
    expect(teardown).toContain(
      "ALCHEMY_TELEMETRY_DISABLED=1 ALCHEMY_PLAIN=1 CI=1 bun node_modules/alchemy/bin/alchemy.ts destroy --dry-run"
    );
    expect(teardown).toContain(
      "ALCHEMY_TELEMETRY_DISABLED=1 ALCHEMY_PLAIN=1 CI=1 bun node_modules/alchemy/bin/alchemy.ts destroy --stage"
    );
    expect(teardown).toContain(
      ["destroy-", "$", "{attempt}.stderr.txt"].join("")
    );
    expect(teardown).toContain("[REDACTED]");
    expect(teardown).toContain("sleep 5");
    expect(teardown).toContain("providerWorkers");
    expect(teardown).toContain(
      'select(.logicalId == "DocsWebsite" and .workerUrl == $url)'
    );
    expect(teardown).toContain(
      'select(.stage == $stage and .logicalId == "DocsWebsite" and .workerName == $worker)'
    );
    expect(teardown).toContain("provider-readback.json");
    expect(teardown).toContain("providerWorkerAbsent:true");
    expect(teardown).toContain("formerWorkerName");
    expect(teardown).toContain("formerWorkerUrl");
    expect(teardown).toContain("preexistingStage");
    expect(teardown).toContain("pulls/");
    expect(teardown).toContain('= "closed"');
    expect(teardown).toContain("grep -Eq '^[1-9][0-9]*$'");
    expect(teardown).toContain("(delete|noop)");
    expect(teardown).toContain("check:docs-deployment-workflow-teardown-proof");
    expect(teardown).toContain("check:docs-deployment-workflow-input");
    expect(teardown).not.toContain("Materialize successful");
    expect(teardown).toContain(
      "TAXKIT_WORKFLOW_PLAN_OPERATION=preview-destroy"
    );
  });

  test("shares Preview credentials for deploy and exact-stage teardown", async () => {
    const [preview, production, teardown] = await Promise.all([
      readWorkflow(workflowPaths.preview),
      readWorkflow(workflowPaths.production),
      readWorkflow(workflowPaths.teardown),
    ]);
    expect(preview).toContain("environment: taxkit-docs-preview");
    expect(production).toContain("environment: taxkit-docs-production");
    expect(teardown).toContain("environment: taxkit-docs-preview");
    expect(teardown).not.toContain("environment: taxkit-docs-preview-teardown");
  });

  test("keeps the first default-branch bootstrap source-bound", async () => {
    const preview = await readWorkflow(workflowPaths.preview);
    expect(preview).toContain(
      'test "$(jq -r .head.sha <<<"$pr_json")" = "$CANDIDATE_SHA"'
    );
    expect(preview).toContain('test "$(jq -r .merged <<<"$pr_json")" = "true"');
    expect(preview).toContain('test "$(jq -r .draft <<<"$pr_json")" = "true"');
  });

  test("accepts only a completed exact Quality success and tolerates cancelled reruns", async () => {
    const [preview, production] = await Promise.all([
      readWorkflow(workflowPaths.preview),
      readWorkflow(workflowPaths.production),
    ]);
    for (const source of [preview, production]) {
      expect(source).toContain("quality_runs=");
      expect(source).toContain('all(.[]; .status == "completed")');
      expect(source).toContain('any(.[]; .conclusion == "success")');
      expect(source).toContain(
        'all(.[]; .conclusion == "success" or .conclusion == "cancelled")'
      );
    }
  });

  test("binds PR-close teardown to the current default-branch source", async () => {
    const teardown = await readWorkflow(workflowPaths.teardown);
    const githubExpression = [
      "$",
      "{{ inputs.reviewed_workflow_sha || github.sha }}",
    ].join("");
    expect(teardown).toContain(`REVIEWED_WORKFLOW_SHA: ${githubExpression}`);
    expect(teardown).not.toContain("github.event.pull_request.base.sha");
    expect(teardown).toContain('test "$GITHUB_REF" = "refs/heads/main"');
    const cloudflareTokenExpression = [
      "$",
      "{{ secrets.CLOUDFLARE_API_TOKEN }}",
    ].join("");
    expect(teardown).not.toContain(
      `CLOUDFLARE_API_TOKEN: ${cloudflareTokenExpression}\n      PR_NUMBER:`
    );
  });

  test("binds Production mutation to a Schema-checked Preview workflow receipt", async () => {
    const production = await readWorkflow(workflowPaths.production);
    expect(production).toContain("accepted_preview_run_id");
    expect(production).toContain(
      "printf '%s' \"$ACCEPTED_PREVIEW_RUN_ID\" | grep -Eq '^[1-9][0-9]*$'"
    );
    expect(production).toContain("accepted_preview_pr_number");
    expect(production).toContain("rollback_expected_current_version_id");
    expect(production).toContain("rollback_recovery_identity");
    expect(production).toContain("actions/runs/");
    expect(production).toContain(
      [
        'preview_run="$(gh api "repos/',
        "$",
        "{GITHUB_REPOSITORY}/actions/runs/",
        "$",
        '{ACCEPTED_PREVIEW_RUN_ID}")"',
      ].join("")
    );
    expect(production).toContain(".head_sha");
    expect(production).toContain(".head_branch");
    expect(production).toContain(".name");
    expect(production).not.toContain('gh run view "$ACCEPTED_PREVIEW_RUN_ID"');
    expect(production).toContain("gh run download");
    expect(production).toContain("check:docs-deployment-workflow-proof");
    expect(production).toContain("accepted_preview_readback");
    expect(production).toContain(
      "taxkit-docs-preview-$ACCEPTED_PREVIEW_RUN_ID"
    );
    expect(production).toContain("accepted_preview_plan");
    expect(production).toContain("accepted_preview_recovery_identity");
    expect(production).toContain("TAXKIT_WORKFLOW_PLAN_REQUIRE_REPLAN=1");
    expect(production).toContain(
      "TAXKIT_WORKFLOW_PLAN_OPERATION: preview-equal-replan"
    );
    expect(production.indexOf("Check out exact candidate")).toBeLessThan(
      production.indexOf(
        "Schema-check accepted Preview provider and hosted proof"
      )
    );
    expect(production.indexOf("Check out exact candidate")).toBeLessThan(
      production.indexOf('gh run download "$ACCEPTED_PREVIEW_RUN_ID"')
    );
  });

  test("keeps teardown promotion strict at the receipt decoder", async () => {
    const [checker, boundary] = await Promise.all([
      readFile(
        "tools/docs-deployment/workflow-teardown-proof-check.runtime.ts",
        "utf-8"
      ),
      readFile("tools/docs-deployment/workflow-check.boundary.ts", "utf-8"),
    ]);
    expect(checker).toContain("readWorkflowReceipt");
    expect(boundary).toContain('onExcessProperty: "error"');
    expect(checker).toContain("providerWorkerAbsent");
    expect(checker).toContain("stateStageAbsent");
  });

  test("keeps workflow verifiers behind the shared Effect host boundary", async () => {
    const runtimePaths = [
      "tools/docs-deployment/workflow-input-check.runtime.ts",
      "tools/docs-deployment/workflow-plan-check.runtime.ts",
      "tools/docs-deployment/workflow-proof-check.runtime.ts",
      "tools/docs-deployment/workflow-run-check.runtime.ts",
      "tools/docs-deployment/workflow-teardown-proof-check.runtime.ts",
    ];
    const runtimes = await Promise.all(
      runtimePaths.map((path) => readFile(path, "utf-8"))
    );

    for (const source of runtimes) {
      expect(source).toContain("Config.schema(");
      expect(source).toContain("readWorkflowReceipt(");
      expect(source).toContain("BunRuntime.runMain(program)");
      expect(source).not.toContain("process.env");
      expect(source).not.toContain("Bun.file");
      expect(source).not.toContain("JSON.parse");
      expect(source).not.toContain("Effect.runPromise");
      expect(source).not.toContain("console.");
      expect(source).not.toContain("process.exitCode");
    }
  });

  test("reconciles completed workflow runs outside the triggering run", async () => {
    const receipts = await readWorkflow(workflowPaths.receipts);
    expect(receipts).toContain("workflow_run:");
    expect(receipts).toContain("types: [completed]");
    expect(receipts).not.toContain("branches: [main]");
    expect(receipts).toContain(workflowRunApiReadback);
    expect(receipts).toContain("TAXKIT_WORKFLOW_RUN_HEAD_SHA");
    expect(receipts).toContain("TAXKIT_WORKFLOW_CHECKOUT_SHA");
    expect(receipts).toContain("git checkout --detach");
    expect(receipts).toContain("workflow-run-candidate.json");
    expect(receipts).toContain("Promote the validated workflow receipt");
    expect(receipts).toContain(
      "always() && github.event.workflow_run.conclusion"
    );
    expect(receipts).toContain("workflowCommit:$workflowCommit");
    expect(receipts).toContain("gh run download");
    expect(receipts).toContain("check:docs-deployment-workflow-input");
    expect(receipts).toContain("check:docs-deployment-workflow-run");
    expect(receipts).toContain("workflow-run-failure.json");
    expect(receipts).toContain("actions: read");
    expect(receipts).not.toContain("secrets.CLOUDFLARE");
    expect(receipts.match(/secrets\./gu)).toHaveLength(1);
  });
});
