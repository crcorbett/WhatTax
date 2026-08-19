import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import type { Page } from "playwright";

const origin = process.env.TAXKIT_DOCS_HOSTED_URL;
const candidateCommit = process.env.TAXKIT_DOCS_CANDIDATE_COMMIT;
const deploymentId = process.env.TAXKIT_DOCS_DEPLOYMENT_ID;
const versionId = process.env.TAXKIT_DOCS_VERSION_ID;
const workerName = process.env.TAXKIT_DOCS_WORKER_NAME;
const stage = process.env.TAXKIT_DOCS_STAGE;
const acceptedPlanSha256 = process.env.TAXKIT_DOCS_PLAN_SHA256;
const configSha256 = process.env.TAXKIT_DOCS_CONFIG_SHA256;
const deploymentInputSha256 = process.env.TAXKIT_DOCS_DEPLOYMENT_INPUT_SHA256;
const lockfileSha256 = process.env.TAXKIT_DOCS_LOCKFILE_SHA256;
const accountId = process.env.TAXKIT_DOCS_ACCOUNT_ID;
const stateStoreId = process.env.TAXKIT_DOCS_STATE_STORE_ID;
const previousVersionId = process.env.TAXKIT_DOCS_PREVIOUS_VERSION_ID ?? null;
const previewPrNumberValue = process.env.TAXKIT_DOCS_PREVIEW_PR_NUMBER;
const previewPrNumber =
  previewPrNumberValue === undefined
    ? null
    : Number.parseInt(previewPrNumberValue, 10);
const rollbackRecoveryIdentity =
  process.env.TAXKIT_DOCS_ROLLBACK_RECOVERY_IDENTITY;
const environment = process.env.TAXKIT_DOCS_ENVIRONMENT;
const evidenceDirectory = process.env.TAXKIT_DOCS_EVIDENCE_DIRECTORY;

assert.ok(
  origin !== undefined && /^https:\/\/[^/]+\.workers\.dev$/u.test(origin)
);
assert.match(candidateCommit ?? "", /^[a-f0-9]{40}$/u);
assert.match(accountId ?? "", /^[a-f0-9]{32}$/u);
assert.ok(stateStoreId !== undefined && stateStoreId.length > 0);
assert.ok(deploymentId !== undefined && deploymentId.length > 0);
assert.ok(versionId !== undefined && versionId.length > 0);
assert.ok(workerName !== undefined && workerName.length > 0);
assert.match(stage ?? "", /^(?:prod|pr-[1-9]\d*)$/u);
for (const digest of [
  acceptedPlanSha256,
  configSha256,
  deploymentInputSha256,
  lockfileSha256,
]) {
  assert.match(digest ?? "", /^[a-f0-9]{64}$/u);
}
assert.ok(
  rollbackRecoveryIdentity !== undefined && rollbackRecoveryIdentity.length > 0
);
assert.match(environment ?? "", /^(?:preview|production|rollback)$/u);
assert.ok(
  previewPrNumber === null ||
    (Number.isInteger(previewPrNumber) && previewPrNumber > 0)
);
assert.match(
  evidenceDirectory ?? "",
  /^docs\/evidence\/deployments\/[A-Za-z0-9._/-]+$/u
);
assert.doesNotMatch(evidenceDirectory ?? "", /(?:^|\/)\.\.(?:\/|$)/u);

const repositoryRoot = new URL("../../../", import.meta.url);
const candidateAbbreviation = candidateCommit?.slice(0, 7);
const desktopEvidencePath = `${evidenceDirectory}/${environment}-desktop-${candidateAbbreviation}.png`;
const mobileEvidencePath = `${evidenceDirectory}/${environment}-mobile-${candidateAbbreviation}.png`;
const desktopScreenshot = new URL(desktopEvidencePath, repositoryRoot);
const mobileScreenshot = new URL(mobileEvidencePath, repositoryRoot);
const knownPath = "/guides/calculate-australian-take-home-pay";
const missingPath = "/__docs-evidence__/missing";
const runtimeProofHeaders = {
  "x-taxkit-docs-runtime-proof": "construction-count",
};
const hostedPropagationAttempts = 6;
const hostedPropagationDelayMs = 2000;

const fetchHostedResponse = async (
  input: string,
  init: RequestInit | undefined,
  expectedStatus: number
) => {
  let response = await fetch(input, init);
  for (
    let attempt = 1;
    attempt < hostedPropagationAttempts &&
    (response.status === 404 || response.status >= 500) &&
    response.status !== expectedStatus;
    attempt += 1
  ) {
    await Bun.sleep(hostedPropagationDelayMs);
    response = await fetch(input, init);
  }
  return response;
};

const parseRgb = (value: string): readonly [number, number, number] => {
  const channels = value.match(/\d+(?:\.\d+)?/gu)?.map(Number);
  assert.ok(channels !== undefined && channels.length >= 3);
  return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0];
};

const relativeLuminance = (color: readonly [number, number, number]) =>
  color
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    )
    .reduce(
      (luminance, channel, index) =>
        luminance + channel * ([0.2126, 0.7152, 0.0722][index] ?? 0),
      0
    );

const assertComputedContrast = async (page: Page) => {
  const colors = await page.evaluate(() => {
    const foreground = document.querySelector(".docs-article p");
    const background = document.querySelector(":root");
    if (
      !(foreground instanceof HTMLElement) ||
      !(background instanceof HTMLElement)
    ) {
      throw new Error("The contrast target was unavailable.");
    }
    return {
      background: getComputedStyle(background).backgroundColor,
      foreground: getComputedStyle(foreground).color,
    };
  });
  const foreground = relativeLuminance(parseRgb(colors.foreground));
  const background = relativeLuminance(parseRgb(colors.background));
  const ratio =
    (Math.max(foreground, background) + 0.05) /
    (Math.min(foreground, background) + 0.05);
  assert.ok(ratio >= 4.5);
  return Number(ratio.toFixed(2));
};

const initialResponse = await fetchHostedResponse(
  `${origin}${knownPath}`,
  { headers: runtimeProofHeaders },
  200
);
const initialHtml = await initialResponse.text();
assert.equal(initialResponse.status, 200);
assert.match(initialHtml, /Calculate Australian take-home pay/u);
assert.equal(
  initialResponse.headers.get("x-taxkit-docs-runtime-constructions"),
  "1"
);
const firstIsolate = initialResponse.headers.get(
  "x-taxkit-docs-runtime-isolate"
);
assert.ok(firstIsolate !== null && firstIsolate.length > 0);

const assetPath = /(?:src|href)="(\/assets\/[^"]+\.(?:css|js))"/u.exec(
  initialHtml
)?.[1];
assert.ok(assetPath !== undefined);
const assetResponse = await fetchHostedResponse(
  `${origin}${assetPath}`,
  undefined,
  200
);
const assetBody = await assetResponse.text();
assert.equal(assetResponse.status, 200);
assert.match(
  assetResponse.headers.get("content-type") ?? "",
  /css|javascript/u
);
assert.match(
  assetResponse.headers.get("cache-control") ?? "",
  /max-age=31536000/u
);
assert.match(assetResponse.headers.get("cache-control") ?? "", /immutable/u);
assert.match(
  assetResponse.headers.get("cache-control") ?? "",
  /(?:^|,\s*)public(?:,|$)/u
);
assert.ok((assetResponse.headers.get("etag") ?? "").length > 0);
assert.doesNotMatch(assetBody.slice(0, 100), /<!doctype html>/iu);

const missingResponse = await fetch(`${origin}${missingPath}`, {
  headers: runtimeProofHeaders,
});
const missingHtml = await missingResponse.text();
assert.equal(missingResponse.status, 404);
assert.match(missingHtml, /Documentation page not found/u);
assert.equal(
  missingResponse.headers.get("x-taxkit-docs-runtime-constructions"),
  "1"
);
const secondIsolate = missingResponse.headers.get(
  "x-taxkit-docs-runtime-isolate"
);
assert.ok(secondIsolate !== null && secondIsolate.length > 0);
assert.equal(firstIsolate, secondIsolate);

const browser = await chromium.launch({ headless: true });
const browserVersion = browser.version();
const page = await browser.newPage({
  viewport: { height: 1000, width: 1440 },
});
const diagnostics: string[] = [];
let documentRequests = 0;
const serverFunctionResponses: {
  readonly method: string;
  readonly status: number;
  readonly url: string;
}[] = [];

page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    diagnostics.push(`${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) =>
  diagnostics.push(`pageerror: ${error.message}`)
);
page.on("requestfailed", (request) =>
  diagnostics.push(
    `requestfailed: ${request.url()} ${request.failure()?.errorText ?? ""}`
  )
);
page.on("request", (request) => {
  if (request.resourceType() === "document") {
    documentRequests += 1;
  }
});
page.on("response", (response) => {
  const request = response.request();
  if (
    (request.resourceType() === "fetch" || request.resourceType() === "xhr") &&
    new URL(response.url()).pathname.startsWith("/_serverFn/")
  ) {
    serverFunctionResponses.push({
      method: request.method(),
      status: response.status(),
      url: response.url(),
    });
  }
});

await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
await page
  .getByRole("heading", { name: "Calculate Australian take-home pay" })
  .waitFor();
assert.equal(await page.getByRole("main").count(), 1);
assert.equal(await page.getByRole("article").count(), 1);
assert.equal(
  await page.getByRole("navigation", { name: "Documentation" }).count(),
  1
);
const contrastRatio = await assertComputedContrast(page);
const navigationDocumentBaseline = documentRequests;
const navigationServerFunctionBaseline = serverFunctionResponses.length;
await page
  .getByRole("navigation", { name: "Documentation" })
  .getByRole("link", { exact: true, name: "Reference" })
  .first()
  .click();
await page.getByRole("heading", { exact: true, name: "Reference" }).waitFor();
assert.equal(documentRequests, navigationDocumentBaseline);
assert.ok(serverFunctionResponses.length > navigationServerFunctionBaseline);
assert.ok(
  serverFunctionResponses
    .slice(navigationServerFunctionBaseline)
    .every(({ status }) => status === 200)
);

const observedServerFunction =
  serverFunctionResponses[navigationServerFunctionBaseline];
assert.ok(observedServerFunction !== undefined);
const malformedResponse = await page.request.fetch(observedServerFunction.url, {
  data: "{",
  headers: { "content-type": "application/json" },
  method: "POST",
});
assert.ok(malformedResponse.status() >= 400);
assert.ok(malformedResponse.status() < 500);

await page.evaluate(async (path) => {
  const router: unknown = Reflect.get(globalThis, "__TSR_ROUTER__");
  const navigate =
    typeof router === "object" && router !== null
      ? Reflect.get(router, "navigate")
      : undefined;
  if (typeof navigate !== "function") {
    throw new TypeError("The hydrated TanStack router was unavailable.");
  }
  await Reflect.apply(navigate, router, [{ to: path }]);
}, missingPath);
await page.getByTestId("route-not-found").waitFor();
assert.equal(documentRequests, navigationDocumentBaseline);

await page.goto(`${origin}/start`, { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
const skipLink = page.getByRole("link", { name: "Skip to documentation" });
assert.equal(
  await skipLink.evaluate((element) => element === document.activeElement),
  true
);
await page.keyboard.press("Enter");
assert.equal(
  await page.evaluate(() => document.activeElement?.id === "docs-main"),
  true
);

await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
await page
  .getByRole("heading", { name: "Calculate Australian take-home pay" })
  .waitFor();
await page.screenshot({
  fullPage: true,
  path: fileURLToPath(desktopScreenshot),
});

const mobilePage = await browser.newPage({
  deviceScaleFactor: 1,
  viewport: { height: 844, width: 390 },
});
mobilePage.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") {
    diagnostics.push(`mobile ${message.type()}: ${message.text()}`);
  }
});
mobilePage.on("pageerror", (error) =>
  diagnostics.push(`mobile pageerror: ${error.message}`)
);
mobilePage.on("requestfailed", (request) =>
  diagnostics.push(
    `mobile requestfailed: ${request.url()} ${request.failure()?.errorText ?? ""}`
  )
);
await mobilePage.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
await mobilePage.getByRole("button", { name: "Open navigation" }).click();
await mobilePage.getByRole("button", { name: "Close navigation" }).waitFor();
await mobilePage.screenshot({
  fullPage: true,
  path: fileURLToPath(mobileScreenshot),
});

assert.deepEqual(diagnostics, []);
await browser.close();

const digest = async (url: URL) =>
  createHash("sha256")
    .update(await readFile(url))
    .digest("hex");

process.stdout.write(
  `${JSON.stringify(
    {
      acceptedPlanSha256,
      accessibility: {
        contrastRatio,
        labelledArticle: true,
        labelledMain: true,
        labelledNavigation: true,
        skipLinkFocus: true,
      },
      accountId,
      asset: {
        cacheControl: assetResponse.headers.get("cache-control"),
        contentType: assetResponse.headers.get("content-type"),
        etagPresent: true,
        path: assetPath,
        status: assetResponse.status,
      },
      browser: { name: "chromium", version: browserVersion },
      candidateCommit,
      configSha256,
      deploymentId,
      deploymentInputSha256,
      diagnostics,
      direct404: missingResponse.status,
      environment,
      initialSsr: initialResponse.status,
      lockfileSha256,
      malformedServerFunctionStatus: malformedResponse.status(),
      navigation: {
        client404WithoutDocumentReload: true,
        documentRequestsAdded: 0,
        serverFunctionResponses: serverFunctionResponses.length,
      },
      previewPrNumber,
      previousVersionId,
      rollbackRecoveryIdentity,
      runtime: {
        constructionCounts: [1, 1],
        firstIsolate,
        sameObservedIsolate: firstIsolate === secondIsolate,
        secondIsolate,
      },
      screenshots: [
        {
          kind: "desktop",
          path: desktopEvidencePath,
          sha256: await digest(desktopScreenshot),
          viewport: { deviceScaleFactor: 1, height: 1000, width: 1440 },
        },
        {
          kind: "mobile",
          path: mobileEvidencePath,
          sha256: await digest(mobileScreenshot),
          viewport: { deviceScaleFactor: 1, height: 844, width: 390 },
        },
      ],
      stage,
      stateStoreId,
      url: origin,
      versionId,
      workerName,
    },
    null,
    2
  )}\n`
);
