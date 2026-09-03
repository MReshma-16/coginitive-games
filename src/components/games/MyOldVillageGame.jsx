import React, { useState, useEffect, useRef } from 'react';
import { Home, Clock, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { voiceAssistant } from '../../services/voiceAssistant';
import { VoiceButton } from '../VoiceButton';

const ALL_VILLAGE_ITEMS = [
  { id: 'house', name: 'Traditional Stilt House', icon: '🏠', location: 'In the center of the courtyard' },
  { id: 'tree', name: 'Banyan Tree', icon: '🌳', location: 'On the green hill top' },
  { id: 'basket', name: 'Bamboo Basket', icon: '🧺', location: 'On the front wooden porch' },
  { id: 'cow', name: 'Village Cow', icon: '🐄', location: 'Near the green meadow' },
  { id: 'flower', name: 'Wild Orchids', icon: '🌸', location: 'Along the garden fence' },
  { id: 'bucket', name: 'Water Bucket', icon: '🪣', location: 'Beside the stone well' },
  { id: 'rooster', name: 'Village Rooster', icon: '🐓', location: 'Beside the bamboo coop' },
  { id: 'loom', name: 'Wooden Handloom', icon: '🧵', location: 'Under the shaded verandah' }
];

export const MyOldVillageGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('observe'); // 'observe' | 'quiz'
  const [countdown, setCountdown] = useState(8);
  const [activeItems, setActiveItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasAnsweredCurrentQ, setHasAnsweredCurrentQ] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Dynamic image count and timing strictly per requirement:
  // Easy: 2 images or fewer (2 items), 10s view time, 1-2 questions
  // Medium: Up to 4 images (4 items), 7s view time, 3 questions
  // Hard: More than 4 images (6-7 items), 5s view time, 4 questions
  const itemCount = difficulty === 'HARD' ? 6 : difficulty === 'MEDIUM' ? 4 : 2;
  const observeSeconds = difficulty === 'HARD' ? 5 : difficulty === 'MEDIUM' ? 7 : 10;
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
    setHasAnsweredCurrentQ(false);

    // Pick exactly itemCount items for this difficulty level
    const shuffled = [...ALL_VILLAGE_ITEMS].sort(() => 0.5 - Math.random());
    const selectedVillageItems = shuffled.slice(0, itemCount);
    setActiveItems(selectedVillageItems);

    // Generate questions exclusively from the items that are visible
    const actualQCount = Math.min(numQuestions, selectedVillageItems.length);
    const qItems = [...selectedVillageItems].sort(() => 0.5 - Math.random()).slice(0, actualQCount);

    const qList = qItems.map(target => {
      // Distractor locations from other items in database
      const otherLocations = ALL_VILLAGE_ITEMS.filter(item => item.location !== target.location)
        .map(item => item.location)
        .sort(() => 0.5 - Math.random())
        .slice(0, difficulty === 'HARD' ? 3 : difficulty === 'MEDIUM' ? 3 : 2);

      const allOptions = [target.location, ...otherLocations].sort(() => 0.5 - Math.random());

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
    if (hasAnsweredCurrentQ) return;
    setHasAnsweredCurrentQ(true);
    soundManager.playTap();

    const currentQ = questions[currentQIndex];
    let updatedCorrect = correctCount;

    if (option === currentQ.correctOption) {
      updatedCorrect = correctCount + 1;
      setCorrectCount(updatedCorrect);
      soundManager.playSuccess();
    } else {
      soundManager.playChime();
    }

    setTimeout(() => {
      if (currentQIndex + 1 < questions.length) {
        setCurrentQIndex(currentQIndex + 1);
        setHasAnsweredCurrentQ(false);
      } else {
        const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        onCompleteRound({
          correctAnswers: updatedCorrect,
          totalQuestions: questions.length,
          timeTakenSeconds: elapsed
        });
      }
    }, 450);
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🏡 My Old Village • Level: {difficulty} ({itemCount} Objects)
          </span>
          <VoiceButton
            textToRead={
              phase === 'observe'
                ? `Look carefully at the ${itemCount} objects in the traditional village scene and remember their positions.`
                : currentQ?.questionText
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'observe'
            ? `Memorize the Village Scene (${itemCount} Objects Shown)`
            : `Question ${currentQIndex + 1} of ${questions.length}`}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'observe'
            ? `Notice where each of the ${itemCount} objects is placed (${countdown}s remaining).`
            : "Select the correct location where the object was positioned."}
        </p>
      </div>

      {/* Phase 1: Village Scene with Dynamic Object Count */}
      {phase === 'observe' && (
        <div className="bg-gradient-to-b from-sky-50 via-amber-50/60 to-emerald-50 border-3 border-[#8C6D3B]/40 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-900 font-bold text-sm">
            <Clock className="w-5 h-5 text-amber-700 animate-spin" />
            <span>Scene closes in: <strong className="text-lg text-[#1B3B2B]">{countdown}s</strong></span>
          </div>

          {/* Clean Visual Map Grid showing ONLY the active items for this difficulty tier */}
          <div className={`grid gap-4 max-w-lg mx-auto ${
            itemCount <= 2 ? 'grid-cols-2' : itemCount <= 4 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
          }`}>
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/95 border-2 border-amber-200 rounded-3xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-sm transform transition-transform hover:scale-105"
              >
                <span className="text-5xl">{item.icon}</span>
                <span className="font-bold text-sm text-[#1B3B2B]">{item.name}</span>
                <span className="text-xs text-stone-600 text-center font-medium leading-tight bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                  {item.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 2: Questions */}
      {phase === 'quiz' && currentQ && (
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <span className="text-6xl">{currentQ.item.icon}</span>
            <h4 className="font-serif font-bold text-xl text-[#1B3B2B]">
              {currentQ.questionText}
            </h4>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                disabled={hasAnsweredCurrentQ}
                className="w-full p-4 rounded-2xl border-2 border-stone-200 hover:border-[#C99E32] bg-stone-50 hover:bg-amber-50 font-bold text-sm text-stone-900 text-left transition-all shadow-sm active:scale-98 disabled:opacity-50"
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
