import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Utensils,
  Droplets,
  Pill,
  Calendar,
  Moon,
  Footprints,
  PhoneCall,
  Gamepad2
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../services/audioSynthesizer';
import { VoiceButton } from '../components/VoiceButton';

export const RemindersPage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { reminders, addReminder, deleteReminder, patient } = usePatient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meal');
  const [time, setTime] = useState('08:00');
  const [frequency, setFrequency] = useState('Daily');
  const [notes, setNotes] = useState('');

  // Simulated live alarm test
  const [activeAlarm, setActiveAlarm] = useState(null);

  const categories = [
    { name: 'Meal', label: t.reminders?.meal || 'Meal & Nutrition', icon: Utensils, color: 'text-amber-700 bg-amber-100' },
    { name: 'Water', label: t.reminders?.water || 'Hydration / Water', icon: Droplets, color: 'text-sky-700 bg-sky-100' },
    { name: 'Medication', label: t.reminders?.medication || 'Medication (Caretaker-Entered)', icon: Pill, color: 'text-rose-700 bg-rose-100' },
    { name: 'Doctor', label: t.reminders?.doctor || 'Doctor Visit', icon: Calendar, color: 'text-purple-700 bg-purple-100' },
    { name: 'Sleep', label: t.reminders?.sleep || 'Rest & Sleep', icon: Moon, color: 'text-indigo-700 bg-indigo-100' },
    { name: 'Exercise', label: t.reminders?.exercise || 'Gentle Walk', icon: Footprints, color: 'text-emerald-700 bg-emerald-100' },
    { name: 'Family Call', label: t.reminders?.familyCall || 'Family Call', icon: PhoneCall, color: 'text-pink-700 bg-pink-100' },
    { name: 'Memory Game', label: t.reminders?.memoryGame || 'Memory Session', icon: Gamepad2, color: 'text-amber-800 bg-amber-200' }
  ];

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!title.trim() || !time) return;

    await addReminder({
      title,
      category,
      time,
      frequency,
      notes
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  const handleTestChime = (rem) => {
    soundManager.playChime();
    setActiveAlarm(rem);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Caregiver Routine Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
              {t.reminders?.title || "Caregiver Reminders & Daily Routine"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-1">
              {t.reminders?.subtitle || "Set gentle reminders for meals, hydration, appointments, and caretaker-managed medications."}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-amber-300" />
            <span>{t.reminders?.addReminder || "Add New Reminder"}</span>
          </button>
        </div>

        {/* REQUIRED MEDICATION SAFETY CALLOUT (Requirement 14) */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
            <strong>Medication Safety Policy:</strong> {t.reminders?.medNotice || "Medication reminders reflect information entered directly by the caretaker. CogniCare never prescribes, calculates dosages, or adjusts pharmaceutical regimens."}
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#1E432A]">
            {t.reminders?.activeReminders || "Active Reminders Schedule"} ({reminders.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((rem) => {
              const catInfo = categories.find(c => c.name === rem.category) || categories[0];
              const Icon = catInfo.icon;
              return (
                <div
                  key={rem.id}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#C99E32] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${catInfo.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs uppercase font-bold text-stone-500">{rem.category}</span>
                          <div className="font-bold text-base text-stone-900">{rem.time} ({rem.frequency})</div>
                        </div>
                      </div>

                      <VoiceButton textToRead={`Reminder at ${rem.time}: ${rem.title}. ${rem.notes}`} />
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#1E432A] pt-1">
                      {rem.title}
                    </h3>

                    {rem.notes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        {rem.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-amber-50 mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTestChime(rem)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-semibold text-xs border border-amber-300"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-700" />
                      <span>Play Gentle Chime</span>
                    </button>

                    <button
                      onClick={() => deleteReminder(rem.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Reminder Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF7F0] border-4 border-[#C99E32] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl">
              <h3 className="font-serif font-bold text-2xl text-[#1E432A] mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-700" />
                <span>{t.reminders?.addReminder || "Add New Routine Reminder"}</span>
              </h3>

              <form onSubmit={handleCreateReminder} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Reminder Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Afternoon Fresh Coconut Water"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Caregiver Notes for Elder
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Warm reminder message to read aloud to the elder."
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live Reminder Alarm Alert Modal */}
        {activeAlarm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF7F0] border-4 border-[#C99E32] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-200 mx-auto flex items-center justify-center text-3xl animate-bounce">
                🔔
              </div>

              <h3 className="font-serif font-bold text-2xl text-[#1E432A]">
                Reminder: {activeAlarm.title}
              </h3>

              <p className="text-stone-700 text-base">
                {activeAlarm.notes || `Time for ${activeAlarm.title} (${activeAlarm.time}).`}
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setActiveAlarm(null)}
                  className="px-6 py-3 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow"
                >
                  Dismiss Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
