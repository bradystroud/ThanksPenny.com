"use client";

import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Cake, Gift, PartyPopper, Sparkles, Star, Heart, Wind, Hammer } from "lucide-react";

const CANDLE_COUNT = 7;

const BIRTHDAY_COLORS = ["#9333ea", "#c084fc", "#ec4899", "#f472b6", "#fbbf24", "#fde047", "#fff"];
// Candle stripes: no white, since the stripes alternate with white
const CANDLE_COLORS = ["#9333ea", "#c084fc", "#ec4899", "#f472b6", "#fbbf24", "#f59e0b", "#6366f1"];

const messages = [
  {
    name: "Brady Stroud",
    message:
      "Happy birthday, Penny. Sorry I missed karaoke last night, looked fun as! 🎤",
    emoji: "🎉",
  },
  // DEVELOPERS: Add your birthday message here! Copy this format:
  // {
  //   name: "Your Name",
  //   message: "Happy birthday Penny!",
  //   emoji: "🎈",
  // },
];

const balloons = [
  { left: "6%", delay: "0s", duration: "14s", color: "#ec4899" },
  { left: "18%", delay: "3s", duration: "17s", color: "#a855f7" },
  { left: "31%", delay: "6s", duration: "13s", color: "#fbbf24" },
  { left: "47%", delay: "1.5s", duration: "18s", color: "#f472b6" },
  { left: "62%", delay: "4.5s", duration: "15s", color: "#c084fc" },
  { left: "76%", delay: "8s", duration: "16s", color: "#fde047" },
  { left: "90%", delay: "2.5s", duration: "14s", color: "#ec4899" },
];

function fireCandleConfetti(index: number) {
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x: 0.3 + (index / (CANDLE_COUNT - 1)) * 0.4, y: 0.45 },
    colors: BIRTHDAY_COLORS,
    startVelocity: 35,
    ticks: 200,
  });
}

function fireBirthdayFinale() {
  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
        colors: BIRTHDAY_COLORS,
        startVelocity: 65,
        ticks: 350,
        shapes: ["circle", "square", "star"],
      });
    }, i * 120);
  }
}

export default function BirthdayCard() {
  const [litCandles, setLitCandles] = useState<boolean[]>(() =>
    Array.from({ length: CANDLE_COUNT }, () => true)
  );
  const [wishMade, setWishMade] = useState(false);

  const litCount = litCandles.filter(Boolean).length;

  const blowOutCandle = useCallback((index: number) => {
    setLitCandles((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
    fireCandleConfetti(index);
  }, []);

  const blowOutAll = useCallback(() => {
    litCandles.forEach((lit, i) => {
      if (lit) setTimeout(() => blowOutCandle(i), i * 90);
    });
  }, [litCandles, blowOutCandle]);

  const relight = useCallback(() => {
    setLitCandles(Array.from({ length: CANDLE_COUNT }, () => true));
    setWishMade(false);
  }, []);

  // Finale once every candle is out
  useEffect(() => {
    if (litCount === 0 && !wishMade) {
      setWishMade(true);
      fireBirthdayFinale();
    }
  }, [litCount, wishMade]);

  // Welcome confetti
  useEffect(() => {
    const end = Date.now() + 4000;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 35,
        spread: 360,
        startVelocity: 25,
        ticks: 60,
        zIndex: 0,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: BIRTHDAY_COLORS,
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-700 to-pink-600 animate-gradient py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes balloonRise {
          0%   { transform: translateY(110vh) rotate(-3deg); }
          50%  { transform: translateY(50vh) rotate(3deg); }
          100% { transform: translateY(-20vh) rotate(-3deg); }
        }
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1) translateX(-50%); opacity: 1; }
          25%      { transform: scaleY(1.15) scaleX(0.9) translateX(-50%); opacity: 0.9; }
          50%      { transform: scaleY(0.9) scaleX(1.1) translateX(-50%); opacity: 1; }
          75%      { transform: scaleY(1.1) scaleX(0.95) translateX(-50%); opacity: 0.95; }
        }
        @keyframes smokeRise {
          0%   { opacity: 0.8; transform: translate(-50%, 0) scale(0.6); }
          100% { opacity: 0;   transform: translate(-50%, -40px) scale(1.6); }
        }
        .balloon { animation: balloonRise linear infinite; }
        .flame { animation: flameFlicker 0.4s ease-in-out infinite; transform-origin: bottom center; }
        .smoke { animation: smokeRise 1.4s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .balloon { animation: none; transform: translateY(20vh); }
          .flame { animation: none; }
        }
      `}</style>

      {/* Rising balloons */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {balloons.map((b, i) => (
          <div
            key={i}
            className="balloon absolute bottom-0"
            style={{ left: b.left, animationDelay: b.delay, animationDuration: b.duration }}
          >
            <div
              className="w-10 h-12 rounded-full opacity-70 shadow-lg"
              style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${b.color})` }}
            />
            <div className="w-px h-16 bg-white/40 mx-auto" />
          </div>
        ))}
        <Sparkles className="absolute top-[10%] left-[15%] w-8 h-8 text-yellow-300/50 animate-shimmer" />
        <Star className="absolute top-[18%] right-[18%] w-6 h-6 text-yellow-200/50 animate-shimmer delay-300" />
        <Gift className="absolute bottom-[22%] left-[8%] w-9 h-9 text-pink-200/30 animate-float delay-500" />
        <PartyPopper className="absolute top-[55%] right-[10%] w-8 h-8 text-yellow-300/30 animate-float delay-700" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        {/* Hero */}
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
          <div className="mb-4 flex justify-center gap-2" aria-hidden="true">
            <span className="text-4xl">🎈</span>
            <span className="text-4xl">🎂</span>
            <span className="text-4xl">🎈</span>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-3">
            September 17, 2026
          </p>

          <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
            Happy Birthday, Penny!
          </h1>

          <p className="text-lg text-purple-700 mb-2 max-w-xl mx-auto leading-relaxed">
            Another year of keeping SSW Brisbane running like clockwork. Today is
            all about you, so put the coffee orders down and enjoy some cake.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-full mx-auto mt-6" aria-hidden="true" />
        </div>

        {/* Cake */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-purple-800 mb-1 flex items-center justify-center gap-2">
            <Cake className="w-6 h-6 text-pink-500" aria-hidden="true" />
            Make a wish
          </h2>
          <p className="text-pink-600 text-sm mb-6" aria-live="polite">
            {wishMade
              ? "All the candles are out. Wish granted! 🎉"
              : `Tap the candles to blow them out. ${litCount} still burning.`}
          </p>

          {/* Candles */}
          <div className="flex justify-center items-end gap-3 sm:gap-5 mb-0" role="group" aria-label="Birthday candles">
            {litCandles.map((lit, i) => (
              <button
                key={i}
                onClick={() => blowOutCandle(i)}
                disabled={!lit}
                aria-label={lit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
                className="relative w-5 sm:w-6 h-16 pt-6 rounded-full disabled:cursor-default cursor-pointer group"
              >
                {/* Flame or smoke */}
                {lit ? (
                  <span
                    aria-hidden="true"
                    className="flame absolute -top-1 left-1/2 w-3 h-5 rounded-full bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-100 shadow-[0_0_12px_4px_rgba(251,191,36,0.6)] group-hover:scale-110"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="smoke absolute top-0 left-1/2 w-3 h-3 rounded-full bg-gray-300"
                  />
                )}
                {/* Candle body */}
                <span
                  aria-hidden="true"
                  className="block w-full h-10 rounded-sm mx-auto"
                  style={{
                    background: `repeating-linear-gradient(135deg, ${CANDLE_COLORS[i % CANDLE_COLORS.length]} 0 6px, #fff 6px 10px)`,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Cake body */}
          <div aria-hidden="true" className="mx-auto max-w-sm">
            <div className="h-6 bg-pink-300 rounded-t-3xl mx-6 shadow-inner" />
            <div className="h-10 bg-gradient-to-b from-purple-300 to-purple-400 mx-6" />
            <div className="h-5 bg-pink-200 mx-2 rounded-t-2xl" />
            <div className="h-12 bg-gradient-to-b from-fuchsia-400 to-purple-600 mx-2 rounded-b-xl shadow-lg" />
            <div className="h-3 bg-purple-900/20 rounded-full mx-0 mt-1 blur-sm" />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            {litCount > 0 ? (
              <button
                onClick={blowOutAll}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold py-3 px-6 rounded-2xl hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-300 shadow-lg hover:scale-105"
              >
                <Wind className="w-5 h-5" aria-hidden="true" />
                Blow them all out
              </button>
            ) : (
              <button
                onClick={relight}
                className="inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-purple-200 transition-all duration-300 shadow-md hover:scale-105"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Light them again
              </button>
            )}
          </div>
        </div>

        {/* Game */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
          <h2 className="text-2xl font-extrabold text-purple-900 mb-2">
            Give Penny the day off
          </h2>
          <p className="text-purple-900/80 max-w-lg mx-auto mb-4">
            The devs will not stop asking for things. Bonk them before they reach her.
            Whack-a-Mole rules, office edition.
          </p>
          <Link
            href="/whack-a-dev"
            className="inline-flex items-center justify-center gap-2 bg-purple-800 text-white font-bold py-3 px-6 rounded-2xl hover:bg-purple-900 transition-all duration-300 shadow-lg hover:scale-105"
          >
            <Hammer className="w-5 h-5" aria-hidden="true" />
            Play Whack-a-Dev
          </Link>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300" aria-hidden="true" />
            Birthday wishes for Penny
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300" aria-hidden="true" />
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
                  <p className="font-bold text-purple-800 text-lg">{msg.name}</p>
                  <p className="text-pink-700 mt-1 leading-relaxed">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/40 rounded-2xl p-6 text-center">
            <p className="text-white font-bold text-lg mb-1">
              Want to add your birthday wish?
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

        {/* Navigation */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/95 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaHome aria-hidden="true" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
