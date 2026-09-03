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
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { usePatient } from '../context/PatientContext';

export const Navbar = ({ activePage, setActivePage, onOpenCulture }) => {
  const { currentLang, setLanguage, languages, t, currentLangObj } = useLanguage();
  const { caretaker, isAuthenticated, logout } = useAuth();
  const { fontSize, setFontSize, contrastMode, setContrastMode } = useAccessibility();
  const { patient } = usePatient();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: HeartHandshake, requireAuth: true },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'family', label: 'Memories', icon: Sparkles, requireAuth: true },
    { id: 'reminders', label: 'Reminders', icon: Clock, requireAuth: true },
    { id: 'progress', label: 'Progress', icon: BarChart3, requireAuth: true },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle }
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
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0] border-b border-[#E5DFD5] shadow-sm">
      {/* Top Clean Utility Bar */}
      <div className="w-full bg-[#1B3B2B] text-[#FAF7F0] px-3 sm:px-6 py-1 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-amber-400">🌿</span>
            <span className="truncate font-serif italic text-amber-200">
              Remember Yesterday. Enjoy Today. Connect Tomorrow.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {onOpenCulture && (
              <button
                onClick={onOpenCulture}
                className="hidden md:inline-flex items-center gap-1 text-amber-300 hover:text-amber-100 text-xs font-medium cursor-pointer"
              >
                <span>🏮 8 States Heritage</span>
              </button>
            )}

            {/* Font Size Adjuster */}
            <div className="flex items-center bg-black/20 rounded-lg px-1.5 py-0.5 border border-amber-400/30 gap-1 text-[11px]">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 rounded font-bold ${fontSize === 'normal' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Standard Text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 rounded font-bold ${fontSize === 'large' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Large Text (Recommended)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1 rounded font-bold ${fontSize === 'xlarge' ? 'bg-amber-400 text-stone-900' : 'text-amber-100 hover:text-white'}`}
                title="Extra Large Text"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setContrastMode(contrastMode === 'high' ? 'warm' : 'high')}
              className={`p-1 rounded-lg border text-[11px] ${contrastMode === 'high' ? 'bg-amber-400 text-black border-amber-300' : 'bg-transparent text-amber-200 border-amber-400/30'}`}
              title="High Contrast Mode"
            >
              <SunMoon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B3B2B] text-amber-300 text-xl shadow-sm flex items-center justify-center border border-[#C99E32]">
              🌿
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold text-[#1B3B2B] tracking-tight">
                Memory Roots
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-[#1B3B2B] text-white shadow-sm'
                      : 'text-stone-700 hover:bg-amber-100/60 hover:text-[#1B3B2B]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-[#1B3B2B] font-bold text-xs hover:border-[#C99E32] shadow-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.native}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#C99E32] rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase">
                    Select Language
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs ${
                          currentLang === lang.code
                            ? 'bg-[#1B3B2B] text-white font-bold'
                            : 'text-stone-800 hover:bg-amber-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.native}</span>
                        </span>
                        <span className={`text-[10px] ${currentLang === lang.code ? 'text-amber-300' : 'text-stone-400'}`}>
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-stone-800 text-xs font-semibold"
                  title="Caretaker Dashboard"
                >
                  <User className="w-3.5 h-3.5 text-[#1B3B2B]" />
                  <span className="truncate max-w-[80px]">{caretaker.fullName?.split(' ')[0]}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#A84B29] hover:bg-[#7C3218] text-white font-bold text-xs shadow-sm transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-xs shadow-sm transition-all border border-[#C99E32]"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F0] border-t border-[#E5DFD5] px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            if (item.requireAuth && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-[#1B3B2B] text-white'
                    : 'text-stone-800 hover:bg-amber-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-600'}`} />
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B3B2B] text-white font-bold text-sm mt-2"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>Caretaker Login / Register</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
