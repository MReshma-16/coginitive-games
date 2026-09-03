import React from 'react';
import { X, MapPin, Sparkles, Music, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from './VoiceButton';

export const CulturalAboutModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const states = [
    {
      name: "Assam",
      nativeName: "অসম",
      highlight: "Land of the Red River, Bihu dances, Kaziranga rhinos, and lustrous golden Muga silk.",
      image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80",
      tradition: "Rongali Bihu, Pepa horn, Mekhela Sador weaving, Pitha delicacies, Brahmaputra ferries."
    },
    {
      name: "Arunachal Pradesh",
      nativeName: "अरुणाचल प्रदेश",
      highlight: "Land of the Dawn-Lit Mountains, historic Tawang Monastery, and orchid-rich lush valleys.",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
      tradition: "Monpa wood carvings, Losar festival, pristine Himalayan mountain passes."
    },
    {
      name: "Manipur",
      nativeName: "মণিপুর",
      highlight: "Jewel of India, serene Loktak Lake with floating Phumdi islands, and classical Raas dance.",
      image: "https://images.unsplash.com/photo-1609137144822-4a7b52479e4a?auto=format&fit=crop&w=600&q=80",
      tradition: "Pena string music, Phanek handloom, Kangshoi stew, polo origins (Sagol Kangjei)."
    },
    {
      name: "Meghalaya",
      nativeName: "Meghalaya",
      highlight: "Abode of Clouds, century-old living root bridges of Cherrapunji, and pine-clad hills.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      tradition: "Duitara music, Jainsem attire, Nongkrem dance, crystal clear Umngot river."
    },
    {
      name: "Mizoram",
      nativeName: "Mizoram",
      highlight: "Land of rolling misty hills, energetic Cheraw bamboo dance, and close-knit community life.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      tradition: "Cheraw bamboo dance, Puan woven patterns, Chapchar Kut spring festival."
    },
    {
      name: "Nagaland",
      nativeName: "Nagaland",
      highlight: "Land of vibrant tribal festivals, rich warrior heritage, and intricately handwoven shawls.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      tradition: "Hornbill festival, log drums, Angami & Ao geometric shawls, Dzukou valley."
    },
    {
      name: "Tripura",
      nativeName: "ত্রিপুরা",
      highlight: "Historic land of royal Ujjayanta Palace, ancient Unakoti rock carvings, and exquisite cane crafts.",
      image: "https://images.unsplash.com/photo-1582650625119-3a31f8418365?auto=format&fit=crop&w=600&q=80",
      tradition: "Rignai weaving, Garia festival, bamboo and cane mora handicrafts."
    },
    {
      name: "Sikkim",
      nativeName: "सिक्किम",
      highlight: "Sacred land blessed by Mount Kangchenjunga, tranquil Buddhist monasteries, and organic serenity.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      tradition: "Lepcha Dumdyam attire, Rumtek monastery, steaming Momos and Thukpa."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF7F0] border-4 border-[#C99E32] rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1E432A]">
                {t.culture?.title || "Heritage of the 8 North-Eastern States"}
              </h2>
              <p className="text-sm text-stone-600">
                Honoring the diverse cultures, textiles, foods, and traditional games of North-East India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-all"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice */}
        <div className="my-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-emerald-950 font-medium">
            <strong>Memory Roots</strong> is culturally inspired by authentic childhood and community experiences from all eight sister states. Every activity is respectfully designed to evoke happy, familiar reminiscence for elders.
          </p>
        </div>

        {/* States Grid */}
        <div className="overflow-y-auto pr-2 space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {states.map((st) => (
              <div
                key={st.name}
                className="bg-white/90 border-2 border-amber-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-700" />
                      <h3 className="font-serif font-bold text-lg text-[#1E432A]">
                        {st.name} <span className="text-sm font-normal text-stone-500">({st.nativeName})</span>
                      </h3>
                    </div>
                    <VoiceButton textToRead={`${st.name}. ${st.highlight}`} />
                  </div>
                  <p className="text-sm text-stone-700 mb-3 leading-relaxed">{st.highlight}</p>
                </div>
                <div className="bg-amber-50/80 rounded-xl p-2.5 text-xs text-amber-900 border border-amber-200">
                  <strong>Cultural Roots:</strong> {st.tradition}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base transition-all border-2 border-[#C99E32]"
          >
            Close & Return to Memory Roots
          </button>
        </div>
      </div>
    </div>
  );
};
