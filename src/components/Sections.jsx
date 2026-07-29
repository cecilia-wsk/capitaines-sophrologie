import { PopupButton } from "react-calendly";

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

function Section({ index, title, children }) {
  return (
    <section
      style={{ maxWidth: "980px", margin: "0 auto", padding: "15vh 24px" }}
    >
      <span style={label}>{index}</span>
      <h2 style={heading}>{title}</h2>
      {children}
    </section>
  );
}

export default function Sections() {
  return (
    <>
      <Section index="01" title="À propos">
        <p style={body}>
          Je me présente, je suis Fred et avant de devenir sophrologue
          certifiée, j'ai accompagné les femmes autrement. À travers le
          maquillage et le relooking, le regard porté sur soi, l'image que l'on
          apprivoise… Également à travers l'univers de la lingerie.
        </p>
        <p style={{ ...body, marginTop: "20px" }}>
          Et puis surtout, je suis une femme qui a grandi entourée de femmes.
          J'ai vu ma mère donner énormément aux autres, jongler entre mille
          responsabilités, gérer une charge mentale constante au point de
          s'oublier en chemin. Et très tôt, j'ai compris combien beaucoup de
          femmes ont à cœur d'être présentes pour tout le monde… sauf pour
          elles-mêmes.
        </p>
        <p style={{ ...body, marginTop: "20px" }}>
          Ce qui m'anime, c'est d'accompagner les femmes à se réapproprier leur
          corps, leur place, leurs besoins, leurs envies et leurs aspirations…
          pour (re)devenir les capitaines de leur vie.
        </p>
        <div
          style={{
            width: "48px",
            height: "1px",
            background: NAVY,
            opacity: 0.35,
            margin: "52px 0 36px",
          }}
        />
        <p
          style={{
            fontFamily: "'King and Queen', serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 3.4vw, 40px)",
            lineHeight: 1.35,
            color: NAVY,
            maxWidth: "720px",
          }}
        >
          « Fais de toi la Capitaine de ta vie, une femme en puissance qui
          s'écoute, qui s'honore, qui se remet au centre. »
        </p>
      </Section>

      <Section index="02" title="Les séances">
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
          {
            name: "Atelier collectif",
            desc: "En petit groupe, autour de thématiques mensuelles : charge mentale, estime de soi, relations.",
            meta: "1h15 — 25 €",
          },
        ].map((s, i) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "24px",
              flexWrap: "wrap",
              padding: "30px 0",
              borderTop: `1px solid ${NAVY}22`,
              borderBottom: i === 2 ? `1px solid ${NAVY}22` : "none",
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

      <Section index="03" title="Contact">
        <p style={{ ...body, marginBottom: "14px" }}>
          <a
            href="mailto:info@capitaines-sophrologie.fr"
            style={{ color: NAVY }}
          >
            info@capitaines-sophrologie.fr
          </a>
          <br />
          06 32 38 62 58
          <br />
          <a
            href="https://instagram.com/capitaines.sophrologie"
            target="_blank"
            rel="noreferrer"
            style={{ color: NAVY }}
          >
            @capitaines.sophrologie
          </a>
        </p>
        <PopupButton
          className="booking-button"
          url="https://calendly.com/capitaines-sophrologie/nouvelle-reunion"
          rootElement={document.getElementById("root")}
          text="Prendre rendez-vous"
        />
      </Section>

      <footer
        style={{
          ...label,
          textAlign: "center",
          padding: "60px 24px",
          opacity: 0.45,
        }}
      >
        © 2026 Capitaines Sophrologie — Mentions légales
      </footer>
    </>
  );
}
