import React, { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle2, RotateCcw, Image as ImageIcon, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';
import { DEFAULT_PUZZLE_IMAGES, sliceImageToPieces } from '../../assets/puzzleImages';

export const JigsawPuzzleGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const [selectedImage, setSelectedImage] = useState(DEFAULT_PUZZLE_IMAGES[0]);
  const [gridDim, setGridDim] = useState(2); // 2=Easy (2x2), 3=Med (3x3), 4=Hard (4x4)
  const [boardSlots, setBoardSlots] = useState([]); // Array of piece indices currently in each board slot (or null if empty)
  const [trayPieces, setTrayPieces] = useState([]); // Array of piece indices still in the tray
  const [pieceSlices, setPieceSlices] = useState([]); // Array of data URLs (one for each sliced piece)
  const [selectedItem, setSelectedItem] = useState(null); // { source: 'tray'|'board', index: number, pieceIdx: number }
  const [moveCount, setMoveCount] = useState(0);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [customImages, setCustomImages] = useState([]);
  const fileInputRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const totalPieces = gridDim * gridDim;

  useEffect(() => {
    initPuzzle();
  }, [difficulty, selectedImage]);

  const initPuzzle = async () => {
    startTimeRef.current = Date.now();
    setMoveCount(0);
    setSelectedItem(null);
    setShowRestartConfirm(false);
    setShowReferenceModal(false);

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

    // Initial state: board is empty, all pieces are in tray
    setBoardSlots(Array(count).fill(null));
    setTrayPieces(shuffled);
    soundManager.playChime();
  };

  // Switch to another image
  const handleChangeImage = (img) => {
    setSelectedImage(img);
  };

  // Upload custom user image
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

  // --- INTERACTION LOGIC (Click-to-place & Drag-and-drop) ---

  const handleTrayPieceClick = (pieceIdx, trayIndex) => {
    soundManager.playTap();
    if (selectedItem && selectedItem.source === 'tray' && selectedItem.index === trayIndex) {
      setSelectedItem(null); // Deselect
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

  // --- DRAG AND DROP HANDLERS ---
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

      // Automatic progression level mapping
      const nextLvl = difficulty === 'EASY' ? 'MEDIUM' : difficulty === 'MEDIUM' ? 'HARD' : 'EASY';

      setTimeout(() => {
        onCompleteRound({
          correctAnswers: totalPieces,
          totalQuestions: totalPieces,
          timeTakenSeconds: elapsed,
          score,
          accuracy: 100,
          nextDifficulty: nextLvl
        });
      }, 700);
    }
  };

  // Render sliced puzzle piece
  const renderImagePiece = (pieceIdx, isSelected = false, isSnapped = false) => {
    if (pieceIdx === null || pieceIdx === undefined) return null;
    const sliceSrc = pieceSlices[pieceIdx];

    return (
      <div
        className={`w-full h-full relative rounded-2xl overflow-hidden transition-all duration-200 bg-amber-50 ${
          isSelected
            ? 'ring-4 ring-amber-400 scale-105 shadow-2xl z-20 border-2 border-amber-500'
            : isSnapped
            ? 'border-2 border-emerald-400 shadow-md'
            : 'border-2 border-stone-300 shadow-sm hover:border-amber-400'
        }`}
      >
        {sliceSrc ? (
          <img
            src={sliceSrc}
            alt={`Piece ${pieceIdx + 1}`}
            className="w-full h-full object-cover rounded-xl select-none pointer-events-none"
          />
        ) : (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center font-bold text-amber-900">
            🧩
          </div>
        )}

        {/* Snapped Checkmark Badge */}
        {isSnapped && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    );
  };

  const correctlyPlacedCount = boardSlots.filter((pieceIdx, slotIdx) => pieceIdx !== null && pieceIdx === slotIdx).length;
  const allImages = [...customImages, ...DEFAULT_PUZZLE_IMAGES];

  return (
    <div className="space-y-6 text-center max-w-3xl mx-auto select-none">
      {/* Hidden File Input for Custom User Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Info */}
      <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
            🧩 Real Jigsaw Puzzle • {difficulty} ({gridDim}×{gridDim} = {totalPieces} pieces)
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">
              Pieces Placed: <strong className="text-emerald-800 text-sm">{correctlyPlacedCount} / {totalPieces}</strong>
            </span>
            <VoiceButton textToRead={`Jigsaw Puzzle. Reconstruct the picture of ${selectedImage.title}. Drag pieces from the tray or tap to place them onto the board.`} />
          </div>
        </div>

        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1B3B2B]">
          {selectedImage.title}
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm">
          {selectedImage.description}. Drag pieces into board slots, or tap a piece and then tap a slot to place it.
        </p>

        {/* Action Bar: Reference Image + Image Selector + Upload Button */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => setShowReferenceModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-xs border border-amber-300 shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>Show Reference Picture 🖼️</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs border border-emerald-300 shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 text-emerald-700" />
            <span>Upload Your Own Picture 📁</span>
          </button>

          <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200 max-w-full overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-500 px-1.5">Picture:</span>
            {allImages.map((img) => (
              <button
                key={img.id}
                onClick={() => handleChangeImage(img)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer truncate max-w-[100px] ${
                  selectedImage.id === img.id
                    ? 'bg-[#1B3B2B] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200'
                }`}
              >
                {img.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Play Area: Puzzle Board + Pieces Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Puzzle Board */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-white border-3 border-[#C99E32] rounded-3xl p-4 sm:p-6 shadow-md">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
              <span>🖼️ Puzzle Board</span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {correctlyPlacedCount === totalPieces ? '🎉 Complete!' : `${correctlyPlacedCount} of ${totalPieces} correct`}
              </span>
            </div>

            {/* Grid Board */}
            <div
              className="grid gap-2 sm:gap-3 mx-auto justify-center bg-stone-100/80 p-3 sm:p-4 rounded-2xl border-2 border-dashed border-stone-300"
              style={{
                gridTemplateColumns: `repeat(${gridDim}, minmax(0, 1fr))`,
                maxWidth: gridDim === 2 ? '280px' : gridDim === 3 ? '340px' : '380px',
                aspectRatio: '1 / 1'
              }}
            >
              {boardSlots.map((pieceIdx, slotIdx) => {
                const isSelected = selectedItem?.source === 'board' && selectedItem?.index === slotIdx;
                const isCorrect = pieceIdx !== null && pieceIdx === slotIdx;

                return (
                  <div
                    key={slotIdx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                    onClick={() => handleBoardSlotClick(slotIdx)}
                    className={`relative w-full aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                      pieceIdx === null
                        ? 'bg-stone-200/50 hover:bg-amber-50 border-2 border-dashed border-stone-300 hover:border-amber-400'
                        : 'p-0.5'
                    }`}
                  >
                    {pieceIdx !== null ? (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'board', slotIdx, pieceIdx)}
                        className="w-full h-full relative"
                      >
                        {renderImagePiece(pieceIdx, isSelected, isCorrect)}

                        {/* Return to tray button */}
                        <button
                          onClick={(e) => handleReturnToTray(slotIdx, e)}
                          title="Return to tray"
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-800/80 text-white text-[10px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-stone-400 font-bold text-xs pointer-events-none">
                        Slot {slotIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Pieces Tray */}
        <div className="lg:col-span-5 bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2 border-stone-100">
            <h4 className="font-serif font-bold text-sm text-[#1B3B2B]">
              🧩 Pieces Tray ({trayPieces.length} left)
            </h4>
            <span className="text-[11px] text-stone-500 font-medium">
              Tap or drag to board
            </span>
          </div>

          {trayPieces.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
              {trayPieces.map((pieceIdx, trayIdx) => {
                const isSelected = selectedItem?.source === 'tray' && selectedItem?.index === trayIdx;

                return (
                  <div
                    key={`${pieceIdx}-${trayIdx}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'tray', trayIdx, pieceIdx)}
                    onClick={() => handleTrayPieceClick(pieceIdx, trayIdx)}
                    className="w-full aspect-square cursor-pointer transition-transform hover:scale-102 active:scale-95"
                  >
                    {renderImagePiece(pieceIdx, isSelected, false)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl">
                ✨
              </div>
              <p className="text-xs font-bold text-emerald-800">
                All pieces are on the board!
              </p>
              <p className="text-[11px] text-stone-500">
                Arrange them in the right order to complete the picture.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reference Picture Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-3 border-amber-300 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b pb-2 border-stone-100">
              <h4 className="font-serif font-bold text-lg text-[#1B3B2B]">
                🖼️ Full Reference Picture
              </h4>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner border-2 border-stone-200 bg-stone-50 flex items-center justify-center">
              <img
                src={selectedImage.dataUrl}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-left bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <h5 className="font-bold text-sm text-[#1B3B2B]">{selectedImage.title}</h5>
              <p className="text-stone-600 text-xs mt-0.5">{selectedImage.description}</p>
            </div>

            <button
              onClick={() => setShowReferenceModal(false)}
              className="w-full py-3 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow-sm cursor-pointer"
            >
              Continue Puzzle
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar: Moves, Restart & Exit */}
      <div className="flex justify-between items-center bg-white border border-stone-200 rounded-2xl p-4">
        <div className="text-left text-xs text-stone-600 font-semibold">
          Moves: <strong className="text-stone-900 text-sm">{moveCount}</strong> • Placed Correctly: <strong className="text-emerald-800 text-sm">{correctlyPlacedCount} / {totalPieces}</strong>
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
