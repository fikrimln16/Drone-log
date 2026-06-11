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

        COUNT(
          DISTINCT fp.flight_id
        ) AS total_flights,

        COUNT(
          DISTINCT f.mission_name
        ) AS total_missions,

        COALESCE(
          SUM(f.duration_min),
          0
        ) AS total_duration,

        ROUND(
          AVG(f.duration_min),
          1
        ) AS avg_duration,

        MAX(f.flight_date) AS last_flight

      FROM pilots p

      LEFT JOIN flight_pilots fp
        ON fp.pilot_id = p.id

      LEFT JOIN drone_flight_history f
        ON f.id = fp.flight_id

      WHERE p.id = ?

      GROUP BY
        p.id,
        p.pilot_name
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

        COUNT(*) AS total,

        SUM(
          f.duration_min
        ) AS duration

      FROM flight_pilots fp

      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id

      WHERE fp.pilot_id = ?

      GROUP BY
        f.mission_name

      ORDER BY duration DESC
      `,
      [pilotId]
    );

    // =====================================================
    // RECENT FLIGHTS
    // =====================================================

    const [recentRows]: any = await pool.query(
      `
      SELECT
        f.*,

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
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status

      ORDER BY
        f.flight_date DESC,
        f.id DESC

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
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed fetch pilot analytics",
      },
      {
        status: 500,
      }
    );
  }
}
