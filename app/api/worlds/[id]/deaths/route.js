import { NextResponse } from "next/server";
const dbm = require("@/lib/db");
const sup = require("@/lib/supervisor");
const ue4ss = require("@/lib/ue4ss");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: recent deaths + whether the PSMDeathRelay mod / UE4SS are installed for this world.
export async function GET(_req, { params }) {
  const w = dbm.getWorld(params.id);
  if (!w) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  let ue4ssInstalled = false;
  try { ue4ssInstalled = ue4ss.detect(w.install_dir).installed; } catch {}
  return NextResponse.json({
    ok: true,
    deaths: dbm.listDeaths(params.id, 100),
    counts: dbm.deathCounts(params.id, 50),
    modInstalled: sup.deathModInstalled(w.install_dir),
    ue4ssInstalled,
    bundledAvailable: !!sup.bundledDeathModDir(),
  });
}

// POST: install the bundled PSMDeathRelay UE4SS mod into this world's server.
export async function POST(_req, { params }) {
  const w = dbm.getWorld(params.id);
  if (!w) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  if (sup.isRunning(params.id)) return NextResponse.json({ ok: false, error: "Stop the server before changing mods." }, { status: 409 });
  try {
    const res = sup.installDeathMod(w.install_dir);
    dbm.logEvent(params.id, "mods", "Installed death tracking mod (PSMDeathRelay)");
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

// DELETE: remove the death relay mod (escape hatch if a Palworld update breaks it).
export async function DELETE(_req, { params }) {
  const w = dbm.getWorld(params.id);
  if (!w) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  if (sup.isRunning(params.id)) return NextResponse.json({ ok: false, error: "Stop the server before changing mods." }, { status: 409 });
  try {
    const res = sup.uninstallDeathMod(w.install_dir);
    dbm.logEvent(params.id, "mods", "Removed death tracking mod (PSMDeathRelay)");
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
