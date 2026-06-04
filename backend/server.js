const http = require("http");
const https = require("https");

const port = process.env.PORT || 4000;
const telegramConfigured = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
const aiConfigured = Boolean(process.env.AI_API_KEY);

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    if (!telegramConfigured) {
      resolve({ ok: true, demo: true, message: "Telegram is not configured on the backend." });
      return;
    }

    const payload = JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text
    });

    const request = https.request({
      hostname: "api.telegram.org",
      path: `/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, (telegramResponse) => {
      let body = "";
      telegramResponse.on("data", (chunk) => { body += chunk; });
      telegramResponse.on("end", () => {
        resolve({
          ok: telegramResponse.statusCode >= 200 && telegramResponse.statusCode < 300,
          status: telegramResponse.statusCode,
          body
        });
      });
    });

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function demoAiReply(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("helmet")) return "Choose a full-face helmet for the strongest face and chin protection.";
  if (text.includes("jacket")) return "Choose an armored jacket with abrasion-resistant fabric and shoulder, elbow, and back protection.";
  if (text.includes("size")) return "Riding gear should fit snugly without blocking movement. Add measurements in the order notes.";
  return "Tell me your riding style: city, highway, sport, touring, rain, or beginner. I can suggest safer gear.";
}

http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    json(response, 200, { ok: true });
    return;
  }

  if (request.url === "/" || request.url === "/health") {
    json(response, 200, {
      ok: true,
      service: "MotoShield Gear Backend",
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || "local",
      integrations: {
        aiConfigured,
        telegramConfigured
      }
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

  if (request.url === "/api/config") {
    json(response, 200, {
      aiConfigured,
      telegramConfigured,
      telegramPublicLink: process.env.TELEGRAM_PUBLIC_LINK || "https://t.me/"
    });
    return;
  }

  if (request.url === "/api/ai-chat" && request.method === "POST") {
    const body = await readJson(request);
    json(response, 200, {
      provider: aiConfigured ? process.env.AI_PROVIDER || "configured" : "demo",
      model: aiConfigured ? process.env.AI_MODEL || "default" : "demo",
      reply: demoAiReply(body.message)
    });
    return;
  }

  if (request.url === "/api/telegram-message" && request.method === "POST") {
    const body = await readJson(request);
    const result = await sendTelegramMessage(
      `MotoShield contact message\nName: ${body.full_name || "Customer"}\nEmail: ${body.email || "N/A"}\nMessage: ${body.message || body.subject || "No message"}`
    );
    json(response, result.ok ? 200 : 502, result);
    return;
  }

  json(response, 404, { error: "Not found" });
}).listen(port, () => {
  console.log(`MotoShield backend running on port ${port}`);
});
