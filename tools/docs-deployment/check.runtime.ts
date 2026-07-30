import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Array, Console, Effect, Match } from "effect";
import * as Path from "effect/Path";

import { readDeploymentJson, readDeploymentSha256 } from "./input.boundary.js";
import {
  inspectDeploymentOwners,
  inspectGitAuthorityReceipt,
  inspectGitReadbackReceipt,
  inspectDeploymentPlanReceipt,
  inspectPreviewEvidenceChain,
  inspectPreviewMutationPreflight,
  inspectPreviewTeardownReceipt,
  inspectProviderPreflightReceipt,
  inspectResumePreflightReceipt,
  inspectScreenshotImageDigest,
} from "./policy.js";
import {
  DeploymentAuthorityPreflightReceipt,
  DeploymentApplyFailureReceipt,
  DeploymentGitAuthorityReceipt,
  DeploymentGitReadbackReceipt,
  DeploymentJourneyInventory,
  DeploymentPlanReceipt,
  DeploymentProviderPreflightReceipt,
  DeploymentProviderReadback,
  DeploymentPreviewCredentialReadbackReceipt,
  DeploymentPreviewMutationPreflightReceipt,
  DeploymentPreviewTeardownReceipt,
  DeploymentResumePreflightReceipt,
  DeploymentHostedProofReceipt,
  DeploymentScreenshotManifest,
  DocsDeploymentPolicyError,
} from "./schemas.js";

const repositoryRootUrl = new URL("../..", import.meta.url);

export const checkDocsDeployment = (repositoryRoot: string) =>
  Effect.gen(function* checkDocsDeploymentProgram() {
    const [
      inventory,
      receipt,
      gitAuthority,
      gitReadback,
      providerPreflight,
      plan,
      _failedApply,
      latestGitReadback,
      resumePreflight,
      successorPlan,
      _historicalGitReadback,
      _historicalPlan,
      _historicalProviderReadback,
      _historicalHostedProof,
      _historicalDesktopScreenshot,
      _historicalMobileScreenshot,
      _historicalDestroyPlan,
      _historicalTeardown,
      acceptedGitReadback,
      acceptedPlan,
      credentialReadback,
      deployPreflight,
      providerReadback,
      hostedProof,
      desktopScreenshot,
      mobileScreenshot,
      destroyPlan,
      destroyPreflight,
      teardown,
    ] = yield* Effect.all([
      readDeploymentJson(
        repositoryRoot,
        "docs/verification/docs-deployment-journeys.json",
        DeploymentJourneyInventory
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json",
        DeploymentAuthorityPreflightReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json",
        DeploymentGitAuthorityReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-preflight/git-readback.json",
        DeploymentGitReadbackReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/preflight.json",
        DeploymentProviderPreflightReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/plan.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/failed-apply.json",
        DeploymentApplyFailureReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/git-readback-e4e3dd9.json",
        DeploymentGitReadbackReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/resume-preflight-e4e3dd9.json",
        DeploymentResumePreflightReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-e4e3dd9.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/git-readback-0d714e6.json",
        DeploymentGitReadbackReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-0d714e6.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/provider-readback-0d714e6.json",
        DeploymentProviderReadback
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/hosted-proof-0d714e6.json",
        DeploymentHostedProofReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-desktop-0d714e6.json",
        DeploymentScreenshotManifest
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-mobile-0d714e6.json",
        DeploymentScreenshotManifest
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/destroy-plan-0d714e6.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/teardown-0d714e6.json",
        DeploymentPreviewTeardownReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/git-readback-d9cb894.json",
        DeploymentGitReadbackReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-d9cb894.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/credential-readback-d9cb894.json",
        DeploymentPreviewCredentialReadbackReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/predeploy-d9cb894.json",
        DeploymentPreviewMutationPreflightReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/provider-readback-d9cb894.json",
        DeploymentProviderReadback
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/hosted-proof-d9cb894.json",
        DeploymentHostedProofReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-desktop-d9cb894.json",
        DeploymentScreenshotManifest
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/screenshot-mobile-d9cb894.json",
        DeploymentScreenshotManifest
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/destroy-plan-d9cb894.json",
        DeploymentPlanReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/predestroy-d9cb894.json",
        DeploymentPreviewMutationPreflightReceipt
      ),
      readDeploymentJson(
        repositoryRoot,
        "docs/evidence/deployments/2026-07-30-preview-pr-1/teardown-d9cb894.json",
        DeploymentPreviewTeardownReceipt
      ),
    ]);
    const [desktopImageSha256, mobileImageSha256] = yield* Effect.all([
      readDeploymentSha256(repositoryRoot, desktopScreenshot.imagePath),
      readDeploymentSha256(repositoryRoot, mobileScreenshot.imagePath),
    ]);
    return [
      ...inspectDeploymentOwners(inventory, receipt),
      ...inspectGitAuthorityReceipt(gitAuthority),
      ...inspectGitReadbackReceipt(gitReadback),
      ...inspectProviderPreflightReceipt(providerPreflight, gitReadback),
      ...inspectDeploymentPlanReceipt(plan),
      ...inspectGitReadbackReceipt(latestGitReadback),
      ...inspectResumePreflightReceipt(
        resumePreflight,
        latestGitReadback,
        successorPlan
      ),
      ...inspectDeploymentPlanReceipt(successorPlan),
      ...inspectGitReadbackReceipt(acceptedGitReadback),
      ...inspectPreviewMutationPreflight(
        deployPreflight,
        acceptedGitReadback,
        acceptedPlan,
        receipt,
        credentialReadback
      ),
      ...inspectPreviewEvidenceChain(
        acceptedGitReadback,
        acceptedPlan,
        providerReadback,
        hostedProof,
        [desktopScreenshot, mobileScreenshot]
      ),
      ...inspectScreenshotImageDigest(desktopScreenshot, desktopImageSha256),
      ...inspectScreenshotImageDigest(mobileScreenshot, mobileImageSha256),
      ...inspectPreviewMutationPreflight(
        destroyPreflight,
        acceptedGitReadback,
        destroyPlan,
        receipt,
        credentialReadback,
        providerReadback
      ),
      ...inspectPreviewTeardownReceipt(teardown, destroyPlan, providerReadback),
    ];
  });

const program = Effect.gen(function* docsDeploymentMain() {
  const path = yield* Path.Path;
  const repositoryRoot = yield* path.fromFileUrl(repositoryRootUrl);
  const findings = yield* checkDocsDeployment(repositoryRoot);
  yield* Console.info(
    `Docs deployment validation: journeys=4; preflightReceipts=6; gitAuthorityReceipts=1; gitReadbackReceipts=4; planReceipts=6; providerReadbackReceipts=2; hostedProofReceipts=2; screenshotManifests=4; teardownReceipts=2; failedApplyReceipts=1; violations=${findings.length}; providerReadOperations=35; providerMutations=5.`
  );
  return yield* Array.match(findings, {
    onEmpty: () => Effect.void,
    onNonEmpty: (nonEmpty) =>
      Effect.fail(new DocsDeploymentPolicyError({ findings: nonEmpty })),
  });
}).pipe(
  Effect.tapErrorTag("DocsDeploymentInputError", (error) =>
    Console.error(
      `FAIL [deployment-input] target=${error.target}; recovery=repair the Schema-decoded owner or retained receipt.`
    )
  ),
  Effect.tapErrorTag("DocsDeploymentPolicyError", (error) =>
    Console.error(error.findings.join("\n"))
  ),
  Effect.provide(BunServices.layer)
);

Match.value(import.meta.main).pipe(
  Match.when(true, () => BunRuntime.runMain(program)),
  Match.orElse(() => false)
);
