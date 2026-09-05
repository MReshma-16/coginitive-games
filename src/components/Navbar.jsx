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
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer select-none group hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1B3B2B] to-[#244E38] text-white shadow-sm border border-[#C99E32]/50'
                      : 'text-stone-700 hover:text-[#1B3B2B] hover:bg-amber-50/80 hover:border hover:border-amber-200/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
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
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50/90 border border-stone-300 hover:border-[#C99E32] text-stone-800 font-bold text-xs shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-600 icon-spin-hover" />
                <span>🌿</span>
                <span className="font-sans font-bold">{currentLangObj.name}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-amber-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn backdrop-blur-md">
                  <div className="px-3.5 py-1 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
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
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs transition-all duration-150 cursor-pointer active:scale-98 ${
                          currentLang === lang.code
                            ? 'bg-gradient-to-r from-[#1B3B2B] to-[#244E38] text-white font-bold'
                            : 'text-stone-800 hover:bg-amber-50 font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span className="font-sans">{lang.native}</span>
                        </span>
                        <span className={`text-[10px] ${currentLang === lang.code ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
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
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FDE68A] to-amber-200 border border-amber-300 text-[#78350F] text-xs font-bold shadow-xs">
                  <User className="w-3.5 h-3.5 text-[#78350F]" />
                  <span className="truncate max-w-[100px]">{caretaker?.fullName || 'Caretaker'}</span>
                </div>

                {/* Logout Pill */}
                <button
                  onClick={handleLogout}
                  className="btn-danger flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 icon-slide-left" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('auth')}
                className="btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300 icon-slide-right" />
                <span>{t.nav?.login || "Caretaker Login"}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon md:hidden p-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-amber-50 hover:border-[#C99E32] shadow-xs"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F0] border-t border-[#E5DFD5] px-4 pt-2 pb-4 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            if (item.requireAuth && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-98 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1B3B2B] to-[#244E38] text-white shadow-sm border border-[#C99E32]/50'
                    : 'text-stone-800 hover:bg-amber-100/80'
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
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm mt-2"
            >
              <LogIn className="w-4 h-4 text-amber-300 icon-slide-right" />
              <span>{t.nav?.login || "Caretaker Login / Register"}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
