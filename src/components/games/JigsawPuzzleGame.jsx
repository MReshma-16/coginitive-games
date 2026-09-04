import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, CheckCircle2, RotateCcw, Sparkles, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { soundManager } from '../../services/audioSynthesizer';
import { VoiceButton } from '../VoiceButton';

// High quality curated elderly-friendly nature & cultural images
const PUZZLE_IMAGES = [
  {
    id: 'tea-garden',
    title: 'Peaceful Tea Estate, Assam',
    description: 'Lush green tea gardens with morning mist over rolling hills',
    url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    fallbackBg: 'linear-gradient(135deg, #134e4a 0%, #15803d 40%, #a3e635 100%)'
  },
  {
    id: 'lotus-lake',
    title: 'Blooming Lotus Pond',
    description: 'Vibrant pink water lilies and lotus flowers resting on serene water',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc222?auto=format&fit=crop&w=800&q=80',
    fallbackBg: 'linear-gradient(135deg, #831843 0%, #ec4899 40%, #67e8f9 100%)'
  },
  {
    id: 'mountain-sunrise',
    title: 'Himalayan Golden Sunrise',
    description: 'Golden morning sunlight illuminating peaceful mountain peaks',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    fallbackBg: 'linear-gradient(135deg, #7c2d12 0%, #f97316 40%, #fed7aa 100%)'
  },
  {
    id: 'bamboo-cottage',
    title: 'Traditional Wooden Village Cottage',
    description: 'Warm rural home surrounded by flourishing nature and flowers',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    fallbackBg: 'linear-gradient(135deg, #78350f 0%, #d97706 40%, #fef3c7 100%)'
  }
];

export const JigsawPuzzleGame = ({ difficulty = 'EASY', onCompleteRound, onExit }) => {
  const [selectedImage, setSelectedImage] = useState(PUZZLE_IMAGES[0]);
  const [gridDim, setGridDim] = useState(2); // 2=Easy (2x2), 3=Med (3x3), 4=Hard (4x4)
  const [boardSlots, setBoardSlots] = useState([]); // Array of piece indices currently in each board slot (or null if empty)
  const [trayPieces, setTrayPieces] = useState([]); // Array of piece indices still in the tray
  const [selectedItem, setSelectedItem] = useState(null); // { source: 'tray'|'board', index: number, pieceIdx: number }
  const [moveCount, setMoveCount] = useState(0);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());

  const totalPieces = gridDim * gridDim;

  useEffect(() => {
    initPuzzle();
  }, [difficulty]);

  const initPuzzle = () => {
    startTimeRef.current = Date.now();
    setMoveCount(0);
    setSelectedItem(null);
    setShowRestartConfirm(false);
    setShowReferenceModal(false);

    const dim = difficulty === 'HARD' ? 4 : difficulty === 'MEDIUM' ? 3 : 2;
    setGridDim(dim);

    // Pick random image
    const randomImg = PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)];
    setSelectedImage(randomImg);

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
    initPuzzle();
  };

  // --- INTERACTION LOGIC (Click-to-place & Drag-and-drop) ---

  // Handle click on tray piece
  const handleTrayPieceClick = (pieceIdx, trayIndex) => {
    soundManager.playTap();
    if (selectedItem && selectedItem.source === 'tray' && selectedItem.index === trayIndex) {
      setSelectedItem(null); // Deselect
    } else {
      setSelectedItem({ source: 'tray', index: trayIndex, pieceIdx });
    }
  };

  // Handle click on board slot
  const handleBoardSlotClick = (slotIdx) => {
    soundManager.playTap();
    const currentPieceInSlot = boardSlots[slotIdx];

    if (!selectedItem) {
      // If no item selected, select this board piece (if slot is not empty)
      if (currentPieceInSlot !== null) {
        setSelectedItem({ source: 'board', index: slotIdx, pieceIdx: currentPieceInSlot });
      }
      return;
    }

    // If an item was already selected:
    const newBoard = [...boardSlots];
    const newTray = [...trayPieces];

    if (selectedItem.source === 'tray') {
      // Moving from tray to board slot
      const pieceToPlace = selectedItem.pieceIdx;
      // Remove from tray
      newTray.splice(selectedItem.index, 1);

      // If slot had an existing piece, return it to tray
      if (currentPieceInSlot !== null) {
        newTray.push(currentPieceInSlot);
      }

      newBoard[slotIdx] = pieceToPlace;
      setBoardSlots(newBoard);
      setTrayPieces(newTray);
      setMoveCount(prev => prev + 1);
      setSelectedItem(null);

      // Sound feedback on snap
      if (pieceToPlace === slotIdx) {
        soundManager.playSuccess();
      }

      checkPuzzleCompletion(newBoard);
    } else if (selectedItem.source === 'board') {
      const sourceSlot = selectedItem.index;
      if (sourceSlot === slotIdx) {
        // Clicked same slot -> deselect
        setSelectedItem(null);
        return;
      }

      // Swap pieces between sourceSlot and slotIdx
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

  // Return piece from board back to tray
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

      setTimeout(() => {
        onCompleteRound({
          correctAnswers: totalPieces,
          totalQuestions: totalPieces,
          timeTakenSeconds: elapsed,
          score,
          accuracy: 100
        });
      }, 800);
    }
  };

  // Helper to render an authentic jigsaw piece containing actual image coordinates
  const renderImagePiece = (pieceIdx, isSelected = false, isSnapped = false) => {
    if (pieceIdx === null || pieceIdx === undefined) return null;

    const row = Math.floor(pieceIdx / gridDim);
    const col = pieceIdx % gridDim;
    const percentage = 100 / (gridDim - 1 || 1);
    const bgPosX = col * percentage;
    const bgPosY = row * percentage;
    const bgSize = `${gridDim * 100}% ${gridDim * 100}%`;

    return (
      <div
        className={`w-full h-full relative rounded-2xl overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'ring-4 ring-amber-400 scale-105 shadow-2xl z-20 border-2 border-amber-500'
            : isSnapped
            ? 'border-2 border-emerald-400 shadow-md'
            : 'border-2 border-stone-300 shadow-sm hover:border-amber-400'
        }`}
        style={{
          backgroundImage: `url(${selectedImage.url})`,
          backgroundPosition: `${bgPosX}% ${bgPosY}%`,
          backgroundSize: bgSize,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#15803d'
        }}
      >
        {/* Subtle jigsaw piece inner shadow and bevel to give real puzzle depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />

        {/* Snapped check badge */}
        {isSnapped && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    );
  };

  const correctlyPlacedCount = boardSlots.filter((pieceIdx, slotIdx) => pieceIdx !== null && pieceIdx === slotIdx).length;

  return (
    <div className="space-y-6 text-center max-w-3xl mx-auto select-none">
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
          {selectedImage.description}. Drag pieces into the board slots, or tap a piece and then tap a slot to place it.
        </p>

        {/* Quick Action: Show Reference & Switch Image */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowReferenceModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-xs sm:text-sm border border-amber-300 shadow-xs cursor-pointer transition-all active:scale-95"
          >
            <Eye className="w-4 h-4 text-amber-700" />
            <span>Show Reference Picture 🖼️</span>
          </button>

          <div className="flex items-center gap-1.5 bg-stone-50 p-1 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 px-2">Image:</span>
            {PUZZLE_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => handleChangeImage(img)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

      {/* Main Play Area: Puzzle Board + Unplaced Pieces Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Top: Puzzle Board */}
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
              className="grid gap-2 sm:gap-3 mx-auto justify-center bg-stone-100/70 p-3 sm:p-4 rounded-2xl border-2 border-dashed border-stone-300"
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

                        {/* Quick return button on hover/touch */}
                        <button
                          onClick={(e) => handleReturnToTray(slotIdx, e)}
                          title="Return to tray"
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-800/80 text-white text-[10px] font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
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

        {/* Right/Bottom: Pieces Tray */}
        <div className="lg:col-span-5 bg-white border-2 border-[#E5DFD5] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2 border-stone-100">
            <h4 className="font-serif font-bold text-sm text-[#1B3B2B]">
              🧩 Pieces Tray ({trayPieces.length} remaining)
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

            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-inner border-2 border-stone-200">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
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
