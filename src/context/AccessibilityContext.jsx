import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../services/audioSynthesizer';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('memoryroots_font_size') || 'large'; // Default large for elderly users
  });

  const [contrastMode, setContrastMode] = useState(() => {
    return localStorage.getItem('memoryroots_contrast') || 'warm'; // 'warm' or 'high'
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('memoryroots_sound') !== 'false';
  });

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('memoryroots_voice') !== 'false';
  });

  // Apply font scale class to body
  useEffect(() => {
    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem('memoryroots_font_size', fontSize);
  }, [fontSize]);

  // Apply contrast mode class to body
  useEffect(() => {
    if (contrastMode === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('memoryroots_contrast', contrastMode);
  }, [contrastMode]);

  // Update sound manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
    localStorage.setItem('memoryroots_sound', soundEnabled.toString());
  }, [soundEnabled]);

  // Voice setting
  useEffect(() => {
    localStorage.setItem('memoryroots_voice', voiceEnabled.toString());
  }, [voiceEnabled]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        contrastMode,
        setContrastMode,
        soundEnabled,
        setSoundEnabled,
        voiceEnabled,
        setVoiceEnabled
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
