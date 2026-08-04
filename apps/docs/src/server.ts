import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { readDocsRuntimeProbe } from "./lib/runtime-factory.server";

const startHandler = createStartHandler(defaultStreamHandler);
const runtimeProofRequestHeader = "x-taxkit-docs-runtime-proof";
const runtimeProofResponseHeader = "x-taxkit-docs-runtime-constructions";
const runtimeProofIsolateHeader = "x-taxkit-docs-runtime-isolate";

export default {
  fetch: async (request: Request) => {
    const response = await startHandler(request);

    if (
      request.headers.get(runtimeProofRequestHeader) !== "construction-count"
    ) {
      return response;
    }

    const probe = readDocsRuntimeProbe();
    const headers = new Headers(response.headers);

    headers.set(runtimeProofResponseHeader, String(probe.constructions));
    headers.set(runtimeProofIsolateHeader, probe.isolateId);

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  },
};
