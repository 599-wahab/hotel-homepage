// app/api/bookings/[id]/checkin/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: { id: string } } // properly typed for Next app router
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing booking id" }, { status: 400 });
  }

  try {
    // run() may return different shapes depending on your db helper.
    // Cast to any so TypeScript doesn't complain; we still defensively inspect the result.
    const foundRaw: any = await run("SELECT * FROM bookings WHERE id = $1", [id]);
    const existing =
      Array.isArray(foundRaw)
        ? foundRaw[0]
        : foundRaw?.rows?.[0] ?? (foundRaw ?? null);

    if (!existing) {
      return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
    }

    const updatedRaw: any = await run(
      `UPDATE bookings
         SET status = 'checked_in',
             checkin_time = now(),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    const updated = Array.isArray(updatedRaw) ? updatedRaw[0] : updatedRaw?.rows?.[0] ?? updatedRaw;

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Failed to update booking" }, { status: 500 });
    }

    // Optionally update room status (non-fatal)
    try {
      const roomId = updated.room_id ?? updated.roomId;
      if (roomId) {
        await run("UPDATE rooms SET status = 'occupied', updated_at = now() WHERE id = $1", [roomId]);
      }
    } catch (roomErr) {
      console.error("Warning: failed to update room status on check-in", roomErr);
    }

    return NextResponse.json({ ok: true, booking: updated });
  } catch (err: any) {
    console.error("Check-in error:", err?.stack ?? err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
