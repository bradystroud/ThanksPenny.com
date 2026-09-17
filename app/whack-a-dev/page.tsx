"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Hammer, RotateCcw, Cake, Trophy, Timer, Gift, Crown, Send } from "lucide-react";
import type { LeaderboardEntry } from "../api/leaderboard/route";
import { HAMMER_CURSOR, Desk, Monitor, Mug, PartyHat, Bunting, Balloon, Starburst, StickyNote } from "./art";

const HOLE_COUNT = 9;
const GAME_SECONDS = 30;
const BEST_SCORE_KEY = "whack-a-dev-best";
const PLAYER_NAME_KEY = "whack-a-dev-name";
const MAX_NAME_LENGTH = 20;

type Popup = {
  kind: "dev" | "cake" | "gift";
  emoji: string;
  line: string;
  id: number;
  /** Set for devs: which Brisbane face is asking */
  dev?: Dev;
};

type Dev = { name: string; photo: string };

// Photos come from the public SSW.People.Profiles repo (public/devs/*.jpg)
const DEVS: Dev[] = [
  { name: "JK", photo: "/devs/jk.jpg" },
  { name: "Gordon", photo: "/devs/gordon.jpg" },
  { name: "Daniel", photo: "/devs/daniel.jpg" },
  { name: "Brook", photo: "/devs/brook.jpg" },
  { name: "Brady", photo: "/devs/brady.jpg" },
  { name: "Kaha", photo: "/devs/kaha.jpg" },
  { name: "Ivan", photo: "/devs/ivan.jpg" },
  { name: "Vlad", photo: "/devs/vlad.jpg" },
  { name: "Luke", photo: "/devs/luke.jpg" },
];

const REQUESTS = [
  "Where's the HDMI cable?",
  "Can you book the boardroom?",
  "Is there any coffee left?",
  "My timesheet won't save!",
  "Who ate my lunch?",
  "Can you order more snacks?",
  "The printer is jammed again",
  "What's the wifi password?",
  "Where do I park?",
  "Is the intern starting today?",
  "Can you approve my leave?",
  "Do we have a stapler?",
  "Where is the first aid kit?",
  "Is it my turn for the standup?",
];

const POINTS = { dev: 1, gift: 5, cake: -3 } as const;

function randomPopup(id: number): Popup {
  const roll = Math.random();
  if (roll < 0.12) return { kind: "cake", emoji: "🎂", line: "Don't smash the cake!", id };
  if (roll < 0.18) return { kind: "gift", emoji: "🎁", line: "A present for Penny!", id };
  return {
    kind: "dev",
    emoji: "👨‍💻",
    dev: DEVS[Math.floor(Math.random() * DEVS.length)],
    line: REQUESTS[Math.floor(Math.random() * REQUESTS.length)],
    id,
  };
}

function readBestScore(): number {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Storage unavailable (private mode etc.) - best score is a nicety only
  }
}

function readPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function writePlayerName(name: string) {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  } catch {
    // Storage unavailable - the player just types their name again next time
  }
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[] | null> {
  try {
    const res = await fetch("/api/leaderboard", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as LeaderboardEntry[];
  } catch {
    return null;
  }
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function WhackADev() {
  const [holes, setHoles] = useState<(Popup | null)[]>(() => Array(HOLE_COUNT).fill(null));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [toast, setToast] = useState<{ text: string; good: boolean } | null>(null);
  const [bonked, setBonked] = useState<number | null>(null);
  // Visual only: the hit burst outlives the 150ms bonk squash so the player can read it
  const [burst, setBurst] = useState<{ index: number; text: string; good: boolean; key: number } | null>(null);

  // Shared leaderboard (null = not loaded or unavailable)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [leaderboardLoaded, setLeaderboardLoaded] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitError, setSubmitError] = useState("Could not save. Try again?");
  const [rank, setRank] = useState<number | null>(null);
  // Issued by the server when a round starts; proves the round was played
  const roundTokenRef = useRef<Promise<string | null>>(Promise.resolve(null));

  const runningRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextIdRef = useRef(1);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const timeLeftRef = useRef(GAME_SECONDS);
  timeLeftRef.current = timeLeft;
  const holesRef = useRef(holes);
  holesRef.current = holes;

  useEffect(() => {
    setBestScore(readBestScore());
    setPlayerName(readPlayerName());
  }, []);

  const loadLeaderboard = useCallback(async () => {
    const entries = await fetchLeaderboard();
    setLeaderboard(entries);
    setLeaderboardLoaded(true);
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = playerName.trim().slice(0, MAX_NAME_LENGTH);
    if (!name || submitState === "saving") return;
    setSubmitState("saving");
    writePlayerName(name);
    try {
      const token = await roundTokenRef.current;
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score, token }),
      });
      const data = (await res.json()) as { rank?: number; error?: string };
      if (!res.ok || data.rank === undefined) {
        setSubmitError(data.error ?? "Could not save. Try again?");
        setSubmitState("error");
        return;
      }
      setRank(data.rank);
      setSubmitState("saved");
      loadLeaderboard();
    } catch {
      setSubmitError("Could not save. Try again?");
      setSubmitState("error");
    }
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const showToast = useCallback((text: string, good: boolean) => {
    setToast({ text, good });
    const t = setTimeout(() => setToast(null), 700);
    timersRef.current.push(t);
  }, []);

  const hideHole = useCallback((index: number, id: number) => {
    setHoles((prev) => (prev[index]?.id === id ? prev.map((h, i) => (i === index ? null : h)) : prev));
  }, []);

  // Spawn loop: faster and shorter pops as time runs out
  const scheduleSpawn = useCallback(() => {
    const elapsed = GAME_SECONDS - timeLeftRef.current;
    const progress = Math.min(elapsed / GAME_SECONDS, 1);
    const spawnDelay = 650 - progress * 350;
    const visibleFor = 1100 - progress * 500;

    const t = setTimeout(() => {
      if (!runningRef.current) return;
      const empty = holesRef.current.map((h, i) => (h === null ? i : -1)).filter((i) => i >= 0);
      if (empty.length > 0) {
        const index = empty[Math.floor(Math.random() * empty.length)];
        const popup = randomPopup(nextIdRef.current++);
        setHoles((prev) => prev.map((h, i) => (i === index ? popup : h)));
        const hide = setTimeout(() => hideHole(index, popup.id), visibleFor);
        timersRef.current.push(hide);
      }
      scheduleSpawn();
    }, spawnDelay);
    timersRef.current.push(t);
  }, [hideHole]);

  const endGame = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    setFinished(true);
    clearTimers();
    setHoles(Array(HOLE_COUNT).fill(null));
    const final = scoreRef.current;
    if (final > readBestScore()) {
      writeBestScore(final);
      setBestScore(final);
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#9333ea", "#c084fc", "#fbbf24", "#ec4899"],
      });
    }
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_SECONDS);
    timeLeftRef.current = GAME_SECONDS;
    setFinished(false);
    setSubmitState("idle");
    setRank(null);
    roundTokenRef.current = fetch("/api/leaderboard/start", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { token?: string } | null) => data?.token ?? null)
      .catch(() => null);
    setHoles(Array(HOLE_COUNT).fill(null));
    setRunning(true);
    runningRef.current = true;
    scheduleSpawn();
  }, [scheduleSpawn]);

  // Countdown
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(tick);
  }, [running]);

  useEffect(() => {
    if (running && timeLeft <= 0) endGame();
  }, [running, timeLeft, endGame]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (bonked === null || !toast) return;
    setBurst({ index: bonked, text: toast.text.split(" ").pop() ?? "", good: toast.good, key: Date.now() });
    const t = setTimeout(() => setBurst(null), 450);
    return () => clearTimeout(t);
    // The toast is set in the same tick as bonked; re-running on bonked alone is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bonked]);

  const urgent = running && timeLeft <= 5;

  const whack = (index: number) => {
    const popup = holes[index];
    if (!running || !popup) return;
    const delta = POINTS[popup.kind];
    setScore((s) => Math.max(0, s + delta));
    setBonked(index);
    const t = setTimeout(() => setBonked(null), 150);
    timersRef.current.push(t);
    if (popup.kind === "cake") showToast("Nooo, the cake! -3", false);
    else if (popup.kind === "gift") showToast("Present secured! +5", true);
    else showToast("Bonk! +1", true);
    setHoles((prev) => prev.map((h, i) => (i === index ? null : h)));
  };

  const verdict = () => {
    if (score >= 40) return "Office manager tier. Penny would be proud. 👑";
    if (score >= 25) return "Solid. The devs are learning. 💪";
    if (score >= 12) return "Not bad, but a few requests got through. 😅";
    return "Penny does this every day, and makes it look easy. ☕";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 animate-gradient py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes popUp {
          from { transform: translateY(105%); }
          60%  { transform: translateY(-6%); }
          to   { transform: translateY(0); }
        }
        @keyframes bonk {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.9, 0.82) rotate(-4deg); }
          100% { transform: scale(1); }
        }
        @keyframes burst {
          0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; }
          30%  { transform: scale(1.15) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) translateY(-14px); opacity: 0; }
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50%      { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-6deg); }
          50%      { transform: rotate(6deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: .2; transform: scale(.6); }
          50%      { opacity: 1; transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,.0), 0 0 22px 4px rgba(251,191,36,.55); }
          50%      { box-shadow: 0 0 0 6px rgba(251,191,36,.15), 0 0 34px 10px rgba(251,191,36,.85); }
        }
        @keyframes urgent {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.12); }
        }
        @keyframes marquee {
          0%, 100% { opacity: 1; }
          50%      { opacity: .35; }
        }
        .pop-up  { animation: popUp .22s cubic-bezier(.2,.9,.3,1.2); }
        .bonked  { animation: bonk .15s ease-out; }
        .burst   { animation: burst .45s ease-out forwards; }
        .floaty  { animation: floaty 4s ease-in-out infinite; }
        .floaty-slow { animation: floaty 5.5s ease-in-out infinite reverse; }
        .wiggle  { animation: wiggle .5s ease-in-out infinite; }
        .twinkle { animation: twinkle .9s ease-in-out infinite; }
        .glow    { animation: glow 1s ease-in-out infinite; }
        .urgent  { animation: urgent .5s ease-in-out infinite; }
        .marquee { animation: marquee 1.1s steps(1) infinite; }
        .arcade-text {
          color: #fde047;
          text-shadow: 0 2px 0 #b45309, 0 4px 0 #3b0764, 0 8px 18px rgba(0,0,0,.45);
          letter-spacing: -0.02em;
        }
        .led { text-shadow: 0 0 10px currentColor; font-variant-numeric: tabular-nums; }
        .cubicle {
          background:
            linear-gradient(180deg, #f5f3ff 0%, #ede9fe 55%, #ddd6fe 100%);
        }
        .cubicle::before {
          content: ""; position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(124,58,237,.10) 1px, transparent 1.5px);
          background-size: 10px 10px;
        }
        .rays {
          background: repeating-conic-gradient(from 0deg, rgba(253,224,71,.10) 0deg 12deg, transparent 12deg 24deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .pop-up, .bonked, .burst, .floaty, .floaty-slow, .wiggle, .twinkle, .glow, .urgent, .marquee { animation: none; }
          .burst { opacity: 1; }
        }
      `}</style>

      {/* Balloons drifting around the cabinet */}
      <Balloon color="#f472b6" className="hidden md:block floaty absolute left-[6%] top-[10%] w-16 opacity-90" />
      <Balloon color="#fbbf24" className="hidden md:block floaty-slow absolute left-[12%] bottom-[14%] w-12 opacity-80" />
      <Balloon color="#a78bfa" className="hidden md:block floaty-slow absolute right-[7%] top-[16%] w-14 opacity-90" />
      <Balloon color="#34d399" className="hidden md:block floaty absolute right-[13%] bottom-[10%] w-12 opacity-80" />

      <div className="max-w-2xl w-full mx-auto relative z-10 space-y-6">
        {/* Cabinet */}
        <div className="rounded-[2rem] bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 p-2 sm:p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6),inset_0_1px_0_rgba(255,255,255,.15)] ring-4 ring-fuchsia-400/40">
          <div className="rounded-[1.6rem] bg-gradient-to-b from-fuchsia-50 to-purple-100 p-4 sm:p-6 text-center relative overflow-hidden">
            <Bunting className="absolute -top-1 left-0 w-full h-10 sm:h-12 pointer-events-none" />

            {/* Marquee */}
            <div className="mt-8 sm:mt-9 flex items-center justify-center gap-3">
              <span aria-hidden="true" className="text-2xl sm:text-4xl wiggle inline-block">🔨</span>
              <h1 className="arcade-text text-[2rem] sm:text-5xl font-black uppercase tracking-tight whitespace-nowrap">Whack-a-Dev</h1>
              <span aria-hidden="true" className="text-2xl sm:text-4xl inline-block">🎂</span>
            </div>
            <p className="mt-2 text-purple-800 text-sm sm:text-base max-w-lg mx-auto">
              It is Penny&apos;s birthday and the devs still will not leave her alone.
              Bonk every dev that pops up. Grab the gifts. Whatever you do,{" "}
              <strong>do not smash the cake</strong>.
            </p>

            {/* Scoreboard */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
              <div className="rounded-xl bg-purple-950 ring-2 ring-purple-700/70 px-2 py-2 shadow-inner">
                <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-purple-300">
                  <Hammer className="w-3.5 h-3.5" aria-hidden="true" /> Score
                </div>
                <div className="led text-3xl sm:text-4xl font-black text-amber-300 leading-none mt-1" aria-live="polite">
                  {score}
                </div>
              </div>
              <div className={`rounded-xl bg-purple-950 ring-2 px-2 py-2 shadow-inner transition-colors ${urgent ? "ring-rose-500" : "ring-purple-700/70"}`}>
                <div className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest ${urgent ? "text-rose-300" : "text-purple-300"}`}>
                  <Timer className="w-3.5 h-3.5" aria-hidden="true" /> Time
                </div>
                <div className={`led text-3xl sm:text-4xl font-black leading-none mt-1 ${urgent ? "text-rose-400 urgent" : "text-pink-300"}`}>
                  <span className="sr-only">Seconds left: </span>
                  {timeLeft}
                  <span className="text-base font-bold">s</span>
                </div>
              </div>
              <div className="rounded-xl bg-purple-950 ring-2 ring-purple-700/70 px-2 py-2 shadow-inner">
                <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-purple-300">
                  <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> Best
                </div>
                <div className="led text-3xl sm:text-4xl font-black text-emerald-300 leading-none mt-1">{bestScore}</div>
              </div>
            </div>

            {/* Board */}
            <div
              className="relative mt-4 rounded-2xl bg-purple-950 p-2 sm:p-3 shadow-[inset_0_6px_18px_rgba(0,0,0,.5)] ring-2 ring-purple-700/60"
              style={running ? { cursor: HAMMER_CURSOR } : undefined}
            >
              <div
                className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto"
                role="group"
                aria-label="Whack-a-Dev board"
              >
                {holes.map((popup, i) => (
                  <button
                    key={i}
                    onClick={() => whack(i)}
                    disabled={!running}
                    aria-label={popup ? `${popup.dev ? popup.dev.name : popup.kind}: ${popup.line}` : "Empty desk"}
                    style={running ? { cursor: HAMMER_CURSOR } : undefined}
                    className={`cubicle relative aspect-square rounded-xl overflow-hidden shadow-[0_4px_0_#3b0764] ring-2 ring-purple-300/70 disabled:cursor-default select-none touch-manipulation active:translate-y-[2px] active:shadow-[0_2px_0_#3b0764] transition-[box-shadow,transform] duration-75${bonked === i ? " bonked" : ""}`}
                  >
                    {/* Cubicle wall trim */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[8%] bg-purple-300/60" />
                    <StickyNote className="absolute left-[10%] top-[16%] w-[16%] rotate-[-8deg] drop-shadow-sm" />
                    <Monitor className="absolute right-[5%] bottom-[29%] w-[28%] drop-shadow" />
                    {/* Pop-up layer sits under the desk in z-order, so a rising visitor is hidden behind it */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 bottom-[28%] flex items-end justify-center">
                      {popup && (
                        <span className="pop-up relative flex flex-col items-center w-full px-1">
                          {/* Speech bubble */}
                          <span
                            className={`relative mb-0.5 sm:mb-1.5 max-w-full sm:max-w-[96%] rounded-lg px-1 sm:px-1.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold leading-tight shadow-md ring-1 ${
                              popup.kind === "cake"
                                ? "bg-rose-600 text-white ring-rose-800"
                                : popup.kind === "gift"
                                  ? "bg-amber-300 text-purple-900 ring-amber-500"
                                  : "bg-white text-purple-900 ring-purple-300"
                            }`}
                          >
                            <span className={popup.dev ? "block truncate sm:whitespace-normal" : "block"}>{popup.line}</span>
                            <span
                              className={`absolute left-1/2 -bottom-1 w-2.5 h-2.5 -translate-x-1/2 rotate-45 ${
                                popup.kind === "cake" ? "bg-rose-600" : popup.kind === "gift" ? "bg-amber-300" : "bg-white"
                              }`}
                            />
                          </span>
                          {/* Character */}
                          <span className="relative">
                            {popup.kind === "cake" && (
                              <>
                                <span className="glow absolute inset-1 rounded-full bg-amber-200/60" />
                                <PartyHat className="absolute -top-3 left-1 w-5 sm:w-6 -rotate-12 drop-shadow" />
                              </>
                            )}
                            {popup.kind === "gift" && (
                              <>
                                <span className="twinkle absolute -top-2 -left-2 text-base sm:text-lg">✨</span>
                                <span className="twinkle absolute -top-1 -right-3 text-sm sm:text-base [animation-delay:.3s]">✨</span>
                                <span className="twinkle absolute bottom-0 -left-3 text-xs sm:text-sm [animation-delay:.6s]">✨</span>
                              </>
                            )}
                            {popup.dev ? (
                              <span className="relative block pb-1 sm:pb-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={popup.dev.photo}
                                  alt=""
                                  draggable={false}
                                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover object-[50%_15%] ring-[3px] ring-white shadow-lg bg-purple-200"
                                />
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-purple-900 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wide px-2 py-0.5 ring-2 ring-white shadow">
                                  {popup.dev.name}
                                </span>
                              </span>
                            ) : (
                              <span className={`relative text-[2.1rem] sm:text-5xl leading-none drop-shadow-md ${popup.kind === "gift" ? "wiggle inline-block" : ""}`}>
                                {popup.emoji}
                              </span>
                            )}
                          </span>
                        </span>
                      )}
                    </span>
                    <Desk className="absolute inset-x-0 bottom-0 w-full h-[32%] z-10" />
                    <Mug className="absolute left-[8%] bottom-[22%] w-[14%] drop-shadow z-10" />

                    {/* Hit burst */}
                    {burst && burst.index === i && (
                      <span
                        key={burst.key}
                        aria-hidden="true"
                        className="burst absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                      >
                        <Starburst className={`w-[88%] h-[88%] ${burst.good ? "" : "hue-rotate-[300deg]"}`} />
                        <span className="absolute text-2xl sm:text-3xl font-black text-purple-950 -rotate-6 drop-shadow-[0_2px_0_#fff]">
                          {burst.text}
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {toast && (
                <div
                  aria-hidden="true"
                  className={`absolute z-30 left-1/2 -translate-x-1/2 -top-4 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wide shadow-lg pointer-events-none ring-2 ring-purple-950 ${
                    toast.good ? "bg-amber-300 text-purple-950" : "bg-rose-600 text-white"
                  }`}
                >
                  {toast.text}
                </div>
              )}

              {/* Title card */}
              {!running && (
                <div className="absolute inset-0 z-30 rounded-2xl overflow-hidden flex items-center justify-center bg-purple-950/95">
                  <div aria-hidden="true" className="rays absolute inset-[-60%]" />
                  <div className="relative text-center px-4 py-6 max-w-sm">
                    {finished ? (
                      <>
                        <p className="text-sm font-black uppercase tracking-[.3em] text-pink-300">Time&apos;s up</p>
                        <p className="arcade-text text-6xl sm:text-7xl font-black leading-none mt-1">{score}</p>
                        <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mt-1">points</p>
                        {score > 0 && score >= bestScore && (
                          <p className="mt-2 inline-block rounded-full bg-emerald-400 text-purple-950 text-xs font-black uppercase tracking-wider px-3 py-1">
                            New best!
                          </p>
                        )}
                        <p className="text-purple-100 mt-3 text-sm sm:text-base" role="status">{verdict()}</p>
                        {score > 0 && submitState !== "saved" && (
                          <form onSubmit={submitScore} className="mt-4 mb-4 flex flex-col sm:flex-row items-stretch gap-2 max-w-xs mx-auto">
                            <label htmlFor="player-name" className="sr-only">Your name for the leaderboard</label>
                            <input
                              id="player-name"
                              type="text"
                              value={playerName}
                              onChange={(e) => setPlayerName(e.target.value)}
                              maxLength={MAX_NAME_LENGTH}
                              placeholder="Your name"
                              autoComplete="nickname"
                              required
                              className="flex-1 min-w-0 rounded-xl bg-white/95 text-purple-900 font-bold placeholder:text-purple-300 px-3 py-2 ring-2 ring-purple-400 focus:ring-amber-300 outline-none"
                            />
                            <button
                              type="submit"
                              disabled={submitState === "saving" || !playerName.trim()}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 text-purple-950 font-black uppercase tracking-wide px-4 py-2 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="w-4 h-4" aria-hidden="true" />
                              {submitState === "saving" ? "Saving" : "Save"}
                            </button>
                          </form>
                        )}
                        {submitState === "error" && (
                          <p className="text-rose-300 text-xs font-bold mb-3" role="alert">{submitError}</p>
                        )}
                        {submitState === "saved" && rank !== null && (
                          <p className="mt-3 mb-4 text-emerald-300 font-black text-lg" role="status">
                            You are #{rank} on the leaderboard!
                          </p>
                        )}
                        {score === 0 && <div className="mb-5" />}
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-black uppercase tracking-[.3em] text-pink-300">Birthday edition</p>
                        <p className="arcade-text text-4xl sm:text-5xl font-black uppercase leading-none mt-1">Ready?</p>
                        <ul className="mt-4 mb-5 flex justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
                          <li className="flex items-center gap-1 rounded-lg bg-white/10 text-white px-2 py-1 ring-1 ring-white/20">
                            <span aria-hidden="true">👨‍💻</span> +{POINTS.dev}
                          </li>
                          <li className="flex items-center gap-1 rounded-lg bg-amber-300/20 text-amber-200 px-2 py-1 ring-1 ring-amber-300/40">
                            <Gift className="w-4 h-4" aria-hidden="true" /> +{POINTS.gift}
                          </li>
                          <li className="flex items-center gap-1 rounded-lg bg-rose-500/20 text-rose-200 px-2 py-1 ring-1 ring-rose-400/40">
                            <Cake className="w-4 h-4" aria-hidden="true" /> {POINTS.cake}
                          </li>
                        </ul>
                        <p className="sr-only">{GAME_SECONDS} seconds. Devs +1, gifts +5, cake -3.</p>
                      </>
                    )}
                    <button
                      onClick={startGame}
                      className="inline-flex items-center gap-2 bg-gradient-to-b from-amber-300 to-amber-500 text-purple-950 text-lg font-black uppercase tracking-wide py-3 px-8 rounded-2xl shadow-[0_6px_0_#b45309,0_12px_24px_rgba(0,0,0,.4)] hover:from-amber-200 hover:to-amber-400 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all duration-150 ring-2 ring-purple-950"
                    >
                      {finished ? (
                        <>
                          <RotateCcw className="w-5 h-5" aria-hidden="true" /> Play again
                        </>
                      ) : (
                        <>
                          <Hammer className="w-5 h-5" aria-hidden="true" /> Start
                        </>
                      )}
                    </button>
                    <p aria-hidden="true" className="marquee mt-3 text-[10px] font-bold uppercase tracking-[.3em] text-purple-300">
                      {finished ? "Insert coin" : `${GAME_SECONDS} second round`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <section
              aria-labelledby="leaderboard-heading"
              className="mt-4 rounded-2xl bg-purple-950 ring-2 ring-purple-700/60 shadow-[inset_0_6px_18px_rgba(0,0,0,.5)] p-3 sm:p-4 text-left"
            >
              <h2
                id="leaderboard-heading"
                className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[.3em] text-amber-300"
              >
                <Crown className="w-4 h-4" aria-hidden="true" /> Leaderboard <Crown className="w-4 h-4" aria-hidden="true" />
              </h2>
              {!leaderboardLoaded ? (
                <p className="mt-3 text-center text-purple-300 text-sm">Loading scores…</p>
              ) : leaderboard === null ? (
                <p className="mt-3 text-center text-purple-300 text-sm">Leaderboard is having a nap. Try again later.</p>
              ) : leaderboard.length === 0 ? (
                <p className="mt-3 text-center text-purple-300 text-sm">No scores yet. Be the first!</p>
              ) : (
                <ol className="mt-3 space-y-1 max-h-80 overflow-y-auto pr-1">
                  {leaderboard.map((entry, i) => (
                    <li
                      key={`${entry.createdAt}-${i}`}
                      className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 py-1.5 ${
                        i === 0 ? "bg-amber-300/15 ring-1 ring-amber-300/40" : "bg-white/5"
                      }`}
                    >
                      <span className="w-7 text-center text-lg" aria-hidden="true">{MEDALS[i] ?? <span className="text-xs font-bold text-purple-300">{i + 1}</span>}</span>
                      <span className="sr-only">Rank {i + 1}: </span>
                      <span className="flex-1 truncate font-bold text-white">{entry.name}</span>
                      <span className={`led font-black text-lg ${i === 0 ? "text-amber-300" : "text-pink-300"}`}>{entry.score}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/birthday"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-900 font-bold py-3 px-6 rounded-2xl hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:scale-105"
          >
            <Cake className="w-5 h-5" aria-hidden="true" /> Birthday Card
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/95 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaHome aria-hidden="true" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
