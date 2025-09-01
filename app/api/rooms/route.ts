// app/api/rooms/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const available = url.searchParams.get("available");
    const roomType = url.searchParams.get("roomType");
    const checkIn = url.searchParams.get("checkIn");
    const checkOut = url.searchParams.get("checkOut");

    if (available === "true" && roomType && checkIn && checkOut) {
      const q = `
        SELECT r.* FROM rooms r
        WHERE r.type = $1
          AND r.status = 'available'
          AND NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.room_id = r.id
              AND b.status != 'cancelled'
              AND NOT (b.checkout_date <= $2 OR b.checkin_date >= $3)
          )
        LIMIT 20
      `;
      const rows = await run(q, [roomType, checkIn, checkOut]);
      return NextResponse.json({ ok: true, rooms: rows });
    }

    const resAll = await run("SELECT * FROM rooms ORDER BY created_at DESC");
    return NextResponse.json({ ok: true, rooms: resAll });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, type, capacity = 2, price = 0, description = "", status = "available" } = body;

    if (!number || !type) {
      return NextResponse.json({ ok: false, error: "Room number and type required" }, { status: 400 });
    }

    const insertQ = `
      INSERT INTO rooms (number, type, status, capacity, price, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const rows = await run(insertQ, [number, type, status, capacity, price, description]);
    const room = rows && rows[0];
    return NextResponse.json({ ok: true, room });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
