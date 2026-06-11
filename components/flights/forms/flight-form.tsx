import FlightInput from "./flight-input";

import BatterySelect from "./battery-select";

import FlightFormSection from "./flight-form-section";

type Props = {
  form: any;

  setForm: any;

  errors: any;

  pilots: any[];

  missions: any[];

  disableFlightId?: boolean;
};

export default function FlightForm({
  form,
  setForm,
  errors,
  disableFlightId,
  pilots,
  missions,
}: Props) {
  // AUTO USED BATTERY
  const usedBattery =
    Number(form.start_percent || 0) - Number(form.end_percent || 0);

  return (
    <div className="space-y-8 pb-24">
      {/* ================================================= */}
      {/* FLIGHT INFORMATION */}
      {/* ================================================= */}
      <FlightFormSection title="Flight Information">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FlightInput
            label="Flight Date"
            type="date"
            value={form.flight_date}
            error={errors.flight_date}
            onChange={(value) =>
              setForm({
                ...form,
                flight_date: value,
              })
            }
          />

          <FlightInput
            disabled={disableFlightId}
            label="Flight ID"
            value={form.flight_id}
            error={errors.flight_id}
            onChange={(value) =>
              setForm({
                ...form,
                flight_id: value,
              })
            }
          />

          <FlightInput
            label="AMA"
            value={form.ama}
            error={errors.ama}
            disabled
            onChange={() => {}}
          />

          <FlightInput
            label="Estate"
            value={form.estate}
            error={errors.estate}
            onChange={(value) =>
              setForm({
                ...form,
                estate: value,
              })
            }
          />

          <FlightInput
            label="UAV Unit"
            value={form.uav_unit ?? ""}
            error={errors.uav_unit}
            onChange={(value) =>
              setForm({
                ...form,
                uav_unit: value,
              })
            }
          />

          <div className="md:col-span-2">
            <label className="mb-3 block text-sm font-bold tracking-wide text-gray-600 uppercase">
              Assigned Pilots
            </label>

            <div className="grid grid-cols-2 gap-2">
              {Array.isArray(pilots) &&
                pilots.map((pilot) => (
                  <label
                    key={pilot.id}
                    className={`cursor-pointer rounded-2xl border p-3 transition ${
                      (form.pilot_ids || []).includes(pilot.id)
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(form.pilot_ids || []).includes(pilot.id)}
                      className="hidden"
                      onChange={() => {
                        const exists = (form.pilot_ids || []).includes(
                          pilot.id
                        );

                        setForm({
                          ...form,

                          pilot_ids: exists
                            ? (form.pilot_ids || []).filter(
                                (id: number) => id !== pilot.id
                              )
                            : [...(form.pilot_ids || []), pilot.id],
                        });
                      }}
                    />

                    <span className="font-semibold">{pilot.pilot_name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
              Mission Name
            </label>

            <select
              value={form.mission_name ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  mission_name: e.target.value,
                })
              }
              className={`h-[56px] w-full rounded-2xl border bg-gray-50 px-4 text-base transition outline-none focus:border-blue-500 ${
                errors.mission_name ? "border-red-300" : "border-gray-200"
              }`}
            >
              <option value="">Select Mission</option>

              {Array.isArray(missions) &&
                missions.map((mission: any, index: number) => (
                  <option
                    key={mission.mission_name || index}
                    value={mission.mission_name}
                  >
                    {mission.mission_name}
                  </option>
                ))}
            </select>

            {errors.mission_name && (
              <p className="mt-2 text-sm text-red-500">{errors.mission_name}</p>
            )}
          </div>
        </div>
      </FlightFormSection>

      {/* ================================================= */}
      {/* BATTERY INFORMATION */}
      {/* ================================================= */}
      <FlightFormSection title="Battery Information">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FlightInput
            label="Battery ID"
            value={form.battery_id}
            error={errors.battery_id}
            onChange={(value) =>
              setForm({
                ...form,
                battery_id: value,
              })
            }
          />

          <FlightInput
            label="Battery ID 2"
            value={form.battery_id_2}
            error={errors.battery_id_2}
            onChange={(value) =>
              setForm({
                ...form,
                battery_id_2: value,
              })
            }
          />

          <BatterySelect
            label="Battery Color"
            value={form.battery_color}
            error={errors.battery_color}
            onChange={(value) =>
              setForm({
                ...form,
                battery_color: value,
              })
            }
          />

          <div>
            <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
              Used Battery
            </label>

            <div
              className={`flex h-[56px] items-center rounded-2xl border px-5 text-lg font-semibold ${
                usedBattery >= 70
                  ? "border-red-200 bg-red-50 text-red-700"
                  : usedBattery >= 40
                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                    : "border-green-200 bg-green-50 text-green-700"
              } `}
            >
              {usedBattery || 0}%
            </div>
          </div>

          <FlightInput
            label="Start Percent"
            type="number"
            value={form.start_percent}
            error={errors.start_percent}
            onChange={(value) =>
              setForm({
                ...form,
                start_percent: value,
              })
            }
          />

          <FlightInput
            label="End Percent"
            type="number"
            value={form.end_percent}
            error={errors.end_percent}
            onChange={(value) =>
              setForm({
                ...form,
                end_percent: value,
              })
            }
          />

          <FlightInput
            label="Start Volt"
            type="number"
            value={form.start_volt}
            error={errors.start_volt}
            onChange={(value) =>
              setForm({
                ...form,
                start_volt: value,
              })
            }
          />

          <FlightInput
            label="End Volt"
            type="number"
            value={form.end_volt}
            error={errors.end_volt}
            onChange={(value) =>
              setForm({
                ...form,
                end_volt: value,
              })
            }
          />
        </div>
      </FlightFormSection>

      {/* ================================================= */}
      {/* FLIGHT TIME */}
      {/* ================================================= */}
      <FlightFormSection title="Flight Time">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FlightInput
            label="Start Time"
            type="time"
            value={form.start_time}
            error={errors.start_time}
            onChange={(value) =>
              setForm({
                ...form,
                start_time: value,
              })
            }
          />

          <FlightInput
            label="End Time"
            type="time"
            value={form.end_time}
            error={errors.end_time}
            onChange={(value) =>
              setForm({
                ...form,
                end_time: value,
              })
            }
          />

          <FlightInput
            label="Duration (min)"
            type="number"
            value={form.duration_min}
            error={errors.duration_min}
            onChange={(value) =>
              setForm({
                ...form,
                duration_min: value,
              })
            }
          />
        </div>
      </FlightFormSection>

      {/* ================================================= */}
      {/* NOTES */}
      {/* ================================================= */}
      <FlightFormSection title="Additional Notes">
        <textarea
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
          className="min-h-[140px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 text-base transition outline-none focus:border-blue-500"
          placeholder="Write additional notes..."
        />
      </FlightFormSection>
    </div>
  );
}
