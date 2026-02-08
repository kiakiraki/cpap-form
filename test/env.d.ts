declare module "cloudflare:test" {
  interface ProvidedEnv {
    HEALTH_SYNC_API: Fetcher;
    HEALTH_SYNC_API_KEY: string;
  }
}
