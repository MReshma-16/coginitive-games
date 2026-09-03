import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, RotateCcw, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const SOUND_PADS = [
  { id: 'bell', name: 'Bell', icon: '🔔', sound: () => soundManager.playBell(), color: 'bg-amber-100 border-amber-400 text-amber-950' },
  { id: 'drum', name: 'Drum', icon: '🥁', sound: () => soundManager.playDrum(), color: 'bg-emerald-100 border-emerald-400 text-emerald-950' },
  { id: 'clap', name: 'Clap', icon: '👏', sound: () => soundManager.playClap(), color: 'bg-sky-100 border-sky-400 text-sky-950' },
  { id: 'chime', name: 'Chime', icon: '🎶', sound: () => soundManager.playChime(), color: 'bg-purple-100 border-purple-400 text-purple-950' }
];

export const RhythmRecallGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePadId, setActivePadId] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [hasStartedFirstTime, setHasStartedFirstTime] = useState(false);
  const startTimeRef = useRef(Date.now());
  const playTimeoutRef = useRef([]);

  const sequenceLength = difficulty === 'HARD' ? 6 : difficulty === 'MEDIUM' ? 4 : 3;

  useEffect(() => {
    startRound();
    return () => {
      // Clear any pending timeouts
      playTimeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, [difficulty]);

  const clearPendingTimeouts = () => {
    playTimeoutRef.current.forEach(t => clearTimeout(t));
    playTimeoutRef.current = [];
  };

  const startRound = () => {
    clearPendingTimeouts();
    startTimeRef.current = Date.now();
    setPlayerSequence([]);
    setIsPlaying(false);
    setActivePadId(null);

    // Generate clean sequence based on length
    const padIds = ['bell', 'drum', 'clap', 'chime'];
    const newSeq = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSeq.push(padIds[Math.floor(Math.random() * padIds.length)]);
    }
    setSequence(newSeq);
  };

  const playSequence = (seq = sequence) => {
    if (isPlaying) return;
    clearPendingTimeouts();

    // Ensure audio context is ready on user gesture
    soundManager.ensureContext();
    setIsPlaying(true);
    setPlayerSequence([]);
    setHasStartedFirstTime(true);

    const stepDelay = 900; // Comfortable spacing for elderly users

    seq.forEach((padId, index) => {
      const t1 = setTimeout(() => {
        const pad = SOUND_PADS.find(p => p.id === padId);
        if (pad) {
          pad.sound();
          setActivePadId(padId);
        }

        const t2 = setTimeout(() => {
          setActivePadId(null);
        }, 450);
        playTimeoutRef.current.push(t2);

        if (index === seq.length - 1) {
          const t3 = setTimeout(() => {
            setIsPlaying(false);
          }, 600);
          playTimeoutRef.current.push(t3);
        }
      }, index * stepDelay + 300);

      playTimeoutRef.current.push(t1);
    });
  };

  const handlePadTap = (pad) => {
    // Prevent interaction while audio sequence is actively playing
    if (isPlaying) return;

    // Play pad sound immediately
    soundManager.ensureContext();
    pad.sound();
    setActivePadId(pad.id);
    setTimeout(() => setActivePadId(null), 300);

    const nextPlayerSeq = [...playerSequence, pad.id];
    setPlayerSequence(nextPlayerSeq);

    const currentStepIndex = nextPlayerSeq.length - 1;

    // Check if user made a mistake on current step
    if (nextPlayerSeq[currentStepIndex] !== sequence[currentStepIndex]) {
      // Soft gentle tone, then replay sequence
      soundManager.playChime();
      const t = setTimeout(() => {
        setPlayerSequence([]);
        playSequence(sequence);
      }, 800);
      playTimeoutRef.current.push(t);
      return;
    }

    // Sequence completed successfully
    if (nextPlayerSeq.length === sequence.length) {
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      onCompleteRound({
        correctAnswers: sequence.length,
        totalQuestions: sequence.length,
        timeTakenSeconds: elapsed
      });
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🥁 Rhythm Recall • Level: {difficulty}
          </span>

          {/* Working Volume Control */}
          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-300">
            <Volume2 className="w-4 h-4 text-stone-700" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[#1B3B2B] cursor-pointer"
              title="Volume Control"
            />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {!hasStartedFirstTime
            ? "Ready to Listen to the Rhythm?"
            : isPlaying
            ? "Listen to the Rhythm..."
            : "Now Tap the Pads in the Same Order"}
        </h3>

        <p className="text-stone-600 text-sm">
          {!hasStartedFirstTime
            ? `Tap "Listen to Rhythm" below to hear the ${sequenceLength} peaceful sounds.`
            : isPlaying
            ? `Playing ${sequenceLength} peaceful sounds. Please listen carefully.`
            : `Tapped ${playerSequence.length} of ${sequenceLength} sounds.`}
        </p>
      </div>

      {/* Start / Replay Button */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => playSequence()}
          disabled={isPlaying}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-amber-200 font-bold text-base border-2 border-[#C99E32] shadow-md transition-all active:scale-98 disabled:opacity-50"
        >
          <Volume2 className="w-5 h-5 text-amber-300" />
          <span>{hasStartedFirstTime ? "🔊 Listen / Replay Sound" : "🔊 Listen to Rhythm"}</span>
        </button>
      </div>

      {/* 4 Sound Pads Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {SOUND_PADS.map((pad) => {
          const isActive = activePadId === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadTap(pad)}
              disabled={isPlaying || !hasStartedFirstTime}
              className={`p-6 sm:p-8 rounded-3xl border-3 font-serif font-bold text-lg sm:text-xl transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                isActive
                  ? 'bg-amber-300 border-[#1B3B2B] scale-110 ring-4 ring-amber-400 shadow-xl'
                  : `${pad.color} hover:scale-103 active:scale-95 disabled:opacity-60`
              }`}
            >
              <span className="text-4xl sm:text-5xl">{pad.icon}</span>
              <span>{pad.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
