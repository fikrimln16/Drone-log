import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        id,
        ama_name,
        latitude,
        longitude
      FROM amas
      ORDER BY ama_name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed fetch AMA",
      },
      {
        status: 500,
      }
    );
  }
}