const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml" };

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = path.resolve(root, requested);
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end("Not found"); return; }
    response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    response.end(data);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("Frontend is already running at http://127.0.0.1:4173");
    process.exitCode = 1;
    return;
  }

  throw error;
});

server.listen(4173, "127.0.0.1", () =>
  console.log("Frontend: http://127.0.0.1:4173"));
