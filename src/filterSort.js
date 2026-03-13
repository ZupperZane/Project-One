import { FIELDS } from "./constants";

export const filterMovies = (movies, filters = {}) => {
  const {
    genre = "",
    ageGroup = "",
    year = "",
  } = filters;

  const hasYearRange =
    year && typeof year === "object" && (year.min != null || year.max != null);

  return (movies ?? []).filter((m) => {
    if (!m) return false;

    if (genre && m[FIELDS.GENRE] !== genre) return false;

    if (ageGroup && m[FIELDS.AGE_GROUP] !== ageGroup) return false;

    const yRaw = m[FIELDS.YEAR];
    const y = typeof yRaw === "number" ? yRaw : Number(yRaw);

    if (Number.isNaN(y)) {
      if (year !== "" && year != null) return false;
      return true;
    }

    if (hasYearRange) {
      const min = year.min != null ? Number(year.min) : null;
      const max = year.max != null ? Number(year.max) : null;

      if (min != null && !Number.isNaN(min) && y < min) return false;
      if (max != null && !Number.isNaN(max) && y > max) return false;
      return true;
    }

    if (year !== "" && year != null) {
      const target = Number(year);
      if (!Number.isNaN(target) && y !== target) return false;
    }

    return true;
  });
};

export const sortMovies = (movies, sortBy = "year-desc") => {
  const arr = [...(movies ?? [])];

  const getYear = (m) => {
    const v = m?.[FIELDS.YEAR];
    const n = typeof v === "number" ? v : Number(v);
    return Number.isNaN(n) ? -Infinity : n;
  };

  const getRating = (m) => {
    const v = m?.[FIELDS.RATING];
    const n = typeof v === "number" ? v : Number(v);
    return Number.isNaN(n) ? -Infinity : n;
  };

  const getTitle = (m) => String(m?.[FIELDS.TITLE] ?? "").toLowerCase();

  switch (sortBy) {
    case "year-asc":
      arr.sort((a, b) => getYear(a) - getYear(b));
      break;

    case "rating-desc":
      arr.sort((a, b) => getRating(b) - getRating(a));
      break;

    case "rating-asc":
      arr.sort((a, b) => getRating(a) - getRating(b));
      break;

    case "title-asc":
      arr.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
      break;

    case "title-desc":
      arr.sort((a, b) => getTitle(b).localeCompare(getTitle(a)));
      break;

    case "year-desc":
    default:
      arr.sort((a, b) => getYear(b) - getYear(a));
      break;
  }

  return arr;
};
