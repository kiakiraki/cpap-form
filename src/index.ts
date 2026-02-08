import { Hono } from "hono";

type Bindings = {
  HEALTH_SYNC_API: Fetcher;
  HEALTH_SYNC_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/api/cpap", async (c) => {
  console.log("env:", {
    HEALTH_SYNC_API: c.env.HEALTH_SYNC_API ? "[BOUND]" : "[NOT BOUND]",
    HEALTH_SYNC_API_KEY: c.env.HEALTH_SYNC_API_KEY ? "[SET]" : "[NOT SET]",
  });

  try {
    const body = await c.req.json();
    console.log("request body:", body);

    console.log("fetching via Service Binding: /cpap");

    const response = await c.env.HEALTH_SYNC_API.fetch(
      new Request("https://health-sync-api/cpap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${c.env.HEALTH_SYNC_API_KEY}`,
        },
        body: JSON.stringify(body),
      })
    );

    console.log("response status:", response.status);
    const responseText = await response.text();
    console.log("response body:", responseText);

    try {
      const data = JSON.parse(responseText);
      return c.json(data, response.status as 200);
    } catch {
      return c.json({ error: "Invalid JSON response", raw: responseText }, 502);
    }
  } catch (error) {
    console.error("error:", error);
    return c.json({ error: String(error) }, 500);
  }
});

export default app;
