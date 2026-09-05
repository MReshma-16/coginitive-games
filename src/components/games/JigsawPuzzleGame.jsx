import React, { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, RotateCcw, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { useLanguage } from '../../context/LanguageContext';
import { DEFAULT_PUZZLE_IMAGES, sliceImageToPieces } from '../../assets/puzzleImages';

export const JigsawPuzzleGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const { t } = useLanguage();
  const [currentLevel, setCurrentLevel] = useState(1); // 1 to 5
  const [selectedImage, setSelectedImage] = useState(DEFAULT_PUZZLE_IMAGES[0]);
  const [gridDim, setGridDim] = useState(2); // 2=Easy (2x2), 3=Med (3x3), 4=Hard (4x4)
  const [boardSlots, setBoardSlots] = useState([]); // Array of piece indices in each board slot (or null)
  const [trayPieces, setTrayPieces] = useState([]); // Array of piece indices in tray
  const [pieceSlices, setPieceSlices] = useState([]); // Array of data URLs
  const [selectedItem, setSelectedItem] = useState(null); // { source: 'tray'|'board', index: number, pieceIdx: number }
  const [moveCount, setMoveCount] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [customImages, setCustomImages] = useState([]);
  const fileInputRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const totalPieces = gridDim * gridDim;

  // Sync selected image with current level if within range
  useEffect(() => {
    const imgIndex = (currentLevel - 1) % DEFAULT_PUZZLE_IMAGES.length;
    setSelectedImage(DEFAULT_PUZZLE_IMAGES[imgIndex]);
  }, [currentLevel]);

  useEffect(() => {
    initPuzzle();
  }, [difficulty, selectedImage]);

  const initPuzzle = async () => {
    startTimeRef.current = Date.now();
    setMoveCount(0);
    setSelectedItem(null);
    setShowRestartConfirm(false);

    const dim = difficulty === 'HARD' ? 4 : difficulty === 'MEDIUM' ? 3 : 2;
    setGridDim(dim);

    // Slice current image into exact piece images
    const slices = await sliceImageToPieces(selectedImage.dataUrl, dim);
    setPieceSlices(slices);

    const count = dim * dim;
    const pieces = Array.from({ length: count }, (_, i) => i);

    // Shuffle pieces randomly for the tray
    let shuffled = [...pieces];
    shuffled.sort(() => 0.5 - Math.random());

    setBoardSlots(Array(count).fill(null));
    setTrayPieces(shuffled);
    soundManager.playChime();
  };

  const handleChangeImage = (img) => {
    setSelectedImage(img);
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (dataUrl) {
        const newCustom = {
          id: `custom-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, "") || 'My Picture',
          description: 'Custom picture uploaded by user',
          dataUrl: dataUrl
        };
        setCustomImages(prev => [newCustom, ...prev]);
        setSelectedImage(newCustom);
        soundManager.playSuccess();
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Interaction Handlers ---
  const handleTrayPieceClick = (pieceIdx, trayIndex) => {
    soundManager.playTap();
    if (selectedItem && selectedItem.source === 'tray' && selectedItem.index === trayIndex) {
      setSelectedItem(null);
    } else {
      setSelectedItem({ source: 'tray', index: trayIndex, pieceIdx });
    }
  };

  const handleBoardSlotClick = (slotIdx) => {
    soundManager.playTap();
    const currentPieceInSlot = boardSlots[slotIdx];

    if (!selectedItem) {
      if (currentPieceInSlot !== null) {
        setSelectedItem({ source: 'board', index: slotIdx, pieceIdx: currentPieceInSlot });
      }
      return;
    }

    const newBoard = [...boardSlots];
    const newTray = [...trayPieces];

    if (selectedItem.source === 'tray') {
      const pieceToPlace = selectedItem.pieceIdx;
      newTray.splice(selectedItem.index, 1);

      if (currentPieceInSlot !== null) {
        newTray.push(currentPieceInSlot);
      }

      newBoard[slotIdx] = pieceToPlace;
      setBoardSlots(newBoard);
      setTrayPieces(newTray);
      setMoveCount(prev => prev + 1);
      setSelectedItem(null);

      if (pieceToPlace === slotIdx) {
        soundManager.playSuccess();
      }

      checkPuzzleCompletion(newBoard);
    } else if (selectedItem.source === 'board') {
      const sourceSlot = selectedItem.index;
      if (sourceSlot === slotIdx) {
        setSelectedItem(null);
        return;
      }

      newBoard[sourceSlot] = currentPieceInSlot;
      newBoard[slotIdx] = selectedItem.pieceIdx;

      setBoardSlots(newBoard);
      setMoveCount(prev => prev + 1);
      setSelectedItem(null);

      if (selectedItem.pieceIdx === slotIdx) {
        soundManager.playSuccess();
      }

      checkPuzzleCompletion(newBoard);
    }
  };

  const handleReturnToTray = (slotIdx, e) => {
    e.stopPropagation();
    soundManager.playTap();
    const piece = boardSlots[slotIdx];
    if (piece === null) return;

    const newBoard = [...boardSlots];
    newBoard[slotIdx] = null;
    const newTray = [...trayPieces, piece];

    setBoardSlots(newBoard);
    setTrayPieces(newTray);
    if (selectedItem && selectedItem.source === 'board' && selectedItem.index === slotIdx) {
      setSelectedItem(null);
    }
  };

  // Drag & Drop
  const handleDragStart = (e, source, index, pieceIdx) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ source, index, pieceIdx }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e, targetSlotIdx) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!data) return;

      const { source, index, pieceIdx } = data;
      const newBoard = [...boardSlots];
      const newTray = [...trayPieces];
      const currentPieceInSlot = newBoard[targetSlotIdx];

      if (source === 'tray') {
        newTray.splice(index, 1);
        if (currentPieceInSlot !== null) {
          newTray.push(currentPieceInSlot);
        }
        newBoard[targetSlotIdx] = pieceIdx;
      } else if (source === 'board') {
        if (index === targetSlotIdx) return;
        newBoard[index] = currentPieceInSlot;
        newBoard[targetSlotIdx] = pieceIdx;
      }

      setBoardSlots(newBoard);
      setTrayPieces(newTray);
      setMoveCount(prev => prev + 1);
      setSelectedItem(null);

      if (pieceIdx === targetSlotIdx) {
        soundManager.playSuccess();
      } else {
        soundManager.playTap();
      }

      checkPuzzleCompletion(newBoard);
    } catch (err) {
      console.error(err);
    }
  };

  const checkPuzzleCompletion = (slots) => {
    const isCompleted = slots.every((pieceIdx, slotIdx) => pieceIdx !== null && pieceIdx === slotIdx);

    if (isCompleted) {
      soundManager.playSuccess();
      const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const score = Math.max(70, 100 - Math.max(0, moveCount - totalPieces) * 2);

      if (currentLevel < 5) {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
        }, 1000);
      } else {
        const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';
        setTimeout(() => {
          onCompleteRound({
            correctAnswers: totalPieces * 5,
            totalQuestions: totalPieces * 5,
            timeTakenSeconds: elapsed,
            score,
            accuracy: 100,
            nextDifficulty: nextLvl
          });
        }, 1000);
      }
    }
  };

  // Render individual piece
  const renderImagePiece = (pieceIdx, isSelected = false, isSnapped = false, isInTray = false) => {
    if (pieceIdx === null || pieceIdx === undefined) return null;
    const sliceSrc = pieceSlices[pieceIdx];

    return (
      <div
        className={`w-full h-full relative overflow-hidden transition-all duration-150 ${
          isInTray ? 'rounded-xl border border-stone-300 shadow-xs hover:border-amber-400' : ''
        } ${
          isSelected
            ? 'ring-4 ring-amber-500 scale-105 shadow-2xl z-20 border-2 border-amber-500 rounded-xl'
            : isSnapped
            ? 'border-2 border-emerald-500/70'
            : ''
        }`}
      >
        {sliceSrc ? (
          <img
            src={sliceSrc}
            alt={`Piece ${pieceIdx + 1}`}
            className="w-full h-full object-cover select-none pointer-events-none block"
          />
        ) : (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center font-bold text-amber-900">
            🧩
          </div>
        )}

        {isSnapped && (
          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-fadeIn z-10">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  };

  const correctlyPlacedCount = boardSlots.filter((pieceIdx, slotIdx) => pieceIdx !== null && pieceIdx === slotIdx).length;
  const allImages = [...customImages, ...DEFAULT_PUZZLE_IMAGES];

  return (
    <div className="space-y-6 text-center max-w-5xl mx-auto select-none">
      {/* Hidden File Input for Custom User Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
              🧩 {t.games?.jigsawTitle || "Jigsaw Puzzle"} • {difficulty} ({gridDim}×{gridDim} = {totalPieces} {t.games?.jigsawPlaced?.toLowerCase() || "pieces"})
            </span>
            <span className="text-xs font-bold bg-[#1B3B2B] text-white px-2.5 py-1 rounded-full">
              Level {currentLevel} of 5
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              {t.games?.jigsawPlaced || "Pieces Placed"}: <strong className="text-emerald-800 text-sm">{correctlyPlacedCount} / {totalPieces}</strong>
            </span>
            <VoiceButton textToRead={`${t.games?.jigsawTitle || 'Jigsaw Puzzle'}. Level ${currentLevel}. ${selectedImage.title}. ${t.games?.jigsawTapInstruction || 'Drag pieces from the tray or tap to place them onto the board.'}`} />
          </div>
        </div>

        {/* Level 1-5 selector pills */}
        <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-500 mr-1">Level:</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setCurrentLevel(lvl)}
              className={`btn-pill px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                currentLevel === lvl
                  ? 'bg-[#1B3B2B] text-amber-200 shadow-xs border border-[#C99E32]'
                  : 'bg-stone-100 hover:bg-amber-100 text-stone-700'
              }`}
            >
              Lvl {lvl}
            </button>
          ))}
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {selectedImage.title}
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm">
          {t.games?.jigsawTapInstruction || "Drag pieces from the tray or tap a piece and then tap a board slot to place it."}
        </p>
      </div>

      {/* 3-Column Main Game Layout: Side Reference Panel + Flush Puzzle Board (No Gap) + Pieces Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Reference Picture at the side (Permanently Visible) */}
        <div className="lg:col-span-4 bg-white border-2 border-amber-300/80 rounded-3xl p-4 shadow-sm space-y-3.5 text-left">
          <div className="flex items-center justify-between border-b pb-2 border-stone-100">
            <h4 className="font-serif font-bold text-sm text-[#1B3B2B] flex items-center gap-1.5">
              <span>🖼️</span>
              <span>{t.games?.jigsawReference || "Reference Picture"}</span>
            </h4>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
              Full View
            </span>
          </div>

          {/* Clean full reference image */}
          <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-stone-200 shadow-inner bg-stone-50 flex items-center justify-center">
            <img
              src={selectedImage.dataUrl}
              alt={selectedImage.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 space-y-0.5">
            <h5 className="font-bold text-xs text-[#1B3B2B]">{selectedImage.title}</h5>
            <p className="text-stone-600 text-[11px] leading-tight">{selectedImage.description}</p>
          </div>

          {/* Quick picture switcher & manual upload */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Choose Picture:</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-[11px] border border-emerald-300 cursor-pointer transition-all active:scale-95"
              >
                <Upload className="w-3 h-3 text-emerald-700" />
                <span>Upload 📁</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {allImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleChangeImage(img)}
                  className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer truncate text-left border ${
                    selectedImage.id === img.id
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50'
                  }`}
                >
                  {img.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Seamless Puzzle Board (gap-0, continuous flush picture) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full bg-white border-3 border-[#C99E32] rounded-3xl p-4 shadow-md space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>{t.games?.jigsawBoard || "Puzzle Board"}</span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {correctlyPlacedCount === totalPieces ? '🎉 Complete!' : `${correctlyPlacedCount}/${totalPieces}`}
              </span>
            </div>

            {/* Seamless Board Container (Equal Even Square Slots, Zero Warping!) */}
            <div
              className="w-full aspect-square mx-auto rounded-2xl overflow-hidden border-2 border-stone-400 bg-stone-100 shadow-inner grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${gridDim}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridDim}, minmax(0, 1fr))`,
                maxWidth: gridDim >= 4 ? '380px' : '340px'
              }}
            >
              {boardSlots.map((pieceIdx, slotIdx) => {
                const isSelected = selectedItem?.source === 'board' && selectedItem?.index === slotIdx;
                const isTargetForSelected = selectedItem !== null && pieceIdx === null;
                const isCorrect = pieceIdx !== null && pieceIdx === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                    onClick={() => handleBoardSlotClick(slotIdx)}
                    className={`relative w-full h-full aspect-square border border-stone-300/70 flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                      pieceIdx === null
                        ? isTargetForSelected
                          ? 'bg-amber-100/90 ring-2 ring-amber-500 ring-inset animate-pulse'
                          : 'bg-stone-200/40 hover:bg-amber-100/60'
                        : 'bg-white'
                    }`}
                  >
                    {pieceIdx !== null ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'board', slotIdx, pieceIdx)}
                        className="w-full h-full relative"
                      >
                        {renderImagePiece(pieceIdx, isSelected, isCorrect, false)}

                        <button
                          onClick={(e) => handleReturnToTray(slotIdx, e)}
                          title="Return to tray"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/80 hover:bg-rose-700 text-white text-[10px] font-bold flex items-center justify-center transition-all z-20 cursor-pointer shadow-sm active:scale-90"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className={`font-bold select-none pointer-events-none ${
                        gridDim >= 4 ? 'text-xs' : 'text-sm'
                      } ${isTargetForSelected ? 'text-amber-900 font-extrabold' : 'text-stone-400'}`}>
                        {slotIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pieces Tray */}
        <div className="lg:col-span-4 bg-white border-2 border-[#E5DFD5] rounded-3xl p-4 shadow-sm space-y-3 text-left">
          <div className="flex items-center justify-between border-b pb-2 border-stone-100">
            <h4 className="font-serif font-bold text-sm text-[#1B3B2B] flex items-center gap-1.5">
              <span>🧩</span>
              <span>{t.games?.jigsawTray || "Pieces Tray"} ({trayPieces.length} {t.games?.jigsawRemaining || "left"})</span>
            </h4>
            <span className="text-[10px] text-stone-500 font-medium">Tap / Drag</span>
          </div>

          {trayPieces.length > 0 ? (
            <div
              className="grid gap-2 max-h-80 overflow-y-auto p-1"
              style={{
                gridTemplateColumns: `repeat(${gridDim <= 3 ? 2 : 3}, minmax(0, 1fr))`
              }}
            >
              {trayPieces.map((pieceIdx, trayIdx) => {
                const isSelected = selectedItem?.source === 'tray' && selectedItem?.index === trayIdx;

                return (
                  <div
                    key={`${pieceIdx}-${trayIdx}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'tray', trayIdx, pieceIdx)}
                    onClick={() => handleTrayPieceClick(pieceIdx, trayIdx)}
                    className="w-full aspect-square cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    {renderImagePiece(pieceIdx, isSelected, false, true)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-lg">
                ✨
              </div>
              <p className="text-xs font-bold text-emerald-800">
                {t.games?.jigsawAllOnBoard || "All pieces are on the board!"}
              </p>
              <p className="text-[11px] text-stone-500">
                {t.games?.jigsawArrange || "Arrange them in the right order to complete the picture."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Moves, Restart & Exit */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <div className="text-left text-xs text-stone-600 font-semibold">
          {t.games?.jigsawMoves || "Moves"}: <strong className="text-stone-900 text-sm">{moveCount}</strong> • {t.games?.jigsawPlaced || "Placed"}: <strong className="text-emerald-800 text-sm">{correctlyPlacedCount} / {totalPieces}</strong>
        </div>

        <div className="flex items-center gap-2">
          {showRestartConfirm ? (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Restart?</span>
              <button
                onClick={initPuzzle}
                className="btn-primary px-3 py-1 rounded-lg text-xs"
              >
                Yes
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="btn-ghost px-3 py-1 rounded-lg text-xs"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="btn-ghost inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5 icon-spin-hover text-stone-600" />
              <span>{t.games?.restartGame || "Restart"}</span>
            </button>
          )}

          {onExit && (
            <button
              onClick={onExit}
              className="btn-ghost px-3.5 py-1.5 rounded-xl text-xs font-bold"
            >
              {t.games?.exitGame || "Exit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
