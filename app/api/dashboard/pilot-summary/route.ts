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

        p.photo_url,

        COUNT(DISTINCT f.id)
          AS total_flights,

        COUNT(DISTINCT f.mission_name)
          AS total_missions,

        COUNT(DISTINCT f.ama_id)
          AS total_amas,

        GROUP_CONCAT(
          DISTINCT a.ama_name
          ORDER BY a.ama_name
          SEPARATOR ','
        ) AS ama_list,

        COALESCE(
          SUM(
            CASE
              WHEN DATE_FORMAT(f.flight_date, '%Y-%m')
                   = DATE_FORMAT(
                       DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
                       '%Y-%m'
                     )
              THEN f.duration_min
              ELSE 0
            END
          ),
          0
        ) AS total_duration,

        COALESCE(
          SUM(
            CASE
              WHEN DATE_FORMAT(f.flight_date, '%Y-%m')
                   = DATE_FORMAT(
                       DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
                       '%Y-%m'
                     )
              THEN f.duration_min
              ELSE 0
            END
          ),
          0
        ) AS duration_this_month,

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
        p.pilot_name,
        p.photo_url

      ORDER BY
        total_duration DESC,
        p.pilot_name ASC
    `);

    // ============================================
    // FORMAT
    // ============================================

    const formatted = rows.map((item: any) => {
      const totalDuration = Number(item.total_duration || 0);

      const durationThisMonth = Number(item.duration_this_month || 0);

      const totalHours = totalDuration / 60;

      const hoursThisMonth = durationThisMonth / 60;

      let status = "OPTIMAL";

      if (durationThisMonth > 160) {
        status = "NEED REST";
      } else if (durationThisMonth < 120) {
        status = "UNDER TARGET";
      }

      return {
        id: item.id,

        pilot: item.pilot,

        photo_url: item.photo_url,

        total_flights: Number(item.total_flights || 0),

        total_missions: Number(item.total_missions || 0),

        total_amas: Number(item.total_amas || 0),

        // bulan sebelumnya
        total_duration: totalDuration,

        // bulan sebelumnya
        duration_this_month: durationThisMonth,

        avg_duration: Number(item.avg_duration || 0),

        total_hours: totalHours.toFixed(1),

        total_hours_this_month: hoursThisMonth.toFixed(1),

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
