import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const connection = await pool.getConnection();

  try {
    const body = await req.json();

    const flights = body.flights || [];

    if (!Array.isArray(flights) || flights.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No flight data found in uploaded CSV.",
        },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    for (let index = 0; index < flights.length; index++) {
      const flight = flights[index];

      // =====================================
      // VALIDATION
      // =====================================

      if (!flight.flight_id) {
        throw new Error(`Row ${index + 1}: Flight ID is required.`);
      }

      if (!flight.flight_date) {
        throw new Error(`Row ${index + 1}: Flight Date is required.`);
      }

      if (!flight.ama_id) {
        throw new Error(`Row ${index + 1}: AMA has not been mapped.`);
      }

      if (!flight.mission_name) {
        throw new Error(`Row ${index + 1}: Mission Name is required.`);
      }

      // =====================================
      // DUPLICATE FLIGHT CHECK
      // =====================================

      const [existingFlight]: any = await connection.query(
        `
        SELECT id
        FROM drone_flight_history
        WHERE flight_id = ?
        LIMIT 1
        `,
        [flight.flight_id]
      );

      if (existingFlight.length > 0) {
        throw new Error(`Flight ID "${flight.flight_id}" already exists.`);
      }

      // =====================================
      // DATE FORMAT
      // =====================================

      const [day, month, year] = String(flight.flight_date).split("/");

      if (!day || !month || !year) {
        throw new Error(
          `Flight "${flight.flight_id}" has invalid date format. Expected DD/MM/YYYY.`
        );
      }

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
      // PILOT RELATION
      // =====================================

      const pilotNames = String(flight.pilot || "")
        .split("_")
        .map((pilot: string) => pilot.trim())
        .filter(Boolean);

      if (pilotNames.length === 0) {
        throw new Error(
          `Flight "${flight.flight_id}" does not have any pilot assigned.`
        );
      }

      for (const pilotName of pilotNames) {
        let pilotId = flight.pilot_mapping?.[pilotName];

        // =====================================
        // CREATE NEW PILOT
        // =====================================

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

        if (!pilotId) {
          throw new Error(`Pilot "${pilotName}" has not been mapped.`);
        }

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
      message: `${flights.length} flights uploaded successfully.`,
    });
  } catch (error: any) {
    await connection.rollback();

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          error?.message ||
          error?.sqlMessage ||
          "Unexpected server error occurred.",
      },
      {
        status: 400,
      }
    );
  } finally {
    connection.release();
  }
}
