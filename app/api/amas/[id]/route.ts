import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(date: string | null) {
  if (!date) return null;

  return new Date(date).toISOString().split("T")[0];
}

// =====================================================
// UPDATE AMA
// =====================================================

export async function PUT(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const { status, planning_date, actual_date } = body;

    // =================================================
    // VALIDATION
    // =================================================

    const allowedStatus = ["WAITING", "NEXT", "ONGOING", "SUCCESS"];

    if (status && !allowedStatus.includes(status.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid AMA status",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FORMAT DATE
    // =================================================

    const formattedPlanningDate = formatDate(planning_date);

    let formattedActualDate = formatDate(actual_date);

    // =================================================
    // AUTO RESET ACTUAL DATE
    // =================================================

    if (status?.toUpperCase() === "WAITING") {
      formattedActualDate = null;
    }

    // =================================================
    // UPDATE QUERY
    // =================================================

    await pool.query(
      `
      UPDATE amas
      SET
        status = ?,
        planning_date = ?,
        actual_date = ?
      WHERE id = ?
      `,
      [status, formattedPlanningDate, formattedActualDate, id]
    );

    return NextResponse.json({
      success: true,

      message: "AMA updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed update AMA",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE AMA
// =====================================================

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    await pool.query(
      `
      DELETE FROM amas
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,

      message: "AMA deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed delete AMA",
      },
      {
        status: 500,
      }
    );
  }
}
