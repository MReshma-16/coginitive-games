import React, { useState } from 'react';
import {
  Home,
  User,
  Gamepad2,
  Clock,
  BarChart3,
  HeartHandshake,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Globe,
  Type,
  SunMoon,
  Menu,
  X,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { usePatient } from '../context/PatientContext';

export const Navbar = ({ activePage, setActivePage, onOpenCulture }) => {
  const { currentLang, setLanguage, languages, t, currentLangObj } = useLanguage();
  const { caretaker, isAuthenticated, logout } = useAuth();
  const { fontSize, setFontSize, contrastMode, setContrastMode, voiceEnabled, setVoiceEnabled } = useAccessibility();
  const { patient } = usePatient();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav?.home || 'Home', icon: Home },
    { id: 'dashboard', label: t.hero?.caretakerPortal || 'Dashboard', icon: HeartHandshake, requireAuth: true },
    { id: 'games', label: t.nav?.games || 'Memory Games', icon: Gamepad2 },
    { id: 'family', label: t.nav?.family || 'Family Memories', icon: Sparkles, requireAuth: true },
    { id: 'reminders', label: t.nav?.reminders || 'Reminders', icon: Clock, requireAuth: true },
    { id: 'progress', label: t.nav?.progress || 'Progress', icon: BarChart3, requireAuth: true },
    { id: 'settings', label: t.nav?.settings || 'Settings', icon: Settings },
    { id: 'help', label: t.nav?.help || 'Help', icon: HelpCircle }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setActivePage('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b-2 border-[#C99E32]/30 shadow-sm transition-colors">
      {/* Top Utility / Accessibility Bar */}
      <div className="bg-[#1E432A] text-[#FAF7F0] px-4 py-1.5 text-xs md:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Cultural Tagline & Non-medical notice */}
          <div className="flex items-center gap-2">
            <span className="text-amber-400">🌿</span>
            <span className="truncate max-w-xs sm:max-w-md font-serif italic text-amber-200">
              {t.tagline || "Remember Yesterday. Enjoy Today. Connect Tomorrow."}
            </span>
          </div>

          {/* Quick Accessibility Controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Culture info button */}
            {onOpenCulture && (
              <button
                onClick={onOpenCulture}
                className="hidden sm:inline-flex items-center gap-1 text-amber-300 hover:text-amber-100 underline decoration-amber-400/50 cursor-pointer"
              >
                <span>🏮 {t.hero?.aboutCulture || "8 States Heritage"}</span>
              </button>
            )}

            {/* Font Size Adjuster */}
            <div className="flex items-center bg-black/20 rounded-full px-2 py-0.5 border border-amber-400/30 gap-1">
              <Type className="w-3.5 h-3.5 text-amber-300" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${fontSize === 'normal' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Standard Text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-sm font-bold ${fontSize === 'large' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Large Text (Recommended)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-base font-bold ${fontSize === 'xlarge' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Extra Large Text"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setContrastMode(contrastMode === 'high' ? 'warm' : 'high')}
              className={`p-1 rounded-full border transition-all ${contrastMode === 'high' ? 'bg-amber-400 text-black border-amber-300' : 'bg-transparent text-amber-200 border-amber-400/30 hover:text-white'}`}
              title="High Contrast Mode"
            >
              <SunMoon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E6C687] via-[#C99E32] to-[#A84B29] p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center text-2xl">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl md:text-3xl font-bold text-[#1E432A] tracking-tight">
                  {t.appTitle?.split('(')[0] || 'Memory Roots'}
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 bg-amber-200/80 text-[#7C3218] text-xs rounded-full font-bold border border-amber-300">
                  NE India
                </span>
              </div>
              <p className="text-xs md:text-sm text-stone-600 font-medium truncate max-w-[200px] sm:max-w-none">
                {t.subTitle || "Cognitive Gaming & Memory Support"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-semibold text-base transition-all ${
                    isActive
                      ? 'bg-[#1E432A] text-white shadow-md'
                      : 'text-stone-800 hover:bg-amber-100/70 hover:text-[#1E432A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (Language Switcher + Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-2 border-[#C99E32] text-[#1E432A] font-bold text-sm hover:bg-amber-50 shadow-sm transition-all"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-4 h-4 text-amber-700" />
                <span className="text-base">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.native}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#C99E32] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-amber-100 text-xs font-bold text-stone-500 uppercase">
                    {t.hero?.chooseLanguage || 'Select Language'}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${
                          currentLang === lang.code
                            ? 'bg-[#1E432A] text-white font-bold'
                            : 'text-stone-800 hover:bg-amber-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.native}</span>
                        </div>
                        <span className={`text-xs ${currentLang === lang.code ? 'text-amber-300' : 'text-stone-500'}`}>
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-stone-800 hover:bg-amber-200 transition-all text-sm font-semibold"
                  title="Caretaker Profile"
                >
                  <User className="w-4 h-4 text-[#1E432A]" />
                  <span className="truncate max-w-[120px]">{caretaker.fullName?.split(' ')[0]}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#A84B29] hover:bg-[#7C3218] text-white font-bold text-sm shadow transition-all active:scale-95"
                  title="Explicit Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.nav?.logout || 'Logout'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm shadow-md transition-all border-2 border-[#C99E32] active:scale-95"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{t.nav?.login || 'Login'}</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-2xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FAF7F0] border-t-2 border-amber-200 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            if (item.requireAuth && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-lg transition-all ${
                  isActive
                    ? 'bg-[#1E432A] text-white'
                    : 'text-stone-800 hover:bg-amber-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-stone-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {!isAuthenticated && (
            <button
              onClick={() => {
                setActivePage('auth');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1E432A] text-white font-bold text-lg mt-3"
            >
              <LogIn className="w-5 h-5 text-amber-300" />
              <span>{t.nav?.login || 'Caretaker Login / Register'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
