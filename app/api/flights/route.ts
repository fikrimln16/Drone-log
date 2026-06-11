import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // =====================================================
    // QUERY
    // =====================================================

    const [rows] = await pool.query(`
    SELECT
        f.*,

        a.ama_name AS ama,
        a.latitude,
        a.longitude,
        a.status AS ama_status,

        COUNT(DISTINCT p.id) AS pilot_count,

        GROUP_CONCAT(
            DISTINCT p.pilot_name
            ORDER BY p.pilot_name
            SEPARATOR ', '
        ) AS pilots

    FROM drone_flight_history f

    LEFT JOIN amas a
    ON a.id = f.ama_id

    LEFT JOIN flight_pilots fp
    ON fp.flight_id = f.id

    LEFT JOIN pilots p
    ON p.id = fp.pilot_id

    GROUP BY
        f.id,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status

    ORDER BY f.id DESC
    `);

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Database Error",
      },
      {
        status: 500,
      }
    );
  }
}
