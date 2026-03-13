import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const usernameRule = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const SignUp = () => {
  const { createUser, signInWithGoogle, updateUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!usernameRule.test(username)) {
      toast.warn("Username must be 3-20 chars using letters, numbers, or underscore.");
      return false;
    }

    if (!passwordRule.test(password)) {
      toast.warn("Password must be 8+ chars with uppercase, lowercase, and a number.");
      return false;
    }

    return true;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await createUser(email.trim(), password);
      await updateUserProfile({ displayName: username.trim() });
      toast.success("Account created.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Signup failed.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed up with Google.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Google signup failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg space-y-5">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm opacity-70">
            Sign up with username/password or continue with Google.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSignUp}>
          <label className="form-control w-full">
            <span className="label-text mb-1">Username</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="movie_lover"
              autoComplete="nickname"
              required
            />
          </label>

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
              placeholder="At least 8 chars, upper/lower/number"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            Sign Up with Username + Password
          </button>
        </form>

        <button
          className="btn btn-outline w-full"
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          Sign Up with Google
        </button>

        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm flex-1" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <Link className="btn btn-ghost btn-sm flex-1" to="/login">
            Already have account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
