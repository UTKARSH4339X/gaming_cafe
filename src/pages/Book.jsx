import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Floor from "../components/Floor";
import { useDesk, useTitle } from "../desk";
import {
  addDays,
  dayAllowed,
  dueNow,
  fitsWindow,
  formatDate,
  formatTime,
  heldByDate,
  hoursLabel,
  inr,
  isPastSlot,
  rangesOverlap,
  schemes,
  sessionHours,
  sessionMinutes,
  startOptions,
  stations,
  todayISO,
} from "../data";

function makeBookingId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "BK-";
  for (let i = 0; i < 4; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export default function Book() {
  useTitle("Book a seat");
  const { player, bookings, holdSeat } = useDesk();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const requested = params.get("scheme");
  const initial = schemes.some((scheme) => scheme.id === requested) ? requested : "drop-in";

  const [schemeId, setSchemeId] = useState(initial);
  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState(1);
  const [tier, setTier] = useState("standard");
  const [start, setStart] = useState("");
  const [stationId, setStationId] = useState("");
  const [error, setError] = useState("");

  const scheme = schemes.find((item) => item.id === schemeId) || schemes[0];
  const activeTier = scheme.tiers.includes(tier) ? tier : scheme.tiers[0];

  useEffect(() => {
    if (requested && schemes.some((item) => item.id === requested)) {
      setSchemeId(requested);
    }
  }, [requested]);

  useEffect(() => {
    setHours(scheme.fixedHours || scheme.minHours || 1);
    setTier(scheme.tiers[0]);
    setStationId("");
    setError("");
  }, [schemeId]);

  const chosenHours = sessionHours(scheme, hours);
  const wallet = player?.wallets?.[scheme.id];
  const walletActive = Boolean(wallet && wallet.remaining > 0 && wallet.expires >= date);
  const expiry = scheme.wallet
    ? walletActive
      ? wallet.expires
      : addDays(todayISO(), scheme.validDays)
    : "";

  const availableStarts = useMemo(() => {
    if (!dayAllowed(scheme, date)) return [];
    return startOptions(scheme).filter((slot) => {
      if (isPastSlot(date, slot)) return false;
      return fitsWindow(scheme, slot, chosenHours);
    });
  }, [scheme, date, chosenHours]);

  useEffect(() => {
    if (!availableStarts.includes(start)) setStart(availableStarts[0] || "");
  }, [availableStarts, start]);

  const held = useMemo(() => {
    const set = heldByDate(date);
    if (!start) return [...set];
    const minutes = sessionMinutes(scheme, start, chosenHours);
    bookings.forEach((booking) => {
      if (booking.date !== date) return;
      if (rangesOverlap(start, minutes, booking.start, booking.minutes)) {
        set.add(booking.stationId);
      }
    });
    return [...set];
  }, [date, start, scheme, chosenHours, bookings]);

  useEffect(() => {
    if (stationId && held.includes(stationId)) setStationId("");
  }, [held, stationId]);

  const due = dueNow(scheme, activeTier, chosenHours, walletActive);
  const spent = scheme.wallet ? chosenHours : 0;
  const remainingAfter = scheme.wallet
    ? (walletActive ? wallet.remaining : scheme.walletHours) - spent
    : null;

  const station = stations.find((item) => item.id === stationId);
  const safeStation = station && scheme.tiers.includes(station.tier) && !held.includes(stationId)
    ? stationId
    : "";

  let blockReason = "";
  if (!date) {
    blockReason = "Choose a date.";
  } else if (!dayAllowed(scheme, date)) {
    blockReason = scheme.days === "weekend"
      ? "Weekend Lock is Saturday and Sunday only."
      : "Bootcamp is Monday to Friday.";
  } else if (scheme.wallet && date > expiry) {
    blockReason = `That date is past this wallet. It would run out on ${formatDate(expiry)}.`;
  } else if (scheme.wallet && walletActive && wallet.remaining < chosenHours) {
    blockReason = `This wallet has ${wallet.remaining} hour${wallet.remaining === 1 ? "" : "s"} left.`;
  } else if (!availableStarts.length) {
    blockReason = "No start time left on this date for that length.";
  } else if (!safeStation) {
    blockReason = "Choose an open station on the floor.";
  }

  const hourChoices = scheme.fixedHours || scheme.flatUntil
    ? []
    : Array.from(
        { length: (scheme.maxHours || 1) - (scheme.minHours || 1) + 1 },
        (_, index) => (scheme.minHours || 1) + index
      ).filter((value) => !walletActive || value <= wallet.remaining);

  function chooseTier(nextTier) {
    setTier(nextTier);
    const station = stations.find((item) => item.id === stationId);
    if (station && station.tier !== nextTier) setStationId("");
  }

  function pickStation(id) {
    const station = stations.find((item) => item.id === id);
    if (!station || !scheme.tiers.includes(station.tier) || held.includes(id)) return;
    setTier(station.tier);
    setStationId(id);
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    if (blockReason) {
      setError(blockReason);
      return;
    }
    const minutes = sessionMinutes(scheme, start, chosenHours);
    holdSeat({
      id: makeBookingId(),
      schemeId: scheme.id,
      schemeName: scheme.name,
      date,
      start,
      minutes,
      hoursText: hoursLabel(scheme, chosenHours),
      hoursSpent: spent,
      walletExpires: expiry,
      stationId: safeStation,
      tier: station.tier,
      due,
      createdAt: new Date().toISOString(),
    });
    navigate("/pass");
  }

  if (!player) {
    const next = `/book?scheme=${schemeId}`;
    return (
      <section className="wrap page gate">
        <p className="kicker">Player desk</p>
        <h1>Register before the floor will hold a seat.</h1>
        <p className="lede">
          Fun Gaming Zone does not keep anonymous stations. Make a pass, then come back
          to {scheme.name}.
        </p>
        <Link className="btn btn-primary" to={`/register?next=${encodeURIComponent(next)}`}>
          Create player pass
        </Link>
      </section>
    );
  }

  return (
    <section className="wrap page">
      <header className="page-head slim">
        <p className="kicker">Hold a seat · {player.id}</p>
        <h1>Pick the scheme, then the station.</h1>
      </header>

      <form className="book-layout" onSubmit={submit}>
        <div className="book-main">
          <fieldset>
            <legend>Scheme</legend>
            <div className="scheme-picks">
              {schemes.map((item) => (
                <label key={item.id} className={item.id === schemeId ? "pick on" : "pick"}>
                  <input
                    type="radio"
                    name="scheme"
                    checked={item.id === schemeId}
                    onChange={() => setSchemeId(item.id)}
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.priceLabel} · {item.unit}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="two">
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                min={todayISO()}
                max={addDays(todayISO(), 21)}
                onChange={(event) => setDate(event.target.value)}
              />
              <small>12:00 AM and 1:00 AM belong to the night of this date.</small>
            </label>
            {hourChoices.length > 0 ? (
              <div className="field">
                <span>Hours</span>
                <div className="chips">
                  {hourChoices.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={chosenHours === value ? "chip on" : "chip"}
                      onClick={() => setHours(value)}
                    >
                      {value}h
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="field">
                <span>Length</span>
                <p className="locked-length">{hoursLabel(scheme, chosenHours)}</p>
              </div>
            )}
          </div>

          {scheme.tiers.length > 1 ? (
            <div className="field">
              <span>Row</span>
              <div className="chips">
                {scheme.tiers.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={activeTier === item ? "chip on" : "chip"}
                    onClick={() => chooseTier(item)}
                  >
                    {item === "standard" ? "Standard" : item === "pro" ? "Pro" : item === "arena" ? "Arena" : item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="field">
            <span>Start</span>
            {availableStarts.length ? (
              <div className="chips">
                {availableStarts.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={start === slot ? "chip on" : "chip"}
                    onClick={() => setStart(slot)}
                  >
                    {formatTime(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="err static">{blockReason}</p>
            )}
          </div>

          <Floor
            held={held}
            selected={safeStation}
            tiers={scheme.tiers}
            onPick={pickStation}
            caption={safeStation ? `Selected ${safeStation}` : "Open seats can be held"}
          />
        </div>

        <aside className="summary">
          <p className="kicker light">Due at the desk</p>
          <p className="due"><strong>{inr(due)}</strong></p>
          <p className="summary-scheme">{scheme.name}</p>
          <dl>
            <div>
              <dt>When</dt>
              <dd>{start ? `${formatDate(date)} · ${formatTime(start)}` : "Pick a start"}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{hoursLabel(scheme, chosenHours)}</dd>
            </div>
            <div>
              <dt>Station</dt>
              <dd>{safeStation || "Not chosen"}</dd>
            </div>
            {scheme.wallet ? (
              <div>
                <dt>Wallet</dt>
                <dd>
                  {walletActive ? "Already on your pass" : `Activates for ${inr(scheme.price)}`}
                  {remainingAfter !== null ? ` · ${remainingAfter}h left after` : ""}
                </dd>
              </div>
            ) : null}
            {scheme.id === "squad" ? (
              <div>
                <dt>Players</dt>
                <dd>4 in the booth · ₹240 each</dd>
              </div>
            ) : null}
          </dl>
          {error || blockReason ? <p className="summary-note">{error || blockReason}</p> : (
            <p className="summary-note">The counter takes this amount. The seat is held for 15 minutes.</p>
          )}
          <button className="btn btn-primary btn-block" type="submit" disabled={Boolean(blockReason)}>
            Hold this seat
          </button>
        </aside>
      </form>
    </section>
  );
}
