import { $ } from "bun";

const VERSION = "1.0.0";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  console.error(
    "Error: ACCESS_TOKEN environment variable is required.\nExample: ACCESS_TOKEN=yourtoken bun run index.ts"
  );
  process.exit(1);
}

const port = Number(process.env.PORT) || 3030;
const caddyfilePath = process.env.CADDYFILE_PATH || `/etc/caddy/Caddyfile`;
const corsOrigin = process.env.CORS_ORIGIN || "*";

const CORS_HEADERS = {
  "access-control-allow-origin": corsOrigin,
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Authorization, Content-Type",
} as const;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

function checkAuth(req: Request): boolean {
  return req.headers.get("Authorization") === `Bearer ${ACCESS_TOKEN}`;
}

function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

function homePage() {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Caddyfile Editor Service</title>
</head>
<body>
  <h1>Caddyfile Editor Service <small>v${VERSION}</small></h1>
  <p>Port: ${port} &nbsp;|&nbsp; Caddyfile: <code>${caddyfilePath}</code> &nbsp;|&nbsp; CORS: <code>${corsOrigin}</code></p>
  <pre>GET  /api/caddyfile      读取文件
POST /api/caddyfile      写入文件
POST /api/caddy/reload   重载 Caddy</pre>
</body>
</html>`;
}

Bun.serve({
  port,
  routes: {
    "/api/caddyfile": {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      async GET(req) {
        if (!checkAuth(req)) return unauthorized();
        try {
          const content = await Bun.file(caddyfilePath).text();
          return json({ content, path: caddyfilePath });
        } catch (err: any) {
          if (err.code === "ENOENT") return json({ error: `Caddyfile not found: ${caddyfilePath}` }, 404);
          return json({ error: String(err) }, 500);
        }
      },
      async POST(req) {
        if (!checkAuth(req)) return unauthorized();
        const body = (await req.json()) as { content?: string };
        if (typeof body.content !== "string") {
          return json({ error: "Missing content field" }, 400);
        }
        await Bun.write(caddyfilePath, body.content);
        return json({ ok: true });
      },
    },
    "/api/caddy/reload": {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      async POST(req) {
        if (!checkAuth(req)) return unauthorized();
        try {
          const result = process.env.CADDY_RELOAD_CMD
            ? await $`sh -c ${process.env.CADDY_RELOAD_CMD}`.quiet()
            : await $`caddy reload --config ${caddyfilePath}`.quiet();
          return json({ ok: true, stderr: result.stderr.toString() });
        } catch (err: any) {
          return json({ ok: false, error: err.stderr?.toString() ?? String(err) }, 500);
        }
      },
    },
  },
  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    const { pathname } = new URL(req.url);
    if (pathname === "/" || pathname === "/index.html") {
      return new Response(homePage(), { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Caddyfile Editor Service running on http://localhost:${port}`);
console.log(`Caddyfile: ${caddyfilePath}`);
console.log(`CORS Origin: ${corsOrigin}`);
