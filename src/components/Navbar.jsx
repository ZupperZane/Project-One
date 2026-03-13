import icon from "../assets/icon.png";
import { FaHeart, FaCheckCircle } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const Navbar = ({
  wishlistCount = 0,
  watchedCount = 0,
  onOpenWishlist,
  onOpenWatched,
}) => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showMovieActions =
    typeof onOpenWishlist === "function" || typeof onOpenWatched === "function";

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Logout failed.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-base-100/90 backdrop-blur supports-[backdrop-filter]:bg-base-100/70 py-2">
        <div className="rounded-2xl bg-base-100 shadow-sm border border-base-200">
          <div className="navbar px-4 sm:px-6 flex-wrap gap-3">
            <div className="flex-1 min-w-[220px]">
              <div className="flex items-center gap-3">
                <img src={icon} alt="MovieMango icon" className="w-9 h-9 rounded-xl" />
                <div className="leading-tight">
                  <div className="text-xl font-bold">MovieMango</div>
                  <div className="text-xs opacity-70">Browse • Filter • Wishlist • Watched</div>
                </div>
                <span className={`badge ${user ? "badge-success" : "badge-warning"}`}>
                  {user ? "Authenticated" : "Guest"}
                </span>
              </div>
            </div>

            <nav className="flex-none flex items-center gap-2 flex-wrap justify-end">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => navigate(-1)}
                disabled={location.pathname === "/"}
              >
                Back
              </button>
              <NavLink to="/" className="btn btn-sm btn-ghost">
                Home
              </NavLink>
              {user ? (
                <>
                  <NavLink to="/dashboard" className="btn btn-sm btn-outline">
                    Dashboard
                  </NavLink>
                  <button type="button" className="btn btn-sm btn-error" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-sm btn-outline">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="btn btn-sm btn-primary">
                    Sign Up
                  </NavLink>
                </>
              )}

              {showMovieActions && (
                <>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={onOpenWatched}
                    type="button"
                    disabled={typeof onOpenWatched !== "function"}
                  >
                    <FaCheckCircle />
                    Watched
                    <span className="badge badge-neutral ml-2">{watchedCount}</span>
                  </button>

                  <button
                    className="btn btn-sm btn-outline"
                    onClick={onOpenWishlist}
                    type="button"
                    disabled={typeof onOpenWishlist !== "function"}
                  >
                    <FaHeart />
                    Wishlist
                    <span className="badge badge-neutral ml-2">{wishlistCount}</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="h-px bg-base-200" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
