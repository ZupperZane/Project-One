import { SORT_OPTIONS } from "../constants";

const SortControls = ({ value, onChange }) => {
  return (
    <div className="form-control w-full sm:w-64">
      <label className="label">
        <span className="label-text">Sort</span>
      </label>
      <select
        className="select select-bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortControls;
