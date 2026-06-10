import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// GET
// =====================================================

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
  SELECT
    a.id,

    a.ama_name,

    a.status,

    a.latitude,

    a.longitude,

    a.planning_date,

    a.actual_date,

    COUNT(f.id) AS total_flights,

    COUNT(DISTINCT f.mission_name) AS total_missions,

    MAX(f.flight_date) AS latest_flight,

    GROUP_CONCAT(
      DISTINCT f.mission_name
      SEPARATOR ','
    ) AS missions

  FROM amas a

  LEFT JOIN drone_flight_history f
    ON f.ama_id = a.id

  GROUP BY
    a.id,
    a.ama_name,
    a.status,
    a.latitude,
    a.longitude,
    a.planning_date,
    a.actual_date

  ORDER BY a.id DESC
`);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}

// =====================================================
// POST
// =====================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      ama_name,
      status,
      latitude,
      longitude,
      planning_date,
      actual_date,
    } = body;

    await pool.query(
      `
      INSERT INTO amas
      (
        ama_name,
        status,
        latitude,
        longitude,
        planning_date,
        actual_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        ama_name,

        status,

        Number(latitude),

        Number(longitude),

        planning_date || null,

        actual_date || null,
      ]
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
