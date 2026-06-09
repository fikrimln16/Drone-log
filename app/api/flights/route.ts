import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // =====================================================
    // QUERY
    // =====================================================

    const [rows] = await pool.query(`
      SELECT
        f.*,

        -- =============================================
        -- AMA INFORMATION
        -- =============================================

        a.ama_name AS ama,

        a.latitude,

        a.longitude,

        a.status

      FROM drone_flight_history f

      -- =============================================
      -- JOIN AMA
      -- =============================================

      LEFT JOIN amas a
      ON f.ama_id = a.id

      -- =============================================
      -- ORDER
      -- =============================================

      ORDER BY f.id DESC
    `);

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Database Error",
      },
      {
        status: 500,
      }
    );
  }
}
