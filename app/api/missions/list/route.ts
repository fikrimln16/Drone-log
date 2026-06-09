import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT DISTINCT mission_name
      FROM drone_flight_history
      WHERE mission_name IS NOT NULL
      AND mission_name != ''
      ORDER BY mission_name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}
