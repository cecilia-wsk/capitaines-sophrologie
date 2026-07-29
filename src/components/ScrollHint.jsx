import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function ScrollHint({ style, className, onClick }) {
  const root = useRef(null);

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
