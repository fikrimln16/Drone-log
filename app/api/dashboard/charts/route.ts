import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    // =====================================================
    // FLIGHT ACTIVITY PER MONTH
    // =====================================================

    const [activityRows]: any = await pool.query(`
      SELECT
        MONTH(flight_date) AS month_no,

        DATE_FORMAT(
          flight_date,
          '%b'
        ) AS month,

        COUNT(*) AS flights

      FROM drone_flight_history

      GROUP BY
        MONTH(flight_date),
        DATE_FORMAT(
          flight_date,
          '%b'
        )

      ORDER BY MONTH(flight_date)
    `);

    // =====================================================
    // TOP MISSION DURATION
    // =====================================================

    const [durationRows]: any = await pool.query(`
      SELECT
        mission_name AS mission,

        ROUND(
          SUM(duration_min) / 60,
          1
        ) AS duration

      FROM drone_flight_history

      WHERE mission_name IS NOT NULL

      GROUP BY mission_name

      ORDER BY duration DESC

      LIMIT 10
    `);

    // =====================================================
    // UAV UTILIZATION
    // =====================================================

    const [unitRows]: any = await pool.query(`
      SELECT
        uav_unit AS unit,

        COUNT(*) AS total_flights

      FROM drone_flight_history

      WHERE
        uav_unit IS NOT NULL
        AND uav_unit <> ''

      GROUP BY uav_unit

      ORDER BY total_flights DESC

      LIMIT 10;
    `);

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      activity: activityRows,

      duration: durationRows,

      units: unitRows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed load chart data",
      },
      {
        status: 500,
      }
    );
  }
}
