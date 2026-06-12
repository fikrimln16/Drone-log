import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      `
      SELECT
        f.id,

        f.flight_id,

        f.flight_date,

        f.mission_name,

        f.estate,

        f.uav_unit,

        f.duration_min,

        f.battery_id,

        f.end_percent,

        GROUP_CONCAT(
          DISTINCT p.pilot_name
          ORDER BY p.pilot_name
          SEPARATOR ', '
        ) AS pilots

      FROM drone_flight_history f

      LEFT JOIN flight_pilots fp
      ON fp.flight_id = f.id

      LEFT JOIN pilots p
      ON p.id = fp.pilot_id

      WHERE f.ama_id = ?

      GROUP BY
        f.id,
        f.flight_id,
        f.flight_date,
        f.mission_name,
        f.estate,
        f.uav_unit,
        f.duration_min,
        f.battery_id,
        f.end_percent

      ORDER BY
        f.flight_date DESC,
        f.id DESC
      `,
      [id]
    );

    const formatted = rows.map((item: any) => ({
      ...item,

      pilots: item.pilots ? item.pilots.split(", ").filter(Boolean) : [],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);

    return NextResponse.json([], {
      status: 500,
    });
  }
}
