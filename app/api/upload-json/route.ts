import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await pool.getConnection();

  try {
    const body = await req.json();

    const flights = body.flights || [];

    await connection.beginTransaction();

    for (const flight of flights) {
      // =====================================
      // PILOT
      // =====================================

      const [day, month, year] = flight.flight_date.split("/");

      const mysqlDate = `${year}-${month}-${day}`;

      // =====================================
      // INSERT FLIGHT
      // =====================================

      const [flightResult]: any = await connection.query(
        `
          INSERT INTO drone_flight_history
          (
            flight_date,
            ama_id,
            estate,
            flight_id,
            mission_name,
            uav_unit,
            battery_id,
            battery_id_2,
            battery_color,
            start_percent,
            end_percent,
            start_volt,
            end_volt,
            start_time,
            end_time,
            duration_min,
            notes
          )
          VALUES
          (
            ?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?
          )
          `,
        [
          mysqlDate,

          flight.ama_id,

          flight.estate,

          flight.flight_id,

          flight.mission_name,

          flight.uav_unit,

          flight.battery_id,

          flight.battery_id_2,

          flight.battery_color,

          Number(flight.start_percent || 0),

          Number(flight.end_percent || 0),

          Number(flight.start_volt || 0),

          Number(flight.end_volt || 0),

          flight.start_time,

          flight.end_time,

          Number(flight.duration_min || 0),

          flight.notes || "",
        ]
      );

      // =====================================
      // RELATION PILOT
      // =====================================

      const pilotNames = String(flight.pilot || "")
        .split("_")
        .map((pilot: string) => pilot.trim())
        .filter(Boolean);

      for (const pilotName of pilotNames) {
        let pilotId = flight.pilot_mapping?.[pilotName];

        // create new pilot
        if (!pilotId && flight.new_pilot_mapping?.[pilotName]) {
          const [newPilot]: any = await connection.query(
            `
        INSERT INTO pilots
        (
          pilot_name
        )
        VALUES (?)
        `,
            [flight.new_pilot_mapping[pilotName]]
          );

          pilotId = newPilot.insertId;
        }

        if (!pilotId) continue;

        await connection.query(
          `
    INSERT INTO flight_pilots
    (
      flight_id,
      pilot_id
    )
    VALUES (?, ?)
    `,
          [flightResult.insertId, pilotId]
        );
      }
    }

    await connection.commit();

    return NextResponse.json({
      success: true,

      total: flights.length,

      message: "CSV uploaded successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed upload CSV",
      },
      {
        status: 500,
      }
    );
  } finally {
    connection.release();
  }
}
