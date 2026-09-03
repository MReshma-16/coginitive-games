import React from 'react';
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
import { VoiceButton } from '../components/VoiceButton';

export const ProgressDashboardPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { gameResults, patient, questionnaire } = usePatient();

  const totalGames = gameResults?.length || 5;
  const avgAccuracy = totalGames > 0
    ? Math.round(gameResults.reduce((acc, g) => acc + (g.accuracy || 100), 0) / totalGames)
    : 95;

  const avgResponseTime = totalGames > 0
    ? (gameResults.reduce((acc, g) => acc + (g.responseTimeMs || 2200), 0) / totalGames / 1000).toFixed(1)
    : '2.4';

  const weeklyActivity = [
    { day: 'Mon', count: 4, height: '70%' },
    { day: 'Tue', count: 3, height: '55%' },
    { day: 'Wed', count: 5, height: '90%' },
    { day: 'Thu', count: 2, height: '40%' },
    { day: 'Fri', count: 4, height: '75%' },
    { day: 'Sat', count: 6, height: '100%' },
    { day: 'Sun', count: 3, height: '60%' }
  ];

  const memoryDomains = [
    { name: 'Visual Memory', gamesCount: 12, percent: 85, color: 'bg-emerald-500' },
    { name: 'Sequence Recall', gamesCount: 9, percent: 78, color: 'bg-amber-500' },
    { name: 'Familiar Recognition', gamesCount: 14, percent: 92, color: 'bg-teal-500' },
    { name: 'Gentle Attention', gamesCount: 8, percent: 80, color: 'bg-indigo-500' },
    { name: 'Routine & Song Recall', gamesCount: 10, percent: 88, color: 'bg-rose-500' }
  ];

  const handleExportSummary = () => {
    const summary = `
MEMORY ROOTS - CAREGIVER ACTIVITY SUMMARY
Date: ${new Date().toLocaleDateString()}
Elder: ${patient?.name || 'Biren Sharma'} (${patient?.age || 74} yrs, ${patient?.state || 'Assam'})
Caregiver: Dr. Ananya Sharma

Summary Statistics:
- Total Activities Practiced: ${totalGames} sessions
- Overall Accuracy Rate: ${avgAccuracy}%
- Average Response Time: ${avgResponseTime}s
- Most Enjoyed Activities: Five Stones (Guti), Traditional Food Memory, Folk Music Recall

Notice: This summary tracks cognitive engagement and comfort with familiar activities. It is not a clinical or diagnostic evaluation.
`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MemoryRoots_Summary_${patient?.name?.replace(/\s+/g, '_') || 'Patient'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-stone-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Caretaker Analytics & Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
              {t.progress?.title || "Caretaker Progress Dashboard"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-1">
              {t.progress?.subtitle || "Track cognitive engagement, favorite games, and weekly activity without medical labels."}
            </p>
          </div>

          <button
            onClick={handleExportSummary}
            className="px-5 py-3 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] transition-all shadow-md active:scale-95 flex items-center gap-2"
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

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.totalActivities || "Activities Completed"}
            </span>
            <div className="text-3xl font-bold text-[#1E432A]">{totalGames}</div>
            <p className="text-[11px] text-stone-500 font-medium">Across childhood & cultural games</p>
          </div>

          <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.avgAccuracy || "Average Accuracy"}
            </span>
            <div className="text-3xl font-bold text-emerald-700">{avgAccuracy}%</div>
            <p className="text-[11px] text-emerald-600 font-medium">High positive reinforcement</p>
          </div>

          <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.avgTime || "Response Pace"}
            </span>
            <div className="text-3xl font-bold text-amber-700">{avgResponseTime}s</div>
            <p className="text-[11px] text-stone-500 font-medium">Comfortable, relaxed pace</p>
          </div>

          <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm space-y-1">
            <span className="text-xs uppercase font-bold text-stone-500">
              {t.progress?.favoriteActivity || "Favorite Activity"}
            </span>
            <div className="text-lg font-bold text-[#7C3218] truncate">Five Stones & Music</div>
            <p className="text-[11px] text-stone-500 font-medium">Most frequently replayed</p>
          </div>
        </div>

        {/* 2 Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Weekly Engagement Visual Chart (Requirement 13) */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="font-serif font-bold text-xl text-[#1E432A] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <span>Weekly Activity Routine</span>
              </h3>
              <span className="text-xs uppercase font-bold text-stone-500">Sessions</span>
            </div>

            <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2">
              {weeklyActivity.map((w) => (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-stone-600 group-hover:text-amber-800 transition-colors">
                    {w.count}
                  </span>
                  <div className="w-full bg-amber-100 rounded-2xl overflow-hidden flex items-end p-0.5 border border-amber-200 h-40">
                    <div
                      className="w-full bg-[#1E432A] group-hover:bg-[#C99E32] rounded-xl transition-all duration-500"
                      style={{ height: w.height }}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-700">{w.day}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-stone-500 text-center italic">
              Regular short 10-minute sessions provide familiar comfort throughout the week.
            </p>
          </div>

          {/* Chart 2: Practice Areas Breakdown */}
          <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="font-serif font-bold text-xl text-[#1E432A] flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-700" />
                <span>{t.progress?.domainBreakdown || "Memory Areas Practiced"}</span>
              </h3>
            </div>

            <div className="space-y-4">
              {memoryDomains.map((dom) => (
                <div key={dom.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-stone-900">{dom.name}</span>
                    <span className="font-bold text-stone-700">{dom.percent}%</span>
                  </div>
                  <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full ${dom.color} rounded-full transition-all duration-700`}
                      style={{ width: `${dom.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActivePage('games')}
                className="text-xs font-bold text-[#A84B29] hover:underline"
              >
                Start New Memory Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Detailed History Table */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#1E432A]">
            Detailed Activity Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-stone-500 border-b border-stone-200">
                  <th className="pb-3 font-semibold">Activity</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                  <th className="pb-3 font-semibold">Response</th>
                  <th className="pb-3 font-semibold">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(gameResults?.length > 0 ? gameResults : [
                  { gameName: 'Five Stones (Guti)', category: 'Childhood', score: 95, accuracy: 95, responseTimeMs: 2400, completedAt: '2026-08-28T10:15:00.000Z' },
                  { gameName: 'Traditional Food Memory', category: 'Cultural', score: 100, accuracy: 100, responseTimeMs: 1900, completedAt: '2026-08-29T11:00:00.000Z' },
                  { gameName: 'Folk Music Memory', category: 'Cultural', score: 90, accuracy: 90, responseTimeMs: 2800, completedAt: '2026-08-30T10:45:00.000Z' },
                  { gameName: 'Memory Village', category: 'Childhood', score: 88, accuracy: 88, responseTimeMs: 3100, completedAt: '2026-08-31T10:30:00.000Z' }
                ]).map((res, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/50">
                    <td className="py-3 font-semibold text-stone-900">{res.gameName}</td>
                    <td className="py-3 text-xs text-stone-600">{res.category}</td>
                    <td className="py-3 font-bold text-amber-900">{res.score}</td>
                    <td className="py-3 font-bold text-emerald-700">{res.accuracy}%</td>
                    <td className="py-3 text-xs text-stone-500">{(res.responseTimeMs / 1000).toFixed(1)}s</td>
                    <td className="py-3 text-xs text-stone-500">
                      {new Date(res.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
