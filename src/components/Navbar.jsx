import React, { useState } from 'react';
import {
  Home,
  User,
  HeartHandshake,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Navbar = ({ activePage, setActivePage }) => {
  const { currentLang, setLanguage, languages, t, currentLangObj } = useLanguage();
  const { caretaker, isAuthenticated, logout } = useAuth();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Items: Home, Dashboard, Progress, Settings, Help & Support
  const navItems = [
    { id: 'home', label: t.nav?.home || 'Home', icon: Home },
    { id: 'dashboard', label: t.nav?.dashboard || 'Dashboard', icon: HeartHandshake, requireAuth: true },
    { id: 'progress', label: t.nav?.progress || 'Progress', icon: BarChart3, requireAuth: true },
    { id: 'settings', label: t.nav?.settings || 'Settings', icon: Settings },
    { id: 'help', label: t.nav?.help || 'Help & Support', icon: HelpCircle }
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
      {/* Top Clean Minimalist Utility Bar */}
      <div className="w-full bg-[#1B3B2B] text-[#FAF7F0] px-3 sm:px-6 py-1.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Top Left: Clean soothing sparkle icon */}
          <div className="flex items-center gap-2 truncate">
            <span className="text-amber-400 text-sm">✨</span>
            <span className="truncate font-serif italic text-amber-200">
              {t.tagline || "when memories meet care"}
            </span>
          </div>

          {/* Top Right: Clean brand mark */}
          <div className="text-[11px] text-amber-200/80 font-medium">
            CogniCare Platform
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 cursor-pointer select-none group py-1"
          >
            <img
              src={logoImg}
              alt="CogniCare Logo"
              className="h-10 sm:h-11 object-contain hover:scale-102 transition-transform duration-200"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
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

          {/* Right Action Bar: Language Change, Username, Logout */}
          <div className="flex items-center gap-2">
            {/* Language Change Option with Name */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-[#1B3B2B] font-bold text-xs hover:border-[#C99E32] shadow-sm transition-all"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-serif hidden sm:inline">{currentLangObj.name}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#C99E32] rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase">
                    {t.hero?.chooseLanguage || "Select Language"}
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
                          <span className="font-serif">{lang.native}</span>
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

            {/* Username & Logout */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Username */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 text-stone-800 text-xs font-bold shadow-xs">
                  <User className="w-3.5 h-3.5 text-[#1B3B2B]" />
                  <span className="truncate max-w-[80px] sm:max-w-[100px]">{caretaker.fullName || 'User'}</span>
                </div>

                {/* Logout Option */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#A84B29] hover:bg-[#7C3218] text-white font-bold text-xs shadow-sm transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.nav?.logout || "Logout"}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-xs shadow-sm transition-all border border-[#C99E32]"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{t.nav?.login || "Login"}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F0] border-t border-[#E5DFD5] px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
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
              <span>{t.nav?.login || "Caretaker Login / Register"}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
