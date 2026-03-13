// src/components/FilterBar.jsx
import { AGE_GROUPS, GENRES } from "../constants";

const FilterBar = ({ filters, onChange }) => {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="form-control w-full sm:w-56">
        <label className="label">
          <span className="label-text">Genre</span>
        </label>
        <select
          className="select select-bordered"
          value={filters.genre}
          onChange={(e) => update({ genre: e.target.value })}
        >
          <option value="">All</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full sm:w-56">
        <label className="label">
          <span className="label-text">Age Group</span>
        </label>
        <select
          className="select select-bordered"
          value={filters.ageGroup}
          onChange={(e) => update({ ageGroup: e.target.value })}
        >
          <option value="">All</option>
          {AGE_GROUPS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control w-full sm:w-44">
        <label className="label">
          <span className="label-text">Year</span>
        </label>
        <input
          className="input input-bordered"
          type="number"
          placeholder="e.g. 2014"
          value={filters.year}
          onChange={(e) => update({ year: e.target.value })}
        />
      </div>

      <button
        className="btn btn-ghost sm:mb-[2px]"
        onClick={() => onChange({ genre: "", ageGroup: "", year: "" })}
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;
