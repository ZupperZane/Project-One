import { useMemo, useState } from "react";
import { downloadWishlist } from "./downloadWishlist";
import { FIELDS } from "./constants";
import { toast } from "react-toastify";

const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [watched, setWatched] = useState([]);

  const getKey = (movie) => String(movie?.[FIELDS.TITLE] ?? "").trim();

  const wishlistKeys = useMemo(
    () => new Set(wishlist.map(getKey).filter(Boolean)),
    [wishlist]
  );
  const watchedKeys = useMemo(
    () => new Set(watched.map(getKey).filter(Boolean)),
    [watched]
  );

  const addToWishlist = (movie) => {
    const key = getKey(movie);
    if (!key) return;

    if (wishlistKeys.has(key)) {
      toast.info(`Already in wishlist: ${key}`);
      return;
    }

    setWishlist((prev) => [...prev, movie]);
    toast.success(`Added to wishlist: ${key}`);
  };

  const removeFromWishlist = (movie) => {
    const key = getKey(movie);
    if (!key) return;

    setWishlist((prev) => prev.filter((m) => getKey(m) !== key));
    toast.info(`Removed from wishlist: ${key}`);
  };

  const addToWatched = (movie) => {
    const key = getKey(movie);
    if (!key) return;

    if (watchedKeys.has(key)) {
      toast.info(`Already watched: ${key}`);
      return;
    }

    setWatched((prev) => [...prev, movie]);
    setWishlist((prev) => prev.filter((m) => getKey(m) !== key));

    toast.success(`Marked watched: ${key}`);
  };

  const handleDownload = () => {
    if (!wishlist.length) {
      toast.warn("Wishlist is empty. Add movies before downloading.");
      return;
    }
    downloadWishlist(wishlist);
    toast.success("Downloaded wishlist.pdf");
  };

  return {
    wishlist,
    watched,
    addToWishlist,
    removeFromWishlist,
    addToWatched,
    handleDownload,
    isInWishlist: (movie) => wishlistKeys.has(getKey(movie)),
    isWatched: (movie) => watchedKeys.has(getKey(movie)),
  };
};

export default useWishlist;
