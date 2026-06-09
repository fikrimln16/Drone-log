import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        a.id,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status,

        COUNT(f.id) AS total_flights,

        COUNT(DISTINCT f.mission_name) AS total_missions,

        MAX(f.flight_date) AS last_flight

      FROM amas a

      LEFT JOIN drone_flight_history f
        ON f.ama_id = a.id


      GROUP BY
        a.id,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status

      ORDER BY a.id DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}
