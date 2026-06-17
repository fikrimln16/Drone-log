import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // =================================================
    // TOTAL PILOTS
    // =================================================

    const [pilotRows]: any = await pool.query(`
      SELECT COUNT(*) AS total_pilots
      FROM pilots
    `);

    // =================================================
    // ACTIVE PILOTS THIS MONTH
    // =================================================

    const [activeRows]: any = await pool.query(`
      SELECT
        COUNT(DISTINCT fp.pilot_id) AS active_pilots
      FROM flight_pilots fp
      INNER JOIN drone_flight_history f
        ON f.id = fp.flight_id
      WHERE
        YEAR(f.flight_date)=YEAR(CURDATE())
        AND MONTH(f.flight_date)=MONTH(CURDATE())
    `);

    // =================================================
    // TOTAL FLIGHT HOURS
    // =================================================

    const [durationRows]: any = await pool.query(`
      SELECT
        COALESCE(
          SUM(duration_min),
          0
        ) AS total_duration
      FROM drone_flight_history
    `);

    // =================================================
    // TOP PILOT
    // =================================================

    const [topPilotRows]: any = await pool.query(`
      SELECT
        p.id,

        p.pilot_name,

        p.photo_url,

        COUNT(
          DISTINCT fp.flight_id
        ) AS total_flights,

        COALESCE(
          SUM(f.duration_min),
          0
        ) AS total_duration

      FROM pilots p

      LEFT JOIN flight_pilots fp
        ON fp.pilot_id = p.id

      LEFT JOIN drone_flight_history f
        ON f.id = fp.flight_id

      GROUP BY
        p.id,
        p.pilot_name,
        p.photo_url

      ORDER BY
        total_duration DESC

      LIMIT 1
    `);

    // =================================================
    // HIGHEST WORKLOAD
    // =================================================

    const [flightHoursLeaderRows]: any = await pool.query(`
      SELECT
         p.id,

         p.pilot_name,

         p.photo_url,

         COALESCE(
            SUM(f.duration_min),
            0
         ) AS duration,

         COUNT(
            DISTINCT fp.flight_id
         ) AS total_flights

      FROM pilots p

      LEFT JOIN flight_pilots fp
         ON fp.pilot_id = p.id

      LEFT JOIN drone_flight_history f
         ON f.id = fp.flight_id

      WHERE
         YEAR(f.flight_date)=YEAR(CURDATE())
         AND MONTH(f.flight_date)=MONTH(CURDATE())

      GROUP BY
         p.id,
         p.pilot_name,
         p.photo_url

      ORDER BY duration DESC

      LIMIT 1
      `);

    // =================================================
    // AMA COVERAGE
    // =================================================

    const [coverageRows]: any = await pool.query(`
      SELECT
        COUNT(DISTINCT ama_id) AS covered
      FROM drone_flight_history
    `);

    const [amaRows]: any = await pool.query(`
      SELECT COUNT(*) AS total
      FROM amas
    `);

    return NextResponse.json({
      total_pilots: pilotRows[0]?.total_pilots || 0,

      active_pilots: activeRows[0]?.active_pilots || 0,

      total_hours: (Number(durationRows[0]?.total_duration || 0) / 60).toFixed(
        1
      ),

      top_pilot: topPilotRows[0]
        ? {
            ...topPilotRows[0],

            total_hours: (
              Number(topPilotRows[0].total_duration || 0) / 60
            ).toFixed(1),
          }
        : null,

      flight_hours_leader: flightHoursLeaderRows[0] || null,

      ama_coverage: {
        covered: coverageRows[0]?.covered || 0,

        total: amaRows[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed fetch pilot summary",
      },
      {
        status: 500,
      }
    );
  }
}
