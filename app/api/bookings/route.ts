// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");

    if (roomId) {
      const rows = await run("SELECT * FROM bookings WHERE room_id = $1 ORDER BY created_at DESC", [roomId]);
      return NextResponse.json({ ok: true, bookings: rows });
    }

    const all = await run("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200");
    return NextResponse.json({ ok: true, bookings: all });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, roomType, checkIn, checkOut, guests } = body;

    if (!name || !roomType || !checkIn || !checkOut) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // find an available room of that type
    const findQ = `
      SELECT r.* FROM rooms r
      WHERE r.type = $1
        AND r.status = 'available'
        AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.room_id = r.id
            AND b.status != 'cancelled'
            AND NOT (b.checkout_date <= $2 OR b.checkin_date >= $3)
        )
      LIMIT 1
    `;
    const found = await run(findQ, [roomType, checkIn, checkOut]);

    if (!found || found.length === 0) {
      return NextResponse.json({ ok: false, error: "No rooms available for selected dates" }, { status: 409 });
    }

    const room = found[0];

    // compute nights and price
    const checkin = new Date(checkIn);
    const checkout = new Date(checkOut);
    const nights = Math.max(
      0,
      Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
    );
    const roomPrice = Number(room.price ?? 0);
    const totalPrice = Math.round(roomPrice * nights * 100) / 100;

    const insertQ = `
      INSERT INTO bookings (
        guest_name, guest_email, guest_phone,
        room_id, room_number, room_type,
        checkin_date, checkout_date, status, price, currency
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;
    const bookingRows = await run(insertQ, [
      name,
      email,
      phone,
      room.id,
      room.number,
      room.type,
      checkIn,
      checkOut,
      "confirmed",
      totalPrice,
      "PKR",
    ]);
    const booking = bookingRows && bookingRows[0];

    // set room occupied
    await run("UPDATE rooms SET status = 'occupied', updated_at = now() WHERE id = $1", [room.id]);

    // notification
    await run(
      `INSERT INTO notifications (title, body, payload) VALUES ($1,$2,$3)`,
      [
        "New booking received",
        `${name} booked room ${room.number} (${room.type}) from ${checkIn} to ${checkOut}`,
        JSON.stringify({ booking, room })
      ]
    );

    return NextResponse.json({ ok: true, booking, room });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
