import React, { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { useLanguage } from '../../context/LanguageContext';

const ODD_ONE_OUT_SETS = {
  EASY: [
    { level: 1, common: '🍎', odd: '🍊', name: 'Fruits (Level 1)' },
    { level: 2, common: '🟢', odd: '⭐', name: 'Shapes (Level 2)' },
    { level: 3, common: '🐱', odd: '🐶', name: 'Animals (Level 3)' },
    { level: 4, common: '🌸', odd: '🌻', name: 'Flowers (Level 4)' },
    { level: 5, common: '☕', odd: '🍵', name: 'Beverages (Level 5)' }
  ],
  MEDIUM: [
    { level: 1, common: '🌿', odd: '🍀', name: 'Foliage (Level 1)' },
    { level: 2, common: '😊', odd: '😉', name: 'Faces (Level 2)' },
    { level: 3, common: '🏠', odd: '🏡', name: 'Houses (Level 3)' },
    { level: 4, common: '🦋', odd: '🐝', name: 'Insects (Level 4)' },
    { level: 5, common: '🧵', odd: '🧶', name: 'Crafts (Level 5)' }
  ],
  HARD: [
    { level: 1, common: '🕒', odd: '🕞', name: 'Clocks (Level 1)' },
    { level: 2, common: '🔺', odd: '🔻', name: 'Triangles (Level 2)' },
    { level: 3, common: '🔶', odd: '🔷', name: 'Gems (Level 3)' },
    { level: 4, common: '🌕', odd: '🌖', name: 'Moons (Level 4)' },
    { level: 5, common: '⛵', odd: '🚤', name: 'Boats (Level 5)' }
  ]
};

export const OddOneOutGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [items, setItems] = useState([]);
  const [oddIndex, setOddIndex] = useState(-1);
  const [feedback, setFeedback] = useState(null); // { isCorrect, message }
  const [isLocked, setIsLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  const itemCount = difficulty === 'HARD' ? 12 : difficulty === 'MEDIUM' ? 8 : 4;

  useEffect(() => {
    initGame(currentLevel);
  }, [difficulty, currentLevel]);

  const initGame = (lvl = currentLevel) => {
    startTimeRef.current = Date.now();
    setScore(0);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
    generateLevel(lvl);
  };

  const generateLevel = (lvl) => {
    const setPool = ODD_ONE_OUT_SETS[difficulty] || ODD_ONE_OUT_SETS.EASY;
    const roundConfig = setPool.find(s => s.level === lvl) || setPool[0];

    // Pick random index for the odd item
    const targetOddIdx = Math.floor(Math.random() * itemCount);
    setOddIndex(targetOddIdx);

    const generatedItems = Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      symbol: i === targetOddIdx ? roundConfig.odd : roundConfig.common,
      isOdd: i === targetOddIdx
    }));

    setItems(generatedItems);
    soundManager.playChime();
  };

  const handleItemClick = (index) => {
    if (isLocked) return;

    const clickedItem = items[index];
    if (!clickedItem) return;

    const isCorrect = clickedItem.isOdd;

    if (isCorrect) {
      setIsLocked(true);
      soundManager.playSuccess();
      const newCorrect = correctCount + 1;
      const newScore = score + 20;
      setCorrectCount(newCorrect);
      setScore(newScore);
      setFeedback({ isCorrect: true, message: `Wonderful observation! Level ${currentLevel} Complete! 🌟` });

      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          setFeedback(null);
          setIsLocked(false);
        } else {
          const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
          const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';

          onCompleteRound({
            correctAnswers: 5,
            totalQuestions: 5,
            timeTakenSeconds: elapsed,
            score: 100,
            accuracy: 100,
            level: 5,
            nextDifficulty: nextLvl
          });
        }
      }, 1000);
    } else {
      soundManager.playTap();
      setFeedback({ isCorrect: false, message: t.games?.lovelyEffort || "Good try! Look closely for the different item. 🌿" });
    }
  };

  const gridCols = difficulty === 'HARD' ? 'grid-cols-4' : difficulty === 'MEDIUM' ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto select-none">
      {/* Header with Level Selector */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            🔍 {t.games?.oddOneOutTitle || "Find Odd One Out"} • {difficulty}
          </span>

          {/* Level 1-5 Pills */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setCurrentLevel(lvl);
                  setFeedback(null);
                  setIsLocked(false);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentLevel === lvl
                    ? 'bg-[#1B3B2B] text-amber-200 shadow-sm border border-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Level: <strong className="text-[#1B3B2B] text-sm">{currentLevel} / 5</strong>
            </span>
            <VoiceButton textToRead={`${t.games?.oddOneOutTitle || 'Find Odd One Out'}. Level ${currentLevel}. ${t.games?.oddOneOutInstruction || 'Look closely at the items and tap the one item that is different.'}`} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {t.games?.oddOneOutTitle || "Find Odd One Out"}
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm">
          {t.games?.oddOneOutInstruction || "Look closely at the items and tap the one item that is different."}
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3.5 rounded-2xl border-2 font-bold text-sm animate-fadeIn ${
          feedback.isCorrect
            ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
            : 'bg-amber-100 border-amber-400 text-amber-950'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Items Grid */}
      <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 sm:p-8 shadow-md inline-block max-w-full">
        <div className={`grid ${gridCols} gap-3 sm:gap-4 mx-auto justify-center`}>
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(index)}
              disabled={isLocked}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl sm:text-4xl flex items-center justify-center transition-all cursor-pointer border-2 shadow-xs active:scale-90 ${
                isLocked && item.isOdd
                  ? 'bg-emerald-200 border-emerald-500 scale-105 ring-4 ring-emerald-300'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200/80 hover:border-[#1B3B2B]'
              }`}
            >
              <span>{item.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Score & Controls */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <div className="text-left text-xs text-stone-600 font-semibold">
          {t.games?.score || "Score"}: <strong className="text-emerald-800 text-sm">{score}</strong> • {t.games?.correct || "Correct"}: <strong className="text-stone-900 text-sm">{correctCount}/5</strong>
        </div>

        <div className="flex items-center gap-2">
          {showRestartConfirm ? (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Restart?</span>
              <button
                onClick={initGame}
                className="px-2.5 py-1 rounded-lg bg-[#1B3B2B] text-white cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.games?.restartGame || "Restart"}</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
            >
              {t.games?.exitGame || "Exit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
