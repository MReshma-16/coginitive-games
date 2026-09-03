import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, RotateCcw, VolumeX, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const SOUND_PADS = [
  { id: 'bell', name: 'Bell', icon: '🔔', sound: () => soundManager.playBell(), color: 'bg-amber-100 border-amber-400 text-amber-900' },
  { id: 'drum', name: 'Drum', icon: '🥁', sound: () => soundManager.playDrum(), color: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
  { id: 'clap', name: 'Clap', icon: '👏', sound: () => soundManager.playClap(), color: 'bg-sky-100 border-sky-400 text-sky-900' },
  { id: 'chime', name: 'Chime', icon: '🎶', sound: () => soundManager.playChime(), color: 'bg-purple-100 border-purple-400 text-purple-900' }
];

export const RhythmRecallGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePadId, setActivePadId] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const startTimeRef = useRef(Date.now());

  const sequenceLength = difficulty === 'HARD' ? 6 : difficulty === 'MEDIUM' ? 4 : 3;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setPlayerSequence([]);

    // Generate random sequence
    const pads = ['bell', 'drum', 'clap', 'chime'];
    const newSeq = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSeq.push(pads[Math.floor(Math.random() * pads.length)]);
    }
    setSequence(newSeq);

    // Play sequence after a short delay
    setTimeout(() => {
      playSequence(newSeq);
    }, 600);
  };

  const playSequence = (seq = sequence) => {
    setIsPlaying(true);
    setPlayerSequence([]);

    seq.forEach((padId, index) => {
      setTimeout(() => {
        const pad = SOUND_PADS.find(p => p.id === padId);
        if (pad) {
          pad.sound();
          setActivePadId(padId);
        }
        setTimeout(() => setActivePadId(null), 400);

        if (index === seq.length - 1) {
          setTimeout(() => setIsPlaying(false), 500);
        }
      }, index * 900);
    });
  };

  const handlePadTap = (pad) => {
    if (isPlaying) return;

    pad.sound();
    setActivePadId(pad.id);
    setTimeout(() => setActivePadId(null), 300);

    const nextPlayerSeq = [...playerSequence, pad.id];
    setPlayerSequence(nextPlayerSeq);

    const stepIdx = nextPlayerSeq.length - 1;

    // Check mistake
    if (nextPlayerSeq[stepIdx] !== sequence[stepIdx]) {
      soundManager.playChime();
      setTimeout(() => {
        setPlayerSequence([]);
        playSequence(sequence);
      }, 700);
      return;
    }

    // Finished sequence
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

          {/* Volume Control (Requirement 1 & 3) */}
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
          {isPlaying ? "Listen to the Rhythm..." : "Now Tap the Rhythm in Order"}
        </h3>

        <p className="text-stone-600 text-sm">
          {isPlaying
            ? `Listening to ${sequenceLength} peaceful sounds.`
            : `Tapped ${playerSequence.length} of ${sequenceLength} sounds.`}
        </p>
      </div>

      {/* 4 Sound Pads Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {SOUND_PADS.map((pad) => {
          const isActive = activePadId === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadTap(pad)}
              disabled={isPlaying}
              className={`p-6 sm:p-8 rounded-3xl border-3 font-serif font-bold text-lg sm:text-xl transition-all flex flex-col items-center justify-center gap-2 shadow-md ${
                isActive
                  ? 'bg-amber-300 border-[#1B3B2B] scale-110 ring-4 ring-amber-400'
                  : `${pad.color} hover:scale-103 active:scale-95`
              }`}
            >
              <span className="text-4xl sm:text-5xl">{pad.icon}</span>
              <span>{pad.name}</span>
            </button>
          );
        })}
      </div>

      {/* Play Again Button */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => playSequence()}
          disabled={isPlaying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm border border-amber-300 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Listen Again</span>
        </button>
      </div>
    </div>
  );
};
