"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: getBotResponse(inputMessage),
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 500);
  };

  const getBotResponse = (message: string): string => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else {
      return "Ask Penny 👑 - she has all the answers. I'm just a silly bot 🤖";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat with Us</h2>
        <button onClick={onClose} className="text-white hover:text-purple-200">
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
