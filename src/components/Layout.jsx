import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useDesk } from "../desk";

const links = [
  { to: "/", label: "Floor", scrollTo: "floor" },
  { to: "/schemes", label: "Schemes" },
  { to: "/book", label: "Book" },
];

export default function Layout() {
  const { player } = useDesk();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      const node = document.getElementById(scrollTo);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.key, location.state]);

  return (
    <>
      <header className="site-nav">
        <div className="wrap nav-inner">
          <Link className="brand" to="/">
            <span className="mark" aria-hidden="true">
              <i /><i /><i /><i className="hot" />
            </span>
            <span className="brand-name">
              <strong>Fun Gaming Zone</strong>
              <em>Katwaria</em>
            </span>
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
          <nav className={open ? "nav-links open" : "nav-links"}>
            {links.map((link) =>
              link.scrollTo ? (
                <Link key={link.label} to={link.to} state={{ scrollTo: link.scrollTo }}>
                  {link.label}
                </Link>
              ) : (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              )
            )}
            <Link className="btn btn-primary btn-small" to={player ? "/pass" : "/register"}>
              {player ? "Your pass" : "Register"}
            </Link>
          </nav>
        </div>
        <div className="brand-bar" aria-hidden="true">
          <i /><i /><i />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="footer-domain">fungamingzonekatwaria.site</p>
            <p>Fun Gaming Zone · Katwaria Sarai, New Delhi</p>
          </div>
          <div>
            <h2>Hours</h2>
            <p>Daily, 11:00 AM to 2:00 AM</p>
            <p>Night Shift stays until 6:00 AM</p>
          </div>
          <div>
            <h2>Desk</h2>
            <p>Register, then pay at the counter.</p>
            <a href="mailto:play@fungamingzonekatwaria.site">play@fungamingzonekatwaria.site</a>
          </div>
        </div>
        <div className="wrap legal">
          <p>Player passes on this site stay in your browser. Bring the player ID to the desk.</p>
        </div>
      </footer>
    </>
  );
}
