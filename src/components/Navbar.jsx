import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAV_LINKS_LEFT = [
  { label: "À propos", href: "#a-propos" },
  { label: "Les séances", href: "#seances" },
];

const NAV_LINKS_RIGHT = [
  { label: "La sophrologie", href: "#sophrologie" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ visible }) {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.set(navRef.current, { autoAlpha: 0, y: -24 });
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const links = nav.querySelectorAll("a");

    gsap.killTweensOf([nav, links]);

    if (visible) {
      gsap.to(nav, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      });
      gsap.fromTo(
        links,
        { autoAlpha: 0, y: -6 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
          delay: 0.2,
        },
      );
    } else {
      gsap.to(nav, {
        autoAlpha: 0,
        y: -24,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [visible]);

  return (
    <nav ref={navRef} className="site-nav" aria-label="Navigation principale">
      <div className="nav-side nav-side--left">
        {NAV_LINKS_LEFT.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <a
        className="nav-logo"
        href="#top"
        aria-label="Capitaines — retour en haut de page"
      >
        <svg
          viewBox="0 0 165.92 195.02"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ height: "34px", width: "auto", display: "block" }}
        >
          <g fill="#1E1746">
            <path d="M83.17,195.02c-7.29-9.3-17.31-14.61-26.84-20.55-11.6-7.23-23.03-14.7-33.25-23.83-8.01-7.15-15.28-14.95-19.72-24.93-9.53-21.4,1.94-43.97,24.86-48.98,13.81-3.02,26.2.35,37.49,8.46,1.79,1.28,2.13,3.34.97,4.9-1.2,1.6-3.11,1.86-4.96.52-3.96-2.87-8.24-5.11-13.02-6.13-11.47-2.44-21.33.62-29.4,9.17-5.12,5.42-7.86,11.85-7.33,19.36.54,7.63,3.54,14.4,7.9,20.61,7.15,10.18,16.35,18.26,26.52,25.22,9.09,6.22,33.68,20.25,36.74,22.53,1.74-1.37,20.79-11.71,28.36-16.64,10.05-6.54,19.68-13.65,27.85-22.51,5.89-6.39,10.95-13.33,13.23-21.92,3.14-11.87-.27-21.67-9.63-29.35-11.65-9.56-26.3-9.82-38.51-.74-2.32,1.73-5.52,1.29-6.13-1.81-.38-1.95.98-3.14,2.35-3.96,3.38-2.04,6.72-4.35,10.39-5.68,14.2-5.15,28.01-4.45,40.61,4.51,10.35,7.36,15.07,17.73,14.17,30.4-.64,9.02-4.82,16.67-10.26,23.69-7.81,10.08-17.35,18.29-27.88,25.33-9.4,6.28-19.03,12.22-28.51,18.38-5.93,3.85-11.73,7.88-15.98,13.95Z" />
            <path d="M83.69.06c8.58.16,17.11,7.98,16.36,18.03-.71,9.64-9.31,16.93-18.56,16.05-9.39-.9-16.2-9.32-15.32-18.96C66.97,6.32,75.1-.7,83.69.06ZM82.85,6.46c-5.67,0-10.09,4.53-10.08,10.32.01,5.99,4.4,10.4,10.36,10.4,5.87,0,10.38-4.46,10.37-10.25,0-5.78-4.79-10.47-10.65-10.46Z" />
            <path d="M81.98,54.93c-38.15,0-63.46-17.41-77.97-30.37-.99-.88-1.07-2.4-.19-3.38.88-.99,2.4-1.08,3.38-.19,13.89,12.41,38.13,25.25,74.77,25.25s61.69-12.88,76.8-25.32c1.02-.84,2.53-.69,3.37.33.84,1.02.69,2.53-.33,3.37-15.72,12.94-42.33,30.31-79.85,30.31Z" />
            <path d="M83.01,127.1h0c-1.32,0-2.39-1.08-2.39-2.41,0,0-1.88-19.86-1.86-25.83.03-7.54,2.06-32.12,2.06-32.12,0-1.32,1.08-2.39,2.4-2.39h0c1.32,0,2.39,1.08,2.39,2.41,0,0,1.87,24.37,1.84,31.85-.02,6.04-2.04,26.1-2.04,26.1,0,1.32-1.08,2.39-2.4,2.39Z" />
          </g>
        </svg>
      </a>

      <div className="nav-side nav-side--right">
        {NAV_LINKS_RIGHT.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
