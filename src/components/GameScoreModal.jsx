import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { soundManager } from '../services/audioSynthesizer';
import { voiceAssistant } from '../services/voiceAssistant';
import { useLanguage } from '../context/LanguageContext';

export const GameScoreModal = ({
  isOpen,
  onClose,
  onPlayNextRound,
  gameTitle,
  resultData
}) => {
  const { currentLang, t } = useLanguage();

  const record = resultData?.roundRecord || resultData || {};
  const correctAnswers = record.correctAnswers ?? 0;
  const incorrectAnswers = record.incorrectAnswers ?? 0;
  const totalQuestions = record.totalQuestions ?? 0;
  const percentageScore = record.percentageScore ?? (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0);
  const timeTakenSeconds = record.timeTakenSeconds ?? 0;

  const currentDifficulty = resultData?.currentDifficulty || record.difficulty || 'EASY';
  const nextDifficulty = resultData?.nextDifficulty || currentDifficulty;
  const bestScore = resultData?.bestScore ?? percentageScore;
  const isAdaptiveShift = resultData?.isAdaptiveShift || false;
  const shiftDirection = resultData?.shiftDirection || null;
  const supportiveMessage = resultData?.supportiveMessage || null;

  useEffect(() => {
    if (isOpen && resultData) {
      if (percentageScore >= 60) {
        soundManager.playSuccess();
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#E6C687', '#2C5E3B', '#A84B29', '#1B6A78']
        });
      } else {
        soundManager.playChime();
      }

      const voiceMsg = supportiveMessage ||
        (percentageScore >= 80 ? (t.games?.wonderful || "Wonderful memory!") : (t.games?.goodMemory || "Good effort! Take your time."));
      voiceAssistant.speak(voiceMsg, currentLang);
    }
  }, [isOpen, resultData]);

  if (!isOpen || !resultData) return null;

  const getDifficultyBadge = (level) => {
    switch (level) {
      case 'HARD':
        return { label: '🔴 Hard', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'MEDIUM':
        return { label: '🟡 Medium', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      default:
        return { label: '🟢 Easy', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const currentBadge = getDifficultyBadge(currentDifficulty);
  const nextBadge = getDifficultyBadge(nextDifficulty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F0] border-3 border-[#C99E32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative Stars */}
        <div className="flex justify-center items-center gap-1.5 mb-3 text-amber-500">
          <Star className="w-6 h-6 fill-amber-400" />
          <Star className="w-10 h-10 fill-amber-500 scale-110" />
          <Star className="w-6 h-6 fill-amber-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E432A] mb-1">
          {percentageScore >= 80
            ? (t.games?.wonderful || "Wonderful!")
            : percentageScore >= 50
            ? (t.games?.goodMemory || "Good Memory!")
            : (t.games?.lovelyEffort || "Lovely Effort!")}
        </h2>

        <p className="text-sm text-stone-600 mb-5">
          {gameTitle} • <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentBadge.bg}`}>{currentBadge.label}</span>
        </p>

        {/* Adaptive Notification Banner */}
        {supportiveMessage && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 mb-5 text-sm text-amber-950 font-medium leading-relaxed">
            {supportiveMessage}
          </div>
        )}

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-3 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-emerald-800 block">
              {t.games?.correct || "Correct"}
            </span>
            <span className="text-2xl font-bold text-emerald-900">{correctAnswers} / {totalQuestions}</span>
          </div>

          <div className="bg-white border-2 border-amber-200 rounded-2xl p-3 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-amber-800 block">
              {t.games?.score || "Score"}
            </span>
            <span className="text-2xl font-bold text-amber-900">{percentageScore}%</span>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-2xl p-3 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-stone-600 block">
              {t.games?.timeTaken || "Time"}
            </span>
            <span className="text-2xl font-bold text-stone-800">{timeTakenSeconds}s</span>
          </div>
        </div>

        {/* Immediate Level Transition Pill */}
        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 mb-6 text-xs text-stone-700 flex items-center justify-between">
          <span className="text-stone-500 font-medium">Unlocked Next Level:</span>
          <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${nextBadge.bg}`}>
            {nextBadge.label}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onPlayNextRound}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <span>{t.games?.nextRound || "Next Round"}</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>

          <button
            onClick={onClose}
            className="py-3.5 px-5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm transition-all"
          >
            {t.games?.backToGames || "Back to Games"}
          </button>
        </div>
      </div>
    </div>
  );
};
