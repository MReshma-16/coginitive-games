import React, { useState, useEffect, useRef } from 'react';
import { Palette, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const PATTERNS = [
  { id: 'muga-diamond', name: 'Golden Muga Diamond Motif', origin: 'Assam', symbol: '🔶', color: 'from-amber-400 to-yellow-600', patternType: 'Diamond Weave' },
  { id: 'naga-cross', name: 'Naga Geometric Cross Weave', origin: 'Nagaland', symbol: '✖️', color: 'from-red-600 to-stone-900', patternType: 'Warrior Stripe' },
  { id: 'phanek-zigzag', name: 'Manipuri Phanek Lotus Border', origin: 'Manipur', symbol: '〰️', color: 'from-teal-600 to-emerald-800', patternType: 'Lotus Wave' },
  { id: 'mizo-puan', name: 'Mizo Puan Colorful Bands', origin: 'Mizoram', symbol: '⏸️', color: 'from-pink-600 to-amber-500', patternType: 'Heritage Band' },
  { id: 'khasi-ryndia', name: 'Khasi Ryndia Silk Motif', origin: 'Meghalaya', symbol: '🔷', color: 'from-indigo-600 to-sky-700', patternType: 'Eri Diamond' },
  { id: 'tripuri-rignai', name: 'Tripuri Rignai Floral Pattern', origin: 'Tripura', symbol: '💠', color: 'from-purple-600 to-rose-700', patternType: 'Royal Petal' }
];

export const PatternMatchGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'match'
  const [targetPattern, setTargetPattern] = useState(null);
  const [options, setOptions] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const startTimeRef = useRef(Date.now());

  const memorizeSeconds = difficulty === 'HARD' ? 3.5 : difficulty === 'MEDIUM' ? 4.5 : 6;
  const numChoices = difficulty === 'HARD' ? 6 : difficulty === 'MEDIUM' ? 4 : 3;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setPhase('memorize');
    setCountdown(Math.ceil(memorizeSeconds));

    const target = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    setTargetPattern(target);

    // Create choices
    const others = PATTERNS.filter(p => p.id !== target.id).sort(() => 0.5 - Math.random());
    const choices = [target, ...others.slice(0, numChoices - 1)].sort(() => 0.5 - Math.random());
    setOptions(choices);

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

  const handleSelect = (selectedPattern) => {
    soundManager.playTap();
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const isCorrect = selectedPattern.id === targetPattern.id;

    onCompleteRound({
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      timeTakenSeconds: elapsed
    });
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🎨 Pattern Match • Level: {difficulty}
          </span>
          <VoiceButton
            textToRead={
              phase === 'memorize'
                ? "Look closely at this traditional North-Eastern textile pattern and remember its design."
                : "Which pattern matches the one you just saw?"
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'memorize' ? "Memorize the Traditional Textile Motif" : "Select the Matching Motif"}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'memorize'
            ? `Notice the colors and geometry before it disappears (${countdown}s).`
            : "Tap the exact matching pattern from the options below."}
        </p>
      </div>

      {/* Phase 1: Show Target Pattern */}
      {phase === 'memorize' && targetPattern && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-8 shadow-md max-w-sm mx-auto space-y-3 animate-fadeIn">
          <div className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br ${targetPattern.color} flex items-center justify-center text-6xl shadow-inner border-4 border-white`}>
            {targetPattern.symbol}
          </div>
          <h4 className="font-serif font-bold text-lg text-[#1B3B2B]">{targetPattern.name}</h4>
          <span className="text-xs text-stone-500">{targetPattern.origin} Traditional Weave</span>
        </div>
      )}

      {/* Phase 2: Pick Match */}
      {phase === 'match' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className="bg-white border-2 border-stone-200 hover:border-[#C99E32] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 hover:bg-amber-50/50"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-4xl shadow-inner border-2 border-white`}>
                {opt.symbol}
              </div>
              <span className="font-bold text-xs text-stone-800">{opt.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
