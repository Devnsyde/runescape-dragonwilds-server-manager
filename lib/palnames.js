// lib/palnames.js
// Map Palworld INTERNAL codenames (what the game's Blueprint classes are named, e.g.
// "WoolFox", "NegativeKoala") to their friendly display names ("Cremis", "Depresso").
//
// The PSMDeathRelay UE4SS mod reports a killer by its internal class name because that's
// what's cheaply and reliably readable at the death site. This turns it into a name a
// player recognises. Anything not listed falls back to a prettified codename
// ("SomeNewPal" -> "Some New Pal"), which is always readable.
//
// Pal mapping source: community "Code Name -> Pal Name" dataset
// (github.com/SoTMaulder/SoTMaulder-Palworld, cross-checked against palworld.wiki.gg).
// Isomorphic (no node builtins) so the UI can reuse it.

const PAL_NAMES = {
  Alpaca: "Melpaca", AmaterasuWolf: "Kitsun", Anubis: "Anubis", Baphomet: "Incineram",
  Baphomet_Dark: "Incineram Noct", Bastet: "Mau", Bastet_Ice: "Mau Cryst",
  BerryGoat: "Caprity", BirdDragon: "Vanwyrm", BirdDragon_Ice: "Vanwyrm Cryst",
  BlackCentaur: "Necromus", BlackFurDragon: "Dragostrophe", BlackGriffon: "Shadowbeak",
  BlackMetalDragon: "Astegon", BlueDragon: "Azurobe", BluePlatypus: "Fuack",
  Boar: "Rushoar", CaptainPenguin: "Penking", Carbunclo: "Lifmunk", CatBat: "Tombat",
  CatMage: "Katress", CatVampire: "Felbat", ChickenPal: "Chikipi", ColorfulBird: "Tocotoco",
  CowPal: "Mozzarina", CuteButterfly: "Cinnamoth", CuteFox: "Vixy", CuteMole: "Fuddler",
  DarkCrow: "Cawgnito", DarkScorpion: "Menasting", Deer: "Eikthyrdeer",
  Deer_Ground: "Eikthyrdeer Terra", DreamDemon: "Daedream", DrillGame: "Digtoise",
  Eagle: "Galeclaw", ElecCat: "Sparkit", ElecLion: "Boltmane", ElecPanda: "Grizzbolt",
  FairyDragon: "Elphidran", FairyDragon_Water: "Elphidran Aqua", FengyunDeeper: "Fenglope",
  FireKirin: "Pyrin", FireKirin_Dark: "Pyrin Noct", FlameBambi: "Rooby",
  FlameBuffalo: "Arsox", FlowerDinosaur: "Dinossom", FlowerDinosaur_Electric: "Dinossom Lux",
  FlowerDoll: "Petallia", FlowerRabbit: "Flopie", FlyingManta: "Celaray", FoxMage: "Wixen",
  Ganesha: "Teafant", Garm: "Direhowl", GhostBeast: "Maraith", Gorilla: "Gorirat",
  GrassMammoth: "Mammorest", GrassMammoth_Ice: "Mammorest Cryst", GrassPanda: "Mossanda",
  GrassPanda_Electric: "Mossanda Lux", GrassRabbitMan: "Verdash", HadesBird: "Helzephyr",
  HawkBird: "Nitewing", Hedgehog: "Jolthog", Hedgehog_Ice: "Jolthog Cryst",
  HerculesBeetle: "Warsect", Horus: "Faleris", IceDeer: "Reindrix", IceFox: "Foxcicle",
  IceHorse: "Frostallion", IceHorse_Dark: "Frostallion Noct", JetDragon: "Jetragon",
  Kelpie: "Kelpsea", Kelpie_Fire: "Kelpsea Ignis", KingAlpaca: "Kingpaca",
  KingAlpaca_Ice: "Ice Kingpaca", KingBahamut: "Blazamut", Kirin: "Univolt",
  Kitsunebi: "Foxparks", LavaGirl: "Flambelle", LazyCatfish: "Dumud",
  LazyDragon: "Relaxaurus", LazyDragon_Electric: "Relaxaurus Lux", LilyQueen: "Lyleen",
  LilyQueen_Dark: "Lyleen Noct", LittleBriarRose: "Bristla", LizardMan: "Leezpunk",
  LizardMan_Fire: "Leezpunk Ignis", Manticore: "Blazehowl", Manticore_Dark: "Blazehowl Noct",
  Monkey: "Tanzee", MopBaby: "Swee", MopKing: "Sweepa", Mutant: "Lunaris",
  NaughtyCat: "Grintale", NegativeKoala: "Depresso", NegativeOctopus: "Killamari",
  NightFox: "Nox", Penguin: "Pengullet", PinkCat: "Cattiva", PinkLizard: "Lovander",
  PinkRabbit: "Ribbuny", PlantSlime: "Gumoss", QueenBee: "Elizabee", RaijinDaughter: "Dazzi",
  RedArmorBird: "Ragnahawk", RobinHood: "Robinquill", RobinHood_Ground: "Robinquill Terra",
  Ronin: "Bushi", SaintCentaur: "Paladius", SakuraSaurus: "Broncherry",
  SakuraSaurus_Water: "Broncherry Aqua", Serpent: "Surfent", Serpent_Ground: "Surfent Terra",
  SharkKid: "Gobfin", SharkKid_Fire: "Gobfin Ignis", SheepBall: "Lamball",
  SkyDragon: "Quivern", SoldierBee: "Beegarde", Suzaku: "Suzaku", Suzaku_Water: "Suzaku Aqua",
  SweetsSheep: "Woolipop", ThunderBird: "Beakon", ThunderDog: "Rayhound",
  ThunderDragonMan: "Orserk", Umihebi: "Jormuntide", Umihebi_Fire: "Jormuntide Ignis",
  VioletFairy: "Vaelet", VolcanicMonster: "Reptyro", VolcanicMonster_Ice: "Ice Reptyro",
  WeaselDragon: "Chillet", Werewolf: "Loupmoon", WhiteMoth: "Sibelyx", WhiteTiger: "Cryolinx",
  Windchimes: "Hangyu", Windchimes_Ice: "Hangyu Cryst", WizardOwl: "Hoocrates",
  WoolFox: "Cremis", Yeti: "Wumpo", Yeti_Grass: "Wumpo Botan",
  // Tower bosses (human + partner Pal duos)
  GrassBoss: "Zoe & Grizzbolt", ForestBoss: "Lily & Lyleen", DessertBoss: "Marcus & Faleris",
  VolcanoBoss: "Axel & Orserk", SnowBoss: "Victor & Shadowbeak",
};

// Human/faction NPCs (killerKind "npc"). The internal is BP_NPC_<X>_C -> "NPC_<X>".
const NPC_NAMES = {
  NPC_Police: "PIDF",
};

// Insert spaces at lowerUpper / letterDigit boundaries so an unlisted codename still
// reads cleanly.
function prettify(internal) {
  return String(internal || "")
    .replace(/_+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .trim();
}

// Resolve an internal codename to a display name: exact Pal, exact NPC, then a
// prefix/affix-stripped retry, then a prettified fallback.
function displayName(internal) {
  const raw = String(internal || "").trim();
  if (!raw) return "";
  if (PAL_NAMES[raw]) return PAL_NAMES[raw];
  if (NPC_NAMES[raw]) return NPC_NAMES[raw];
  const stripped = raw
    .replace(/^(BOSS_|Boss_|GYM_|RAID_|NPC_)/i, "")
    .replace(/_(Boss|Flower|2|3)$/i, "");
  if (PAL_NAMES[stripped]) return PAL_NAMES[stripped];
  if (NPC_NAMES["NPC_" + stripped]) return NPC_NAMES["NPC_" + stripped];
  return prettify(stripped);
}

module.exports = { PAL_NAMES, NPC_NAMES, displayName, prettify };
