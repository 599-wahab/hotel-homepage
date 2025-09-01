// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unread") === "true";
    const q = unreadOnly
      ? "SELECT * FROM notifications WHERE read = false ORDER BY created_at DESC LIMIT 50"
      : "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 200";
    const rows = await run(q);
    return NextResponse.json({ ok: true, notifications: rows });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, markAll } = body;
    if (markAll) {
      await run("UPDATE notifications SET read = true WHERE read = false");
      return NextResponse.json({ ok: true });
    }
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    await run("UPDATE notifications SET read = true WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
