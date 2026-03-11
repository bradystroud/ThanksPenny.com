"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Sparkles, Heart, Star, Award, BookOpen, Gamepad2 } from "lucide-react";

const messages = [
  {
    name: "Brady Stroud",
    message:
      "Penny, you're the only woman at SSW Brisbane, I don't know how you put up with us all! 🧁",
    emoji: "🧁",
  },
  // DEVELOPERS: Add your message here! Copy this format:
  // {
  //   name: "Your Name",
  //   message: "Your message to Penny",
  //   emoji: "🌟",
  // },
];

const qualities = [
  { icon: Heart, label: "Compassionate", color: "text-pink-500" },
  { icon: Star, label: "Inspiring", color: "text-yellow-500" },
  { icon: Award, label: "Dedicated", color: "text-purple-500" },
  { icon: Sparkles, label: "Extraordinary", color: "text-fuchsia-500" },
];

export default function InternationalWomensDay() {
  useEffect(() => {
    // IWD-themed confetti burst
    const colors = ["#ec4899", "#f472b6", "#a855f7", "#c084fc", "#fbbf24"];
    const end = Date.now() + 5000;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        ...defaults,
        particleCount: 30,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors,
        shapes: ["circle", "square"],
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-fuchsia-900 via-pink-700 to-purple-800 animate-gradient py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-[8%] left-[12%] w-10 h-10 text-pink-400/20 animate-float" />
        <Heart className="absolute top-[15%] right-[18%] w-6 h-6 text-pink-300/25 animate-float delay-300" />
        <Sparkles className="absolute bottom-[25%] left-[8%] w-8 h-8 text-yellow-300/20 animate-shimmer delay-500" />
        <Heart className="absolute bottom-[35%] right-[10%] w-12 h-12 text-fuchsia-400/15 animate-float delay-700" />
        <Sparkles className="absolute top-[50%] left-[25%] w-5 h-5 text-pink-200/30 animate-shimmer delay-200" />
        <Star className="absolute top-[5%] left-[45%] w-8 h-8 text-yellow-400/20 animate-shimmer delay-100" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        {/* Hero section */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="mb-4 flex justify-center gap-2">
            <span className="text-4xl">💜</span>
            <span className="text-4xl">👑</span>
            <span className="text-4xl">💜</span>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-3">
            International Women&apos;s Day 2026
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            Celebrating Penny Walker
          </h1>

          <p className="text-lg text-pink-700 mb-6 max-w-xl mx-auto leading-relaxed">
            A woman who leads with grace, keeps the Brisbane office running like
            clockwork, and somehow always has time for everyone. Penny, you are a
            force of nature and we are so grateful for you.
          </p>

          {/* Qualities */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {qualities.map((q) => (
              <div
                key={q.label}
                className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 rounded-full px-4 py-2 text-sm font-semibold text-pink-700"
              >
                <q.icon className={`w-4 h-4 ${q.color}`} />
                {q.label}
              </div>
            ))}
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 rounded-full mx-auto" />
        </div>

        {/* IWD Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <p className="text-white/90 text-sm font-bold uppercase tracking-widest mb-2">
            March 8, 2026
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            #InspireInclusion
          </h2>
          <p className="text-white/90 max-w-lg mx-auto leading-relaxed">
            This International Women&apos;s Day, we celebrate the women who make our
            workplaces better every single day. Penny, you inspire us all.
          </p>
        </div>

        {/* Messages section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
            Messages for Penny
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
          </h2>

          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
                  {msg.emoji}
                </div>
                <div className="text-left">
                  <p className="font-bold text-purple-800 text-lg">
                    {msg.name}
                  </p>
                  <p className="text-pink-700 mt-1 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Call to action for more messages */}
          <div className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/40 rounded-2xl p-6 text-center">
            <p className="text-white font-bold text-lg mb-1">
              Want to add your message?
            </p>
            <p className="text-white/80 text-sm">
              Open a PR on{" "}
              <a
                href="https://github.com/bradystroud/ThanksPenny.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-yellow-300 hover:text-yellow-200 transition-colors"
              >
                GitHub
              </a>{" "}
              and add your message to the list!
            </p>
          </div>
        </div>

        {/* Games section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <h2 className="text-xl font-bold text-purple-800 mb-2">
            Take a break and play!
          </h2>
          <p className="text-pink-600 text-sm mb-4">
            Games made just for our favourite history lover
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/history-quiz"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-5 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              History Quiz
            </Link>
            <Link
              href="/arcade"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold py-3 px-5 rounded-2xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:scale-105"
            >
              <Gamepad2 className="w-5 h-5" />
              Artifact Hunt
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/95 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaHome /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
