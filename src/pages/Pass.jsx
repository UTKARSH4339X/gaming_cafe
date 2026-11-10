import { Link, useNavigate } from "react-router-dom";
import { useDesk, useTitle } from "../desk";
import {
  formatDate,
  formatPhone,
  formatTime,
  inr,
  isUpcoming,
  schemes,
  tierMeta,
} from "../data";

export default function Pass() {
  useTitle("Player pass");
  const { player, bookings, cancelBooking, clearPass } = useDesk();
  const navigate = useNavigate();

  if (!player) {
    return (
      <section className="wrap page gate">
        <p className="kicker">Player desk</p>
        <h1>No pass on this browser yet.</h1>
        <p className="lede">Register to get a player ID. The desk uses that ID when you arrive.</p>
        <Link className="btn btn-primary" to="/register">Register to play</Link>
      </section>
    );
  }

  const wallets = Object.entries(player.wallets || {})
    .map(([id, wallet]) => ({ id, ...wallet, scheme: schemes.find((item) => item.id === id) }))
    .filter((wallet) => wallet.scheme);
  const upcoming = bookings.filter((booking) => isUpcoming(booking));
  const earlier = bookings.filter((booking) => !isUpcoming(booking));
  const memberSince = new Date(player.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function removePass() {
    const ok = window.confirm("Remove this pass from the browser? Holds saved here will go with it.");
    if (!ok) return;
    clearPass();
    navigate("/");
  }

  return (
    <section className="wrap page">
      <header className="page-head slim">
        <p className="kicker">Player pass</p>
        <h1>{player.name.split(" ")[0]}, your seat starts from this card.</h1>
      </header>

      <div className="pass-layout">
        <article className="pass-card">
          <div className="pass-top">
            <span className="mark" aria-hidden="true"><i /><i /><i /><i className="hot" /></span>
            <p>Fun Gaming Zone<br />Katwaria Sarai</p>
          </div>
          <h2>{player.name}</h2>
          <p className="pass-tag">@{player.tag}</p>
          <p className="pass-id">{player.id}</p>
          <dl className="pass-meta">
            <div>
              <dt>Mobile</dt>
              <dd>{formatPhone(player.phone)}</dd>
            </div>
            <div>
              <dt>Usual game</dt>
              <dd>{player.game}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{memberSince}</dd>
            </div>
            {player.college ? (
              <div>
                <dt>College</dt>
                <dd>{player.college}</dd>
              </div>
            ) : null}
          </dl>
          <p className="pass-domain">fungamingzonekatwaria.site</p>
          <div className="brand-bar card-bar" aria-hidden="true"><i /><i /><i /></div>
        </article>

        <div className="pass-side">
          <section className="panel">
            <div className="panel-head">
              <h2>Hour wallets</h2>
              <Link to="/book?scheme=ledger">Add one</Link>
            </div>
            {wallets.length === 0 ? (
              <p className="empty">
                None yet. Month Ledger, Arena Ledger, and Bootcamp load hours when you hold a seat on them.
              </p>
            ) : (
              <ul className="wallets">
                {wallets.map((wallet) => (
                  <li key={wallet.id}>
                    <div>
                      <strong>{wallet.scheme.name}</strong>
                      <span>Until {formatDate(wallet.expires)}</span>
                    </div>
                    <p>{wallet.remaining}h of {wallet.total}h left</p>
                    <div className="meter" aria-hidden="true">
                      <span style={{ width: `${Math.max(0, (wallet.remaining / wallet.total) * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Holds</h2>
              <Link to="/book">New hold</Link>
            </div>
            {bookings.length === 0 ? (
              <p className="empty">No seat held. The floor is still on the rate card.</p>
            ) : (
              <ul className="holds">
                {[...upcoming, ...earlier].map((booking) => {
                  const live = isUpcoming(booking);
                  return (
                    <li key={booking.id}>
                      <div>
                        <strong>{booking.stationId}</strong>
                        <span>{tierMeta[booking.tier]?.name}</span>
                      </div>
                      <p>
                        {booking.schemeName}
                        <small>
                          {formatDate(booking.date)} · {formatTime(booking.start)} · {booking.hoursText}
                        </small>
                      </p>
                      <p className="hold-due">{booking.due ? inr(booking.due) : "On wallet"}</p>
                      {live ? (
                        <button type="button" onClick={() => cancelBooking(booking.id)}>
                          Release
                        </button>
                      ) : (
                        <span className="done">Finished</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="pass-actions no-print">
            <Link className="btn btn-ghost" to="/register">Edit details</Link>
            <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
              Print pass
            </button>
            <button type="button" className="text-button" onClick={removePass}>
              Remove pass from this browser
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
