import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

function ResetPassword() {
  const { resetUserPassword, firebaseConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      setSubmitting(true);
      await resetUserPassword(email);
      setNotice("A password reset email has been sent. Please check your inbox.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send reset email.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <section className="mx-auto max-w-2xl rounded-xl bg-base-200 p-6">
        <h2 className="text-3xl font-bold">Reset Password</h2>
        <p className="mt-2 text-lg">Firebase is not configured. Set VITE_FIREBASE_* variables.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4 rounded-xl bg-base-200 p-6">
      <h2 className="text-3xl font-bold">Reset Password</h2>
      <p className="text-lg">
        Enter your email address. We will send instructions to create a new password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-base-100 p-4">
        <label htmlFor="reset-email" className="block text-lg font-semibold">
          Email address
        </label>
        <input
          id="reset-email"
          type="email"
          className="input input-bordered w-full text-lg"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />

        <button type="submit" className="btn btn-primary w-full text-lg" disabled={submitting}>
          {submitting ? "Sending..." : "Send Reset Email"}
        </button>
      </form>

      {notice ? <p className="text-success text-lg font-semibold">{notice}</p> : null}
      {error ? <p className="text-error text-lg font-semibold">{error}</p> : null}

      <p className="text-base">
        Back to <Link className="underline font-semibold" to={ROUTES.LOGIN}>Log In</Link>
      </p>
    </section>
  );
}

export default ResetPassword;
