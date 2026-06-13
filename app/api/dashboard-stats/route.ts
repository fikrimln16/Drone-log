import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // =====================================================
    // GROWTH CALCULATION
    // =====================================================

    function calculateGrowth(current: number, previous: number) {
      if (previous === 0) return 0;

      return Number((((current - previous) / previous) * 100).toFixed(1));
    }

    // =====================================================
    // MAIN STATS
    // =====================================================

    const [statsRows]: any = await pool.query(`
        SELECT
          COUNT(DISTINCT mission_name) AS total_missions,
          COUNT(*) AS total_flights,
          SUM(duration_min) AS total_duration,
          AVG(duration_min) AS avg_duration
        FROM drone_flight_history
      `);

    // =====================================================
    // ACTIVE FLIGHTS TODAY
    // =====================================================

    const [activeRows]: any = await pool.query(`
        SELECT COUNT(*) AS active_flights
        FROM drone_flight_history
        WHERE DATE(flight_date)=CURDATE()
      `);

    // =====================================================
    // ACTIVE FLIGHT LIST
    // =====================================================

    const [activeFlightRows]: any = await pool.query(`
        SELECT
          f.*,

          a.ama_name AS ama,

          a.latitude,

          a.longitude,

          a.status AS ama_status,

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
        
        WHERE DATE(f.flight_date)=CURDATE()

        GROUP BY f.id

        ORDER BY f.id DESC
      `);

    // =====================================================
    // LOW BATTERY ALERT
    // =====================================================

    const [batteryRows]: any = await pool.query(`
        SELECT COUNT(*) AS battery_alerts
        FROM drone_flight_history
        WHERE
          DATE(flight_date)=CURDATE()
          AND end_percent <= 20
      `);

    // =====================================================
    // LOW BATTERY LIST
    // =====================================================

    const [lowBatteryToday]: any = await pool.query(`
        SELECT
          flight_id,
          battery_id,
          end_percent
        FROM drone_flight_history
        WHERE
          DATE(flight_date)=CURDATE()
          AND end_percent <= 20
        ORDER BY end_percent ASC
        LIMIT 3
      `);

    // =====================================================
    // MOST ACTIVE MISSION
    // =====================================================

    const [missionRows]: any = await pool.query(`
        SELECT
          mission_name,
          COUNT(*) AS total
        FROM drone_flight_history
        GROUP BY mission_name
        ORDER BY total DESC
        LIMIT 1
      `);

    // =====================================================
    // LATEST UPLOAD
    // =====================================================

    const [uploadRows]: any = await pool.query(`
        SELECT
          MAX(created_at) AS latest_upload
        FROM drone_flight_history
      `);

    // =====================================================
    // CURRENT MONTH
    // =====================================================

    const [currentFlights]: any = await pool.query(`
        SELECT COUNT(*) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) = MONTH(CURDATE())
          AND YEAR(flight_date) = YEAR(CURDATE())
      `);

    const [currentDuration]: any = await pool.query(`
        SELECT SUM(duration_min) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) = MONTH(CURDATE())
          AND YEAR(flight_date) = YEAR(CURDATE())
      `);

    const [currentMission]: any = await pool.query(`
        SELECT COUNT(DISTINCT mission_name) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) = MONTH(CURDATE())
          AND YEAR(flight_date) = YEAR(CURDATE())
      `);

    const [currentAvg]: any = await pool.query(`
        SELECT AVG(duration_min) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) = MONTH(CURDATE())
          AND YEAR(flight_date) = YEAR(CURDATE())
      `);

    // =====================================================
    // PREVIOUS MONTH
    // =====================================================

    const [previousFlights]: any = await pool.query(`
        SELECT COUNT(*) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) =
          MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND YEAR(flight_date) =
          YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      `);

    const [previousDuration]: any = await pool.query(`
        SELECT SUM(duration_min) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) =
          MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND YEAR(flight_date) =
          YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      `);

    const [previousMission]: any = await pool.query(`
        SELECT COUNT(DISTINCT mission_name) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) =
          MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND YEAR(flight_date) =
          YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      `);

    const [previousAvg]: any = await pool.query(`
        SELECT AVG(duration_min) AS total
        FROM drone_flight_history
        WHERE MONTH(flight_date) =
          MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
        AND YEAR(flight_date) =
          YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      `);

    // =====================================================
    // TOP PILOT
    // =====================================================

    const [topPilotRows]: any = await pool.query(`
      SELECT
        p.id,

        p.pilot_name AS pilot,

        p.photo_url,

        COUNT(
          DISTINCT fp.flight_id
        ) AS flights,

        COALESCE(
          SUM(f.duration_min),
          0
        ) AS duration,

        COUNT(
          DISTINCT f.mission_name
        ) AS missions

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
        duration DESC,
        flights DESC

      LIMIT 1
      `);

    const [pilotCountRows]: any = await pool.query(`
        SELECT COUNT(*) AS total_pilots
        FROM pilots
      `);

    const [uavRows]: any = await pool.query(`
        SELECT COUNT(DISTINCT uav_unit) AS total_uavs
        FROM drone_flight_history
      `);

    const formattedActiveFlights = activeFlightRows.map((item: any) => ({
      ...item,

      pilots: item.pilots ? item.pilots.split(", ") : [],
    }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      // MAIN STATS
      total_missions: statsRows[0]?.total_missions || 0,

      total_flights: statsRows[0]?.total_flights || 0,

      total_duration: statsRows[0]?.total_duration || 0,

      avg_duration: Number(
        parseFloat(statsRows[0]?.avg_duration || 0).toFixed(1)
      ),

      // ACTIVE
      active_flight_list: formattedActiveFlights || [],

      // BATTERY
      battery_alerts: batteryRows[0]?.battery_alerts || 0,

      low_battery_flights: lowBatteryToday || [],

      // MOST ACTIVE
      most_active_mission: missionRows[0]?.mission_name || "-",

      // UPLOAD
      latest_upload: uploadRows[0]?.latest_upload || null,

      // GROWTH
      mission_growth: calculateGrowth(
        currentMission[0]?.total || 0,
        previousMission[0]?.total || 0
      ),

      flight_growth: calculateGrowth(
        currentFlights[0]?.total || 0,
        previousFlights[0]?.total || 0
      ),

      duration_growth: calculateGrowth(
        currentDuration[0]?.total || 0,
        previousDuration[0]?.total || 0
      ),

      avg_growth: calculateGrowth(
        currentAvg[0]?.total || 0,
        previousAvg[0]?.total || 0
      ),

      // TOP PILOT
      top_pilot: topPilotRows[0] || null,

      total_pilots: pilotCountRows[0]?.total_pilots || 0,

      total_uavs: uavRows[0]?.total_uavs || 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Database Error",
      },
      {
        status: 500,
      }
    );
  }
}
