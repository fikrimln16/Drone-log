import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      `
      SELECT
        id,
        flight_id,
        mission_name,
        pilot,
        estate,
        duration_min,
        start_time,
        battery_id
      FROM drone_flight_history
      WHERE ama_id = ?
      ORDER BY id DESC
      `,
      [id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}
