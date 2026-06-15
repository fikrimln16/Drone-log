import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [
      [flightRows],
      [pilotRows],
      [amaRows],
      [missionRows],
      [durationRows],
      [activePilotRows],
    ]: any = await Promise.all([
      pool.query(`
        SELECT COUNT(*) AS total_flights
        FROM drone_flight_history
      `),

      pool.query(`
        SELECT COUNT(*) AS total_pilots
        FROM pilots
      `),

      pool.query(`
        SELECT COUNT(*) AS total_amas
        FROM amas
      `),

      pool.query(`
        SELECT COUNT(DISTINCT mission_name) AS total_missions
        FROM drone_flight_history
      `),

      pool.query(`
        SELECT
          COALESCE(
            SUM(duration_min),
            0
          ) AS total_duration
        FROM drone_flight_history
      `),

      pool.query(`
        SELECT COUNT(*) AS active_pilots
        FROM pilots
        WHERE status = 'ACTIVE'
      `),
    ]);

    return NextResponse.json({
      total_flights: Number(flightRows[0]?.total_flights || 0),

      total_pilots: Number(pilotRows[0]?.total_pilots || 0),

      total_amas: Number(amaRows[0]?.total_amas || 0),

      total_missions: Number(missionRows[0]?.total_missions || 0),

      total_duration: Number(durationRows[0]?.total_duration || 0),

      active_pilots: Number(activePilotRows[0]?.active_pilots || 0),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch landing stats",
      },
      {
        status: 500,
      }
    );
  }
}
