"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { MessageCircle } from "lucide-react";
import { ChatBot } from "./components/ChatBot";
import Link from "next/link";

export default function ThankYouCard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-purple-500 to-purple-300 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-4">
          Thank You, Penny Walker!
        </h1>
        <p className="text-xl text-purple-600 mb-8">
          Our amazing SSW Brisbane Office Manager
        </p>

        <p>
          Penny - you are too awesome for a single page. Check out all your
          cards here.{" "}
        </p>

        {/* New Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <Link
            href="/international-womens-day"
            className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            International Womens Day
          </Link>
          <Link href="/christmas-card">
            <button className="bg-purple-300 text-purple-800 font-semibold py-2 px-4 rounded-lg hover:bg-purple-400 transition-colors duration-200">
              Old Christmas Card
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 transition-colors duration-200"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Interface */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
