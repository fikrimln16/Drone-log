"use client";

import { useMemo, useState } from "react";

export default function useFlightFilters(flights: any[]) {
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedMission, setSelectedMission] = useState("");

  const [selectedAma, setSelectedAma] = useState("");

  const [selectedEstate, setSelectedEstate] = useState("");

  const [selectedBattery, setSelectedBattery] = useState("");

  const [selectedPilot, setSelectedPilot] = useState("");

  const filteredFlights = useMemo(() => {
    return flights.filter((item) => {
      const searchValue = search.toLowerCase();

      // SEARCH
      const validSearch =
        !search || JSON.stringify(item).toLowerCase().includes(searchValue);

      // MISSION
      const validMission =
        !selectedMission || item.mission_name === selectedMission;

      // AMA
      const validAma = !selectedAma || item.ama === selectedAma;

      // ESTATE
      const validEstate = !selectedEstate || item.estate === selectedEstate;

      // BATTERY
      const validBattery =
        !selectedBattery || item.battery_id === selectedBattery;

      // PILOT
      const pilots = Array.isArray(item.pilots) ? item.pilots : [];

      const validPilot = !selectedPilot || pilots.includes(selectedPilot);

      // DATE
      const itemDate = new Date(item.flight_date);

      const validStart = !startDate || itemDate >= new Date(startDate);

      const validEnd = !endDate || itemDate <= new Date(endDate);

      return (
        validSearch &&
        validMission &&
        validAma &&
        validEstate &&
        validBattery &&
        validPilot &&
        validStart &&
        validEnd
      );
    });
  }, [
    flights,
    search,
    startDate,
    endDate,
    selectedMission,
    selectedAma,
    selectedEstate,
    selectedBattery,
    selectedPilot,
  ]);

  function resetFilters() {
    setSearch("");

    setStartDate("");

    setEndDate("");

    setSelectedMission("");

    setSelectedAma("");

    setSelectedEstate("");

    setSelectedBattery("");

    setSelectedPilot("");
  }

  return {
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

    filteredFlights,

    resetFilters,
  };
}
