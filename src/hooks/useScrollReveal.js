import { useEffect, useRef } from "react";

/**
 * useScrollReveal — lightweight IntersectionObserver hook for scroll-triggered
 * reveal animations. Adds `.revealed` class to child elements bearing
 * `[data-reveal]` attribute when they enter the viewport.
 *
 * Supports `data-reveal-delay="100"` for stagger timing (ms).
 *
 * Usage:
 *   const containerRef = useScrollReveal();
 *   <div ref={containerRef}>
 *     <h1 data-reveal>Hello</h1>
 *     <p data-reveal data-reveal-delay="150">World</p>
 *   </div>
 */
export default function useScrollReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (options.ready === false) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      container.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("revealed");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.revealDelay || "0", 10);
            if (delay > 0) {
              setTimeout(() => el.classList.add("revealed"), delay);
            } else {
              el.classList.add("revealed");
            }
            observer.unobserve(el);
          }
        });
      },
      {
        rootMargin: options.rootMargin || "0px 0px -60px 0px",
        threshold: options.threshold || 0.15,
      },
    );

    // Observe all data-reveal children
    const targets = container.querySelectorAll("[data-reveal]");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold, options.ready]);

  return containerRef;
}
