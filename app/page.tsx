"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { MessageCircle, Sparkles, Crown, PartyPopper, Gift, BookOpen, Gamepad2 } from "lucide-react";
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
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#9333ea", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#9333ea", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-fuchsia-600 animate-gradient py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-[10%] left-[15%] w-8 h-8 text-yellow-300/60 animate-shimmer" />
        <Sparkles className="absolute top-[20%] right-[20%] w-6 h-6 text-pink-300/50 animate-shimmer delay-300" />
        <Sparkles className="absolute bottom-[30%] left-[10%] w-5 h-5 text-purple-300/40 animate-shimmer delay-700" />
        <Sparkles className="absolute top-[60%] right-[12%] w-7 h-7 text-yellow-200/50 animate-shimmer delay-500" />
        <Crown className="absolute top-[8%] right-[35%] w-10 h-10 text-yellow-400/30 animate-float delay-200" />
        <PartyPopper className="absolute bottom-[20%] right-[25%] w-8 h-8 text-pink-300/30 animate-float delay-500" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-10 text-center animate-pulse-glow">
          <div className="mb-6">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 bg-clip-text text-transparent mb-3">
            Thank You, Penny!
          </h1>

          <p className="text-xl text-purple-600 font-medium mb-2">
            Our incredible SSW Brisbane Office Manager
          </p>
          <p className="text-purple-400 mb-8 max-w-md mx-auto">
            The heart and soul of SSW Brisbane. You make every day brighter just by being you.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full mx-auto mb-8" />

          <p className="text-lg text-purple-700 mb-8 font-medium">
            {"You're too awesome for a single page - explore all your cards!"}
          </p>

          {/* Card links */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/international-womens-day"
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold py-3 px-6 rounded-2xl hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              {"International Women's Day"}
            </Link>
            <Link
              href="/christmas-card"
              className="group inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-purple-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Gift className="w-5 h-5" />
              Christmas Card
            </Link>
            <Link
              href="/history-quiz"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-6 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              History Quiz
            </Link>
            <Link
              href="/arcade"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold py-3 px-6 rounded-2xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 hover:scale-105"
            >
              <Gamepad2 className="w-5 h-5" />
              Artifact Hunt
            </Link>
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full p-4 shadow-xl hover:bg-purple-700 hover:scale-110 transition-all duration-300 z-50 animate-pulse-glow"
      >
        <MessageCircle size={24} />
      </button>

      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
