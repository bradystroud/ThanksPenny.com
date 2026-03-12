"use client";

import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Sparkles, Heart, Star, Award, BookOpen, Gamepad2 } from "lucide-react";

// How many photos to fill the screen before the big explosion
const FILL_COUNT = 499;

interface PennyPhoto {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  exploding: boolean;
  gone: boolean;
}

const messages: Array<{ name: string; message: ReactNode; emoji: ReactNode }> = [
  {
    name: "Brady Stroud",
    message:
      "Penny, you're the only woman at SSW Brisbane, I don't know how you put up with us all! 🧁",
    emoji: "🧁",
  },
  {
    name: "Jack Pettit",
    message:
      "Penny, the office wouldn't be the same without you. Thanks for everything you do. Happy International Women's Day! 🌸",
    emoji: "😎",
  },
  {
    name: "Daniel Mackay",
    message:
      "Penny, my travel booking superstar! Thanks so much for booking my flights and accomodation for all the travel I do. I've stayed at the Meriton 50 times now, so that's 50 bookings for that one hotel alone!",
    emoji: "✈️"
  },
  {
    name: "Ivan Gaiduk",
    message: "Penny, you are awesome, you keep the vibes high and the office running smoothly. Thanks for being there for us! 🎉",
    emoji: "🌟",
  },
  {
    name: "Vlad Kireyev",
    message:
      "Penny, you are the pillar holding our circus together! Thank you for being the best manager EVER!",
    emoji: "🎉"
  },
  {
    name: "Kaha Mason",
    message:
      "Penny, you are the heart and soul of the Brisbane office. You keep everything running smoothly and make sure each and everyone of us feels supported and valuded. We are so lucky to have you as our manager. Thanks for putting up with us rugrats. Happy International Women's Day",
    emoji: "💖"
  },
  {
    name: "JK",
    message: (
      <div className="flex flex-col space-y-4">
        <p>
          Penny, happy International Women’s Day. You make a bigger difference than you probably realise. The care you bring, the way you stay across the details, and the calm way you help people makes everything work better. You have that rare mix of capability and kindness and it doesn’t go unnoticed. Thank you for all that you do, you make the place feel more human and change chaos into order.
        </p>
        <div className="w-full flex justify-center py-6">
          <svg className="w-64 h-64 drop-shadow-2xl" viewBox="0 0 100 100">
            <style>{`
              .float-1 { animation: float 4s ease-in-out infinite; }
              .float-2 { animation: float 4s ease-in-out infinite; animation-delay: 1.5s; }
              .float-3 { animation: float 4s ease-in-out infinite; animation-delay: 3s; }
              .pulse-glow { animation: pulseGlow 2s infinite alternate; }
              .spin-slow { animation: spin 20s linear infinite; transform-origin: 50px 50px; }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
              }
              @keyframes pulseGlow {
                0% { filter: drop-shadow(0 0 2px rgba(236, 72, 153, 0.4)); transform: scale(0.98); }
                100% { filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.8)); transform: scale(1.02); }
              }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>

            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
            </defs>

            {/* Radiant background lines (Chaos to Order) */}
            <g className="spin-slow" opacity="0.4" stroke="url(#goldGrad)" strokeWidth="0.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos(i * Math.PI / 12)} y2={50 + 45 * Math.sin(i * Math.PI / 12)} />
              ))}
            </g>

            {/* Hero Shield - Base of structure */}
            <path d="M 50 15 L 80 25 L 80 50 C 80 75 50 90 50 90 C 50 90 20 75 20 50 L 20 25 Z" fill="url(#shieldGrad)" stroke="url(#goldGrad)" strokeWidth="2" className="float-1" />

            {/* Crossed Tools: Archeologist Trowel */}
            <g transform="translate(50, 50) rotate(45) translate(-50, -50)" className="float-2">
              <rect x="47" y="20" width="6" height="15" fill="#78350f" rx="1" />
              <line x1="50" y1="35" x2="50" y2="45" stroke="#94a3b8" strokeWidth="2" />
              <path d="M50,80 L35,45 L65,45 Z" fill="#94a3b8" />
              <path d="M50,80 L43,45 L50,45 Z" fill="#cbd5e1" />
            </g>

            {/* Crossed Tools: Pen/Quill (Organization) */}
            <g transform="translate(50, 50) rotate(-45) translate(-50, -50)" className="float-2">
              <path d="M 45 80 Q 30 50 50 20 Q 70 50 55 80 L 50 90 Z" fill="#334155" />
              <path d="M 50 20 L 50 85" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M 45 80 L 55 80 L 50 90 Z" fill="#fbbf24" />
              <line x1="50" y1="40" x2="60" y2="30" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="63" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="50" y1="60" x2="60" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="50" y1="40" x2="40" y2="30" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="50" y1="55" x2="38" y2="43" stroke="#cbd5e1" strokeWidth="0.5" />
            </g>

            {/* Heart of Kindness */}
            <g className="pulse-glow" transform="translate(0, 5)">
              <path d="M50,35 C50,35 40,20 25,30 C10,40 50,75 50,75 C50,75 90,40 75,30 C60,20 50,35 50,35 Z" fill="url(#heartGrad)" opacity="0.9" stroke="#fff" strokeWidth="1.5" />
            </g>

            {/* The Crown (Legend) */}
            <g className="float-3" transform="translate(0, -5)">
              <path d="M 30 25 L 40 35 L 50 15 L 60 35 L 70 25 L 65 42 L 35 42 Z" fill="url(#goldGrad)" stroke="#b45309" strokeWidth="0.5" />
              <circle cx="30" cy="25" r="2" fill="#fff" />
              <circle cx="50" cy="15" r="3" fill="#fff" />
              <circle cx="70" cy="25" r="2" fill="#fff" />
            </g>

            {/* Sparkles */}
            <g fill="url(#goldGrad)" className="float-1">
              <path d="M 15 40 Q 20 40 20 35 Q 20 40 25 40 Q 20 40 20 45 Q 20 40 15 40" />
              <path d="M 80 50 Q 83 50 83 47 Q 83 50 86 50 Q 83 50 83 53 Q 83 50 80 50" />
              <path d="M 25 70 Q 27 70 27 68 Q 27 70 29 70 Q 27 70 27 72 Q 27 70 25 70" />
            </g>
          </svg>
        </div>
      </div>
    ),
    emoji: "🦸‍♀️",
  }
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

function fireConfettiAt(x: number, y: number) {
  const colors = ["#ec4899", "#f472b6", "#a855f7", "#c084fc", "#fbbf24", "#ff0099", "#fff"];
  confetti({
    particleCount: 80,
    spread: 160,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors,
    startVelocity: 55,
    ticks: 250,
  });
}

function fireMassiveExplosion() {
  const colors = ["#ec4899", "#f472b6", "#a855f7", "#c084fc", "#fbbf24", "#ff0099", "#fff"];
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 220,
        spread: 180,
        origin: { x: Math.random(), y: Math.random() },
        colors,
        startVelocity: 70,
        ticks: 350,
        shapes: ["circle", "square"],
      });
    }, i * 100);
  }
}

export default function InternationalWomensDay() {
  const [photos, setPhotos] = useState<PennyPhoto[]>([]);
  const invasionStartedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photoCountRef = useRef(0);

  // Explode a single photo by id (click handler)
  const explodePhoto = useCallback((id: number, x: number, y: number) => {
    fireConfettiAt(x, y);
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, exploding: true } : p))
    );
    setTimeout(() => {
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, gone: true } : p)));
    }, 400);
  }, []);

  // Explode ALL photos and then wipe them
  const explodeAll = useCallback(() => {
    fireMassiveExplosion();
    setPhotos((prev) => prev.map((p) => ({ ...p, exploding: true })));
    setTimeout(() => {
      setPhotos([]);
      photoCountRef.current = 0;
      invasionStartedRef.current = false;
    }, 700);
  }, []);

  const startInvasion = useCallback(() => {
    if (invasionStartedRef.current) return;
    invasionStartedRef.current = true;

    // Ramp: start at 400ms, accelerate down to 16ms (~60fps) by the end
    const scheduleNext = () => {
      const count = photoCountRef.current;
      if (count >= FILL_COUNT) {
        setTimeout(explodeAll, 400);
        return;
      }
      const progress = count / FILL_COUNT; // 0 → 1
      const delay = Math.round((150 * Math.pow(1 - progress, 2) + 8) / (3 * (1 + 0.5 * progress)));

      intervalRef.current = setTimeout(() => {
        photoCountRef.current += 1;
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: 2 + Math.random() * 88,
            y: 2 + Math.random() * 88,
            rotation: Math.random() * 40 - 20,
            size: 60 + Math.floor(Math.random() * 80),
            exploding: false,
            gone: false,
          },
        ]);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }, [explodeAll]);

  useEffect(() => {
    // Initial IWD confetti burst
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

    return () => {
      clearInterval(interval);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [startInvasion]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-fuchsia-900 via-pink-700 to-purple-800 animate-gradient py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes pennyFadeIn {
          from { opacity: 0; transform: scale(0.1) rotate(var(--r)); }
          to   { opacity: 1; transform: scale(1)   rotate(var(--r)); }
        }
        @keyframes pennyExplode {
          0%   { opacity: 1; transform: scale(1)   rotate(var(--r)); }
          30%  { opacity: 1; transform: scale(1.8) rotate(calc(var(--r) + 15deg)); }
          100% { opacity: 0; transform: scale(0.1) rotate(calc(var(--r) - 20deg)); }
        }
        .penny-photo {
          animation: pennyFadeIn 0.45s ease-out forwards;
        }
        .penny-explode {
          animation: pennyExplode 0.45s ease-in forwards !important;
        }
      `}</style>

      {/* Fixed penny invasion overlay */}
      <div className="fixed inset-0" style={{ zIndex: 40, pointerEvents: "none" }}>
        {photos.map((photo) =>
          photo.gone ? null : (
            <button
              key={photo.id}
              onClick={(e) => {
                e.stopPropagation();
                explodePhoto(photo.id, e.clientX, e.clientY);
              }}
              className={`absolute p-0 border-0 bg-transparent cursor-pointer penny-photo${photo.exploding ? " penny-explode" : ""}`}
              style={{
                left: `${photo.x}%`,
                top: `${photo.y}%`,
                pointerEvents: "auto",
                // CSS variable used in keyframes for rotation
                ["--r" as string]: `${photo.rotation}deg`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/penny.png"
                alt="Penny"
                style={{
                  width: photo.size,
                  height: photo.size,
                  objectFit: "contain",
                  filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.5))",
                  display: "block",
                }}
              />
            </button>
          )
        )}
      </div>

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

          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight whitespace-nowrap">
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
            #IWD2026
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
              onMouseEnter={i === 1 ? startInvasion : undefined}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default"
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
