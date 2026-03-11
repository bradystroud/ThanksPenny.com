"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { Sparkles, Trophy, BookOpen, ChevronRight, RotateCcw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

const questions: Question[] = [
  {
    question: "Which ancient wonder of the world was located in Alexandria, Egypt?",
    options: ["Colossus of Rhodes", "The Great Lighthouse (Pharos)", "Hanging Gardens", "Temple of Artemis"],
    correctIndex: 1,
    funFact: "The Lighthouse of Alexandria stood roughly 100m tall and was one of the tallest structures in the ancient world for centuries!",
  },
  {
    question: "Who was the first woman to win a Nobel Prize?",
    options: ["Rosalind Franklin", "Marie Curie", "Ada Lovelace", "Florence Nightingale"],
    correctIndex: 1,
    funFact: "Marie Curie won TWO Nobel Prizes - in Physics (1903) and Chemistry (1911). An absolute legend!",
  },
  {
    question: "The Rosetta Stone helped decode which ancient language?",
    options: ["Latin", "Sumerian", "Egyptian Hieroglyphics", "Sanskrit"],
    correctIndex: 2,
    funFact: "The Rosetta Stone has the same text in three scripts: hieroglyphics, Demotic, and Ancient Greek. It was discovered in 1799!",
  },
  {
    question: "Which empire was ruled by Genghis Khan?",
    options: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Persian Empire"],
    correctIndex: 2,
    funFact: "The Mongol Empire became the largest contiguous land empire in history, covering about 24 million square kilometres!",
  },
  {
    question: "In what year did the Berlin Wall fall?",
    options: ["1987", "1989", "1991", "1985"],
    correctIndex: 1,
    funFact: "The fall of the Berlin Wall on November 9, 1989 was a pivotal moment that led to German reunification!",
  },
  {
    question: "Which civilisation built Machu Picchu?",
    options: ["Aztec", "Maya", "Inca", "Olmec"],
    correctIndex: 2,
    funFact: "Machu Picchu was built around 1450 AD and was abandoned just over 100 years later during the Spanish Conquest!",
  },
  {
    question: "Who was the longest-reigning British monarch before Queen Elizabeth II?",
    options: ["Queen Victoria", "King George III", "King Henry VIII", "King Edward VII"],
    correctIndex: 0,
    funFact: "Queen Victoria reigned for 63 years (1837-1901). Elizabeth II surpassed her in 2015 with a reign of over 70 years!",
  },
  {
    question: "The ancient city of Pompeii was destroyed by which volcano?",
    options: ["Mount Etna", "Mount Olympus", "Mount Vesuvius", "Mount Stromboli"],
    correctIndex: 2,
    funFact: "Pompeii was buried under 4 to 6 metres of volcanic ash in 79 AD. The site was rediscovered in 1748!",
  },
  {
    question: "Which country gifted the Statue of Liberty to the United States?",
    options: ["England", "Spain", "France", "Netherlands"],
    correctIndex: 2,
    funFact: "France gave the statue in 1886 to celebrate the friendship between the two nations and the ideals of freedom!",
  },
  {
    question: "What was the name of Captain Cook's ship when he mapped the east coast of Australia?",
    options: ["The Beagle", "HMB Endeavour", "The Mayflower", "HMS Victory"],
    correctIndex: 1,
    funFact: "Cook sailed HMB Endeavour along Australia's east coast in 1770. He made landfall at Botany Bay near modern-day Sydney!",
  },
  {
    question: "Which ancient Greek philosopher was the teacher of Alexander the Great?",
    options: ["Socrates", "Plato", "Aristotle", "Pythagoras"],
    correctIndex: 2,
    funFact: "Aristotle tutored Alexander starting when he was 13. Not a bad student - he went on to create one of the largest empires ever!",
  },
  {
    question: "The Terracotta Army was built to guard the tomb of which Chinese emperor?",
    options: ["Emperor Wu", "Qin Shi Huang", "Kublai Khan", "Emperor Taizong"],
    correctIndex: 1,
    funFact: "Over 8,000 soldiers, 130 chariots, and 670 horses were buried with the emperor. Each soldier has a unique face!",
  },
  // Women in History
  {
    question: "Who was the first woman to fly solo across the Atlantic Ocean?",
    options: ["Bessie Coleman", "Amelia Earhart", "Harriet Quimby", "Jacqueline Cochran"],
    correctIndex: 1,
    funFact: "Amelia Earhart completed the solo flight in 1932, five years after Charles Lindbergh. She flew from Newfoundland to Northern Ireland in about 15 hours!",
  },
  {
    question: "Cleopatra was the last active ruler of which kingdom?",
    options: ["Roman Empire", "Ptolemaic Kingdom of Egypt", "Carthage", "Kingdom of Kush"],
    correctIndex: 1,
    funFact: "Cleopatra spoke at least nine languages and was the first Ptolemaic ruler to learn Egyptian. She was incredibly well-educated!",
  },
  {
    question: "Which woman led the French army to several victories during the Hundred Years' War?",
    options: ["Eleanor of Aquitaine", "Catherine de Medici", "Joan of Arc", "Marie Antoinette"],
    correctIndex: 2,
    funFact: "Joan of Arc was only 17 when she led the French army to lift the siege of Orl\u00e9ans in 1429. She became a national heroine of France!",
  },
  {
    question: "Who is considered the world's first computer programmer?",
    options: ["Grace Hopper", "Ada Lovelace", "Hedy Lamarr", "Marie Curie"],
    correctIndex: 1,
    funFact: "Ada Lovelace wrote the first algorithm intended for a machine in 1843 - for Charles Babbage's Analytical Engine. She was Lord Byron's daughter!",
  },
  {
    question: "Which woman was the first to win two Nobel Prizes in different sciences?",
    options: ["Dorothy Hodgkin", "Marie Curie", "Lise Meitner", "Irène Joliot-Curie"],
    correctIndex: 1,
    funFact: "Marie Curie won the Nobel Prize in Physics (1903) and Chemistry (1911). Her daughter Irène also won a Nobel Prize in Chemistry!",
  },
  {
    question: "Boudicca led a revolt against the Romans in which modern-day country?",
    options: ["France", "Spain", "England", "Germany"],
    correctIndex: 2,
    funFact: "Boudicca was queen of the Iceni tribe. Her uprising in 60-61 AD destroyed Colchester, London, and St Albans before being defeated!",
  },
  {
    question: "Who was the first woman to travel to space?",
    options: ["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Svetlana Savitskaya"],
    correctIndex: 1,
    funFact: "Valentina Tereshkova orbited Earth 48 times in Vostok 6 in June 1963. She was only 26 years old and had been a textile worker!",
  },
  {
    question: "Which queen ruled England for 45 years during the Golden Age?",
    options: ["Queen Anne", "Mary Queen of Scots", "Queen Elizabeth I", "Queen Victoria"],
    correctIndex: 2,
    funFact: "Elizabeth I reigned from 1558 to 1603. She never married, earning the nickname 'The Virgin Queen', and oversaw the defeat of the Spanish Armada!",
  },
  {
    question: "Frida Kahlo, the iconic artist, was from which country?",
    options: ["Spain", "Argentina", "Mexico", "Brazil"],
    correctIndex: 2,
    funFact: "Frida Kahlo created 143 paintings, 55 of which are self-portraits. She once said 'I paint myself because I am so often alone'!",
  },
  {
    question: "Who founded the modern nursing profession during the Crimean War?",
    options: ["Clara Barton", "Florence Nightingale", "Dorothea Dix", "Mary Seacole"],
    correctIndex: 1,
    funFact: "Florence Nightingale was known as 'The Lady with the Lamp'. She reduced the death rate at her hospital from 42% to 2% through sanitation reforms!",
  },
  {
    question: "Which woman mathematician's calculations were critical for the first US crewed spaceflights?",
    options: ["Katherine Johnson", "Emmy Noether", "Sophie Germain", "Maryam Mirzakhani"],
    correctIndex: 0,
    funFact: "Katherine Johnson calculated trajectories for NASA's Mercury and Apollo missions. John Glenn personally requested that she verify the computer's calculations!",
  },
  {
    question: "Hatshepsut was one of the most successful pharaohs of which ancient civilisation?",
    options: ["Mesopotamia", "Ancient Greece", "Ancient Egypt", "Persia"],
    correctIndex: 2,
    funFact: "Hatshepsut ruled for about 20 years (1478-1458 BC) and is regarded as one of Egypt's most successful pharaohs. She often wore a false beard as a symbol of power!",
  },
  {
    question: "Which suffragette threw herself in front of the King's horse at the 1913 Epsom Derby?",
    options: ["Emmeline Pankhurst", "Emily Davison", "Millicent Fawcett", "Sylvia Pankhurst"],
    correctIndex: 1,
    funFact: "Emily Davison died from her injuries four days later. She had been imprisoned nine times and force-fed 49 times for the suffragette cause!",
  },
  {
    question: "Who was the first female Prime Minister of Australia?",
    options: ["Quentin Bryce", "Julia Gillard", "Julie Bishop", "Penny Wong"],
    correctIndex: 1,
    funFact: "Julia Gillard served as PM from 2010 to 2013. Her famous misogyny speech in parliament in 2012 went viral worldwide!",
  },
  {
    question: "Which ancient Greek poetess is known as the 'Tenth Muse'?",
    options: ["Hypatia", "Sappho", "Aspasia", "Arete"],
    correctIndex: 1,
    funFact: "Sappho lived on the island of Lesbos around 630 BC. Plato called her the 'Tenth Muse' - the original nine were goddesses of the arts!",
  },
  {
    question: "Rosa Parks refused to give up her bus seat in which US city in 1955?",
    options: ["Atlanta", "Birmingham", "Montgomery", "Selma"],
    correctIndex: 2,
    funFact: "Rosa Parks' act of defiance in Montgomery, Alabama sparked the Montgomery Bus Boycott, which lasted 381 days and was a pivotal moment in the civil rights movement!",
  },
  {
    question: "Which woman discovered radioactivity's connection to the atomic nucleus, enabling the discovery of nuclear fission?",
    options: ["Marie Curie", "Lise Meitner", "Chien-Shiung Wu", "Rosalind Franklin"],
    correctIndex: 1,
    funFact: "Lise Meitner provided the first theoretical explanation of nuclear fission in 1939, but was overlooked for the Nobel Prize. Element 109, Meitnerium, is named after her!",
  },
  {
    question: "Who was the first woman to reach the summit of Mount Everest?",
    options: ["Junko Tabei", "Wanda Rutkiewicz", "Stacy Allison", "Lydia Bradey"],
    correctIndex: 0,
    funFact: "Junko Tabei from Japan reached the summit on May 16, 1975. She went on to become the first woman to complete the Seven Summits!",
  },
  {
    question: "Which warrior queen of the Jhansi state fought against British rule in India?",
    options: ["Razia Sultana", "Rani Lakshmibai", "Noor Jahan", "Ahilyabai Holkar"],
    correctIndex: 1,
    funFact: "Rani Lakshmibai fought in the Indian Rebellion of 1857 and died in battle at age 29. She is one of India's most celebrated freedom fighters!",
  },
  {
    question: "Hypatia, one of the first known female mathematicians, lived in which ancient city?",
    options: ["Athens", "Rome", "Alexandria", "Constantinople"],
    correctIndex: 2,
    funFact: "Hypatia of Alexandria (c. 360-415 AD) was a philosopher, astronomer, and mathematician. She headed the Neoplatonist school and was renowned throughout the Mediterranean!",
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const QUESTIONS_PER_GAME = 10;

export default function HistoryQuiz() {
  const [gameQuestions, setGameQuestions] = useState<Question[]>(() =>
    shuffleArray(questions).slice(0, QUESTIONS_PER_GAME)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = gameQuestions[currentIndex];

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#9333ea", "#c084fc", "#e879f9", "#fbbf24", "#34d399"],
    });
  }, []);

  const fireFinaleConfetti = useCallback(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 50,
        spread: 360,
        startVelocity: 30,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ["#9333ea", "#c084fc", "#e879f9", "#fbbf24", "#34d399"],
      });
    }, 200);
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (index === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
      fireConfetti();
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= gameQuestions.length) {
      setGameOver(true);
      fireFinaleConfetti();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  const restartGame = () => {
    setGameQuestions(shuffleArray(questions).slice(0, QUESTIONS_PER_GAME));
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameOver(false);
  };

  const getScoreMessage = () => {
    const pct = score / gameQuestions.length;
    if (pct === 1) return "Perfect score! You're a true history buff, Penny! 🏆";
    if (pct >= 0.75) return "Amazing work! Penny would be proud of that score! 🌟";
    if (pct >= 0.5) return "Not bad! History is full of surprises! 📚";
    return "Keep exploring history - every question is a chance to learn! 🔍";
  };

  const getOptionStyle = (index: number) => {
    if (selectedAnswer === null) {
      return "bg-white/90 hover:bg-purple-50 border-purple-200 hover:border-purple-400 hover:scale-[1.02] cursor-pointer";
    }
    if (index === currentQuestion.correctIndex) {
      return "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300";
    }
    if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
      return "bg-red-50 border-red-300 ring-2 ring-red-300";
    }
    return "bg-white/60 border-purple-100 opacity-60";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 animate-gradient py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <BookOpen className="absolute top-[10%] left-[12%] w-10 h-10 text-purple-400/20 animate-float" />
        <Sparkles className="absolute top-[20%] right-[15%] w-6 h-6 text-yellow-300/25 animate-shimmer delay-300" />
        <BookOpen className="absolute bottom-[25%] right-[10%] w-8 h-8 text-indigo-300/20 animate-float delay-500" />
        <Sparkles className="absolute bottom-[15%] left-[20%] w-7 h-7 text-purple-300/20 animate-shimmer delay-700" />
        <Trophy className="absolute top-[8%] right-[35%] w-9 h-9 text-yellow-400/15 animate-float delay-200" />
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-3xl">📜</span>
            <span className="text-3xl">🏛️</span>
            <span className="text-3xl">📜</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {"Penny's History Quiz"}
          </h1>
          <p className="text-purple-200 text-sm">
            Test your history knowledge with this quiz made for our favourite history lover!
          </p>
        </div>

        {!gameOver ? (
          <>
            {/* Progress bar */}
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / gameQuestions.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-purple-200 -mt-4">
              <span>Question {currentIndex + 1} of {gameQuestions.length}</span>
              <span>Score: {score}/{gameQuestions.length}</span>
            </div>

            {/* Question card */}
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${getOptionStyle(index)}`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-purple-800">{option}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Fun fact + next button */}
              {selectedAnswer !== null && (
                <div className="mt-6 space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-purple-700 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Fun Fact
                    </p>
                    <p className="text-sm text-purple-600">{currentQuestion.funFact}</p>
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {currentIndex + 1 >= gameQuestions.length ? "See Results" : "Next Question"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Results screen */
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto drop-shadow-lg" />
            <div>
              <h2 className="text-3xl font-extrabold text-purple-900 mb-2">Quiz Complete!</h2>
              <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                {score} / {gameQuestions.length}
              </p>
              <p className="text-lg text-purple-600 font-medium">{getScoreMessage()}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={restartGame}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-purple-100 text-purple-700 font-bold py-3 px-6 rounded-2xl hover:bg-purple-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <FaHome className="w-5 h-5" />
                Back Home
              </Link>
            </div>
          </div>
        )}

        {/* Navigation (during quiz) */}
        {!gameOver && (
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-5 rounded-2xl hover:bg-white/30 transition-all duration-300"
            >
              <FaHome /> Back Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
