const aiResponses = [
  { keys: ["helmet", "head"], text: "For helmets, choose a certified full-face helmet if you ride on highways. It gives stronger face and chin protection than open-face models." },
  { keys: ["jacket", "armor"], text: "For jackets, look for abrasion-resistant material and CE Level 2 armor at shoulders, elbows, and back." },
  { keys: ["size", "fit"], text: "Riding gear should feel snug but not restrict movement. If you are between sizes, choose the product page size option and add body measurements in notes." },
  { keys: ["rain", "weather"], text: "For rain riding, combine waterproof outer layers with gloves and boots that seal at the wrist and ankle." },
  { keys: ["delivery", "payment"], text: "This demo supports Credit Card, PayPal, Cash on Delivery, and Bank Transfer. No real payment is processed." },
  { keys: ["custom", "initial", "name"], text: "Use Customize Product to choose size, color, initials, material, protection level, and order notes before adding to cart." }
];

function smartReply(input) {
  const text = input.toLowerCase();
  const match = aiResponses.find((item) => item.keys.some((key) => text.includes(key)));
  return match ? match.text : "Tell me your riding style: city, highway, touring, sport, rain, or beginner. I can suggest safer gear combinations.";
}

async function saveAiMessage(role, message) {
  if (!window.motoSupabase) return;
  await window.motoSupabase.from("ai_chat_messages").insert({ role, message });
}

function addAiMessage(container, text, role = "assistant") {
  const bubble = document.createElement("div");
  bubble.className = `ai-msg ${role}`.trim();
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.querySelector("#aiAssistant");
  if (!host) return;
  host.innerHTML = `
    <button class="ai-launcher" type="button" aria-label="Open AI assistant">AI</button>
    <section class="ai-window" aria-label="MotoShield AI assistant">
      <div class="ai-head"><strong>MotoShield Assistant</strong><button class="remove-btn" type="button" aria-label="Close">X</button></div>
      <div class="ai-messages"></div>
      <form class="ai-form"><input aria-label="Ask assistant" placeholder="Ask about safety gear"><button class="btn primary small" type="submit">Send</button></form>
    </section>
  `;

  const launcher = host.querySelector(".ai-launcher");
  const windowEl = host.querySelector(".ai-window");
  const close = host.querySelector(".remove-btn");
  const messages = host.querySelector(".ai-messages");
  const form = host.querySelector(".ai-form");
  const input = form.querySelector("input");

  addAiMessage(messages, "Hi. I can help you choose safer motorcycle gear, sizes, materials, and protection levels.");

  launcher.addEventListener("click", () => windowEl.classList.toggle("open"));
  close.addEventListener("click", () => windowEl.classList.remove("open"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    addAiMessage(messages, question, "user");
    await saveAiMessage("user", question);
    const answer = smartReply(question);
    addAiMessage(messages, answer);
    await saveAiMessage("assistant", answer);
  });
});
