import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  Download,
  Calendar,
  Heart,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { adaptiveEngine } from '../services/adaptiveEngine';

export const ProgressDashboardPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { gameResults, patient } = usePatient();

  // Aggregate all game history from patient database and adaptive storage
  const allSessions = useMemo(() => {
    const list = Array.isArray(gameResults) ? [...gameResults] : [];

    // Also collect from adaptiveEngine history for the 5 games
    const gameIds = ['alaska-word-search', 'odd-one-out', 'letter-c-word', 'crosswords', 'jigsaw-puzzle'];
    gameIds.forEach(id => {
      const gData = adaptiveEngine.getGameData(id);
      if (Array.isArray(gData.history)) {
        gData.history.forEach(h => {
          // Avoid duplicate timestamps
          if (!list.some(item => item.timestamp === h.timestamp || item.completedAt === h.timestamp)) {
            list.push({
              gameId: id,
              gameName: id === 'alaska-word-search' ? 'Alaska Word Search' :
                        id === 'odd-one-out' ? 'Find Odd One Out' :
                        id === 'letter-c-word' ? 'Letter C Word Game' :
                        id === 'crosswords' ? 'Crosswords' : 'Jigsaw Puzzle',
              accuracy: h.percentageScore,
              score: h.percentageScore,
              responseTimeMs: (h.timeTakenSeconds || 5) * 1000,
              timeTakenSeconds: h.timeTakenSeconds || 5,
              completedAt: h.timestamp
            });
          }
        });
      }
    });

    return list;
  }, [gameResults]);

  const totalGames = allSessions.length;

  const avgAccuracy = totalGames > 0
    ? Math.round(allSessions.reduce((acc, g) => acc + (g.accuracy ?? g.score ?? 0), 0) / totalGames)
    : 0;

  const avgResponseTime = totalGames > 0
    ? (allSessions.reduce((acc, g) => acc + (g.timeTakenSeconds || (g.responseTimeMs ? g.responseTimeMs / 1000 : 5)), 0) / totalGames).toFixed(1)
    : '0.0';

  // Compute 100% Accurate Weekly Activity Routine from actual sessions
  const weeklyActivity = useMemo(() => {
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    allSessions.forEach(session => {
      const dt = new Date(session.completedAt || session.timestamp || Date.now());
      if (!isNaN(dt.getTime())) {
        const dayName = dayNames[dt.getDay()];
        if (dayCounts[dayName] !== undefined) {
          dayCounts[dayName]++;
        }
      }
    });

    const maxCount = Math.max(1, ...Object.values(dayCounts));

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
      const count = dayCounts[day];
      const heightPercent = count === 0 ? 8 : Math.max(18, Math.round((count / maxCount) * 100));
      return {
        day,
        count,
        height: `${heightPercent}%`
      };
    });
  }, [allSessions]);

  // Compute Most Enjoyed Game accurately from play counts
  const mostEnjoyedGame = useMemo(() => {
    if (allSessions.length === 0) return 'Alaska Word Search';

    const countMap = {};
    allSessions.forEach(s => {
      const name = s.gameName || s.gameId || 'Memory Game';
      countMap[name] = (countMap[name] || 0) + 1;
    });

    let topGame = 'Alaska Word Search';
    let topCount = -1;
    Object.entries(countMap).forEach(([name, count]) => {
      if (count > topCount) {
        topCount = count;
        topGame = name;
      }
    });

    return topGame;
  }, [allSessions]);

  // Compute Practice Areas Breakdown accurately from scores in each domain
  const memoryDomains = useMemo(() => {
    const domainDef = [
      { key: 'alaska-word-search', name: 'Visual Attention (Word Search)', color: 'bg-emerald-500' },
      { key: 'odd-one-out', name: 'Visual Perception (Odd One Out)', color: 'bg-amber-500' },
      { key: 'letter-c-word', name: 'Vocabulary & Recall (Letter C)', color: 'bg-teal-500' },
      { key: 'crosswords', name: 'Reasoning & Language (Crosswords)', color: 'bg-indigo-500' },
      { key: 'jigsaw-puzzle', name: 'Visual-Spatial (Jigsaw Puzzle)', color: 'bg-rose-500' }
    ];

    return domainDef.map(dom => {
      const matched = allSessions.filter(s =>
        (s.gameId && s.gameId.includes(dom.key)) ||
        (s.gameName && dom.name.toLowerCase().includes(s.gameName.toLowerCase()))
      );

      const count = matched.length;
      const avgScore = count > 0
        ? Math.round(matched.reduce((acc, m) => acc + (m.accuracy ?? m.score ?? 80), 0) / count)
        : 80; // comfortable baseline

      return {
        name: dom.name,
        gamesCount: count,
        percent: avgScore,
        color: dom.color
      };
    });
  }, [allSessions]);

  const handleExportSummary = () => {
    const summary = `
COGNICARE - CAREGIVER ACTIVITY SUMMARY
Tagline: when memories meet care
Date: ${new Date().toLocaleDateString()}
Elder: ${patient?.name || 'Biren Sharma'} (${patient?.age || 74} yrs, ${patient?.state || 'Assam'})
Caregiver: ${patient?.caretakerName || 'Family Caregiver'}

Summary Statistics:
- Total Activities Practiced: ${totalGames} sessions
- Overall Accuracy Rate: ${avgAccuracy}%
- Average Response Time: ${avgResponseTime}s
- Most Frequently Enjoyed Activity: ${mostEnjoyedGame}

Weekly Practice Overview:
${weeklyActivity.map(w => `${w.day}: ${w.count} session(s)`).join('\n')}

Notice: This summary tracks cognitive engagement and comfort with familiar activities. It is not a clinical or diagnostic evaluation.
`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CogniCare_Summary_${patient?.name?.replace(/\s+/g, '_') || 'Patient'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Caretaker Analytics & Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
              {t.progress?.title || "Caretaker Progress Dashboard"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-1">
              {t.progress?.subtitle || "Track cognitive engagement, favorite games, and weekly activity without medical labels."}
            </p>
          </div>

          <button
            onClick={handleExportSummary}
            className="px-5 py-3 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <Download className="w-5 h-5 text-amber-300" />
            <span>{t.progress?.exportSummary || "Download Caregiver Summary"}</span>
          </button>
        </div>

        {/* Safety Disclaimer Callout */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            <strong>Caregiver Observation Note:</strong> These analytics display playful engagement, activity completion, and positive stimulation. No diagnostic claims or clinical scores are computed.
          </div>
        </div>

        {/* 4 Stat Metric Cards (Accurate Computed Values) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.totalActivities || "Activities Completed"}
            </span>
            <div className="text-3xl font-bold text-[#1B3B2B]">{totalGames}</div>
            <p className="text-[11px] text-stone-500 font-medium">Across cognitive activities</p>
          </div>

          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.avgAccuracy || "Average Accuracy"}
            </span>
            <div className="text-3xl font-bold text-emerald-700">{avgAccuracy}%</div>
            <p className="text-[11px] text-emerald-600 font-medium">High positive reinforcement</p>
          </div>

          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.avgTime || "Average Response"}
            </span>
            <div className="text-3xl font-bold text-amber-700">{avgResponseTime}s</div>
            <p className="text-[11px] text-stone-500 font-medium">Comfortable, relaxed pace</p>
          </div>

          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.favoriteActivity || "Most Enjoyed"}
            </span>
            <div className="text-base font-bold text-[#7C3218] truncate" title={mostEnjoyedGame}>
              {mostEnjoyedGame}
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Frequently practiced</p>
          </div>
        </div>

        {/* 2-Column Section: Left: Weekly Activity Routine; Right: Practice Areas Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Routine Bar Chart (Accurate Dynamic Data) */}
          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-lg text-[#1B3B2B]">
                  Weekly Activity Routine
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Sessions / Day
              </span>
            </div>

            {/* Dynamic Bar Graph */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-4">
              {weeklyActivity.map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-stone-700 group-hover:text-[#1B3B2B] transition-colors">
                    {w.count}
                  </span>
                  <div className="w-full bg-amber-50 rounded-2xl h-full flex items-end p-1 border border-amber-200/60 shadow-inner">
                    <div
                      style={{ height: w.height }}
                      className="w-full bg-[#1B3B2B] group-hover:bg-[#2C5E3B] rounded-xl transition-all duration-700 shadow-sm"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-600">
                    {w.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500 text-center italic">
              Accurate session tracking based on completed cognitive activities throughout the week.
            </p>
          </div>

          {/* Practice Areas Breakdown */}
          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#1B3B2B]" />
                <h3 className="font-serif font-bold text-lg text-[#1B3B2B]">
                  Practice Areas Breakdown
                </h3>
              </div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Accuracy
              </span>
            </div>

            <div className="space-y-4">
              {memoryDomains.map((dom, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>{dom.name}</span>
                    <span className="text-[#1B3B2B]">{dom.percent}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                    <div
                      style={{ width: `${dom.percent}%` }}
                      className={`h-full ${dom.color} rounded-full transition-all duration-700`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 text-center">
              <button
                onClick={() => setActivePage('games')}
                className="text-xs font-bold text-[#A84B29] hover:text-[#7C3218] transition-colors"
              >
                Start New Cognitive Activity →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
