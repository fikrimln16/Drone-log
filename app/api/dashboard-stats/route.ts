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

          a.status AS ama_status

        FROM drone_flight_history f

        LEFT JOIN amas a
        ON a.id = f.ama_id

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
          pilot,
          COUNT(*) AS flights,
          SUM(duration_min) AS duration,
          MAX(mission_name) AS mission
        FROM drone_flight_history
        WHERE pilot IS NOT NULL
          AND pilot != ''
        GROUP BY pilot
        ORDER BY duration DESC
        LIMIT 1
      `);

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
      active_flights: activeRows[0]?.active_flights || 0,

      active_flight_list: activeFlightRows || [],

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
