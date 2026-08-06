import { useEffect, useState, useRef } from "react";
import Grainient from "./components/Grainient/Grainient";
import Title from "./components/Title";
import Subtitle from "./components/Subtitle";
import ScrollHint from "./components/ScrollHint";
import Navbar from "./components/Navbar";
import Sections from "./components/Sections";
import { scrollToSection } from "./lenis";

/*
  Background colour stops for the Grainient shader's settling target.
  As the user scrolls through the content page the shader transitions
  from the animated artwork to one of these colours — while the grain
  stays fully visible across the whole viewport.
 */
const STOPS = [
  [0.973, 0.91, 0.792], // cream        (hero settled) rgb(248, 232, 202) — #F8E8CA
  [0.98, 0.863, 0.71], // warm cream   (bridge 1).     rgb(250, 220, 181) — #FADCB5
  [0.99, 0.816, 0.643], // light orange (section 2).    rgb(252, 208, 164) — #FAD7B5
  [0.953, 0.808, 0.878], // orange rose    (section 3).  rgb(243, 206, 224) — #F3CEE0
  [0.996, 0.78, 0.918], // soft-rose  (bridge 2).    rgb(254, 199, 234) — #FAD7BE
];

function mixArr(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function getTargetColour(progress) {
  const p = Math.min(1, Math.max(0, progress)) * (STOPS.length - 1);
  const i = Math.floor(p);
  const t = p - i;
  return mixArr(STOPS[i], STOPS[Math.min(i + 1, STOPS.length - 1)], t);
}

export default function App() {
  // 0 at top of page -> 1 once the hero is (almost) scrolled past
  const [scroll, setScroll] = useState(0);
  // 0 at top of content -> 1 once the last section is reached
  const [targetColor, setTargetColor] = useState(STOPS[0]);

  // hero title + subtitle visible only (near) the top of the page
  const heroContentVisible = scroll < 0.03;

  const mainRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sy = window.scrollY;
      const vh = window.innerHeight;

      // Hero progress (matches Grainient scrollProgress)
      const heroP = Math.min(1, Math.max(0, sy / (vh * 0.9)));
      setScroll(heroP);

      // Colour target progress: 0 at top of <main> -> 1 at bottom of <main>
      const main = mainRef.current;
      if (main) {
        const mainTop = main.offsetTop;
        const mainH = main.offsetHeight;
        const travel = Math.max(1, mainH - vh);
        const contentP = Math.min(
          1,
          Math.max(0, (sy - mainTop + vh * 0.3) / travel),
        );
        setTargetColor(getTargetColour(contentP));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div>
      {/* Fixed animated gradient + grain — always at opacity 1, whole page */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Grainient
          timeSpeed={0.2}
          warpSpeed={1.5}
          rotationAmount={12}
          contrast={1.1}
          saturation={1.0}
          gamma={1.0}
          grainAmount={0.1}
          grainScale={1.0}
          mouseInfluence={0.04}
          mouseWarp={0.07}
          scrollProgress={scroll}
          targetColor={targetColor}
        />
      </div>

      {/* Pill navbar — appears shortly after the user starts scrolling */}
      <Navbar visible={scroll >= 0.3} />

      {/* Hero */}
      <header
        style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(14px, 2.5vw, 30px)",
          }}
        >
          <Title
            visible={heroContentVisible}
            style={{ width: "min(86vw, 880px)", height: "auto" }}
          />
          <Subtitle
            visible={heroContentVisible}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(14px, 2vw, 24px)",
              letterSpacing: "0.4em",
              textIndent: "0.4em",
              color: "#1E1646",
            }}
          >
            SOPHROLOGIE
          </Subtitle>
        </div>
        <ScrollHint
          style={{ pointerEvents: "auto", cursor: "pointer" }}
          onClick={() => scrollToSection("#content")}
        />
      </header>

      {/* Landing content */}
      <main
        id="content"
        ref={mainRef}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Sections />
      </main>
    </div>
  );
}
