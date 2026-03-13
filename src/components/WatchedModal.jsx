import { FIELDS } from "../constants";
import { FaCheckCircle } from "react-icons/fa";

const WatchedModal = ({ watched = [], onClose }) => {
  return (
    <dialog open className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaCheckCircle />
            <h3 className="font-bold text-lg">Watched</h3>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Close" type="button">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {!watched.length ? (
            <p className="opacity-70">No watched movies yet.</p>
          ) : (
            watched.map((movie) => (
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

                <span className="badge badge-success">WATCHED</span>
              </div>
            ))
          )}
        </div>

        <div className="modal-action mt-6">
          <button className="btn btn-outline" onClick={onClose} type="button">
            Close
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

export default WatchedModal;
