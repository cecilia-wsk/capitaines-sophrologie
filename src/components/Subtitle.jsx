import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Subtitle({
  children,
  style,
  className,
  visible = true,
}) {
  const root = useRef(null);
  const prevVisible = useRef(visible);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (visible) {
        gsap.from(root.current, {
          opacity: 0,
          y: 10,
          duration: 0.8,
          ease: "power2.out",
          delay: 1, // starts once the title's letter stagger completes
        });
      } else {
        gsap.set(root.current, { opacity: 0, y: 10 });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  // Fade out when the user starts scrolling (mirror of the entrance),
  // replay the entrance when the user comes back to the top
  useEffect(() => {
    if (prevVisible.current === visible) return;
    prevVisible.current = visible;

    gsap.killTweensOf(root.current);

    if (visible) {
      gsap.fromTo(
        root.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1, // after the title replay completes
        },
      );
    } else {
      gsap.to(root.current, {
        opacity: 0,
        y: 10,
        duration: 0.8,
        ease: "power2.in",
      });
    }
  }, [visible]);

  return (
    <div ref={root} style={style} className={className}>
      {children}
    </div>
  );
}
