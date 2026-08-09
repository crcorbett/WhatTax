import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import { DocsDeploymentInventoryReport } from "./inventory.schemas.js";
import { GitHubOpenPullRequest } from "./orphan-inventory.schemas.js";
import {
  inspectDocsDeploymentOrphanInventoryReceipt,
  makeDocsDeploymentOrphanInventoryReceipt,
} from "./orphan-inventory.service.js";

const decodeInventory = (input: unknown) =>
  Effect.runPromise(
    Schema.decodeUnknownEffect(DocsDeploymentInventoryReport)(input)
  );
const decodePullRequests = (input: unknown) =>
  Effect.runPromise(
    Schema.decodeUnknownEffect(Schema.Array(GitHubOpenPullRequest))(input)
  );

const inventoryFixture = {
  agreement: "state-provider-agree",
  nonClaims: ["fixture"],
  providerWorkers: [
    {
      logicalId: "DocsWebsite",
      stage: "pr-1",
      workerName: "taxkitdocscloudflare-docswebsite-pr-1-example",
    },
    {
      logicalId: "DocsWebsite",
      stage: "pr-2",
      workerName: "taxkitdocscloudflare-docswebsite-pr-2-example",
    },
    {
      logicalId: "DocsWebsite",
      stage: "pr-3",
      workerName: "taxkitdocscloudflare-docswebsite-pr-3-example",
    },
  ],
  stack: "TaxKitDocsCloudflare",
  stages: [
    {
      resources: [
        {
          instanceId: "worker-1",
          logicalId: "DocsWebsite",
          resourceType: "Cloudflare.Worker",
          status: "created",
          workerName: "taxkitdocscloudflare-docswebsite-pr-1-example",
          workerUrl:
            "https://taxkitdocscloudflare-docswebsite-pr-1-example.example.workers.dev",
        },
      ],
      stage: "pr-1",
    },
    {
      resources: [
        {
          instanceId: "worker-2",
          logicalId: "DocsWebsite",
          resourceType: "Cloudflare.Worker",
          status: "created",
          workerName: "taxkitdocscloudflare-docswebsite-pr-2-example",
          workerUrl:
            "https://taxkitdocscloudflare-docswebsite-pr-2-example.example.workers.dev",
        },
      ],
      stage: "pr-2",
    },
    {
      resources: [
        {
          instanceId: "worker-3",
          logicalId: "DocsWebsite",
          resourceType: "Cloudflare.Worker",
          status: "created",
          workerName: "taxkitdocscloudflare-docswebsite-pr-3-example",
          workerUrl:
            "https://taxkitdocscloudflare-docswebsite-pr-3-example.example.workers.dev",
        },
      ],
      stage: "pr-3",
    },
  ],
  stateStore: { id: "cloudflare-http", version: 7 },
};

const pullRequestFixture = [
  {
    headRefOid: "1111111111111111111111111111111111111111",
    isCrossRepository: false,
    isDraft: true,
    number: 1,
    state: "OPEN",
    url: "https://github.com/crcorbett/taxkit/pull/1",
  },
  {
    headRefOid: "2222222222222222222222222222222222222222",
    isCrossRepository: true,
    isDraft: true,
    number: 2,
    state: "OPEN",
    url: "https://github.com/crcorbett/taxkit/pull/2",
  },
  {
    headRefOid: "4444444444444444444444444444444444444444",
    isCrossRepository: false,
    isDraft: false,
    number: 4,
    state: "OPEN",
    url: "https://github.com/crcorbett/taxkit/pull/4",
  },
];

describe("docs deployment report-only orphan inventory", () => {
  test("classifies trusted, untrusted and missing pull-request stages without deletion authority", async () => {
    const inventory = await decodeInventory(inventoryFixture);
    const pullRequests = await decodePullRequests(pullRequestFixture);
    const receipt = makeDocsDeploymentOrphanInventoryReceipt(
      "2026-07-30T00:00:00.000Z",
      pullRequests,
      inventory
    );
    expect(receipt.previewStages.map((entry) => entry.classification)).toEqual([
      "active-trusted-preview",
      "untrusted-preview-stage",
      "orphan-candidate",
    ]);
    expect(
      receipt.trustedPullRequestsWithoutStage.map((entry) => entry.number)
    ).toEqual([4]);
    expect(receipt.mutationCapability).toBe("none");
    expect(receipt.automaticDeletion).toBe("prohibited");
    expect(inspectDocsDeploymentOrphanInventoryReceipt(receipt)).toEqual([]);
  });

  test("rejects a false-green classification detached from source inventories", async () => {
    const inventory = await decodeInventory(inventoryFixture);
    const pullRequests = await decodePullRequests(pullRequestFixture);
    const receipt = makeDocsDeploymentOrphanInventoryReceipt(
      "2026-07-30T00:00:00.000Z",
      pullRequests,
      inventory
    );
    expect(
      inspectDocsDeploymentOrphanInventoryReceipt({
        ...receipt,
        previewStages: receipt.previewStages.map((entry) => ({
          ...entry,
          classification: "active-trusted-preview",
        })),
      })
    ).toEqual([
      "orphan-inventory-classification: open pull requests, Alchemy stages and Cloudflare Workers must produce the exact report-only classification",
    ]);
  });
});
