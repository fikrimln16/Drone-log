import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// GET AMA MAP DATA
// =====================================================

export async function GET() {
  try {
    // =====================================================
    // QUERY
    // =====================================================

    const [rows]: any = await pool.query(`
      SELECT
        a.id,

        a.ama_name AS ama,

        a.latitude AS lat,

        a.longitude AS lng,

        COUNT(f.id) AS total_flights,

        COUNT(DISTINCT f.mission_name) AS total_missions,

        MAX(f.flight_date) AS latest_flight,

        GROUP_CONCAT(
          DISTINCT f.mission_name
        ) AS missions

      FROM amas a

      -- =================================================
      -- FLIGHT RELATION
      -- =================================================

      LEFT JOIN drone_flight_history f
      ON f.ama_id = a.id

      -- =================================================
      -- GROUPING
      -- =================================================

      GROUP BY
        a.id,
        a.ama_name,
        a.latitude,
        a.longitude

      ORDER BY
        a.ama_name ASC
    `);

    // =====================================================
    // FORMAT RESULT
    // =====================================================

    const result = rows.map((item: any) => ({
      id: item.id,

      ama: item.ama,

      lat: Number(item.lat),

      lng: Number(item.lng),

      total_flights:
        Number(item.total_flights || 0),

      total_missions:
        Number(item.total_missions || 0),

      latest_flight:
        item.latest_flight || null,

      missions:
        item.missions &&
        item.missions !== null
          ? item.missions
              .split(",")
              .filter(Boolean)
          : [],
    }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed fetch AMA map data",
      },
      {
        status: 500,
      }
    );
  }
}