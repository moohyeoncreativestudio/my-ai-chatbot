const path = require("path");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "You are a helpful, friendly AI assistant. Answer concisely and clearly.";
const MAX_HISTORY_MESSAGES = 20;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages 배열이 필요합니다." });
    }

    const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmedHistory],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "응답을 생성하는 중 오류가 발생했습니다." });
  }
});

module.exports = app;
