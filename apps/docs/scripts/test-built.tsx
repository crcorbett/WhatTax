import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import type { Page } from "playwright";
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

const sha256File = async (file: URL) =>
  createHash("sha256")
    .update(new Uint8Array(await Bun.file(file).arrayBuffer()))
    .digest("hex");

const sha256Directory = async (directory: URL) => {
  const files = globalThis.Array.fromAsync(
    new Bun.Glob("**/*").scan({
      cwd: fileURLToPath(directory),
      onlyFiles: true,
    })
  );
  const hash = createHash("sha256");
  const directoryFiles = await files;

  for (const path of directoryFiles.toSorted()) {
    hash.update(path);
    hash.update("\0");
    hash.update(
      new Uint8Array(await Bun.file(new URL(path, directory)).arrayBuffer())
    );
    hash.update("\0");
  }

  return hash.digest("hex");
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

const assertComputedContrast = async (
  page: Page,
  foregroundSelector: string,
  backgroundSelector: string
) => {
  const colors = await page.evaluate(
    ({ background, foreground }) => {
      const foregroundElement = document.querySelector(foreground);
      const backgroundElement = document.querySelector(background);

      if (
        !(foregroundElement instanceof HTMLElement) ||
        !(backgroundElement instanceof HTMLElement)
      ) {
        throw new Error("The contrast target was unavailable.");
      }

      return {
        background: getComputedStyle(backgroundElement).backgroundColor,
        foreground: getComputedStyle(foregroundElement).color,
      };
    },
    { background: backgroundSelector, foreground: foregroundSelector }
  );
  const foregroundLuminance = relativeLuminance(parseRgb(colors.foreground));
  const backgroundLuminance = relativeLuminance(parseRgb(colors.background));
  const ratio =
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

  assert.ok(
    ratio >= 4.5,
    `${foregroundSelector} contrast ratio ${ratio.toFixed(2)} must be at least 4.5.`
  );
};

if (candidate !== undefined) {
  assert.match(candidate, /^[a-f0-9]{40}$/u);
  assert.equal(
    candidate,
    normalizedCommit,
    "The screenshot candidate must equal the checked-out commit."
  );
  const worktreeStatus =
    await Bun.$`git -C ${fileURLToPath(repositoryRoot)} status --porcelain=v1 --untracked-files=all`.text();

  assert.equal(
    worktreeStatus.trim(),
    "",
    "Final screenshot capture requires a clean committed candidate."
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
const browserVersion = browser.version();
const builtOutputDigest = await sha256Directory(
  new URL(".vercel/output/", appRoot)
);

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

  if (screenshotRequested) {
    await mkdir(screenshotRoot, { recursive: true });
  }

  await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
  const representativeHeading = page.getByRole("heading", {
    name: "Calculate Australian take-home pay",
  });
  await representativeHeading.waitFor();

  assert.equal(
    await page.evaluate(() => document.activeElement === document.body),
    true,
    "Initial hydration must not steal focus."
  );
  assert.equal(await page.getByRole("main").count(), 1);
  assert.equal(await page.getByRole("article").count(), 1);
  assert.equal(
    await page.getByRole("navigation", { name: "Documentation" }).count(),
    1
  );
  assert.equal(
    await page
      .getByRole("navigation", { name: "Documentation" })
      .getByRole("link", {
        name: "Calculate Australian take-home pay",
      })
      .getAttribute("aria-current"),
    "page"
  );
  await assertComputedContrast(page, ".docs-article p", ":root");
  await assertComputedContrast(
    page,
    '.docs-nav__link[aria-current="page"]',
    '.docs-nav__link[aria-current="page"]'
  );

  if (screenshotRequested) {
    await page.screenshot({
      path: fileURLToPath(
        new URL("01-page-desktop-1440x1000.png", screenshotRoot)
      ),
    });
  }

  const clientNavigationDocumentBaseline = documentRequests;
  await page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { exact: true, name: "Reference" })
    .first()
    .click();
  await page.getByRole("heading", { exact: true, name: "Reference" }).waitFor();
  await page.waitForFunction(
    () => document.activeElement?.id === "docs-page-heading"
  );
  assert.equal(
    await page.evaluate(
      () => document.activeElement?.id === "docs-page-heading"
    ),
    true
  );
  assert.equal(documentRequests, clientNavigationDocumentBaseline);

  await page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { name: "Calculate Australian take-home pay" })
    .click();
  await representativeHeading.waitFor();
  await page
    .getByRole("article")
    .getByRole("link", { name: "Install the SDK" })
    .click();
  await page.getByRole("heading", { name: "Install the SDK" }).waitFor();
  await page.waitForFunction(
    () => document.activeElement?.id === "docs-page-heading"
  );
  assert.equal(page.url(), `${origin}/start/install-the-sdk`);
  assert.equal(
    await page.evaluate(
      () => document.activeElement?.id === "docs-page-heading"
    ),
    true
  );
  assert.equal(documentRequests, clientNavigationDocumentBaseline);

  await page.goBack();
  await representativeHeading.waitFor();
  await page.goForward();
  await page.getByRole("heading", { name: "Install the SDK" }).waitFor();
  assert.equal(documentRequests, clientNavigationDocumentBaseline);

  await page.goto(`${origin}/start`, { waitUntil: "networkidle" });
  assert.equal(
    await page.evaluate(() => document.activeElement === document.body),
    true
  );
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to documentation" });
  assert.equal(
    await skipLink.evaluate((element) => element === document.activeElement),
    true
  );
  assert.deepEqual(
    await skipLink.evaluate((element) => {
      const style = getComputedStyle(element);

      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        visible: element.getBoundingClientRect().top >= 0,
      };
    }),
    { outlineStyle: "solid", outlineWidth: "3px", visible: true }
  );

  if (screenshotRequested) {
    await page.screenshot({
      path: fileURLToPath(
        new URL("03-skip-link-focus-desktop-1440x1000.png", screenshotRoot)
      ),
    });
  }

  await page.keyboard.press("Enter");
  assert.equal(
    await page.evaluate(() => document.activeElement?.id === "docs-main"),
    true
  );

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
  const navigationToggle = page.getByRole("button", {
    name: "Open navigation",
  });
  await navigationToggle.click();
  assert.equal(
    await page
      .getByRole("button", { name: "Close navigation" })
      .getAttribute("aria-expanded"),
    "true"
  );
  await page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { name: "Calculate Australian take-home pay" })
    .waitFor();
  await assertComputedContrast(page, ".docs-nav-toggle", ".docs-nav-toggle");

  if (screenshotRequested) {
    await page.screenshot({
      path: fileURLToPath(
        new URL("02-nav-mobile-open-390x844.png", screenshotRoot)
      ),
    });
  }

  await page.setViewportSize({ height: 1000, width: 1440 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}${knownPath}`, { waitUntil: "networkidle" });
  const motionStyles = await page
    .locator(
      ".docs-page-layout, .docs-nav, .docs-nav-toggle, .docs-article, .docs-route-state"
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);

        return {
          animationName: style.animationName,
          transitionDuration: style.transitionDuration,
        };
      })
    );
  assert.ok(
    motionStyles.every(
      (style) =>
        style.animationName === "none" && style.transitionDuration === "0s"
    ),
    "The docs UI must not depend on visually relevant motion."
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.goto(`${origin}/start`, { waitUntil: "networkidle" });
  const pendingDocumentBaseline = documentRequests;
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
  await assertComputedContrast(page, ".docs-route-state p", ":root");

  if (screenshotRequested) {
    await page.screenshot({
      path: fileURLToPath(
        new URL("04-pending-desktop-1440x1000.png", screenshotRoot)
      ),
    });
  }

  await pendingNavigation;
  await page.unroute("**/*");
  await representativeHeading.waitFor();
  assert.equal(documentRequests, pendingDocumentBaseline);

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
  await assertComputedContrast(page, ".docs-route-state p", ":root");

  assert.ok(
    serverFunctionRequests > 0,
    "Hydrated route navigation must exercise the server-function transport."
  );
  assert.deepEqual(diagnostics, []);

  const recoverableMarkup = renderToStaticMarkup(
    <main className="docs-app-shell">
      <div className="docs-page-layout">
        <nav
          aria-label="Documentation"
          className="docs-nav"
          data-open="true"
          id="docs-navigation"
        >
          <a className="docs-nav__home" href="/">
            TaxKit Docs
          </a>
        </nav>
        <DocsRecoverableError
          message={recoverableSourceError.message}
          onRetry={() => false}
        />
      </div>
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
    await assertComputedContrast(page, ".docs-route-state p", ":root");
    await assertComputedContrast(
      page,
      ".docs-route-state button",
      ".docs-route-state button"
    );
    await page.screenshot({
      path: fileURLToPath(
        new URL("05-recoverable-error-desktop-1440x1000.png", screenshotRoot)
      ),
    });

    const screenshotDefinitions = [
      {
        expectedVisiblePostcondition:
          "Labelled navigation, current guide, heading and body content are readable without clipping.",
        file: "01-page-desktop-1440x1000.png",
        fixture: null,
        journey:
          "Direct representative guide load settled after built-app hydration.",
        limitations: [
          "Does not prove SSR response content, hydration diagnostics, contrast or console cleanliness.",
        ],
        observedVisiblePostcondition:
          "Labelled navigation, current guide, heading and representative body content are visible without clipping.",
        route: knownPath,
        viewport: { height: 1000, width: 1440 },
      },
      {
        expectedVisiblePostcondition:
          "The responsive navigation is visibly open and identifies the current guide.",
        file: "02-nav-mobile-open-390x844.png",
        fixture: null,
        journey:
          "Direct representative guide load at the narrow breakpoint with the real responsive navigation opened.",
        limitations: [
          "Does not prove keyboard operability, focus behavior, client routing or document-request behavior.",
        ],
        observedVisiblePostcondition:
          "The expanded navigation trigger, open navigation and current guide are visible with the main content retained.",
        route: knownPath,
        viewport: { height: 844, width: 390 },
      },
      {
        expectedVisiblePostcondition:
          "The first Tab reveals the focused Skip to documentation link.",
        file: "03-skip-link-focus-desktop-1440x1000.png",
        fixture: null,
        journey: "Fresh direct /start load followed by the first Tab keypress.",
        limitations: [
          "Does not prove tab order, activation, eventual focus target or contrast.",
        ],
        observedVisiblePostcondition:
          "The Skip to documentation link and its focus indicator are visible.",
        route: "/start",
        viewport: { height: 1000, width: 1440 },
      },
      {
        expectedVisiblePostcondition: delayedPageLoad.visiblePostcondition,
        file: "04-pending-desktop-1440x1000.png",
        fixture: {
          id: delayedPageLoad.id,
          owner: "apps/docs/test/fixtures/visual-states.ts",
        },
        journey:
          "Client navigation from /start to the representative guide while the test-owned page load is held pending.",
        limitations: [
          "Does not prove loader transport, request type, eventual completion, motion behavior or console cleanliness.",
        ],
        observedVisiblePostcondition:
          "The stable app surface and unambiguous Loading documentation state are visible without destructive collapse.",
        route: delayedPageLoad.path,
        viewport: { height: 1000, width: 1440 },
      },
      {
        expectedVisiblePostcondition:
          recoverableSourceError.visiblePostcondition,
        file: "05-recoverable-error-desktop-1440x1000.png",
        fixture: {
          id: recoverableSourceError.id,
          owner: "apps/docs/test/fixtures/visual-states.ts",
        },
        journey:
          "Test-only recoverable source-failure composition with its admitted retry surface.",
        limitations: [
          "The fixture is not a production route.",
          "Does not prove error tagging, Schema.Exit restoration, retry success or console cleanliness.",
        ],
        observedVisiblePostcondition:
          "The navigation shell, sanitized unavailable message and retry affordance are visible without a raw cause or machine path.",
        route: null,
        viewport: { height: 1000, width: 1440 },
      },
      {
        expectedVisiblePostcondition: "Documentation page not found",
        file: "06-not-found-desktop-1440x1000.png",
        fixture: null,
        journey: "Direct load of the genuinely unmatched reserved path.",
        limitations: [
          "Does not prove HTTP 404 status or client/initial parity.",
        ],
        observedVisiblePostcondition:
          "The framework-owned Documentation page not found surface is visible.",
        route: missingPath,
        viewport: { height: 1000, width: 1440 },
      },
    ] as const;
    const screenshots = await Promise.all(
      screenshotDefinitions.map(async (definition) => ({
        ...definition,
        sha256: await sha256File(new URL(definition.file, screenshotRoot)),
      }))
    );
    const artifactRoot =
      candidate === undefined
        ? "tmp/docs-built/provisional-screenshots"
        : `docs/exec-plans/active/docs-application-architecture/screenshots/${candidate}`;
    const manifest = {
      artifactRoot,
      artifactSafety: {
        browserChrome: false,
        machinePaths: false,
        privateContent: false,
        secretsOrAuthorizationData: false,
      },
      browser: {
        name: "Chromium",
        version: browserVersion,
      },
      builtOutput: {
        path: "apps/docs/.vercel/output",
        sha256: builtOutputDigest,
      },
      candidate: candidate ?? normalizedCommit,
      captureCommand:
        candidate === undefined
          ? "bun run --filter=docs test:built -- --screenshots"
          : `bun run --filter=docs test:built -- --screenshots --candidate=${candidate}`,
      capturedAt: new Date().toISOString(),
      cleanWorktreePrecondition: candidate !== undefined,
      evidenceClass:
        candidate === undefined
          ? "provisional-uncommitted"
          : "committed-final-candidate",
      limitations: [
        "This is local built-candidate visual evidence only; it does not establish deployment, provider routing, a public URL, production behavior or public availability.",
        "Screenshots supplement the independent HTTP, Playwright, accessibility, computed-style, request-trace and console oracles.",
      ],
      nonClaims: [
        "No screenshot proves HTTP status, SSR response content, hydration diagnostics, navigation request type, keyboard or focus behavior, contrast, reduced-motion suppression or console cleanliness.",
        "No screenshot or manifest proves publication, deployment, hosting, canonical identity or public-site behavior.",
      ],
      owner: "DOCS-APP-006 built-app harness",
      reducedMotion: {
        behavioralEvidence:
          "The built harness emulates prefers-reduced-motion: reduce and asserts animationName=none and transitionDuration=0s on the app shell, navigation, article and route-state surfaces.",
        codeEvidence: "apps/docs/src/styles.css",
        file: null,
        journey:
          "Representative guide with prefers-reduced-motion: reduce and all visually relevant app surfaces inspected.",
        reason:
          "No visually relevant CSS animation or transition exists in the app shell, navigation, article or route-state surfaces.",
        status: "not_applicable",
        viewport: { height: 1000, width: 1440 },
      },
      reviewer: {
        owner: "taxkit-product-owner",
        status: "pending-primary-owner-visual-review",
      },
      schemaVersion: 1,
      screenshots,
    };
    const serializedManifest = `${JSON.stringify(manifest, null, 2)}\n`;

    assert.equal(
      serializedManifest.includes(fileURLToPath(repositoryRoot)),
      false
    );
    assert.equal(serializedManifest.includes("/Users/"), false);
    assert.equal(serializedManifest.includes("127.0.0.1"), false);

    await Bun.write(
      new URL("manifest.json", screenshotRoot),
      serializedManifest
    );
  }

  console.log(
    `Built docs proof passed: SSR=200, missing=404, clientNavigationDocuments=0, totalDocuments=${documentRequests}, serverFunctions=${serverFunctionRequests}, diagnostics=0.`
  );
} finally {
  await Promise.allSettled(waitUntilTasks);
  await browser.close();
  await server.stop(true);
}
