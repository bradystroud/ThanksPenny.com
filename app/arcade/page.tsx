"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Sparkles, RotateCcw, Gamepad2 } from "lucide-react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const ARTIFACTS = ["📜", "🏛️", "⚱️", "🗿", "👑", "🏺", "🗡️", "🛡️", "📿", "🔱"];

function getRandomArtifact() {
  return ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
}

function getRandomPosition(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function ArcadeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [foodEmoji, setFoodEmoji] = useState("📜");
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const gameRunningRef = useRef(gameRunning);
  gameRunningRef.current = gameRunning;

  const snakeRef = useRef(snake);
  snakeRef.current = snake;

  const foodRef = useRef(food);
  foodRef.current = food;

  const scoreRef = useRef(score);
  scoreRef.current = score;

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#9333ea", "#c084fc", "#fbbf24"],
    });
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(getRandomPosition(initial));
    setFoodEmoji(getRandomArtifact());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setCollected([]);
    setGameRunning(true);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const dir = directionRef.current;

        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setGameRunning(false);
          setHighScore((hs) => Math.max(hs, scoreRef.current));
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setGameRunning(false);
          setHighScore((hs) => Math.max(hs, scoreRef.current));
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          setScore((s) => s + 1);
          setCollected((c) => [...c.slice(-9), foodEmoji]);
          setFood(getRandomPosition(newSnake));
          setFoodEmoji(getRandomArtifact());
          fireConfetti();
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [gameRunning, gameOver, foodEmoji, fireConfetti]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
        e.preventDefault();
      }

      const dir = directionRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && dir !== "DOWN") setDirection("UP");
      if ((e.key === "ArrowDown" || e.key === "s") && dir !== "UP") setDirection("DOWN");
      if ((e.key === "ArrowLeft" || e.key === "a") && dir !== "RIGHT") setDirection("LEFT");
      if ((e.key === "ArrowRight" || e.key === "d") && dir !== "LEFT") setDirection("RIGHT");

      if (e.key === " " && !gameRunningRef.current) {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [resetGame]);

  // Touch controls
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dir = directionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && dir !== "LEFT") setDirection("RIGHT");
      if (dx < -20 && dir !== "RIGHT") setDirection("LEFT");
    } else {
      if (dy > 20 && dir !== "UP") setDirection("DOWN");
      if (dy < -20 && dir !== "DOWN") setDirection("UP");
    }
    touchStart.current = null;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 py-8 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Sparkles className="absolute top-[12%] left-[10%] w-8 h-8 text-purple-400/20 animate-shimmer" />
        <Gamepad2 className="absolute top-[8%] right-[15%] w-10 h-10 text-indigo-400/15 animate-float delay-300" />
        <Sparkles className="absolute bottom-[20%] right-[12%] w-6 h-6 text-yellow-300/20 animate-shimmer delay-500" />
      </div>

      <div className="max-w-lg w-full mx-auto relative z-10 space-y-5">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
            {"Penny's Artifact Hunt"} 🏛️
          </h1>
          <p className="text-purple-200 text-sm">
            Guide Penny through history collecting ancient artifacts!
          </p>
        </div>

        {/* Score bar */}
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3" aria-live="polite">
          <div className="text-white">
            <span className="text-sm text-purple-200">Score</span>
            <p className="text-2xl font-bold" aria-label={`Score: ${score}`}>{score}</p>
          </div>
          <div className="text-white text-right">
            <span className="text-sm text-purple-200">Best</span>
            <p className="text-2xl font-bold" aria-label={`Best score: ${highScore}`}>{highScore}</p>
          </div>
        </div>

        {/* Collected artifacts */}
        {collected.length > 0 && (
          <div className="flex justify-center gap-1 flex-wrap">
            {collected.map((emoji, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Game board */}
        <div
          role="application"
          aria-label="Artifact Hunt game board"
          className="mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-purple-400/30 bg-purple-950/80"
          style={{ width: GRID_SIZE * CELL_SIZE + 8, height: GRID_SIZE * CELL_SIZE + 8, padding: 4 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full border-t border-purple-300"
                  style={{ top: i * CELL_SIZE }}
                />
              ))}
              {Array.from({ length: GRID_SIZE }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full border-l border-purple-300"
                  style={{ left: i * CELL_SIZE }}
                />
              ))}
            </div>

            {/* Snake */}
            {snake.map((segment, i) => (
              <div
                key={i}
                className={`absolute rounded-sm transition-all duration-75 ${
                  i === 0
                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30 z-10"
                    : "bg-gradient-to-br from-purple-400 to-purple-500"
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 1,
                  height: CELL_SIZE - 1,
                }}
              >
                {i === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs">
                    👑
                  </span>
                )}
              </div>
            ))}

            {/* Food */}
            <div
              className="absolute flex items-center justify-center animate-pulse"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              <span className="text-base">{foodEmoji}</span>
            </div>

            {/* Start / Game Over overlay */}
            {!gameRunning && (
              <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center space-y-3">
                  {gameOver ? (
                    <>
                      <p className="text-2xl font-bold text-white">Game Over!</p>
                      <p className="text-purple-200">
                        You collected {score} artifact{score !== 1 ? "s" : ""}!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-white">Ready to explore history?</p>
                      <p className="text-purple-200 text-sm">Collect ancient artifacts!</p>
                    </>
                  )}
                  <button
                    onClick={resetGame}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    {gameOver ? "Play Again" : "Start Game"}
                  </button>
                  <p className="text-purple-300 text-xs">Arrow keys / WASD / Swipe to move</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile D-pad controls */}
        <div className="flex justify-center sm:hidden" role="group" aria-label="Game direction controls">
          <div className="grid grid-cols-3 gap-1 w-36">
            <div />
            <button
              onTouchStart={() => directionRef.current !== "DOWN" && setDirection("UP")}
              aria-label="Move up"
              className="bg-white/20 active:bg-white/40 rounded-lg p-3 text-white text-xl font-bold text-center"
            >
              ↑
            </button>
            <div />
            <button
              onTouchStart={() => directionRef.current !== "RIGHT" && setDirection("LEFT")}
              aria-label="Move left"
              className="bg-white/20 active:bg-white/40 rounded-lg p-3 text-white text-xl font-bold text-center"
            >
              ←
            </button>
            <div />
            <button
              onTouchStart={() => directionRef.current !== "LEFT" && setDirection("RIGHT")}
              aria-label="Move right"
              className="bg-white/20 active:bg-white/40 rounded-lg p-3 text-white text-xl font-bold text-center"
            >
              →
            </button>
            <div />
            <button
              onTouchStart={() => directionRef.current !== "UP" && setDirection("DOWN")}
              aria-label="Move down"
              className="bg-white/20 active:bg-white/40 rounded-lg p-3 text-white text-xl font-bold text-center"
            >
              ↓
            </button>
            <div />
          </div>
        </div>

        {/* Nav */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-5 rounded-2xl hover:bg-white/30 transition-all duration-300"
          >
            <FaHome aria-hidden="true" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
