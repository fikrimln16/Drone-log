import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        pilot,

        COUNT(*) AS total_flights,

        COUNT(DISTINCT mission_name) AS total_missions,

        SUM(duration_min) AS total_duration,

        MAX(flight_date) AS last_flight

      FROM drone_flight_history

      WHERE pilot IS NOT NULL
        AND pilot != ''

      GROUP BY pilot

      ORDER BY total_duration DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed fetch pilots",
      },
      {
        status: 500,
      }
    );
  }
}