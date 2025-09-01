// app/api/rooms/[id]/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    const rows = await run("SELECT * FROM rooms WHERE id = $1", [params.id]);
    if (!rows || rows.length === 0) return NextResponse.json({ ok: false, error: "Room not found" }, { status: 404 });
    return NextResponse.json({ ok: true, room: rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const { number, type, status, capacity, price, description } = body;

    const q = `
      UPDATE rooms SET
        number = COALESCE($1, number),
        type = COALESCE($2, type),
        status = COALESCE($3, status),
        capacity = COALESCE($4, capacity),
        price = COALESCE($5, price),
        description = COALESCE($6, description),
        updated_at = now()
      WHERE id = $7
      RETURNING *
    `;
    const rows = await run(q, [number, type, status, capacity, price, description, params.id]);
    if (!rows || rows.length === 0) return NextResponse.json({ ok: false, error: "Room not found" }, { status: 404 });
    return NextResponse.json({ ok: true, room: rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const rows = await run("DELETE FROM rooms WHERE id = $1 RETURNING *", [params.id]);
    if (!rows || rows.length === 0) return NextResponse.json({ ok: false, error: "Room not found" }, { status: 404 });
    return NextResponse.json({ ok: true, deleted: rows[0] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
