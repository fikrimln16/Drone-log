export type FlightForm = {
  pilot_ids: number[];

  uav_unit: string;

  flight_date: string;

  ama: string;

  ama_id: number;

  estate: string;

  flight_id: string;

  mission_name: string;

  battery_id: string;

  battery_id_2: string;

  battery_color: string;

  start_percent: string;

  end_percent: string;

  start_volt: string;

  end_volt: string;

  start_time: string;

  end_time: string;

  duration_min: string;

  notes: string;
};

export type FlightErrors = {
  [key: string]: string;
};
