import { Array, HashSet } from "effect";

import type {
  DeploymentAuthorityPreflightReceipt,
  DeploymentGitAuthorityReceipt,
  DeploymentGitReadbackReceipt,
  DeploymentHostedProofReceipt,
  DeploymentJourneyInventory,
  DeploymentPlanReceipt,
  DeploymentProviderPreflightReceipt,
  DeploymentProviderReadback,
  DeploymentPreviewCredentialReadbackReceipt,
  DeploymentPreviewMutationPreflightReceipt,
  DeploymentPreviewTeardownReceipt,
  DeploymentResumePreflightReceipt,
  DeploymentScreenshotManifest,
} from "./schemas.js";

const expectedJourneyIds = [
  "taxkit-docs-workerd",
  "taxkit-docs-preview",
  "taxkit-docs-production",
  "taxkit-docs-deployment-rollback",
] as const;
const expectedHostedOracleIds = [
  "initial-ssr",
  "static-assets",
  "hydration",
  "client-navigation-no-document",
  "server-function-transport",
  "native-404",
  "accessibility",
  "console-page-cleanliness",
  "cache-headers",
] as const;

const canonicalJson = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    return `{${Reflect.ownKeys(value)
      .filter((key): key is string => typeof key === "string")
      .toSorted((left, right) => left.localeCompare(right))
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonicalJson(Reflect.get(value, key))}`
      )
      .join(",")}}`;
  }
  return JSON.stringify(value);
};

export const deploymentRecordDigest = (value: unknown): string =>
  new Bun.CryptoHasher("sha256").update(canonicalJson(value)).digest("hex");

export const inspectDeploymentPlanReceipt = (
  receipt: DeploymentPlanReceipt
): readonly string[] => {
  const findings: string[] = [];
  if (
    deploymentRecordDigest(receipt.projection) !== receipt.acceptedPlanSha256
  ) {
    findings.push(
      "plan-digest: acceptedPlanSha256 must bind the canonical sanitized projection"
    );
  }
  const isReplan =
    receipt.operation === "preview-equal-replan" ||
    receipt.operation === "production-equal-replan" ||
    receipt.operation === "preview-destroy";
  if (
    (isReplan && receipt.replanSha256 !== receipt.acceptedPlanSha256) ||
    (!isReplan && receipt.replanSha256 !== null)
  ) {
    findings.push(
      "equal-replan: mutation requires an equal digest while a plan-only receipt must not claim replan"
    );
  }
  return findings;
};

export const inspectHostedDeploymentProof = (
  receipt: DeploymentHostedProofReceipt
): readonly string[] => {
  const ids = Array.map(receipt.oracles, (oracle) => oracle.id);
  const findings: string[] = [];
  if (
    HashSet.size(HashSet.fromIterable(ids)) !==
      expectedHostedOracleIds.length ||
    Array.some(expectedHostedOracleIds, (id) => !ids.includes(id))
  ) {
    findings.push(
      "hosted-oracles: retain exactly one passing observation for every required hosted oracle"
    );
  }
  if (
    receipt.candidateCommit !== receipt.provider.candidateCommit ||
    receipt.url !== receipt.provider.url ||
    receipt.provider.assets.manifestSha256 !==
      receipt.provider.state.assetsManifestSha256 ||
    receipt.provider.logicalResourceId !==
      receipt.provider.state.output.logicalResourceId ||
    receipt.provider.physicalWorkerName !==
      receipt.provider.state.output.workerName ||
    receipt.provider.url !== receipt.provider.state.output.workerUrl ||
    receipt.provider.stage !== receipt.provider.state.output.stage
  ) {
    findings.push(
      "hosted-provider-binding: hosted proof must use the provider-read-back candidate and URL"
    );
  }
  return findings;
};

export const inspectScreenshotProviderBinding = (
  manifest: DeploymentScreenshotManifest,
  provider: DeploymentProviderReadback
): readonly string[] =>
  manifest.candidateCommit === provider.candidateCommit &&
  manifest.acceptedPlanSha256 === provider.acceptedPlanSha256 &&
  manifest.sourceConfigSha256 === provider.configSha256 &&
  manifest.deploymentInputSha256 === provider.deploymentInputSha256 &&
  manifest.lockfileSha256 === provider.lockfileSha256 &&
  manifest.deploymentId === provider.deploymentId &&
  manifest.versionId === provider.versionId &&
  manifest.workerName === provider.physicalWorkerName &&
  manifest.stage === provider.stage &&
  manifest.url === provider.url
    ? []
    : [
        "screenshot-provider-binding: screenshot identity must equal the provider readback",
      ];

export const inspectScreenshotImageDigest = (
  manifest: DeploymentScreenshotManifest,
  observedSha256: string
): readonly string[] =>
  manifest.imageSha256 === observedSha256
    ? []
    : [
        "screenshot-image-digest: screenshot manifest must bind the retained PNG bytes",
      ];

export const inspectPreviewEvidenceChain = (
  gitReadback: DeploymentGitReadbackReceipt,
  plan: DeploymentPlanReceipt,
  provider: DeploymentProviderReadback,
  hosted: DeploymentHostedProofReceipt,
  screenshots: readonly DeploymentScreenshotManifest[]
): readonly string[] => {
  const findings = [
    ...inspectDeploymentPlanReceipt(plan),
    ...inspectHostedDeploymentProof(hosted),
    ...Array.flatMap(screenshots, (manifest) =>
      inspectScreenshotProviderBinding(manifest, provider)
    ),
  ];
  if (
    gitReadback.pullRequest.headSha !== plan.projection.candidate.exactCommit ||
    plan.projection.candidate.exactCommit !== provider.candidateCommit ||
    plan.acceptedPlanSha256 !== provider.acceptedPlanSha256 ||
    plan.projection.configSha256 !== provider.configSha256 ||
    plan.projection.candidate.deploymentInputSha256 !==
      provider.deploymentInputSha256 ||
    plan.projection.candidate.lockfileSha256 !== provider.lockfileSha256 ||
    gitReadback.stage !== plan.projection.stage ||
    plan.projection.stage !== provider.stage ||
    hosted.candidateCommit !== provider.candidateCommit ||
    hosted.url !== provider.url ||
    deploymentRecordDigest(hosted.provider) !==
      deploymentRecordDigest(provider) ||
    hosted.environment !== "preview" ||
    gitReadback.pullRequest.baseName !== "main" ||
    !gitReadback.pullRequest.isDraft ||
    gitReadback.pullRequest.state !== "OPEN" ||
    screenshots.length !== 2 ||
    HashSet.size(
      HashSet.fromIterable(
        screenshots.map((manifest) => manifest.viewport.kind)
      )
    ) !== 2 ||
    Array.some(screenshots, (manifest) => manifest.environment !== "preview")
  ) {
    findings.push(
      "preview-evidence-chain: Git, plan, provider, hosted and screenshot receipts must bind one Preview candidate and stage"
    );
  }
  return findings;
};

export const inspectPreviewMutationPreflight = (
  receipt: DeploymentPreviewMutationPreflightReceipt,
  gitReadback: DeploymentGitReadbackReceipt,
  plan: DeploymentPlanReceipt,
  authority: DeploymentAuthorityPreflightReceipt,
  credentialReadback: DeploymentPreviewCredentialReadbackReceipt,
  providerAfterApply?: DeploymentProviderReadback
): readonly string[] => {
  const commonMismatch = [
    receipt.candidate.exactCommit !== gitReadback.pullRequest.headSha,
    receipt.candidate.exactCommit !== plan.projection.candidate.exactCommit,
    receipt.candidate.lockfileSha256 !==
      plan.projection.candidate.lockfileSha256,
    receipt.candidate.deploymentInputSha256 !==
      plan.projection.candidate.deploymentInputSha256,
    receipt.candidate.sourceConfigSha256 !== plan.projection.configSha256,
    receipt.acceptedPlanSha256 !== plan.acceptedPlanSha256,
    receipt.stage !== gitReadback.stage,
    receipt.stage !== plan.projection.stage,
    receipt.credentials.accountId !== authority.provider.accountId,
    receipt.credentials.accountId !== credentialReadback.accountId,
    receipt.credentials.scopeSetSha256 !== credentialReadback.scopeSetSha256,
    receipt.credentials.expiresAt !== credentialReadback.expiresAt,
    receipt.credentials.profile !== credentialReadback.profile,
    receipt.candidate.exactCommit !== credentialReadback.candidateCommit,
    receipt.stage !== credentialReadback.stage,
    providerAfterApply !== undefined &&
      receipt.credentials.accountId !== providerAfterApply.accountId,
    !receipt.limitations.some((limitation) =>
      limitation.includes("broad existing OAuth scope set")
    ),
  ].some(Boolean);
  const deployMismatch =
    receipt.operation === "preview-deploy-preflight" &&
    [
      receipt.postcondition !== "exact-stage-absent-and-safe-to-create",
      receipt.provider.matchingWorkerCount !== 0,
      receipt.provider.identity !== null,
      receipt.state.stagePresent,
      receipt.state.resources.length !== 0,
      receipt.state.workerIdentityAgreement,
    ].some(Boolean);
  const destroyIdentity = receipt.provider.identity;
  const destroyMismatch =
    receipt.operation === "preview-destroy-preflight" &&
    [
      receipt.postcondition !== "exact-stage-present-and-safe-to-destroy",
      receipt.provider.matchingWorkerCount !== 1,
      destroyIdentity === null,
      !receipt.state.stagePresent,
      receipt.state.resources.length !== 2,
      !receipt.state.workerIdentityAgreement,
      providerAfterApply === undefined,
      destroyIdentity?.physicalWorkerName !==
        providerAfterApply?.physicalWorkerName,
      destroyIdentity?.deploymentId !== providerAfterApply?.deploymentId,
      destroyIdentity?.versionId !== providerAfterApply?.versionId,
      destroyIdentity?.url !== providerAfterApply?.url,
    ].some(Boolean);
  return commonMismatch || deployMismatch || destroyMismatch
    ? [
        "preview-mutation-preflight: candidate, credential scope, plan, provider and state identities must prove the exact deploy or destroy target before mutation",
      ]
    : [];
};

export const inspectPreviewTeardownReceipt = (
  receipt: DeploymentPreviewTeardownReceipt,
  plan: DeploymentPlanReceipt,
  provider: DeploymentProviderReadback
): readonly string[] => {
  const findings = [...inspectDeploymentPlanReceipt(plan)];
  if (
    plan.operation !== "preview-destroy" ||
    receipt.destroyPlanSha256 !== plan.acceptedPlanSha256 ||
    receipt.candidateCommit !== plan.projection.candidate.exactCommit ||
    receipt.candidateCommit !== provider.candidateCommit ||
    receipt.physicalWorkerName !== provider.physicalWorkerName ||
    receipt.url !== provider.url ||
    receipt.provider.matchingWorkerCount !== 0 ||
    receipt.state.stagePresent ||
    receipt.state.previewResourceCount !== 0
  ) {
    findings.push(
      "preview-teardown-binding: destroy plan, deployed identity, provider absence and state absence must bind one exact Preview"
    );
  }
  return findings;
};

export const inspectDeploymentOwners = (
  inventory: DeploymentJourneyInventory,
  receipt: DeploymentAuthorityPreflightReceipt
): readonly string[] => {
  const findings: string[] = [];
  const ids = Array.map(inventory.journeys, (journey) => journey.id);
  if (
    HashSet.size(HashSet.fromIterable(ids)) !== expectedJourneyIds.length ||
    Array.some(expectedJourneyIds, (id) => !ids.includes(id))
  ) {
    findings.push(
      "journey-inventory: retain exactly the four stable deployment journey IDs"
    );
  }
  if (
    Array.some(
      inventory.journeys,
      (journey) =>
        journey.oracleClasses.length === 0 ||
        journey.falseGreenOracles.length === 0 ||
        !journey.receiptRoute.startsWith("docs/evidence/deployments/")
    )
  ) {
    findings.push(
      "journey-oracles: every journey needs dated evidence routing, proportional oracles and explicit false-green protection"
    );
  }
  if (
    receipt.candidate.status !== "not-trusted-pr-head" ||
    receipt.candidate.pullRequestNumber !== null ||
    receipt.state.mutationCount !== 0 ||
    receipt.postcondition !== "stopped-before-state-or-provider-mutation"
  ) {
    findings.push(
      "preflight-stop: an untrusted local-only candidate must stop before state initialization, plan or provider mutation"
    );
  }
  if (
    receipt.approval.approvedOperations.includes("preview-plan") &&
    receipt.stop.operation !== "preview-plan"
  ) {
    findings.push(
      "authority-stop: approval does not waive trusted-candidate identity"
    );
  }
  const { evidenceDigest, ...evidenceProjection } = receipt;
  const observedDigest = deploymentRecordDigest(evidenceProjection);
  if (observedDigest !== evidenceDigest) {
    findings.push(
      "receipt-digest: evidenceDigest must bind the canonical receipt projection excluding itself"
    );
  }
  return findings;
};

export const inspectGitAuthorityReceipt = (
  receipt: DeploymentGitAuthorityReceipt
): readonly string[] => {
  const findings: string[] = [];
  if (
    receipt.approval.candidateCommit !== receipt.precondition.headCommit ||
    receipt.approval.branch !== "codex/docs-cloudflare-alchemy-deployment" ||
    receipt.approval.baseBranch !== "main" ||
    receipt.approval.remote !== "origin"
  ) {
    findings.push(
      "git-authority-target: candidate, branch, base and remote must match the exact approved Git target"
    );
  }
  if (
    !receipt.approval.exclusions.includes("force-push") ||
    !receipt.approval.exclusions.includes("merge") ||
    !receipt.approval.exclusions.includes("branch-deletion")
  ) {
    findings.push(
      "git-authority-exclusions: merge, force-push and branch deletion must remain excluded"
    );
  }
  return findings;
};

export const inspectGitReadbackReceipt = (
  receipt: DeploymentGitReadbackReceipt
): readonly string[] => {
  const findings: string[] = [];
  if (
    receipt.remote.candidateCommit !== receipt.pullRequest.headSha ||
    receipt.pullRequest.headName !== receipt.remote.branch ||
    receipt.pullRequest.number !== 1 ||
    receipt.stage !== "pr-1"
  ) {
    findings.push(
      "git-readback-binding: remote branch, draft PR head, number and deterministic stage must identify one exact candidate"
    );
  }
  if (
    receipt.pullRequest.baseName !== "main" ||
    !receipt.pullRequest.isDraft ||
    receipt.pullRequest.state !== "OPEN"
  ) {
    findings.push(
      "git-readback-state: the accepted candidate must be an open draft pull request against main"
    );
  }
  return findings;
};

export const inspectProviderPreflightReceipt = (
  receipt: DeploymentProviderPreflightReceipt,
  gitReadback: DeploymentGitReadbackReceipt
): readonly string[] => {
  const findings: string[] = [];
  if (
    receipt.candidate.exactCommit !== gitReadback.pullRequest.headSha ||
    receipt.candidate.pullRequestNumber !== gitReadback.pullRequest.number ||
    receipt.stage !== gitReadback.stage
  ) {
    findings.push(
      "provider-preflight-candidate: provider inventory must bind the current trusted PR head and derived stage"
    );
  }
  const partialStateIsExact =
    receipt.state.taxkitStackPresent &&
    receipt.postcondition ===
      "partial-taxkit-state-and-provider-absence-confirmed" &&
    receipt.provider.taxkitWorkerCount === 0 &&
    receipt.state.resources.length === 2 &&
    receipt.state.resources.some(
      (resource) =>
        resource.logicalId === "DocsBuild" && resource.status === "created"
    ) &&
    receipt.state.resources.some(
      (resource) =>
        resource.logicalId === "DocsWebsite" && resource.status === "creating"
    );
  const emptyStateIsExact =
    !receipt.state.taxkitStackPresent &&
    receipt.state.resources.length === 0 &&
    receipt.postcondition ===
      "account-subdomain-and-empty-taxkit-state-confirmed";
  if (!partialStateIsExact && !emptyStateIsExact) {
    findings.push(
      "provider-preflight-state: inventory must prove either an empty first-Preview state or the exact resumable build-created/worker-creating state with provider absence"
    );
  }
  if (
    receipt.provider.billingSubscriptionReadback === "forbidden-403" &&
    !receipt.limitations.some((limitation) =>
      limitation.includes("not the billing subscription")
    )
  ) {
    findings.push(
      "provider-preflight-plan: denied billing readback must remain an explicit non-claim"
    );
  }
  return findings;
};

export const inspectResumePreflightReceipt = (
  receipt: DeploymentResumePreflightReceipt,
  gitReadback: DeploymentGitReadbackReceipt,
  plan: DeploymentPlanReceipt
): readonly string[] => {
  const findings: string[] = [];
  if (
    receipt.candidate.exactCommit !== gitReadback.pullRequest.headSha ||
    receipt.candidate.exactCommit !== plan.projection.candidate.exactCommit ||
    receipt.stage !== gitReadback.stage ||
    receipt.stage !== plan.projection.stage
  ) {
    findings.push(
      "resume-preflight-candidate: trusted Git, state/provider preflight and equal plan must bind one candidate and stage"
    );
  }
  if (
    receipt.provider.taxkitWorkerCount !== 1 ||
    !receipt.state.workerIdentityAgreement ||
    receipt.state.resources[0].logicalId !== "DocsBuild" ||
    receipt.state.resources[1].logicalId !== "DocsWebsite"
  ) {
    findings.push(
      "resume-preflight-scope: resume requires exactly one matching TaxKit Worker and the two owned state resources"
    );
  }
  return findings;
};
