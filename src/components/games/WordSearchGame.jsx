import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowLeft, Volume2, HelpCircle, Eye } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { useLanguage } from '../../context/LanguageContext';

const LEVEL_WORDS = {
  EASY: [
    { level: 1, words: ['CARE', 'LOVE', 'HOME'] },
    { level: 2, words: ['WARM', 'CALM', 'HOPE'] },
    { level: 3, words: ['REST', 'PEACE', 'KIND'] },
    { level: 4, words: ['BIRD', 'TREE', 'SUN'] },
    { level: 5, words: ['MOON', 'LAKE', 'LEAF'] }
  ],
  MEDIUM: [
    { level: 1, words: ['MEMORY', 'FAMILY', 'GARDEN', 'SMILE'] },
    { level: 2, words: ['FLOWER', 'SPRING', 'HEALTH', 'FRIEND'] },
    { level: 3, words: ['SUMMER', 'MEADOW', 'VALLEY', 'CANOE'] },
    { level: 4, words: ['RIVER', 'AURORA', 'TUNDRA', 'TIMBER'] },
    { level: 5, words: ['FOREST', 'STREAM', 'SUNSET', 'BREEZE'] }
  ],
  HARD: [
    { level: 1, words: ['ALASKA', 'GLACIER', 'AURORA', 'NATURE', 'BLOSSOM'] },
    { level: 2, words: ['KINDNESS', 'HERITAGE', 'SUNSHINE', 'HARMONY', 'JOURNEY'] },
    { level: 3, words: ['DENALI', 'SALMON', 'KLONDIKE', 'WILDERNESS', 'SEATTLE'] },
    { level: 4, words: ['JUNEAU', 'FAIRBANKS', 'ANCHORAGE', 'PACIFIC', 'ICEBERG'] },
    { level: 5, words: ['EVERGREEN', 'HARBOR', 'ADVENTURE', 'EXPEDITION', 'MOUNTAIN'] }
  ]
};

export const WordSearchGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const { currentLang, t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gridSize, setGridSize] = useState(5);
  const [grid, setGrid] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]); // [{r, c}]
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());
  const gridContainerRef = useRef(null);

  useEffect(() => {
    initPuzzle(currentLevel);
  }, [difficulty, currentLang, currentLevel]);

  const initPuzzle = (lvl = currentLevel) => {
    startTimeRef.current = Date.now();
    setScore(0);
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
    setShowRestartConfirm(false);

    const size = difficulty === 'HARD' ? 10 : difficulty === 'MEDIUM' ? 7 : 5;
    setGridSize(size);

    const levelsPool = LEVEL_WORDS[difficulty] || LEVEL_WORDS.EASY;
    const levelData = levelsPool.find(l => l.level === lvl) || levelsPool[0];
    const chosenWords = levelData.words;
    setTargetWords(chosenWords);

    generateValidGrid(size, chosenWords);
    soundManager.playChime();
  };

  const generateValidGrid = (size, words) => {
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(''));

    // Direction vectors: [rowDir, colDir]
    const directions = difficulty === 'EASY'
      ? [[0, 1], [1, 0]]
      : difficulty === 'MEDIUM'
      ? [[0, 1], [1, 0], [1, 1]]
      : [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0]];

    // Place each word into grid
    words.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const [dr, dc] = dir;
        const len = word.length;

        // Calculate valid starting range
        const maxR = dr === 1 ? size - len : dr === -1 ? size - 1 : size - 1;
        const minR = dr === -1 ? len - 1 : 0;
        const maxC = dc === 1 ? size - len : dc === -1 ? size - 1 : size - 1;
        const minC = dc === -1 ? len - 1 : 0;

        if (maxR < minR || maxC < minC) continue;

        const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
        const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

        // Check if word can fit
        let canPlace = true;
        for (let i = 0; i < len; i++) {
          const r = startR + dr * i;
          const c = startC + dc * i;
          if (newGrid[r][c] !== '' && newGrid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < len; i++) {
            const r = startR + dr * i;
            const c = startC + dc * i;
            newGrid[r][c] = word[i];
          }
          placed = true;
        }
      }
    });

    // Fill remaining empty cells with random letters
    const alphabet = currentLang === 'as' ? 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযৰলৱশষসহ' :
                     currentLang === 'bn' ? 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ' :
                     currentLang === 'ne' ? 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह' :
                     'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  const getLineCells = (r1, c1, r2, c2) => {
    const dr = r2 - r1;
    const dc = c2 - c1;
    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    // Check if straight horizontal, vertical, or 45-deg diagonal
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
      return null;
    }

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({ r: r1 + stepR * i, c: c1 + stepC * i });
    }
    return cells;
  };

  const handleCellMouseDown = (r, c) => {
    setIsSelecting(true);
    setSelectedCells([{ r, c }]);
    soundManager.playTap();
  };

  const handleCellMouseEnter = (r, c) => {
    if (!isSelecting || selectedCells.length === 0) return;
    const start = selectedCells[0];

    const line = getLineCells(start.r, start.c, r, c);
    if (line) {
      setSelectedCells(line);
    }
  };

  const handleCellClick = (r, c) => {
    if (selectedCells.length === 0) {
      setSelectedCells([{ r, c }]);
      soundManager.playTap();
    } else if (selectedCells.length === 1 && (selectedCells[0].r !== r || selectedCells[0].c !== c)) {
      const line = getLineCells(selectedCells[0].r, selectedCells[0].c, r, c);
      if (line) {
        setSelectedCells(line);
        validateSelectedLine(line);
      } else {
        setSelectedCells([{ r, c }]);
      }
    } else {
      setSelectedCells([]);
    }
  };

  const handleSelectionEnd = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    validateSelectedLine(selectedCells);
  };

  const handleTouchMove = (e) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset && element.dataset.row !== undefined) {
      const r = parseInt(element.dataset.row, 10);
      const c = parseInt(element.dataset.col, 10);
      const start = selectedCells[0];
      if (start) {
        const line = getLineCells(start.r, start.c, r, c);
        if (line) {
          setSelectedCells(line);
        }
      }
    }
  };

  const validateSelectedLine = (cells) => {
    if (!cells || cells.length < 2) {
      setSelectedCells([]);
      return;
    }

    const forwardWord = cells.map(cell => grid[cell.r][cell.c]).join('');
    const reverseWord = cells.map(cell => grid[cell.r][cell.c]).reverse().join('');

    let matchedWord = null;
    if (targetWords.includes(forwardWord) && !foundWords.includes(forwardWord)) {
      matchedWord = forwardWord;
    } else if (targetWords.includes(reverseWord) && !foundWords.includes(reverseWord)) {
      matchedWord = reverseWord;
    }

    if (matchedWord) {
      soundManager.playSuccess();
      const nextFound = [...foundWords, matchedWord];
      setFoundWords(nextFound);
      const newScore = score + (difficulty === 'HARD' ? 15 : difficulty === 'MEDIUM' ? 20 : 35);
      setScore(newScore);

      // Check game completion
      if (nextFound.length === targetWords.length) {
        soundManager.playSuccess();
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        
        if (currentLevel < 5) {
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
          }, 800);
        } else {
          const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';
          setTimeout(() => {
            onCompleteRound({
              correctAnswers: targetWords.length,
              totalQuestions: targetWords.length,
              timeTakenSeconds: elapsedSeconds,
              score: 100,
              level: currentLevel,
              nextDifficulty: nextLvl
            });
          }, 800);
        }
      }
    } else {
      soundManager.playTap();
    }

    setSelectedCells([]);
  };

  const isCellSelected = (r, c) => {
    return selectedCells.some(cell => cell.r === r && cell.c === c);
  };

  return (
    <div
      ref={gridContainerRef}
      onMouseUp={handleSelectionEnd}
      onTouchEnd={handleSelectionEnd}
      className="space-y-6 text-center max-w-3xl mx-auto select-none"
    >
      {/* Header with 5 Level Selector */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            🌲 {t.games?.wordSearchTitle || "Word Search"} • {difficulty}
          </span>

          {/* Level 1-5 Pills */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => setCurrentLevel(lvl)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentLevel === lvl
                    ? 'bg-[#1B3B2B] text-amber-200 shadow-sm border border-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-100'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              {t.games?.wordSearchWordsFound || "Words"}: <strong className="text-emerald-800 text-sm">{foundWords.length} / {targetWords.length}</strong>
            </span>
            <VoiceButton textToRead={`${t.games?.wordSearchTitle || 'Word Search'}. Level ${currentLevel}. Find the hidden words in the grid`} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {t.games?.wordSearchTitle || "Word Search"}
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm">
          {t.games?.wordSearchInstructions || "Drag across letters with your mouse/touch, or tap the first and last letter of the word."}
        </p>
      </div>

      {/* Target Words List Card */}
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
          {t.games?.wordSearchTarget || "Target Words to Find"} ({foundWords.length}/{targetWords.length}):
        </span>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {targetWords.map((word, idx) => {
            const isFound = foundWords.includes(word);
            return (
              <span
                key={idx}
                className={`px-3.5 py-1.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wider transition-all border ${
                  isFound
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 line-through opacity-70'
                    : 'bg-white text-stone-800 border-amber-200 shadow-xs'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Letter Grid */}
      <div
        onTouchMove={handleTouchMove}
        className="bg-white border-3 border-[#C99E32] rounded-3xl p-4 sm:p-6 shadow-md inline-block max-w-full overflow-x-auto"
      >
        <div
          className="grid gap-1 sm:gap-2 mx-auto justify-center"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const selected = isCellSelected(r, c);

              return (
                <button
                  key={`${r}-${c}`}
                  data-row={r}
                  data-col={c}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl font-bold text-sm sm:text-lg flex items-center justify-center transition-all cursor-pointer border ${
                    selected
                      ? 'bg-amber-300 border-[#1B3B2B] text-[#1B3B2B] scale-105 shadow-md ring-2 ring-amber-400 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-900 hover:bg-amber-100'
                  }`}
                >
                  {letter}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Score & Action Controls */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <div className="text-left text-xs text-stone-600 font-semibold">
          {t.games?.score || "Score"}: <strong className="text-emerald-800 text-sm">{score}</strong> • {t.games?.wordSearchWordsFound || "Found"}: <strong className="text-stone-900 text-sm">{foundWords.length}/{targetWords.length}</strong>
        </div>

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
