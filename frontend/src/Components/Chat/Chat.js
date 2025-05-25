import React, { useState, useEffect, useRef } from "react";
import { InnerLayout, MainLayout } from "../../Styles/Layouts";
import "./Chat.css";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is VaultAI?",
    "How to save money work?",
    "give me some money tips.",
    "What is the best way to invest?",
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (!email) return;

    async function fetchHistory() {
      try {
        const res = await fetch(`https://expense-buddy-9aqs.onrender.com/api/chat/${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    }

    fetchHistory();
  }, [email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageToSend) => {
    if (!messageToSend.trim() || !email) return;

    setMessages((prev) => [...prev, { sender: "user", message: messageToSend }]);
    setInput("");
    setLoading(true);
    setTypingMessage("");

    try {
      const res = await fetch("https://expense-buddy-9aqs.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: messageToSend }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < data.reply.length) {
          setTypingMessage((prev) => prev + data.reply[index]);
          index++;
        } else {
          clearInterval(typingInterval);
          setMessages((prev) => [...prev, { sender: "ai", message: data.reply }]);
          setTypingMessage("");
          setLoading(false);
        }
      }, 3);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", message: "Sorry, something went wrong." }]);
      setLoading(false);
      setTypingMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // For suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <MainLayout>
      <InnerLayout>
        <div className="chatContainer">
          <div className="chatWindow" ref={chatWindowRef}>
            {messages.length === 0 ? (
              <>
                <p className="noMessages">Start chatting with AI...</p>
                <div className="suggestionsContainer">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="suggestionBubble"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`messageRow ${msg.sender === "user" ? "user" : "ai"}`}
                  >
                    <div className={`messageBubble ${msg.sender === "user" ? "userBubble" : "aiBubble"}`}>
                      {msg.sender === "ai" ? (
                        <div className="aiMarkdown">
                          <ReactMarkdown>{msg.message}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                  </div>
                ))}

                {loading && !typingMessage && (
                  <div className="messageRow ai">
                    <div className="messageBubble aiBubble">
                      <div className="typing-indicator">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                    </div>
                  </div>
                )}

                {typingMessage && (
                  <div className="messageRow ai">
                    <div className="messageBubble aiBubble">
                      <ReactMarkdown>{typingMessage}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="inputArea">
            <textarea
              rows={3}
              className="textarea"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => handleSend(input)} className="sendButton">
              Send
            </button>
          </div>
        </div>
      </InnerLayout>
    </MainLayout>
  );
};

export default Chat;
