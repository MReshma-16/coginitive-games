import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Award,
  Sparkles,
  RotateCcw,
  Volume2,
  TrendingUp,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { adaptiveEngine, DIFFICULTY_LEVELS } from '../services/adaptiveEngine';
import { GameScoreModal } from '../components/GameScoreModal';
import { VoiceButton } from '../components/VoiceButton';

// The 5 Specific Games
import { MemoryBasketGame } from '../components/games/MemoryBasketGame';
import { MyOldVillageGame } from '../components/games/MyOldVillageGame';
import { RhythmRecallGame } from '../components/games/RhythmRecallGame';
import { PatternMatchGame } from '../components/games/PatternMatchGame';
import { MemoryPathGame } from '../components/games/MemoryPathGame';

export const GamesHubPage = ({ initialGame = null, setActivePage }) => {
  const { t } = useLanguage();
  const { recordGameResult, patient } = usePatient();

  const [selectedGameId, setSelectedGameId] = useState(initialGame);
  const [activeScoreResult, setActiveScoreResult] = useState(null);
  const [gameStatsMap, setGameStatsMap] = useState({});

  const games = [
    {
      id: 'memory-basket',
      title: t.games?.memoryBasket || 'Memory Basket',
      nativeTitle: 'স্মৃতিৰ ডলা 🧺',
      icon: '🧺',
      desc: t.games?.memoryBasketDesc || 'Remember traditional objects in the bamboo basket before it closes.',
      component: MemoryBasketGame,
      focus: 'Visual Recall'
    },
    {
      id: 'my-old-village',
      title: t.games?.myOldVillage || 'My Old Village',
      nativeTitle: 'মোৰ পুৰণি গাঁও 🏡',
      icon: '🏡',
      desc: t.games?.myOldVillageDesc || 'Explore the traditional village scene and remember where items were placed.',
      component: MyOldVillageGame,
      focus: 'Spatial Memory'
    },
    {
      id: 'rhythm-recall',
      title: t.games?.rhythmRecall || 'Rhythm Recall',
      nativeTitle: 'সুৰ আৰু তাল 🥁',
      icon: '🥁',
      desc: t.games?.rhythmRecallDesc || 'Listen carefully to gentle bell and drum rhythms, then tap in order.',
      component: RhythmRecallGame,
      focus: 'Audio Sequence'
    },
    {
      id: 'pattern-match',
      title: t.games?.patternMatch || 'Traditional Pattern Match',
      nativeTitle: 'বয়ন আৰু চানেকি 🎨',
      icon: '🎨',
      desc: t.games?.patternMatchDesc || 'Recognize traditional North-Eastern textile weaves, motifs, and patterns.',
      component: PatternMatchGame,
      focus: 'Pattern Recognition'
    },
    {
      id: 'memory-path',
      title: t.games?.memoryPath || 'Memory Path',
      nativeTitle: 'স্মৃতিৰ বাট 🛤️',
      icon: '🛤️',
      desc: t.games?.memoryPathDesc || 'Follow the gentle steps across the village path and recreate the sequence.',
      component: MemoryPathGame,
      focus: 'Step Sequence'
    }
  ];

  useEffect(() => {
    refreshStats();
  }, [selectedGameId]);

  const refreshStats = () => {
    const map = {};
    games.forEach(g => {
      map[g.id] = adaptiveEngine.getGameData(g.id);
    });
    setGameStatsMap(map);
  };

  const currentGameObj = games.find(g => g.id === selectedGameId);
  const currentAdaptiveData = selectedGameId ? adaptiveEngine.getGameData(selectedGameId) : null;
  const currentDifficulty = currentAdaptiveData?.currentDifficulty || DIFFICULTY_LEVELS.EASY;

  const handleCompleteRound = async (roundStats) => {
    const adaptiveResult = adaptiveEngine.recordRoundResult(selectedGameId, roundStats);

    // Save to patient database via context API
    await recordGameResult({
      gameId: selectedGameId,
      gameName: currentGameObj?.title || 'Cognitive Game',
      category: 'Cognitive',
      score: adaptiveResult.roundRecord.percentageScore,
      accuracy: adaptiveResult.roundRecord.percentageScore,
      responseTimeMs: roundStats.timeTakenSeconds * 1000,
      difficulty: adaptiveResult.currentDifficulty === 'HARD' ? 3 : adaptiveResult.currentDifficulty === 'MEDIUM' ? 2 : 1,
      itemsCount: roundStats.totalQuestions
    });

    setActiveScoreResult(adaptiveResult);
    refreshStats();
  };

  const getBadgeClass = (level) => {
    switch (level) {
      case 'HARD':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Active Game Mode */}
        {selectedGameId && currentGameObj ? (
          <div className="space-y-6">
            {/* Simple Clean In-Game Bar */}
            <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
              <button
                onClick={() => setSelectedGameId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.games?.allGames || 'All Games'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentGameObj.icon}</span>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1B3B2B]">{currentGameObj.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeClass(currentDifficulty)}`}>
                  {currentDifficulty}
                </span>
              </div>

              <div className="text-xs text-stone-500 font-medium hidden sm:block">
                Immediate Adaptive Level
              </div>
            </div>

            {/* Game Canvas */}
            <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 sm:p-10 shadow-lg">
              {React.createElement(currentGameObj.component, {
                difficulty: currentDifficulty,
                onCompleteRound: handleCompleteRound
              })}
            </div>
          </div>
        ) : (
          /* Clean, Neat 5-Games Hub Grid */
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <span>🌿 CogniCare Activities</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
                {t.games?.headerTitle || 'Cognitive Games Suite'}
              </h1>

              <p className="text-stone-600 text-base">
                {t.games?.headerSubtitle || '5 peaceful activities with immediate Easy → Medium → Hard adaptive progression.'}
              </p>
            </div>

            {/* Games Grid (5 Games) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {games.map((g) => {
                const stats = gameStatsMap[g.id] || {};
                const level = stats.currentDifficulty || DIFFICULTY_LEVELS.EASY;
                const best = stats.bestScore || 0;

                return (
                  <div
                    key={g.id}
                    className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#C99E32] transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                          {g.icon}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeClass(level)}`}>
                          {level}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-xl text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                          {g.title}
                        </h3>
                        <span className="text-xs text-amber-800 font-medium">{g.nativeTitle}</span>
                      </div>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                        {g.desc}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-stone-100 mt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>Best: <strong className="text-stone-800">{best}%</strong></span>
                        <span>Level: <strong className="text-stone-800">{level}</strong></span>
                      </div>

                      <button
                        onClick={() => setSelectedGameId(g.id)}
                        className="w-full py-3 px-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 text-amber-300" />
                        <span>Play Activity</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Score & Adaptive Progression Modal */}
        <GameScoreModal
          isOpen={!!activeScoreResult}
          onClose={() => {
            setActiveScoreResult(null);
            setSelectedGameId(null);
          }}
          onPlayNextRound={() => {
            setActiveScoreResult(null);
          }}
          gameTitle={currentGameObj?.title || 'Cognitive Game'}
          resultData={activeScoreResult}
        />
      </div>
    </div>
  );
};
