import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import { renderToStaticMarkup } from "react-dom/server";

import { DocsRecoverableError } from "../src/components/docs-route-states";
import {
  delayedPageLoad,
  recoverableSourceError,
} from "../test/fixtures/visual-states";

const appRoot = new URL("../", import.meta.url);
const repositoryRoot = new URL("../../", appRoot);
const screenshotRequested = process.argv.includes("--screenshots");
const candidateArgument = process.argv.find((argument) =>
  argument.startsWith("--candidate=")
);
const candidate = candidateArgument?.slice("--candidate=".length);
const currentCommit =
  await Bun.$`git -C ${fileURLToPath(repositoryRoot)} rev-parse HEAD`.text();
const normalizedCommit = currentCommit.trim();

if (candidate !== undefined) {
  assert.match(candidate, /^[a-f0-9]{40}$/u);
  assert.equal(
    candidate,
    normalizedCommit,
    "The screenshot candidate must equal the checked-out commit."
  );
}

const screenshotRoot =
  candidate === undefined
    ? new URL("../../tmp/docs-built/provisional-screenshots/", appRoot)
    : new URL(
        `../../docs/exec-plans/active/docs-application-architecture/screenshots/${candidate}/`,
        appRoot
      );

const builtModule: unknown = await import(
  new URL(".vercel/output/functions/__server.func/index.mjs", appRoot).href
);
const builtHandler =
  typeof builtModule === "object" && builtModule !== null
    ? Reflect.get(builtModule, "default")
    : undefined;

assert.equal(typeof builtHandler, "object");

const builtFetch =
  typeof builtHandler === "object" && builtHandler !== null
    ? Reflect.get(builtHandler, "fetch")
    : undefined;

assert.equal(typeof builtFetch, "function");

const staticRoot = new URL(".vercel/output/static/", appRoot);
const waitUntilTasks = new Set<Promise<unknown>>();
const server = Bun.serve({
  fetch: async (request) => {
    const { pathname } = new URL(request.url);

    if (pathname.includes("..")) {
      return new Response("Invalid asset path", { status: 400 });
    }

    const asset = Bun.file(new URL(pathname.replace(/^\//u, ""), staticRoot));

    if (pathname !== "/" && (await asset.exists())) {
      return new Response(asset, {
        headers: {
          "content-type": asset.type,
        },
      });
    }

    const response: unknown = await Reflect.apply(builtFetch, builtHandler, [
      request,
      {
        waitUntil: (promise: Promise<unknown>) => {
          waitUntilTasks.add(promise);
          void promise.then(
            () => waitUntilTasks.delete(promise),
            () => waitUntilTasks.delete(promise)
          );
        },
      },
    ]);

    assert.ok(response instanceof Response);

    return response;
  },
  hostname: "127.0.0.1",
  port: 0,
});
const { origin } = server.url;
const knownPath = "/guides/calculate-australian-take-home-pay";
const missingPath = "/__docs-evidence__/missing";
const browser = await chromium.launch({ headless: true });

try {
  let ready = false;

  for (let attempt = 0; attempt < 20 && !ready; attempt += 1) {
    try {
      const readinessResponse = await fetch(origin);
      ready = readinessResponse.status < 500;
    } catch {
      ready = false;
    }

    if (!ready) {
      await Bun.sleep(50);
    }
  }

  assert.ok(ready, "The built docs server did not become ready.");

  const knownResponse = await fetch(`${origin}${knownPath}`);
  const knownHtml = await knownResponse.text();

  assert.equal(knownResponse.status, 200);
  assert.match(knownHtml, /Calculate Australian take-home pay/u);

  const missingResponse = await fetch(`${origin}${missingPath}`);
  const missingHtml = await missingResponse.text();

  assert.equal(missingResponse.status, 404);
  assert.match(missingHtml, /Documentation page not found/u);

  const page = await browser.newPage({
    viewport: { height: 1000, width: 1440 },
  });
  const diagnostics: string[] = [];
  let documentRequests = 0;
  let serverFunctionRequests = 0;

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      diagnostics.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    diagnostics.push(`pageerror: ${error.message}`);
  });
  page.on("request", (request) => {
    if (request.resourceType() === "document") {
      documentRequests += 1;
    }
    if (
      request.resourceType() === "fetch" ||
      request.resourceType() === "xhr"
    ) {
      serverFunctionRequests += 1;
    }
  });

  await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
  await page
    .getByRole("heading", {
      name: "Calculate Australian take-home pay",
    })
    .waitFor();

  await page.route("**/*", async (route) => {
    const resourceType = route.request().resourceType();

    if (resourceType === "fetch" || resourceType === "xhr") {
      await Bun.sleep(delayedPageLoad.delayMs);
    }

    await route.continue();
  });
  const pendingNavigation = page.evaluate(async (path) => {
    const router: unknown = Reflect.get(globalThis, "__TSR_ROUTER__");

    if (typeof router !== "object" || router === null) {
      throw new Error("The hydrated TanStack router was unavailable.");
    }

    const navigate: unknown = Reflect.get(router, "navigate");

    if (typeof navigate !== "function") {
      throw new TypeError(
        "The hydrated TanStack navigate operation was unavailable."
      );
    }

    await Reflect.apply(navigate, router, [{ to: path }]);
  }, delayedPageLoad.path);

  await page.getByTestId("route-pending").waitFor();
  await page
    .getByRole("heading", { name: delayedPageLoad.visiblePostcondition })
    .waitFor();

  if (screenshotRequested) {
    await mkdir(screenshotRoot, { recursive: true });
    await page.screenshot({
      path: fileURLToPath(
        new URL("04-pending-desktop-1440x1000.png", screenshotRoot)
      ),
    });
  }

  await pendingNavigation;
  await page.unroute("**/*");
  await page.getByRole("heading", { name: "Reference" }).waitFor();

  await page.evaluate(async (path) => {
    const router: unknown = Reflect.get(globalThis, "__TSR_ROUTER__");

    if (typeof router !== "object" || router === null) {
      throw new Error("The hydrated TanStack router was unavailable.");
    }

    const navigate: unknown = Reflect.get(router, "navigate");

    if (typeof navigate !== "function") {
      throw new TypeError(
        "The hydrated TanStack navigate operation was unavailable."
      );
    }

    await Reflect.apply(navigate, router, [{ to: path }]);
  }, missingPath);
  await page.getByTestId("route-not-found").waitFor();

  assert.equal(documentRequests, 1);
  assert.ok(
    serverFunctionRequests > 0,
    "Hydrated route navigation must exercise the server-function transport."
  );
  assert.deepEqual(diagnostics, []);

  const recoverableMarkup = renderToStaticMarkup(
    <main className="docs-app-shell">
      <DocsRecoverableError message={recoverableSourceError.message} />
    </main>
  );

  assert.match(
    recoverableMarkup,
    new RegExp(recoverableSourceError.visiblePostcondition, "u")
  );

  if (screenshotRequested) {
    await page.screenshot({
      path: fileURLToPath(
        new URL("06-not-found-desktop-1440x1000.png", screenshotRoot)
      ),
    });

    const styles = await Bun.file(new URL("src/styles.css", appRoot)).text();

    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${styles}</style></head><body>${recoverableMarkup}</body></html>`
    );
    await page
      .getByRole("heading", {
        name: recoverableSourceError.visiblePostcondition,
      })
      .waitFor();
    await page.screenshot({
      path: fileURLToPath(
        new URL("05-recoverable-error-desktop-1440x1000.png", screenshotRoot)
      ),
    });

    const manifest = {
      candidate: candidate ?? normalizedCommit,
      evidenceClass:
        candidate === undefined
          ? "provisional-uncommitted"
          : "committed-final-candidate",
      limitations: [
        "Screenshots supplement and do not prove HTTP status, SSR, hydration, navigation request type, console cleanliness, focus, contrast or reduced motion.",
        "The recoverable error image uses the narrow test-only recoverable-source-error composition fixture and is not a production route.",
      ],
      screenshots: [
        {
          file: "04-pending-desktop-1440x1000.png",
          fixture: delayedPageLoad.id,
          route: delayedPageLoad.path,
          viewport: "1440x1000",
          visiblePostcondition: delayedPageLoad.visiblePostcondition,
        },
        {
          file: "05-recoverable-error-desktop-1440x1000.png",
          fixture: recoverableSourceError.id,
          route: null,
          viewport: "1440x1000",
          visiblePostcondition: recoverableSourceError.visiblePostcondition,
        },
        {
          file: "06-not-found-desktop-1440x1000.png",
          fixture: null,
          route: missingPath,
          viewport: "1440x1000",
          visiblePostcondition: "Documentation page not found",
        },
      ],
    };

    await Bun.write(
      new URL("manifest.json", screenshotRoot),
      `${JSON.stringify(manifest, null, 2)}\n`
    );
  }

  console.log(
    `Built docs proof passed: SSR=200, missing=404, documents=${documentRequests}, serverFunctions=${serverFunctionRequests}, diagnostics=0.`
  );
} finally {
  await Promise.allSettled(waitUntilTasks);
  await browser.close();
  await server.stop(true);
}
