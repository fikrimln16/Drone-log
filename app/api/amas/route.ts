import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// GET
// =====================================================

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.id,
        a.ama_name,
        a.status,

        -- NEW COLUMN
        a.planning_date,
        a.actual_date,

        a.latitude,
        a.longitude,

        COUNT(f.id) AS total_flights,

        COUNT(DISTINCT f.mission_name) AS total_missions,

        COUNT(DISTINCT f.estate) AS total_estates,

        COUNT(DISTINCT f.pilot) AS total_pilots,

        -- LAST FLIGHT
        MAX(f.flight_date) AS last_flight

      FROM amas a

      LEFT JOIN drone_flight_history f
        ON f.ama = a.ama_name

      GROUP BY
        a.id,
        a.ama_name,
        a.status,
        a.planning_date,
        a.actual_date,
        a.latitude,
        a.longitude

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
