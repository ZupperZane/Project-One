import { useState } from "react";
import { toast } from "react-toastify";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

const LikeDislike = ({ title = "movie" }) => {
  const [state, setState] = useState(null);

  const like = () => {
    setState("like");
    toast.success(`Liked: ${title}`);
  };

  const dislike = () => {
    setState("dislike");
    toast.info(`Disliked: ${title}`);
  };

  return (
    <div className="flex gap-2">
      <button
        className={`btn btn-sm ${state === "like" ? "btn-success" : "btn-outline"}`}
        onClick={like}
        type="button"
      >
        <FiThumbsUp />
        Like
      </button>

      <button
        className={`btn btn-sm ${state === "dislike" ? "btn-error" : "btn-outline"}`}
        onClick={dislike}
        type="button"
      >
        <FiThumbsDown />
        Dislike
      </button>
    </div>
  );
};

export default LikeDislike;
