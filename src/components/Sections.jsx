import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PopupButton } from "react-calendly";
import ArrowExternal from "./ArrowExternal";

const CALENDLY_URL = "https://calendly.com/capitaines-sophrologie/";

const specialties = [
  {
    title: "Alléger la charge mentale",
    text: "Retrouver de l’espace, écouter tes besoins et sortir du mode automatique.",
  },
  {
    title: "Renforcer la confiance en soi",
    text: "Porter un regard plus juste sur toi et reprendre ta place avec davantage de sérénité.",
  },
  {
    title: "Apaiser tes relations",
    text: "Mieux accueillir tes émotions et poser des limites plus respectueuses de toi.",
  },
];

const sessions = [
  {
    name: "Première séance",
    description:
      "Un temps pour faire connaissance, clarifier ce que tu traverses et découvrir la pratique sans rien avoir à préparer ni à réussir.",
    duration: "1h30",
    price: "70 €",
  },
  {
    name: "Séance de suivi",
    description:
      "Un accompagnement personnalisé, construit à partir de ton objectif et ajusté à ton rythme au fil des séances.",
    duration: "1h",
    price: "70 €",
  },
];

const methods = [
  "Respiration",
  "Mouvements doux",
  "Relaxation dynamique",
  "Visualisation",
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---- h1: char-by-char reveal -------------------------------------------- */
function H1Reveal({ id, text }) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

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
    <h2
      id={id}
      ref={ref}
      aria-label={text}
      style={{ overflow: "hidden", display: "block" }}
    >
      {text.split(/(\s+)/).map((part, partIndex) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span
            key={`${part}-${partIndex}`}
            className="word"
            aria-hidden="true"
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              verticalAlign: "top",
            }}
          >
            {part.split("").map((ch, charIndex) => (
              <span
                key={`${ch}-${charIndex}`}
                className="char"
                style={{ display: "inline-block", willChange: "transform" }}
              >
                {ch}
              </span>
            ))}
          </span>
        ),
      )}
    </h2>
  );
}

/* ---- h2 / quote: mask slide-up reveal ----------------------------------- */
function H2Reveal({ as: Tag = "h3", children, className }) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

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
    <div ref={ref} style={{ overflow: "hidden", display: "block" }}>
      <Tag
        className={["mask-inner", className].filter(Boolean).join(" ")}
        style={{ willChange: "transform" }}
      >
        {children}
      </Tag>
    </div>
  );
}

/* ---- Standard reveal-item stagger inside a section ---------------------- */
function useSectionReveal(sectionRef) {
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll("[data-reveal]");
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
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}

/* ---- Card reveal: card blocks only, with a light stagger ---------------- */
function useCardsReveal(sectionRef, selector) {
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll(selector);
      if (!cards.length) return;

      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: cards[0],
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, selector]);
}

/* ---- Line-by-line paragraph stagger ------------------------------------- */
function ParagraphReveal({ children }) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

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

  return <div ref={ref}>{children}</div>;
}

/* ---- Image scale + fade reveal ------------------------------------------ */
function useImageReveal(ref, wrapRef) {
  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !wrapRef.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

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

/* ---- Badge stagger ------------------------------------------------------- */
function useBadgeReveal(listRef) {
  useIsomorphicLayoutEffect(() => {
    if (!listRef.current) return undefined;

    gsap.registerPlugin(ScrollTrigger);

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

function BookingButton({ text = "Prendre rendez-vous" }) {
  const [rootElement, setRootElement] = useState(null);

  useEffect(() => {
    setRootElement(document.getElementById("root") || document.body);
  }, []);

  if (!rootElement) {
    return (
      <a className="primary-button" href={CALENDLY_URL}>
        {text}
      </a>
    );
  }

  return (
    <PopupButton
      className="primary-button"
      url={CALENDLY_URL}
      rootElement={rootElement}
      text={text}
    />
  );
}

function SectionHeading({ id, eyebrow, title, intro }) {
  return (
    <header className="section-heading">
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          ✻&nbsp;&nbsp;{eyebrow}
        </p>
      )}
      <H1Reveal id={id} text={title} />
      {intro && (
        <p className="section-intro" data-reveal>
          {intro}
        </p>
      )}
    </header>
  );
}

function ContactLink({ label, href, children, external = false }) {
  return (
    <a
      className="contact-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span className="contact-label">{label}</span>
      <span className="contact-text">{children}</span>
      {external && <ArrowExternal className="arrow" aria-hidden="true" />}
    </a>
  );
}

/* ---- Smooth expand/collapse for a <details> element --------------------- */
function useDetailsCollapse(detailsRef) {
  useIsomorphicLayoutEffect(() => {
    const details = detailsRef.current;
    if (!details) return undefined;

    const summary = details.querySelector("summary");
    const content = details.querySelector(".long-copy-content");
    if (!summary || !content) return undefined;

    const handleClick = (event) => {
      event.preventDefault();

      if (details.open) {
        details.classList.remove("is-open");
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            details.open = false;
            gsap.set(content, { clearProps: "all" });
          },
        });
      } else {
        details.open = true;
        details.classList.add("is-open");
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => gsap.set(content, { clearProps: "all" }),
          },
        );
      }
    };

    summary.addEventListener("click", handleClick);
    return () => summary.removeEventListener("click", handleClick);
  }, [detailsRef]);
}

export default function Sections() {
  const benefitsRef = useRef(null);
  const aboutRef = useRef(null);
  const sessionsRef = useRef(null);
  const sophrologyRef = useRef(null);
  const contactRef = useRef(null);
  const aboutImgRef = useRef(null);
  const aboutWrapRef = useRef(null);
  const cabinetImgRef = useRef(null);
  const cabinetWrapRef = useRef(null);
  const badgeListRef = useRef(null);
  const longCopyRef = useRef(null);

  useSectionReveal(benefitsRef);
  useSectionReveal(aboutRef);
  useSectionReveal(sessionsRef);
  useSectionReveal(sophrologyRef);
  useSectionReveal(contactRef);
  useCardsReveal(benefitsRef, ".benefit-card");
  useCardsReveal(sessionsRef, ".session-card");
  useImageReveal(aboutImgRef, aboutWrapRef);
  useImageReveal(cabinetImgRef, cabinetWrapRef);
  useBadgeReveal(badgeListRef);
  useDetailsCollapse(longCopyRef);

  return (
    <div className="sections-root">
      {/* 1. Le bénéfice d'abord : la visiteuse se reconnaît avant la théorie. */}
      <section
        id="pourquoi-consulter"
        ref={benefitsRef}
        className="content-section"
        aria-labelledby="benefits-title"
      >
        <header className="section-heading">
          <SectionHeading
            id="benefits-title"
            eyebrow="Un accompagnement pour toi"
            title="Et si tu revenais au centre?"
            intro="La sophrologie peut t’aider à ralentir, à mieux comprendre ce que tu
            ressens et à retrouver des ressources concrètes dans ton quotidien."
          />
        </header>

        <div className="benefits-grid">
          {specialties.map((specialty, index) => (
            <article className="benefit-card" key={specialty.title}>
              <span className="benefit-number" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{specialty.title}</h3>
              <p>{specialty.text}</p>
            </article>
          ))}
        </div>

        <div className="section-actions" data-reveal>
          <a className="primary-button" href="#seances">
            Découvrir les séances
          </a>
          <a className="secondary-button" href="#a-propos">
            Faire connaissance
          </a>
        </div>
      </section>

      {/* 2. La confiance : qui accompagne et avec quelle intention ? */}
      <section
        id="a-propos"
        ref={aboutRef}
        className="content-section"
        aria-labelledby="about-title"
      >
        <SectionHeading
          id="about-title"
          eyebrow="À propos"
          title="Derrière Capitaines"
        />

        <div className="about-grid">
          <div className="portrait" ref={aboutWrapRef}>
            <img
              ref={aboutImgRef}
              src="/images/fred.jpg"
              alt="Fred Roche, sophrologue certifiée"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="copy">
            <p data-reveal>
              Je me présente, je suis Fred, et avant de devenir sophrologue
              certifiée, j’ai accompagné les femmes autrement, à travers le
              maquillage et le relooking: le regard porté sur soi, l’image que
              l’on apprivoise et la confiance que l’on reconstruit.
            </p>
            <p data-reveal>
              Et puis surtout, je suis une femme qui a grandi entourée de
              femmes. J'ai vu ma mère donner énormément aux autres, jongler
              entre mille responsabilités, gérer une charge mentale constante au
              point de s'oublier en chemin. Et très tôt, j'ai compris combien
              beaucoup de femmes ont à cœur d'être présentes pour tout le
              monde...sauf pour elles-mêmes.
            </p>
            <p data-reveal>
              Ce qui m'anime, c'est d'accompagner les femmes à se réapproprier
              leur corps, leur place, leurs besoins, leurs envies et leurs
              aspirations...pour (re)devenir les capitaines de leur vie.
            </p>

            <p className="specialite-label">Spécialisée dans</p>
            <ul
              ref={badgeListRef}
              className="tag-list"
              aria-label="Spécialités"
            >
              <li>Charge mentale</li>
              <li>Confiance et estime de soi</li>
              <li>Relation à soi, aux autres, et à l'amour</li>
            </ul>
          </div>
        </div>
        <H2Reveal as="blockquote" className="about-quote">
          Fais de toi la Capitaine de ta vie: une femme en puissance qui
          s’écoute, s’honore et se remet au centre.
        </H2Reveal>
      </section>

      {/* 3. Le concret : format, prix et déroulement avant l'explication. */}
      <section
        id="seances"
        ref={sessionsRef}
        className="content-section"
        aria-labelledby="sessions-title"
      >
        <SectionHeading
          id="sessions-title"
          eyebrow="Les séances"
          title="Un temps pensé pour toi"
          intro="Chaque accompagnement est personnalisé. Tu avances à ton rythme, dans un cadre bienveillant, sans jugement et sans performance à atteindre."
        />

        <div className="session-grid">
          {sessions.map((session, index) => (
            <article className="session-card" key={session.name}>
              <h3>{session.name}</h3>
              <p>{session.description}</p>
              <div className="session-meta">
                <span>{session.duration}</span>
                <span>{session.price}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="first-session">
          <H2Reveal>
            <svg
              className="session-info-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="nonzero"
                d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"
              />
            </svg>
            Comment se passe la première séance?
          </H2Reveal>
          <ParagraphReveal>
            <p className="line-block">
              Il n’y a rien à préparer, rien à réussir et rien à prouver. Cette
              première rencontre permet surtout de comprendre ce que tu vis et
              ce que tu souhaites faire évoluer.
            </p>
            <ol className="steps">
              <li>
                Nous faisons connaissance et tu déposes ce que tu souhaites.
              </li>
              <li>Nous clarifions ensemble ton besoin et ton objectif.</li>
              <li>Je te guide dans une première pratique douce.</li>
              <li>Nous échangeons sur ton vécu et sur la suite possible.</li>
            </ol>
          </ParagraphReveal>
        </div>

        <div className="cabinet-grid">
          <div className="cabinet-photo" ref={cabinetWrapRef}>
            <img
              ref={cabinetImgRef}
              src="/images/cabinet.jpg"
              alt="Le cabinet de sophrologie, chaleureux et apaisant"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="cabinet-copy">
            <H2Reveal>Le cabinet</H2Reveal>
            <ParagraphReveal>
              <p className="line-block">
                J’ai imaginé un espace chaleureux, apaisant et sécurisant, où tu
                peux ralentir et t’exprimer librement. Un lieu où l’on se sent
                accueillie dès les premiers instants, où l’on peut souffler et
                s’autoriser à déposer ce que l’on porte au quotidien. J’avais
                envie de créer un endroit qui ait du sens. Un lieu ressource
                pensé pour que, pour une fois, ce soit de <b>toi</b> dont on
                prend soin.
              </p>
              <p className="line-block">
                Beaucoup de femmes passent leurs journées à répondre aux besoins
                des autres, à tout anticiper, à faire en sorte que tout le monde
                aille bien. Alors j’avais envie de créer un endroit où, pour une
                fois, c’est d’elles dont on prend soin.
              </p>
              <p className="line-block">
                Je suis convaincue que sortir de son environnement habituel,
                s’accorder un temps pour soi et entrer dans un lieu pensé pour
                le calme et l’écoute permet de vivre l’accompagnement
                différemment. Cet espace a été imaginé comme un véritable lieu
                ressource, où tu peux te reconnecter à toi-même, retrouver ton
                souffle et avancer, pas à pas, vers un quotidien plus apaisé.
              </p>
            </ParagraphReveal>
          </div>
        </div>
      </section>

      {/* 4. La méthode : une réponse courte, puis le détail à la demande. */}
      <section
        id="sophrologie"
        ref={sophrologyRef}
        className="content-section"
        aria-labelledby="sophrology-title"
      >
        <SectionHeading
          id="sophrology-title"
          eyebrow="La sophrologie"
          title="Une méthode qui se vit"
          intro="Plus qu’une définition, la sophrologie est une expérience: un espace pour ralentir, écouter ce qui se passe en toi et mobiliser tes propres ressources."
        />

        <div className="sophrology-grid">
          <div className="sophrology-copy">
            <H2Reveal>Des outils simples et concrets</H2Reveal>
            <ParagraphReveal>
              <p className="line-block">
                Les séances associent respiration, mouvements doux, relaxation
                dynamique et visualisation. Elles t’aident à relâcher les
                tensions, à prendre du recul et à mieux accueillir tes émotions.
              </p>
            </ParagraphReveal>
            <ul className="method-list" aria-label="Outils utilisés en séance">
              {methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </div>

          <aside className="sophrology-note" data-reveal>
            <p>
              <strong>À retenir:</strong> la sophrologie ne t’ajoute pas une
              contrainte. Elle te transmet des outils que tu peux
              progressivement intégrer à ton quotidien.
            </p>
            <p>
              Elle intervient en complément, et ne remplace pas un diagnostic,
              un traitement ou un suivi médical ou psychologique.
            </p>
          </aside>
        </div>

        <details className="long-copy" data-reveal ref={longCopyRef}>
          <summary>
            <svg
              className="session-info-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="nonzero"
                d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"
              />
            </svg>
            <span className="span-mobile">En savoir plus sur ma vision</span>
            <span className="span-desktop">
              En savoir plus sur ma vision de la sophrologie
            </span>
            <span className="collapse-icon" aria-hidden="true" />
          </summary>
          <div className="long-copy-content">
            <p>
              Là où tout nous pousse à aller toujours plus vite, la sophrologie
              nous invite à ralentir. Là où nous avons appris à ignorer les
              signaux du corps pour continuer à avancer, elle nous encourage à
              les écouter. Elle redonne aussi une place aux émotions afin de les
              accueillir avec davantage de bienveillance.
            </p>
            <p>
              Au-delà d’un moment de détente, c’est une méthode d’accompagnement
              qui favorise les prises de conscience et le changement. Elle
              permet de mieux se connaître, de poser des limites plus
              respectueuses de ses besoins et de retrouver une manière de vivre
              plus sereine et plus alignée.
            </p>
          </div>
        </details>
      </section>

      {/* 5. Une prochaine action claire. */}
      <section
        id="contact"
        ref={contactRef}
        className="content-section"
        aria-labelledby="contact-title"
      >
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title="Envie d’en parler?"
          intro="Tu peux prendre rendez-vous directement ou m’écrire si tu souhaites d’abord vérifier que cet accompagnement te correspond."
        />

        <div className="contact-panel">
          <div className="contact-list" data-reveal>
            <ContactLink
              label="Mail"
              href="mailto:info@capitaines-sophrologie.fr"
              external
            >
              info@capitaines-sophrologie.fr
            </ContactLink>
            <ContactLink
              label="WhatsApp"
              href="https://wa.me/33632386258"
              external
            >
              06 32 38 62 58
            </ContactLink>
            <ContactLink
              label="Instagram"
              href="https://instagram.com/capitaines.sophrologie"
              external
            >
              @capitaines.sophrologie
            </ContactLink>
          </div>

          <div className="contact-address" data-reveal>
            <ContactLink
              label="Adresse"
              href="https://maps.app.goo.gl/rJoc3ZRSxMKyPiVT7"
              external
            >
              <span className="contact-line">3 Imp. Longchamp</span>
              <br />
              <span className="contact-line">06200 Nice - France</span>
            </ContactLink>
          </div>
        </div>
        <div className="section-actions" data-reveal>
          <div>
            <BookingButton />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        © 2026 Capitaines Sophrologie — Mentions légales
      </footer>
    </div>
  );
}
