import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      mission: string;
    }>;
  }
) {
  try {
    // =====================================================
    // PARAMS
    // =====================================================

    const { mission } = await context.params;

    // =====================================================
    // QUERY
    // =====================================================

    const [rows] = await pool.query(
      `
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
      -- FILTER
      -- =============================================

      WHERE f.mission_name = ?

      -- =============================================
      -- ORDER
      -- =============================================

      ORDER BY f.flight_date DESC
      `,
      [mission]
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Error fetch mission detail",
      },
      {
        status: 500,
      }
    );
  }
}
