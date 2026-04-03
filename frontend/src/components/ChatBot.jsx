import { useState, useRef, useEffect } from "react";
import "../styles/chatbot.css";

const SUGGESTIONS = [
  "Suggest colors for my bedroom 🎨",
  "Budget plan for ₹3 lakh living room 💰",
  "Modern kitchen design ideas 🍳",
  "Best furniture for small office 🪑",
  "Minimalist bedroom tips ✨",
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! I'm IntelliBot, your interior design assistant!\n\nI can help you with:\n🎨 Color palettes\n💰 Budget planning\n🛋️ Furniture suggestions\n📐 Room layouts\n✨ Interior styles\n\nWhat would you like help with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Sorry, something went wrong. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* CHAT BUTTON */}
      <button className="chat-btn" onClick={() => setOpen(!open)}>
        {open ? "✖" : "💬"}
      </button>

      {open && (
        <div className="chat-box">
          {/* HEADER */}
          <div className="chat-header">
            <span>🏠 IntelliBot</span>
            <small>Interior Design Assistant</small>
          </div>

          {/* MESSAGES */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.type}`}>
                {m.type === "bot" && <span className="bot-icon">🤖</span>}
                <div className="message-text">{m.text}</div>
              </div>
            ))}

            {/* LOADING DOTS */}
            {loading && (
              <div className="message bot">
                <span className="bot-icon">🤖</span>
                <div className="message-text typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTIONS */}
          {messages.length <= 1 && (
            <div className="suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} className="suggestion-btn">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about interior design..."
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;