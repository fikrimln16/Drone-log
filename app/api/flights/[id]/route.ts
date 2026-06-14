import { NextResponse } from "next/server";

import pool from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// GET
// =====================================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.query(
      `
      SELECT
        f.*,

        a.ama_name,
        a.latitude,
        a.longitude,
        a.status,

        GROUP_CONCAT(
          DISTINCT p.id
          ORDER BY p.id
          SEPARATOR ','
        ) AS pilot_ids,

        GROUP_CONCAT(
          DISTINCT p.pilot_name
          ORDER BY p.id
          SEPARATOR '|'
        ) AS pilot_names,

        GROUP_CONCAT(
          DISTINCT COALESCE(
            p.photo_url,
            ''
          )
          ORDER BY p.id
          SEPARATOR '|'
        ) AS pilot_photos

      FROM drone_flight_history f

      LEFT JOIN amas a
        ON a.id = f.ama_id

      LEFT JOIN flight_pilots fp
        ON fp.flight_id = f.id

      LEFT JOIN pilots p
        ON p.id = fp.pilot_id

      WHERE f.flight_id = ?

      GROUP BY
        f.id,
        a.ama_name,
        a.latitude,
        a.longitude,
        a.status
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: "Flight not found",
        },
        {
          status: 404,
        }
      );
    }

    const row = rows[0];

    const pilotIds = row.pilot_ids ? row.pilot_ids.split(",") : [];

    const pilotNames = row.pilot_names ? row.pilot_names.split("|") : [];

    const pilotPhotos = row.pilot_photos ? row.pilot_photos.split("|") : [];

    const pilots = pilotNames.map((name: string, index: number) => ({
      id: Number(pilotIds[index]),

      name,

      photo_url: pilotPhotos[index] || null,
    }));

    const flight = {
      ...row,

      pilots,
    };

    delete flight.pilot_ids;
    delete flight.pilot_names;
    delete flight.pilot_photos;

    return NextResponse.json(flight);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE
// =====================================================

export async function DELETE(req: Request, { params }: Params) {
  const connection = await pool.getConnection();

  try {
    const { id } = await params;

    await connection.beginTransaction();

    // ==========================================
    // DELETE FLIGHT PILOTS
    // ==========================================

    await connection.query(
      `
      DELETE FROM flight_pilots
      WHERE flight_id = ?
      `,
      [id]
    );

    // ==========================================
    // DELETE FLIGHT
    // ==========================================

    await connection.query(
      `
      DELETE FROM drone_flight_history
      WHERE id = ?
      `,
      [id]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Flight deleted successfully",
    });
  } catch (err) {
    await connection.rollback();

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
  } finally {
    connection.release();
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
