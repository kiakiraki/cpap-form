import { describe, it, expect } from "vitest";
import { SELF } from "cloudflare:test";

describe("POST /api/cpap", () => {
  it("正常なデータを送信すると200が返る", async () => {
    const response = await SELF.fetch("https://example.com/api/cpap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recorded_date: "2025-04-01",
        ahi: 2.5,
        ai: 1.2,
        leak: 12.0,
        usage_hours: 7.5,
        notes: "テスト",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json<{ success: boolean }>();
    expect(data.success).toBe(true);
  });

  it("不正なJSONを送信すると500が返る", async () => {
    const response = await SELF.fetch("https://example.com/api/cpap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });

    expect(response.status).toBe(500);
    const data = await response.json<{ error: string }>();
    expect(data).toHaveProperty("error");
  });
});

describe("未定義のルート", () => {
  it("存在しないパスには404が返る", async () => {
    const response = await SELF.fetch("https://example.com/nonexistent");

    expect(response.status).toBe(404);
  });
});
