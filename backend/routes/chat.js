const express = require("express");
const { askGroq } = require("../services/groqService");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const aiReply = await askGroq(message);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ reply: "AI service error" });
  }
});

module.exports = router;
