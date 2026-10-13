const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

const STORAGE_KEY = "ai-chat-history";

let history = loadHistory();
renderAll();

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function renderAll() {
  messagesEl.innerHTML = "";
  history.forEach((msg) => appendMessage(msg.role, msg.content));
}

function appendMessage(role, content) {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.textContent = content;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

function autoResize() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
}

inputEl.addEventListener("input", autoResize);

inputEl.addEventListener("keydown", (e) => {
  if (e.isComposing || e.keyCode === 229) return;
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = "";
  autoResize();
  sendBtn.disabled = true;

  history.push({ role: "user", content: text });
  appendMessage("user", text);
  saveHistory();

  const loadingEl = appendMessage("assistant loading", "답변 생성 중...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    const data = await res.json();

    loadingEl.remove();

    if (!res.ok) {
      appendMessage("error", data.error || "오류가 발생했습니다.");
      return;
    }

    history.push({ role: "assistant", content: data.reply });
    appendMessage("assistant", data.reply);
    saveHistory();
  } catch (err) {
    loadingEl.remove();
    appendMessage("error", "서버에 연결할 수 없습니다.");
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
});

resetBtn.addEventListener("click", () => {
  history = [];
  sessionStorage.removeItem(STORAGE_KEY);
  renderAll();
});
