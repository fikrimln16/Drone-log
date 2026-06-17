import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    // ACTIVITY CHART
    const [activityRows]: any = await pool.query(`
      SELECT
        DATE_FORMAT(flight_date, '%d %b') as day,
        COUNT(*) as flights
      FROM drone_flight_history
      GROUP BY flight_date
      ORDER BY flight_date DESC
      LIMIT 7
    `);

    // DURATION CHART
    const [durationRows]: any = await pool.query(`
      SELECT
        mission_name as mission,
        SUM(duration_min) as duration
      FROM drone_flight_history
      GROUP BY mission_name
      ORDER BY duration DESC
      LIMIT 5
    `);

    // TOTAL FLIGHT CHART
    const [totalFlightRows]: any = await pool.query(`
      SELECT
        mission_name as mission,
        COUNT(*) as total
      FROM drone_flight_history
      GROUP BY mission_name
      ORDER BY total DESC
      LIMIT 5
    `);

    return NextResponse.json({
      activity: activityRows,

      duration: durationRows,

      totalFlight: totalFlightRows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed load chart data",
      },
      {
        status: 500,
      }
    );
  }
}
