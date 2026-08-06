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

const h1Style = {
  fontFamily: "'King and Queen', serif",
  fontWeight: 400,
  fontSize: "clamp(42px, 6vw, 76px)",
  lineHeight: 1.05,
  color: NAVY,
  margin: "0 0 30px",
};

const h2Style = {
  fontFamily: "'King and Queen', serif",
  fontWeight: 400,
  fontSize: "clamp(26px, 3.4vw, 40px)",
  lineHeight: 1.35,
  color: NAVY,
};

const body = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: "17px",
  lineHeight: 1.75,
  color: NAVY,
  maxWidth: "900px",
};

/* ---- h1: char-by-char reveal ------------------------------------------------ */
function H1Reveal({ text }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chars = ref.current.querySelectorAll(".char");
      gsap.fromTo(
        chars,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.035,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        ...h1Style,
        overflow: "hidden",
        display: "block",
      }}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </h1>
  );
}

/* ---- h2: mask slide-up reveal (whole line, not char-by-char) -------------- */
function H2Reveal({ text }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const inner = ref.current.querySelector(".mask-inner");
      gsap.fromTo(
        inner,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        display: "block",
        margin: "0 0 30px",
        maxWidth: "920px",
      }}
    >
      <h2
        className="mask-inner"
        style={{
          ...h2Style,
          display: "inline-block",
          willChange: "transform",
          margin: 0,
        }}
      >
        {text}
      </h2>
    </div>
  );
}

/* ---- Standard reveal-item stagger inside a section ---------------------- */
function useSectionReveal(ref) {
  useLayoutEffect(() => {
    if (!ref.current) return;
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
  }, [ref]);
}

/* ---- Line-by-line paragraph stagger ------------------------------------- */
function ParagraphReveal({ children, style }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = ref.current.querySelectorAll(".line-block");
      gsap.fromTo(
        lines,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

/* ---- Image scale + fade reveal ----------------------------------------- */
function useImageReveal(ref, wrapRef) {
  useLayoutEffect(() => {
    if (!ref.current || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, scale: 1.08 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, [ref, wrapRef]);
}

/* ---- Badge stagger ------------------------------------------------------ */
function useBadgeReveal(listRef) {
  useLayoutEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      const labelEl =
        listRef.current.parentElement.querySelector(".specialite-label");
      const badges = listRef.current.querySelectorAll("li");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
      tl.fromTo(
        labelEl,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
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
  }, [listRef]);
}

/* -------------------------------------------------------------------------- */

export default function Sections() {
  // Session pricing refs
  const sessionsRef = useRef(null);
  useSectionReveal(sessionsRef);
  // Contact refs
  const contactRef = useRef(null);
  useSectionReveal(contactRef);
  const aboutRef = useRef(null);
  useSectionReveal(aboutRef);
  const aboutImgRef = useRef(null);
  const aboutWrapRef = useRef(null);
  useImageReveal(aboutImgRef, aboutWrapRef);
  const badgeListRef = useRef(null);
  useBadgeReveal(badgeListRef);

  // Cabinet refs
  const cabinetImgRef = useRef(null);
  const cabinetWrapRef = useRef(null);
  useImageReveal(cabinetImgRef, cabinetWrapRef);

  return (
    <>
      {/* 1. LA SOPHROLOGIE ------------------------------------------------- */}
      <section
        ref={aboutRef}
        style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
      >
        <H1Reveal text="La Sophrologie" />

        {/* h2: What is Sophrology? */}
        <div style={{ marginTop: "8vh" }}>
          <H2Reveal text="Qu'est-ce que la sophrologie ?" />
          <ParagraphReveal>
            <p className="line-block" style={body}>
              Il serait facile de te répondre en te donnant une définition
              technique de la sophrologie, de t&apos;expliquer ses origines ou
              encore les outils qu&apos;elle utilise. Pourtant, ce n&apos;est
              pas ainsi que j&apos;ai envie de te la présenter.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              À mes yeux, la sophrologie ne se résume pas à une définition. Elle
              se vit, elle s&apos;expérimente et, bien souvent, elle se ressent
              avant même de pouvoir se raconter.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              C&apos;est une méthode qui va à contre-courant de ce que notre
              société nous demande. Là où tout nous pousse à aller toujours plus
              vite, elle nous invite à ralentir. Là où nous avons appris à
              ignorer les signaux de notre corps pour continuer à avancer, elle
              nous encourage à les écouter. Là où les émotions sont souvent
              mises de côté, minimisées ou jugées, elle leur redonne une place
              afin qu&apos;elles puissent être accueillies avec davantage de
              bienveillance.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Elle nous rappelle également que le repos n&apos;est pas une
              faiblesse dans un monde qui valorise la performance et la
              productivité, et qu&apos;il est possible d&apos;exister autrement
              qu&apos;à travers ce que l&apos;on accomplit. Progressivement,
              elle nous aide à poser des limites plus respectueuses de nos
              besoins, à nous reconnecter à nous-mêmes et à retrouver une façon
              d&apos;être plus alignée avec ce qui est important pour nous.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              La sophrologie n&apos;ajoute pas une nouvelle contrainte à un
              quotidien déjà chargé. Elle offre un espace pour souffler, prendre
              du recul, relâcher les tensions et revenir à l&apos;essentiel. À
              travers des exercices de respiration, de relaxation dynamique, de
              visualisation et de perception du corps, elle permet de développer
              ses propres ressources et d&apos;apprendre à les mobiliser dans
              les situations du quotidien.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Au-delà d&apos;un simple moment de détente, la sophrologie est une
              méthode d&apos;accompagnement qui favorise les prises de
              conscience et le changement. Elle permet de mieux se connaître, de
              porter un regard plus juste sur soi et de retrouver
              progressivement une manière de vivre plus sereine, plus libre et
              plus en accord avec ses besoins.
            </p>
          </ParagraphReveal>
        </div>

        {/* h2: First Session */}
        <div style={{ marginTop: "12vh" }}>
          <H2Reveal text="À quoi t'attendre lors de ta 1ère séance ?" />
          <ParagraphReveal>
            <p className="line-block" style={body}>
              Si tu n&apos;as jamais pratiqué la sophrologie, il est tout à fait
              normal de te demander comment se déroule une séance. Peut-être te
              demandes-tu si tu vas devoir parler, si tu vas réussir les
              exercices ou encore si la sophrologie est vraiment faite pour toi.
              Rassure-toi : il n&apos;y a rien à préparer, rien à réussir et
              rien à prouver.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              La première séance dure environ 1h30, car avant de commencer la
              pratique, nous prenons le temps de faire connaissance. Tu
              t&apos;installes confortablement, je t&apos;offre quelque chose à
              boire si tu en as envie, puis nous échangeons simplement. Je vais
              te poser différentes questions, non pas pour te faire passer un
              interrogatoire, mais pour comprendre qui tu es, ce que tu
              traverses aujourd&apos;hui et ce que tu aimerais voir évoluer.
              C&apos;est cette première rencontre qui me permet de construire un
              accompagnement réellement adapté à toi.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Tu peux prendre ton temps, chercher tes mots, rire, pleurer ou
              hésiter. Certaines personnes parlent très facilement,
              d&apos;autres ont besoin de plus de temps. Les deux sont
              parfaitement normaux. L&apos;important est que tu te sentes
              suffisamment en confiance pour être toi-même, sans avoir
              l&apos;impression de devoir dire ou faire les choses « comme il
              faut ».
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Au cours de cet échange, il est possible que des émotions
              émergent. Parfois, avancer commence simplement par le fait de
              pouvoir déposer ce que l&apos;on porte depuis longtemps.
              C&apos;est aussi à ce moment-là que nous définissons ensemble ce
              que tu souhaites faire évoluer. Certaines personnes arrivent avec
              un objectif très précis, d&apos;autres ont seulement le sentiment
              que quelque chose ne va plus. Et il arrive qu&apos;en parlant, le
              véritable besoin apparaisse plus clairement. C&apos;est tout à
              fait normal.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Avant de passer à la pratique, je prends également le temps de
              t&apos;expliquer ma façon de travailler, le déroulement de
              l&apos;accompagnement et de répondre à toutes les questions que tu
              pourrais avoir. L&apos;idée est que tu repartes en sachant
              exactement à quoi t&apos;attendre.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              La pratique débute généralement par quelques mouvements doux
              associés à la respiration, avant de poursuivre avec une
              visualisation. Il n&apos;y a rien à réussir : je t&apos;invite
              simplement à vivre l&apos;expérience et à te laisser porter.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              À la fin de la séance, nous prenons quelques minutes pour échanger
              sur ce que tu as vécu. Tu peux partager les sensations, les
              pensées ou les émotions qui ont émergé, ou simplement me dire que
              tu n&apos;as rien ressenti de particulier. Il n&apos;y a pas de
              bonne ou de mauvaise réponse : tout ce que tu ressens a sa place.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              À partir de cette première rencontre, je construis un
              accompagnement entièrement personnalisé. Les séances suivantes
              suivent une structure similaire : un temps d&apos;échange pour
              faire le point, puis la pratique. Chaque séance te rapproche, à
              ton rythme, de ce que tu souhaites faire évoluer dans ta vie.
            </p>
            <p className="line-block" style={{ ...body, marginTop: "20px" }}>
              Enfin, ce qui est important pour moi, c&apos;est que la
              sophrologie ne s&apos;arrête pas à la porte de mon cabinet. À
              chaque séance, tu repars avec des outils concrets à intégrer dans
              ton quotidien, afin qu&apos;ils deviennent progressivement de
              véritables ressources. Au fil du temps, l&apos;idée est que tu
              apprennes à te faire confiance, à t&apos;appuyer sur toi-même et à
              faire de toi ta meilleure alliée.
            </p>
          </ParagraphReveal>
        </div>
      </section>

      {/* 2. À PROPOS ------------------------------------------------------- */}
      <section
        ref={aboutRef}
        style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
      >
        <H1Reveal text="À Propos" />

        <div className="about-grid" style={{ maxWidth: "920px" }}>
          {/* Photo */}
          <div
            className="about-cell about-photo"
            ref={aboutWrapRef}
            style={{ overflow: "hidden" }}
          >
            <img
              ref={aboutImgRef}
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

          {/* Text column: bio paragraphs FIRST */}
          <div className="about-cell about-paragraphs">
            <p className="reveal-item" style={body}>
              Je me présente, je suis Fred, et avant de devenir sophrologue
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
          </div>
        </div>

        {/* QUOTE – separate block, max-width 900px */}
        <blockquote
          className="reveal-item"
          style={{
            ...h2Style,
            maxWidth: "900px",
            margin: "40px auto 32px",
            padding: "24px 0",
          }}
        >
          Fais de toi la Capitaine de ta vie, une femme en puissance qui
          s&apos;écoute, qui s&apos;honore, qui se remet au centre.
        </blockquote>

        {/* BADGES – separate block, max-width 900px */}
        <div
          className="reveal-item"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
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

        {/* h2: Le cabinet */}
        <div style={{ marginTop: "12vh" }}>
          <H2Reveal text="Le cabinet" />

          <div className="cabinet-grid">
            {/* Left: Photo */}
            <div
              className="cabinet-photo reveal-item"
              ref={cabinetWrapRef}
              style={{ overflow: "hidden", borderRadius: "4px" }}
            >
              <img
                ref={cabinetImgRef}
                src="/images/cabinet.jpg"
                alt="Cabinet de sophrologie — espace chaleureux et apaisant"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Right: Text */}
            <div className="cabinet-text">
              <ParagraphReveal>
                <p className="line-block" style={body}>
                  Quand j&apos;ai imaginé mon espace, je ne voulais pas
                  simplement créer un lieu où l&apos;on vient faire une séance
                  de sophrologie. J&apos;avais envie de créer un endroit qui ait
                  du sens. Un lieu où l&apos;on se sent accueillie dès les
                  premiers instants, où l&apos;on peut souffler, ralentir et
                  s&apos;autoriser à déposer ce que l&apos;on porte au
                  quotidien.
                </p>
                <p
                  className="line-block"
                  style={{ ...body, marginTop: "20px" }}
                >
                  J&apos;ai imaginé un espace chaleureux, apaisant et
                  sécurisant, où tu peux t&apos;exprimer librement, sans peur
                  d&apos;être jugée. Un lieu où tu peux déposer ton histoire, ou
                  simplement une partie de celle-ci, à ton rythme.
                </p>
                <p
                  className="line-block"
                  style={{ ...body, marginTop: "20px" }}
                >
                  Beaucoup de femmes passent leurs journées à répondre aux
                  besoins des autres, à tout anticiper, à faire en sorte que
                  tout le monde aille bien. Alors j&apos;avais envie de créer un
                  endroit où, pour une fois, c&apos;est d&apos;elles dont on
                  prend soin.
                </p>
                <p
                  className="line-block"
                  style={{ ...body, marginTop: "20px" }}
                >
                  Je suis convaincue que sortir de son environnement habituel,
                  s&apos;accorder un temps pour soi et entrer dans un lieu pensé
                  pour le calme et l&apos;écoute permet de vivre
                  l&apos;accompagnement différemment. Cet espace a été imaginé
                  comme un véritable lieu ressource, où tu peux te reconnecter à
                  toi-même, retrouver ton souffle et avancer, pas à pas, vers un
                  quotidien plus apaisé.
                </p>
              </ParagraphReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LES SÉANCES ----------------------------------------------------- */}
      <section
        ref={sessionsRef}
        style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
      >
        <H1Reveal text="Les Séances" />

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
            <div style={{ maxWidth: "900px" }}>
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
              <p style={body}>{s.desc}</p>
            </div>
            <span style={{ ...label, opacity: 0.8 }}>{s.meta}</span>
          </div>
        ))}
      </section>

      {/* 4. CONTACT --------------------------------------------------------- */}
      <section
        ref={contactRef}
        style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
      >
        <H1Reveal text="Contact" />

        <p className="reveal-item" style={{ ...body, marginBottom: "14px" }}>
          <a
            className="contact-link"
            href="mailto:info@capitaines-sophrologie.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b className="contact-label">mail </b>
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
            <b className="contact-label">whatsapp </b>
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
            <b className="contact-label">instagram </b>
            <span className="contact-text">@capitaines.sophrologie</span>
            <ArrowExternal className="arrow" />
          </a>
        </p>
        <div className="reveal-item" style={{ display: "inline-block" }}>
          <PopupButton
            className="booking-button"
            url="https://calendly.com/capitaines-sophrologie/seance-de-suivi"
            rootElement={document.getElementById("root")}
            text="Prendre rendez-vous"
          />
        </div>
      </section>

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
