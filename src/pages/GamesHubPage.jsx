import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ArrowLeft,
  Star,
  Award,
  ChevronRight,
  Music,
  Eye,
  Brain,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { soundManager } from '../services/audioSynthesizer';
import { voiceAssistant } from '../services/voiceAssistant';
import { aiService } from '../services/aiService';
import { CelebrationModal } from '../components/CelebrationModal';
import { VoiceButton } from '../components/VoiceButton';

// 1. FIVE STONES (GUTI) GAME COMPONENT
const FiveStonesGame = ({ onComplete, t }) => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [gameState, setGameState] = useState('memorize'); // 'memorize', 'play', 'success'
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const stoneCount = level === 1 ? 3 : level === 2 ? 4 : 5;
  const stones = [
    { id: 0, name: 'River Jade Stone', color: 'bg-emerald-700', border: 'border-emerald-900', symbol: '🟢' },
    { id: 1, name: 'Brahmaputra Pebble', color: 'bg-amber-700', border: 'border-amber-900', symbol: '🟤' },
    { id: 2, name: 'Mountain Quartz', color: 'bg-slate-500', border: 'border-slate-800', symbol: '⚪' },
    { id: 3, name: 'Red Terracotta Clay', color: 'bg-red-700', border: 'border-red-950', symbol: '🔴' },
    { id: 4, name: 'Golden River Sandstone', color: 'bg-yellow-600', border: 'border-yellow-800', symbol: '🟡' }
  ].slice(0, stoneCount);

  React.useEffect(() => {
    startRound();
  }, [level]);

  const startRound = () => {
    setPlayerInput([]);
    setGameState('memorize');
    // Generate random order
    const seq = [];
    const available = [...stones.map(s => s.id)];
    while (available.length > 0) {
      const randIdx = Math.floor(Math.random() * available.length);
      seq.push(available[randIdx]);
      available.splice(randIdx, 1);
    }
    setSequence(seq);

    // Play show sequence animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        setHighlightIdx(seq[step]);
        soundManager.playTap();
        step++;
      } else {
        clearInterval(interval);
        setHighlightIdx(-1);
        setGameState('play');
      }
    }, 1200);
  };

  const handleStoneClick = (stoneId) => {
    if (gameState !== 'play') return;
    soundManager.playTap();

    const newInput = [...playerInput, stoneId];
    setPlayerInput(newInput);

    // Check if correct so far
    const currentStep = newInput.length - 1;
    if (newInput[currentStep] !== sequence[currentStep]) {
      // Gentle encouragement, let them retry without penalty
      voiceAssistant.speak(t.games?.letsTryAnother || "Let's try again gently!", 'en');
      setTimeout(() => {
        startRound();
      }, 900);
      return;
    }

    if (newInput.length === sequence.length) {
      setGameState('success');
      onComplete({
        gameId: 'five-stones',
        gameName: 'Five Stones (Guti)',
        category: 'Childhood',
        score: 95 + level * 2,
        accuracy: 100,
        difficulty: level,
        itemsCount: stoneCount
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.fiveStones || "Five Stones (Guti / Kosh)"}
        </h4>
        <p className="text-stone-700 text-sm">
          {gameState === 'memorize'
            ? "Watch the river stones glow in order..."
            : "Now gently tap the river stones in the same order!"}
        </p>
      </div>

      {/* Stone Display Circle */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-8">
        {stones.map((st) => {
          const isGlowing = highlightIdx === st.id;
          const isSelected = playerInput.includes(st.id);
          return (
            <button
              key={st.id}
              onClick={() => handleStoneClick(st.id)}
              disabled={gameState !== 'play' || isSelected}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${st.border} ${st.color} text-white font-bold text-2xl shadow-xl transition-all transform flex flex-col items-center justify-center ${
                isGlowing ? 'scale-125 ring-8 ring-amber-300 animate-pulse' : 'hover:scale-105 active:scale-95'
              } ${isSelected ? 'opacity-40 grayscale' : ''}`}
            >
              <span>{st.symbol}</span>
              <span className="text-[10px] font-sans opacity-90">{st.id + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={startRound}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm border border-amber-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Show Again</span>
        </button>
      </div>
    </div>
  );
};

// 2. MARBLES (GOLI) GAME COMPONENT
const MarblesGame = ({ onComplete, t }) => {
  const [targetColor, setTargetColor] = useState(null);
  const [marbles, setMarbles] = useState([]);
  const [foundCount, setFoundCount] = useState(0);

  const colors = [
    { name: 'Emerald Green', bg: 'bg-emerald-500', hex: '#10B981' },
    { name: 'Sky Blue', bg: 'bg-sky-500', hex: '#0EA5E9' },
    { name: 'Golden Amber', bg: 'bg-amber-500', hex: '#F59E0B' },
    { name: 'Ruby Crimson', bg: 'bg-rose-500', hex: '#F43F5E' },
    { name: 'Deep Purple', bg: 'bg-purple-500', hex: '#A855F7' }
  ];

  React.useEffect(() => {
    startMarbles();
  }, []);

  const startMarbles = () => {
    const list = [];
    const chosen = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(chosen);

    // Create 6 marbles in the ring
    for (let i = 0; i < 6; i++) {
      const col = Math.random() > 0.4 ? chosen : colors[Math.floor(Math.random() * colors.length)];
      list.push({ id: i, ...col, collected: false });
    }
    // ensure at least 2 match
    list[0] = { id: 0, ...chosen, collected: false };
    list[1] = { id: 1, ...chosen, collected: false };
    setMarbles(list);
    setFoundCount(0);
  };

  const handleMarbleClick = (m) => {
    if (m.collected) return;
    soundManager.playTap();

    if (m.name === targetColor.name) {
      const updated = marbles.map(item => item.id === m.id ? { ...item, collected: true } : item);
      setMarbles(updated);
      const newFound = foundCount + 1;
      setFoundCount(newFound);

      const totalTarget = updated.filter(item => item.name === targetColor.name).length;
      if (newFound >= totalTarget) {
        onComplete({
          gameId: 'marbles',
          gameName: 'Marbles (Goli)',
          category: 'Childhood',
          score: 100,
          accuracy: 100,
          difficulty: 1,
          itemsCount: 6
        });
      }
    } else {
      voiceAssistant.speak("Look for the " + targetColor.name + " marble!", 'en');
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.marbles || "Marbles (Goli)"}
        </h4>
        <p className="text-stone-700 text-sm">
          Collect all the <strong>{targetColor?.name}</strong> marbles from the traditional circle!
        </p>
      </div>

      {/* Ring Arena */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-full border-4 border-dashed border-[#8C6D3B] bg-amber-50/50 flex items-center justify-center p-4 shadow-inner">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {marbles.map((m) => (
            <button
              key={m.id}
              onClick={() => handleMarbleClick(m)}
              disabled={m.collected}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-lg ${m.bg} transform transition-all flex items-center justify-center ${
                m.collected ? 'scale-0 opacity-0' : 'hover:scale-110 active:scale-95'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white/40 blur-[1px] -mt-3 -ml-3" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startMarbles}
        className="px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm border border-amber-300"
      >
        New Marble Ring
      </button>
    </div>
  );
};

// 3. SPINNING TOP (LATUM) GAME COMPONENT
const SpinningTopGame = ({ onComplete, t }) => {
  const [spinning, setSpinning] = useState(false);
  const [correctColor, setCorrectColor] = useState('Crimson Red');
  const [revealed, setRevealed] = useState(false);

  const colors = [
    { name: 'Crimson Red', bg: 'bg-rose-600', icon: '🔴' },
    { name: 'Bamboo Green', bg: 'bg-emerald-600', icon: '🟢' },
    { name: 'Muga Gold', bg: 'bg-amber-500', icon: '🟡' },
    { name: 'River Blue', bg: 'bg-sky-600', icon: '🔵' }
  ];

  React.useEffect(() => {
    spinTop();
  }, []);

  const spinTop = () => {
    setSpinning(true);
    setRevealed(false);
    const chosen = colors[Math.floor(Math.random() * colors.length)];
    setCorrectColor(chosen.name);

    setTimeout(() => {
      setSpinning(false);
      setRevealed(true);
    }, 2200);
  };

  const handleGuess = (colName) => {
    soundManager.playTap();
    if (colName === correctColor) {
      onComplete({
        gameId: 'spinning-top',
        gameName: 'Spinning Top (Latum)',
        category: 'Childhood',
        score: 100,
        accuracy: 100,
        difficulty: 1,
        itemsCount: 4
      });
    } else {
      voiceAssistant.speak("Let's spin again and watch closely!", 'en');
      setTimeout(spinTop, 800);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.spinningTop || "Spinning Top (Latum)"}
        </h4>
        <p className="text-stone-700 text-sm">
          Watch the wooden top spin and remember its vibrant ribbon color!
        </p>
      </div>

      <div className="py-6 flex flex-col items-center justify-center min-h-[160px]">
        <div
          className={`w-28 h-28 rounded-full border-4 border-stone-800 flex items-center justify-center text-5xl shadow-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 transition-all ${
            spinning ? 'animate-spin scale-110' : ''
          }`}
        >
          🪀
        </div>
        <p className="mt-3 text-xs font-bold text-stone-500">
          {spinning ? "Spinning fast..." : "Top has slowed down. What color was the ribbon?"}
        </p>
      </div>

      {revealed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => handleGuess(c.name)}
              className="py-3 px-3 rounded-2xl border-2 border-stone-300 hover:border-amber-400 bg-white hover:bg-amber-50 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. MEMORY VILLAGE (Interactive Scene Placement Memory)
const MemoryVillageGame = ({ onComplete, t }) => {
  const [phase, setPhase] = useState('memorize'); // 'memorize' -> 'recall'
  const items = [
    { id: 'jaapi', name: 'Assamese Jaapi Hat', icon: '👒', pos: 'top-left' },
    { id: 'dhol', name: 'Bihu Dhol Drum', icon: '🥁', pos: 'bottom-left' },
    { id: 'kettle', name: 'Brass Tea Kettle', icon: '🫖', pos: 'center' },
    { id: 'basket', name: 'Bamboo Tea Basket', icon: '🧺', pos: 'top-right' },
    { id: 'loom', name: 'Weaving Shuttle', icon: '🧵', pos: 'bottom-right' }
  ];

  const [missingItem, setMissingItem] = useState(null);

  React.useEffect(() => {
    startVillage();
  }, []);

  const startVillage = () => {
    setPhase('memorize');
    const missing = items[Math.floor(Math.random() * items.length)];
    setMissingItem(missing);

    setTimeout(() => {
      setPhase('recall');
    }, 4500);
  };

  const handlePick = (item) => {
    soundManager.playTap();
    if (item.id === missingItem.id) {
      onComplete({
        gameId: 'memory-village',
        gameName: 'Memory Village',
        category: 'Childhood',
        score: 100,
        accuracy: 100,
        difficulty: 2,
        itemsCount: 5
      });
    } else {
      voiceAssistant.speak("Take your time and think of the village house.", 'en');
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.memoryVillage || "Memory Village Scene"}
        </h4>
        <p className="text-stone-700 text-sm">
          {phase === 'memorize'
            ? "Look at the traditional North-East stilt home and remember where items are placed..."
            : `Which traditional item was located in the ${missingItem?.pos.replace('-', ' ')}?`}
        </p>
      </div>

      {/* Traditional Village Courtyard Mockup */}
      <div className="relative max-w-lg mx-auto h-64 sm:h-72 bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 rounded-3xl border-4 border-[#8C6D3B] p-4 shadow-xl overflow-hidden flex items-center justify-center">
        <div className="absolute top-2 left-4 text-xs font-serif font-bold text-[#1E432A]">
          🏡 Traditional North-East Verandah
        </div>

        {phase === 'memorize' ? (
          <div className="w-full h-full relative">
            <div className="absolute top-6 left-6 text-center">
              <span className="text-4xl block">👒</span>
              <span className="text-[10px] font-bold">Jaapi Hat</span>
            </div>
            <div className="absolute top-6 right-6 text-center">
              <span className="text-4xl block">🧺</span>
              <span className="text-[10px] font-bold">Tea Basket</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-4xl block">🫖</span>
              <span className="text-[10px] font-bold">Tea Kettle</span>
            </div>
            <div className="absolute bottom-4 left-6 text-center">
              <span className="text-4xl block">🥁</span>
              <span className="text-[10px] font-bold">Bihu Dhol</span>
            </div>
            <div className="absolute bottom-4 right-6 text-center">
              <span className="text-4xl block">🧵</span>
              <span className="text-[10px] font-bold">Handloom</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <span className="text-5xl animate-bounce block">❓</span>
            <p className="font-serif font-bold text-stone-800 text-base">
              Which item was at the <strong>{missingItem?.pos.toUpperCase()}</strong>?
            </p>
          </div>
        )}
      </div>

      {phase === 'recall' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => handlePick(it)}
              className="p-3 rounded-2xl bg-white border-2 border-amber-200 hover:border-[#C99E32] font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-amber-50"
            >
              <span className="text-2xl">{it.icon}</span>
              <span className="text-xs text-left">{it.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 5. TRADITIONAL FOOD MEMORY (North-East Cultural Cuisine)
const FoodMemoryGame = ({ onComplete, t }) => {
  const foods = [
    { name: 'Assamese Pitha', image: '🥟', desc: 'Rice cake with jaggery & coconut', state: 'Assam' },
    { name: 'Thukpa Noodle Soup', image: '🍜', desc: 'Warm comforting Himalayan soup', state: 'Sikkim / Arunachal' },
    { name: 'Bamboo Shoot Curry', image: '🎋', desc: 'Authentic fermented bamboo shoot', state: 'Nagaland / Manipur' },
    { name: 'Traditional Momos', image: '🥟', desc: 'Steamed dumplings with spicy chutney', state: 'Sikkim / Meghalaya' }
  ];

  const [currentFood, setCurrentFood] = useState(foods[0]);
  const [phase, setPhase] = useState('show');

  React.useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    setPhase('show');
    const chosen = foods[Math.floor(Math.random() * foods.length)];
    setCurrentFood(chosen);

    setTimeout(() => {
      setPhase('guess');
    }, 3500);
  };

  const handleAnswer = (f) => {
    soundManager.playTap();
    if (f.name === currentFood.name) {
      onComplete({
        gameId: 'food-memory',
        gameName: 'Traditional Food Memory',
        category: 'Cultural',
        score: 100,
        accuracy: 100,
        difficulty: 1,
        itemsCount: 4
      });
    } else {
      voiceAssistant.speak("Let's taste another memory!", 'en');
      setTimeout(startRound, 800);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.foodMemory || "Traditional Food Memory"}
        </h4>
        <p className="text-stone-700 text-sm">
          {phase === 'show'
            ? "Look closely at this beloved North-Eastern delicacy..."
            : "What traditional dish did you see?"}
        </p>
      </div>

      <div className="p-8 bg-white border-2 border-amber-200 rounded-3xl max-w-sm mx-auto shadow-lg flex flex-col items-center justify-center min-h-[180px]">
        {phase === 'show' ? (
          <div className="space-y-2 animate-fadeIn">
            <span className="text-6xl block">{currentFood.image}</span>
            <h5 className="font-serif font-bold text-xl text-[#1E432A]">{currentFood.name}</h5>
            <p className="text-xs text-stone-600">{currentFood.desc} ({currentFood.state})</p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-6xl block">🍽️</span>
            <p className="font-serif font-bold text-stone-800 text-lg">Which delicacy was displayed?</p>
          </div>
        )}
      </div>

      {phase === 'guess' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          {foods.map((f) => (
            <button
              key={f.name}
              onClick={() => handleAnswer(f)}
              className="py-3 px-4 rounded-2xl bg-white border-2 border-amber-200 hover:border-[#C99E32] font-bold text-sm shadow-sm hover:bg-amber-50 text-stone-900 transition-all text-left flex items-center gap-3"
            >
              <span className="text-2xl">{f.image}</span>
              <div>
                <span className="block">{f.name}</span>
                <span className="text-[10px] text-stone-500">{f.state}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 6. FOLK MUSIC & INSTRUMENT RECALL (With Web Audio synthesis!)
const FolkMusicGame = ({ onComplete, t }) => {
  const instruments = [
    { id: 'pepa', name: 'Assamese Pepa (Buffalo Horn)', icon: '📯', sound: () => soundManager.playPepa(440, 1.2) },
    { id: 'dhol', name: 'Bihu Dhol Beat', icon: '🥁', sound: () => soundManager.playDhol() },
    { id: 'duitara', name: 'Khasi Duitara String', icon: '🪕', sound: () => soundManager.playDuitara(523.25) },
    { id: 'flute', name: 'Bamboo Sifung Flute', icon: '🪈', sound: () => soundManager.playFlute(587.33, 1.2) }
  ];

  const [activeTarget, setActiveTarget] = useState(instruments[0]);
  const [played, setPlayed] = useState(false);

  React.useEffect(() => {
    startMusic();
  }, []);

  const startMusic = () => {
    const chosen = instruments[Math.floor(Math.random() * instruments.length)];
    setActiveTarget(chosen);
    setPlayed(false);
  };

  const playTune = () => {
    activeTarget.sound();
    setPlayed(true);
  };

  const handlePick = (inst) => {
    soundManager.playTap();
    if (inst.id === activeTarget.id) {
      onComplete({
        gameId: 'music-memory',
        gameName: 'Folk Music & Instruments',
        category: 'Cultural',
        score: 100,
        accuracy: 100,
        difficulty: 1,
        itemsCount: 4
      });
    } else {
      voiceAssistant.speak("Listen carefully to the folk tune once more.", 'en');
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <h4 className="font-serif font-bold text-xl text-[#1E432A] mb-1">
          {t.games?.music || "Folk Music & Instruments"}
        </h4>
        <p className="text-stone-700 text-sm">
          Listen to the traditional North-East folk sound and identify the instrument!
        </p>
      </div>

      <div className="py-4">
        <button
          onClick={playTune}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#1E432A] hover:bg-[#2C5E3B] text-amber-200 font-bold text-lg border-2 border-[#C99E32] shadow-xl transition-all active:scale-95"
        >
          <Music className="w-6 h-6 text-amber-300 animate-pulse" />
          <span>{played ? "Play Tune Again" : "Listen to Folk Melody 🎵"}</span>
        </button>
      </div>

      {played && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {instruments.map((inst) => (
            <button
              key={inst.id}
              onClick={() => handlePick(inst)}
              className="p-4 rounded-2xl bg-white border-2 border-amber-200 hover:border-[#C99E32] font-bold text-base shadow-sm hover:bg-amber-50 text-stone-900 transition-all flex items-center gap-3 text-left"
            >
              <span className="text-3xl">{inst.icon}</span>
              <span>{inst.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// MAIN GAMES HUB COMPONENT
export const GamesHubPage = ({ initialGame = null, setActivePage }) => {
  const { t } = useLanguage();
  const { recordGameResult, patient } = usePatient();

  const [activeTab, setActiveTab] = useState('childhood'); // 'childhood' or 'cultural'
  const [selectedGameId, setSelectedGameId] = useState(initialGame);
  const [celebrationData, setCelebrationData] = useState(null);

  const childhoodGames = [
    { id: 'five-stones', title: t.games?.fiveStones || 'Five Stones (Guti / Kosh)', desc: t.games?.fiveStonesDesc || 'Remember order and position of river stones.', icon: '🪨', component: FiveStonesGame },
    { id: 'marbles', title: t.games?.marbles || 'Marbles / Goli', desc: t.games?.marblesDesc || 'Remember colors and sequence of glass marbles in the circle.', icon: '🪙', component: MarblesGame },
    { id: 'spinning-top', title: t.games?.spinningTop || 'Spinning Top (Latum)', desc: t.games?.spinningTopDesc || 'Watch the spinning top and recall pattern sequence.', icon: '🪀', component: SpinningTopGame },
    { id: 'memory-village', title: t.games?.memoryVillage || 'Memory Village Scene', desc: t.games?.memoryVillageDesc || 'Remember where traditional items were placed.', icon: '🏠', component: MemoryVillageGame }
  ];

  const culturalGames = [
    { id: 'food-memory', title: t.games?.foodMemory || 'Traditional Food Memory', desc: t.games?.foodMemoryDesc || 'Identify authentic North-East delicacies like Pitha and Thukpa.', icon: '🍲', component: FoodMemoryGame },
    { id: 'music-memory', title: t.games?.music || 'Folk Music & Instruments', desc: t.games?.musicDesc || 'Listen to authentic tunes of Pepa, Dhol, and Duitara.', icon: '🎶', component: FolkMusicGame }
  ];

  const allGames = [...childhoodGames, ...culturalGames];
  const currentGameObj = allGames.find(g => g.id === selectedGameId);

  const handleGameComplete = async (result) => {
    await recordGameResult(result);
    setCelebrationData({
      score: result.score || 100,
      accuracy: result.accuracy || 100,
      gameTitle: result.gameName,
      encouragement: aiService.getEncouragement(t)
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* If a game is active */}
        {selectedGameId && currentGameObj ? (
          <div className="space-y-6">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between bg-white border-2 border-amber-200 rounded-3xl p-4 shadow-sm">
              <button
                onClick={() => setSelectedGameId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm border border-amber-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.games?.backToGames || "Back to All Games"}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentGameObj.icon}</span>
                <span className="font-serif font-bold text-lg text-[#1E432A]">{currentGameObj.title}</span>
              </div>

              <VoiceButton textToRead={`${currentGameObj.title}. ${currentGameObj.desc}`} />
            </div>

            {/* Render Active Game Module */}
            <div className="bg-white border-2 border-[#C99E32] rounded-3xl p-6 sm:p-10 shadow-xl">
              {React.createElement(currentGameObj.component, {
                onComplete: handleGameComplete,
                t
              })}
            </div>
          </div>
        ) : (
          /* Games Hub Menu */
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-[#7C3218] text-xs font-bold uppercase tracking-wider">
                <span>🧠 Cognitive Support & Reminiscence Suite</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
                Memory & Childhood Games
              </h1>

              <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
                Traditional games and cultural reminiscence designed to support comfortable recall, attention, and happy memories.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('childhood')}
                className={`px-6 py-3 rounded-2xl font-bold text-base transition-all border-2 flex items-center gap-2 ${
                  activeTab === 'childhood'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-white text-stone-800 border-stone-300 hover:bg-amber-50'
                }`}
              >
                <span>🌿</span>
                <span>{t.games?.childhoodTitle || "Back to My Childhood"}</span>
              </button>

              <button
                onClick={() => setActiveTab('cultural')}
                className={`px-6 py-3 rounded-2xl font-bold text-base transition-all border-2 flex items-center gap-2 ${
                  activeTab === 'cultural'
                    ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-md'
                    : 'bg-white text-stone-800 border-stone-300 hover:bg-amber-50'
                }`}
              >
                <span>🏮</span>
                <span>{t.games?.culturalTitle || "North-East Heritage"}</span>
              </button>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(activeTab === 'childhood' ? childhoodGames : culturalGames).map((game) => (
                <div
                  key={game.id}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-[#C99E32] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {game.icon}
                      </div>
                      <VoiceButton textToRead={`${game.title}. ${game.desc}`} />
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#1E432A] group-hover:text-[#A84B29] transition-colors">
                      {game.title}
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed">
                      {game.desc}
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setSelectedGameId(game.id)}
                      className="w-full py-3 px-4 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base border border-[#C99E32] transition-all shadow active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-amber-300" />
                      <span>Play Activity</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Celebration Modal */}
        <CelebrationModal
          isOpen={!!celebrationData}
          onClose={() => {
            setCelebrationData(null);
            setSelectedGameId(null);
          }}
          onPlayAgain={() => {
            setCelebrationData(null);
          }}
          onNext={() => {
            setCelebrationData(null);
            setSelectedGameId(null);
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
