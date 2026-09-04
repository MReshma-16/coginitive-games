import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowLeft, Volume2, HelpCircle, Eye } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

const PUZZLE_WORDS_DATABASE = {
  EASY: ['CARE', 'HOME', 'LOVE', 'WARM', 'CALM', 'HOPE', 'REST', 'PEACE', 'KIND', 'BIRD'],
  MEDIUM: ['MEMORY', 'FAMILY', 'GARDEN', 'SMILE', 'FLOWER', 'SPRING', 'HEALTH', 'FRIEND', 'HAPPY', 'SUMMER'],
  HARD: ['ALASKA', 'GLACIER', 'AURORA', 'NATURE', 'BLOSSOM', 'KINDNESS', 'HERITAGE', 'SUNSHINE', 'HARMONY', 'JOURNEY']
};

export const WordSearchGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
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
    initPuzzle();
  }, [difficulty]);

  const initPuzzle = () => {
    startTimeRef.current = Date.now();
    setScore(0);
    setFoundWords([]);
    setSelectedCells([]);
    setIsSelecting(false);
    setShowRestartConfirm(false);

    const size = difficulty === 'HARD' ? 10 : difficulty === 'MEDIUM' ? 7 : 5;
    const wordCount = difficulty === 'HARD' ? 8 : difficulty === 'MEDIUM' ? 5 : 3;
    setGridSize(size);

    // Pick random target words
    const pool = [...PUZZLE_WORDS_DATABASE[difficulty]].sort(() => 0.5 - Math.random());
    const chosenWords = pool.slice(0, wordCount);
    setTargetWords(chosenWords);

    // Generate valid grid with guaranteed placement
    generateValidGrid(size, chosenWords);
    soundManager.playChime();
  };

  const generateValidGrid = (size, words) => {
    // Empty grid with nulls
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
    const placedPositions = [];

    // Direction vectors: [rowDir, colDir]
    const directions = difficulty === 'EASY'
      ? [[0, 1], [1, 0]] // horizontal, vertical
      : difficulty === 'MEDIUM'
      ? [[0, 1], [1, 0], [1, 1], [0, -1]] // horizontal, vertical, diagonal
      : [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [1, -1], [-1, -1]]; // all 8 directions

    words.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const [dr, dc] = dir;

        const maxR = dr > 0 ? size - word.length : dr < 0 ? size - 1 : size - 1;
        const minR = dr < 0 ? word.length - 1 : 0;
        const maxC = dc > 0 ? size - word.length : dc < 0 ? size - 1 : size - 1;
        const minC = dc < 0 ? word.length - 1 : 0;

        if (maxR < minR || maxC < minC) continue;

        const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
        const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

        // Check if word fits without conflicting with existing letters
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startR + i * dr;
          const c = startC + i * dc;
          if (r < 0 || r >= size || c < 0 || c >= size) {
            canPlace = false;
            break;
          }
          if (newGrid[r][c] !== '' && newGrid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startR + i * dr;
            const c = startC + i * dc;
            newGrid[r][c] = word[i];
          }
          placed = true;
        }
      }
    });

    // Fill remaining empty cells with random letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  // Cell Selection Handlers (Mouse & Touch & Click support)
  const handleCellMouseDown = (r, c) => {
    setIsSelecting(true);
    setSelectedCells([{ r, c }]);
    soundManager.playTap();
  };

  const handleCellMouseEnter = (r, c) => {
    if (!isSelecting || selectedCells.length === 0) return;
    const start = selectedCells[0];

    // Compute line from start to current
    const line = getLineCells(start.r, start.c, r, c);
    if (line) {
      setSelectedCells(line);
    }
  };

  const handleCellClick = (r, c) => {
    // Click-to-select mode for accessibility / tremors
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

  // Touch handlers for mobile/tablet drag
  const handleTouchMove = (e) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.dataset && elem.dataset.row !== undefined) {
      const r = parseInt(elem.dataset.row, 10);
      const c = parseInt(elem.dataset.col, 10);
      handleCellMouseEnter(r, c);
    }
  };

  // Helper to get straight/diagonal line cells between start and end
  const getLineCells = (r1, c1, r2, c2) => {
    const dr = r2 - r1;
    const dc = c2 - c1;
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    // Must be straight horizontal, vertical, or 45-deg diagonal
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

    const length = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const cells = [];
    for (let i = 0; i < length; i++) {
      cells.push({ r: r1 + i * stepR, c: c1 + i * stepC });
    }
    return cells;
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
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        setTimeout(() => {
          onCompleteRound({
            correctAnswers: targetWords.length,
            totalQuestions: targetWords.length,
            timeTakenSeconds: elapsedSeconds,
            score: 100
          });
        }, 600);
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
      className="space-y-6 text-center max-w-2xl mx-auto select-none"
      onMouseUp={handleSelectionEnd}
      onTouchEnd={handleSelectionEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Game Header */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            🌲 Alaska Word Search • {difficulty}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Found: <strong className="text-[#1B3B2B] text-sm">{foundWords.length} / {targetWords.length}</strong>
            </span>
            <VoiceButton textToRead={`Alaska Word Search. Find ${targetWords.length} hidden words in the grid. Words can be horizontal, vertical or diagonal.`} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          Find the Hidden Words
        </h3>

        <p className="text-stone-600 text-sm">
          Drag across letters with your mouse/touch, or tap the first and last letter of the word.
        </p>
      </div>

      {/* Target Words List */}
      <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl p-4 shadow-xs">
        <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
          Target Words to Find ({foundWords.length}/{targetWords.length}):
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {targetWords.map((word) => {
            const isFound = foundWords.includes(word);
            return (
              <span
                key={word}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                  isFound
                    ? 'bg-emerald-600 text-white line-through opacity-80 shadow-xs'
                    : 'bg-white text-stone-800 border border-amber-300 shadow-sm'
                }`}
              >
                {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />}
                <span>{word}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Word Search Letter Grid */}
      <div
        ref={gridContainerRef}
        className="bg-white border-3 border-[#C99E32] rounded-3xl p-4 sm:p-6 shadow-md inline-block max-w-full overflow-hidden"
      >
        <div
          className="grid gap-1 sm:gap-2 mx-auto justify-center"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const selected = isCellSelected(r, c);
              return (
                <div
                  key={`${r}-${c}`}
                  data-row={r}
                  data-col={c}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl flex items-center justify-center cursor-pointer transition-all duration-150 border-2 ${
                    selected
                      ? 'bg-[#1B3B2B] text-amber-300 border-[#C99E32] scale-105 shadow-md ring-2 ring-amber-300'
                      : 'bg-stone-50 hover:bg-amber-100/60 text-stone-900 border-stone-200'
                  }`}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Controls: Restart & Exit */}
      <div className="flex justify-center items-center gap-3 pt-2">
        {showRestartConfirm ? (
          <div className="bg-amber-100 p-3 rounded-2xl border border-amber-300 flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <span>Restart game?</span>
            <button
              onClick={initPuzzle}
              className="px-3 py-1 rounded-xl bg-[#1B3B2B] text-white hover:bg-[#2C5E3B]"
            >
              Restart
            </button>
            <button
              onClick={() => setShowRestartConfirm(false)}
              className="px-3 py-1 rounded-xl bg-stone-200 text-stone-800 hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRestartConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm border border-stone-300 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Game</span>
          </button>
        )}

        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm border border-stone-300 transition-all"
          >
            Exit Game
          </button>
        )}
      </div>
    </div>
  );
};
