import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <section className="space-y-8">
      <div className="hero rounded-3xl bg-gradient-to-br from-orange-100 via-amber-50 to-lime-100 border border-amber-200">
        <div className="hero-content text-center py-16">
          <div className="max-w-2xl space-y-5">
            <p className="badge badge-outline badge-lg">
              {user ? "Welcome back, member" : "Guest preview mode"}
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Plan Your Next Movie Night Like a Pro
            </h1>
            <p className="text-base md:text-lg opacity-80">
              Build a wishlist, track watched films, and keep your picks organized in one clean
              dashboard.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary">
                    Create Account
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <article className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Smart Filtering</h2>
            <p>Filter by genre, year, and audience age group in seconds.</p>
          </div>
        </article>

        <article className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Wishlist + Watched</h2>
            <p>Move titles from wishlist to watched as your movie nights happen.</p>
          </div>
        </article>

        <article className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Export Ready</h2>
            <p>Download your wishlist as a PDF and share it with your crew.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Home;
