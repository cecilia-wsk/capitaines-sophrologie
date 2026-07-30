import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { PopupButton } from "react-calendly";
import ArrowExternal from "./ArrowExternal";

const NAVY = "#1E1646";

const label = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: "13px",
  color: NAVY,
  opacity: 0.55,
};

const heading = {
  fontFamily: "'King and Queen', serif",
  fontWeight: 400,
  fontSize: "clamp(42px, 6vw, 76px)",
  lineHeight: 1.05,
  color: NAVY,
  margin: "22px 0 30px",
};

const body = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: "17px",
  lineHeight: 1.75,
  color: NAVY,
  maxWidth: "600px",
};

/* ---- Dash-style title mask + line-by-line item reveal ------------------- */
function SectionTitle({ text }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = ref.current.querySelectorAll(".char");
      gsap.from(chars, {
        yPercent: 120,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <h2
      ref={ref}
      className="section-title"
      style={{
        ...heading,
        overflow: "hidden",
        display: "block",
      }}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char"
          style={{
            display: "inline-block",
            willChange: "transform",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </h2>
  );
}

function Section({ title, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = ref.current.querySelectorAll(".reveal-item");

      items.forEach((item, i) => {
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
    >
      {title && <SectionTitle text={title} />}
      {children}
    </section>
  );
}
/* -------------------------------------------------------------------------- */

export default function Sections() {
  const imgRef = useRef(null);
  const imgWrapRef = useRef(null);
  const badgeListRef = useRef(null);

  useLayoutEffect(() => {
    if (!imgRef.current || !imgWrapRef.current) return;
    const ctx = gsap.context(() => {
      // Curtain reveal: image slides up from below the mask
      gsap.from(imgRef.current, {
        yPercent: 100,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgWrapRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Stagger animation for the badge list in the first section
  useLayoutEffect(() => {
    if (!badgeListRef.current) return;
    const ctx = gsap.context(() => {
      const labelEl = badgeListRef.current.parentElement.querySelector(
        ".specialite-label",
      );
      const badges = badgeListRef.current.querySelectorAll("li");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: badgeListRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        labelEl,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
      ).fromTo(
        badges,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
        },
        "-=0.4",
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Section>
        <div className="about-grid" style={{ maxWidth: "920px" }}>
          <div
            className="about-cell about-photo reveal-item"
            ref={imgWrapRef}
            style={{ overflow: "hidden" }}
          >
            <img
              ref={imgRef}
              src="/images/fred.jpg"
              alt="Fred Roche — sophrologue"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <p
            className="about-cell about-quote reveal-item"
            style={{
              fontFamily: "'King and Queen', serif",
              fontWeight: 400,
              fontSize: "clamp(26px, 3.4vw, 40px)",
              lineHeight: 1.35,
              color: NAVY,
            }}
          >
            Fais de toi la Capitaine de ta vie, une femme en puissance qui
            s&apos;écoute, qui s&apos;honore, qui se remet au centre.
          </p>

          <div className="about-cell about-paragraphs">
            <p className="reveal-item" style={body}>
              Je me présente, je suis Fred et avant de devenir sophrologue
              certifiée, j&apos;ai accompagné les femmes autrement. À travers le
              maquillage et le relooking, le regard porté sur soi, l&apos;image
              que l&apos;on apprivoise...
            </p>
            <p className="reveal-item" style={{ ...body, marginTop: "20px" }}>
              Et puis surtout, je suis une femme qui a grandi entourée de
              femmes. J&apos;ai vu ma mère donner énormément aux autres, jongler
              entre mille responsabilités, gérer une charge mentale constante au
              point de s&apos;oublier en chemin. Et très tôt, j&apos;ai compris
              combien beaucoup de femmes ont à cœur d&apos;être présentes pour
              tout le monde...sauf pour elles-mêmes.
            </p>
            <p className="reveal-item" style={{ ...body, marginTop: "20px" }}>
              Ce qui m&apos;anime, c&apos;est d&apos;accompagner les femmes à se
              réapproprier leur corps, leur place, leurs besoins, leurs envies
              et leurs aspirations… pour (re)devenir les capitaines de leur vie.
            </p>

            <div style={{ marginTop: "32px" }}>
              <p
                className="specialite-label"
                style={{
                  ...label,
                  marginBottom: "14px",
                  fontSize: "17px",
                }}
              >
                Spécialisée dans
              </p>
              <ul
                ref={badgeListRef}
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {[
                  "La charge mentale",
                  "La confiance & l'estime de soi",
                  "La relation à soi, aux autres & à l'amour",
                ].map((item) => (
                  <li
                    key={item}
                     style={{
                       fontFamily: "'DM Sans', sans-serif",
                       fontWeight: 300,
                       fontSize: "13px",
                       color: NAVY,
                       padding: "10px 22px",
                       border: `1px solid ${NAVY}`,
                       borderRadius: "999px",
                       display: "inline-block",
                     }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Les séances">
        {[
          {
            name: "Séance découverte",
            desc: "Un premier temps pour poser vos besoins et découvrir la pratique en douceur.",
            meta: "90 min — 75 €",
          },
          {
            name: "Suivi individuel",
            desc: "Un accompagnement personnalisé, au rythme de vos objectifs.",
            meta: "60 min — 65 €",
          },
        ].map((s, i) => (
          <div
            key={s.name}
            className="reveal-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "24px",
              flexWrap: "wrap",
              padding: "30px 0",
              borderTop: `1px solid ${NAVY}22`,
              borderBottom: i === 1 ? `1px solid ${NAVY}22` : "none",
            }}
          >
            <div style={{ maxWidth: "560px" }}>
              <h3
                style={{
                  fontFamily: "'King and Queen', serif",
                  fontWeight: 400,
                  fontSize: "30px",
                  color: NAVY,
                  marginBottom: "8px",
                }}
              >
                {s.name}
              </h3>
              <p style={{ ...body, fontSize: "15px" }}>{s.desc}</p>
            </div>
            <span style={{ ...label, opacity: 0.8 }}>{s.meta}</span>
          </div>
        ))}
      </Section>

      <Section title="Contact">
        <p className="reveal-item" style={{ ...body, marginBottom: "14px" }}>
          <a
            className="contact-link"
            href="mailto:info@capitaines-sophrologie.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-text">info@capitaines-sophrologie.fr</span>
            <ArrowExternal className="arrow" />
          </a>
          <br />
          <a
            className="contact-link"
            href="https://wa.me/330632386258"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-text">06 32 38 62 58</span>
            <ArrowExternal className="arrow" />
          </a>
          <br />
          <a
            className="contact-link"
            href="https://instagram.com/capitaines.sophrologie"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-text">@capitaines.sophrologie</span>
            <ArrowExternal className="arrow" />
          </a>
        </p>
        <div className="reveal-item" style={{ display: "inline-block" }}>
          <PopupButton
            className="booking-button"
            url="https://calendly.com/capitaines-sophrologie/nouvelle-reunion"
            rootElement={document.getElementById("root")}
            text="Prendre rendez-vous"
          />
        </div>
      </Section>

      <footer
        style={{
          ...label,
          textAlign: "center",
          padding: "60px 24px",
          opacity: 1,
        }}
      >
        © 2026 Capitaines Sophrologie — Mentions légales
      </footer>
    </>
  );
}
