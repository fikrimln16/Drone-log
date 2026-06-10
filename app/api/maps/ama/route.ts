import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// GET AMA MAP DATA
// =====================================================

export async function GET() {
  try {
    // =================================================
    // QUERY
    // =================================================

    const [rows]: any = await pool.query(`
      SELECT
        a.id,

        a.ama_name,

        a.latitude,

        a.longitude,

        a.status,

        -- =============================================
        -- NEW DATE COLUMN
        -- =============================================

        a.planning_date,

        a.actual_date,

        -- =============================================
        -- FLIGHT STATS
        -- =============================================

        COUNT(f.id) AS total_flights,

        COUNT(
          DISTINCT f.mission_name
        ) AS total_missions,

        MAX(f.flight_date) AS latest_flight

      FROM amas a

      -- =============================================
      -- FLIGHT RELATION
      -- =============================================

      LEFT JOIN drone_flight_history f
      ON f.ama_id = a.id

      -- =============================================
      -- GROUP
      -- =============================================

      GROUP BY
        a.id,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status,
        a.planning_date,
        a.actual_date

      ORDER BY a.id ASC
    `);

    // =================================================
    // FORMAT RESPONSE
    // =================================================

    const formatted = rows.map((item: any) => ({
      id: Number(item.id),

      ama: item.ama_name || "-",

      lat: Number(item.latitude),

      lng: Number(item.longitude),

      // =============================================
      // STATUS
      // =============================================

      status: item.status || "WAITING",

      // =============================================
      // STATS
      // =============================================

      total_flights: Number(item.total_flights || 0),

      total_missions: Number(item.total_missions || 0),

      // =============================================
      // DATE
      // =============================================

      latest_flight: item.latest_flight || null,

      planning_date: item.planning_date || null,

      actual_date: item.actual_date || null,
    }));

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("MAP API ERROR:", error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed fetch map data",

        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
