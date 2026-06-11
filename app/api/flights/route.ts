import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // =====================================================
    // QUERY
    // =====================================================

    const [rows]: any = await pool.query(`
      SELECT
          f.id,
          f.flight_date,
          f.flight_id,
          f.mission_name,
          f.estate,
          f.uav_unit,
          f.battery_id,
          f.battery_id_2,
          f.battery_color,
          f.start_percent,
          f.end_percent,
          f.start_volt,
          f.end_volt,
          f.start_time,
          f.end_time,
          f.duration_min,
          f.notes,

          a.id AS ama_id,
          a.ama_name as ama,
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
          a.id,
          a.ama_name,
          a.latitude,
          a.longitude,
          a.status

      ORDER BY
          f.flight_date DESC,
          f.id DESC
    `);

    // =====================================================
    // RESPONSE
    // =====================================================
    const formatted = rows.map((item: any) => ({
      ...item,

      pilots: item.pilots ? item.pilots.split(", ") : [],
    }));

    return NextResponse.json(formatted);
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
