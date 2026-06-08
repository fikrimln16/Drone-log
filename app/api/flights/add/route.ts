import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      flight_date,
      ama,
      estate,
      pilot,
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

    await pool.query(
      `
      INSERT INTO drone_flight_history
      (
        flight_date,
        ama,
        estate,
        pilot,
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
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        flight_date,
        ama,
        estate,
        pilot,
        flight_id,
        mission_name,
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
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Flight created successfully",
    });
  } catch (error) {
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
  }
}