import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        p.id,

        p.pilot_name AS pilot,

        p.photo_url,

        COUNT(
          DISTINCT fp.flight_id
        ) AS total_flights,

        COUNT(
          DISTINCT f.mission_name
        ) AS total_missions,

        COUNT(
          DISTINCT f.ama_id
        ) AS total_amas,

        COALESCE(
          SUM(f.duration_min),
          0
        ) AS total_duration,

        ROUND(
          AVG(f.duration_min),
          1
        ) AS avg_duration,

        MAX(f.flight_date)
          AS last_flight

      FROM pilots p

      LEFT JOIN flight_pilots fp
        ON fp.pilot_id = p.id

      LEFT JOIN drone_flight_history f
        ON f.id = fp.flight_id

      GROUP BY
        p.id,
        p.pilot_name,
        p.photo_url

      ORDER BY
        total_duration DESC,
        total_flights DESC,
        p.pilot_name ASC
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
