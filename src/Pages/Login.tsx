import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const { signInUser, signInWithGoogle, firebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await signInUser(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google login failed";
      setError(message);
    }
  };

  if (!firebaseConfigured) {
    return (
      <section>
        <h2>Login</h2>
        <p>Firebase is not configured. Set VITE_FIREBASE_* variables.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin} style={{ display: "grid", gap: "0.5rem", maxWidth: "320px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign in</button>
      </form>
      <button type="button" onClick={handleGoogleLogin} style={{ marginTop: "0.75rem" }}>
        Sign in with Google
      </button>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </section>
  );
}

export default Login;