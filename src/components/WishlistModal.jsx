import { FIELDS } from "../constants";
import { FaTrash, FaDownload } from "react-icons/fa";

const WishlistModal = ({ wishlist = [], onRemove, onDownload, onClose }) => {
  return (
    <dialog open className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-bold text-lg">Wishlist</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {!wishlist.length ? (
            <p className="opacity-70">Your wishlist is empty.</p>
          ) : (
            wishlist.map((movie) => (
              <div
                key={`${movie?.[FIELDS.TITLE]}-${movie?.[FIELDS.YEAR]}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-base-200"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{movie?.[FIELDS.TITLE]}</p>
                  <p className="text-sm opacity-70">
                    {movie?.[FIELDS.YEAR]}
                    {movie?.[FIELDS.GENRE] ? ` • ${String(movie[FIELDS.GENRE]).toUpperCase()}` : ""}
                  </p>
                </div>

                <button
                  className="btn btn-sm btn-outline btn-error shrink-0"
                  onClick={() => onRemove(movie)}
                  type="button"
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="modal-action mt-6 flex items-center justify-between">
          <button className="btn btn-outline" onClick={onClose} type="button">
            Close
          </button>

          <button
            className="btn btn-primary"
            onClick={onDownload}
            disabled={!wishlist.length}
            type="button"
          >
            <FaDownload />
            Download PDF
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} type="button">
          close
        </button>
      </form>
    </dialog>
  );
};

export default WishlistModal;
