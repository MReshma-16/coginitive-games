import React, { useState } from 'react';
import {
  User,
  Heart,
  MapPin,
  Utensils,
  Music,
  Gamepad2,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from '../components/VoiceButton';

const NE_STATES = [
  'Assam',
  'Arunachal Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Tripura',
  'Sikkim'
];

export const PatientSetupPage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { patient, savePatientSetup } = usePatient();

  const [name, setName] = useState(patient?.name || 'Biren Sharma');
  const [age, setAge] = useState(patient?.age || 74);
  const [gender, setGender] = useState(patient?.gender || 'Male');
  const [state, setState] = useState(patient?.state || 'Assam');
  const [relationship, setRelationship] = useState(patient?.relationship || 'Father');

  const [favActivities, setFavActivities] = useState(
    patient?.favoriteActivities?.join(', ') || 'Morning balcony tea, Listening to Bihu songs, Gardening orchids, Verandah bird watching'
  );
  const [favFoods, setFavFoods] = useState(
    patient?.favoriteFoods?.join(', ') || 'Assamese Pitha & Laru, Masor Tenga, Hot Dudh Cha, Khar'
  );
  const [favSongs, setFavSongs] = useState(
    patient?.favoriteSongs?.join(', ') || 'Bihu Pepa melodies, Bhupen Hazarika classics, Goalpariya folk'
  );
  const [favPlaces, setFavPlaces] = useState(
    patient?.favoritePlaces?.join(', ') || 'Majuli Island ghats, Tezpur ancestral courtyard, Shillong hills'
  );
  const [childhoodHobbies, setChildhoodHobbies] = useState(
    patient?.childhoodHobbies?.join(', ') || 'Five Stones (Guti), Marbles (Goli), Spinning Top (Latum), Kite flying'
  );
  const [familyMembers, setFamilyMembers] = useState(
    patient?.importantFamilyMembers?.join(', ') || 'Daughter Ananya, Son Debojit, Granddaughter Rhea (Little Pari)'
  );
  const [dailyRoutine, setDailyRoutine] = useState(
    patient?.dailyRoutine || 'Wakes at 6:30 AM, tea & garden stroll, memory game at 10 AM, lunch at 1 PM, evening family call at 5:30 PM.'
  );
  const [preferredTime, setPreferredTime] = useState(
    patient?.preferredTimeForActivities || 'Morning (9 AM - 11 AM)'
  );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const setupData = {
      name,
      age: parseInt(age, 10) || 72,
      gender,
      preferredLanguage: currentLang,
      state,
      relationship,
      favoriteActivities: favActivities.split(',').map(s => s.trim()).filter(Boolean),
      favoriteFoods: favFoods.split(',').map(s => s.trim()).filter(Boolean),
      favoriteSongs: favSongs.split(',').map(s => s.trim()).filter(Boolean),
      favoritePlaces: favPlaces.split(',').map(s => s.trim()).filter(Boolean),
      childhoodHobbies: childhoodHobbies.split(',').map(s => s.trim()).filter(Boolean),
      traditionalGames: childhoodHobbies.split(',').map(s => s.trim()).filter(Boolean),
      importantFamilyMembers: familyMembers.split(',').map(s => s.trim()).filter(Boolean),
      dailyRoutine,
      preferredTimeForActivities: preferredTime
    };

    try {
      await savePatientSetup(setupData);
      setActivePage('questionnaire');
    } catch (err) {
      console.error(err);
      setActivePage('questionnaire');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-stone-800 text-sm font-bold">
            <span>👴</span>
            <span>Step 1 of 2: Patient Profile</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
            {t.patientSetup?.title || "Let's Get to Know the Patient"}
          </h1>

          <p className="text-stone-700 max-w-2xl mx-auto text-base leading-relaxed">
            {t.patientSetup?.desc || "Please answer a few simple questions about the elderly person. This information helps us personalize memory activities and reminders."}
          </p>

          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead={`${t.patientSetup?.title}. ${t.patientSetup?.desc}`}
              label="Listen to Instructions"
            />
          </div>
        </div>

        {/* Gentle Respectful Disclaimer */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
          <Info className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-950 leading-relaxed font-medium">
            <strong>Respectful Care Notice:</strong> We do not ask sensitive medical records. Every preference you enter here is used to evoke fond childhood memories and tailor enjoyable traditional games.
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          {/* Section 1: Basic Person Info */}
          <div className="border-b border-amber-100 pb-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#1E432A] flex items-center gap-2">
              <User className="w-5 h-5 text-amber-700" />
              <span>Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">
                  {t.patientSetup?.patientName || "Patient Name / Fond Nickname"} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Biren Sharma (Aita / Koka)"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    {t.patientSetup?.age || "Age"} *
                  </label>
                  <input
                    type="number"
                    required
                    min="40"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    {t.patientSetup?.gender || "Gender"}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 bg-white"
                  >
                    <option value="Male">{t.patientSetup?.male || "Male"}</option>
                    <option value="Female">{t.patientSetup?.female || "Female"}</option>
                    <option value="Other">{t.patientSetup?.other || "Other"}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>{t.patientSetup?.state || "Home State in North-East"}</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 bg-white"
                >
                  {NE_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">
                  {t.patientSetup?.relationship || "Relationship with Caretaker"}
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Father, Mother, Uncle, Grandparent"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cultural Favorites & Childhood Memories */}
          <div className="border-b border-amber-100 pb-6 space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#1E432A] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>Cherished Cultural Favorites</span>
            </h3>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-700" />
                <span>{t.patientSetup?.favFoods || "Favorite Traditional Foods (comma-separated)"}</span>
              </label>
              <input
                type="text"
                value={favFoods}
                onChange={(e) => setFavFoods(e.target.value)}
                placeholder="e.g. Pitha & Laru, Masor Tenga, Thukpa, Momos, Khar"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-700" />
                <span>{t.patientSetup?.favSongs || "Favorite Folk Songs & Melodies"}</span>
              </label>
              <input
                type="text"
                value={favSongs}
                onChange={(e) => setFavSongs(e.target.value)}
                placeholder="e.g. Bihu Naam on Pepa, Goalpariya Lokageet, Khasi folk"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-amber-700" />
                <span>{t.patientSetup?.childhoodHobbies || "Childhood Hobbies & Traditional Games"}</span>
              </label>
              <input
                type="text"
                value={childhoodHobbies}
                onChange={(e) => setChildhoodHobbies(e.target.value)}
                placeholder="e.g. Five Stones (Guti), Marbles, Spinning Top (Latum), Kite flying"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-700" />
                <span>{t.patientSetup?.familyMembers || "Important Family Members & Grandchildren"}</span>
              </label>
              <input
                type="text"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                placeholder="e.g. Daughter Ananya, Granddaughter Rhea, Son Debojit"
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
              />
            </div>
          </div>

          {/* Section 3: Daily Routine & Preferred Time */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#1E432A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Daily Routine & Activity Comfort</span>
            </h3>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">
                {t.patientSetup?.dailyRoutine || "Comfortable Daily Routine"}
              </label>
              <textarea
                rows={2}
                value={dailyRoutine}
                onChange={(e) => setDailyRoutine(e.target.value)}
                placeholder="e.g. Morning tea, light garden stroll, games at 10 AM, evening family call"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">
                {t.patientSetup?.preferredTime || "Preferred Time for Memory Activities"}
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 bg-white"
              >
                <option value="Morning (9 AM - 11 AM)">{t.patientSetup?.morning || "Morning (9 AM - 11 AM)"}</option>
                <option value="Afternoon (3 PM - 5 PM)">{t.patientSetup?.afternoon || "Afternoon (3 PM - 5 PM)"}</option>
                <option value="Evening (5 PM - 7 PM)">{t.patientSetup?.evening || "Evening (5 PM - 7 PM)"}</option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3"
            >
              <span>{t.patientSetup?.saveBtn || "Save & Continue to Questionnaire"}</span>
              <ArrowRight className="w-6 h-6 text-amber-300 icon-slide-right" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
