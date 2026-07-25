// lib/palnames.js
// Map Palworld INTERNAL species codenames (what the game's Blueprint classes are named,
// e.g. "NegativeKoala") to their friendly display names (e.g. "Depresso").
//
// The PSMDeathRelay UE4SS mod reports the killer by its internal class name because
// that's what's cheaply and reliably readable at the death site. This module turns that
// into something a human recognises. It's an OVERLAY, not an exhaustive Paldeck: only
// entries we're confident about are listed, and anything unlisted falls back to a
// prettified codename ("NegativeKoala" -> "Negative Koala"), which is always readable.
// Add entries freely — it's pure data.
//
// Isomorphic (no node builtins) so the UI can reuse it if a deaths feed ever wants it.

const DISPLAY = {
  SheepBall: "Lamball",
  PinkCat: "Cattiva",
  ChickenPal: "Chikipi",
  Kitsunebi: "Foxparks",
  Boar: "Rushoar",
  Deer: "Eikthyrdeer",
  Penguin: "Pengullet",
  Fox: "Vixy",
  GrassPanda: "Mossanda",
  NegativeKoala: "Depresso",
  Anubis: "Anubis",
  Baphomet: "Incineram",
  Baphomet_Dark: "Incineram Noct",
  Hedgehog: "Hoocrates",
  ClownRabbit: "Nox",       // internal seen in the wild (BP_..._ClownRabbit)
  JellyfishFairy: "Celaray",
  GhostAnglerfish: "Gobfin",
};

// Insert spaces at lowerUpper / letterDigit boundaries so a bare codename still reads
// cleanly when we don't have a curated name for it.
function prettify(internal) {
  return String(internal || "")
    .replace(/_+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .trim();
}

// Resolve an internal species codename to a display name. Tries the exact codename,
// then a BOSS_-stripped variant, then falls back to a prettified codename.
function displayName(internal) {
  const raw = String(internal || "").trim();
  if (!raw) return "";
  if (DISPLAY[raw]) return DISPLAY[raw];
  const stripped = raw.replace(/^(BOSS_|Boss_|GYM_|RAID_)/i, "").replace(/_(Boss|Flower|2|3)$/i, "");
  if (DISPLAY[stripped]) return DISPLAY[stripped];
  return prettify(stripped);
}

module.exports = { DISPLAY, displayName, prettify };
