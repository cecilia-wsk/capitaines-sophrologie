import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ---- Lenis smooth-scroll (inertia/lag) synced with GSAP ScrollTrigger ---- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
/* -------------------------------------------------------------------------- */

/* Keeps the section title just under the fixed navbar when landing. */
const NAV_OFFSET = -84;

export function scrollToSection(hash) {
  const section = document.querySelector(hash);
  if (!section) return;
  const target = section.querySelector(".section-heading") || section;
  lenis.scrollTo(target, { offset: NAV_OFFSET });
}

/* Smooth-scroll every in-page anchor (navbar, logo, section buttons, ...). */
document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute("href");
  if (hash.length < 2) return;
  event.preventDefault();
  if (hash === "#top") {
    lenis.scrollTo(0);
    return;
  }
  scrollToSection(hash);
});

export default lenis;
