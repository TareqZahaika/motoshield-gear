const TELEGRAM_PUBLIC_LINK = "https://t.me/";

// Place real TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on a backend server only.
// A backend endpoint can safely call https://api.telegram.org/bot<TOKEN>/sendMessage.
async function sendMessageToTelegram(message) {
  console.info("Telegram placeholder. Send this from a backend function:", message);
  return { ok: true, demo: true };
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#telegramButton");
  if (!button) return;
  button.addEventListener("click", () => {
    window.open(TELEGRAM_PUBLIC_LINK, "_blank", "noopener");
  });
});
