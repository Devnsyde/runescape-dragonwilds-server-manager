import { NextResponse } from "next/server";
const dbm = require("@/lib/db");
const { loginStats } = require("@/lib/playerstats");

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/worlds/[id]/player-stats — login-streak leaderboard derived from the
// world's stored join history (sessions table). Kept off the every-5s world GET so
// the Players tab only pays for it while it's open.
export async function GET(_req, { params }) {
  const w = dbm.getWorld(params.id);
  if (!w) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  try {
    return NextResponse.json({ ok: true, stats: loginStats(w.world_id) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
