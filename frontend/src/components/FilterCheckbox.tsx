type FilterCheckboxProps = {
  label: string;
  color: string;
  isChecked: boolean;
  onChange: () => void;
};

const FilterCheckbox = ({ label, color, isChecked, onChange }: FilterCheckboxProps) => {
  return (
    <label
      className="flex w-full items-center gap-3 cursor-pointer p-2 rounded-md transition-colors hover:bg-yellow-200"
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="sr-only peer" 
      />

      <div
        className={`relative flex h-5 w-5 items-center justify-center rounded border-2 transition-all
          ${isChecked ? 'border-blue-600 bg-blue-600' : 'border-gray-400 bg-white'}`}
      >
        <svg
          className={`h-3 w-3 text-white transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={4}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <span className={`h-3 w-3 rounded-full ${color}`}></span>

      <span className="text-sm text-gray-800 select-none">{label}</span>
    </label>
  );
};

export default FilterCheckbox;