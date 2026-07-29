import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Subtitle({ children, style, className }) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(root.current, {
        opacity: 0,
        y: 10,
        duration: 1.4,
        ease: "power2.out",
        delay: 1.6, // lands as the title's letter stagger settles
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} style={style} className={className}>
      {children}
    </div>
  );
}
