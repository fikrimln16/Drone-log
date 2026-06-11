import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    // ============================================
    // TOTAL AMA
    // ============================================

    const [amaRows]: any = await pool.query(`
      SELECT COUNT(*) AS total_ama
      FROM amas
    `);

    const totalAma = Number(amaRows[0]?.total_ama || 0);

    // ============================================
    // PILOT SUMMARY
    // ============================================

    const [rows]: any = await pool.query(`
      SELECT
        p.id,

        p.pilot_name AS pilot,

        COUNT(DISTINCT f.id)
          AS total_flights,

        COUNT(
          DISTINCT f.mission_name
        ) AS total_missions,

        COUNT(
          DISTINCT f.ama_id
        ) AS total_amas,

        GROUP_CONCAT(
          DISTINCT a.ama_name
          ORDER BY a.ama_name
          SEPARATOR ','
        ) AS ama_list,

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

      LEFT JOIN amas a
      ON a.id = f.ama_id

      GROUP BY
        p.id,
        p.pilot_name

      ORDER BY
        total_duration DESC,
        p.pilot_name ASC
    `);

    // ============================================
    // FORMAT
    // ============================================

    const formatted = rows.map((item: any) => {
      const totalHours = Number(item.total_duration || 0) / 60;

      let status = "OPTIMAL";

      if (totalHours > 160) {
        status = "NEED REST";
      } else if (totalHours < 120) {
        status = "UNDER TARGET";
      }

      return {
        id: item.id,

        pilot: item.pilot,

        total_flights: Number(item.total_flights || 0),

        total_missions: Number(item.total_missions || 0),

        total_amas: Number(item.total_amas || 0),

        total_duration: Number(item.total_duration || 0),

        avg_duration: Number(item.avg_duration || 0),

        total_hours: totalHours.toFixed(1),

        last_flight: item.last_flight,

        status,

        ama_coverage: `${item.total_amas}/${totalAma}`,

        ama_list: item.ama_list ? item.ama_list.split(",") : [],
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}
