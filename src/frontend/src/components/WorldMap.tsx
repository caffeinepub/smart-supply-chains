import { MapIcon, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef } from "react";

const PORTS: { name: string; x: number; y: number; label: string }[] = [
  { name: "shanghai", x: 790, y: 200, label: "Shanghai" },
  { name: "rotterdam", x: 480, y: 150, label: "Rotterdam" },
  { name: "los-angeles", x: 105, y: 215, label: "Los Angeles" },
  { name: "singapore", x: 755, y: 295, label: "Singapore" },
  { name: "dubai", x: 620, y: 235, label: "Dubai" },
  { name: "new-york", x: 220, y: 185, label: "New York" },
  { name: "hamburg", x: 487, y: 140, label: "Hamburg" },
  { name: "mumbai", x: 672, y: 265, label: "Mumbai" },
];

const LANES: [string, string][] = [
  ["shanghai", "los-angeles"],
  ["shanghai", "rotterdam"],
  ["shanghai", "singapore"],
  ["los-angeles", "rotterdam"],
  ["rotterdam", "new-york"],
  ["dubai", "rotterdam"],
  ["dubai", "mumbai"],
  ["mumbai", "singapore"],
  ["new-york", "rotterdam"],
  ["singapore", "rotterdam"],
];

function getPort(name: string) {
  return PORTS.find((p) => p.name === name)!;
}

function cubicBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.18;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

const WORLD_PATHS = [
  "M 80 120 L 60 130 L 50 170 L 55 210 L 80 240 L 100 250 L 115 260 L 125 280 L 140 290 L 150 310 L 140 330 L 155 340 L 180 320 L 195 300 L 200 280 L 210 265 L 225 260 L 230 245 L 245 230 L 240 210 L 250 195 L 255 180 L 245 165 L 235 150 L 220 140 L 200 135 L 180 125 L 155 118 L 130 115 L 105 112 L 80 120",
  "M 195 300 L 190 310 L 195 320 L 200 315 L 205 305 L 195 300",
  "M 220 295 L 225 285 L 235 280 L 250 282 L 270 275 L 285 270 L 295 285 L 310 300 L 320 320 L 325 345 L 320 370 L 315 395 L 300 415 L 280 430 L 260 435 L 245 430 L 230 420 L 215 400 L 210 375 L 205 350 L 210 325 L 215 310 L 220 295",
  "M 445 95 L 455 100 L 465 105 L 475 108 L 490 110 L 500 108 L 510 112 L 520 115 L 525 125 L 520 130 L 510 135 L 505 142 L 510 150 L 505 158 L 500 165 L 490 170 L 480 168 L 472 162 L 465 155 L 460 148 L 455 145 L 450 152 L 445 158 L 440 165 L 435 170 L 430 165 L 425 158 L 430 148 L 435 140 L 438 130 L 435 122 L 440 112 L 445 105 L 445 95",
  "M 455 75 L 465 78 L 475 72 L 485 68 L 490 75 L 485 85 L 480 92 L 475 95 L 465 92 L 460 85 L 455 75",
  "M 440 105 L 435 100 L 432 105 L 437 112 L 440 108 L 440 105",
  "M 455 175 L 465 172 L 478 170 L 490 172 L 502 175 L 515 180 L 525 190 L 530 205 L 528 220 L 535 235 L 540 255 L 538 275 L 535 295 L 525 315 L 515 335 L 500 350 L 490 365 L 475 375 L 460 378 L 445 372 L 435 358 L 428 340 L 425 320 L 422 300 L 425 278 L 428 258 L 430 238 L 432 218 L 435 200 L 442 188 L 450 180 L 455 175",
  "M 540 200 L 550 195 L 560 190 L 575 192 L 585 198 L 595 205 L 605 215 L 612 225 L 608 235 L 598 240 L 588 238 L 578 232 L 568 228 L 558 225 L 548 220 L 540 212 L 538 205 L 540 200",
  "M 660 220 L 672 215 L 685 218 L 695 228 L 700 242 L 698 258 L 692 272 L 682 285 L 670 292 L 660 288 L 652 278 L 648 265 L 650 250 L 654 237 L 658 225 L 660 220",
  "M 500 80 L 540 70 L 590 65 L 640 62 L 690 65 L 740 70 L 790 75 L 830 80 L 850 92 L 840 100 L 820 108 L 790 112 L 760 118 L 730 122 L 700 125 L 670 128 L 640 130 L 610 128 L 580 125 L 555 120 L 535 115 L 520 108 L 508 100 L 500 90 L 500 80",
  "M 720 125 L 740 118 L 765 115 L 790 118 L 812 125 L 825 138 L 830 152 L 828 165 L 820 175 L 810 185 L 800 192 L 790 198 L 778 202 L 765 205 L 752 202 L 740 195 L 730 185 L 722 175 L 718 162 L 718 148 L 720 135 L 720 125",
  "M 830 150 L 840 145 L 850 148 L 852 158 L 848 165 L 840 168 L 832 162 L 830 155 L 830 150",
  "M 750 255 L 760 248 L 770 248 L 778 255 L 778 265 L 772 275 L 762 278 L 752 272 L 748 262 L 750 255",
  "M 770 325 L 790 315 L 815 312 L 840 315 L 862 322 L 878 332 L 888 348 L 890 365 L 882 380 L 868 392 L 850 400 L 828 405 L 808 402 L 788 395 L 772 382 L 762 366 L 758 350 L 760 335 L 770 325",
];

const WORLD_PATH_KEYS = WORLD_PATH_KEYS_INIT();
function WORLD_PATH_KEYS_INIT() {
  return [
    "na",
    "ca",
    "sa",
    "eu",
    "sc",
    "uk",
    "af",
    "me",
    "in",
    "ru",
    "cn",
    "jp",
    "sea",
    "au",
  ];
}

export function WorldMap() {
  const animRefs = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    let frame: number;
    let offset = 0;
    const animate = () => {
      offset = (offset + 0.3) % 20;
      for (const el of animRefs.current) {
        if (el) el.style.strokeDashoffset = String(-offset);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="card-surface rounded p-4 flex flex-col gap-3 shadow-card"
      style={{ minHeight: 340 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon size={14} className="text-teal" />
          <span className="text-sm font-semibold text-foreground">
            Global Shipment Map
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">247 Active</span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              data-ocid="map.zoom_in.button"
              className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-dim transition-colors"
            >
              <ZoomIn size={11} />
            </button>
            <button
              type="button"
              data-ocid="map.zoom_out.button"
              className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-teal-dim transition-colors"
            >
              <ZoomOut size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <div className="flex-1 relative" style={{ minHeight: 260 }}>
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          role="img"
          aria-label="Global shipment map showing active shipping lanes between major ports"
        >
          <title>Global Shipment Map</title>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="heatmap1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2DD4C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2DD4C7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heatmap2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="500" fill="oklch(0.16 0.018 228)" rx="4" />

          {WORLD_PATHS.map((d, i) => (
            <path
              key={WORLD_PATH_KEYS[i]}
              d={d}
              fill="oklch(0.24 0.022 225)"
              stroke="oklch(0.32 0.025 225)"
              strokeWidth="0.8"
            />
          ))}

          <ellipse cx="790" cy="200" rx="45" ry="35" fill="url(#heatmap1)" />
          <ellipse cx="480" cy="150" rx="40" ry="30" fill="url(#heatmap2)" />
          <ellipse cx="105" cy="215" rx="38" ry="28" fill="url(#heatmap1)" />
          <ellipse cx="220" cy="185" rx="32" ry="24" fill="url(#heatmap2)" />

          {LANES.map(([from, to]) => {
            const p1 = getPort(from);
            const p2 = getPort(to);
            if (!p1 || !p2) return null;
            return (
              <path
                key={`lb-${from}-${to}`}
                d={cubicBezierPath(p1.x, p1.y, p2.x, p2.y)}
                stroke="oklch(0.79 0.112 186 / 0.15)"
                strokeWidth="1"
                fill="none"
              />
            );
          })}

          {LANES.map(([from, to], i) => {
            const p1 = getPort(from);
            const p2 = getPort(to);
            if (!p1 || !p2) return null;
            return (
              <path
                key={`la-${from}-${to}`}
                ref={(el) => {
                  if (el) animRefs.current[i] = el;
                }}
                d={cubicBezierPath(p1.x, p1.y, p2.x, p2.y)}
                stroke="oklch(0.79 0.112 186 / 0.55)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 16"
                filter="url(#glow)"
              />
            );
          })}

          {PORTS.map((port) => (
            <g key={port.name} filter="url(#glow)">
              <circle
                cx={port.x}
                cy={port.y}
                r="5"
                fill="oklch(0.61 0.19 250 / 0.3)"
              />
              <circle
                cx={port.x}
                cy={port.y}
                r="3"
                fill="oklch(0.61 0.19 250)"
              />
              <circle cx={port.x} cy={port.y} r="1.5" fill="white" />
              <text
                x={port.x}
                y={port.y - 9}
                textAnchor="middle"
                fill="oklch(0.91 0.015 215 / 0.7)"
                fontSize="8"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {port.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-teal opacity-60" />
          <span>Shipping Lanes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue opacity-80" />
          <span>Active Ports</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-teal-dim border border-teal-dim opacity-60" />
          <span>Heatmap</span>
        </div>
      </div>
    </div>
  );
}
