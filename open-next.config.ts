import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  functions: {
    "ai-assistant": {
      runtime: "edge",
      routes: ["app/api/ai-assistant/route"],
      patterns: ["/api/ai-assistant"],
      override: {
        wrapper: "cloudflare-edge",
        converter: "edge",
        proxyExternalRequest: "fetch",
        incrementalCache: "dummy",
        tagCache: "dummy",
        queue: "dummy",
      },
    },
    "generate-description": {
      runtime: "edge",
      routes: ["app/api/generate-description/route"],
      patterns: ["/api/generate-description"],
      override: {
        wrapper: "cloudflare-edge",
        converter: "edge",
        proxyExternalRequest: "fetch",
        incrementalCache: "dummy",
        tagCache: "dummy",
        queue: "dummy",
      },
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
