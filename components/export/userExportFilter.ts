import { useMemo, useState } from "react";

export default function useExportFilter(flights: any[]) {
  const [search, setSearch] = useState("");

  const [mission, setMission] = useState("");

  const [ama, setAma] = useState("");

  const [estate, setEstate] = useState("");

  const [battery, setBattery] = useState("");

  const [pilot, setPilot] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const missions = useMemo(
    () => [
      ...new Set(flights.map((item) => item.mission_name).filter(Boolean)),
    ],
    [flights]
  );

  const amas = useMemo(
    () => [...new Set(flights.map((item) => item.ama).filter(Boolean))],
    [flights]
  );

  const estates = useMemo(
    () => [...new Set(flights.map((item) => item.estate).filter(Boolean))],
    [flights]
  );

  const batteries = useMemo(
    () => [...new Set(flights.map((item) => item.battery_id).filter(Boolean))],
    [flights]
  );

  const pilots = useMemo(
    () => [...new Set(flights.flatMap((item) => item.pilots || []))],
    [flights]
  );

  const filteredFlights = useMemo(() => {
    return flights.filter((item) => {
      const itemDate = new Date(item.flight_date);

      const validSearch =
        !search ||
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase());

      const validPilot = !pilot || (item.pilots || []).includes(pilot);

      return (
        validSearch &&
        (!mission || item.mission_name === mission) &&
        (!ama || item.ama === ama) &&
        (!estate || item.estate === estate) &&
        (!battery || item.battery_id === battery) &&
        validPilot &&
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate))
      );
    });
  }, [
    flights,
    search,
    mission,
    ama,
    estate,
    battery,
    pilot,
    startDate,
    endDate,
  ]);

  function resetFilters() {
    setSearch("");
    setMission("");
    setAma("");
    setEstate("");
    setBattery("");
    setPilot("");
    setStartDate("");
    setEndDate("");
  }

  return {
    search,
    setSearch,

    mission,
    setMission,

    ama,
    setAma,

    estate,
    setEstate,

    battery,
    setBattery,

    pilot,
    setPilot,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    missions,
    amas,
    estates,
    batteries,
    pilots,

    filteredFlights,

    resetFilters,
  };
}
