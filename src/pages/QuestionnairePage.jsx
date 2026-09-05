import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Heart,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from '../components/VoiceButton';

export const QuestionnairePage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { submitQuestionnaire } = usePatient();

  const [answers, setAnswers] = useState({
    recentMemory: 'Sometimes',
    dailyActivities: 'Sometimes',
    familiarPeople: 'Never',
    familiarPlaces: 'Never',
    mood: 'Happy',
    sleep: 'Good',
    socialInteraction: 'Yes'
  });

  const [submitting, setSubmitting] = useState(false);

  const handleOptionSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuestionnaire(answers);
      setActivePage('memory-profile');
    } catch (err) {
      console.error(err);
      setActivePage('memory-profile');
    } finally {
      setSubmitting(false);
    }
  };

  const frequencyOptions = [
    { label: t.questionnaire?.never || 'Never', value: 'Never' },
    { label: t.questionnaire?.sometimes || 'Sometimes', value: 'Sometimes' },
    { label: t.questionnaire?.often || 'Often', value: 'Often' },
    { label: t.questionnaire?.veryOften || 'Very Often', value: 'Very Often' }
  ];

  const moodOptions = [
    { label: t.questionnaire?.happy || 'Happy 😊', value: 'Happy', icon: '😊' },
    { label: t.questionnaire?.good || 'Good 🙂', value: 'Good', icon: '🙂' },
    { label: t.questionnaire?.okay || 'Okay 😐', value: 'Okay', icon: '😐' },
    { label: t.questionnaire?.worried || 'Worried 😟', value: 'Worried', icon: '😟' },
    { label: t.questionnaire?.sad || 'Sad 😔', value: 'Sad', icon: '😔' }
  ];

  const sleepOptions = [
    { label: t.questionnaire?.good || 'Good', value: 'Good' },
    { label: t.questionnaire?.okay || 'Average', value: 'Average' },
    { label: t.questionnaire?.poor || 'Poor', value: 'Poor' }
  ];

  const socialOptions = [
    { label: t.questionnaire?.yes || 'Yes', value: 'Yes' },
    { label: t.questionnaire?.sometimes || 'Sometimes', value: 'Sometimes' },
    { label: t.questionnaire?.no || 'No', value: 'No' }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-sm font-bold">
            <span>🌿</span>
            <span>Step 2 of 2: Daily Comfort Questionnaire</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
            {t.questionnaire?.title || "How Has Your Day Been?"}
          </h1>

          <p className="text-stone-700 max-w-2xl mx-auto text-base sm:text-lg">
            {t.questionnaire?.subtitle || "Gentle support questions to understand daily comfort and personalize memory exercises."}
          </p>

          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead={`${t.questionnaire?.title}. ${t.questionnaire?.subtitle}`}
              label="Listen to Introduction"
            />
          </div>
        </div>

        {/* REQUIRED MEDICAL SAFETY DISCLAIMER BOX (Requirements 5 & 6) */}
        <div className="bg-amber-50 border-3 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base md:text-lg">
            <ShieldAlert className="w-6 h-6 text-amber-700 flex-shrink-0" />
            <span>Important Medical Safety Notice</span>
          </div>
          <p className="text-stone-800 text-sm md:text-base leading-relaxed">
            {t.questionnaire?.disclaimer || "Your answers help us personalize activities and understand which types of memory exercises may be comfortable for the patient. This is NOT a medical diagnosis."}
          </p>
          <p className="text-stone-700 text-xs md:text-sm italic pt-1 border-t border-amber-200">
            If you are concerned about changes in memory or daily functioning, please consider discussing them with a qualified healthcare professional.
          </p>
        </div>

        {/* Interactive Gentle Questionnaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Q1: Recent Memory */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">1. Memory</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E432A] mt-0.5">
                  {t.questionnaire?.q1 || "Do you sometimes forget things that happened recently?"}
                </h3>
              </div>
              <VoiceButton textToRead={t.questionnaire?.q1 || "Do you sometimes forget things that happened recently?"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {frequencyOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleOptionSelect('recentMemory', opt.value)}
                  className={`py-3.5 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center ${
                    answers.recentMemory === opt.value
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Daily Activities */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">2. Daily Activities</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E432A] mt-0.5">
                  {t.questionnaire?.q2 || "Do you sometimes need help remembering your daily activities?"}
                </h3>
              </div>
              <VoiceButton textToRead={t.questionnaire?.q2 || "Do you sometimes need help remembering your daily activities?"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {frequencyOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleOptionSelect('dailyActivities', opt.value)}
                  className={`py-3.5 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center ${
                    answers.dailyActivities === opt.value
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3: Familiar People */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">3. Familiar People</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E432A] mt-0.5">
                  {t.questionnaire?.q3 || "Do you sometimes have difficulty remembering the names of familiar people?"}
                </h3>
              </div>
              <VoiceButton textToRead={t.questionnaire?.q3 || "Do you sometimes have difficulty remembering the names of familiar people?"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {frequencyOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleOptionSelect('familiarPeople', opt.value)}
                  className={`py-3.5 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center ${
                    answers.familiarPeople === opt.value
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q4: Places */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">4. Places</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E432A] mt-0.5">
                  {t.questionnaire?.q4 || "Do you sometimes feel confused about familiar places?"}
                </h3>
              </div>
              <VoiceButton textToRead={t.questionnaire?.q4 || "Do you sometimes feel confused about familiar places?"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {frequencyOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleOptionSelect('familiarPlaces', opt.value)}
                  className={`py-3.5 px-3 rounded-2xl border-2 font-bold text-base transition-all text-center ${
                    answers.familiarPlaces === opt.value
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q5: Mood */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">5. Mood & Spirit</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1E432A] mt-0.5">
                  {t.questionnaire?.q5 || "How are you feeling today?"}
                </h3>
              </div>
              <VoiceButton textToRead={t.questionnaire?.q5 || "How are you feeling today?"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {moodOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => handleOptionSelect('mood', opt.value)}
                  className={`py-3 px-2 rounded-2xl border-2 font-bold text-base transition-all flex flex-col items-center gap-1 ${
                    answers.mood === opt.value
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                  }`}
                >
                  <span className="text-3xl">{opt.icon}</span>
                  <span className="text-sm font-semibold">{opt.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Q6 & Q7: Sleep & Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Q6: Sleep */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">6. Rest & Sleep</span>
                  <h3 className="text-lg font-serif font-bold text-[#1E432A] mt-0.5">
                    {t.questionnaire?.q6 || "How was your sleep recently?"}
                  </h3>
                </div>
                <VoiceButton textToRead={t.questionnaire?.q6 || "How was your sleep recently?"} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {sleepOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleOptionSelect('sleep', opt.value)}
                    className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all text-center ${
                      answers.sleep === opt.value
                        ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q7: Social */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">7. Social Connection</span>
                  <h3 className="text-lg font-serif font-bold text-[#1E432A] mt-0.5">
                    {t.questionnaire?.q7 || "Do you enjoy talking with family or friends?"}
                  </h3>
                </div>
                <VoiceButton textToRead={t.questionnaire?.q7 || "Do you enjoy talking with family or friends?"} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {socialOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleOptionSelect('socialInteraction', opt.value)}
                    className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all text-center ${
                      answers.socialInteraction === opt.value
                        ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-amber-300 icon-spin-hover" />
              <span>{t.questionnaire?.submitBtn || "Generate Memory Activity Profile"}</span>
              <ArrowRight className="w-6 h-6 text-amber-300 icon-slide-right" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
