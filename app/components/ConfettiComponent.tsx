/** @format */

"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";

const colors = [
  "#1E40AF",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#DBEAFE",
  "#1D4ED8",
  "#2563EB",
  "#F59E0B",
  "#FBBF24",
  "#FCD34D",
  "#FDE68A",
  "#D97706",
  "#92400E",
  "#FFBF00",
  "#FFD700",
  "#FFFFFF",
  "#F9FAFB",
  "#F3F4F6",
  "#E5E7EB",
  "#FEFEFE",
];

// Reduced confetti count for better performance
const CONFETTI_COUNTS = [60, 50, 40, 30]; // Reduced from 120, 100, 80, 60

type ConfettiPieceType = {
  id: number;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  delay: number;
  drift: number;
};

// Optimized confetti generation with memoization
function generateConfetti(count: number, startId = 0): ConfettiPieceType[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    x: Math.random() * 100,
    y: Math.random() * -200 - 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    width: Math.random() * 12 + 6, // Slightly smaller pieces
    height: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    delay: Math.random() * 1.2, // Reduced delay range
    drift: (Math.random() - 0.5) * 60, // Reduced drift
  }));
}

// Memoized confetti piece component to prevent unnecessary re-renders
const ConfettiPiece = ({ piece }: { piece: ConfettiPieceType }) => {
  // Memoize the style object to prevent recreation on each render
  const style = useMemo(
    () => ({
      left: `${piece.x}%`,
      backgroundColor: piece.color,
      width: `${piece.width}px`,
      height: `${piece.height}px`,
      borderRadius: "2px",
    }),
    [piece.x, piece.color, piece.width, piece.height]
  );

  // Memoize animation values
  const animationProps = useMemo(
    () => ({
      initial: {
        y: piece.y,
        rotate: piece.rotation,
        opacity: 1,
        x: 0,
      },
      animate: {
        y: (typeof window !== "undefined" ? window.innerHeight : 800) + 100,
        rotate: piece.rotation + 360, // Reduced rotation for better performance
        opacity: 0.6,
        x: piece.drift,
      },
      transition: {
        duration: 1.8 + Math.random() * 0.8, // Slightly faster animation
        delay: piece.delay,
        ease: "easeIn",
      },
    }),
    [piece.y, piece.rotation, piece.drift, piece.delay]
  );

  return (
    <motion.div
      className="absolute will-change-transform" // Added will-change for GPU acceleration
      style={style}
      {...animationProps}
    />
  );
};

const ConfettiComponent = forwardRef<{ trigger: () => void }>((props, ref) => {
  const [confetti, setConfetti] = useState<ConfettiPieceType[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Memoized confetti generation to prevent recreation on each trigger
  const generateAllConfetti = useCallback(() => {
    let currentId = 0;
    const waves = CONFETTI_COUNTS.map((count, index) => {
      const wave = generateConfetti(count, currentId);
      currentId += count;
      return wave.map((p) => ({
        ...p,
        delay: p.delay + index * 0.08, // Reduced stagger time
      }));
    });

    return waves.flat();
  }, []);

  const triggerConfetti = useCallback(() => {
    const allConfetti = generateAllConfetti();
    setConfetti(allConfetti);
    setIsActive(true);
  }, [generateAllConfetti]);

  useImperativeHandle(
    ref,
    () => ({
      trigger: triggerConfetti,
    }),
    [triggerConfetti]
  );

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
      }, 3500); // Reduced cleanup time

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Memoize the confetti pieces to prevent unnecessary re-renders
  const confettiElements = useMemo(
    () =>
      confetti.map((piece) => <ConfettiPiece key={piece.id} piece={piece} />),
    [confetti]
  );

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          style={{
            transform: "translateZ(0)", // Force GPU layer
            backfaceVisibility: "hidden", // Optimize for animations
          }}>
          {confettiElements}
        </div>
      )}
    </AnimatePresence>
  );
});

ConfettiComponent.displayName = "ConfettiComponent";

export default ConfettiComponent;
