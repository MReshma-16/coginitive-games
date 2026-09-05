import heroBg from './hero-bg.png';
import sacredTemple from './sacred-temple.png';
import mountainValley from './mountain-valley.png';
import loktakLake from './loktak-lake.png';

// High Quality, Fully Self-Contained Offline Puzzle Images for CogniCare
// Guaranteed to render visibly in all network conditions, with custom upload support

// SVG 1: Assam Tea Garden & Mountain River
const TEA_GARDEN_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%2360a5fa"/>
      <stop offset="60%" stop-color="%23fef08a"/>
      <stop offset="100%" stop-color="%23fed7aa"/>
    </linearGradient>
    <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%231e3a8a"/>
      <stop offset="100%" stop-color="%23047857"/>
    </linearGradient>
    <linearGradient id="teaHill1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%2322c55e"/>
      <stop offset="100%" stop-color="%2315803d"/>
    </linearGradient>
    <linearGradient id="teaHill2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%234ade80"/>
      <stop offset="100%" stop-color="%23166534"/>
    </linearGradient>
    <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="%2338bdf8"/>
      <stop offset="50%" stop-color="%230284c7"/>
      <stop offset="100%" stop-color="%230369a1"/>
    </linearGradient>
  </defs>
  <!-- Sky & Sun -->
  <rect width="600" height="600" fill="url(%23sky)"/>
  <circle cx="480" cy="140" r="55" fill="%23facc15" opacity="0.9"/>
  <circle cx="480" cy="140" r="75" fill="%23fef08a" opacity="0.3"/>
  <!-- Distant Blue Mountains -->
  <polygon points="0,320 120,180 250,320" fill="url(%23mountain)" opacity="0.8"/>
  <polygon points="180,320 340,150 490,320" fill="url(%23mountain)" opacity="0.9"/>
  <polygon points="400,320 530,200 600,320" fill="url(%23mountain)" opacity="0.8"/>
  <!-- Snow Peaks -->
  <polygon points="120,180 95,220 145,220" fill="%23ffffff" opacity="0.9"/>
  <polygon points="340,150 310,195 370,195" fill="%23ffffff" opacity="0.9"/>
  <polygon points="530,200 505,235 555,235" fill="%23ffffff" opacity="0.9"/>
  <!-- Rolling Tea Hills (Background) -->
  <path d="M0,320 Q150,260 300,330 T600,320 L600,600 L0,600 Z" fill="url(%23teaHill2)"/>
  <!-- Serene River -->
  <path d="M120,330 Q260,380 220,480 T340,600 L260,600 Q150,490 180,410 T0,350 Z" fill="url(%23river)"/>
  <!-- Rolling Tea Hills (Foreground) -->
  <path d="M0,420 Q180,360 380,460 T600,440 L600,600 L0,600 Z" fill="url(%23teaHill1)"/>
  <!-- Tea Bushes Pattern -->
  <g fill="%2314532d" opacity="0.4">
    <ellipse cx="60" cy="460" rx="35" ry="15"/>
    <ellipse cx="140" cy="480" rx="45" ry="18"/>
    <ellipse cx="450" cy="470" rx="55" ry="20"/>
    <ellipse cx="530" cy="510" rx="50" ry="18"/>
    <ellipse cx="80" cy="540" rx="60" ry="22"/>
    <ellipse cx="400" cy="550" rx="65" ry="25"/>
  </g>
  <!-- Traditional Tea Basket on Grass -->
  <g transform="translate(460, 480) scale(0.7)">
    <polygon points="40,20 80,20 70,80 50,80" fill="%23d97706"/>
    <path d="M40,20 Q60,10 80,20" stroke="%2392400e" stroke-width="4" fill="none"/>
    <ellipse cx="60" cy="20" rx="18" ry="8" fill="%2322c55e"/>
  </g>
</svg>`;

// SVG 2: Blooming Lotus Lake
const LOTUS_LAKE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%230284c7"/>
      <stop offset="50%" stop-color="%230f766e"/>
      <stop offset="100%" stop-color="%23042f2e"/>
    </linearGradient>
    <radialGradient id="lotusPink" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23fdf2f8"/>
      <stop offset="40%" stop-color="%23f472b6"/>
      <stop offset="100%" stop-color="%23db2777"/>
    </radialGradient>
    <radialGradient id="lotusYellow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23fef08a"/>
      <stop offset="100%" stop-color="%23eab308"/>
    </radialGradient>
  </defs>
  <!-- Deep Blue Pond -->
  <rect width="600" height="600" fill="url(%23water)"/>
  <!-- Water Shimmer Ripples -->
  <ellipse cx="300" cy="180" rx="220" ry="20" fill="%2338bdf8" opacity="0.2"/>
  <ellipse cx="220" cy="340" rx="180" ry="18" fill="%2338bdf8" opacity="0.25"/>
  <ellipse cx="400" cy="460" rx="160" ry="15" fill="%2338bdf8" opacity="0.2"/>
  <!-- Large Green Lily Pads -->
  <g fill="%2315803d" stroke="%23166534" stroke-width="3">
    <ellipse cx="140" cy="220" rx="90" ry="40"/>
    <ellipse cx="460" cy="240" rx="110" ry="45"/>
    <ellipse cx="180" cy="440" rx="130" ry="55"/>
    <ellipse cx="440" cy="480" rx="120" ry="50"/>
  </g>
  <!-- Lily Pad Slits -->
  <path d="M140,220 L210,240" stroke="%230f766e" stroke-width="4"/>
  <path d="M460,240 L380,260" stroke="%230f766e" stroke-width="4"/>
  <path d="M180,440 L280,465" stroke="%230f766e" stroke-width="5"/>
  <path d="M440,480 L360,505" stroke="%230f766e" stroke-width="5"/>
  <!-- Main Giant Blooming Pink Lotus (Center) -->
  <g transform="translate(300, 310)">
    <!-- Back Outer Petals -->
    <path d="M0,0 Q-80,-40 -110,-10 Q-80,40 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q80,-40 110,-10 Q80,40 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q-60,-90 0,-120 Q60,-90 0,0" fill="url(%23lotusPink)"/>
    <!-- Middle Petals -->
    <path d="M0,0 Q-60,-60 -80,-80 Q-20,-70 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q60,-60 80,-80 Q20,-70 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q-35,-80 -25,-100 Q10,-70 0,0" fill="%23f472b6"/>
    <path d="M0,0 Q35,-80 25,-100 Q-10,-70 0,0" fill="%23f472b6"/>
    <!-- Golden Core -->
    <circle cx="0" cy="-20" r="24" fill="url(%23lotusYellow)"/>
    <circle cx="0" cy="-20" r="15" fill="%23ca8a04"/>
  </g>
  <!-- Smaller Side Lotus Flower -->
  <g transform="translate(130, 200) scale(0.55)">
    <path d="M0,0 Q-60,-80 0,-100 Q60,-80 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q-70,-30 -80,0 Q-30,30 0,0" fill="url(%23lotusPink)"/>
    <path d="M0,0 Q70,-30 80,0 Q30,30 0,0" fill="url(%23lotusPink)"/>
    <circle cx="0" cy="-15" r="16" fill="url(%23lotusYellow)"/>
  </g>
</svg>`;

// SVG 3: Himalayan Mountain Golden Sunrise
const MOUNTAIN_SUNRISE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23f97316"/>
      <stop offset="35%" stop-color="%23facc15"/>
      <stop offset="70%" stop-color="%23fef08a"/>
      <stop offset="100%" stop-color="%23bae6fd"/>
    </linearGradient>
    <linearGradient id="snowPeak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="60%" stop-color="%23fed7aa"/>
      <stop offset="100%" stop-color="%239a3412"/>
    </linearGradient>
    <linearGradient id="pineTree" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23064e3b"/>
      <stop offset="100%" stop-color="%23022c22"/>
    </linearGradient>
  </defs>
  <!-- Dawn Sky -->
  <rect width="600" height="600" fill="url(%23dawnSky)"/>
  <!-- Golden Sun Rising Behind Peaks -->
  <circle cx="300" cy="230" r="80" fill="%23ea580c"/>
  <circle cx="300" cy="230" r="110" fill="%23fde047" opacity="0.4"/>
  <!-- Majestic Mountain Range -->
  <polygon points="0,420 180,160 360,420" fill="url(%23snowPeak)"/>
  <polygon points="220,420 380,190 540,420" fill="url(%23snowPeak)"/>
  <polygon points="360,420 480,240 600,420" fill="url(%23snowPeak)"/>
  <!-- Snow Shading -->
  <polygon points="180,160 140,230 210,230" fill="%23ffffff"/>
  <polygon points="380,190 350,250 410,250" fill="%23ffffff"/>
  <!-- Evergreen Foothills -->
  <path d="M0,380 Q160,340 320,390 T600,380 L600,600 L0,600 Z" fill="%23065f46"/>
  <!-- Pine Trees Layer -->
  <g fill="url(%23pineTree)">
    <polygon points="40,540 20,590 60,590"/>
    <polygon points="40,500 25,550 55,550"/>
    <polygon points="40,460 30,510 50,510"/>
    
    <polygon points="120,520 95,580 145,580"/>
    <polygon points="120,480 100,535 140,535"/>
    <polygon points="120,440 108,495 132,495"/>

    <polygon points="480,530 455,590 505,590"/>
    <polygon points="480,485 460,545 500,545"/>
    <polygon points="480,445 468,500 492,500"/>

    <polygon points="540,550 520,600 560,600"/>
    <polygon points="540,510 525,560 555,560"/>
  </g>
</svg>`;

// SVG 4: North-Eastern Traditional Village Cottage
const VILLAGE_COTTAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="warmSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23fef08a"/>
      <stop offset="60%" stop-color="%23fdba74"/>
      <stop offset="100%" stop-color="%23fed7aa"/>
    </linearGradient>
    <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="%23b45309"/>
      <stop offset="100%" stop-color="%2378350f"/>
    </linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="%23fef3c7"/>
      <stop offset="100%" stop-color="%23fde68a"/>
    </linearGradient>
  </defs>
  <!-- Warm Golden Afternoon Sky -->
  <rect width="600" height="600" fill="url(%23warmSky)"/>
  <!-- Distant Hills & Trees -->
  <ellipse cx="150" cy="340" rx="200" ry="80" fill="%2315803d" opacity="0.6"/>
  <ellipse cx="480" cy="330" rx="180" ry="70" fill="%23166534" opacity="0.7"/>
  <!-- Yard / Lawn -->
  <rect x="0" y="360" width="600" height="240" fill="%2365a30d"/>
  <!-- Bamboo Stilt Cottage -->
  <!-- Cottage Wall -->
  <rect x="180" y="270" width="240" height="150" rx="8" fill="url(%23wall)" stroke="%2392400e" stroke-width="4"/>
  <!-- Thatched Roof -->
  <polygon points="150,270 300,160 450,270" fill="url(%23roof)" stroke="%2378350f" stroke-width="4"/>
  <!-- Roof Texture Lines -->
  <line x1="300" y1="160" x2="180" y2="270" stroke="%23fde68a" stroke-width="2"/>
  <line x1="300" y1="160" x2="240" y2="270" stroke="%23fde68a" stroke-width="2"/>
  <line x1="300" y1="160" x2="360" y2="270" stroke="%23fde68a" stroke-width="2"/>
  <line x1="300" y1="160" x2="420" y2="270" stroke="%23fde68a" stroke-width="2"/>
  <!-- Wooden Door -->
  <rect x="275" y="320" width="50" height="100" rx="4" fill="%2392400e"/>
  <circle cx="285" cy="370" r="4" fill="%23fef08a"/>
  <!-- Windows with Curtains -->
  <rect x="205" y="310" width="45" height="45" fill="%2378350f" rx="4"/>
  <rect x="210" y="315" width="16" height="35" fill="%23e0f2fe"/>
  <rect x="230" y="315" width="16" height="35" fill="%23e0f2fe"/>
  
  <rect x="350" y="310" width="45" height="45" fill="%2378350f" rx="4"/>
  <rect x="355" y="315" width="16" height="35" fill="%23e0f2fe"/>
  <rect x="375" y="315" width="16" height="35" fill="%23e0f2fe"/>
  <!-- Front Flower Garden -->
  <g fill="%23ef4444">
    <circle cx="160" cy="450" r="10"/>
    <circle cx="190" cy="465" r="12"/>
    <circle cx="220" cy="455" r="9"/>
    <circle cx="380" cy="460" r="11"/>
    <circle cx="415" cy="450" r="13"/>
    <circle cx="445" cy="465" r="10"/>
  </g>
  <g fill="%23facc15">
    <circle cx="175" cy="460" r="8"/>
    <circle cx="205" cy="450" r="9"/>
    <circle cx="395" cy="455" r="9"/>
    <circle cx="430" cy="460" r="8"/>
  </g>
</svg>`;

export const DEFAULT_PUZZLE_IMAGES = [
  {
    id: 'loktak-lake-manipur',
    title: 'Loktak Lake & Floating Phumdis, Manipur',
    description: 'Breathtaking serene blue lake with iconic circular floating islands and lush green hills',
    dataUrl: loktakLake
  },
  {
    id: 'sun-temple-odisha',
    title: 'Grand Sun Temple Architecture',
    description: 'Magnificent ancient carved temple stone wheels & historic sanctum',
    dataUrl: heroBg
  },
  {
    id: 'sacred-red-temple',
    title: 'Sacred Twilight Stone Temple',
    description: 'Atmospheric sacred red stone temple glowing under a peaceful twilight sky',
    dataUrl: sacredTemple
  },
  {
    id: 'mountain-pine-valley',
    title: 'Himalayan Valley & Pine Hills',
    description: 'Serene rolling green mountains, pine forests and vibrant valley town',
    dataUrl: mountainValley
  },
  {
    id: 'tea-garden',
    title: 'Peaceful Tea Estate, Assam',
    description: 'Lush green tea gardens with morning mist over rolling hills',
    dataUrl: TEA_GARDEN_SVG
  },
  {
    id: 'lotus-lake',
    title: 'Blooming Lotus Pond',
    description: 'Vibrant pink water lilies and lotus flowers resting on serene water',
    dataUrl: LOTUS_LAKE_SVG
  },
  {
    id: 'mountain-sunrise',
    title: 'Himalayan Golden Sunrise',
    description: 'Golden morning sunlight illuminating peaceful mountain peaks',
    dataUrl: MOUNTAIN_SUNRISE_SVG
  },
  {
    id: 'bamboo-cottage',
    title: 'Traditional Village Cottage',
    description: 'Warm rural home surrounded by flourishing nature and flowers',
    dataUrl: VILLAGE_COTTAGE_SVG
  }
];

/**
 * Canvas Piece Slicing Utility:
 * Normalizes any image (portrait, landscape, or square) onto a standardized high-resolution
 * square canvas (600x600) via smart center-crop, then slices it into exact, uniform square pieces.
 * This guarantees 100% even alignment of all puzzle board slots and pieces.
 * Returns array of base64 PNG data URLs.
 */
export function sliceImageToPieces(imgSrc, gridDim) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 1. Standardize image to a high-resolution 600x600 square canvas via center-crop
      const SQUARE_SIZE = 600;
      const squareCanvas = document.createElement('canvas');
      squareCanvas.width = SQUARE_SIZE;
      squareCanvas.height = SQUARE_SIZE;
      const sCtx = squareCanvas.getContext('2d');

      const minDim = Math.min(img.width, img.height);
      const sx = Math.floor((img.width - minDim) / 2);
      const sy = Math.floor((img.height - minDim) / 2);

      // Draw center-cropped square
      sCtx.drawImage(
        img,
        sx, sy, minDim, minDim,
        0, 0, SQUARE_SIZE, SQUARE_SIZE
      );

      // 2. Divide square canvas into exact equal square pieces
      const pieceSize = Math.floor(SQUARE_SIZE / gridDim);
      const pieceUrls = [];

      for (let r = 0; r < gridDim; r++) {
        for (let c = 0; c < gridDim; c++) {
          const canvas = document.createElement('canvas');
          canvas.width = pieceSize;
          canvas.height = pieceSize;
          const ctx = canvas.getContext('2d');

          // Draw the exact slice onto canvas
          ctx.drawImage(
            squareCanvas,
            c * pieceSize,
            r * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          // Subtle authentic jigsaw border & bevel
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 3;
          ctx.strokeRect(1.5, 1.5, pieceSize - 3, pieceSize - 3);

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(1, 1, pieceSize - 2, pieceSize - 2);

          pieceUrls.push(canvas.toDataURL('image/png'));
        }
      }
      resolve(pieceUrls);
    };

    img.onerror = () => {
      console.error("Failed to load image for slicing:", imgSrc);
      resolve([]);
    };

    img.src = imgSrc;
  });
}
