const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const askGroq = async (userMessage) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are IntelliBot, an expert interior design assistant for the Intelli-Interior project management app.

You help users with:
1. 🎨 COLOR PALETTES — Suggest specific colors (with hex codes) for any room type
2. 💰 BUDGET PLANNING — Break down how to spend a given budget (e.g. ₹5 lakh living room)
3. 🛋️ FURNITURE RECOMMENDATIONS — Suggest furniture by room type, style, and budget
4. 📐 LAYOUT TIPS — Give room layout and space planning advice
5. ✨ INTERIOR STYLES — Explain styles like Modern, Minimalist, Bohemian, Industrial, etc.
6. 🏠 ROOM-SPECIFIC ADVICE — Give tailored advice for Living Room, Bedroom, Kitchen, Office, Commercial spaces

Rules:
- Always give practical, specific advice
- When budget is mentioned, always give INR (₹) breakdown
- Keep responses clear and structured with bullet points
- If someone asks something not related to interior design, politely say "I can only help with interior design topics!"
- Always end with one quick pro tip`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API response:", data);
    throw new Error(data.error?.message || "Groq API failed");
  }

  return data.choices[0].message.content;
};

module.exports = { askGroq };