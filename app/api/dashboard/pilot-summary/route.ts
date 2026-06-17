import { NextRequest, NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // ============================================
    // SELECTED MONTH
    // ============================================

    const monthParam =
      request.nextUrl.searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);

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

    const [rows]: any = await pool.query(
      `
      SELECT
        p.id,

        p.pilot_name AS pilot,

        p.photo_url,

        -- TOTAL FLIGHTS BULAN TERPILIH
        COUNT(
          DISTINCT CASE
            WHEN DATE_FORMAT(f.flight_date, '%Y-%m') = ?
            THEN f.id
          END
        ) AS total_flights_this_month,

        -- TOTAL MISSIONS BULAN TERPILIH
        COUNT(
          DISTINCT CASE
            WHEN DATE_FORMAT(f.flight_date, '%Y-%m') = ?
            THEN f.mission_name
          END
        ) AS total_missions_this_month,

        -- TOTAL AMA
        COUNT(DISTINCT f.ama_id)
          AS total_amas,

        GROUP_CONCAT(
          DISTINCT a.ama_name
          ORDER BY a.ama_name
          SEPARATOR ','
        ) AS ama_list,

        -- TOTAL DURASI SEMUA HISTORI
        COALESCE(
          SUM(f.duration_min),
          0
        ) AS total_duration,

        -- TOTAL DURASI BULAN TERPILIH
        COALESCE(
          SUM(
            CASE
              WHEN DATE_FORMAT(f.flight_date, '%Y-%m') = ?
              THEN f.duration_min
              ELSE 0
            END
          ),
          0
        ) AS duration_this_month,

        -- AVG DURATION BULAN TERPILIH
        ROUND(
          AVG(
            CASE
              WHEN DATE_FORMAT(f.flight_date, '%Y-%m') = ?
              THEN f.duration_min
              ELSE NULL
            END
          ),
          1
        ) AS avg_duration_this_month,

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
        duration_this_month DESC,
        p.pilot_name ASC
      `,
      [monthParam, monthParam, monthParam, monthParam]
    );

    // ============================================
    // FORMAT
    // ============================================

    const formatted = rows.map((item: any) => {
      const totalDuration = Number(item.total_duration || 0);

      const durationThisMonth = Number(item.duration_this_month || 0);

      const totalHours = totalDuration / 60;

      const hoursThisMonth = durationThisMonth / 60;

      let status = "NO ACTIVITY";

      if (hoursThisMonth >= 21) {
        status = "TARGET ACHIEVED";
      } else if (hoursThisMonth > 0) {
        status = "UNDER TARGET";
      }

      return {
        id: item.id,

        pilot: item.pilot,

        photo_url: item.photo_url,

        total_flights_this_month: Number(item.total_flights_this_month || 0),

        total_missions_this_month: Number(item.total_missions_this_month || 0),

        total_amas: Number(item.total_amas || 0),

        total_duration: totalDuration,

        duration_this_month: durationThisMonth,

        avg_duration_this_month: Number(item.avg_duration_this_month || 0),

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

    return NextResponse.json(
      {
        period: null,
        data: [],
      },
      { status: 500 }
    );
  }
}
