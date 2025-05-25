const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");

let ai;
const MODEL_NAME = "gemini-2.0-flash";

// Dynamically import GoogleGenAI once
(async () => {
  const { GoogleGenerativeAI } = await import('@google/genai');
  ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
})();

// 📩 Chat endpoint (user sends a message)
router.post("/chat", async (req, res) => {
  const { email, message } = req.body;

  try {
    await Chat.create({ email, sender: "user", message });

    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    console.time("AI Response Time");

    const result = await model.generateContent(`User says: "${message}"`);
    const response = await result.response;
    const reply = response.text();

    console.timeEnd("AI Response Time");

    await Chat.create({ email, sender: "ai", message: reply });

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "AI not responding." });
  }
});

// 📜 Fetch chat history
router.get("/chat/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const chats = await Chat.find({ email }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Could not fetch chat history" });
  }
});

// 💸 AI Insight on income/expense entry
router.post("/transaction", async (req, res) => {
  const { type, amount, description } = req.body;

  const prompt = `The user just added a ${type} of ₹${amount} for "${description}". Give a short financial tip or suggestion.`;

  try {
    const model = ai.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    res.json({ suggestion });
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ suggestion: "Could not get a suggestion." });
  }
});

module.exports = router;
