import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="hero min-h-[70vh] rounded-box bg-base-200 shadow-lg">
      <div className="hero-content text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-bold">Welcome to MovieMango</h1>
          <p className="text-lg text-base-content/80">
            Discover movies, build your wishlist, and track what you've watched.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="btn btn-primary">
              Enter Dashboard
            </Link>
            <Link to="/login" className="btn btn-outline">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;