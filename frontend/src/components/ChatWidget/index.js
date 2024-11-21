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

    console.log(process.env.REACT_APP_OPENAI_API_KEY);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "ft:gpt-4o-mini-2024-07-18:personal:nexus2:ATc4FsGB",
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente especializado da Nexus Store. Responda apenas com informações relacionadas à loja, como produtos, devoluções, formas de pagamento e rastreamento de pedidos. Caso a pergunta esteja fora do escopo, diga: 'Desculpe, só consigo ajudar com assuntos relacionados à Nexus Store.'",
            },

            { role: "user", content: input },
          ],
          max_tokens: 150,
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
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
