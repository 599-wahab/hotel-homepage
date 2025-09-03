// app/api/bookings/[id]/checkout/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing booking id" }, { status: 400 });
  }

  try {
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
         SET status = 'checked_out',
             actual_checkout = now(),
             updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    const updated = Array.isArray(updatedRaw) ? updatedRaw[0] : updatedRaw?.rows?.[0] ?? updatedRaw;

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Failed to update booking" }, { status: 500 });
    }

    // Optionally set room to available
    try {
      const roomId = updated.room_id ?? updated.roomId;
      if (roomId) {
        await run("UPDATE rooms SET status = 'available', updated_at = now() WHERE id = $1", [roomId]);
      }
    } catch (roomErr) {
      console.error("Warning: failed to update room status on checkout", roomErr);
    }

    return NextResponse.json({ ok: true, booking: updated });
  } catch (err: any) {
    console.error("Checkout error:", err?.stack ?? err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
