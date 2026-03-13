import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signInUser, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warn("Email and password are required.");
      return;
    }

    try {
      await signInUser(email, password);
      toast.success("Signed in successfully.");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Authentication failed.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google.");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm opacity-70">
            Access your movie dashboard with your account.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <span className="label-text mb-1">Email</span>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            Sign In
          </button>
        </form>

        <button
          className="btn btn-outline w-full"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Continue with Google
        </button>

        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm flex-1" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <Link className="btn btn-ghost btn-sm flex-1" to="/signup">
            Need an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
