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

          a.status,

          -- =============================================
          -- PILOT INFORMATION
          -- =============================================

          GROUP_CONCAT(
            DISTINCT p.pilot_name
            ORDER BY p.pilot_name
            SEPARATOR ', '
          ) AS pilots

        FROM drone_flight_history f

        -- =============================================
        -- AMA
        -- =============================================

        LEFT JOIN amas a
          ON f.ama_id = a.id

        -- =============================================
        -- FLIGHT PILOTS
        -- =============================================

        LEFT JOIN flight_pilots fp
          ON fp.flight_id = f.id

        LEFT JOIN pilots p
          ON p.id = fp.pilot_id

        -- =============================================
        -- FILTER
        -- =============================================

        WHERE f.mission_name = ?

        -- =============================================
        -- GROUP
        -- =============================================

        GROUP BY
          f.id,
          a.ama_name,
          a.latitude,
          a.longitude,
          a.status

        -- =============================================
        -- ORDER
        -- =============================================

        ORDER BY
          f.flight_date DESC,
          f.id DESC
        `,
      [mission]
    );

    const formatted = (rows as any[]).map((item) => ({
      ...item,

      pilots: item.pilots ? item.pilots.split(", ") : [],
    }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(formatted);
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
