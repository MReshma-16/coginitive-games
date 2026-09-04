import React, { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const ODD_ONE_OUT_SETS = {
  EASY: [
    { common: '🍎', odd: '🍊', name: 'Fruits', desc: 'Find the different fruit' },
    { common: '🟢', odd: '⭐', name: 'Shapes', desc: 'Find the different shape' },
    { common: '🐱', odd: '🐶', name: 'Animals', desc: 'Find the puppy' },
    { common: '🌸', odd: '🌻', name: 'Flowers', desc: 'Find the sunflower' },
    { common: '🚗', odd: '🚲', name: 'Vehicles', desc: 'Find the bicycle' },
    { common: '☕', odd: '🍵', name: 'Beverages', desc: 'Find the green tea' }
  ],
  MEDIUM: [
    { common: '🌿', odd: '🍀', name: 'Foliage', desc: 'Find the four-leaf clover' },
    { common: '😊', odd: '😉', name: 'Faces', desc: 'Find the winking face' },
    { common: '🏠', odd: '🏡', name: 'Houses', desc: 'Find the garden home' },
    { common: '🦋', odd: '🐝', name: 'Insects', desc: 'Find the honeybee' },
    { common: '🧵', odd: '🧶', name: 'Crafts', desc: 'Find the wool yarn' },
    { common: '🔔', odd: '🥁', name: 'Instruments', desc: 'Find the drum' }
  ],
  HARD: [
    { common: '🕒', odd: '🕞', name: 'Clocks', desc: 'Find the clock showing a different time' },
    { common: '🔺', odd: '🔻', name: 'Triangles', desc: 'Find the inverted triangle' },
    { common: '🔶', odd: '🔷', name: 'Gems', desc: 'Find the blue diamond' },
    { common: '🌕', odd: '🌖', name: 'Moons', desc: 'Find the gibbous moon' },
    { common: '⛵', odd: '🚤', name: 'Boats', desc: 'Find the speedboat' },
    { common: '🪴', odd: '🌵', name: 'Plants', desc: 'Find the cactus' }
  ]
};

export const OddOneOutGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(5);
  const [items, setItems] = useState([]);
  const [oddIndex, setOddIndex] = useState(-1);
  const [feedback, setFeedback] = useState(null); // { isCorrect, message }
  const [isLocked, setIsLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  const itemCount = difficulty === 'HARD' ? 20 : difficulty === 'MEDIUM' ? 12 : 6;

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGame = () => {
    startTimeRef.current = Date.now();
    setCurrentRound(0);
    setCorrectCount(0);
    setScore(0);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
    generateRound(0);
  };

  const generateRound = (roundIndex) => {
    setIsLocked(false);
    setFeedback(null);

    const pool = ODD_ONE_OUT_SETS[difficulty] || ODD_ONE_OUT_SETS.EASY;
    const set = pool[roundIndex % pool.length];

    // Pick random position for the odd item
    const targetOddIdx = Math.floor(Math.random() * itemCount);
    setOddIndex(targetOddIdx);

    const newItems = Array(itemCount).fill(set.common);
    newItems[targetOddIdx] = set.odd;
    setItems(newItems);

    soundManager.playTap();
  };

  const handleSelectItem = (index) => {
    if (isLocked) return;
    setIsLocked(true); // Prevent multiple clicks

    const isCorrect = index === oddIndex;
    let newCorrect = correctCount;
    let newScore = score;

    if (isCorrect) {
      soundManager.playSuccess();
      newCorrect++;
      newScore += 10;
      setCorrectCount(newCorrect);
      setScore(newScore);
      setFeedback({
        isCorrect: true,
        message: "Excellent observation! 🌟"
      });
    } else {
      soundManager.playChime();
      setFeedback({
        isCorrect: false,
        message: "Good try! Let's look carefully at the differences. 🌿"
      });
    }

    // Advance to next round or complete game
    setTimeout(() => {
      const nextRound = currentRound + 1;
      if (nextRound < totalRounds) {
        setCurrentRound(nextRound);
        generateRound(nextRound);
      } else {
        const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const finalAccuracy = Math.round((newCorrect / totalRounds) * 100);
        onCompleteRound({
          correctAnswers: newCorrect,
          totalQuestions: totalRounds,
          timeTakenSeconds: elapsed,
          score: newScore,
          accuracy: finalAccuracy
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto select-none">
      {/* Game Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            🔍 Find Odd One Out • {difficulty}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Round: <strong className="text-[#1B3B2B] text-sm">{currentRound + 1} of {totalRounds}</strong>
            </span>
            <VoiceButton textToRead="Find the odd one out. Observe the group of items and tap the one item that is different." />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          Which One is Different?
        </h3>

        <p className="text-stone-600 text-sm">
          Look carefully at all items and tap the single different object.
        </p>
      </div>

      {/* Round Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-2xl border-2 font-bold text-sm animate-fadeIn ${
          feedback.isCorrect
            ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
            : 'bg-amber-100 border-amber-400 text-amber-950'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Grid of Items */}
      <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 sm:p-8 shadow-md inline-block max-w-full">
        <div className={`grid gap-3 sm:gap-4 justify-center mx-auto ${
          itemCount === 6 ? 'grid-cols-3' : itemCount === 12 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-4 sm:grid-cols-5'
        }`}>
          {items.map((icon, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectItem(idx)}
              disabled={isLocked}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-50 hover:bg-amber-100/70 border-2 border-stone-200 hover:border-amber-400 shadow-sm flex items-center justify-center text-3xl sm:text-4xl active:scale-95 transition-all disabled:opacity-80 cursor-pointer"
            >
              <span>{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Score and Controls */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <div className="text-left text-xs text-stone-600 font-semibold">
          Score: <strong className="text-emerald-800 text-base">{score} pts</strong>
        </div>

        <div className="flex items-center gap-2">
          {showRestartConfirm ? (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Restart?</span>
              <button
                onClick={initGame}
                className="px-2.5 py-1 rounded-lg bg-[#1B3B2B] text-white"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
