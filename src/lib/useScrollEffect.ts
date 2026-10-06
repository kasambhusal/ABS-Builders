import { useEffect, useRef } from "react";

/** Runs `callback` on scroll/resize, throttled to one call per animation frame (and once on mount). */
export function useScrollEffect(callback: () => void) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });

  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      saved.current();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
}
