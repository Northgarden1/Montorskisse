import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const port = Number(process.argv[2] || 8766);
const host = process.argv[3] || "127.0.0.1";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".svg", "image/svg+xml"]
]);

const server = http.createServer(async (request, response) => {
  try {
    const requestedPath = new URL(request.url, `http://${host}`).pathname;
    const normalized = path.normalize(decodeURIComponent(requestedPath)).replace(/^[/\\]+/, "");
    const target = path.join(rootDir, normalized || "index.html");
    const relative = path.relative(rootDir, target);

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const stat = await fs.stat(target).catch(() => null);
    const filePath = stat?.isDirectory() ? path.join(target, "index.html") : target;
    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Utility Markup server running at http://${host}:${port}/`);
});
