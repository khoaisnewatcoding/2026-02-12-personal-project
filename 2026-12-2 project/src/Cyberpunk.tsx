import { useState, useEffect, useRef } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 2.2;
const GROW_STEP = 0.08;
const SHRINK_STEP = 0.02;
const INTERVAL = 16; // ms

const Cyberpunk = () => {
  const [scale, setScale] = useState(MIN_SCALE);
  const [growing, setGrowing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle growing/shrinking
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setScale(prev => {
        if (growing) {
          const next = prev + GROW_STEP;
          if (next > MAX_SCALE) return MIN_SCALE; // reset if too big
          return next;
        }
        return Math.max(MIN_SCALE, prev - SHRINK_STEP);
      });
    }, INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [growing]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") setGrowing(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setGrowing(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = () => setGrowing(true);
  const handleMouseUp = () => setGrowing(false);

  return (
    <span
      className="text-primary cursor-pointer transition-transform duration-100 inline-block"
      style={{ transform: `scale(${scale})` }}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      aria-label="Cyberpunk button"
    >
      Cyberpunk
    </span>
  );
};

export default Cyberpunk;