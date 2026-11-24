import React, { useMemo } from 'react';

// Generates an array of floating botanical leaf elements with randomized coordinates, delays, and leaf styles
export default function FallingLeavesBackground() {
  const leaves = useMemo(() => {
    // 22 subtle falling leaves distributed across screen width
    return Array.from({ length: 22 }).map((_, index) => {
      const left = Math.floor(Math.random() * 96) + 2; // 2% to 98%
      const duration = Math.floor(Math.random() * 10) + 12; // 12s to 22s
      const delay = Math.floor(Math.random() * 15) * 0.8; // 0s to 12s
      const size = Math.floor(Math.random() * 18) + 16; // 16px to 34px
      const opacity = (Math.random() * 0.22 + 0.18).toFixed(2); // 0.18 to 0.40
      const rotationStart = Math.floor(Math.random() * 360);
      const leafType = index % 3; // 3 distinct botanical leaf silhouettes
      const color =
        index % 4 === 0
          ? '#536143' // Forest Sage
          : index % 4 === 1
          ? '#808d6d' // Pale Olive
          : index % 4 === 2
          ? '#c5a059' // Golden Botanical Amber
          : '#6e8555'; // Fresh Herbal Green

      return {
        id: index,
        left,
        duration,
        delay,
        size,
        opacity,
        rotationStart,
        leafType,
        color,
      };
    });
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes fallingLeaf {
          0% {
            transform: translateY(-80px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: var(--leaf-opacity, 0.3);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(35px);
          }
          90% {
            opacity: var(--leaf-opacity, 0.3);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-25px);
            opacity: 0;
          }
        }

        .falling-leaf-item {
          position: absolute;
          top: -60px;
          animation-name: fallingLeaf;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="falling-leaf-item"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            '--leaf-opacity': leaf.opacity,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            transform: `rotate(${leaf.rotationStart}deg)`,
          }}
        >
          {leaf.leafType === 0 && (
            // Classic oval botanical leaf with central vein
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-sm">
              <path
                d="M 5 35 C 10 20, 20 8, 35 5 C 32 20, 20 32, 5 35 Z"
                fill={leaf.color}
                fillOpacity="0.8"
              />
              <path
                d="M 5 35 Q 20 20 35 5"
                stroke="#fff"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            </svg>
          )}

          {leaf.leafType === 1 && (
            // Slender willow / herbal leaflet
            <svg viewBox="0 0 30 45" fill="none" className="w-full h-full drop-shadow-sm">
              <path
                d="M 15 45 C 5 30, 8 15, 15 0 C 22 15, 25 30, 15 45 Z"
                fill={leaf.color}
                fillOpacity="0.75"
              />
              <path
                d="M 15 45 L 15 5"
                stroke="#fff"
                strokeWidth="1"
                strokeOpacity="0.35"
                strokeLinecap="round"
              />
            </svg>
          )}

          {leaf.leafType === 2 && (
            // Rounded neem / herbal leaflet
            <svg viewBox="0 0 40 30" fill="none" className="w-full h-full drop-shadow-sm">
              <path
                d="M 2 28 C 8 10, 22 2, 38 4 C 30 18, 16 28, 2 28 Z"
                fill={leaf.color}
                fillOpacity="0.75"
              />
              <path
                d="M 2 28 Q 20 16 38 4"
                stroke="#fff"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
