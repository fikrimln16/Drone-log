export type FlightForm = {
  flight_date: string;

  ama: string;

  estate: string;

  pilot: string;

  flight_id: string;

  mission_name?: string;

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

  ama_id: string
};

export type FlightErrors = {
  [key: string]: string;
};
