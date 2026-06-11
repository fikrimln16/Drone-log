export const EXPORT_HEADERS = [
  "flight_date",
  "ama",
  "estate",
  "pilot",
  "flight_id",
  "mission_name",
  "battery_id",
  "battery_id_2",
  "battery_color",
  "start_percent",
  "end_percent",
  "start_volt",
  "end_volt",
  "start_time",
  "end_time",
  "duration_min",
  "notes",
];

export function generateCSV(filteredFlights: any[]) {
  const csvRows = [
    EXPORT_HEADERS.join(","),

    ...filteredFlights.map((item) =>
      [
        item.flight_date,
        item.ama,
        item.estate,
        `"${(item.pilots || []).join(", ")}"`,
        item.flight_id,
        item.mission_name,
        item.battery_id,
        item.battery_id_2,
        item.battery_color,
        item.start_percent,
        item.end_percent,
        item.start_volt,
        item.end_volt,
        item.start_time,
        item.end_time,
        item.duration_min,
        `"${item.notes || ""}"`,
      ].join(",")
    ),
  ];

  return csvRows.join("\n");
}
