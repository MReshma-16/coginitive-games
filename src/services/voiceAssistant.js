// Voice Assistant for Elderly Dementia & Memory Care
// Supports Text-To-Speech (TTS) and Speech-to-Text (STT)

const LANG_MAP = {
  en: 'en-IN',
  as: 'as-IN',
  bn: 'bn-IN',
  brx: 'hi-IN', // Fallback for Bodo speech synthesis
  kha: 'en-IN',
  mni: 'bn-IN',
  lus: 'en-IN',
  ne: 'ne-NP'
};

class VoiceAssistantService {
  constructor() {
    this.isSpeaking = false;
    this.isListening = false;
    this.recognition = null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  speak(text, lang = 'en', onEndCallback = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLangCode = LANG_MAP[lang] || 'en-IN';
    utterance.lang = targetLangCode;
    utterance.rate = 0.88; // Gentle, clear slower pace for elderly comfort
    utterance.pitch = 1.05;

    // Pick warm pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLangCode.split('-')[0])) || voices.find(v => v.lang.includes('IN')) || voices[0];
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (err) => {
      console.warn('TTS error:', err);
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  startListening(lang = 'en', onResultCallback, onErrorCallback) {
    if (!this.recognition) {
      if (onErrorCallback) onErrorCallback('Speech recognition is not supported in this browser.');
      return;
    }

    this.recognition.lang = LANG_MAP[lang] || 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      if (event.results && event.results[0]) {
        const transcript = event.results[0][0].transcript;
        if (onResultCallback) onResultCallback(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onErrorCallback) onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start failed:', e);
      this.isListening = false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
