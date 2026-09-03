import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Clock, CheckCircle2, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { voiceAssistant } from '../../services/voiceAssistant';
import { VoiceButton } from '../VoiceButton';

const ALL_OBJECTS = [
  { id: 'basket', name: 'Bamboo Basket', icon: '🧺', category: 'Handicraft' },
  { id: 'cup', name: 'Traditional Cup', icon: '🍵', category: 'Utensil' },
  { id: 'pot', name: 'Clay Pot', icon: '🏺', category: 'Pottery' },
  { id: 'tool', name: 'Farming Tool', icon: '⛏️', category: 'Farming' },
  { id: 'cloth', name: 'Traditional Cloth', icon: '👘', category: 'Textile' },
  { id: 'toy', name: 'Wooden Toy', icon: '🪆', category: 'Childhood' },
  { id: 'fruit', name: 'Local Fruit', icon: '🥭', category: 'Nature' },
  { id: 'flower', name: 'Orchid Flower', icon: '🌸', category: 'Flora' },
  { id: 'kettle', name: 'Brass Kettle', icon: '🫖', category: 'Utensil' },
  { id: 'flute', name: 'Bamboo Flute', icon: '🪈', category: 'Music' }
];

export const MemoryBasketGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall'
  const [basketObjects, setBasketObjects] = useState([]);
  const [selectionPool, setSelectionPool] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [countdown, setCountdown] = useState(6);
  const startTimeRef = useRef(Date.now());

  // Determine count & time based on difficulty
  const targetCount = difficulty === 'HARD' ? 8 : difficulty === 'MEDIUM' ? 5 : 3;
  const memorizeSeconds = difficulty === 'HARD' ? 6 : difficulty === 'MEDIUM' ? 7 : 8;

  useEffect(() => {
    startNewRound();
  }, [difficulty]);

  const startNewRound = () => {
    startTimeRef.current = Date.now();
    setSelectedIds([]);
    setPhase('memorize');
    setCountdown(memorizeSeconds);

    // Pick random targetCount items
    const shuffled = [...ALL_OBJECTS].sort(() => 0.5 - Math.random());
    const chosen = shuffled.slice(0, targetCount);
    setBasketObjects(chosen);

    // Create selection pool: target items + distractors
    const poolSize = difficulty === 'HARD' ? 10 : difficulty === 'MEDIUM' ? 9 : 6;
    const pool = [...shuffled.slice(0, poolSize)].sort(() => 0.5 - Math.random());
    setSelectionPool(pool);

    soundManager.playChime();
  };

  // Countdown timer during memorize phase
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('recall');
      soundManager.playBell();
    }
  }, [phase, countdown]);

  const handleToggleSelect = (objId) => {
    soundManager.playTap();
    if (selectedIds.includes(objId)) {
      setSelectedIds(selectedIds.filter(id => id !== objId));
    } else {
      if (selectedIds.length < targetCount) {
        const nextSelected = [...selectedIds, objId];
        setSelectedIds(nextSelected);

        // Auto-check when player has selected all required items
        if (nextSelected.length === targetCount) {
          evaluateSubmission(nextSelected);
        }
      }
    }
  };

  const evaluateSubmission = (userSelected = selectedIds) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const targetIdSet = new Set(basketObjects.map(o => o.id));

    let correct = 0;
    userSelected.forEach(id => {
      if (targetIdSet.has(id)) correct++;
    });

    onCompleteRound({
      correctAnswers: correct,
      totalQuestions: targetCount,
      timeTakenSeconds: elapsedSeconds
    });
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🧺 Memory Basket • Level: {difficulty}
          </span>
          <VoiceButton
            textToRead={
              phase === 'memorize'
                ? `Look at the ${targetCount} items in the traditional basket and remember them.`
                : `Select the ${targetCount} items that were originally in the basket.`
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'memorize' ? "Remember What's in the Basket" : "Which Objects Were in the Basket?"}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'memorize'
            ? `Memorize these ${targetCount} traditional items before the basket closes.`
            : `Tap the ${targetCount} items you saw (${selectedIds.length}/${targetCount} selected).`}
        </p>
      </div>

      {/* Phase 1: Memorize Basket */}
      {phase === 'memorize' && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 animate-fadeIn">
          {/* Countdown indicator */}
          <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
            <Clock className="w-5 h-5 text-amber-700 animate-spin" />
            <span>Basket closing in: <strong className="text-lg text-[#1B3B2B]">{countdown}s</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {basketObjects.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center gap-2 transform transition-transform hover:scale-105"
              >
                <span className="text-4xl sm:text-5xl">{item.icon}</span>
                <span className="font-serif font-bold text-sm text-stone-900 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Recall & Select from Pool */}
      {phase === 'recall' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectionPool.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleSelect(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-lg scale-102 ring-4 ring-amber-300/50'
                      : 'bg-white text-stone-900 border-stone-200 hover:border-amber-400 hover:bg-amber-50/60 shadow-sm'
                  }`}
                >
                  <span className="text-4xl">{item.icon}</span>
                  <span className="font-bold text-xs sm:text-sm">{item.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => evaluateSubmission()}
              disabled={selectedIds.length === 0}
              className="px-8 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Check Answers ({selectedIds.length}/{targetCount})</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
