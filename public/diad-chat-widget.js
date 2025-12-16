// public/diad-chat-widget.js

(function () {
  // 🔧 TODO: set this to your DIAD backend URL
  // For local dev (when running the frontend also locally):
  //   const API_BASE = "http://127.0.0.1:8002";
  // For production (after you deploy the API, e.g. Cloud Run URL):
  //   const API_BASE = "https://your-diad-backend-url";

  const API_BASE = window.DIAD_API_BASE ||
  "https://diad-external-chat-38640153199.asia-southeast1.run.app";


  const SESSION_KEY = "diad_external_chat_session_id";

  function getOrCreateSessionId() {
    try {
      if (typeof window === "undefined") {
        return "session-" + Math.random().toString(36).slice(2);
      }
      let existing = window.localStorage.getItem(SESSION_KEY);
      if (existing) return existing;
      const newId = "session-" + crypto.randomUUID();
      window.localStorage.setItem(SESSION_KEY, newId);
      return newId;
    } catch (e) {
      return "session-" + Math.random().toString(36).slice(2);
    }
  }

  async function callExternalChat(question, email) {
    const sessionId = getOrCreateSessionId();

    const payload = {
      question,
      session_id: sessionId,
    };
    if (email) {
      payload.email = email;
    }

    const res = await fetch(API_BASE + "/external/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        "Chat API error: " + res.status + " – " + res.statusText + " – " + text
      );
    }

    return res.json();
  }

  // ---------- UI helpers ----------

  function createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .diad-chat-bubble-btn {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #111827;
        color: #f9fafb;
        border: none;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        font-size: 24px;
      }

      .diad-chat-bubble-btn:hover {
        background: #1f2937;
      }

      .diad-chat-window {
        position: fixed;
        right: 20px;
        bottom: 90px;
        width: 320px;
        max-height: 480px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 16px 40px rgba(15,23,42,0.35);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .diad-chat-header {
        background: linear-gradient(135deg, #111827, #1f2937);
        color: #f9fafb;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
      }

      .diad-chat-header-title {
        font-weight: 600;
      }

      .diad-chat-header-subtitle {
        font-size: 11px;
        opacity: 0.8;
      }

      .diad-chat-header-right {
        cursor: pointer;
        font-size: 18px;
      }

      .diad-chat-body {
        padding: 10px;
        background: #f3f4f6;
        flex: 1;
        overflow-y: auto;
        font-size: 13px;
      }

      .diad-chat-message {
        margin-bottom: 8px;
        display: flex;
      }

      .diad-chat-message.user {
        justify-content: flex-end;
      }

      .diad-chat-message.bot {
        justify-content: flex-start;
      }

      .diad-chat-bubble {
        border-radius: 12px;
        padding: 8px 10px;
        max-width: 80%;
        line-height: 1.4;
        white-space: pre-wrap;
      }

      .diad-chat-message.user .diad-chat-bubble {
        background: #111827;
        color: #f9fafb;
        border-bottom-right-radius: 2px;
      }

      .diad-chat-message.bot .diad-chat-bubble {
        background: #e5e7eb;
        color: #111827;
        border-bottom-left-radius: 2px;
      }

      .diad-chat-footer {
        padding: 8px;
        border-top: 1px solid #e5e7eb;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .diad-chat-footer input,
      .diad-chat-footer textarea {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        padding: 6px 8px;
        font-size: 12px;
        font-family: inherit;
        box-sizing: border-box;
        background: #ffffff !important;
        color: #111827 !important;
        caret-color: #111827 !important;
      }

      .diad-chat-footer input::placeholder,
      .diad-chat-footer textarea::placeholder {
        color: #6b7280 !important;
        opacity: 1 !important;
      }

      .diad-chat-footer textarea {
        height: 52px;
        resize: none;
      }

      .diad-chat-footer button {
        border-radius: 8px;
        border: none;
        padding: 6px 8px;
        font-size: 13px;
        font-weight: 500;
        background: #111827;
        color: #f9fafb;
        cursor: pointer;
      }

      .diad-chat-footer button:disabled {
        opacity: 0.6;
        cursor: default;
      }

      .diad-chat-small {
        font-size: 10px;
        color: #6b7280;
      }
    `;
    document.head.appendChild(style);
  }

  function createChatUI() {
    createStyles();

    // Floating button
    const button = document.createElement("button");
    button.className = "diad-chat-bubble-btn";
    button.setAttribute("aria-label", "Chat with us");
    button.innerHTML = "💬";

    // Chat window
    const chat = document.createElement("div");
    chat.className = "diad-chat-window";
    chat.style.display = "none";

    // Header
    const header = document.createElement("div");
    header.className = "diad-chat-header";

    const headerLeft = document.createElement("div");
    const title = document.createElement("div");
    title.className = "diad-chat-header-title";
    title.textContent = "Ask about your orders";
    const subtitle = document.createElement("div");
    subtitle.className = "diad-chat-header-subtitle";
    subtitle.textContent = "Powered by DIAD (Data in a Day)";
    headerLeft.appendChild(title);
    headerLeft.appendChild(subtitle);

    const headerRight = document.createElement("div");
    headerRight.className = "diad-chat-header-right";
    headerRight.textContent = "×";

    header.appendChild(headerLeft);
    header.appendChild(headerRight);

    // Body
    const body = document.createElement("div");
    body.className = "diad-chat-body";

    function addMessage(role, text) {
      const msg = document.createElement("div");
      msg.className = "diad-chat-message " + (role === "user" ? "user" : "bot");

      const bubble = document.createElement("div");
      bubble.className = "diad-chat-bubble";
      bubble.textContent = text;

      msg.appendChild(bubble);
      body.appendChild(msg);

      body.scrollTop = body.scrollHeight;
    }

    // Initial bot welcome
    addMessage(
      "bot",
      "Hi! I can help you track your orders.\n\n" +
        "You can ask things like:\n" +
        "• \"Where is my order 123?\"\n" +
        "• \"What is the status of my last order?\"\n" +
        "• \"How many times have I ordered?\""
    );

    // Footer
    const footer = document.createElement("div");
    footer.className = "diad-chat-footer";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.placeholder = "Your order email (required once)";
    emailInput.autocomplete = "email";

    const questionInput = document.createElement("textarea");
    questionInput.placeholder = "Type your question here…";

    const small = document.createElement("div");
    small.className = "diad-chat-small";
    small.textContent =
      "We use your email only to find your orders. We don’t show your email or phone to the chatbot.";

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    let loading = false;

    async function handleSend() {
      if (loading) return;
      const q = questionInput.value.trim();
      const email = emailInput.value.trim();

      if (!q) return;
      if (!email) {
        alert("Please enter the email you used for your orders.");
        return;
      }

      addMessage("user", q);
      questionInput.value = "";
      loading = true;
      sendButton.disabled = true;
      sendButton.textContent = "Thinking…";

      try {
        const resp = await callExternalChat(q, email);
        addMessage("bot", resp.answer || "I couldn't generate an answer.");
      } catch (err) {
        console.error(err);
        addMessage(
          "bot",
          "Sorry, I had trouble reaching the support service. Please try again in a moment."
        );
      } finally {
        loading = false;
        sendButton.disabled = false;
        sendButton.textContent = "Send";
      }
    }

    sendButton.addEventListener("click", handleSend);
    questionInput.addEventListener("keydown", function (evt) {
      if (evt.key === "Enter" && !evt.shiftKey) {
        evt.preventDefault();
        handleSend();
      }
    });

    footer.appendChild(emailInput);
    footer.appendChild(questionInput);
    footer.appendChild(sendButton);
    footer.appendChild(small);

    chat.appendChild(header);
    chat.appendChild(body);
    chat.appendChild(footer);

    document.body.appendChild(button);
    document.body.appendChild(chat);

    // Toggle logic
    button.addEventListener("click", function () {
      chat.style.display = chat.style.display === "none" ? "flex" : "none";
    });
    headerRight.addEventListener("click", function () {
      chat.style.display = "none";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createChatUI);
  } else {
    createChatUI();
  }
})();
