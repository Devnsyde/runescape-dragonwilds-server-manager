"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { api, Icon, toast } from "@/components/ui";

// Relative "time ago" for a unix-ms timestamp, e.g. "3d ago". Falls back to an absolute
// date for anything older than ~a month so long-dormant players still read cleanly.
function timeAgo(ts, t) {
  if (!ts) return t("players.neverSeen");
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return t("players.justNow");
  const m = Math.floor(s / 60);
  if (m < 60) return t("players.minsAgo", { n: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("players.hoursAgo", { n: h });
  const d = Math.floor(h / 24);
  if (d < 30) return t("players.daysAgo", { n: d });
  return new Date(ts).toLocaleDateString();
}

export default function PlayersPanel({ worldId, players, onChange }) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(null);
  const [stats, setStats] = useState(null);
  const list = players?.players || [];

  const loadStats = useCallback(async () => {
    try { const r = await api(`/api/worlds/${worldId}/player-stats`); setStats(r.stats || []); }
    catch { /* leave whatever we had; the section just won't update this tick */ }
  }, [worldId]);

  // The leaderboard reads from the DB, so it refreshes on its own cadence (independent of
  // the live-player poll) and right after a kick/ban changes who's around.
  useEffect(() => {
    loadStats();
    const iv = setInterval(loadStats, 20000);
    return () => clearInterval(iv);
  }, [loadStats]);

  const act = async (command, userid, name) => {
    setBusy(userid);
    try {
      await api(`/api/worlds/${worldId}/rest`, { method: "POST", body: { command, userid } });
      toast(command === "kick" ? t("players.kicked", { name }) : command === "ban" ? t("players.banned", { name }) : `${name} ${command}`, "success");
      setTimeout(onChange, 700);
      setTimeout(loadStats, 900);
    } catch (e) { toast(e.message, "error"); }
    finally { setBusy(null); }
  };

  // Which leaderboard rows are online right now — match live players by id or name so we
  // can flag them, without a second request.
  const onlineIds = new Set();
  const onlineNames = new Set();
  for (const p of list) {
    const uid = p.userId || p.playerId || p.name;
    if (uid) onlineIds.add(String(uid));
    if (p.name) onlineNames.add(String(p.name).toLowerCase());
  }
  const isOnline = (s) =>
    onlineIds.has(String(s.id)) || onlineNames.has(String(s.name || "").toLowerCase());

  const headers = [t("players.name"), t("players.level"), t("players.ping"), t("players.location"), ""];

  return (
    <div style={{ display: "grid", gap: "1.6rem" }}>
      {/* Live players (online only) — kick/ban lives here */}
      <div>
        <h3 className="heading" style={{ fontSize: "1rem", margin: "0 0 0.6rem" }}>{t("players.onlineTitle")}</h3>
        {!list.length ? (
          <p className="subtle" style={{ fontWeight: 700, padding: "0.25rem 0" }}>{t("players.none")}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  {headers.map((h, i) => (
                    <th key={i} className="subtle" style={{ padding: "0.4rem 0.6rem", fontFamily: "var(--font-display)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((p) => {
                  const uid = p.userId || p.playerId || p.name;
                  return (
                    <tr key={uid} style={{ borderTop: "1.5px solid var(--line)" }}>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 800 }}>
                        {p.name}
                        <div className="subtle" style={{ fontSize: "0.68rem", fontWeight: 700 }}>{p.accountName || p.userId || ""}</div>
                      </td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 700 }}>{p.level ?? "—"}</td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 700 }}>{p.ping != null ? Math.round(p.ping) + " ms" : "—"}</td>
                      <td style={{ padding: "0.55rem 0.6rem" }} className="subtle">
                        {p.location_x != null ? `${Math.round(p.location_x)}, ${Math.round(p.location_y)}` : "—"}
                      </td>
                      <td style={{ padding: "0.55rem 0.6rem", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button className="btn btn-ghost" style={{ padding: "0.3rem 0.6rem", marginRight: 6 }} disabled={busy === uid} onClick={() => act("kick", uid, p.name)}>{t("players.kick")}</button>
                        <button className="btn btn-danger" style={{ padding: "0.3rem 0.6rem" }} disabled={busy === uid} onClick={() => act("ban", uid, p.name)}>{t("players.ban")}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Player activity — everyone who has ever joined, ranked by login streak. Reads from
          stored history, so it renders even while the world is stopped. */}
      <div>
        <h3 className="heading" style={{ fontSize: "1rem", margin: "0 0 0.2rem" }}>{t("players.activityTitle")}</h3>
        <p className="subtle" style={{ fontWeight: 600, fontSize: "0.76rem", margin: "0 0 0.7rem" }}>{t("players.activityDesc")}</p>
        {stats && stats.length === 0 ? (
          <p className="subtle" style={{ fontWeight: 700, padding: "0.25rem 0" }}>{t("players.noHistory")}</p>
        ) : !stats ? (
          <p className="subtle" style={{ fontWeight: 700, padding: "0.25rem 0" }}>{t("common.loading")}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  {["#", t("players.name"), t("players.lastSeen"), t("players.currentStreak"), t("players.longestStreak"), t("players.totalLogins")].map((h, i) => (
                    <th key={i} className="subtle" style={{ padding: "0.4rem 0.6rem", fontFamily: "var(--font-display)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: i >= 3 ? "center" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => {
                  const online = isOnline(s);
                  return (
                    <tr key={s.id} style={{ borderTop: "1.5px solid var(--line)", background: i === 0 ? "var(--card-2)" : undefined }}>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 800, color: "var(--muted)", width: 28 }}>{i + 1}</td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 800 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          {online && <span title={t("players.online")} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-bright)", flexShrink: 0 }} />}
                          {s.name || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 700 }} className="subtle">
                        {online ? t("players.online") : timeAgo(s.lastSeen, t)}
                      </td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 800, textAlign: "center" }}>
                        {s.currentStreak > 0
                          ? <span title={t("players.streakDays", { count: s.currentStreak })}>🔥 {s.currentStreak}</span>
                          : <span className="subtle">—</span>}
                      </td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 700, textAlign: "center" }}>{s.longestStreak || "—"}</td>
                      <td style={{ padding: "0.55rem 0.6rem", fontWeight: 700, textAlign: "center" }} className="subtle">{s.totalLogins}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
