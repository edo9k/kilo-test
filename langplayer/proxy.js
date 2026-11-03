const http = require("http");
const https = require("https");
const PORT = process.env.PORT || 3456;

function fetchUrl(url, cb) {
  const lib = url.startsWith("https:") ? https : http;
  const req = lib.get(url, { headers: { "User-Agent": "Mozilla/5.0 langplayer-proxy" } }, (res) => {
    let data = "";
    res.on("data", (c) => (data += c));
    res.on("end", () => cb(null, res.statusCode, res.headers["content-type"] || "application/xml", data));
  });
  req.on("error", (e) => cb(e));
  req.setTimeout(15000, () => { req.destroy(new Error("timeout")); });
}

http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  const target = u.searchParams.get("url");
  if (!target) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("usage: /proxy?url=<rss-url>");
    return;
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "no-store");
  fetchUrl(target, (err, status, ct, body) => {
    if (err) {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("proxy error: " + err.message);
      return;
    }
    res.writeHead(status, { "Content-Type": ct });
    res.end(body);
  });
}).listen(PORT, () => console.log("langplayer CORS proxy on :"+PORT));
