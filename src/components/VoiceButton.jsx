import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';

export const VoiceButton = ({ textToRead, label, className = '' }) => {
  const { currentLang, t } = useLanguage();
  const { voiceEnabled } = useAccessibility();
  const [speaking, setSpeaking] = useState(false);

  if (!voiceEnabled) return null;

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (speaking) {
      voiceAssistant.stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      voiceAssistant.speak(textToRead, currentLang, () => {
        setSpeaking(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all font-medium ${
        speaking
          ? 'bg-amber-500 text-white border-amber-600 animate-pulse shadow-md'
          : 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200'
      } ${className}`}
      title={label || t.games?.readInstruction || 'Listen aloud'}
      aria-label={label || 'Listen aloud'}
    >
      {speaking ? (
        <>
          <VolumeX className="w-5 h-5 animate-bounce" />
          <span className="text-sm font-semibold">{t.dashboard?.listenVoice || 'Speaking...'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-amber-800" />
          {label && <span className="text-sm">{label}</span>}
        </>
      )}
    </button>
  );
};
