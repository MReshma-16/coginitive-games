import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Star, RotateCcw, ArrowRight, Heart } from 'lucide-react';
import { soundManager } from '../services/audioSynthesizer';
import { voiceAssistant } from '../services/voiceAssistant';
import { useLanguage } from '../context/LanguageContext';
import { aiService } from '../services/aiService';

export const CelebrationModal = ({
  isOpen,
  onClose,
  onPlayAgain,
  onNext,
  score = 100,
  accuracy = 100,
  gameTitle = '',
  encouragement = ''
}) => {
  const { currentLang, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      soundManager.playSuccess();

      // Launch warm, gentle celebratory confetti
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E6C687', '#C99E32', '#2C5E3B', '#A84B29', '#1B6A78']
      });

      const messageToSpeak = encouragement || aiService.getEncouragement(t);
      voiceAssistant.speak(messageToSpeak, currentLang);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayMessage = encouragement || aiService.getEncouragement(t);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F0] border-4 border-[#C99E32] rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none"></div>

        {/* Floating Stars */}
        <div className="flex justify-center items-center gap-2 mb-4 text-amber-500">
          <Star className="w-8 h-8 fill-amber-400 animate-calm-pulse" />
          <Star className="w-12 h-12 fill-amber-500 scale-110" />
          <Star className="w-8 h-8 fill-amber-400 animate-calm-pulse" />
        </div>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E432A] mb-2">
          {displayMessage}
        </h2>

        <p className="text-lg md:text-xl text-stone-700 mb-6 font-medium">
          {t.games?.goodMemory || "You did wonderful today!"}
        </p>

        {/* Score & Accuracy Pills */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl px-5 py-3">
            <span className="block text-xs uppercase tracking-wider font-semibold text-amber-800">
              {t.games?.score || "Score"}
            </span>
            <span className="text-2xl font-bold text-amber-900">{score}</span>
          </div>

          <div className="bg-emerald-100/90 border-2 border-emerald-300 rounded-2xl px-5 py-3">
            <span className="block text-xs uppercase tracking-wider font-semibold text-emerald-800">
              {t.games?.accuracy || "Accuracy"}
            </span>
            <span className="text-2xl font-bold text-emerald-900">{accuracy}%</span>
          </div>
        </div>

        <p className="text-stone-600 text-sm mb-6 italic">
          {t.games?.takeYourTime || "Every moment spent remembering brings warmth to the mind."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-lg border-2 border-amber-400 transition-all shadow-md active:scale-98"
            >
              <RotateCcw className="w-6 h-6" />
              <span>{t.games?.playAgain || "Play Again"}</span>
            </button>
          )}

          <button
            onClick={onNext || onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-lg border-2 border-[#C99E32] transition-all shadow-lg active:scale-98"
          >
            <span>{t.games?.backToGames || "Continue"}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
