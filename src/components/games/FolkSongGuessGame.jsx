import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const SONGS = [
  {
    id: 'bihu',
    name: 'Bihu Naam & Pepa Folk Horn',
    state: 'Assam',
    icon: '📯',
    desc: 'Festive spring harvest melody with buffalo horn',
    play: () => soundManager.playBihuMelody()
  },
  {
    id: 'goalpariya',
    name: 'Goalpariya Lokageet (River Song)',
    state: 'Assam / Bengal',
    icon: '🛶',
    desc: 'Tranquil boatman melody of the Brahmaputra',
    play: () => soundManager.playGoalpariyaMelody()
  },
  {
    id: 'duitara',
    name: 'Khasi Duitara Mountain Melody',
    state: 'Meghalaya',
    icon: '🪕',
    desc: 'Two-stringed folk instrument of the Khasi hills',
    play: () => soundManager.playKhasiDuitara()
  },
  {
    id: 'manipuri-flute',
    name: 'Manipuri Pena & Flute Melody',
    state: 'Manipur',
    icon: '🪈',
    desc: 'Devotional classical and folk tune of the valley',
    play: () => soundManager.playManipuriFlute()
  }
];

export const FolkSongGuessGame = ({ difficulty = 'EASY', onCompleteRound }) => {
  const [targetSong, setTargetSong] = useState(null);
  const [options, setOptions] = useState([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const startTimeRef = useRef(Date.now());

  const numChoices = difficulty === 'HARD' ? 4 : difficulty === 'MEDIUM' ? 4 : 3;

  useEffect(() => {
    startRound();
  }, [difficulty]);

  const startRound = () => {
    startTimeRef.current = Date.now();
    setHasPlayed(false);

    const target = SONGS[Math.floor(Math.random() * SONGS.length)];
    setTargetSong(target);

    const others = SONGS.filter(s => s.id !== target.id).sort(() => 0.5 - Math.random());
    const choices = [target, ...others.slice(0, numChoices - 1)].sort(() => 0.5 - Math.random());
    setOptions(choices);
  };

  const handlePlayClip = () => {
    if (targetSong) {
      targetSong.play();
      setHasPlayed(true);
    }
  };

  const handleSelect = (song) => {
    soundManager.playTap();
    const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const isCorrect = song.id === targetSong.id;

    onCompleteRound({
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      timeTakenSeconds: elapsed
    });
  };

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            🎵 Folk Song Guess • Level: {difficulty}
          </span>
          <VoiceButton textToRead="Listen to the traditional folk tune and guess which melody was played." />
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          Listen & Identify the Folk Melody
        </h3>

        <p className="text-stone-600 text-sm">
          Tap below to play the folk instrument clip, then choose the matching traditional song.
        </p>
      </div>

      {/* Play Audio Button */}
      <div className="py-4">
        <button
          onClick={handlePlayClip}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-amber-200 font-bold text-lg border-2 border-[#C99E32] shadow-xl transition-all active:scale-95"
        >
          <Music className="w-6 h-6 text-amber-300 animate-pulse" />
          <span>{hasPlayed ? "Play Folk Clip Again 🎶" : "Play Folk Melody Clip 🎵"}</span>
        </button>
      </div>

      {/* Answer Options */}
      {hasPlayed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fadeIn">
          {options.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSelect(song)}
              className="bg-white border-2 border-stone-200 hover:border-[#C99E32] rounded-2xl p-4 text-left shadow-sm hover:bg-amber-50/50 transition-all flex items-center gap-3.5"
            >
              <span className="text-3xl">{song.icon}</span>
              <div>
                <strong className="block text-sm text-[#1B3B2B]">{song.name}</strong>
                <span className="text-xs text-stone-500">{song.desc} ({song.state})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
