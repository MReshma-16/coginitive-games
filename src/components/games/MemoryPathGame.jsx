import React, { useState, useEffect, useRef } from 'react';
import { Footprints, ArrowRight, RotateCcw, CheckCircle2, Clock } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const PATH_ITEMS = [
  { id: 'tree', name: 'Tree', icon: '🌳' },
  { id: 'house', name: 'House', icon: '🏠' },
  { id: 'basket', name: 'Basket', icon: '🧺' },
  { id: 'rooster', name: 'Rooster', icon: '🐓' },
  { id: 'flower', name: 'Flower', icon: '🌸' },
  { id: 'bucket', name: 'Bucket', icon: '🪣' },
  { id: 'cow', name: 'Cow', icon: '🐄' },
  { id: 'paddy', name: 'Paddy', icon: '🌾' }
];

export const MemoryPathGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [phase, setPhase] = useState('show'); // 'show' | 'input'
  const [pathSequence, setPathSequence] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [playerInput, setPlayerInput] = useState([]);
  const startTimeRef = useRef(Date.now());

  const pathLength = difficulty === 'HARD' ? 7 : difficulty === 'MEDIUM' ? 5 : 3;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setPhase('show');
    setPlayerInput([]);
    setCurrentStepIndex(-1);

    // Pick random sequence of pathLength items
    const shuffled = [...PATH_ITEMS].sort(() => 0.5 - Math.random());
    const seq = shuffled.slice(0, pathLength);
    setPathSequence(seq);

    // Animate sequence step by step
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setCurrentStepIndex(step);
        soundManager.playTap();
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStepIndex(-1);
          setPhase('input');
        }, 800);
      }
    }, 1100);
  };

  const handlePickStep = (item) => {
    if (phase !== 'input') return;
    soundManager.playTap();

    const nextInput = [...playerInput, item];
    setPlayerInput(nextInput);

    const stepIdx = nextInput.length - 1;

    // Check mistake
    if (nextInput[stepIdx].id !== pathSequence[stepIdx].id) {
      soundManager.playChime();
      setTimeout(() => {
        setPlayerInput([]);
        startRound();
      }, 700);
      return;
    }

    // Finished path
    if (nextInput.length === pathSequence.length) {
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      onCompleteRound({
        correctAnswers: pathSequence.length,
        totalQuestions: pathSequence.length,
        timeTakenSeconds: elapsed
      });
    }
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🛤️ Memory Path • Level: {difficulty}
          </span>
          <VoiceButton
            textToRead={
              phase === 'show'
                ? "Watch the path light up step by step, and remember the order."
                : "Now tap the objects in the exact order of the path."
            }
          />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {phase === 'show' ? "Watch the Path Sequence" : "Walk the Memory Path"}
        </h3>

        <p className="text-stone-600 text-sm">
          {phase === 'show'
            ? `Follow the ${pathLength} steps across the village path.`
            : `Completed ${playerInput.length} of ${pathLength} steps.`}
        </p>
      </div>

      {/* Path Display during Show Phase */}
      {phase === 'show' && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-center gap-2 sm:gap-4 animate-fadeIn">
          {pathSequence.map((item, idx) => {
            const isHighlighted = currentStepIndex === idx;
            return (
              <React.Fragment key={idx}>
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                    isHighlighted
                      ? 'bg-amber-300 border-[#1B3B2B] scale-120 shadow-xl ring-4 ring-amber-400'
                      : 'bg-white border-amber-200 opacity-60'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-bold">{item.name}</span>
                </div>
                {idx < pathSequence.length - 1 && (
                  <span className="text-amber-700 font-bold text-lg">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Input Phase: Tap in Order */}
      {phase === 'input' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Progress Path */}
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[56px] bg-stone-100 p-3 rounded-2xl border border-stone-200">
            {playerInput.length === 0 ? (
              <span className="text-xs text-stone-500 italic">Tap the first object in the path...</span>
            ) : (
              playerInput.map((p, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-stone-300 text-sm font-bold text-[#1B3B2B]">
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </span>
              ))
            )}
          </div>

          {/* Grid of all path objects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PATH_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickStep(item)}
                className="bg-white border-2 border-stone-200 hover:border-[#C99E32] rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:bg-amber-50/50 active:scale-95 transition-all"
              >
                <span className="text-4xl">{item.icon}</span>
                <span className="font-bold text-xs text-stone-800">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
