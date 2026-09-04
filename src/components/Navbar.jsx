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

  // Navigation Items matching Image 2
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5DFD5] shadow-xs">
      {/* Top Green Bar matching Image 2 */}
      <div className="w-full bg-[#132E20] text-[#FAF7F0] px-4 sm:px-8 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Top Left */}
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#FDE68A] text-xs">🌿</span>
            <span className="font-serif text-[#FDE68A] tracking-wide text-xs">
              when memories meet care
            </span>
          </div>

          {/* Top Right */}
          <div className="text-[11px] text-[#FDE68A] font-medium tracking-wide">
            CogniCare Platform
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center cursor-pointer select-none py-1"
          >
            <img
              src={logoImg}
              alt="CogniCare - when memories meet care"
              className="h-10 sm:h-11 object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1B3B2B] text-white shadow-xs'
                      : 'text-stone-700 hover:text-[#1B3B2B] hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Language Change, Username, Logout */}
          <div className="flex items-center gap-2">
            {/* Language Pill */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 font-medium text-xs hover:border-[#1B3B2B] shadow-xs transition-all cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-600" />
                <span>🌿</span>
                <span className="font-sans font-medium">{currentLangObj.name}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
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
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-[#1B3B2B] text-white font-bold'
                            : 'text-stone-800 hover:bg-amber-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span className="font-sans">{lang.native}</span>
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

            {/* Authenticated: Username & Logout Pills | Unauthenticated: Login Button Only */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Username Pill */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDE68A] border border-amber-300 text-[#78350F] text-xs font-bold shadow-xs">
                  <User className="w-3.5 h-3.5 text-[#78350F]" />
                  <span className="truncate max-w-[100px]">{caretaker?.fullName || 'Caretaker'}</span>
                </div>

                {/* Logout Pill */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-xs shadow-xs transition-all cursor-pointer border border-[#C99E32]"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.nav?.login || "Caretaker Login"}</span>
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
