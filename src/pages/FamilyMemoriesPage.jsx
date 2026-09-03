import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  CheckCircle2,
  Heart,
  Play,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../services/audioSynthesizer';
import { voiceAssistant } from '../services/voiceAssistant';
import { aiService } from '../services/aiService';
import { CelebrationModal } from '../components/CelebrationModal';
import { VoiceButton } from '../components/VoiceButton';

export const FamilyMemoriesPage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { familyMemories, addFamilyMemory, deleteFamilyMemory, patient } = usePatient();

  const [activeQuizMemory, setActiveQuizMemory] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);

  // Add memory modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Family Gathering');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPerson, setNewPerson] = useState('');

  const sampleImages = [
    { label: 'Courtyard Bihu Celebration', url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Ancestral Wooden Home & Verandah', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' },
    { label: 'Brahmaputra Riverbank at Sunset', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleStartQuiz = (memory) => {
    setActiveQuizMemory(memory);
    setCurrentQIndex(0);
    setSelectedOption(null);
  };

  const handleAnswerOption = (opt) => {
    setSelectedOption(opt);
    soundManager.playTap();

    const currentQ = activeQuizMemory.questions[currentQIndex];
    if (opt === currentQ.correctOption) {
      setTimeout(() => {
        if (currentQIndex + 1 < activeQuizMemory.questions.length) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOption(null);
        } else {
          setCelebrationData({
            score: 100,
            accuracy: 100,
            gameTitle: `Family Memory: ${activeQuizMemory.title}`,
            encouragement: 'Wonderful recollection of family memories!'
          });
        }
      }, 700);
    } else {
      voiceAssistant.speak(currentQ.hint || "Take your time and look closely at the picture.", currentLang);
    }
  };

  const handleCreateMemory = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const generatedQs = aiService.generatePhotoQuestions(newTitle, newCategory, newPerson);

    await addFamilyMemory({
      title: newTitle,
      category: newCategory,
      imageUrl: newImageUrl,
      description: newDesc,
      personOrPlace: newPerson || 'Family Gathering',
      questions: generatedQs
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewImageUrl('');
    setNewDesc('');
    setNewPerson('');
  };

  const currentQuizQ = activeQuizMemory?.questions?.[currentQIndex];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Personalized Reminiscence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
              {t.family?.title || "Family Memories & Stories"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-1">
              {t.family?.subtitle || "Upload personal family photos. The AI creates gentle, heartwarming questions to stimulate familiar recognition."}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-amber-300" />
            <span>{t.family?.uploadNew || "Upload New Photograph"}</span>
          </button>
        </div>

        {/* Active Quiz View */}
        {activeQuizMemory && currentQuizQ ? (
          <div className="bg-white border-2 border-[#C99E32] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <h3 className="font-serif font-bold text-xl text-[#1E432A]">
                  {activeQuizMemory.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizMemory(null)}
                className="text-sm font-bold text-stone-600 hover:text-stone-900 underline"
              >
                Back to Gallery
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Photo */}
              <div className="rounded-3xl overflow-hidden border-4 border-amber-200 shadow-md">
                <img
                  src={activeQuizMemory.imageUrl}
                  alt={activeQuizMemory.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="bg-amber-50 p-3 text-xs text-stone-700 italic border-t border-amber-200">
                  {activeQuizMemory.description}
                </div>
              </div>

              {/* Question & Options */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Question {currentQIndex + 1} of {activeQuizMemory.questions.length}
                    </span>
                    <h4 className="font-serif font-bold text-xl text-[#1E432A] mt-1">
                      {currentQuizQ.questionText}
                    </h4>
                  </div>
                  <VoiceButton textToRead={currentQuizQ.questionText} />
                </div>

                <div className="space-y-2.5 pt-2">
                  {currentQuizQ.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentQuizQ.correctOption;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswerOption(opt)}
                        className={`w-full p-4 rounded-2xl border-2 font-bold text-base transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                              : 'bg-rose-50 border-rose-400 text-rose-950'
                            : 'bg-stone-50 border-stone-300 hover:bg-amber-50 hover:border-amber-400 text-stone-900'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {currentQuizQ.hint && (
                  <p className="text-xs text-stone-500 italic pt-2">
                    💡 Hint: {currentQuizQ.hint}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Memories Gallery Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white border-2 border-amber-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#C99E32] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E432A]/90 backdrop-blur-sm text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/40">
                      {mem.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-[#1E432A]">
                        {mem.title}
                      </h3>
                      <VoiceButton textToRead={`${mem.title}. ${mem.description}`} />
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {mem.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-amber-50 mt-2">
                  <button
                    onClick={() => handleStartQuiz(mem)}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm border border-[#C99E32] shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-4 h-4 text-amber-300" />
                    <span>{t.family?.playMemoryQuiz || "Start Memory Quiz"}</span>
                  </button>

                  <button
                    onClick={() => deleteFamilyMemory(mem.id)}
                    className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                    title="Remove Memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Memory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF7F0] border-4 border-[#C99E32] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl">
              <h3 className="font-serif font-bold text-2xl text-[#1E432A] mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <span>{t.family?.uploadNew || "Add New Family Photograph"}</span>
              </h3>

              <form onSubmit={handleCreateMemory} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    {t.family?.photoTitle || "Memory Title"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Granddaughter's 5th Birthday in Courtyard"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Image URL or Pick Sample Photo *
                  </label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sampleImages.map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewImageUrl(s.url)}
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 border border-amber-300"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Who is in this photo / Place?
                  </label>
                  <input
                    type="text"
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    placeholder="e.g. Granddaughter Rhea & Daughter Ananya"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-stone-300 focus:border-[#C99E32] text-stone-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Warm memory of laughing and dancing during Rongali Bihu."
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
                    Save & Generate AI Questions
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Celebration Modal */}
        <CelebrationModal
          isOpen={!!celebrationData}
          onClose={() => {
            setCelebrationData(null);
            setActiveQuizMemory(null);
          }}
          onPlayAgain={() => {
            setCelebrationData(null);
            setCurrentQIndex(0);
          }}
          onNext={() => {
            setCelebrationData(null);
            setActiveQuizMemory(null);
          }}
          score={celebrationData?.score}
          accuracy={celebrationData?.accuracy}
          gameTitle={celebrationData?.gameTitle}
          encouragement={celebrationData?.encouragement}
        />
      </div>
    </div>
  );
};
