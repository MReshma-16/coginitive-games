import React, { useState, useEffect, useRef } from 'react';
import { Home, Clock, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { voiceAssistant } from '../../services/voiceAssistant';
import { VoiceButton } from '../VoiceButton';

const VILLAGE_ITEMS = [
  { name: 'Traditional Stilt House', icon: '🏡', location: 'In the center of the courtyard' },
  { name: 'Banyan Tree', icon: '🌳', location: 'On the green hill top' },
  { name: 'Bamboo Basket', icon: '🧺', location: 'On the front wooden porch' },
  { name: 'Water Clay Pot', icon: '🏺', location: 'Near the stone well' },
  { name: 'Village Rooster', icon: '🐓', location: 'Beside the bamboo fence' },
  { name: 'Traditional Handloom', icon: '🧵', location: 'Under the shaded verandah' },
  { name: 'Wild Orchid Flowers', icon: '🌸', location: 'Along the garden pathway' }
];

export const MyOldVillageGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('observe'); // 'observe' | 'quiz'
  const [countdown, setCountdown] = useState(7);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  const observeSeconds = difficulty === 'HARD' ? 5 : difficulty === 'MEDIUM' ? 7 : 9;
  const numQuestions = difficulty === 'HARD' ? 4 : difficulty === 'MEDIUM' ? 3 : 2;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setPhase('observe');
    setCountdown(observeSeconds);
    setCurrentQIndex(0);
    setCorrectCount(0);

    // Generate questions from village items
    const shuffled = [...VILLAGE_ITEMS].sort(() => 0.5 - Math.random());
    const qList = shuffled.slice(0, numQuestions).map(target => {
      const wrongOptions = VILLAGE_ITEMS.filter(item => item.name !== target.name)
        .map(item => item.location)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const allOptions = [target.location, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        item: target,
        questionText: `Where was the ${target.name} (${target.icon}) placed in the village?`,
        correctOption: target.location,
        options: allOptions
      };
    });

    setQuestions(qList);
    soundManager.playChime();
  };

  useEffect(() => {
    if (phase !== 'observe') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase('quiz');
      soundManager.playBell();
    }
  }, [phase, countdown]);

  const handleSelectAnswer = (option) => {
    soundManager.playTap();
    const currentQ = questions[currentQIndex];
    let updatedCorrect = correctCount;

    if (option === currentQ.correctOption) {
      updatedCorrect = correctCount + 1;
      setCorrectCount(updatedCorrect);
    }

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      onCompleteRound({
        correctAnswers: updatedCorrect,
        totalQuestions: questions.length,
        timeTakenSeconds: elapsed
      });
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🏡 My Old Village • Level: {difficulty}
          </span>
          <VoiceButton
            textToRead={
              phase === 'observe'
                ? "Look carefully at the traditional village scene and remember where each object is located."
                : currentQ?.questionText
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'observe' ? "Explore & Memorize the Village Scene" : `Question ${currentQIndex + 1} of ${questions.length}`}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'observe'
            ? `Notice the houses, trees, water pots, and animals before the scene clears (${countdown}s).`
            : "Select the correct location where the object was positioned."}
        </p>
      </div>

      {/* Phase 1: Village Scene */}
      {phase === 'observe' && (
        <div className="bg-gradient-to-b from-sky-50 via-amber-50/60 to-emerald-50 border-3 border-[#8C6D3B]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-900 font-bold text-sm">
            <Clock className="w-5 h-5 text-amber-700 animate-spin" />
            <span>Scene closes in: <strong className="text-lg text-[#1B3B2B]">{countdown}s</strong></span>
          </div>

          {/* Clean Visual Map Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
            {VILLAGE_ITEMS.map((item) => (
              <div
                key={item.name}
                className="bg-white/90 border border-amber-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="font-bold text-xs text-[#1B3B2B]">{item.name}</span>
                <span className="text-[10px] text-stone-600 text-center leading-tight">{item.location}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Questions */}
      {phase === 'quiz' && currentQ && (
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <span className="text-5xl">{currentQ.item.icon}</span>
            <h4 className="font-serif font-bold text-xl text-[#1B3B2B]">
              {currentQ.questionText}
            </h4>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                className="w-full p-4 rounded-2xl border-2 border-stone-200 hover:border-[#C99E32] bg-stone-50 hover:bg-amber-50 font-bold text-sm text-stone-900 text-left transition-all shadow-sm active:scale-98"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
