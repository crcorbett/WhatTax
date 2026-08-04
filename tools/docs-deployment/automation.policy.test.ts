import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import automationJson from "./automation-register.json";
import { inspectDeploymentAutomationRegisters } from "./automation.policy.js";
import {
  DeploymentAutomationRegister,
  DeploymentControlRegister,
} from "./automation.schemas.js";
import controlsJson from "./controls.json";

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
