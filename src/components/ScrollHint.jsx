import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";

export default function ScrollHint({ style, className, onClick }) {
  const root = useRef(null);

  // Entrance animation (fade in + float yoyo)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(root.current, { xPercent: -50 });

      gsap.from(root.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 2.2, // after the subtitle fade
      });
      gsap.to(root.current, {
        y: 10,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.4,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Fade out as soon as the user starts scrolling
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let raf = 0;

    const tick = () => {
      raf = 0;
      const t = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.25)));
      gsap.set(el, { opacity: 1 - t });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={root}
      className={className}
      onClick={onClick}
      style={{
        position: "absolute",
        bottom: "7vh",
        left: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "11px",
          letterSpacing: "0.35em",
          textIndent: "0.35em",
          color: "#1E1646",
        }}
      >
        SCROLL
      </span>
      <span
        style={{
          width: "1px",
          height: "48px",
          background: "#1E1646",
          opacity: 1,
        }}
      />
    </div>
  );
}
