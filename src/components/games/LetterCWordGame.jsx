import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { useLanguage } from '../../context/LanguageContext';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Comprehensive tiered vocabulary for all difficulties & letters
const TIERED_LETTER_VOCABULARY = {
  C: {
    EASY: {
      words: ['CAT', 'CUP', 'CAR', 'COW', 'CAP', 'CAN', 'COT', 'CUB'],
      distractors: ['DOG', 'SUN', 'BUS', 'PEN', 'BED', 'BAT', 'PAN', 'NET'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 3-letter word begins with C?', options: ['CAT', 'DOG', 'SUN', 'PEN'], correct: 'CAT', explanation: '"CAT" is a friendly 3-letter pet starting with C' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 3-4 letter words starting with C:', options: ['CUP', 'CAR', 'COW', 'DOG', 'BED'], correct: ['CUP', 'CAR', 'COW'], explanation: 'CUP, CAR, and COW are simple C words' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: C _ T', subPrompt: '(A friendly pet that purrs)', incomplete: 'C _ T', options: ['A', 'E', 'O', 'U'], correct: 'A', fullWord: 'CAT', explanation: 'CAT' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which everyday item begins with C?', options: ['CUP', 'PEN', 'BAT', 'NET'], correct: 'CUP', explanation: '"CUP" is used for drinking tea or water' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Pick the animal that gives milk starting with C:', options: ['COW', 'DOG', 'CAT', 'FOX'], correct: 'COW', explanation: '"COW" gives fresh milk' }
      ]
    },
    MEDIUM: {
      words: ['CHAIR', 'CLOCK', 'CLOUD', 'CAMEL', 'CANDLE', 'CABIN', 'CRANE', 'CHEST'],
      distractors: ['BREAD', 'TABLE', 'RIVER', 'HOUSE', 'PLANT', 'TRAIN', 'SMILE', 'TIGER'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 5-letter furniture word begins with C?', options: ['CHAIR', 'TABLE', 'BREAD', 'HOUSE'], correct: 'CHAIR', explanation: '"CHAIR" is furniture with 5 letters' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 5-6 letter words starting with C:', options: ['CLOCK', 'CLOUD', 'CANDLE', 'RIVER', 'PLANT'], correct: ['CLOCK', 'CLOUD', 'CANDLE'], explanation: 'CLOCK, CLOUD, and CANDLE are 5-6 letter C words' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: C H _ I R', subPrompt: '(A piece of furniture for sitting)', incomplete: 'C H _ I R', options: ['A', 'E', 'O', 'U'], correct: 'A', fullWord: 'CHAIR', explanation: 'CHAIR' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which word shows the time on a wall?', options: ['CLOCK', 'TRAIN', 'RIVER', 'SMILE'], correct: 'CLOCK', explanation: '"CLOCK" tells the time' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which provides warm gentle light when lit?', options: ['CANDLE', 'CABIN', 'TIGER', 'HOUSE'], correct: 'CANDLE', explanation: '"CANDLE" gives warm glowing light' }
      ]
    },
    HARD: {
      words: ['COCONUT', 'CRICKET', 'COMPASS', 'CRYSTAL', 'CARRIAGE', 'COURAGE', 'CLIMATE', 'CHARITY'],
      distractors: ['ELEPHANT', 'DIAMOND', 'MOUNTAIN', 'BUTTERFLY', 'FEATHER', 'RAINBOW', 'DOLPHIN', 'VIOLIN'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 7-letter tropical fruit begins with C?', options: ['COCONUT', 'DIAMOND', 'ELEPHANT', 'RAINBOW'], correct: 'COCONUT', explanation: '"COCONUT" is a tropical fruit with 7 letters' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all advanced 7+ letter words starting with C:', options: ['CRICKET', 'COMPASS', 'CRYSTAL', 'MOUNTAIN', 'FEATHER'], correct: ['CRICKET', 'COMPASS', 'CRYSTAL'], explanation: 'CRICKET, COMPASS, and CRYSTAL are advanced C words' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: C O M P _ S S', subPrompt: '(An instrument used for finding directions)', incomplete: 'C O M P _ S S', options: ['A', 'E', 'O', 'U'], correct: 'A', fullWord: 'COMPASS', explanation: 'COMPASS' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which sparkling mineral shines brightly?', options: ['CRYSTAL', 'DOLPHIN', 'VIOLIN', 'FEATHER'], correct: 'CRYSTAL', explanation: '"CRYSTAL" is a sparkling clear stone' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which word describes bravery and inner strength?', options: ['COURAGE', 'CARRIAGE', 'MOUNTAIN', 'DIAMOND'], correct: 'COURAGE', explanation: '"COURAGE" means bravery and inner strength' }
      ]
    }
  },
  A: {
    EASY: {
      words: ['ANT', 'ARM', 'AXE', 'APE', 'AIR', 'ASH'],
      distractors: ['BEE', 'LEG', 'SAW', 'CAT', 'SEA', 'ICE'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 3-letter word begins with A?', options: ['ANT', 'BEE', 'CAT', 'DOG'], correct: 'ANT', explanation: '"ANT" is a tiny 3-letter insect' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 3-letter words starting with A:', options: ['ANT', 'ARM', 'AXE', 'LEG', 'BEE'], correct: ['ANT', 'ARM', 'AXE'], explanation: 'ANT, ARM, and AXE begin with A' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: A _ T', subPrompt: '(A tiny hardworking insect)', incomplete: 'A _ T', options: ['N', 'R', 'P', 'T'], correct: 'N', fullWord: 'ANT', explanation: 'ANT' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which part of the body begins with A?', options: ['ARM', 'LEG', 'EAR', 'EYE'], correct: 'ARM', explanation: '"ARM" is an upper body limb' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Pick the 3-letter primate starting with A:', options: ['APE', 'CAT', 'DOG', 'PIG'], correct: 'APE', explanation: '"APE" is a clever primate' }
      ]
    },
    MEDIUM: {
      words: ['APPLE', 'ARROW', 'ACORN', 'ANGEL', 'ACTOR', 'ALBUM'],
      distractors: ['BERRY', 'SPEAR', 'NUT', 'SAINT', 'SINGER', 'BOOK'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 5-letter sweet fruit begins with A?', options: ['APPLE', 'BERRY', 'LEMON', 'MANGO'], correct: 'APPLE', explanation: '"APPLE" is a sweet 5-letter fruit' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 5-letter words starting with A:', options: ['APPLE', 'ARROW', 'ACORN', 'SPEAR', 'LEMON'], correct: ['APPLE', 'ARROW', 'ACORN'], explanation: 'APPLE, ARROW, and ACORN begin with A' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: A P P L _', subPrompt: '(A sweet red or green fruit)', incomplete: 'A P P L _', options: ['E', 'A', 'O', 'I'], correct: 'E', fullWord: 'APPLE', explanation: 'APPLE' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which oak tree nut begins with A?', options: ['ACORN', 'PEACH', 'BERRY', 'NUT'], correct: 'ACORN', explanation: '"ACORN" is an oak tree seed' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which heavenly winged figure begins with A?', options: ['ANGEL', 'SINGER', 'FAIRY', 'QUEEN'], correct: 'ANGEL', explanation: '"ANGEL" is a heavenly guardian' }
      ]
    },
    HARD: {
      words: ['AIRPLANE', 'AQUARIUM', 'ASTRONOMY', 'ADVENTURE', 'AMETHYST', 'ARCHITECT'],
      distractors: ['HELICOPTER', 'TERRARIUM', 'GEOGRAPHY', 'EXPEDITION', 'SAPPHIRE', 'ENGINEER'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which flying aircraft begins with A?', options: ['AIRPLANE', 'HELICOPTER', 'SUBMARINE', 'BALLOON'], correct: 'AIRPLANE', explanation: '"AIRPLANE" flies high in the sky' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all advanced 8+ letter words starting with A:', options: ['AIRPLANE', 'AQUARIUM', 'ADVENTURE', 'HELICOPTER', 'BALLOON'], correct: ['AIRPLANE', 'AQUARIUM', 'ADVENTURE'], explanation: 'AIRPLANE, AQUARIUM, and ADVENTURE are advanced A words' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: A D V E N T _ R E', subPrompt: '(An exciting and daring journey)', incomplete: 'A D V E N T _ R E', options: ['U', 'O', 'A', 'E'], correct: 'U', fullWord: 'ADVENTURE', explanation: 'ADVENTURE' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which glass home for swimming fish begins with A?', options: ['AQUARIUM', 'TERRARIUM', 'GARDEN', 'FOUNTAIN'], correct: 'AQUARIUM', explanation: '"AQUARIUM" holds colorful fish' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which purple precious gemstone begins with A?', options: ['AMETHYST', 'SAPPHIRE', 'EMERALD', 'RUBY'], correct: 'AMETHYST', explanation: '"AMETHYST" is a purple crystal gemstone' }
      ]
    }
  },
  B: {
    EASY: {
      words: ['BAT', 'BED', 'BUS', 'BOY', 'BAG', 'BOX', 'BEE', 'BOW'],
      distractors: ['CAT', 'SUN', 'CAR', 'GIRL', 'HAT', 'CUP', 'FLY', 'ARROW'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 3-letter word begins with B?', options: ['BAT', 'CAT', 'DOG', 'SUN'], correct: 'BAT', explanation: '"BAT" starts with B' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 3-letter words starting with B:', options: ['BED', 'BUS', 'BOY', 'CAT', 'SUN'], correct: ['BED', 'BUS', 'BOY'], explanation: 'BED, BUS, and BOY start with B' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: B _ S', subPrompt: '(Large vehicle for carrying passengers)', incomplete: 'B _ S', options: ['U', 'A', 'E', 'O'], correct: 'U', fullWord: 'BUS', explanation: 'BUS' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Where do we sleep at night starting with B?', options: ['BED', 'CHAIR', 'DESK', 'MAT'], correct: 'BED', explanation: '"BED" is where we rest and sleep' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which buzzing honey maker starts with B?', options: ['BEE', 'ANT', 'FLY', 'WASP'], correct: 'BEE', explanation: '"BEE" makes sweet honey' }
      ]
    },
    MEDIUM: {
      words: ['BANANA', 'BASKET', 'BRIDGE', 'BOTTLE', 'BREAD', 'BLOUSE'],
      distractors: ['ORANGE', 'BUCKET', 'TUNNEL', 'CUP', 'CAKE', 'SHIRT'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 6-letter yellow fruit begins with B?', options: ['BANANA', 'ORANGE', 'APPLE', 'MANGO'], correct: 'BANANA', explanation: '"BANANA" is a yellow fruit' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all 6-letter words starting with B:', options: ['BANANA', 'BASKET', 'BRIDGE', 'ORANGE', 'TUNNEL'], correct: ['BANANA', 'BASKET', 'BRIDGE'], explanation: 'BANANA, BASKET, and BRIDGE start with B' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: B R I D G _', subPrompt: '(A structure spanning across water or road)', incomplete: 'B R I D G _', options: ['E', 'A', 'O', 'I'], correct: 'E', fullWord: 'BRIDGE', explanation: 'BRIDGE' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • What container made of woven reeds begins with B?', options: ['BASKET', 'BUCKET', 'BOX', 'BAG'], correct: 'BASKET', explanation: '"BASKET" holds fruit or bread' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which fresh baked food begins with B?', options: ['BREAD', 'RICE', 'SOUP', 'PASTA'], correct: 'BREAD', explanation: '"BREAD" is a staple baked food' }
      ]
    },
    HARD: {
      words: ['BUTTERFLY', 'BEAUTIFUL', 'BALLOON', 'BOUQUET', 'BLUEBERRY', 'BRILLIANT'],
      distractors: ['DRAGONFLY', 'GORGEOUS', 'AIRPLANE', 'FLOWERS', 'RASPBERRY', 'SHINING'],
      levels: [
        { roundNum: 1, type: 'single', prompt: 'Level 1 • Which 9-letter winged insect begins with B?', options: ['BUTTERFLY', 'DRAGONFLY', 'MOSQUITO', 'LADYBUG'], correct: 'BUTTERFLY', explanation: '"BUTTERFLY" has colorful fluttery wings' },
        { roundNum: 2, type: 'multi', prompt: 'Level 2 • Select all advanced 8+ letter words starting with B:', options: ['BUTTERFLY', 'BEAUTIFUL', 'BLUEBERRY', 'DRAGONFLY', 'GORGEOUS'], correct: ['BUTTERFLY', 'BEAUTIFUL', 'BLUEBERRY'], explanation: 'BUTTERFLY, BEAUTIFUL, and BLUEBERRY start with B' },
        { roundNum: 3, type: 'complete', prompt: 'Level 3 • Complete the word: B _ U Q U E T', subPrompt: '(An arranged bunch of fragrant flowers)', incomplete: 'B _ U Q U E T', options: ['O', 'A', 'E', 'I'], correct: 'O', fullWord: 'BOUQUET', explanation: 'BOUQUET' },
        { roundNum: 4, type: 'single', prompt: 'Level 4 • Which small sweet blue berry begins with B?', options: ['BLUEBERRY', 'RASPBERRY', 'CRANBERRY', 'CHERRY'], correct: 'BLUEBERRY', explanation: '"BLUEBERRY" is rich in healthy antioxidants' },
        { roundNum: 5, type: 'single', prompt: 'Level 5 • Which word means shining and exceptionally smart?', options: ['BRILLIANT', 'GLOWING', 'TALENTED', 'RADIANT'], correct: 'BRILLIANT', explanation: '"BRILLIANT" means shining brightly and wisely' }
      ]
    }
  }
};

// Fallback generator for other letters
function generateTieredLevelsForLetter(letter, diff = 'EASY', t = {}) {
  const upperChar = letter.toUpperCase();
  if (TIERED_LETTER_VOCABULARY[upperChar] && TIERED_LETTER_VOCABULARY[upperChar][diff]) {
    return TIERED_LETTER_VOCABULARY[upperChar][diff].levels;
  }

  // Generic fallback if not hardcoded
  if (diff === 'EASY') {
    return [
      { roundNum: 1, type: 'single', prompt: `Level 1 • Which 3-4 letter word begins with ${upperChar}?`, options: [`${upperChar}AT`, 'DOG', 'SUN', 'PEN'], correct: `${upperChar}AT`, explanation: `"${upperChar}AT" begins with ${upperChar}` },
      { roundNum: 2, type: 'multi', prompt: `Level 2 • Select all simple words starting with ${upperChar}:`, options: [`${upperChar}UP`, `${upperChar}AR`, `${upperChar}OW`, 'DOG', 'BED'], correct: [`${upperChar}UP`, `${upperChar}AR`, `${upperChar}OW`], explanation: `Words starting with ${upperChar}` },
      { roundNum: 3, type: 'complete', prompt: `Level 3 • Complete the word: ${upperChar} _ P`, subPrompt: '(Simple everyday item)', incomplete: `${upperChar} _ P`, options: ['U', 'A', 'E', 'O'], correct: 'U', fullWord: `${upperChar}UP`, explanation: `${upperChar}UP` },
      { roundNum: 4, type: 'single', prompt: `Level 4 • Pick the word that starts with ${upperChar}:`, options: [`${upperChar}AN`, 'BOX', 'TOY', 'HAT'], correct: `${upperChar}AN`, explanation: `"${upperChar}AN" begins with ${upperChar}` },
      { roundNum: 5, type: 'single', prompt: `Level 5 • Final challenge for letter ${upperChar}:`, options: [`${upperChar}OP`, 'BED', 'CAT', 'FOX'], correct: `${upperChar}OP`, explanation: `"${upperChar}OP" begins with ${upperChar}` }
    ];
  } else if (diff === 'MEDIUM') {
    return [
      { roundNum: 1, type: 'single', prompt: `Level 1 • Which 5-6 letter word begins with ${upperChar}?`, options: [`${upperChar}HAIR`, 'TABLE', 'BREAD', 'HOUSE'], correct: `${upperChar}HAIR`, explanation: `"${upperChar}HAIR" has 5 letters starting with ${upperChar}` },
      { roundNum: 2, type: 'multi', prompt: `Level 2 • Select all 5-6 letter words starting with ${upperChar}:`, options: [`${upperChar}LOCK`, `${upperChar}LOUD`, `${upperChar}ANDLE`, 'RIVER', 'PLANT'], correct: [`${upperChar}LOCK`, `${upperChar}LOUD`, `${upperChar}ANDLE`], explanation: `5-6 letter words starting with ${upperChar}` },
      { roundNum: 3, type: 'complete', prompt: `Level 3 • Complete the word: ${upperChar} L _ U D`, subPrompt: '(A fluffy sky shape)', incomplete: `${upperChar} L _ U D`, options: ['O', 'A', 'E', 'I'], correct: 'O', fullWord: `${upperChar}LOUD`, explanation: `${upperChar}LOUD` },
      { roundNum: 4, type: 'single', prompt: `Level 4 • Pick the 5-letter word for ${upperChar}:`, options: [`${upperChar}AMEL`, 'TRAIN', 'RIVER', 'SMILE'], correct: `${upperChar}AMEL`, explanation: `"${upperChar}AMEL" begins with ${upperChar}` },
      { roundNum: 5, type: 'single', prompt: `Level 5 • Which word begins with ${upperChar}?`, options: [`${upperChar}RANE`, 'TIGER', 'HOUSE', 'CHEST'], correct: `${upperChar}RANE`, explanation: `"${upperChar}RANE" begins with ${upperChar}` }
    ];
  } else {
    return [
      { roundNum: 1, type: 'single', prompt: `Level 1 • Which advanced word begins with ${upperChar}?`, options: [`${upperChar}OMPASS`, 'DIAMOND', 'ELEPHANT', 'RAINBOW'], correct: `${upperChar}OMPASS`, explanation: `"${upperChar}OMPASS" begins with ${upperChar}` },
      { roundNum: 2, type: 'multi', prompt: `Level 2 • Select all advanced words starting with ${upperChar}:`, options: [`${upperChar}RYSTAL`, `${upperChar}OURAGE`, `${upperChar}LIMATE`, 'MOUNTAIN', 'FEATHER'], correct: [`${upperChar}RYSTAL`, `${upperChar}OURAGE`, `${upperChar}LIMATE`], explanation: `Advanced words starting with ${upperChar}` },
      { roundNum: 3, type: 'complete', prompt: `Level 3 • Complete the word: ${upperChar} R Y S T _ L`, subPrompt: '(A sparkling clear mineral)', incomplete: `${upperChar} R Y S T _ L`, options: ['A', 'E', 'O', 'U'], correct: 'A', fullWord: `${upperChar}RYSTAL`, explanation: `${upperChar}RYSTAL` },
      { roundNum: 4, type: 'single', prompt: `Level 4 • Pick the 7+ letter word starting with ${upperChar}:`, options: [`${upperChar}ARRIAGE`, 'DOLPHIN', 'VIOLIN', 'FEATHER'], correct: `${upperChar}ARRIAGE`, explanation: `"${upperChar}ARRIAGE" begins with ${upperChar}` },
      { roundNum: 5, type: 'single', prompt: `Level 5 • Grand master challenge for ${upperChar}:`, options: [`${upperChar}HARITY`, 'MOUNTAIN', 'DIAMOND', 'COURAGE'], correct: `${upperChar}HARITY`, explanation: `"${upperChar}HARITY" begins with ${upperChar}` }
    ];
  }
}

export const LetterCWordGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const { t } = useLanguage();
  const [selectedLetter, setSelectedLetter] = useState('C');
  const [rounds, setRounds] = useState([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [multiSelected, setMultiSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const letter = selectedLetter || 'C';
    const generated = generateTieredLevelsForLetter(letter, difficulty, t);
    setRounds(generated);
    setCurrentRoundIdx(0);
    setScore(0);
    setCorrectCount(0);
    setMultiSelected([]);
    setFeedback(null);
    setIsLocked(false);
    startTimeRef.current = Date.now();
  }, [selectedLetter, difficulty]);

  const handleSelectLetter = (letter) => {
    soundManager.playTap();
    setSelectedLetter(letter);
    const generated = generateTieredLevelsForLetter(letter, difficulty, t);
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

  const handleChooseAnotherLetter = () => {
    soundManager.playTap();
    setSelectedLetter(null);
    setRounds([]);
    setCurrentRoundIdx(0);
    setFeedback(null);
    setIsLocked(false);
    setShowRestartConfirm(false);
  };

  const handleSelectLevel = (idx) => {
    if (isLocked) return;
    soundManager.playTap();
    setCurrentRoundIdx(idx);
    setMultiSelected([]);
    setFeedback(null);
    setIsLocked(false);
  };

  const handleRestartLetter = () => {
    const letter = selectedLetter || 'C';
    handleSelectLetter(letter);
  };

  const handleToggleMultiWord = (word) => {
    if (isLocked) return;
    soundManager.playTap();
    if (multiSelected.includes(word)) {
      setMultiSelected(multiSelected.filter(w => w !== word));
    } else {
      setMultiSelected([...multiSelected, word]);
    }
  };

  const handleSelectSingleOption = (opt) => {
    if (isLocked) return;
    setIsLocked(true);

    const currentRound = rounds[currentRoundIdx];
    const isCorrect = opt === currentRound.correct;
    finalizeRound(isCorrect, currentRound);
  };

  const handleSubmitMultiSelect = () => {
    if (isLocked || multiSelected.length === 0) return;
    setIsLocked(true);

    const currentRound = rounds[currentRoundIdx];
    const targetSet = new Set(currentRound.correct);
    const userSet = new Set(multiSelected);

    const isCorrect = targetSet.size === userSet.size && [...userSet].every(w => targetSet.has(w));
    finalizeRound(isCorrect, currentRound);
  };

  const finalizeRound = (isCorrect, currentRound) => {
    let newCorrect = correctCount;
    let newScore = score;

    if (isCorrect) {
      soundManager.playSuccess();
      newCorrect++;
      newScore += 20;
      setCorrectCount(newCorrect);
      setScore(newScore);
      setFeedback({ isCorrect: true, message: `${t.games?.wonderful || "Wonderful!"} ${currentRound.explanation} 🌟` });
    } else {
      soundManager.playChime();
      setFeedback({ isCorrect: false, message: `${t.games?.lovelyEffort || "Good try!"} ${currentRound.explanation} 🌿` });
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
        const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';

        onCompleteRound({
          correctAnswers: newCorrect,
          totalQuestions: rounds.length,
          timeTakenSeconds: elapsed,
          score: newScore,
          accuracy,
          level: 5,
          nextDifficulty: nextLvl
        });
      }
    }, 1200);
  };

  // SCREEN 1: CHOOSE A LETTER
  if (!selectedLetter || rounds.length === 0) {
    return (
      <div className="space-y-6 text-center max-w-3xl mx-auto select-none animate-fadeIn">
        <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>🔤 {t.games?.letterCTitle || "Letter Word Game"} • {difficulty}</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1B3B2B]">
            {t.games?.chooseLetter || "Choose a Letter"}
          </h2>

          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            {t.games?.chooseLetterSub || "Select any letter below to begin. All 5 levels will be tailored for your chosen letter and difficulty grade!"}
          </p>

          <VoiceButton textToRead={`${t.games?.chooseLetter || 'Choose a Letter'}. ${t.games?.chooseLetterSub || 'Select any letter to begin'}`} />
        </div>

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

        {onExit && (
          <div className="flex justify-center">
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm border border-stone-300 transition-all cursor-pointer"
            >
              {t.games?.backToGames || "Back to Games"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 2: ACTIVE GAMEPLAY
  const currentRound = rounds[currentRoundIdx] || rounds[0];

  return (
    <div className="space-y-6 text-center max-w-2xl mx-auto select-none animate-fadeIn">
      {/* Game Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              🔤 {t.games?.letterCTitle || "Letter"} {selectedLetter} • {difficulty}
            </span>
          </div>

          {/* Level 1-5 Pills */}
          <div className="flex items-center gap-1.5">
            {rounds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLevel(idx)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentRoundIdx === idx
                    ? 'bg-[#1B3B2B] text-amber-200 shadow-sm border border-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                }`}
              >
                Lvl {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              {t.games?.round || "Level"}: <strong className="text-[#1B3B2B] text-sm">{currentRoundIdx + 1} / {rounds.length}</strong>
            </span>
            <VoiceButton textToRead={`${currentRound.prompt} ${currentRound.subPrompt || ''}`} />
          </div>
        </div>

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

      {feedback && (
        <div className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base animate-fadeIn ${
          feedback.isCorrect
            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
            : 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Single Selection (R1, R4, R5) */}
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

      {/* Multi-Word Selection (R2) */}
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
            {t.games?.submitSelection || "Submit Selection"} ({multiSelected.length} {t.games?.selected || "selected"})
          </button>
        </div>
      )}

      {/* Complete the Word (R3) */}
      {currentRound.type === 'complete' && (
        <div className="bg-white border-3 border-[#C99E32] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border-2 border-stone-300 inline-block font-mono font-black text-2xl sm:text-4xl text-[#1B3B2B] tracking-widest">
            {currentRound.incomplete}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              {t.games?.chooseMissingLetter || "Choose the missing letter:"}
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

      {/* Bottom Controls */}
      <div className="flex flex-wrap justify-between items-center bg-white border border-stone-200 rounded-2xl p-4 gap-3">
        <button
          onClick={handleChooseAnotherLetter}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.games?.chooseAnotherLetter || "Choose Another Letter"}</span>
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
              <span>{t.games?.restartGame || "Restart"}</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 transition-all cursor-pointer"
            >
              {t.games?.exitGame || "Exit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

