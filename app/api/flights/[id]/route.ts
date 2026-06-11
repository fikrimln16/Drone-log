import { NextResponse } from "next/server";

import pool from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// DELETE
// =====================================================

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    await pool.query(
      `
      DELETE FROM drone_flight_history
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,

      message: "Flight deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,

        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE
// =====================================================

export async function PUT(req: Request, { params }: Params) {
  const connection = await pool.getConnection();

  try {
    const { id } = await params;

    const body = await req.json();

    // ==========================================
    // FORMAT DATETIME
    // ==========================================

    const startDateTime = body.start_time
      ? `${body.flight_date} ${body.start_time}:00`
      : null;

    const endDateTime = body.end_time
      ? `${body.flight_date} ${body.end_time}:00`
      : null;

    await connection.beginTransaction();

    // ==========================================
    // UPDATE FLIGHT
    // ==========================================

    await connection.query(
      `
      UPDATE drone_flight_history
      SET
        flight_date = ?,
        ama = ?,
        ama_id = ?,
        estate = ?,
        uav_unit = ?,
        flight_id = ?,
        mission_name = ?,
        battery_id = ?,
        battery_id_2 = ?,
        battery_color = ?,
        start_percent = ?,
        end_percent = ?,
        start_volt = ?,
        end_volt = ?,
        start_time = ?,
        end_time = ?,
        duration_min = ?,
        notes = ?
      WHERE id = ?
      `,
      [
        body.flight_date,
        body.ama,
        Number(body.ama_id),
        body.estate,
        body.uav_unit,
        body.flight_id,
        body.mission_name,
        body.battery_id,
        body.battery_id_2,
        body.battery_color,
        Number(body.start_percent),
        Number(body.end_percent),
        Number(body.start_volt),
        Number(body.end_volt),
        startDateTime,
        endDateTime,
        Number(body.duration_min),
        body.notes || "",
        Number(id),
      ]
    );

    // ==========================================
    // REFRESH PILOT RELATION
    // ==========================================

    await connection.query(
      `
      DELETE FROM flight_pilots
      WHERE flight_id = ?
      `,
      [id]
    );

    if (Array.isArray(body.pilot_ids) && body.pilot_ids.length > 0) {
      const values = body.pilot_ids.map((pilotId: number) => [
        Number(id),
        Number(pilotId),
      ]);

      await connection.query(
        `
        INSERT INTO flight_pilots
        (
          flight_id,
          pilot_id
        )
        VALUES ?
        `,
        [values]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Flight updated successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      {
        status: 500,
      }
    );
  } finally {
    connection.release();
  }
}
