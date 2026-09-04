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
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { adaptiveEngine, DIFFICULTY_LEVELS } from '../services/adaptiveEngine';
import { GameScoreModal } from '../components/GameScoreModal';
import { VoiceButton } from '../components/VoiceButton';

// The 5 New Cognitive Games
import { WordSearchGame } from '../components/games/WordSearchGame';
import { OddOneOutGame } from '../components/games/OddOneOutGame';
import { LetterCWordGame } from '../components/games/LetterCWordGame';
import { CrosswordsGame } from '../components/games/CrosswordsGame';
import { JigsawPuzzleGame } from '../components/games/JigsawPuzzleGame';

export const GamesHubPage = ({ initialGame = null, setActivePage }) => {
  const { t } = useLanguage();
  const { recordGameResult, patient } = usePatient();

  const [selectedGameId, setSelectedGameId] = useState(initialGame);
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY');
  const [activeScoreResult, setActiveScoreResult] = useState(null);
  const [gameStatsMap, setGameStatsMap] = useState({});

  const games = [
    {
      id: 'alaska-word-search',
      title: t.games?.wordSearchTitle || 'Alaska Word Search',
      icon: '🌲',
      desc: t.games?.wordSearchDesc || 'Find hidden words in a grid of letters and improve concentration, visual attention, and word recognition.',
      skills: t.games?.wordSearchSkills || ['Memory', 'Attention', 'Word Recognition', 'Concentration'],
      component: WordSearchGame,
      focus: 'Visual Attention & Word Recognition'
    },
    {
      id: 'odd-one-out',
      title: t.games?.oddOneOutTitle || 'Find Odd One Out',
      icon: '🔍',
      desc: t.games?.oddOneOutDesc || 'Observe a group of similar objects and identify the one item that is different.',
      skills: t.games?.oddOneOutSkills || ['Visual Perception', 'Attention', 'Pattern Recognition', 'Concentration'],
      component: OddOneOutGame,
      focus: 'Visual Perception & Observation'
    },
    {
      id: 'letter-c-word',
      title: t.games?.letterCTitle || 'Letter C Word Game',
      icon: '🔤',
      desc: t.games?.letterCDesc || 'Find or create words beginning with the letter C to exercise vocabulary, language, and word recall.',
      skills: t.games?.letterCSkills || ['Vocabulary', 'Language', 'Word Recall', 'Memory'],
      component: LetterCWordGame,
      focus: 'Vocabulary & Word Recall'
    },
    {
      id: 'crosswords',
      title: t.games?.crosswordsTitle || 'Crosswords',
      icon: '📰',
      desc: t.games?.crosswordsDesc || 'Use clues to complete a crossword puzzle and exercise vocabulary, memory, reasoning, and language skills.',
      skills: t.games?.crosswordsSkills || ['Memory', 'Vocabulary', 'Reasoning', 'Language'],
      component: CrosswordsGame,
      focus: 'Language & Reasoning'
    },
    {
      id: 'jigsaw-puzzle',
      title: t.games?.jigsawTitle || 'Jigsaw Puzzle',
      icon: '🧩',
      desc: t.games?.jigsawDesc || 'Arrange puzzle pieces correctly to complete a picture and exercise visual-spatial thinking and concentration.',
      skills: t.games?.jigsawSkills || ['Visual-Spatial Reasoning', 'Pattern Recognition', 'Concentration', 'Problem-Solving'],
      component: JigsawPuzzleGame,
      focus: 'Visual-Spatial Thinking'
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

  const handleStartGame = (gameId, level) => {
    setSelectedGameId(gameId);
    setSelectedDifficulty(level || 'EASY');
  };

  const handleCompleteRound = async (roundStats) => {
    const adaptiveResult = adaptiveEngine.recordRoundResult(selectedGameId, roundStats);

    // Save to patient context & backend API
    await recordGameResult({
      gameId: selectedGameId,
      gameName: currentGameObj?.title || 'Cognitive Game',
      category: 'Cognitive',
      score: roundStats.score ?? adaptiveResult.roundRecord.percentageScore,
      accuracy: roundStats.accuracy ?? adaptiveResult.roundRecord.percentageScore,
      responseTimeMs: (roundStats.timeTakenSeconds || 5) * 1000,
      difficulty: selectedDifficulty === 'HARD' ? 3 : selectedDifficulty === 'MEDIUM' ? 2 : 1,
      itemsCount: roundStats.totalQuestions
    });

    setActiveScoreResult({
      ...adaptiveResult,
      currentDifficulty: selectedDifficulty,
      roundRecord: {
        ...adaptiveResult.roundRecord,
        score: roundStats.score ?? adaptiveResult.roundRecord.percentageScore,
        accuracy: roundStats.accuracy ?? adaptiveResult.roundRecord.percentageScore,
        correctAnswers: roundStats.correctAnswers,
        totalQuestions: roundStats.totalQuestions,
        timeTakenSeconds: roundStats.timeTakenSeconds
      }
    });

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
            {/* Clean In-Game Navigation Header */}
            <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
              <button
                onClick={() => setSelectedGameId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm border border-stone-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.games?.allGames || 'All Games'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentGameObj.icon}</span>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1B3B2B]">{currentGameObj.title}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeClass(selectedDifficulty)}`}>
                  {selectedDifficulty}
                </span>
              </div>

              {/* Difficulty Switcher during game */}
              <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
                {['EASY', 'MEDIUM', 'HARD'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedDifficulty === lvl
                        ? 'bg-[#1B3B2B] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Game Canvas */}
            <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 sm:p-10 shadow-lg">
              {React.createElement(currentGameObj.component, {
                difficulty: selectedDifficulty,
                onCompleteRound: handleCompleteRound,
                onExit: () => setSelectedGameId(null)
              })}
            </div>
          </div>
        ) : (
          /* Game Selection Hub Page (Section 1) */
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <span>🧠 Cognitive Stimulation Activities</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
                {t.games?.headerTitle || 'Cognitive Games Suite'}
              </h1>

              <p className="text-stone-600 text-base">
                {t.games?.headerSubtitle || '5 peaceful activities designed for concentration, vocabulary, and visual-spatial reasoning.'}
              </p>
            </div>

            {/* 5 Game Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((g) => {
                const stats = gameStatsMap[g.id] || {};
                const best = stats.bestScore || 0;

                return (
                  <div
                    key={g.id}
                    className="bg-white border-2 border-[#E5DFD5] hover:border-[#C99E32] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      {/* Icon & Focus Tag */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-xs">
                          {g.icon}
                        </div>
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-200">
                          {g.focus}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-serif font-bold text-xl text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                          {g.title}
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-1.5">
                          {g.desc}
                        </p>
                      </div>

                      {/* Cognitive Skills Supported Badges */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase text-stone-600 tracking-wider block">
                          Skills Supported:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {g.skills.map((sk, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/80"
                            >
                              • {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Difficulty Selection & Play Now Button */}
                    <div className="pt-5 border-t border-stone-100 mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-500">Difficulty:</span>
                        <div className="flex gap-1 text-xs">
                          {['EASY', 'MEDIUM', 'HARD'].map(lvl => (
                            <button
                              key={lvl}
                              onClick={() => handleStartGame(g.id, lvl)}
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] border cursor-pointer ${
                                lvl === 'HARD'
                                  ? 'hover:bg-rose-100 hover:text-rose-900 border-rose-200'
                                  : lvl === 'MEDIUM'
                                  ? 'hover:bg-amber-100 hover:text-amber-900 border-amber-200'
                                  : 'hover:bg-emerald-100 hover:text-emerald-900 border-emerald-200'
                              }`}
                            >
                              {lvl === 'EASY' ? '🟢 Easy' : lvl === 'MEDIUM' ? '🟡 Med' : '🔴 Hard'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartGame(g.id, 'EASY')}
                        className="w-full py-3.5 px-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 text-amber-300" />
                        <span>{t.games?.playNow || "Play Now"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Score & Completion Modal */}
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
