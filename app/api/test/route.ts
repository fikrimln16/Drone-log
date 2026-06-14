import pool from "@/lib/db";

export async function GET() {
  console.log(process.env.DB_HOST);
  console.log("TEST");

  return Response.json({
    host: process.env.DB_HOST,
  });
}
