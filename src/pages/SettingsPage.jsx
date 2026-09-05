import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Type,
  SunMoon,
  Volume2,
  Mic,
  RotateCcw,
  User,
  LogOut,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../services/audioSynthesizer';

export const SettingsPage = ({ setActivePage }) => {
  const { t, currentLang, setLanguage, languages } = useLanguage();
  const {
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    soundEnabled,
    setSoundEnabled,
    voiceEnabled,
    setVoiceEnabled
  } = useAccessibility();
  const { caretaker, logout, updateProfile } = useAuth();

  const [name, setName] = useState(caretaker?.fullName || '');
  const [email, setEmail] = useState(caretaker?.email || '');
  const [phone, setPhone] = useState(caretaker?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [demoResetDone, setDemoResetDone] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ fullName: name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDemo = async () => {
    try {
      await fetch('/api/system/reset-demo', { method: 'POST' });
    } catch (e) {
      console.warn('Resetting locally');
    }
    setDemoResetDone(true);
    setTimeout(() => {
      setDemoResetDone(false);
      window.location.reload();
    }, 1000);
  };

  const handleExplicitLogout = () => {
    logout();
    setActivePage('home');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Settings className="w-3.5 h-3.5 text-amber-700" />
              <span>Preferences & Accessibility</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
              {t.settings?.title || "Settings & Accessibility"}
            </h1>
          </div>
        </div>

        {/* 1. Language Preference (Requirement 3) */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
            <Globe className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-[#1E432A]">
              {t.settings?.languagePref || "Language Preference"}
            </h2>
          </div>

          <p className="text-xs text-stone-600">
            Changing language immediately translates the entire platform and saves your choice across future visits.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span>{lang.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                    {lang.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Elderly Accessibility & Font Sizing (Requirement 16) */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
            <Type className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-[#1E432A]">
              {t.settings?.textSize || "Elderly Font Size & Contrast"}
            </h2>
          </div>

          {/* Font Sizing */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Font Sizing
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFontSize('normal')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                  fontSize === 'normal'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-stone-50 text-stone-800 border-stone-300'
                }`}
              >
                {t.settings?.normal || "Standard"}
              </button>

              <button
                onClick={() => setFontSize('large')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-base transition-all ${
                  fontSize === 'large'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-stone-50 text-stone-800 border-stone-300'
                }`}
              >
                {t.settings?.large || "Large (Recommended)"}
              </button>

              <button
                onClick={() => setFontSize('xlarge')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-lg transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-stone-50 text-stone-800 border-stone-300'
                }`}
              >
                {t.settings?.xlarge || "Extra Large"}
              </button>
            </div>
          </div>

          {/* Visual Contrast */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Visual Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setContrastMode('warm')}
                className={`py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  contrastMode === 'warm'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-stone-50 text-stone-800 border-stone-300'
                }`}
              >
                <span>🌾</span>
                <span>{t.settings?.warmHeritage || "Warm Heritage Theme"}</span>
              </button>

              <button
                onClick={() => setContrastMode('high')}
                className={`py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  contrastMode === 'high'
                    ? 'bg-black text-amber-300 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-stone-50 text-stone-800 border-stone-300'
                }`}
              >
                <SunMoon className="w-4 h-4" />
                <span>{t.settings?.highContrast || "High Contrast (High Readability)"}</span>
              </button>
            </div>
          </div>

          {/* Voice & Sound Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-semibold text-stone-900">
                  {t.settings?.voiceAssistant || "Voice Assistant (Read Aloud)"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#1E432A] focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-semibold text-stone-900">
                  {t.settings?.soundEffects || "Folk Instrument Sounds"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-[#1E432A] focus:ring-amber-400"
              />
            </label>
          </div>
        </div>

        {/* 3. Caretaker Profile Management */}
        {caretaker && (
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-700" />
                <h2 className="font-serif font-bold text-xl text-[#1E432A]">
                  {t.settings?.caretakerInfo || "Caretaker Account Details"}
                </h2>
              </div>
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. Demo Data Reset & Explicit Logout */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {t.settings?.resetDemo || "Reset & Demo Data"}
            </h3>
            <p className="text-xs text-stone-500">
              Restore the original North-East sample elder profile and demo game records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="btn-secondary px-4 py-2.5 rounded-2xl font-bold text-sm shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 icon-spin-hover text-amber-900" />
              <span>{demoResetDone ? "Restored!" : "Restore Demo"}</span>
            </button>

            {caretaker && (
              <button
                onClick={handleExplicitLogout}
                className="btn-danger px-5 py-2.5 rounded-2xl font-bold text-sm shadow flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4 icon-slide-left" />
                <span>{t.nav?.logout || "Logout"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
