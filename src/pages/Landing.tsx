import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

function Landing() {
  return (
    <section>
      <h2>Welcome</h2>
      <p>This is the guest landing page. Authentication is required to access Home, Chat, Calendar, To-Do, and Saved Sites.</p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link to={ROUTES.LOGIN}>Login</Link>
        <Link to={ROUTES.SIGNUP}>Signup</Link>
      </div>
    </section>
  );
}

export default Landing;
