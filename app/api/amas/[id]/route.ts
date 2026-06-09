import { NextResponse } from "next/server";

import pool from "@/lib/db";

// =====================================================
// UPDATE AMA STATUS
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

    const { status } = body;

    // =================================================
    // UPDATE STATUS ONLY
    // =================================================

    await pool.query(
      `
      UPDATE amas
      SET
        status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    return NextResponse.json({
      success: true,

      message: "AMA status updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed update AMA status",
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
