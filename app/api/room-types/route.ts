// app/api/room-types/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

// GET -> list room types
export async function GET(_: Request) {
  try {
    const rows = await run("SELECT * FROM room_types ORDER BY created_at DESC");
    return NextResponse.json({ ok: true, room_types: rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

// POST -> create a new room type
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price_per_night = 0, price_per_hour = 0, currency = "PKR" } = body;

    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });
    }

    const insertQ = `
      INSERT INTO room_types (name, price_per_night, price_per_hour, currency)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
    const rows = await run(insertQ, [name, price_per_night, price_per_hour, currency]);
    const roomType = rows && rows[0];
    return NextResponse.json({ ok: true, room_type: roomType });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

// DELETE -> delete a room type by ?id=...
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    // You may want to prevent deletion if rooms exist for this type. For now we delete.
    const rows = await run("DELETE FROM room_types WHERE id = $1 RETURNING *", [id]);
    if (!rows || rows.length === 0) return NextResponse.json({ ok: false, error: "Type not found" }, { status: 404 });
    return NextResponse.json({ ok: true, deleted: rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
