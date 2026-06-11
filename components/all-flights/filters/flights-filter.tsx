type Props = {
  search: string;
  setSearch: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;

  selectedMission: string;
  setSelectedMission: (value: string) => void;

  selectedAma: string;
  setSelectedAma: (value: string) => void;

  selectedEstate: string;
  setSelectedEstate: (value: string) => void;

  selectedBattery: string;
  setSelectedBattery: (value: string) => void;

  selectedPilot: string;
  setSelectedPilot: (value: string) => void;

  missionOptions: string[];
  amaOptions: string[];
  estateOptions: string[];
  batteryOptions: string[];
  pilotOptions: string[];

  resetFilters: () => void;
};

export default function FlightsFilter({
  search,
  setSearch,

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  selectedMission,
  setSelectedMission,

  selectedAma,
  setSelectedAma,

  selectedEstate,
  setSelectedEstate,

  selectedBattery,
  setSelectedBattery,

  selectedPilot,
  setSelectedPilot,

  missionOptions,
  amaOptions,
  estateOptions,
  batteryOptions,
  pilotOptions,

  resetFilters,
}: Props) {
  return (
    <div className="rounded-[32px] border bg-white p-5 shadow-sm">
      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search flight..."
        className="mb-5 h-[54px] w-full rounded-2xl border px-5 outline-none"
      />

      {/* FILTER GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {/* START */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-600">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-[54px] w-full rounded-2xl border px-4 outline-none"
          />
        </div>

        {/* END */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-600">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-[54px] w-full rounded-2xl border px-4 outline-none"
          />
        </div>

        {/* MISSION */}
        <SelectFilter
          label="Mission"
          value={selectedMission}
          onChange={setSelectedMission}
          options={missionOptions}
        />

        {/* AMA */}
        <SelectFilter
          label="AMA"
          value={selectedAma}
          onChange={setSelectedAma}
          options={amaOptions}
        />

        {/* ESTATE */}
        <SelectFilter
          label="Estate"
          value={selectedEstate}
          onChange={setSelectedEstate}
          options={estateOptions}
        />

        {/* BATTERY */}
        {/* <SelectFilter
          label="Battery"
          value={selectedBattery}
          onChange={setSelectedBattery}
          options={batteryOptions}
        /> */}

        {/* PILOT */}
        <SelectFilter
          label="Pilot"
          value={selectedPilot}
          onChange={setSelectedPilot}
          options={pilotOptions}
        />
      </div>

      {/* ACTION */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={resetFilters}
          className="rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

type SelectProps = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  options: string[];
};

function SelectFilter({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] w-full rounded-2xl border px-4 outline-none"
      >
        <option value="">All {label}</option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
