import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success("Logged in!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <form className="card-body space-y-4" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl">Login</h2>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <div className="card-actions flex-col sm:flex-row sm:justify-between">
            <button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Log In"}
            </button>
            <button className="btn btn-outline w-full sm:w-auto" type="button" onClick={handleGoogle} disabled={loading}>
              Continue with Google
            </button>
            <Link to="/" className="btn btn-ghost w-full sm:w-auto">
              Back Home
            </Link>
          </div>

          <p className="text-sm text-base-content/70">
            Don’t have an account yet?{" "}
            <Link to="/signup" className="link link-primary">
              Go to Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;