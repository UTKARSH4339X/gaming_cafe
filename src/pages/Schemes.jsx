import { Link } from "react-router-dom";
import { useDesk, useTitle } from "../desk";
import { schemeGroups, schemes } from "../data";

export default function Schemes() {
  useTitle("Schemes");
  const { player } = useDesk();

  return (
    <section className="wrap page">
      <header className="page-head">
        <p className="kicker">Rate card · Katwaria Sarai</p>
        <h1>Every scheme, with the rig and the hours attached.</h1>
        <p className="lede">
          Ten ways to sit down. Hourly if you are passing through, a block if you already
          know the length, a wallet if you are here every week. You pay the figure at the desk.
        </p>
      </header>

      <div className="group-jumps">
        {schemeGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => document.getElementById(`group-${group.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth" })}
          >
            {group}
          </button>
        ))}
      </div>

      {schemeGroups.map((group) => (
        <section key={group} className="rate-block" id={`group-${group.toLowerCase()}`}>
          <h2>{group}</h2>
          <div className="rate-wrap">
            <table className="rate">
              <thead>
                <tr>
                  <th>Scheme</th>
                  <th>Fits</th>
                  <th>You pay</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schemes.filter((scheme) => scheme.group === group).map((scheme) => {
                  const next = `/book?scheme=${scheme.id}`;
                  const href = player ? next : `/register?next=${encodeURIComponent(next)}`;
                  return (
                    <tr key={scheme.id} id={scheme.id}>
                      <td>
                        <strong className="scheme-name">
                          {scheme.name}
                          {scheme.popular ? <span className="tag">Usual pick</span> : null}
                        </strong>
                        <span className="scheme-detail">{scheme.detail}</span>
                      </td>
                      <td>{scheme.fits}</td>
                      <td className="num">
                        {scheme.priceLabel}
                        <small>{scheme.unit}</small>
                      </td>
                      <td className="rate-action">
                        <Link to={href}>Hold</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <aside className="fine-print">
        <p>
          Drop-in on Pro is ₹90 an hour. Drop-in on Arena is ₹120 an hour. Squad Row is
          ₹960 for the booth, shown as ₹240 a player. Wallets expire on the day written
          on your pass, unused hours included.
        </p>
      </aside>
    </section>
  );
}
