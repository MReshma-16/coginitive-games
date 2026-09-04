import React from 'react';
import {
  User,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Edit3,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Utensils,
  Music,
  Smile,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';

export const DashboardPage = ({ setActivePage }) => {
  const { t, currentLangObj } = useLanguage();
  const { caretaker } = useAuth();
  const { patient } = usePatient();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Simple Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>🌿 Caretaker Dashboard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
            Profiles & Family Overview
          </h1>

          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            Manage your caretaker credentials and your family elder's personalized background.
          </p>
        </div>

        {/* 2 Profile Cards Grid: Caretaker Profile & Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. CARETAKER PROFILE CARD */}
          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 text-[#1B3B2B] flex items-center justify-center text-3xl font-serif font-bold shadow-xs">
                  {caretaker?.fullName?.charAt(0) || 'C'}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    Active Caretaker
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B] mt-1">
                    {caretaker?.fullName || 'Dr. Ananya Sharma'}
                  </h2>
                  <span className="text-xs text-stone-500">Registered Family Caregiver</span>
                </div>
              </div>

              {/* Caretaker Details List */}
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-4 h-4 text-[#1B3B2B]" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{caretaker?.email || 'care@cognicare.in'}</strong>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-4 h-4 text-[#1B3B2B]" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{caretaker?.phone || '+91 98765 43210'}</strong>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Heart className="w-4 h-4 text-[#1B3B2B]" />
                    <span className="font-medium">Relationship:</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{patient?.relationship || 'Daughter'}</strong>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <span className="text-sm">🌐</span>
                    <span className="font-medium">Language:</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{currentLangObj?.name || 'English'} ({currentLangObj?.flag})</strong>
                </div>
              </div>
            </div>

            {/* Caretaker Action */}
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => setActivePage('patient-setup')}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-300 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4 text-stone-700" />
                <span>Update Caretaker Settings</span>
              </button>
            </div>
          </div>

          {/* 2. PATIENT PROFILE CARD */}
          <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Card Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-amber-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 text-[#1B3B2B] flex items-center justify-center text-3xl shadow-xs">
                  👴
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Elderly Patient
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B] mt-1">
                    {patient?.name || 'Biren Sharma'}
                  </h2>
                  <span className="text-xs text-stone-500 font-medium">
                    {patient?.age || 74} years old • {patient?.gender || 'Male'} • {patient?.state || 'Assam'}
                  </span>
                </div>
              </div>

              {/* Patient Details List */}
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-[#A84B29]" />
                    <span className="font-medium">Home Region:</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{patient?.state || 'Assam (Tezpur)'}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-700 text-xs font-medium">
                    <Utensils className="w-3.5 h-3.5 text-amber-700" />
                    <span>Favorite North-East Foods:</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 leading-snug">
                    {Array.isArray(patient?.favoriteFoods)
                      ? patient.favoriteFoods.slice(0, 3).join(', ')
                      : 'Assamese Pitha, Masor Tenga, Khar'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-700 text-xs font-medium">
                    <Music className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Favorite Folk Songs & Melodies:</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 leading-snug">
                    {Array.isArray(patient?.favoriteSongs)
                      ? patient.favoriteSongs.slice(0, 3).join(', ')
                      : 'Bihu Naam on Pepa, Goalpariya Lokageet'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-700 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>Daily Routine:</span>
                  </div>
                  <p className="text-xs text-stone-800 leading-snug">
                    {patient?.dailyRoutine || 'Morning tea on verandah, light memory games, afternoon rest, evening family call.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Action Buttons */}
            <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setActivePage('patient-setup')}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Edit Patient Profile</span>
              </button>

              <button
                onClick={() => setActivePage('questionnaire')}
                className="py-3 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-xs border border-amber-300 transition-all flex items-center justify-center gap-1.5"
              >
                <Smile className="w-4 h-4 text-amber-800" />
                <span>Daily Check-in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
