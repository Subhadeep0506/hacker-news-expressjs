import "dotenv/config";

const baseUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL;
const targetUrl = baseUrl ? new URL("/health", baseUrl).toString() : null;

if (!targetUrl) {
  console.error("Missing APP_URL or RENDER_EXTERNAL_URL environment variable");
  process.exit(1);
}

async function ping() {
  const startedAt = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "user-agent": "render-cron-ping/1.0",
        accept: "application/json",
      },
    });

    const durationMs = Date.now() - startedAt;
    console.log(
      JSON.stringify({
        ok: response.ok,
        status: response.status,
        url: targetUrl,
        durationMs,
        at: new Date().toISOString(),
      }),
    );
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    console.error(
      JSON.stringify({
        ok: false,
        url: targetUrl,
        durationMs,
        at: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

await ping();
