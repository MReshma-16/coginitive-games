import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const ROUNDS_DATA = {
  EASY: [
    {
      type: 'select',
      prompt: 'Select the words that begin with the letter C:',
      options: ['CAT', 'DOG', 'CAR', 'TREE'],
      correct: ['CAT', 'CAR']
    },
    {
      type: 'complete',
      prompt: 'Complete the word: C _ T (a friendly pet)',
      incomplete: 'C _ T',
      options: ['A', 'E', 'O', 'U'],
      correct: 'A',
      word: 'CAT'
    },
    {
      type: 'build',
      prompt: 'Arrange the letters to spell a word starting with C:',
      scrambled: ['P', 'U', 'C'],
      correct: 'CUP'
    },
    {
      type: 'recall',
      prompt: 'Which of these is something you can drink from starting with C?',
      options: ['CUP', 'BOOK', 'SHOE', 'TREE'],
      correct: 'CUP'
    },
    {
      type: 'select',
      prompt: 'Select the words that begin with the letter C:',
      options: ['CARE', 'BIRD', 'COW', 'FISH'],
      correct: ['CARE', 'COW']
    }
  ],
  MEDIUM: [
    {
      type: 'select',
      prompt: 'Select all the words that begin with the letter C:',
      options: ['CLOUD', 'RIVER', 'CHAIR', 'HOUSE', 'CLOCK', 'SMILE'],
      correct: ['CLOUD', 'CHAIR', 'CLOCK']
    },
    {
      type: 'complete',
      prompt: 'Complete the word: C L _ U D (in the sky)',
      incomplete: 'C L _ U D',
      options: ['O', 'E', 'A', 'I'],
      correct: 'O',
      word: 'CLOUD'
    },
    {
      type: 'build',
      prompt: 'Arrange the letters to spell a C word:',
      scrambled: ['A', 'I', 'H', 'R', 'C'],
      correct: 'CHAIR'
    },
    {
      type: 'recall',
      prompt: 'Which of these tells the time and starts with C?',
      options: ['CLOCK', 'WATCH', 'RADIO', 'LAMP', 'TABLE'],
      correct: 'CLOCK'
    },
    {
      type: 'select',
      prompt: 'Select all the words that begin with the letter C:',
      options: ['CHILD', 'SUNNY', 'CANDLE', 'WATER', 'CLEAN', 'GARDEN'],
      correct: ['CHILD', 'CANDLE', 'CLEAN']
    }
  ],
  HARD: [
    {
      type: 'select',
      prompt: 'Select all the words that begin with the letter C:',
      options: ['COMFORT', 'KINDNESS', 'COURAGE', 'WISDOM', 'CREATIVE', 'PATIENCE', 'CHEERFUL', 'HOPEFUL'],
      correct: ['COMFORT', 'COURAGE', 'CREATIVE', 'CHEERFUL']
    },
    {
      type: 'complete',
      prompt: 'Complete the word: C _ M F O R T',
      incomplete: 'C _ M F O R T',
      options: ['O', 'A', 'U', 'E', 'I'],
      correct: 'O',
      word: 'COMFORT'
    },
    {
      type: 'build',
      prompt: 'Arrange the letters to form a word of praise starting with C:',
      scrambled: ['E', 'R', 'C', 'H', 'E', 'F', 'U', 'L'],
      correct: 'CHEERFUL'
    },
    {
      type: 'recall',
      prompt: 'Which of these means having creative imagination and starts with C?',
      options: ['CREATIVE', 'BRILLIANT', 'TALENTED', 'GENIUS', 'SMART', 'RESOURCEFUL'],
      correct: 'CREATIVE'
    },
    {
      type: 'select',
      prompt: 'Select all words beginning with C:',
      options: ['CULTURE', 'HERITAGE', 'CALMNESS', 'HARMONY', 'CARING', 'PEACEFUL', 'COURTESY', 'WARMTH'],
      correct: ['CULTURE', 'CALMNESS', 'CARING', 'COURTESY']
    }
  ]
};

export const LetterCWordGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]); // for 'select' type
  const [builtLetters, setBuiltLetters] = useState([]); // for 'build' type
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  const rounds = ROUNDS_DATA[difficulty] || ROUNDS_DATA.EASY;
  const currentRound = rounds[currentRoundIdx];

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGame = () => {
    startTimeRef.current = Date.now();
    setCurrentRoundIdx(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedWords([]);
    setBuiltLetters([]);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
    soundManager.playChime();
  };

  const handleToggleSelectWord = (word) => {
    if (isLocked) return;
    soundManager.playTap();
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSelectOption = (opt) => {
    if (isLocked) return;
    setIsLocked(true); // Single-click debounce lock

    let isCorrect = false;
    if (currentRound.type === 'complete' || currentRound.type === 'recall') {
      isCorrect = opt === currentRound.correct;
    }

    finalizeRound(isCorrect);
  };

  const handleSubmitSelection = () => {
    if (isLocked || selectedWords.length === 0) return;
    setIsLocked(true);

    const targetSet = new Set(currentRound.correct);
    const userSet = new Set(selectedWords);

    // Accurate validation: all correct C words selected and no non-C words
    let isCorrect = targetSet.size === userSet.size && [...userSet].every(w => targetSet.has(w));
    finalizeRound(isCorrect);
  };

  const handleTapScrambledLetter = (letter, index) => {
    if (isLocked) return;
    soundManager.playTap();
    const nextBuilt = [...builtLetters, { letter, originalIndex: index }];
    setBuiltLetters(nextBuilt);

    // Auto-check when all letters placed
    if (nextBuilt.length === currentRound.scrambled.length) {
      setIsLocked(true);
      const spelled = nextBuilt.map(b => b.letter).join('');
      const isCorrect = spelled === currentRound.correct;
      finalizeRound(isCorrect);
    }
  };

  const handleUndoBuiltLetter = () => {
    if (isLocked || builtLetters.length === 0) return;
    soundManager.playTap();
    setBuiltLetters(builtLetters.slice(0, -1));
  };

  const finalizeRound = (isCorrect) => {
    let newCorrect = correctCount;
    let newScore = score;

    if (isCorrect) {
      soundManager.playSuccess();
      newCorrect++;
      newScore += 10;
      setCorrectCount(newCorrect);
      setScore(newScore);
      setFeedback({ isCorrect: true, message: "Great word! Excellent recall! 🌟" });
    } else {
      soundManager.playChime();
      setFeedback({ isCorrect: false, message: "Good try! Keep going. 🌿" });
    }

    setTimeout(() => {
      const nextIdx = currentRoundIdx + 1;
      if (nextIdx < rounds.length) {
        setCurrentRoundIdx(nextIdx);
        setSelectedWords([]);
        setBuiltLetters([]);
        setFeedback(null);
        setIsLocked(false);
      } else {
        const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const accuracy = Math.round((newCorrect / rounds.length) * 100);
        onCompleteRound({
          correctAnswers: newCorrect,
          totalQuestions: rounds.length,
          timeTakenSeconds: elapsed,
          score: newScore,
          accuracy
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto select-none">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            🔤 Letter C Word Game • {difficulty}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Round: <strong className="text-[#1B3B2B] text-sm">{currentRoundIdx + 1} of {rounds.length}</strong>
            </span>
            <VoiceButton textToRead={currentRound.prompt} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {currentRound.prompt}
        </h3>
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

      {/* Round Type 1: Select C Words */}
      {currentRound.type === 'select' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {currentRound.options.map((word) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={word}
                  onClick={() => handleToggleSelectWord(word)}
                  disabled={isLocked}
                  className={`p-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-md scale-102 ring-2 ring-amber-300'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitSelection}
            disabled={isLocked || selectedWords.length === 0}
            className="px-8 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            Submit Selection ({selectedWords.length} chosen)
          </button>
        </div>
      )}

      {/* Round Type 2: Complete Word */}
      {currentRound.type === 'complete' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-6 max-w-sm mx-auto">
            <span className="font-serif font-bold text-4xl sm:text-5xl text-[#1B3B2B] tracking-widest">
              {currentRound.incomplete}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
            {currentRound.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                disabled={isLocked}
                className="p-5 rounded-2xl bg-white hover:bg-amber-100/70 border-2 border-stone-300 hover:border-[#C99E32] font-bold text-2xl text-stone-900 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Round Type 3: Build Word */}
      {currentRound.type === 'build' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Constructed word display */}
          <div className="min-h-[70px] bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-center gap-2 max-w-md mx-auto">
            {builtLetters.length === 0 ? (
              <span className="text-xs text-stone-500 italic">Tap the letters below in order...</span>
            ) : (
              builtLetters.map((b, idx) => (
                <span
                  key={idx}
                  className="w-12 h-12 rounded-xl bg-[#1B3B2B] text-amber-200 font-bold text-2xl flex items-center justify-center shadow-sm"
                >
                  {b.letter}
                </span>
              ))
            )}
          </div>

          {/* Letter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {currentRound.scrambled.map((letter, idx) => {
              const isUsed = builtLetters.some(b => b.originalIndex === idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleTapScrambledLetter(letter, idx)}
                  disabled={isLocked || isUsed}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-bold text-2xl border-2 transition-all shadow-sm ${
                    isUsed
                      ? 'bg-stone-200 text-stone-400 border-stone-200 opacity-40'
                      : 'bg-white hover:bg-amber-100 text-stone-900 border-stone-300 hover:border-amber-400 active:scale-95 cursor-pointer'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {builtLetters.length > 0 && !isLocked && (
            <button
              onClick={handleUndoBuiltLetter}
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              Undo last letter ↩
            </button>
          )}
        </div>
      )}

      {/* Round Type 4: Recall / Category */}
      {currentRound.type === 'recall' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto animate-fadeIn">
          {currentRound.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelectOption(opt)}
              disabled={isLocked}
              className="p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-stone-200 hover:border-[#C99E32] font-bold text-lg text-stone-900 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

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
