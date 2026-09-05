import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Heart,
  Lock,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

export const AuthPage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { login, register, demoLogin } = useAuth();
  const { patient } = usePatient();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Password Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-stone-300' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: t.auth?.weak || 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: t.auth?.medium || 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: t.auth?.strong || 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegisterMode) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMsg(t.auth?.fillAllError || 'Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg(t.auth?.passMatchError || 'Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters long.');
        return;
      }

      setLoading(true);
      try {
        await register({
          fullName,
          email,
          phone,
          password,
          preferredLanguage: currentLang
        });
        setSuccessMsg('Account successfully created! Directing to patient setup...');
        setTimeout(() => {
          setActivePage('patient-setup');
        }, 800);
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMsg(t.auth?.fillAllError || 'Please enter your email and password.');
        return;
      }

      setLoading(true);
      try {
        const result = await login(email, password);
        setSuccessMsg('Signed in successfully! Loading dashboard...');
        setTimeout(() => {
          if (result.patient?.setupCompleted) {
            setActivePage('dashboard');
          } else {
            setActivePage('patient-setup');
          }
        }, 600);
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await demoLogin();
      setSuccessMsg('Signed in as Demo Caretaker (Dr. Ananya Sharma)');
      setTimeout(() => {
        setActivePage('dashboard');
      }, 500);
    } catch (e) {
      setErrorMsg('Demo sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#1E432A] text-amber-300 text-3xl shadow-md border-2 border-[#C99E32]">
            🌿
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1E432A]">
            {isRegisterMode
              ? (t.auth?.registerTitle || 'Create Caretaker Account')
              : (t.auth?.loginTitle || 'Caretaker Login')}
          </h2>
          <p className="text-sm text-stone-600">
            {isRegisterMode
              ? (t.auth?.registerSubtitle || 'Start personalizing memory exercises for your elder.')
              : (t.auth?.loginSubtitle || 'Manage daily memory activities and caregiver routine.')}
          </p>
        </div>

        {/* 1-Click Demo Button for immediate review */}
        <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-bold text-amber-900 mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instant Prototype Access</span>
          </div>
          <p className="text-xs text-stone-700 mb-3">
            Explore with pre-configured North-East elder profile and historical game data.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn-primary w-full py-3 px-4 rounded-2xl text-amber-200 font-bold text-sm border-2 border-[#C99E32] flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300 icon-spin-hover" />
            <span>{t.auth?.demoLoginBtn || '1-Click Demo Caretaker Login'}</span>
          </button>
        </div>

        {/* Main Form Box */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl p-3.5 flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl p-3.5 flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    {t.auth?.fullName || 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Ananya Sharma"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] focus:ring-2 focus:ring-amber-200 text-stone-900 text-base"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    {t.auth?.phone || 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] focus:ring-2 focus:ring-amber-200 text-stone-900 text-base"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">
                {t.auth?.email || 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="care@memoryroots.in"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] focus:ring-2 focus:ring-amber-200 text-stone-900 text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">
                {t.auth?.password || 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] focus:ring-2 focus:ring-amber-200 text-stone-900 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-800"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator for Registration */}
              {isRegisterMode && password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
                    <span>{t.auth?.passStrength || 'Password Strength'}:</span>
                    <span className="font-bold">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-stone-200'} flex-1`} />
                    <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-stone-200'} flex-1`} />
                    <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-stone-200'} flex-1`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Registration Only) */}
            {isRegisterMode && (
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">
                  {t.auth?.confirmPassword || 'Confirm Password'} *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] focus:ring-2 focus:ring-amber-200 text-stone-900 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-800"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Persistent Login & Remember Me (Requirement 1) */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E432A] focus:ring-amber-400"
                />
                <span className="text-xs sm:text-sm text-stone-700 font-medium">
                  {t.auth?.rememberMe || 'Keep me signed in (Persistent Login)'}
                </span>
              </label>

              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => alert('For this prototype, use the 1-Click Demo login or re-create your account.')}
                  className="text-xs text-[#A84B29] font-bold hover:underline"
                >
                  {t.auth?.forgotPassword || 'Forgot?'}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 px-4 rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 mt-4"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-5 h-5 text-amber-300 icon-slide-right" />
                  <span>{t.auth?.registerBtn || 'Create Caretaker Account'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-amber-300 icon-slide-right" />
                  <span>{t.auth?.loginBtn || 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="btn-pill px-4 py-1.5 text-sm font-bold text-[#A84B29] hover:text-[#7C3218] hover:bg-amber-100/70"
            >
              {isRegisterMode
                ? (t.auth?.haveAccount || 'Already have an account? Sign In')
                : (t.auth?.needAccount || 'New caretaker? Create Account')}
            </button>
          </div>
        </div>

        {/* Security & Persistent Session Notice */}
        <div className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sessions remain secure and active until you explicitly click "Logout".</span>
        </div>
      </div>
    </div>
  );
};
