import { NextResponse } from "next/server";

import pool from "@/lib/db";

type Params = {
  params: Promise<{
    pilot: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Params
) {
  try {
    const { pilot } =
      await params;

    // SUMMARY
    const [summaryRows]: any =
      await pool.query(
        `
        SELECT
          pilot,

          COUNT(*) AS total_flights,

          COUNT(DISTINCT mission_name) AS total_missions,

          SUM(duration_min) AS total_duration,

          ROUND(AVG(duration_min), 1) AS avg_duration,

          MAX(flight_date) AS last_flight

        FROM drone_flight_history

        WHERE pilot = ?

        GROUP BY pilot
        `,
        [pilot]
      );

    // MISSIONS
    const [missionRows]: any =
      await pool.query(
        `
        SELECT
          mission_name,

          COUNT(*) AS total,

          SUM(duration_min) AS duration

        FROM drone_flight_history

        WHERE pilot = ?

        GROUP BY mission_name

        ORDER BY duration DESC
        `,
        [pilot]
      );

    // RECENT FLIGHTS
    const [recentRows]: any =
      await pool.query(
        `
        SELECT
          flight_id,
          mission_name,
          duration_min,
          flight_date,
          end_percent

        FROM drone_flight_history

        WHERE pilot = ?

        ORDER BY flight_date DESC

        LIMIT 5
        `,
        [pilot]
      );

    return NextResponse.json({
      summary:
        summaryRows[0] || null,

      missions: missionRows || [],

      recent_flights:
        recentRows || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed fetch pilot analytics",
      },
      {
        status: 500,
      }
    );
  }
}