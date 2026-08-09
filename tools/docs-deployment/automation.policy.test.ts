import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import automationJson from "./automation-register.json";
import { inspectDeploymentAutomationRegisters } from "./automation.policy.js";
import {
  DeploymentAutomationRegister,
  DeploymentControlRegister,
} from "./automation.schemas.js";
import controlsJson from "./controls.json";
import { deploymentRecordDigest } from "./policy.js";
import { DeploymentPlanReceipt } from "./schemas.js";
import {
  DeploymentWorkflowExternalReceipt,
  DeploymentWorkflowHostedProbe,
  DeploymentWorkflowProviderReadback,
} from "./workflow-receipts.schemas.js";

const decodeAutomations = (input: unknown) =>
  Effect.runPromise(
    Schema.decodeUnknownEffect(DeploymentAutomationRegister)(input)
  );

const decodeRegisters = () =>
  Effect.runPromise(
    Effect.all([
      Schema.decodeUnknownEffect(DeploymentAutomationRegister)(automationJson),
      Schema.decodeUnknownEffect(DeploymentControlRegister)(controlsJson),
    ])
  );

describe("docs deployment automation admission", () => {
  test("accepts the exact four deployment automations and controls before hosted establishment", async () => {
    const [automations, controls] = await decodeRegisters();
    expect(inspectDeploymentAutomationRegisters(automations, controls)).toEqual(
      []
    );
    expect(
      automations.every(
        (entry) => entry.externalState.status === "not-established"
      )
    ).toBe(true);
  });

  test("rejects a cancellable or weakly bound mutation", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-preview-delivery"
          ? {
              ...entry,
              lock: {
                ...entry.lock,
                cancelInProgress: true,
                group: "candidate-only",
              },
              plan: {
                ...entry.plan,
                equalReplanRequired: false,
              },
            }
          : entry
      )
    );
    expect(
      inspectDeploymentAutomationRegisters(contaminated, controls).map(
        (item) => item.invariant
      )
    ).toEqual(["mutation-lock", "plan-equality"]);
  });

  test("rejects additive credentials, resources and weakened candidate ownership", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-production-delivery"
          ? {
              ...entry,
              authority: {
                ...entry.authority,
                credentialIdentities: [
                  ...entry.authority.credentialIdentities,
                  "UNSCOPED_TOKEN",
                ],
                resources: [
                  ...entry.authority.resources,
                  "UnrelatedStack/prod/Other",
                ],
              },
              failure: {
                ...entry.failure,
                stopConditions: entry.failure.stopConditions.filter(
                  (condition) =>
                    condition !==
                    "quality result is absent or belongs to another commit"
                ),
              },
              signal: {
                ...entry.signal,
                revisionSource: "floating branch tip",
              },
            }
          : entry
      )
    );
    expect(
      inspectDeploymentAutomationRegisters(contaminated, controls).map(
        (item) => item.invariant
      )
    ).toEqual(["candidate-trust"]);
  });

  test("rejects pull-request-head teardown code", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-preview-teardown"
          ? {
              ...entry,
              signal: {
                ...entry.signal,
                revisionSource: "pull-request head",
              },
            }
          : entry
      )
    );
    expect(
      inspectDeploymentAutomationRegisters(contaminated, controls).map(
        (item) => item.invariant
      )
    ).toContain("teardown-safety");
  });

  test("rejects mutating or broadly credentialed orphan inventory", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-orphan-inventory"
          ? {
              ...entry,
              authority: {
                ...entry.authority,
                credentialIdentities: ["CLOUDFLARE_API_TOKEN"],
                denied: entry.authority.denied.filter(
                  (denial) =>
                    denial !== "provider-write" &&
                    denial !== "automatic-orphan-deletion"
                ),
              },
              lock: {
                ...entry.lock,
                cancelInProgress: false,
              },
            }
          : entry
      )
    );
    expect(
      inspectDeploymentAutomationRegisters(contaminated, controls).map(
        (item) => item.invariant
      )
    ).toContain("orphan-report-only");
  });

  test("rejects every external-state establishment until hosted receipt admission exists", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-preview-delivery"
          ? {
              ...entry,
              externalState: {
                receipt: "docs/evidence/deployments/fake.json",
                status: "established" as const,
              },
            }
          : entry
      )
    );
    const [firstControl] = controls;
    expect(firstControl).toBeDefined();
    if (firstControl === undefined) {
      return;
    }
    const findings = inspectDeploymentAutomationRegisters(contaminated, [
      ...controls,
      firstControl,
    ]).map((item) => item.invariant);
    expect(findings).toEqual(["control-register", "external-proof"]);
  });

  test("accepts an established entry only with the decoded matching workflow receipt", async () => {
    const [automations, controls] = await decodeRegisters();
    const preview = automations.find(
      (entry) => entry.id === "docs-preview-delivery"
    );
    expect(preview).toBeDefined();
    if (preview === undefined) {
      return;
    }
    const configSha256 = "c".repeat(64);
    const deploymentInputSha256 = "d".repeat(64);
    const lockfileSha256 = "e".repeat(64);
    const accountId = "f".repeat(32);
    const rollbackRecoveryIdentity = "preview-recovery";
    const candidateCommit = "b".repeat(40);
    const stage = "pr-15";
    const projection = {
      candidate: {
        deploymentInputSha256,
        exactCommit: candidateCommit,
        lockfileSha256,
      },
      configSha256,
      logicalResources: [
        {
          action: "create" as const,
          logicalId: "DocsBuild" as const,
          resourceType: "Command.Build" as const,
        },
        {
          action: "create" as const,
          logicalId: "DocsWebsite" as const,
          resourceType: "Cloudflare.Worker" as const,
        },
      ],
      redaction: {
        ansiRemoved: true as const,
        secretValuesIncluded: false as const,
        timestampsExcludedFromDigest: true as const,
      },
      schemaVersion: 1 as const,
      stack: "TaxKitDocsCloudflare" as const,
      stage,
    };
    const acceptedPlanSha256 = deploymentRecordDigest(projection);
    const receipt = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentWorkflowExternalReceipt)({
        acceptedPlanSha256,
        accountId,
        automationId: preview.id,
        candidateCommit,
        configSha256,
        deploymentInputSha256,
        environment: preview.environment.id,
        hostedProofPath: "docs/evidence/deployments/workflow-hosted.json",
        lockGroup: preview.lock.group,
        lockfileSha256,
        nonClaims: ["This fixture is not provider proof."],
        observedAt: "2026-08-10T00:00:00Z",
        operation: "preview-deploy",
        planPath: "docs/evidence/deployments/workflow-plan.json",
        postcondition: "provider and hosted identities agree",
        previousVersionId: null,
        principal: preview.authority.principal,
        providerReadbackPath:
          "docs/evidence/deployments/workflow-provider.json",
        rollbackRecoveryIdentity,
        schemaVersion: 1,
        stage,
        workflowCommit: "c".repeat(40),
        workflowPath: ".github/workflows/docs-preview.yml",
        workflowReceiptPath: "docs/evidence/deployments/workflow-preview.json",
        workflowRunId: "123",
        workflowRunPath: "docs/evidence/deployments/workflow-run.json",
      })
    );
    const plan = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentPlanReceipt)({
        acceptedBy: "Cooper",
        acceptedPlanSha256: receipt.acceptedPlanSha256,
        observedAt: "2026-08-10T00:00:00Z",
        operation: "preview-equal-replan",
        projection,
        receiptPath: receipt.planPath ?? "docs/evidence/deployments/plan.json",
        replanSha256: receipt.acceptedPlanSha256,
        schemaVersion: 1,
      })
    );
    const provider = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentWorkflowProviderReadback)({
        acceptedPlanSha256: receipt.acceptedPlanSha256,
        accountId,
        candidateCommit: receipt.candidateCommit,
        configSha256,
        deploymentId: "deployment-1",
        deploymentInputSha256,
        lockfileSha256,
        previewPrNumber: 15,
        previousVersionId: null,
        rollbackRecoveryIdentity,
        schemaVersion: 1,
        stage: receipt.stage,
        stateStoreId: "cloudflare-http",
        url: "https://docs-preview.workers.dev",
        versionId: "version-1",
        workerName: "taxkit-docs-preview",
      })
    );
    const hosted = await Effect.runPromise(
      Schema.decodeUnknownEffect(DeploymentWorkflowHostedProbe)({
        acceptedPlanSha256: receipt.acceptedPlanSha256,
        accountId,
        candidateCommit: receipt.candidateCommit,
        configSha256,
        deploymentId: provider.deploymentId,
        deploymentInputSha256,
        diagnostics: [],
        environment: "preview",
        lockfileSha256,
        previewPrNumber: 15,
        previousVersionId: null,
        rollbackRecoveryIdentity,
        screenshots: [
          {
            kind: "desktop",
            path: "docs/evidence/deployments/desktop.png",
            sha256: "0".repeat(64),
            viewport: { deviceScaleFactor: 1, height: 1000, width: 1440 },
          },
          {
            kind: "mobile",
            path: "docs/evidence/deployments/mobile.png",
            sha256: "0".repeat(64),
            viewport: { deviceScaleFactor: 1, height: 844, width: 390 },
          },
        ],
        stage: receipt.stage,
        stateStoreId: provider.stateStoreId,
        url: provider.url,
        versionId: provider.versionId,
        workerName: provider.workerName,
      })
    );
    const workflowRun = {
      candidateCommit: receipt.candidateCommit,
      conclusion: "success" as const,
      event: "workflow_dispatch",
      headBranch: "main" as const,
      headSha: receipt.workflowCommit,
      path: receipt.workflowPath,
      ref: "refs/heads/main" as const,
      status: "completed" as const,
      workflowName: "Docs Preview Deployment",
      workflowRunId: receipt.workflowRunId,
    };
    const established = automations.map((entry) =>
      entry.id === preview.id
        ? {
            ...entry,
            externalState: {
              receipt: receipt.workflowReceiptPath,
              status: "established" as const,
            },
          }
        : entry
    );
    expect(
      inspectDeploymentAutomationRegisters(
        established,
        controls,
        new Map([[preview.id, receipt]]),
        new Map([
          [preview.id, { hosted, plan, provider, receipt, workflowRun }],
        ])
      )
    ).toEqual([]);

    expect(
      inspectDeploymentAutomationRegisters(
        established,
        controls,
        new Map([[preview.id, receipt]]),
        new Map([
          [
            preview.id,
            {
              hosted,
              plan,
              provider,
              receipt,
              workflowRun: { ...workflowRun, headSha: "d".repeat(40) },
            },
          ],
        ])
      ).map((item) => item.invariant)
    ).toContain("external-proof");

    expect(
      inspectDeploymentAutomationRegisters(
        established,
        controls,
        new Map([[preview.id, receipt]]),
        new Map([
          [
            preview.id,
            {
              hosted,
              plan: { ...plan, replanSha256: null },
              provider,
              receipt,
              workflowRun,
            },
          ],
        ])
      ).map((item) => item.invariant)
    ).toContain("external-proof");

    expect(
      inspectDeploymentAutomationRegisters(
        established,
        controls,
        new Map([[preview.id, receipt]]),
        new Map([
          [
            preview.id,
            {
              hosted,
              plan,
              provider,
              receipt,
              workflowRun: {
                ...workflowRun,
                candidateCommit: "d".repeat(40),
              },
            },
          ],
        ])
      ).map((item) => item.invariant)
    ).toContain("external-proof");

    expect(
      inspectDeploymentAutomationRegisters(
        established,
        controls,
        new Map([[preview.id, receipt]]),
        new Map([
          [
            preview.id,
            {
              hosted: {
                ...hosted,
                environment: "production",
                screenshots: [hosted.screenshots[0], hosted.screenshots[0]],
              },
              plan,
              provider,
              receipt,
              workflowRun,
            },
          ],
        ])
      ).map((item) => item.invariant)
    ).toContain("external-proof");
  });

  test("rejects additive denials and orphan ownership expansion", async () => {
    const [automations, controls] = await decodeRegisters();
    const contaminated = await decodeAutomations(
      automations.map((entry) =>
        entry.id === "docs-orphan-inventory"
          ? {
              ...entry,
              authority: {
                ...entry.authority,
                denied: [...entry.authority.denied, "new-unknown-denial"],
                resources: [...entry.authority.resources, "UnrelatedStack"],
              },
            }
          : entry
      )
    );
    expect(
      inspectDeploymentAutomationRegisters(contaminated, controls).map(
        (item) => item.invariant
      )
    ).toEqual(["orphan-report-only"]);
  });
});
