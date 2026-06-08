"use client";

import { useMemo, useState } from "react";

import { FlightErrors, FlightForm } from "@/types/flight";

const defaultForm: FlightForm = {
  flight_date: "",

  ama: "",

  estate: "",

  pilot: "",

  flight_id: "",

  mission_name: "",

  battery_id: "",

  battery_id_2: "",

  battery_color: "",

  start_percent: "",

  end_percent: "",

  start_volt: "",

  end_volt: "",

  start_time: "",

  end_time: "",

  duration_min: "",

  notes: "",

  ama_id: 0,
};

export default function useFlightForm(initial?: Partial<FlightForm>) {
  const [form, setForm] = useState<FlightForm>({
    ...defaultForm,

    ...initial,
  });

  const [errors, setErrors] = useState<FlightErrors>({});

  const isValid = useMemo(() => {
    return (
      form.flight_date &&
      form.ama &&
      form.estate &&
      form.pilot &&
      form.flight_id &&
      form.mission_name &&
      form.battery_id &&
      form.battery_id_2 &&
      form.battery_color &&
      form.start_percent &&
      form.end_percent &&
      form.start_volt &&
      form.end_volt &&
      form.start_time &&
      form.end_time &&
      form.duration_min
    );
  }, [form]);

  function validate() {
    const newErrors: FlightErrors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key === "notes") return;

      if (!value) {
        newErrors[key] = "Field wajib diisi";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  return {
    form,

    setForm,

    errors,

    setErrors,

    validate,

    isValid,
  };
}
