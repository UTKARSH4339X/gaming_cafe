import { Link } from "react-router-dom";
import Floor from "../components/Floor";
import { useDesk, useNow, useTitle } from "../desk";
import {
  faqs,
  floorStatus,
  games,
  sampleHeld,
  schemes,
  stations,
  tierMeta,
} from "../data";

const steps = [
  {
    n: "01",
    title: "Register",
    copy: "Name, phone, and a player tag. The desk gives you an ID like FGZ-K4821.",
  },
  {
    n: "02",
    title: "Pick a scheme",
    copy: "An hour, an afternoon block, the night flat, the booth, or a wallet of hours.",
  },
  {
    n: "03",
    title: "Hold the seat",
    copy: "Choose the day, the start, and the station. Pay that amount when you reach the counter.",
  },
];

const rules = [
  "No seat without a player pass.",
  "Campus Hours needs a college ID at the desk.",
  "A hold lasts 15 minutes past the start time.",
  "Outside food is fine. Outside PCs are not.",
];

export default function Home() {
  useTitle("");
  const { player } = useDesk();
  const status = floorStatus(useNow());
  const seatCount = stations.filter((station) => station.tier !== "squad").length;
  const openCount = seatCount - sampleHeld.length;

  return (
    <>
      <section className="wrap hero">
        <div className="hero-copy">
          <p className="kicker">
            <i className={status.open ? "dot" : "dot off"} />
            {status.label} · Katwaria Sarai
          </p>
          <h1>
            Register once.
            <span> Take the seat.</span>
          </h1>
          <p className="lede">
            Fun Gaming Zone keeps every rig, couch, and the squad booth on a rate card.
            Make a player pass, pick one of ten schemes, and the desk holds your station
            before you walk in.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={player ? "/book" : "/register"}>
              {player ? "Hold a seat" : "Create player pass"}
            </Link>
            <Link className="btn btn-ghost" to="/schemes">
              See all schemes
            </Link>
          </div>
          <dl className="metrics">
            <div>
              <dt>Stations</dt>
              <dd>{seatCount}</dd>
            </div>
            <div>
              <dt>Schemes</dt>
              <dd>{schemes.length}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>11–2</dd>
            </div>
          </dl>
        </div>
        <Floor
          held={sampleHeld}
          caption={`Sample Saturday · ${openCount} of ${seatCount} open`}
        />
      </section>

      <section className="strip" aria-label="Games on the floor">
        <div className="wrap strip-track">
          {games.filter((game) => game !== "Other").map((game) => (
            <span key={game}>{game}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">How a visit works</p>
            <h2>The floor is booked, not argued over.</h2>
          </div>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section band" id="schemes">
        <div className="wrap">
          <div className="section-head row">
            <div>
              <p className="kicker">Rate card</p>
              <h2>All ten schemes.</h2>
            </div>
            <Link className="btn btn-ghost" to="/schemes">Open the full card</Link>
          </div>
          <div className="scheme-grid">
            {schemes.map((scheme) => (
              <article key={scheme.id} className={scheme.popular ? "scheme-card popular" : "scheme-card"}>
                <header>
                  <p>{scheme.group}</p>
                  {scheme.popular ? <span className="tag">Usual pick</span> : null}
                </header>
                <h3>{scheme.name}</h3>
                <p className="price">
                  <strong>{scheme.priceLabel}</strong>
                  <span>{scheme.unit}</span>
                </p>
                <p>{scheme.summary}</p>
                <Link to={`/book?scheme=${scheme.id}`}>Hold on this scheme</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Stations</p>
            <h2>Three PC rows, two couches, one booth.</h2>
          </div>
          <div className="rig-grid">
            {["standard", "pro", "arena", "couch"].map((tier) => {
              const meta = tierMeta[tier];
              return (
                <article key={tier} className="rig">
                  <p className="kicker">{meta.seats}</p>
                  <h3>{meta.name}</h3>
                  <p className="rig-screen">{meta.screen}</p>
                  <p>{meta.note}</p>
                  <p className="rig-rate">
                    {tier === "couch" ? "₹120/hr" : `₹${meta.dropIn}/hr on Drop-in`}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="booth-note">
            Squad booth sits apart from the rows: four Pro desks, three hours, ₹240 a player (₹960 for the hold).
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="wrap rules">
          <div>
            <p className="kicker">House rules</p>
            <h2>Short list. The desk keeps it.</h2>
          </div>
          <ul>
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band">
        <div className="wrap faq-layout">
          <div>
            <p className="kicker">Desk notes</p>
            <h2>Before you come down.</h2>
          </div>
          <div className="faq">
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap closing">
          <p className="kicker">fungamingzonekatwaria.site</p>
          <h2>Make the pass. The seat can wait for you, not the other way around.</h2>
          <Link className="btn btn-primary" to={player ? "/pass" : "/register"}>
            {player ? "Open your pass" : "Register to play"}
          </Link>
        </div>
      </section>
    </>
  );
}
