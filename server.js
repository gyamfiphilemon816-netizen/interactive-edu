const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/health") {
    return send(res, 200, JSON.stringify({
      status: "ok",
      service: "gyamfi-learning-hub-api",
      timestamp: new Date().toISOString(),
      note: "Health check only; learning data APIs are not yet connected."
    }), "application/json; charset=utf-8");
  }
  let pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.resolve(root, "." + pathname);
  if (!filePath.startsWith(root + path.sep)) return send(res, 403, "Forbidden");
  fs.readFile(filePath, (error, content) => {
    if (error) return send(res, error.code === "ENOENT" ? 404 : 500, "File not found");
    send(res, 200, content, mime[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log("Gyamfi Learning Hub running at http://localhost:" + port);
});