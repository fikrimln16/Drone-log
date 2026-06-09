import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);

    for (const item of body) {
      await pool.query(
        `
        INSERT INTO drone_flight_history (
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
          ama_id
        )
        VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [
          item.flight_date,

          item.ama,

          item.estate,

          item.pilot,

          item.flight_id,

          item.mission_name,

          item.battery_id,

          item.battery_id_2,

          item.battery_color,

          item.start_percent,

          item.end_percent,

          item.start_volt,

          item.end_volt,

          item.start_time,

          item.end_time,

          item.duration_min,

          item.notes || "",

          item.ama_id,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "CSV uploaded successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
