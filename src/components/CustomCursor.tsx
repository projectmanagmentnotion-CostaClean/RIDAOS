import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const INTERACTIVE_SELECTOR =
  'a, button, input[type="submit"], [role="button"], [data-cursor="interest"], .cursor-interest';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 11,
      height: 11,
      backgroundColor: "#ff00b8",
      mixBlendMode: "normal",
      autoAlpha: 0,
      scale: 1,
    });

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.16,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.16,
      ease: "power3.out",
    });

    const showCursor = () => {
      gsap.to(cursor, {
        autoAlpha: 1,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const hideCursor = () => {
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const moveCursor = (event: MouseEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const enterInterest = () => {
      gsap.to(cursor, {
        width: 68,
        height: 68,
        backgroundColor: "#39ff14",
        mixBlendMode: "difference",
        duration: 0.28,
        ease: "power3.out",
      });
    };

    const leaveInterest = () => {
      gsap.to(cursor, {
        width: 11,
        height: 11,
        backgroundColor: "#ff00b8",
        mixBlendMode: "normal",
        duration: 0.22,
        ease: "power3.out",
      });
    };

    const bindInteractiveElements = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)
      );

      elements.forEach((element) => {
        element.addEventListener("mouseenter", enterInterest);
        element.addEventListener("mouseleave", leaveInterest);
      });

      return elements;
    };

    let interactiveElements = bindInteractiveElements();

    const observer = new MutationObserver(() => {
      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", enterInterest);
        element.removeEventListener("mouseleave", leaveInterest);
      });

      interactiveElements = bindInteractiveElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseenter", showCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      observer.disconnect();

      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", showCursor);
      window.removeEventListener("mouseleave", hideCursor);

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", enterInterest);
        element.removeEventListener("mouseleave", leaveInterest);
      });

      xTo.tween?.kill();
      yTo.tween?.kill();
      gsap.killTweensOf(cursor);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

export default CustomCursor;
