import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Rich elder-friendly vocabulary for all 26 letters (A to Z)
const LETTER_VOCABULARY = {
  A: {
    words: ['APPLE', 'AIRPLANE', 'ANT', 'ARROW', 'ARM', 'ACORN', 'ANGEL', 'ANIMAL'],
    distractors: ['BOOK', 'CAT', 'DOG', 'FLOWER', 'HOUSE', 'TREE', 'SUN', 'RIVER'],
    complete: { word: 'APPLE', incomplete: 'A _ P L E', hint: 'A sweet red or green fruit', correct: 'P', options: ['P', 'B', 'D', 'T'] }
  },
  B: {
    words: ['BALL', 'BOOK', 'BIRD', 'BOAT', 'BANANA', 'BASKET', 'BELL', 'BUTTERFLY'],
    distractors: ['APPLE', 'CAT', 'DOG', 'FISH', 'GARDEN', 'HOUSE', 'MOON', 'STAR'],
    complete: { word: 'BALL', incomplete: 'B _ L L', hint: 'A round toy for playing catch', correct: 'A', options: ['A', 'E', 'I', 'O'] }
  },
  C: {
    words: ['CAT', 'CAR', 'CLOUD', 'CANDLE', 'CHAIR', 'CLOCK', 'CUP', 'COW'],
    distractors: ['DOG', 'TREE', 'BOOK', 'APPLE', 'HOUSE', 'FISH', 'RIVER', 'BIRD'],
    complete: { word: 'CAT', incomplete: 'C _ T', hint: 'A friendly pet that purrs', correct: 'A', options: ['A', 'E', 'I', 'O'] }
  },
  D: {
    words: ['DOG', 'DOOR', 'DUCK', 'DRUM', 'DEER', 'DOLPHIN', 'DESK', 'DAISY'],
    distractors: ['CAT', 'BOOK', 'APPLE', 'TREE', 'FLOWER', 'BIRD', 'SUN', 'MOON'],
    complete: { word: 'DUCK', incomplete: 'D _ C K', hint: 'A bird that swims in a pond', correct: 'U', options: ['U', 'A', 'O', 'E'] }
  },
  E: {
    words: ['ELEPHANT', 'EGG', 'EAGLE', 'EARTH', 'EYE', 'EAR', 'ENGINE', 'ELBOW'],
    distractors: ['LION', 'TREE', 'APPLE', 'HOUSE', 'RIVER', 'FLOWER', 'BOOK', 'DOG'],
    complete: { word: 'EARTH', incomplete: 'E _ R T H', hint: 'Our living blue planet', correct: 'A', options: ['A', 'E', 'O', 'I'] }
  },
  F: {
    words: ['FISH', 'FLOWER', 'FROG', 'FOREST', 'FEATHER', 'FRUIT', 'FARM', 'FLAG'],
    distractors: ['CAT', 'BIRD', 'TREE', 'APPLE', 'DOG', 'HOUSE', 'SUN', 'MOON'],
    complete: { word: 'FISH', incomplete: 'F _ S H', hint: 'Swims gracefully in rivers', correct: 'I', options: ['I', 'A', 'E', 'O'] }
  },
  G: {
    words: ['GARDEN', 'GOAT', 'GLASS', 'GUITAR', 'GOLD', 'GRASS', 'GRAPE', 'GIFT'],
    distractors: ['HOUSE', 'TREE', 'RIVER', 'APPLE', 'BOOK', 'BIRD', 'CAT', 'DOG'],
    complete: { word: 'GIFT', incomplete: 'G _ F T', hint: 'A wrapped present of joy', correct: 'I', options: ['I', 'A', 'O', 'E'] }
  },
  H: {
    words: ['HOUSE', 'HORSE', 'HAT', 'HAND', 'HEART', 'HONEY', 'HILL', 'HERO'],
    distractors: ['TREE', 'RIVER', 'BOOK', 'APPLE', 'BIRD', 'CAT', 'DOG', 'FISH'],
    complete: { word: 'HEART', incomplete: 'H _ A R T', hint: 'Beats with love and warmth', correct: 'E', options: ['E', 'A', 'O', 'I'] }
  },
  I: {
    words: ['ICE', 'ISLAND', 'IRON', 'IGLOO', 'INK', 'IRIS', 'INSECT', 'IMAGE'],
    distractors: ['WATER', 'TREE', 'FLOWER', 'HOUSE', 'SUN', 'BIRD', 'CAT', 'BOOK'],
    complete: { word: 'ISLAND', incomplete: 'I _ L A N D', hint: 'Land surrounded by water', correct: 'S', options: ['S', 'C', 'N', 'R'] }
  },
  J: {
    words: ['JAR', 'JACKET', 'JUICE', 'JUNGLE', 'JEWEL', 'JAM', 'JUMP', 'JOY'],
    distractors: ['CUP', 'COAT', 'WATER', 'FOREST', 'GOLD', 'TREE', 'BOOK', 'BIRD'],
    complete: { word: 'JUICE', incomplete: 'J _ I C E', hint: 'A sweet fruit drink', correct: 'U', options: ['U', 'O', 'A', 'E'] }
  },
  K: {
    words: ['KITE', 'KEY', 'KING', 'KETTLE', 'KITTEN', 'KITCHEN', 'KOALA', 'KIND'],
    distractors: ['BIRD', 'LOCK', 'HOUSE', 'CUP', 'CAT', 'DOG', 'TREE', 'APPLE'],
    complete: { word: 'KITE', incomplete: 'K _ T E', hint: 'Flies high in the windy sky', correct: 'I', options: ['I', 'E', 'A', 'O'] }
  },
  L: {
    words: ['LEAF', 'LAMP', 'LION', 'LEMON', 'LAKE', 'LOTUS', 'LOCK', 'LADDER'],
    distractors: ['TREE', 'SUN', 'TIGER', 'APPLE', 'RIVER', 'ROSE', 'KEY', 'HOUSE'],
    complete: { word: 'LOTUS', incomplete: 'L _ T U S', hint: 'A sacred blooming pond flower', correct: 'O', options: ['O', 'A', 'E', 'U'] }
  },
  M: {
    words: ['MANGO', 'MOON', 'MUSIC', 'MOUNTAIN', 'MONKEY', 'MILK', 'MIRROR', 'MORNING'],
    distractors: ['APPLE', 'SUN', 'SONG', 'HILL', 'DOG', 'WATER', 'GLASS', 'NIGHT'],
    complete: { word: 'MANGO', incomplete: 'M _ N G O', hint: 'Sweet golden summer fruit', correct: 'A', options: ['A', 'E', 'I', 'O'] }
  },
  N: {
    words: ['NEST', 'NUT', 'NET', 'NIGHT', 'NOSE', 'NEEDLE', 'NATURE', 'NOTE'],
    distractors: ['BIRD', 'TREE', 'FISH', 'DAY', 'EYE', 'THREAD', 'HOUSE', 'BOOK'],
    complete: { word: 'NEST', incomplete: 'N _ S T', hint: 'A cozy home for little birds', correct: 'E', options: ['E', 'A', 'I', 'O'] }
  },
  O: {
    words: ['ORANGE', 'OWL', 'OCEAN', 'ORCHID', 'ONION', 'OAK', 'OIL', 'OASIS'],
    distractors: ['APPLE', 'BIRD', 'RIVER', 'ROSE', 'VEGETABLE', 'TREE', 'WATER', 'SUN'],
    complete: { word: 'OCEAN', incomplete: 'O _ E A N', hint: 'Vast body of blue sea water', correct: 'C', options: ['C', 'S', 'T', 'L'] }
  },
  P: {
    words: ['PLANT', 'PEACOCK', 'PENCIL', 'PEACH', 'PANDA', 'PARROT', 'PIANO', 'PAPER'],
    distractors: ['TREE', 'BIRD', 'PEN', 'APPLE', 'BEAR', 'CAT', 'MUSIC', 'BOOK'],
    complete: { word: 'PLANT', incomplete: 'P _ A N T', hint: 'Grows green leaves in the garden', correct: 'L', options: ['L', 'R', 'N', 'T'] }
  },
  Q: {
    words: ['QUEEN', 'QUILT', 'QUIET', 'QUILL', 'QUICK', 'QUARTZ', 'QUEST', 'QUOTE'],
    distractors: ['KING', 'BLANKET', 'NOISE', 'PEN', 'FAST', 'STONE', 'BOOK', 'WORD'],
    complete: { word: 'QUEEN', incomplete: 'Q _ E E N', hint: 'A royal ruler wearing a crown', correct: 'U', options: ['U', 'O', 'A', 'I'] }
  },
  R: {
    words: ['ROSE', 'RIVER', 'RAINBOW', 'RABBIT', 'RING', 'RAIN', 'RADIO', 'RICE'],
    distractors: ['FLOWER', 'LAKE', 'SUN', 'CAT', 'GOLD', 'CLOUD', 'MUSIC', 'BREAD'],
    complete: { word: 'RIVER', incomplete: 'R _ V E R', hint: 'Flowing freshwater stream', correct: 'I', options: ['I', 'E', 'A', 'O'] }
  },
  S: {
    words: ['SUN', 'STAR', 'SMILE', 'SHIP', 'SONG', 'SPOON', 'SILVER', 'STREAM'],
    distractors: ['MOON', 'NIGHT', 'FACE', 'BOAT', 'MUSIC', 'FORK', 'GOLD', 'RIVER'],
    complete: { word: 'SMILE', incomplete: 'S _ I L E', hint: 'A cheerful, happy face', correct: 'M', options: ['M', 'N', 'L', 'T'] }
  },
  T: {
    words: ['TREE', 'TIGER', 'TEA', 'TABLE', 'TRAIN', 'TEMPLE', 'TULIP', 'TURTLE'],
    distractors: ['FLOWER', 'LION', 'COFFEE', 'CHAIR', 'CAR', 'HOUSE', 'ROSE', 'FISH'],
    complete: { word: 'TREE', incomplete: 'T _ E E', hint: 'Has green leaves and wooden trunk', correct: 'R', options: ['R', 'L', 'N', 'T'] }
  },
  U: {
    words: ['UMBRELLA', 'UNCLE', 'UNIFORM', 'UNIVERSE', 'URN', 'UKULELE', 'UNIQUE', 'UNIT'],
    distractors: ['RAIN', 'AUNT', 'CLOTHES', 'WORLD', 'POT', 'GUITAR', 'SPECIAL', 'ONE'],
    complete: { word: 'UMBRELLA', incomplete: 'U _ B R E L L A', hint: 'Protects us from rain and sun', correct: 'M', options: ['M', 'N', 'L', 'R'] }
  },
  V: {
    words: ['VILLAGE', 'VIOLIN', 'VASE', 'VALLEY', 'VIOLET', 'VANILLA', 'VOICE', 'VELVET'],
    distractors: ['CITY', 'GUITAR', 'POT', 'MOUNTAIN', 'ROSE', 'SUGAR', 'SOUND', 'SILK'],
    complete: { word: 'VILLAGE', incomplete: 'V _ L L A G E', hint: 'A peaceful rural community', correct: 'I', options: ['I', 'E', 'A', 'O'] }
  },
  W: {
    words: ['WATER', 'WIND', 'WHEEL', 'WINDOW', 'WATCH', 'WILLOW', 'WARMTH', 'WOOD'],
    distractors: ['JUICE', 'AIR', 'CART', 'DOOR', 'CLOCK', 'TREE', 'SUN', 'FOREST'],
    complete: { word: 'WATER', incomplete: 'W _ T E R', hint: 'Clear drink essential for life', correct: 'A', options: ['A', 'E', 'O', 'I'] }
  },
  X: {
    words: ['XYLOPHONE', 'X-RAY', 'XENON', 'XERUS', 'XYLOID', 'XYLOGRAPH'],
    distractors: ['PIANO', 'PHOTO', 'LIGHT', 'ANIMAL', 'TREE', 'BOOK'],
    complete: { word: 'XYLOPHONE', incomplete: 'X _ L O P H O N E', hint: 'A musical instrument with tuned bars', correct: 'Y', options: ['Y', 'I', 'E', 'A'] }
  },
  Y: {
    words: ['YACHT', 'YARN', 'YELLOW', 'YOGA', 'YOLK', 'YARD', 'YOUTH', 'YEAR'],
    distractors: ['BOAT', 'THREAD', 'BLUE', 'EXERCISE', 'EGG', 'GARDEN', 'AGE', 'TIME'],
    complete: { word: 'YELLOW', incomplete: 'Y _ L L O W', hint: 'The bright sunny color of sunflowers', correct: 'E', options: ['E', 'A', 'O', 'I'] }
  },
  Z: {
    words: ['ZEBRA', 'ZERO', 'ZINC', 'ZIPPER', 'ZONE', 'ZEST', 'ZINNIA', 'ZOO'],
    distractors: ['HORSE', 'NUMBER', 'METAL', 'BUTTON', 'PLACE', 'ENERGY', 'ROSE', 'PARK'],
    complete: { word: 'ZEBRA', incomplete: 'Z _ B R A', hint: 'An animal with black and white stripes', correct: 'E', options: ['E', 'A', 'I', 'O'] }
  }
};

/**
 * Generate 4 distinct, engaging rounds dynamically based on chosen letter
 */
function generateLetterRounds(letter) {
  const data = LETTER_VOCABULARY[letter] || LETTER_VOCABULARY.C;
  const targetWords = [...data.words];
  const distractors = [...data.distractors];

  // Helper shuffle
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  // Round 1: "Which word begins with [Letter]?"
  const r1Correct = targetWords[0];
  const r1Options = shuffle([r1Correct, distractors[0], distractors[1], distractors[2]]);

  // Round 2: "Select all words that begin with [Letter]."
  const r2Correct = [targetWords[1] || targetWords[0], targetWords[2] || targetWords[1], targetWords[3] || targetWords[2]];
  const r2Distractors = [distractors[3] || distractors[0], distractors[4] || distractors[1]];
  const r2Options = shuffle([...r2Correct, ...r2Distractors]);

  // Round 3: "Complete the word."
  const r3Data = data.complete;

  // Round 4: "Which word belongs to the selected letter?"
  const r4Correct = targetWords[4] || targetWords[1] || targetWords[0];
  const r4Options = shuffle([r4Correct, distractors[5] || distractors[0], distractors[6] || distractors[1], distractors[7] || distractors[2]]);

  return [
    {
      roundNum: 1,
      type: 'single',
      prompt: `Which word begins with ${letter}?`,
      options: r1Options,
      correct: r1Correct,
      explanation: `"${r1Correct}" begins with the letter ${letter}.`
    },
    {
      roundNum: 2,
      type: 'multi',
      prompt: `Select all words that begin with ${letter}:`,
      options: r2Options,
      correct: r2Correct,
      explanation: `Words starting with ${letter}: ${r2Correct.join(', ')}`
    },
    {
      roundNum: 3,
      type: 'complete',
      prompt: `Complete the word: ${r3Data.incomplete}`,
      subPrompt: r3Data.hint ? `(${r3Data.hint})` : '',
      incomplete: r3Data.incomplete,
      options: r3Data.options,
      correct: r3Data.correct,
      fullWord: r3Data.word,
      explanation: `${r3Data.word} is spelled with "${r3Data.correct}".`
    },
    {
      roundNum: 4,
      type: 'single',
      prompt: `Which word belongs to the letter ${letter}?`,
      options: r4Options,
      correct: r4Correct,
      explanation: `"${r4Correct}" belongs to the letter ${letter}.`
    }
  ];
}

export const LetterCWordGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const [selectedLetter, setSelectedLetter] = useState(null); // null means on "Choose a Letter" screen
  const [rounds, setRounds] = useState([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [multiSelected, setMultiSelected] = useState([]); // for Round 2 multi-select
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Pick letter & start game
  const handleSelectLetter = (letter) => {
    soundManager.playTap();
    setSelectedLetter(letter);
    const generated = generateLetterRounds(letter);
    setRounds(generated);
    setCurrentRoundIdx(0);
    setScore(0);
    setCorrectCount(0);
    setMultiSelected([]);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
    startTimeRef.current = Date.now();
    soundManager.playChime();
  };

  // Return to letter selection screen
  const handleChooseAnotherLetter = () => {
    soundManager.playTap();
    setSelectedLetter(null);
    setRounds([]);
    setCurrentRoundIdx(0);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
  };

  const handleRestartLetter = () => {
    if (selectedLetter) {
      handleSelectLetter(selectedLetter);
    } else {
      setSelectedLetter(null);
    }
  };

  // Toggle multi-select word in Round 2
  const handleToggleMultiWord = (word) => {
    if (isLocked) return;
    soundManager.playTap();
    if (multiSelected.includes(word)) {
      setMultiSelected(multiSelected.filter(w => w !== word));
    } else {
      setMultiSelected([...multiSelected, word]);
    }
  };

  // Submit single option for Round 1, Round 3, Round 4
  const handleSelectSingleOption = (opt) => {
    if (isLocked) return;
    setIsLocked(true); // Single click lock

    const currentRound = rounds[currentRoundIdx];
    const isCorrect = opt === currentRound.correct;

    finalizeRound(isCorrect, currentRound);
  };

  // Submit multi-select for Round 2
  const handleSubmitMultiSelect = () => {
    if (isLocked || multiSelected.length === 0) return;
    setIsLocked(true);

    const currentRound = rounds[currentRoundIdx];
    const targetSet = new Set(currentRound.correct);
    const userSet = new Set(multiSelected);

    // Accurate validation: all correct words chosen and zero incorrect distractors
    const isCorrect = targetSet.size === userSet.size && [...userSet].every(w => targetSet.has(w));

    finalizeRound(isCorrect, currentRound);
  };

  const finalizeRound = (isCorrect, currentRound) => {
    let newCorrect = correctCount;
    let newScore = score;

    if (isCorrect) {
      soundManager.playSuccess();
      newCorrect++;
      newScore += 10;
      setCorrectCount(newCorrect);
      setScore(newScore);
      setFeedback({ isCorrect: true, message: `Excellent! ${currentRound.explanation} 🌟` });
    } else {
      soundManager.playChime();
      setFeedback({ isCorrect: false, message: `Good try! ${currentRound.explanation} 🌿` });
    }

    setTimeout(() => {
      const nextIdx = currentRoundIdx + 1;
      if (nextIdx < rounds.length) {
        setCurrentRoundIdx(nextIdx);
        setMultiSelected([]);
        setFeedback(null);
        setIsLocked(false);
      } else {
        const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        const accuracy = Math.round((newCorrect / rounds.length) * 100);
        onCompleteRound({
          correctAnswers: newCorrect,
          totalQuestions: rounds.length,
          timeTakenSeconds: elapsed,
          score: newScore,
          accuracy
        });
      }
    }, 1300);
  };

  // ==========================================
  // SCREEN 1: CHOOSE A LETTER (A to Z)
  // ==========================================
  if (!selectedLetter || rounds.length === 0) {
    return (
      <div className="space-y-6 text-center max-w-3xl mx-auto select-none animate-fadeIn">
        {/* Header */}
        <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>🔤 Letter Word Game</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B3B2B]">
            Choose a Letter
          </h2>

          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            Select any letter below to begin. All 4 rounds will be customized for your chosen letter!
          </p>

          <VoiceButton textToRead="Choose a letter to begin your word game. Tap any letter from A to Z." />
        </div>

        {/* 26 Large Elderly-Friendly Letter Buttons (A–Z) */}
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {ALPHABET.map((char) => (
              <button
                key={char}
                onClick={() => handleSelectLetter(char)}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 hover:bg-amber-100 text-stone-900 font-serif font-black text-2xl sm:text-3xl border-2 border-amber-300/80 hover:border-[#1B3B2B] hover:scale-105 active:scale-95 shadow-sm transition-all flex items-center justify-center cursor-pointer group"
              >
                <span className="group-hover:text-[#1B3B2B]">{char}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exit option */}
        {onExit && (
          <div className="flex justify-center">
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm border border-stone-300 transition-all cursor-pointer"
            >
              Back to Games
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SCREEN 2: ACTIVE GAMEPLAY (Rounds 1–4)
  // ==========================================
  const currentRound = rounds[currentRoundIdx];

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto select-none animate-fadeIn">
      {/* Game Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              🔤 Letter {selectedLetter} Word Game • {difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Round: <strong className="text-[#1B3B2B] text-sm">{currentRoundIdx + 1} of {rounds.length}</strong>
            </span>
            <VoiceButton textToRead={`${currentRound.prompt} ${currentRound.subPrompt || ''}`} />
          </div>
        </div>

        {/* Selected Letter Badge & Prompt */}
        <div className="space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#1B3B2B] text-amber-200 font-serif font-black text-2xl mx-auto flex items-center justify-center shadow-xs">
            {selectedLetter}
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B] pt-1">
            {currentRound.prompt}
          </h3>
          {currentRound.subPrompt && (
            <p className="text-stone-500 text-xs sm:text-sm font-semibold">{currentRound.subPrompt}</p>
          )}
        </div>
      </div>

      {/* Instant Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base animate-fadeIn ${
          feedback.isCorrect
            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
            : 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* ROUND 1 & ROUND 4: Single Word Selection */}
      {currentRound.type === 'single' && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentRound.options.map((word) => (
              <button
                key={word}
                onClick={() => handleSelectSingleOption(word)}
                disabled={isLocked}
                className="p-4 sm:p-5 rounded-2xl font-bold text-lg sm:text-xl border-2 border-stone-200 bg-amber-50/50 hover:bg-amber-100 hover:border-[#1B3B2B] text-stone-900 transition-all hover:scale-102 active:scale-95 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ROUND 2: Multi-Word Selection */}
      {currentRound.type === 'multi' && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 shadow-md space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {currentRound.options.map((word) => {
              const isSelected = multiSelected.includes(word);

              return (
                <button
                  key={word}
                  onClick={() => handleToggleMultiWord(word)}
                  disabled={isLocked}
                  className={`p-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-md scale-102 ring-2 ring-amber-300'
                      : 'bg-amber-50/50 text-stone-800 border-stone-200 hover:border-amber-400 hover:bg-amber-100'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmitMultiSelect}
            disabled={isLocked || multiSelected.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            Submit Selection ({multiSelected.length} selected)
          </button>
        </div>
      )}

      {/* ROUND 3: Complete the Word */}
      {currentRound.type === 'complete' && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Incomplete Word Display */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border-2 border-stone-300 inline-block font-mono font-black text-2xl sm:text-4xl text-[#1B3B2B] tracking-widest">
            {currentRound.incomplete}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Choose the missing letter:
            </span>
            <div className="flex justify-center gap-3 sm:gap-4">
              {currentRound.options.map((letterOpt) => (
                <button
                  key={letterOpt}
                  onClick={() => handleSelectSingleOption(letterOpt)}
                  disabled={isLocked}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-serif font-black text-2xl sm:text-3xl border-2 border-amber-300 hover:border-[#1B3B2B] hover:scale-105 active:scale-95 shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  {letterOpt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar Controls: Choose Another Letter, Restart & Exit */}
      <div className="flex flex-wrap justify-between items-center bg-white border border-stone-200 rounded-2xl p-4 gap-3">
        <button
          onClick={handleChooseAnotherLetter}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose Another Letter</span>
        </button>

        <div className="flex items-center gap-2">
          {showRestartConfirm ? (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Restart?</span>
              <button
                onClick={handleRestartLetter}
                className="px-2.5 py-1 rounded-lg bg-[#1B3B2B] text-white cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
