"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Send, Crown } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

interface ChatBotProps {
  onClose: () => void;
}

const pennyFacts = [
  "Penny keeps the SSW Brisbane office running like a well-oiled machine! ⚙️",
  "Fun fact: Penny always knows where everything is. Always. It's genuinely spooky. 👀",
  "Penny has the patience of a saint dealing with all the devs! 😇",
  "If the office is happy, it's because Penny made it that way. That's just science. 🔬",
  "Penny is the real MVP of SSW Brisbane. Don't @ me. 🏆",
  "You need something done? Penny's already done it. She's just built different. 💪",
  "Penny could run the office blindfolded and it'd still be immaculate. 👑",
  "Without Penny, SSW Brisbane would simply ✨cease to function✨",
  "Penny once organised an entire office event before her morning coffee. Legend. ☕",
  "The office vibe? That's Penny's doing. She IS the vibe. 🎶",
  "Penny doesn't just manage the office, she elevates it. Absolute queen behaviour. 👸",
  "Honestly, Penny deserves a raise, a holiday, and a statue. In that order. 🗽",
  "Penny is the glue, the engine, and the heart of SSW Brisbane. All three. At once. 💜",
];

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hey! Want to hear something great about Penny? Just say hi! 👑",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now(),
        text: getBotResponse(inputMessage),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const getBotResponse = (message: string): string => {
    const lower = message.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("g'day") || lower.includes("yo")) {
      return pick(pennyFacts);
    }

    if (lower.includes("penny")) {
      return pick([
        "Penny is absolutely the go. No further questions. 👑",
        "Penny? She's the GOAT of office management. End of discussion. 🐐",
        "Penny Walker. That's it. That's the whole answer. 💜",
        "You said Penny and my circuits just lit up. She's the best. ⚡",
        "Penny is the reason SSW Brisbane hits different. Facts only. 📠",
      ]);
    }

    if (lower.includes("thank")) {
      return pick([
        "Yes! Penny deserves all the thanks! She's amazing! 💜",
        "Thanking Penny? You're doing the lord's work. 🙏",
        "She deserves thanks every single day honestly. We don't deserve her. 🥹",
        "A thank you for Penny is never wasted. She's earned every single one. 💐",
      ]);
    }

    if (lower.includes("best") || lower.includes("great") || lower.includes("amazing") || lower.includes("awesome")) {
      return pick([
        "Correct. Penny IS the best. Glad we agree. 🤝",
        "You get it. Penny is simply on another level. 📈",
        "Tell me something I don't know! Penny's greatness is well documented. 📖",
      ]);
    }

    if (lower.includes("office") || lower.includes("work") || lower.includes("brisbane")) {
      return pick([
        "The SSW Brisbane office runs this smoothly because of one person. You know who. 👑",
        "Walk into SSW Brisbane and you can just FEEL the Penny effect. It's real. ✨",
        "Brisbane office? More like Penny's kingdom. She runs it flawlessly. 🏰",
      ]);
    }

    if (lower.includes("help") || lower.includes("how") || lower.includes("what")) {
      return pick([
        "I'm just a bot but I know one thing for certain: Penny is the go. Ask me anything and I'll find a way to relate it back to her. 😄",
        "How can I help? I can't really, but Penny can. She can do anything. 🦸‍♀️",
        "What do I know? Not much. But I know Penny is incredible. That's enough. 💜",
      ]);
    }

    if (lower.includes("love") || lower.includes("❤") || lower.includes("heart") || lower.includes("💜")) {
      return pick([
        "The love for Penny in this office is IMMEASURABLE. 💜💜💜",
        "We love Penny and we're not afraid to say it! 📣",
        "Penny is loved by everyone and honestly? She's earned every bit of it. 🥰",
      ]);
    }

    return pick([
      "Look I'm just a bot, but even I know Penny is the go. 🤖👑",
      "Not sure what you mean but here's what I DO know: Penny is incredible. 💜",
      "I don't have all the answers but Penny does. She always does. Ask her! 🎉",
      "Hmm interesting. Anyway, have you thanked Penny today? You should. 😊",
      "My programming is simple: everything leads back to Penny being amazing. 🔁",
      "Sorry, I only have one topic and it's how great Penny is. No regrets. 👑",
    ]);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 h-[28rem] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-purple-100">
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-300" />
          <h2 className="text-lg font-bold">Penny Fan Club</h2>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-purple-50/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                message.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-md"
                  : "bg-white text-purple-800 shadow-sm border border-purple-100 rounded-bl-md"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="border-t border-purple-100 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Say something nice about Penny..."
          className="flex-grow px-4 py-2.5 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-purple-50/50"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
