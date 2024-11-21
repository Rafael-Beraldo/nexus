import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style.css";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "ft:gpt-4o-mini-2024-07-18:personal:nexus2:ATc4FsGB",
          messages: [
            { role: "system", content: "Você é um assistente útil." },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-xZBm-ZWFn3hc1ibrQaspqB67PyJlsgyOUqN9c8ztnHT3BlbkFJjGGwrf2eqRSaeUwuoKYN1EnN9LJu1IPGHDWbLKkUAA`,
          },
        }
      );

      const assistantMessage = {
        sender: "assistant",
        text: response.data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Desculpe, algo deu errado." },
      ]);
    }

    setInput("");
  };

  return (
    <div className={`chat-widget ${isOpen ? "open" : ""}`}>
      <div className="chat-header">
        <div className="chat-header-title" onClick={() => setIsOpen(!isOpen)}>
          <ChatIcon />
        </div>
        {isOpen && (
          <div className="chat-header-close" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </div>
        )}
      </div>
      {isOpen && (
        <div className="chat-body">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "user" ? "user" : "assistant"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
