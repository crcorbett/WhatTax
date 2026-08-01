import * as BunRuntime from "@effect/platform-bun/BunRuntime";
import * as BunServices from "@effect/platform-bun/BunServices";
import { Array, Console, Effect, Match } from "effect";
import * as Path from "effect/Path";

import { readDeploymentJson, readDeploymentSha256 } from "./input.boundary.js";
import { DocsDeploymentOrphanInventoryReceipt } from "./orphan-inventory.schemas.js";
import { inspectDocsDeploymentOrphanInventoryReceipt } from "./orphan-inventory.service.js";
import {
  inspectDeploymentOwners,
  inspectGitAuthorityReceipt,
  inspectGitReadbackReceipt,
  inspectDeploymentPlanReceipt,
  inspectInitialProductionPreflight,
  inspectPreviewEvidenceChain,
  inspectPreviewMutationPreflight,
  inspectPreviewTeardownReceipt,
  inspectProductionEvidenceChain,
  inspectProductionMutationPreflight,
  inspectProductionRollbackReceipt,
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
  DeploymentProductionMutationPreflightReceipt,
  DeploymentProductionPreflightReceipt,
  DeploymentProductionRollbackReceipt,
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
    const productionEvidenceRoot =
      "docs/evidence/deployments/2026-07-30-production-prod";
    const productionRollbackPaths = {
      initialProviderReadbackPath: `${productionEvidenceRoot}/provider-readback-d9cb894.json`,
      restoredHostedProofPath: `${productionEvidenceRoot}/rollback-hosted-d9cb894.json`,
      restoredPlanPath: `${productionEvidenceRoot}/rollback-plan-d9cb894.json`,
      restoredPreflightPath: `${productionEvidenceRoot}/rollback-predeploy-d9cb894.json`,
      restoredProviderReadbackPath: `${productionEvidenceRoot}/rollback-provider-d9cb894.json`,
      restoredScreenshotManifestPaths: [
        `${productionEvidenceRoot}/rollback-screenshot-desktop-d9cb894.json`,
        `${productionEvidenceRoot}/rollback-screenshot-mobile-d9cb894.json`,
      ],
      successorHostedProofPath: `${productionEvidenceRoot}/rollback-successor-production-hosted-c99984c.json`,
      successorPreviewHostedProofPath: `${productionEvidenceRoot}/rollback-successor-preview-hosted-c99984c.json`,
      successorPreviewProviderReadbackPath: `${productionEvidenceRoot}/rollback-successor-preview-provider-c99984c.json`,
      successorPreviewTeardownPath: `${productionEvidenceRoot}/rollback-successor-preview-teardown-c99984c.json`,
      successorProviderReadbackPath: `${productionEvidenceRoot}/rollback-successor-production-provider-c99984c.json`,
      successorScreenshotManifestPaths: [
        `${productionEvidenceRoot}/rollback-successor-production-screenshot-desktop-c99984c.json`,
        `${productionEvidenceRoot}/rollback-successor-production-screenshot-mobile-c99984c.json`,
      ],
    } as const;
    const production = yield* Effect.all({
      initialDesktop: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/screenshot-desktop-d9cb894.json`,
        DeploymentScreenshotManifest
      ),
      initialHosted: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/hosted-proof-d9cb894.json`,
        DeploymentHostedProofReceipt
      ),
      initialMobile: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/screenshot-mobile-d9cb894.json`,
        DeploymentScreenshotManifest
      ),
      initialPlan: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/plan-d9cb894.json`,
        DeploymentPlanReceipt
      ),
      initialPreflight: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/predeploy-d9cb894.json`,
        DeploymentProductionPreflightReceipt
      ),
      initialProvider: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.initialProviderReadbackPath,
        DeploymentProviderReadback
      ),
      restoredDesktop: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredScreenshotManifestPaths[0],
        DeploymentScreenshotManifest
      ),
      restoredHosted: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredHostedProofPath,
        DeploymentHostedProofReceipt
      ),
      restoredMobile: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredScreenshotManifestPaths[1],
        DeploymentScreenshotManifest
      ),
      restoredPlan: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredPlanPath,
        DeploymentPlanReceipt
      ),
      restoredPreflight: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredPreflightPath,
        DeploymentProductionMutationPreflightReceipt
      ),
      restoredProvider: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.restoredProviderReadbackPath,
        DeploymentProviderReadback
      ),
      rollbackReceipt: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-receipt-d9cb894.json`,
        DeploymentProductionRollbackReceipt
      ),
      successorDesktop: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorScreenshotManifestPaths[0],
        DeploymentScreenshotManifest
      ),
      successorHosted: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorHostedProofPath,
        DeploymentHostedProofReceipt
      ),
      successorMobile: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorScreenshotManifestPaths[1],
        DeploymentScreenshotManifest
      ),
      successorPlan: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-production-plan-c99984c.json`,
        DeploymentPlanReceipt
      ),
      successorPreflight: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-production-predeploy-c99984c.json`,
        DeploymentProductionMutationPreflightReceipt
      ),
      successorPreviewCredential: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-credential-readback-c99984c.json`,
        DeploymentPreviewCredentialReadbackReceipt
      ),
      successorPreviewDesktop: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-screenshot-desktop-c99984c.json`,
        DeploymentScreenshotManifest
      ),
      successorPreviewDestroyPlan: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-destroy-plan-c99984c.json`,
        DeploymentPlanReceipt
      ),
      successorPreviewGit: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-git-readback-c99984c.json`,
        DeploymentGitReadbackReceipt
      ),
      successorPreviewHosted: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorPreviewHostedProofPath,
        DeploymentHostedProofReceipt
      ),
      successorPreviewMobile: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-screenshot-mobile-c99984c.json`,
        DeploymentScreenshotManifest
      ),
      successorPreviewPlan: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-plan-c99984c.json`,
        DeploymentPlanReceipt
      ),
      successorPreviewPredestroy: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-predestroy-c99984c.json`,
        DeploymentPreviewMutationPreflightReceipt
      ),
      successorPreviewPreflight: readDeploymentJson(
        repositoryRoot,
        `${productionEvidenceRoot}/rollback-successor-preview-predeploy-c99984c.json`,
        DeploymentPreviewMutationPreflightReceipt
      ),
      successorPreviewProvider: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorPreviewProviderReadbackPath,
        DeploymentProviderReadback
      ),
      successorPreviewTeardown: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorPreviewTeardownPath,
        DeploymentPreviewTeardownReceipt
      ),
      successorProvider: readDeploymentJson(
        repositoryRoot,
        productionRollbackPaths.successorProviderReadbackPath,
        DeploymentProviderReadback
      ),
    });
    const orphanInventory = yield* readDeploymentJson(
      repositoryRoot,
      "docs/evidence/deployments/2026-07-30-orphan-inventory/report.json",
      DocsDeploymentOrphanInventoryReceipt
    );
    const [desktopImageSha256, mobileImageSha256] = yield* Effect.all([
      readDeploymentSha256(repositoryRoot, desktopScreenshot.imagePath),
      readDeploymentSha256(repositoryRoot, mobileScreenshot.imagePath),
    ]);
    const productionImageDigests = yield* Effect.all({
      initialDesktop: readDeploymentSha256(
        repositoryRoot,
        production.initialDesktop.imagePath
      ),
      initialMobile: readDeploymentSha256(
        repositoryRoot,
        production.initialMobile.imagePath
      ),
      restoredDesktop: readDeploymentSha256(
        repositoryRoot,
        production.restoredDesktop.imagePath
      ),
      restoredMobile: readDeploymentSha256(
        repositoryRoot,
        production.restoredMobile.imagePath
      ),
      successorDesktop: readDeploymentSha256(
        repositoryRoot,
        production.successorDesktop.imagePath
      ),
      successorMobile: readDeploymentSha256(
        repositoryRoot,
        production.successorMobile.imagePath
      ),
      successorPreviewDesktop: readDeploymentSha256(
        repositoryRoot,
        production.successorPreviewDesktop.imagePath
      ),
      successorPreviewMobile: readDeploymentSha256(
        repositoryRoot,
        production.successorPreviewMobile.imagePath
      ),
    });
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
      ...inspectInitialProductionPreflight(
        production.initialPreflight,
        production.initialPlan,
        providerReadback,
        hostedProof,
        teardown,
        credentialReadback,
        production.initialProvider
      ),
      ...inspectProductionEvidenceChain(
        production.initialPlan,
        production.initialProvider,
        production.initialHosted,
        [production.initialDesktop, production.initialMobile],
        "production",
        "create"
      ),
      ...inspectGitReadbackReceipt(production.successorPreviewGit),
      ...inspectPreviewMutationPreflight(
        production.successorPreviewPreflight,
        production.successorPreviewGit,
        production.successorPreviewPlan,
        receipt,
        production.successorPreviewCredential
      ),
      ...inspectPreviewEvidenceChain(
        production.successorPreviewGit,
        production.successorPreviewPlan,
        production.successorPreviewProvider,
        production.successorPreviewHosted,
        [production.successorPreviewDesktop, production.successorPreviewMobile]
      ),
      ...inspectPreviewMutationPreflight(
        production.successorPreviewPredestroy,
        production.successorPreviewGit,
        production.successorPreviewDestroyPlan,
        receipt,
        production.successorPreviewCredential,
        production.successorPreviewProvider
      ),
      ...inspectPreviewTeardownReceipt(
        production.successorPreviewTeardown,
        production.successorPreviewDestroyPlan,
        production.successorPreviewProvider
      ),
      ...inspectProductionMutationPreflight(
        production.successorPreflight,
        production.successorPlan,
        production.initialProvider,
        production.successorProvider,
        production.successorPreviewCredential
      ),
      ...inspectProductionEvidenceChain(
        production.successorPlan,
        production.successorProvider,
        production.successorHosted,
        [production.successorDesktop, production.successorMobile],
        "production",
        "update"
      ),
      ...inspectProductionMutationPreflight(
        production.restoredPreflight,
        production.restoredPlan,
        production.successorProvider,
        production.restoredProvider,
        credentialReadback
      ),
      ...inspectProductionEvidenceChain(
        production.restoredPlan,
        production.restoredProvider,
        production.restoredHosted,
        [production.restoredDesktop, production.restoredMobile],
        "rollback",
        "update"
      ),
      ...inspectProductionRollbackReceipt(
        production.rollbackReceipt,
        production.initialProvider,
        production.successorPreviewProvider,
        production.successorPreviewTeardown,
        production.successorProvider,
        production.restoredProvider,
        [production.initialDesktop, production.initialMobile],
        [production.restoredDesktop, production.restoredMobile],
        productionRollbackPaths
      ),
      ...inspectDocsDeploymentOrphanInventoryReceipt(orphanInventory),
      ...inspectScreenshotImageDigest(
        production.initialDesktop,
        productionImageDigests.initialDesktop
      ),
      ...inspectScreenshotImageDigest(
        production.initialMobile,
        productionImageDigests.initialMobile
      ),
      ...inspectScreenshotImageDigest(
        production.successorPreviewDesktop,
        productionImageDigests.successorPreviewDesktop
      ),
      ...inspectScreenshotImageDigest(
        production.successorPreviewMobile,
        productionImageDigests.successorPreviewMobile
      ),
      ...inspectScreenshotImageDigest(
        production.successorDesktop,
        productionImageDigests.successorDesktop
      ),
      ...inspectScreenshotImageDigest(
        production.successorMobile,
        productionImageDigests.successorMobile
      ),
      ...inspectScreenshotImageDigest(
        production.restoredDesktop,
        productionImageDigests.restoredDesktop
      ),
      ...inspectScreenshotImageDigest(
        production.restoredMobile,
        productionImageDigests.restoredMobile
      ),
    ];
  });

const program = Effect.gen(function* docsDeploymentMain() {
  const path = yield* Path.Path;
  const repositoryRoot = yield* path.fromFileUrl(repositoryRootUrl);
  const findings = yield* checkDocsDeployment(repositoryRoot);
  yield* Console.info(
    `Docs deployment validation: journeys=4; preflightReceipts=11; gitAuthorityReceipts=1; gitReadbackReceipts=5; planReceipts=11; providerReadbackReceipts=6; hostedProofReceipts=6; screenshotManifests=12; teardownReceipts=3; rollbackReceipts=1; failedApplyReceipts=1; orphanInventoryReceipts=1; violations=${findings.length}; providerReadOperations=42; providerMutations=10.`
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
