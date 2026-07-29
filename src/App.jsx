import { useEffect, useState } from "react";
import Grainient from "./components/Grainient/Grainient";
import Title from "./components/Title";
import Subtitle from "./components/Subtitle";
import ScrollHint from "./components/ScrollHint";
import Sections from "./components/Sections";

// The original artwork's mesh-gradient composition (colors + shape) is baked
// into the component's gradient field — sampled from gradient.jpg.
export default function App() {
  // 0 at top of page -> 1 once the hero is (almost) scrolled past
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(
        1,
        Math.max(0, window.scrollY / (window.innerHeight * 0.9)),
      );
      setScroll(p);
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
      {/* Fixed animated gradient, settles into cream as you scroll */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Grainient
          timeSpeed={0.2}
          warpSpeed={1.5}
          rotationAmount={12}
          contrast={1.1}
          saturation={1.0}
          gamma={1.0}
          grainAmount={0.15}
          grainScale={1.0}
          grainAnimated
          mouseInfluence={0.04}
          mouseWarp={0.07}
          scrollProgress={scroll}
        />
      </div>

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
          <Title style={{ width: "min(72vw, 880px)", height: "auto" }} />
          <Subtitle
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(14px, 2vw, 24px)",
              letterSpacing: "0.4em",
              textIndent: "0.4em", // optically re-centers tracked text
              color: "#1E1646",
            }}
          >
            SOPHROLOGIE
          </Subtitle>
        </div>
        <ScrollHint
          style={{ pointerEvents: "auto", cursor: "pointer" }}
          onClick={() =>
            document
              .getElementById("content")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />
      </header>

      {/* Landing content */}
      <main id="content" style={{ position: "relative", zIndex: 1 }}>
        <Sections />
      </main>
    </div>
  );
}
