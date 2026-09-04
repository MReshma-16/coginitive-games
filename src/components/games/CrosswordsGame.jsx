import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, CheckCircle2, RotateCcw, Lightbulb, ArrowRight, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { useLanguage } from '../../context/LanguageContext';

const VERIFIED_PUZZLES = {
  EASY: [
    {
      id: 'easy-1',
      title: 'Level 1 • Peace & Nature',
      gridSize: 6,
      words: [
        { id: '1A', word: 'CARE', clue: 'Loving attention and warm kindness', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'CALM', clue: 'Peaceful, quiet, and relaxed state', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'RAIN', clue: 'Gentle water drops falling from sky', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3A', word: 'MINE', clue: 'Belonging to oneself or family', dir: 'across', row: 4, col: 1, number: 3 }
      ]
    },
    {
      id: 'easy-2',
      title: 'Level 2 • Family & Home',
      gridSize: 6,
      words: [
        { id: '1A', word: 'HOME', clue: 'A cozy place where family lives and rests', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'HOPE', clue: 'Feeling that bright and good things will happen', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'MEND', clue: 'To repair or make whole with care', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3A', word: 'ENDS', clue: 'Reaches a peaceful finish or close', dir: 'across', row: 4, col: 1, number: 3 }
      ]
    },
    {
      id: 'easy-3',
      title: 'Level 3 • Forest Birds & Roses',
      gridSize: 6,
      words: [
        { id: '1A', word: 'BIRD', clue: 'A feathered singing creature of the trees', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'BEAR', clue: 'Strong gentle woodland animal', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'ROSE', clue: 'Fragrant sweet flower in the garden', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3A', word: 'REST', clue: 'To relax quietly and restore strength', dir: 'across', row: 4, col: 1, number: 3 }
      ]
    },
    {
      id: 'easy-4',
      title: 'Level 4 • Serene Lake & Green Leaves',
      gridSize: 6,
      words: [
        { id: '1A', word: 'LAKE', clue: 'Calm shimmering body of fresh water', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'LEAF', clue: 'Green foliage growing on tea trees', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'KIND', clue: 'Gentle, warm-hearted and considerate', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3A', word: 'FIND', clue: 'To discover something joyful and pleasant', dir: 'across', row: 4, col: 1, number: 3 }
      ]
    },
    {
      id: 'easy-5',
      title: 'Level 5 • Warm Breeze & Dear Friends',
      gridSize: 6,
      words: [
        { id: '1A', word: 'WARM', clue: 'Comforting mild heat like morning tea', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'WIND', clue: 'Gentle moving breeze across the hills', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'ROAD', clue: 'A pathway leading to village home', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3A', word: 'DEAR', clue: 'Precious and beloved to our hearts', dir: 'across', row: 4, col: 1, number: 3 }
      ]
    }
  ],
  MEDIUM: [
    {
      id: 'med-1',
      title: 'Level 1 • Living Earth & Garden',
      gridSize: 7,
      words: [
        { id: '1A', word: 'PLATE', clue: 'A clean dish we serve our meal on', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'PEACE', clue: 'Quiet calm, serenity, and contentment', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'ACTOR', clue: 'A talented performer on stage or film', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'EARTH', clue: 'Our wonderful green living planet', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'AFTER', clue: 'Following later in time or sequence', dir: 'across', row: 3, col: 1, number: 4 },
        { id: '5A', word: 'EARTH', clue: 'The fertile soil and ground beneath us', dir: 'across', row: 5, col: 1, number: 5 }
      ]
    },
    {
      id: 'med-2',
      title: 'Level 2 • Morning Sunshine',
      gridSize: 7,
      words: [
        { id: '1A', word: 'SWEET', clue: 'Pleasant sugary taste like honey or ripe fruit', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'SHINE', clue: 'To give off bright and cheerful light', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'EARLY', clue: 'Near the beginning of the morning day', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'TREES', clue: 'Tall woody plants with green branches and leaves', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'INNER', clue: 'Located inside or deep within the heart', dir: 'across', row: 3, col: 1, number: 4 },
        { id: '5A', word: 'EYES', clue: 'Organs of sight that allow us to see beauty', dir: 'across', row: 5, col: 1, number: 5 }
      ]
    },
    {
      id: 'med-3',
      title: 'Level 3 • Tea Gardens & Harvest',
      gridSize: 7,
      words: [
        { id: '1A', word: 'GREEN', clue: 'Fresh vibrant color of tea leaves', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'GRASS', clue: 'Soft green lawn under foot', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'EARTH', clue: 'Rich soil nurturing our garden', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'NIGHT', clue: 'Time when stars sparkle in the sky', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'AURA', clue: 'Gentle glowing radiance of peace', dir: 'across', row: 3, col: 1, number: 4 },
        { id: '5A', word: 'SEAT', clue: 'A comfortable chair to rest upon', dir: 'across', row: 5, col: 1, number: 5 }
      ]
    },
    {
      id: 'med-4',
      title: 'Level 4 • River Streams & Valleys',
      gridSize: 7,
      words: [
        { id: '1A', word: 'RIVER', clue: 'Flowing body of fresh mountain water', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'ROSES', clue: 'Fragrant blooming garden flowers', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'VALE', clue: 'Peaceful green valley between hills', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'RAIN', clue: 'Cool showers nourishing plants', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'SEAL', clue: 'To close securely with care', dir: 'across', row: 3, col: 1, number: 4 }
      ]
    },
    {
      id: 'med-5',
      title: 'Level 5 • Folk Melodies & Memories',
      gridSize: 7,
      words: [
        { id: '1A', word: 'MUSIC', clue: 'Harmonious sounds played on instruments', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'MANGO', clue: 'Sweet golden tropical summer fruit', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'SONG', clue: 'Melodic tune sung with heartfelt joy', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'CARE', clue: 'Devotion and kind attention to loved ones', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'NEAR', clue: 'Close by in distance or memory', dir: 'across', row: 3, col: 1, number: 4 }
      ]
    }
  ],
  HARD: [
    {
      id: 'hard-1',
      title: 'Level 1 • Wisdom & Golden Harmony',
      gridSize: 8,
      words: [
        { id: '1A', word: 'SPRING', clue: 'Season of blossoming flowers and fresh renewal', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'SMILE', clue: 'A warm, happy expression across the face', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'RIVER', clue: 'A flowing stream of fresh water to the sea', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'GREEN', clue: 'The rich color of healthy tea leaves and grass', dir: 'down', row: 1, col: 6, number: 3 },
        { id: '4A', word: 'IMAGE', clue: 'A visual likeness, photograph, or picture', dir: 'across', row: 3, col: 1, number: 4 },
        { id: '5A', word: 'EARN', clue: 'To gain or receive through sincere effort', dir: 'across', row: 5, col: 1, number: 5 }
      ]
    },
    {
      id: 'hard-2',
      title: 'Level 2 • Heritage & Sunlight',
      gridSize: 8,
      words: [
        { id: '1A', word: 'FLOWER', clue: 'A fragrant blossom blooming in the garden', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'FAMILY', clue: 'The beloved relatives closest to our heart', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'WATER', clue: 'Clear life-giving liquid we drink every day', dir: 'down', row: 1, col: 4, number: 2 },
        { id: '3A', word: 'MEET', clue: 'To come together with friends and loved ones', dir: 'across', row: 3, col: 1, number: 3 },
        { id: '4A', word: 'YEAR', clue: 'A period of twelve months and four seasons', dir: 'across', row: 6, col: 1, number: 4 }
      ]
    },
    {
      id: 'hard-3',
      title: 'Level 3 • Ancient Temples & Valleys',
      gridSize: 8,
      words: [
        { id: '1A', word: 'NATURE', clue: 'The physical world including plants and animals', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'NOBLE', clue: 'Having fine personal qualities or high dignity', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'TREES', clue: 'Tall green pine and bamboo groves', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'REST', clue: 'Tranquil peaceful repose after daily activities', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'BEAT', clue: 'Rhythm of folk drums during festival dance', dir: 'across', row: 3, col: 1, number: 4 }
      ]
    },
    {
      id: 'hard-4',
      title: 'Level 4 • Sacred Mountains & Rivers',
      gridSize: 8,
      words: [
        { id: '1A', word: 'SILVER', clue: 'Shiny white precious metal like moonlight', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'SERENE', clue: 'Peaceful, untroubled and tranquil state', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'LIGHT', clue: 'Bright illumination from the golden sun', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'EARTH', clue: 'The fertile soil of North-Eastern hills', dir: 'down', row: 1, col: 5, number: 3 },
        { id: '4A', word: 'RING', clue: 'Circular ornament or phumdi on Loktak Lake', dir: 'across', row: 3, col: 1, number: 4 }
      ]
    },
    {
      id: 'hard-5',
      title: 'Level 5 • Grand Celebration & Memory',
      gridSize: 8,
      words: [
        { id: '1A', word: 'GOLDEN', clue: 'Shining yellow color of Muga silk and morning sun', dir: 'across', row: 1, col: 1, number: 1 },
        { id: '1D', word: 'GARDEN', clue: 'Planted area with blooming flowers and orchids', dir: 'down', row: 1, col: 1, number: 1 },
        { id: '2D', word: 'LAKE', clue: 'Vast peaceful water body like Loktak Lake', dir: 'down', row: 1, col: 3, number: 2 },
        { id: '3D', word: 'DEAR', clue: 'Beloved family member held close in heart', dir: 'down', row: 1, col: 4, number: 3 },
        { id: '4A', word: 'RAIN', clue: 'Gentle raindrops falling over the tea hills', dir: 'across', row: 3, col: 1, number: 4 }
      ]
    }
  ]
};

function validateCrosswordPuzzle(puzzle) {
  if (!puzzle || !puzzle.words || puzzle.words.length === 0) return false;

  const letterGrid = {};

  for (const w of puzzle.words) {
    if (!w.word || w.word.length === 0) return false;
    const len = w.word.length;

    for (let i = 0; i < len; i++) {
      const r = w.dir === 'across' ? w.row : w.row + i;
      const c = w.dir === 'across' ? w.col + i : w.col;
      const char = w.word[i].toUpperCase();

      if (r < 0 || r >= puzzle.gridSize || c < 0 || c >= puzzle.gridSize) {
        return false;
      }

      const key = `${r},${c}`;
      if (letterGrid[key] && letterGrid[key] !== char) {
        return false;
      }

      letterGrid[key] = char;
    }
  }

  return true;
}

export const CrosswordsGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const { t } = useLanguage();
  const [puzzle, setPuzzle] = useState(null);
  const [userGrid, setUserGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedClue, setSelectedClue] = useState(null);
  const [completedWordIds, setCompletedWordIds] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    initPuzzle();
  }, [difficulty]);

  const initPuzzle = () => {
    startTimeRef.current = Date.now();
    setCompletedWordIds([]);
    setHintsUsed(0);
    setShowRestartConfirm(false);
    setValidationError(false);

    const puzzleList = VERIFIED_PUZZLES[difficulty] || VERIFIED_PUZZLES.EASY;
    const chosenPuzzle = puzzleList[Math.floor(Math.random() * puzzleList.length)];

    const isValid = validateCrosswordPuzzle(chosenPuzzle);
    if (!isValid) {
      setValidationError(true);
      return;
    }

    setPuzzle(chosenPuzzle);

    const grid = Array(chosenPuzzle.gridSize).fill(null).map(() => Array(chosenPuzzle.gridSize).fill(''));
    setUserGrid(grid);

    if (chosenPuzzle.words && chosenPuzzle.words.length > 0) {
      const firstClue = chosenPuzzle.words[0];
      setSelectedClue(firstClue);
      setSelectedCell({ r: firstClue.row, c: firstClue.col });
    }

    soundManager.playChime();
  };

  const getCellMeta = (r, c) => {
    if (!puzzle?.words) return null;
    let number = null;
    let isActive = false;
    let relatedWords = [];

    puzzle.words.forEach(w => {
      const len = w.word.length;
      for (let i = 0; i < len; i++) {
        const cellR = w.dir === 'across' ? w.row : w.row + i;
        const cellC = w.dir === 'across' ? w.col + i : w.col;
        if (cellR === r && cellC === c) {
          isActive = true;
          relatedWords.push(w);
          if (i === 0) {
            number = w.number;
          }
        }
      }
    });

    return isActive ? { number, relatedWords } : null;
  };

  const handleCellClick = (r, c) => {
    const meta = getCellMeta(r, c);
    if (!meta) return;

    soundManager.playTap();
    setSelectedCell({ r, c });

    if (meta.relatedWords.length > 0) {
      const currentId = selectedClue?.id;
      const nextWord = meta.relatedWords.find(w => w.id !== currentId) || meta.relatedWords[0];
      setSelectedClue(nextWord);
    }
  };

  const handleSelectClue = (clue) => {
    soundManager.playTap();
    setSelectedClue(clue);
    setSelectedCell({ r: clue.row, c: clue.col });
  };

  const handleKeyPress = (letter) => {
    if (!selectedCell || !puzzle) return;
    const { r, c } = selectedCell;

    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = letter.toUpperCase();
    setUserGrid(newGrid);
    soundManager.playTap();

    if (selectedClue) {
      const isAcross = selectedClue.dir === 'across';
      const nextR = isAcross ? r : r + 1;
      const nextC = isAcross ? c + 1 : c;

      const offset = isAcross ? nextC - selectedClue.col : nextR - selectedClue.row;
      if (offset >= 0 && offset < selectedClue.word.length) {
        setSelectedCell({ r: nextR, c: nextC });
      }
    }

    validateGrid(newGrid);
  };

  const handleBackspace = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;

    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = '';
    setUserGrid(newGrid);
    soundManager.playTap();

    if (selectedClue) {
      const isAcross = selectedClue.dir === 'across';
      const prevR = isAcross ? r : r - 1;
      const prevC = isAcross ? c - 1 : c;
      const offset = isAcross ? prevC - selectedClue.col : prevR - selectedClue.row;
      if (offset >= 0 && offset < selectedClue.word.length) {
        setSelectedCell({ r: prevR, c: prevC });
      }
    }
  };

  const handleHint = () => {
    if (!selectedClue || !puzzle) return;
    soundManager.playChime();
    setHintsUsed(prev => prev + 1);

    const newGrid = userGrid.map(row => [...row]);

    for (let i = 0; i < selectedClue.word.length; i++) {
      const r = selectedClue.dir === 'across' ? selectedClue.row : selectedClue.row + i;
      const c = selectedClue.dir === 'across' ? selectedClue.col + i : selectedClue.col;
      const targetChar = selectedClue.word[i].toUpperCase();

      if (newGrid[r][c] !== targetChar) {
        newGrid[r][c] = targetChar;
        setSelectedCell({ r, c });
        break;
      }
    }

    setUserGrid(newGrid);
    validateGrid(newGrid);
  };

  const validateGrid = (gridToTest) => {
    if (!puzzle) return;
    const newlyCompleted = [];

    puzzle.words.forEach(w => {
      let isWordCorrect = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.dir === 'across' ? w.row : w.row + i;
        const c = w.dir === 'across' ? w.col + i : w.col;
        if (gridToTest[r][c] !== w.word[i].toUpperCase()) {
          isWordCorrect = false;
          break;
        }
      }
      if (isWordCorrect) {
        newlyCompleted.push(w.id);
      }
    });

    if (newlyCompleted.length > completedWordIds.length) {
      soundManager.playSuccess();
    }
    setCompletedWordIds(newlyCompleted);

    if (newlyCompleted.length === puzzle.words.length) {
      soundManager.playSuccess();
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const penalty = hintsUsed * 5;
      const finalScore = Math.max(50, 100 - penalty);
      const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';

      setTimeout(() => {
        onCompleteRound({
          correctAnswers: puzzle.words.length,
          totalQuestions: puzzle.words.length,
          timeTakenSeconds: elapsed,
          score: finalScore,
          accuracy: 100,
          nextDifficulty: nextLvl
        });
      }, 800);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, selectedClue, userGrid, puzzle]);

  if (validationError || !puzzle) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-rose-300 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-rose-800">Generating Crossword Puzzle...</h3>
        <button
          onClick={initPuzzle}
          className="px-6 py-2.5 rounded-xl bg-[#1B3B2B] text-white font-bold text-sm cursor-pointer"
        >
          Load Puzzle
        </button>
      </div>
    );
  }

  const acrossClues = puzzle.words.filter(w => w.dir === 'across');
  const downClues = puzzle.words.filter(w => w.dir === 'down');

  const onScreenKeyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  return (
    <div className="space-y-6 text-center max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            📰 {t.games?.crosswordsTitle || "Crosswords"} • {difficulty} ({puzzle.title})
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              {t.games?.wordsSolved || "Words Solved"}: <strong className="text-emerald-800 text-sm">{completedWordIds.length} / {puzzle.words.length}</strong>
            </span>
            <VoiceButton textToRead={`${t.games?.crosswordsTitle || 'Crosswords'}. ${selectedClue ? selectedClue.clue : 'Select a clue to begin.'}`} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {t.games?.crosswordsInstruction || "Complete the Crossword Puzzle"}
        </h3>

        {selectedClue && (
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 text-sm font-semibold text-[#1B3B2B] flex items-center justify-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#1B3B2B] text-amber-200 text-xs font-bold">
              {selectedClue.number} {selectedClue.dir === 'across' ? (t.games?.crosswordsAcross || 'ACROSS') : (t.games?.crosswordsDown || 'DOWN')}
            </span>
            <span className="text-stone-800 font-bold">"{selectedClue.clue}"</span>
            <span className="text-xs text-stone-500 font-semibold">({selectedClue.word.length} letters)</span>
          </div>
        )}
      </div>

      {/* Crossword Grid & Clues */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Crossword Grid */}
        <div className="md:col-span-7 bg-white border-3 border-[#C99E32] rounded-3xl p-4 sm:p-5 shadow-md flex justify-center overflow-x-auto">
          <div
            className="grid gap-1 sm:gap-1.5"
            style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
          >
            {Array(puzzle.gridSize).fill(null).map((_, r) =>
              Array(puzzle.gridSize).fill(null).map((_, c) => {
                const meta = getCellMeta(r, c);
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isInSelectedWord = selectedClue && meta?.relatedWords.some(w => w.id === selectedClue.id);
                const letter = userGrid[r]?.[c] || '';

                if (!meta) {
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-100/60 rounded-xl opacity-20 border border-stone-200"
                    />
                  );
                }

                const isCellInSolvedWord = meta.relatedWords.every(w => completedWordIds.includes(w.id));

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-base sm:text-xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'bg-amber-300 border-[#1B3B2B] text-[#1B3B2B] scale-105 shadow-md ring-3 ring-amber-400 z-10'
                        : isCellInSolvedWord
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                        : isInSelectedWord
                        ? 'bg-amber-100 border-amber-400 text-stone-900'
                        : 'bg-white border-stone-300 text-stone-900 hover:bg-amber-50'
                    }`}
                  >
                    {meta.number && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-bold text-stone-500">
                        {meta.number}
                      </span>
                    )}
                    <span>{letter}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Across & Down Clues Lists */}
        <div className="md:col-span-5 space-y-4 text-left">
          {/* Across Clues */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900 border-b pb-1 border-stone-100">
              {t.games?.crosswordsAcross || "Across Clues"}
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {acrossClues.map(w => {
                const isCompleted = completedWordIds.includes(w.id);
                const isCurrent = selectedClue?.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => handleSelectClue(w)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-start gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1B3B2B] text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 line-through opacity-85 border border-emerald-200'
                        : 'bg-stone-50 text-stone-800 hover:bg-amber-50 border border-stone-200'
                    }`}
                  >
                    <strong className={isCurrent ? 'text-amber-300' : 'text-stone-700'}>{w.number}.</strong>
                    <span>{w.clue} ({w.word.length})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Down Clues */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900 border-b pb-1 border-stone-100">
              {t.games?.crosswordsDown || "Down Clues"}
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {downClues.map(w => {
                const isCompleted = completedWordIds.includes(w.id);
                const isCurrent = selectedClue?.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => handleSelectClue(w)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-all flex items-start gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1B3B2B] text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 line-through opacity-85 border border-emerald-200'
                        : 'bg-stone-50 text-stone-800 hover:bg-amber-50 border border-stone-200'
                    }`}
                  >
                    <strong className={isCurrent ? 'text-amber-300' : 'text-stone-700'}>{w.number}.</strong>
                    <span>{w.clue} ({w.word.length})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* On-Screen Touch Keyboard */}
      <div className="bg-white border border-stone-200 rounded-3xl p-3 shadow-xs space-y-1.5 max-w-lg mx-auto">
        {onScreenKeyboard.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map(k => (
              <button
                key={k}
                onClick={() => k === '⌫' ? handleBackspace() : handleKeyPress(k)}
                className={`py-2 px-2.5 sm:px-3 rounded-xl font-bold text-sm sm:text-base border transition-all active:scale-90 cursor-pointer ${
                  k === '⌫'
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : 'bg-stone-50 hover:bg-amber-100 text-stone-900 border-stone-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <button
          onClick={handleHint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-700" />
          <span>{t.games?.needHint || "Need a Hint?"} ({hintsUsed} {t.games?.used || "used"})</span>
        </button>

        <div className="flex items-center gap-2">
          {showRestartConfirm ? (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Restart?</span>
              <button
                onClick={initPuzzle}
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
