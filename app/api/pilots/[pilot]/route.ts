import { NextResponse } from "next/server";

import pool from "@/lib/db";

type Params = {
  params: Promise<{
    pilot: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { pilot } = await params;

    const pilotId = Number(pilot);

    // =====================================================
    // SUMMARY
    // =====================================================

    const [summaryRows]: any = await pool.query(
      `
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
          COALESCE(
            SUM(f.duration_min),
            0
          ) / 60,
          1
        ) AS total_hours,

        ROUND(
          COALESCE(
            SUM(
              CASE
                WHEN MONTH(f.flight_date) = MONTH(CURDATE())
                 AND YEAR(f.flight_date) = YEAR(CURDATE())
                THEN f.duration_min
                ELSE 0
              END
            ),
            0
          ) / 60,
          1
        ) AS total_hours_this_month,

        ROUND(
          AVG(f.duration_min),
          1
        ) AS avg_duration,

        MAX(
          f.flight_date
        ) AS last_flight

      FROM pilots p

      LEFT JOIN flight_pilots fp
        ON fp.pilot_id = p.id

      LEFT JOIN drone_flight_history f
        ON f.id = fp.flight_id

      WHERE p.id = ?

      GROUP BY
        p.id,
        p.pilot_name,
        p.photo_url
      `,
      [pilotId]
    );

    // =====================================================
    // MISSION ACTIVITY
    // =====================================================

    const [missionRows]: any = await pool.query(
      `
      SELECT
        f.mission_name,

        COUNT(*) AS total_flights,

        ROUND(
          SUM(f.duration_min) / 60,
          1
        ) AS total_hours,

        ROUND(
          AVG(f.duration_min),
          1
        ) AS avg_duration,

        MAX(
          f.flight_date
        ) AS last_activity

      FROM flight_pilots fp

      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id

      WHERE fp.pilot_id = ?

      GROUP BY
        f.mission_name

      ORDER BY
        total_hours DESC
      `,
      [pilotId]
    );

    // =====================================================
    // RECENT FLIGHTS
    // =====================================================

    const [recentRows]: any = await pool.query(
      `
      SELECT
        f.id,

        f.flight_id,

        f.flight_date,

        f.mission_name,

        f.duration_min,

        f.uav_unit,

        f.battery_id,

        f.end_percent,

        a.ama_name AS ama,

        a.latitude,

        a.longitude,

        a.status AS ama_status,

        GROUP_CONCAT(
          DISTINCT p2.pilot_name
          ORDER BY p2.pilot_name
          SEPARATOR ', '
        ) AS pilots

      FROM flight_pilots fp

      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id

      LEFT JOIN amas a
        ON a.id = f.ama_id

      LEFT JOIN flight_pilots fp2
        ON fp2.flight_id = f.id

      LEFT JOIN pilots p2
        ON p2.id = fp2.pilot_id

      WHERE fp.pilot_id = ?

      GROUP BY
        f.id,
        f.flight_id,
        f.flight_date,
        f.mission_name,
        f.duration_min,
        f.uav_unit,
        f.battery_id,
        f.end_percent,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status

      ORDER BY
        f.flight_date DESC,
        f.id DESC

      LIMIT 10
      `,
      [pilotId]
    );

    // =====================================================
    // FLIGHT TREND
    // =====================================================

    const [trendRows]: any = await pool.query(
      `
      SELECT
        DATE(
          f.flight_date
        ) AS flight_date,

        ROUND(
          SUM(f.duration_min) / 60,
          1
        ) AS total_hours

      FROM flight_pilots fp

      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id

      WHERE fp.pilot_id = ?

      GROUP BY
        DATE(
          f.flight_date
        )

      ORDER BY
        flight_date ASC
      `,
      [pilotId]
    );

    // =====================================================
    // TOP AMA
    // =====================================================

    const [amaRows]: any = await pool.query(
      `
      SELECT
        a.id,

        a.ama_name,

        COUNT(*) AS total_flights,

        ROUND(
          SUM(f.duration_min) / 60,
          1
        ) AS total_hours

      FROM flight_pilots fp

      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id

      INNER JOIN amas a
        ON a.id = f.ama_id

      WHERE fp.pilot_id = ?

      GROUP BY
        a.id,
        a.ama_name

      ORDER BY
        total_flights DESC

      LIMIT 5
      `,
      [pilotId]
    );

    // =====================================================
    // FORMAT PILOTS
    // =====================================================

    const formattedRecentFlights = recentRows.map((item: any) => ({
      ...item,

      pilots: item.pilots ? item.pilots.split(", ") : [],
    }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      summary: summaryRows[0] || null,

      missions: missionRows || [],

      recent_flights: formattedRecentFlights || [],

      flight_trend: trendRows || [],

      top_amas: amaRows || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed fetch pilot analytics",
      },
      {
        status: 500,
      }
    );
  }
}
