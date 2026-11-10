import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Field from "../components/Field";
import { useDesk, useTitle } from "../desk";
import { games } from "../data";

const empty = { name: "", phone: "", email: "", tag: "", game: "Valorant", college: "" };

function safeNext(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/book";
  return value;
}

export default function Register() {
  const { player, savePlayer } = useDesk();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  useTitle(player ? "Edit pass" : "Register");

  const [form, setForm] = useState(() =>
    player
      ? {
          name: player.name,
          phone: player.phone,
          email: player.email,
          tag: player.tag,
          game: player.game,
          college: player.college || "",
        }
      : empty
  );
  const [errors, setErrors] = useState({});

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter the name the desk should call.";
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      nextErrors.phone = "Use a 10-digit Indian mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter an email that can take a booking note.";
    }
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(form.tag.trim())) {
      nextErrors.tag = "3 to 16 letters, numbers, or underscores.";
    }
    return nextErrors;
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    savePlayer({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      tag: form.tag.trim(),
      game: form.game,
      college: form.college.trim(),
    });
    navigate(player ? "/pass" : next);
  }

  return (
    <section className="wrap page register-layout">
      <header className="page-head">
        <p className="kicker">{player ? "Edit pass" : "Player desk"}</p>
        <h1>{player ? "Update the pass the desk already knows." : "Register once. Then you can play."}</h1>
        <p className="lede">
          The pass stays in this browser. Bring the player ID to Katwaria Sarai and the
          counter matches it to your seat. Payment happens there, not on this page.
        </p>
        <ul className="check-list">
          <li>One ID for every scheme.</li>
          <li>Campus Hours still needs a college ID in person.</li>
          <li>Hour wallets sit on the pass after you book them.</li>
        </ul>
      </header>

      <form className="form-card" onSubmit={submit} noValidate>
        <Field label="Full name" error={errors.name}>
          <input
            value={form.name}
            autoComplete="name"
            onChange={(event) => set("name", event.target.value)}
          />
        </Field>
        <div className="two">
          <Field label="Mobile" error={errors.phone} hint="10 digits, no +91.">
            <input
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => set("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
            />
          </Field>
        </div>
        <div className="two">
          <Field label="Player tag" error={errors.tag} hint="This is what the booth hears.">
            <input
              value={form.tag}
              autoComplete="off"
              onChange={(event) => set("tag", event.target.value)}
            />
          </Field>
          <Field label="Usual game">
            <select value={form.game} onChange={(event) => set("game", event.target.value)}>
              {games.map((game) => (
                <option key={game}>{game}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="College, if you have one" hint="Only used when you book Campus Hours.">
          <input
            value={form.college}
            onChange={(event) => set("college", event.target.value)}
          />
        </Field>
        <button className="btn btn-primary btn-block" type="submit">
          {player ? "Save pass" : "Create player pass"}
        </button>
        {player ? (
          <p className="form-note">
            Already booked? <Link to="/pass">Back to the pass</Link>
          </p>
        ) : (
          <p className="form-note">
            Already registered on this browser? <Link to="/pass">Open your pass</Link>
          </p>
        )}
      </form>
    </section>
  );
}
