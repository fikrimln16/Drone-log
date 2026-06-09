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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { ama_name, status, latitude, longitude } = body;

    await pool.query(
      `
      INSERT INTO amas
      (
        ama_name,
        status,
        latitude,
        longitude
      )
      VALUES (?, ?, ?, ?)
      `,
      [ama_name, status, Number(latitude), Number(longitude)]
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
