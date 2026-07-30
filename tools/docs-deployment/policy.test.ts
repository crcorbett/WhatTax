import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import credentialReadbackJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/credential-readback-d9cb894.json";
import destroyPlanJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/destroy-plan-d9cb894.json";
import acceptedGitReadbackJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/git-readback-d9cb894.json";
import planJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/plan.json";
import acceptedPredeployJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/predeploy-d9cb894.json";
import acceptedPredestroyJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/predestroy-d9cb894.json";
import providerPreflightJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/preflight.json";
import providerReadbackJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/provider-readback-d9cb894.json";
import acceptedPlanJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/successor-plan-d9cb894.json";
import teardownJson from "../../docs/evidence/deployments/2026-07-30-preview-pr-1/teardown-d9cb894.json";
import receiptJson from "../../docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json";
import gitAuthorityJson from "../../docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json";
import gitReadbackJson from "../../docs/evidence/deployments/2026-07-30-preview-preflight/git-readback.json";
import inventoryJson from "../../docs/verification/docs-deployment-journeys.json";
import {
  deploymentRecordDigest,
  inspectDeploymentOwners,
  inspectGitAuthorityReceipt,
  inspectGitReadbackReceipt,
  inspectDeploymentPlanReceipt,
  inspectHostedDeploymentProof,
  inspectPreviewEvidenceChain,
  inspectPreviewMutationPreflight,
  inspectPreviewTeardownReceipt,
  inspectProviderPreflightReceipt,
  inspectScreenshotImageDigest,
  inspectScreenshotProviderBinding,
} from "./policy.js";
import {
  DeploymentAuthorityPreflightReceipt,
  DeploymentGitAuthorityReceipt,
  DeploymentGitReadbackReceipt,
  DeploymentHostedProofReceipt,
  DeploymentJourneyInventory,
  DeploymentPlanProjection,
  DeploymentPlanReceipt,
  DeploymentProviderPreflightReceipt,
  DeploymentProviderReadback,
  DeploymentPreviewCredentialReadbackReceipt,
  DeploymentPreviewTeardownReceipt,
  DeploymentPreviewMutationPreflightReceipt,
  DeploymentScreenshotManifest,
} from "./schemas.js";

const decode = () =>
  Effect.all([
    Schema.decodeUnknownEffect(DeploymentJourneyInventory, {
      onExcessProperty: "error",
    })(inventoryJson),
    Schema.decodeUnknownEffect(DeploymentAuthorityPreflightReceipt, {
      onExcessProperty: "error",
    })(receiptJson),
  ]);

const decodeGitAuthority = () =>
  Schema.decodeUnknownEffect(DeploymentGitAuthorityReceipt, {
    onExcessProperty: "error",
  })(gitAuthorityJson);

const decodeGitReadback = () =>
  Schema.decodeUnknownEffect(DeploymentGitReadbackReceipt, {
    onExcessProperty: "error",
  })(gitReadbackJson);

describe("docs deployment policy", () => {
  test("accepts the bounded preflight stop and four deployment journeys", async () => {
    const [inventory, receipt] = await Effect.runPromise(decode());
    expect(inspectDeploymentOwners(inventory, receipt)).toEqual([]);
  });

  test("rejects duplicate deployment journey identities", async () => {
    const [, receipt] = await Effect.runPromise(decode());
    const inventory = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentJourneyInventory)({
        ...inventoryJson,
        journeys: inventoryJson.journeys.map((journey, index) =>
          index === 1 ? { ...journey, id: "taxkit-docs-workerd" } : journey
        ),
      })
    );
    expect(inspectDeploymentOwners(inventory, receipt)).toContainEqual(
      expect.stringContaining("journey-inventory")
    );
  });

  test("accepts the exact bounded Git authority before mutation", async () => {
    const receipt = await Effect.runPromise(decodeGitAuthority());
    expect(inspectGitAuthorityReceipt(receipt)).toEqual([]);
  });

  test("accepts the exact trusted draft-PR readback", async () => {
    const receipt = await Effect.runPromise(decodeGitReadback());
    expect(inspectGitReadbackReceipt(receipt)).toEqual([]);
  });

  test("binds provider and state preflight to the trusted candidate", async () => {
    const [gitReadback, providerPreflight, plan] = await Effect.runPromise(
      Effect.all([
        decodeGitReadback(),
        Schema.decodeUnknownEffect(DeploymentProviderPreflightReceipt, {
          onExcessProperty: "error",
        })(providerPreflightJson),
        Schema.decodeUnknownEffect(DeploymentPlanReceipt, {
          onExcessProperty: "error",
        })(planJson),
      ])
    );
    expect(
      inspectProviderPreflightReceipt(providerPreflight, gitReadback)
    ).toEqual([]);
    expect(inspectDeploymentPlanReceipt(plan)).toEqual([]);
  });
});

const hashA = "a".repeat(64);
const hashB = "b".repeat(64);
const candidateCommit = "669a8f3bc484ddf5975f40940c8bdc14e6f1ba11";
const providerUrl = "https://taxkit-docs-pr-17.taxkit-preview.workers.dev";

const decodeProviderContracts = async () => {
  const projection = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentPlanProjection)({
      candidate: {
        deploymentInputSha256: hashA,
        exactCommit: candidateCommit,
        lockfileSha256: hashB,
      },
      configSha256: hashA,
      logicalResources: [
        {
          action: "create",
          logicalId: "DocsBuild",
          resourceType: "Command.Build",
        },
        {
          action: "create",
          logicalId: "DocsWebsite",
          resourceType: "Cloudflare.Worker",
        },
      ],
      redaction: {
        ansiRemoved: true,
        secretValuesIncluded: false,
        timestampsExcludedFromDigest: true,
      },
      schemaVersion: 1,
      stack: "TaxKitDocsCloudflare",
      stage: "pr-1",
    })
  );
  const plan = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentPlanReceipt)({
      acceptedBy: "Cooper",
      acceptedPlanSha256: deploymentRecordDigest(projection),
      observedAt: "2026-07-30T04:00:00Z",
      operation: "preview-plan",
      projection,
      receiptPath: "docs/evidence/deployments/2026-07-30-preview/plan.json",
      replanSha256: null,
      schemaVersion: 1,
    })
  );
  const provider = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentProviderReadback)({
      acceptedPlanSha256: plan.acceptedPlanSha256,
      accountId: "f9f94270a4a5af8af7010d891020922d",
      assets: { manifestSha256: hashB, status: "present" },
      candidateCommit,
      configSha256: projection.configSha256,
      deploymentId: "deployment-17",
      deploymentInputSha256: projection.candidate.deploymentInputSha256,
      lockfileSha256: projection.candidate.lockfileSha256,
      logicalResourceId: "DocsWebsite",
      observability: {
        invocationLogs: true,
        persist: true,
        traces: false,
      },
      physicalWorkerName: "taxkit-docs-pr-17",
      providerObservedAt: "2026-07-30T04:02:00Z",
      schemaVersion: 1,
      stack: "TaxKitDocsCloudflare",
      stage: "pr-1",
      state: {
        assetsManifestSha256: hashB,
        bundleSha256: hashA,
        id: "cloudflare-http",
        instanceId: "state-instance-17",
        metadataSha256: hashB,
        output: {
          logicalResourceId: "DocsWebsite",
          stage: "pr-1",
          workerName: "taxkit-docs-pr-17",
          workerUrl: providerUrl,
        },
        resources: [
          { logicalId: "DocsBuild", status: "updated" },
          { logicalId: "DocsWebsite", status: "updated" },
        ],
        version: 7,
      },
      url: providerUrl,
      versionId: "version-17",
    })
  );
  const oracleIds = [
    "initial-ssr",
    "static-assets",
    "hydration",
    "client-navigation-no-document",
    "server-function-transport",
    "native-404",
    "accessibility",
    "console-page-cleanliness",
    "cache-headers",
  ];
  const hosted = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentHostedProofReceipt)({
      candidateCommit,
      environment: "preview",
      limitations: ["Synthetic hosted browser observation."],
      nonClaims: ["No Production claim."],
      observedAt: "2026-07-30T04:04:00Z",
      oracles: oracleIds.map((id) => ({
        expected: "accepted state",
        id,
        observed: "accepted state",
        status: "passed",
      })),
      provider,
      reviewer: "Cooper",
      schemaVersion: 1,
      url: providerUrl,
    })
  );
  const screenshot = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentScreenshotManifest)({
      acceptedPlanSha256: plan.acceptedPlanSha256,
      browser: { name: "chromium", version: "148.0.7778.96" },
      candidateCommit,
      capturedAt: "2026-07-30T04:05:00Z",
      deploymentId: "deployment-17",
      deploymentInputSha256: projection.candidate.deploymentInputSha256,
      environment: "preview",
      expectedState: "Docs home is visibly rendered.",
      imagePath:
        "docs/evidence/deployments/2026-07-30-preview/home-desktop.png",
      imageSha256: hashA,
      limitations: ["Representative desktop viewport only."],
      lockfileSha256: projection.candidate.lockfileSha256,
      nonClaims: ["Screenshot does not prove HTTP or provider behavior."],
      observedState: "Docs home is visibly rendered.",
      recoveryIdentity: "exact-stage pr-1 destroy",
      reviewedAt: "2026-07-30T04:06:00Z",
      reviewer: "Cooper",
      schemaVersion: 1,
      sourceConfigSha256: projection.configSha256,
      stage: "pr-1",
      url: providerUrl,
      versionId: "version-17",
      viewport: {
        deviceScaleFactor: 1,
        height: 900,
        kind: "desktop",
        width: 1440,
      },
      workerName: "taxkit-docs-pr-17",
    })
  );
  const mobileScreenshot = {
    ...screenshot,
    viewport: {
      deviceScaleFactor: 1,
      height: 844,
      kind: "mobile" as const,
      width: 390,
    },
  };
  const git = await Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentGitReadbackReceipt)({
      candidateStatus: "trusted-pr-head",
      observedAt: "2026-07-30T04:00:00Z",
      operationsExecuted: [
        "remote-branch-readback",
        "github-commit-readback",
        "draft-pull-request-readback",
      ],
      owner: "taxkit-docs-deployment-operation-owner",
      postcondition: "exact-candidate-is-trusted-draft-pr-head",
      pullRequest: {
        authorLogin: "crcorbett",
        baseName: "main",
        baseSha: hashA.slice(0, 40),
        headName: "codex/docs-cloudflare-alchemy-deployment",
        headSha: candidateCommit,
        isDraft: true,
        number: 1,
        state: "OPEN",
        url: "https://github.com/crcorbett/taxkit/pull/1",
      },
      receiptId: "test-git-readback",
      remote: {
        branch: "codex/docs-cloudflare-alchemy-deployment",
        candidateCommit,
        name: "origin",
        repository: "crcorbett/taxkit",
      },
      rollback: "Retain the draft pull request.",
      schemaVersion: 1,
      stage: "pr-1",
    })
  );
  return {
    git,
    hosted,
    mobileScreenshot,
    plan,
    projection,
    provider,
    screenshot,
  };
};

describe("docs deployment provider receipt contracts", () => {
  test("binds sanitized plan, hosted and screenshot identities", async () => {
    const { git, hosted, mobileScreenshot, plan, provider, screenshot } =
      await decodeProviderContracts();
    expect(inspectDeploymentPlanReceipt(plan)).toEqual([]);
    expect(inspectHostedDeploymentProof(hosted)).toEqual([]);
    expect(inspectScreenshotProviderBinding(screenshot, provider)).toEqual([]);
    expect(
      inspectScreenshotImageDigest(screenshot, screenshot.imageSha256)
    ).toEqual([]);
    expect(
      inspectPreviewEvidenceChain(git, plan, provider, hosted, [
        screenshot,
        mobileScreenshot,
      ])
    ).toEqual([]);
  });

  test("rejects plan projection secret admission", async () => {
    const { projection } = await decodeProviderContracts();
    await expect(
      Effect.runPromise(
        Schema.decodeUnknownEffect(DeploymentPlanProjection)({
          ...projection,
          redaction: {
            ...projection.redaction,
            secretValuesIncluded: true,
          },
        })
      )
    ).rejects.toBeDefined();
  });

  test("rejects provider readback detached from the accepted deployment inputs", async () => {
    const { git, hosted, mobileScreenshot, plan, provider, screenshot } =
      await decodeProviderContracts();
    expect(
      inspectPreviewEvidenceChain(
        git,
        plan,
        {
          ...provider,
          deploymentInputSha256: "c".repeat(64),
        },
        hosted,
        [screenshot, mobileScreenshot]
      )
    ).toContainEqual(expect.stringContaining("preview-evidence-chain"));
  });

  test("rejects hosted proof detached from the canonical provider readback", async () => {
    const { git, hosted, mobileScreenshot, plan, provider, screenshot } =
      await decodeProviderContracts();
    const detachedProvider = {
      ...hosted.provider,
      candidateCommit: "c".repeat(40),
    };

    expect(
      inspectPreviewEvidenceChain(
        git,
        plan,
        provider,
        {
          ...hosted,
          candidateCommit: detachedProvider.candidateCommit,
          provider: detachedProvider,
        },
        [screenshot, mobileScreenshot]
      )
    ).toContainEqual(expect.stringContaining("preview-evidence-chain"));
  });

  test("rejects a screenshot manifest detached from the retained PNG bytes", async () => {
    const { screenshot } = await decodeProviderContracts();
    expect(
      inspectScreenshotImageDigest(screenshot, "c".repeat(64))
    ).toContainEqual(expect.stringContaining("screenshot-image-digest"));
  });

  test("rejects screenshot evidence paths that escape the dated route", async () => {
    const { screenshot } = await decodeProviderContracts();
    await expect(
      Effect.runPromise(
        Schema.decodeUnknownEffect(DeploymentScreenshotManifest)({
          ...screenshot,
          imagePath: "docs/evidence/deployments/../../outside.png",
        })
      )
    ).rejects.toBeDefined();
  });

  test("requires exact candidate, credential, provider and state mutation preflight", async () => {
    const [authority, credentialReadback, gitReadback, plan, preflight] =
      await Effect.runPromise(
        Effect.all([
          Schema.decodeUnknownEffect(DeploymentAuthorityPreflightReceipt)(
            receiptJson
          ),
          Schema.decodeUnknownEffect(
            DeploymentPreviewCredentialReadbackReceipt
          )(credentialReadbackJson),
          Schema.decodeUnknownEffect(DeploymentGitReadbackReceipt)(
            acceptedGitReadbackJson
          ),
          Schema.decodeUnknownEffect(DeploymentPlanReceipt)(acceptedPlanJson),
          Schema.decodeUnknownEffect(DeploymentPreviewMutationPreflightReceipt)(
            acceptedPredeployJson
          ),
        ])
      );
    const wrongAccountPreflight = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentPreviewMutationPreflightReceipt)({
        ...preflight,
        credentials: {
          ...preflight.credentials,
          accountId: "a".repeat(32),
        },
      })
    );

    expect(
      inspectPreviewMutationPreflight(
        preflight,
        gitReadback,
        plan,
        authority,
        credentialReadback
      )
    ).toEqual([]);
    expect(
      inspectPreviewMutationPreflight(
        {
          ...preflight,
          candidate: {
            ...preflight.candidate,
            exactCommit: candidateCommit,
          },
        },
        gitReadback,
        plan,
        authority,
        credentialReadback
      )
    ).toContainEqual(expect.stringContaining("preview-mutation-preflight"));
    expect(
      inspectPreviewMutationPreflight(
        wrongAccountPreflight,
        gitReadback,
        plan,
        authority,
        credentialReadback
      )
    ).toContainEqual(expect.stringContaining("preview-mutation-preflight"));
    expect(
      inspectPreviewMutationPreflight(
        {
          ...preflight,
          credentials: {
            ...preflight.credentials,
            scopeSetSha256: "c".repeat(64),
          },
        },
        gitReadback,
        plan,
        authority,
        credentialReadback
      )
    ).toContainEqual(expect.stringContaining("preview-mutation-preflight"));
  });

  test("rejects a Preview evidence chain without both viewport classes", async () => {
    const { git, hosted, plan, provider, screenshot } =
      await decodeProviderContracts();

    expect(
      inspectPreviewEvidenceChain(git, plan, provider, hosted, [screenshot])
    ).toContainEqual(expect.stringContaining("preview-evidence-chain"));
  });

  test("binds the accepted Preview destroy and absence readback", async () => {
    const [
      authority,
      credentialReadback,
      destroyPlan,
      gitReadback,
      predestroy,
      provider,
      teardown,
    ] = await Effect.runPromise(
      Effect.all([
        Schema.decodeUnknownEffect(DeploymentAuthorityPreflightReceipt)(
          receiptJson
        ),
        Schema.decodeUnknownEffect(DeploymentPreviewCredentialReadbackReceipt)(
          credentialReadbackJson
        ),
        Schema.decodeUnknownEffect(DeploymentPlanReceipt)(destroyPlanJson),
        Schema.decodeUnknownEffect(DeploymentGitReadbackReceipt)(
          acceptedGitReadbackJson
        ),
        Schema.decodeUnknownEffect(DeploymentPreviewMutationPreflightReceipt)(
          acceptedPredestroyJson
        ),
        Schema.decodeUnknownEffect(DeploymentProviderReadback)(
          providerReadbackJson
        ),
        Schema.decodeUnknownEffect(DeploymentPreviewTeardownReceipt)(
          teardownJson
        ),
      ])
    );

    expect(
      inspectPreviewMutationPreflight(
        predestroy,
        gitReadback,
        destroyPlan,
        authority,
        credentialReadback,
        provider
      )
    ).toEqual([]);
    const mismatchedProvider = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentProviderReadback)({
        ...provider,
        versionId: "different-version",
      })
    );
    expect(
      inspectPreviewMutationPreflight(
        predestroy,
        gitReadback,
        destroyPlan,
        authority,
        credentialReadback,
        mismatchedProvider
      )
    ).toContainEqual(expect.stringContaining("preview-mutation-preflight"));
    expect(
      inspectPreviewTeardownReceipt(teardown, destroyPlan, provider)
    ).toEqual([]);
  });
});
