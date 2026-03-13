import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await createUser(email, password);
      toast.success("Account created!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <form className="card-body space-y-4" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl">Sign Up</h2>

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
              placeholder="Create a password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Confirm Password</span>
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              className="input input-bordered w-full"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>

          <div className="card-actions flex-col sm:flex-row sm:justify-between">
            <button className="btn btn-secondary w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
            </button>
            <Link to="/" className="btn btn-ghost w-full sm:w-auto">
              Back Home
            </Link>
          </div>

          <p className="text-sm text-base-content/70">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Go to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;