import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function POST(req: Request) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const body = await req.json();

    const {
      flight_date,
      ama,
      ama_id,
      estate,

      pilot_ids,

      uav_unit,

      flight_id,
      mission_name,
      battery_id,
      battery_id_2,
      battery_color,
      start_percent,
      end_percent,
      start_volt,
      end_volt,
      start_time,
      end_time,
      duration_min,
      notes,
    } = body;

    // ============================================
    // INSERT FLIGHT
    // ============================================

    const [result]: any = await connection.query(
      `
      INSERT INTO drone_flight_history
      (
        flight_date,
        ama,
        estate,
        flight_id,
        mission_name,
        uav_unit,
        battery_id,
        battery_id_2,
        battery_color,
        start_percent,
        end_percent,
        start_volt,
        end_volt,
        start_time,
        end_time,
        duration_min,
        notes,
        ama_id
      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        flight_date,
        ama,
        estate,
        flight_id,
        mission_name,

        uav_unit,

        battery_id,
        battery_id_2,
        battery_color,

        Number(start_percent),
        Number(end_percent),

        Number(start_volt),
        Number(end_volt),

        start_time,
        end_time,

        Number(duration_min),

        notes || "",

        Number(ama_id),
      ]
    );

    const flightHistoryId = result.insertId;

    // ============================================
    // INSERT PILOTS
    // ============================================

    if (Array.isArray(pilot_ids) && pilot_ids.length > 0) {
      const values = pilot_ids.map((pilotId: number) => [
        flightHistoryId,
        pilotId,
      ]);

      await connection.query(
        `
    INSERT INTO flight_pilots
    (
      flight_id,
      pilot_id
    )
    VALUES ?
    `,
        [values]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Flight created successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed create flight",
      },
      {
        status: 500,
      }
    );
  } finally {
    connection.release();
  }
}
