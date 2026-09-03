import React, { useState, useEffect, useRef } from 'react';
import { Palette, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const ALL_PATTERNS = [
  { id: 'muga-diamond', name: 'Muga Diamond Motif', origin: 'Assam', symbol: '🔶', color: 'from-amber-400 to-yellow-600', patternType: 'Diamond Weave' },
  { id: 'naga-cross', name: 'Naga Cross Weave', origin: 'Nagaland', symbol: '✖️', color: 'from-red-600 to-stone-900', patternType: 'Warrior Stripe' },
  { id: 'phanek-zigzag', name: 'Manipuri Lotus Border', origin: 'Manipur', symbol: '〰️', color: 'from-teal-600 to-emerald-800', patternType: 'Lotus Wave' },
  { id: 'mizo-puan', name: 'Mizo Puan Bands', origin: 'Mizoram', symbol: '⏸️', color: 'from-pink-600 to-amber-500', patternType: 'Heritage Band' },
  { id: 'khasi-ryndia', name: 'Khasi Ryndia Motif', origin: 'Meghalaya', symbol: '🔷', color: 'from-indigo-600 to-sky-700', patternType: 'Eri Diamond' },
  { id: 'tripuri-rignai', name: 'Tripuri Floral Pattern', origin: 'Tripura', symbol: '💠', color: 'from-purple-600 to-rose-700', patternType: 'Royal Petal' },
  { id: 'arunachal-tangsa', name: 'Tangsa Geometric Weave', origin: 'Arunachal Pradesh', symbol: '🔺', color: 'from-orange-500 to-amber-700', patternType: 'Tribal Peak' },
  { id: 'sikkim-lepcha', name: 'Lepcha Sacred Knot', origin: 'Sikkim', symbol: '☸️', color: 'from-rose-500 to-purple-800', patternType: 'Buddhist Knot' },
  { id: 'bodo-dokhona', name: 'Bodo Peacock Weave', origin: 'Bodo / Assam', symbol: '🦚', color: 'from-yellow-400 to-emerald-600', patternType: 'Peacock Eye' },
  { id: 'karbi-jambili', name: 'Karbi Sacred Totem', origin: 'Assam Hills', symbol: '⚜️', color: 'from-emerald-700 to-stone-800', patternType: 'Sacred Branch' }
];

export const PatternMatchGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'match'
  const [targetPattern, setTargetPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [hasSelected, setHasSelected] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Number of options strictly adheres to requirement:
  // Easy: 4 options
  // Medium: 6 options
  // Hard: 8 options
  const numChoices = difficulty === 'HARD' ? 8 : difficulty === 'MEDIUM' ? 6 : 4;
  const memorizeSeconds = difficulty === 'HARD' ? 4 : difficulty === 'MEDIUM' ? 5 : 6;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setPhase('memorize');
    setHasSelected(false);
    setCountdown(memorizeSeconds);

    // Pick a random target pattern
    const shuffledPool = [...ALL_PATTERNS].sort(() => 0.5 - Math.random());
    const target = shuffledPool[0];
    setTargetPattern(target);

    // Pick remaining distractors
    const distractors = shuffledPool.slice(1, numChoices);
    const allOptions = [target, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    soundManager.playChime();
  };

  useEffect(() => {
    if (phase !== 'memorize') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('match');
      soundManager.playBell();
    }
  }, [phase, countdown]);

  const handleSelect = (selected) => {
    if (hasSelected) return;
    setHasSelected(true);
    soundManager.playTap();

    const isCorrect = selected.id === targetPattern.id;
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    if (isCorrect) {
      soundManager.playSuccess();
    } else {
      soundManager.playChime();
    }

    setTimeout(() => {
      onCompleteRound({
        correctAnswers: isCorrect ? 1 : 0,
        totalQuestions: 1,
        timeTakenSeconds: elapsed
      });
    }, 450);
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🎨 Pattern Match • Level: {difficulty} ({numChoices} Choices)
          </span>
          <VoiceButton
            textToRead={
              phase === 'memorize'
                ? "Look closely at this traditional North-Eastern textile motif and remember its colors and symbol."
                : `Which of the ${numChoices} patterns matches the one you just saw?`
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'memorize' ? "Memorize the Traditional Textile Motif" : `Select the Matching Motif (${numChoices} Choices)`}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'memorize'
            ? `Notice the colors and geometry before it disappears (${countdown}s).`
            : `Tap the exact matching motif from the ${numChoices} options below.`}
        </p>
      </div>

      {/* Phase 1: Show Target Motif */}
      {phase === 'memorize' && targetPattern && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-8 shadow-md max-w-sm mx-auto space-y-3 animate-fadeIn">
          <div className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${targetPattern.color} flex items-center justify-center text-6xl shadow-inner border-4 border-white`}>
            {targetPattern.symbol}
          </div>
          <h4 className="font-serif font-bold text-lg text-[#1B3B2B]">{targetPattern.name}</h4>
          <span className="text-xs text-stone-500">{targetPattern.origin} ({targetPattern.patternType})</span>
        </div>
      )}

      {/* Phase 2: Pick Match from Multiple Options */}
      {phase === 'match' && (
        <div className={`grid gap-3.5 animate-fadeIn ${
          numChoices >= 8 ? 'grid-cols-2 sm:grid-cols-4' : numChoices >= 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
        }`}>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={hasSelected}
              className="bg-white border-2 border-stone-200 hover:border-[#C99E32] rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 hover:bg-amber-50/50 disabled:opacity-50 active:scale-95"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-3xl sm:text-4xl shadow-inner border-2 border-white`}>
                {opt.symbol}
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-stone-800 text-center leading-tight">
                {opt.name}
              </span>
              <span className="text-[10px] text-stone-400">
                {opt.origin}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
