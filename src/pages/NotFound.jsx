import { Link } from "react-router-dom";
import { useTitle } from "../desk";

export default function NotFound() {
  useTitle("Not found");
  return (
    <section className="wrap page gate">
      <p className="kicker">404</p>
      <h1>That page is not on the floor.</h1>
      <p className="lede">The rate card, the register, and the seat map are still open.</p>
      <Link className="btn btn-primary" to="/">Back to Fun Gaming Zone</Link>
    </section>
  );
}
