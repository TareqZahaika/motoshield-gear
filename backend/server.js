const http = require("http");

const port = process.env.PORT || 4000;

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(body));
}

http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    json(response, 200, { ok: true });
    return;
  }

  if (request.url === "/" || request.url === "/health") {
    json(response, 200, {
      ok: true,
      service: "MotoShield Gear Backend",
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || "local"
    });
    return;
  }

  if (request.url === "/api/store-info") {
    json(response, 200, {
      name: "MotoShield Gear",
      slogan: "Ride Safe. Ride Smart. Ride Protected.",
      support: "Use the contact page or Telegram placeholder for customer messages."
    });
    return;
  }

  json(response, 404, { error: "Not found" });
}).listen(port, () => {
  console.log(`MotoShield backend running on port ${port}`);
});
