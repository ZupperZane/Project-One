import { FIELDS } from "../constants";
import { FaHeart, FaRegHeart, FaCheck, FaTrash } from "react-icons/fa";
import LikeDislike from "./LikeDislike";

const MovieCard = ({ movie, actions }) => {
  const title = movie[FIELDS.TITLE];
  const year = movie[FIELDS.YEAR];
  const genre = movie[FIELDS.GENRE];
  const age = movie[FIELDS.AGE_GROUP];
  const rating = movie[FIELDS.RATING];
  const desc = movie[FIELDS.DESCRIPTION];

  const inWishlist = actions?.isInWishlist?.(movie);
  const watched = actions?.isWatched?.(movie);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="card-title">{title}</h2>
            <p className="text-sm opacity-70">{year}</p>
          </div>

          {typeof rating === "number" && (
            <div className="badge badge-neutral gap-1">
              <span aria-hidden="true">★</span>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {genre && <span className="badge badge-primary">{String(genre).toUpperCase()}</span>}
          {age && <span className="badge badge-outline">{age}</span>}
          {watched && <span className="badge badge-success">WATCHED</span>}
        </div>

        {desc && <p className="text-sm leading-relaxed">{desc}</p>}

        <div className="mt-3">
          <LikeDislike title={title} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {!inWishlist ? (
            <button className="btn btn-sm btn-primary" onClick={() => actions?.addToWishlist?.(movie)}>
              <FaRegHeart />
              Wishlist
            </button>
          ) : (
            <button className="btn btn-sm btn-outline btn-error" onClick={() => actions?.removeFromWishlist?.(movie)}>
              <FaTrash />
              Remove
            </button>
          )}

          <button
            className="btn btn-sm btn-outline"
            onClick={() => actions?.addToWatched?.(movie)}
            disabled={watched}
            title={watched ? "Already watched" : ""}
          >
            <FaCheck />
            Mark watched
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
