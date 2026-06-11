import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        id,
        pilot_name
      FROM pilots
      WHERE status = 'ACTIVE'
      ORDER BY pilot_name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}
