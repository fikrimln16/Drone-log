import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// STATIC AMA COORDINATE
// =====================================================

const amaCoordinates = [
  {
    id: 1,
    ama: "AMA Bingin Teluk",
    lat: -2.569967,
    lng: 103.168351,
  },

  {
    id: 2,
    ama: "AMA Cengal",
    lat: -3.553549,
    lng: 105.470785,
  },

  {
    id: 3,
    ama: "AMA Jade",
    lat: -2.850807,
    lng: 103.52976,
  },

  {
    id: 4,
    ama: "AMA Kalimantan",
    lat: -0.543643,
    lng: 116.069133,
  },

  {
    id: 5,
    ama: "AMA Lahat",
    lat: -3.595873,
    lng: 103.420648,
  },

  {
    id: 6,
    ama: "AMA Lima Puluh",
    lat: 2.706834,
    lng: 99.577975,
  },

  {
    id: 7,
    ama: "AMA Muara Rupit",
    lat: -2.851498,
    lng: 103.147847,
  },

  {
    id: 8,
    ama: "AMA Muba",
    lat: -2.168799,
    lng: 103.999873,
  },

  {
    id: 9,
    ama: "AMA Serdang",
    lat: 3.49346,
    lng: 98.259986,
  },

  // =====================================================
  // AMA JAWA SULAWESI
  // =====================================================

  {
    id: 10,
    ama: "AMA Jawa Sulawesi",
    lat: -5.378066,
    lng: 120.264838,
  },

  {
    id: 11,
    ama: "AMA Jawa Sulawesi",
    lat: 1.314755,
    lng: 124.518329,
  },

  {
    id: 12,
    ama: "AMA Jawa Sulawesi",
    lat: -8.384731,
    lng: 113.977272,
  },

  {
    id: 13,
    ama: "AMA Jawa Sulawesi",
    lat: -7.213137,
    lng: 107.651061,
  },
];

// =====================================================
// GET
// =====================================================

export async function GET() {
  try {
    // DATABASE STATS
    const [rows]: any = await pool.query(`
      SELECT
        ama,

        COUNT(*) as total_flights,

        COUNT(DISTINCT mission_name) as total_missions,

        MAX(flight_date) as latest_flight,

        GROUP_CONCAT(DISTINCT mission_name) as missions

      FROM drone_flight_history

      WHERE ama IS NOT NULL
        AND ama != ''

      GROUP BY ama
    `);

    // =====================================================
    // MERGE STATIC AMA + DATABASE
    // =====================================================

    const result = amaCoordinates.map((amaItem) => {
      const dbData = rows.find(
        (row: any) => row.ama === amaItem.ama
      );

      return {
        id: amaItem.id,

        ama: amaItem.ama,

        lat: amaItem.lat,

        lng: amaItem.lng,

        total_flights:
          dbData?.total_flights || 0,

        total_missions:
          dbData?.total_missions || 0,

        latest_flight:
          dbData?.latest_flight || null,

        missions: dbData?.missions
          ? dbData.missions.split(",")
          : [],
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed fetch map data",
      },
      {
        status: 500,
      }
    );
  }
}