import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          bindings: {
            HEALTH_SYNC_API_KEY: "test-api-key",
          },
          serviceBindings: {
            HEALTH_SYNC_API: (request: Request) => {
              return new Response(
                JSON.stringify({
                  success: true,
                  url: request.url,
                  method: request.method,
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );
            },
          },
        },
      },
    },
  },
});
