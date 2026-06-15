type Props = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  error?: string;
};

export default function BatterySelect({
  label,
  value,
  onChange,
  error,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[64px] w-full rounded-2xl border bg-gray-50 px-5 text-lg outline-none ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <option value="">Select Color</option>

        <option value="Black">Black</option>

        <option value="White">White</option>

        <option value="Red">Red</option>

        <option value="Blue">Blue</option>

        <option value="Green">Green</option>

        <option value="Purple">Purple</option>

        <option value="Gray">Gray</option>

        <option value="No Color">No Color</option>
      </select>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
