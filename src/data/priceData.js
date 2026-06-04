import { supabase } from "../supabaseClient";

export const markets = {
  addis:   { id: "addis",   nameEn: "Addis Ababa",  nameAm: "አዲስ አበባ",   subEn: "Mercato + ECX",       subAm: "መርካቶ + ECX" },
  jimma:   { id: "jimma",   nameEn: "Jimma",         nameAm: "ጅማ",         subEn: "Regional reporter",   subAm: "የክልል ዘጋቢ" },
  diredawa:{ id: "diredawa",nameEn: "Dire Dawa",     nameAm: "ድሬዳዋ",       subEn: "Regional reporter",   subAm: "የክልል ዘጋቢ" },
  mekele:  { id: "mekele",  nameEn: "Mek'ele",       nameAm: "መቀሌ",        subEn: "Regional reporter",   subAm: "የክልል ዘጋቢ" },
  hawassa: { id: "hawassa", nameEn: "Hawassa",       nameAm: "ሐዋሳ",        subEn: "Regional reporter",   subAm: "የክልል ዘጋቢ" },
};

export const commodities = {
  coffee_g2: {
    id: "coffee_g2",
    nameEn: "Coffee (Grade 2)",
    nameAm: "ቡና (ደረጃ 2)",
    shortEn: "Coffee Gr.2",
    shortAm: "ቡና ደ.2",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "coffee",
    color: "#1D9E75",
    market: "addis",
    price: 9450,
    change: 2.1,
    high7: 9610,
    low7: 8990,
    trend30: 8.4,
    source: "ECX + reporter",
    history: [7800, 8100, 8300, 8050, 8400, 8600, 8550, 8800, 8950, 9100, 9200, 9450],
  },
  teff_white: {
    id: "teff_white",
    nameEn: "Teff (White)",
    nameAm: "ጤፍ (ነጭ)",
    shortEn: "Teff White",
    shortAm: "ነጭ ጤፍ",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "grains",
    color: "#BA7517",
    market: "addis",
    price: 3200,
    change: -0.8,
    high7: 3350,
    low7: 3150,
    trend30: -2.1,
    source: "Mercato reporter",
    history: [3400, 3380, 3350, 3320, 3300, 3280, 3250, 3220, 3200, 3180, 3226, 3200],
  },
  sesame: {
    id: "sesame",
    nameEn: "Sesame",
    nameAm: "ሰሊጥ",
    shortEn: "Sesame",
    shortAm: "ሰሊጥ",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "oilseeds",
    color: "#378ADD",
    market: "jimma",
    price: 6780,
    change: 1.3,
    high7: 6900,
    low7: 6600,
    trend30: 5.2,
    source: "Regional reporter",
    history: [6100, 6200, 6250, 6300, 6350, 6400, 6500, 6600, 6650, 6700, 6695, 6780],
  },
  chat_dd: {
    id: "chat_dd",
    nameEn: "Chat (Dire Dawa)",
    nameAm: "ጫት (ድሬዳዋ)",
    shortEn: "Chat",
    shortAm: "ጫት",
    unit: "kg",
    unitAm: "ኪግ",
    category: "other",
    color: "#D85A30",
    market: "diredawa",
    price: 1120,
    change: 0.5,
    high7: 1150,
    low7: 1080,
    trend30: 3.7,
    source: "Regional reporter",
    history: [980, 1000, 1010, 1020, 1040, 1050, 1060, 1070, 1080, 1100, 1114, 1120],
  },
  wheat: {
    id: "wheat",
    nameEn: "Wheat",
    nameAm: "ስንዴ",
    shortEn: "Wheat",
    shortAm: "ስንዴ",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "grains",
    color: "#639922",
    market: "addis",
    price: 2940,
    change: -0.4,
    high7: 3010,
    low7: 2900,
    trend30: -1.8,
    source: "EGTE + ECX",
    history: [3100, 3080, 3060, 3040, 3020, 3010, 3000, 2990, 2980, 2960, 2952, 2940],
  },
  chickpeas: {
    id: "chickpeas",
    nameEn: "Chickpeas",
    nameAm: "ሽምብራ",
    shortEn: "Chickpeas",
    shortAm: "ሽምብራ",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "pulses",
    color: "#534AB7",
    market: "mekele",
    price: 4100,
    change: 0.9,
    high7: 4200,
    low7: 4000,
    trend30: 4.1,
    source: "Regional reporter",
    history: [3700, 3750, 3800, 3820, 3860, 3900, 3950, 4000, 4020, 4060, 4063, 4100],
  },
  coffee_g4: {
    id: "coffee_g4",
    nameEn: "Coffee (Grade 4)",
    nameAm: "ቡና (ደረጃ 4)",
    shortEn: "Coffee Gr.4",
    shortAm: "ቡና ደ.4",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "coffee",
    color: "#0F6E56",
    market: "hawassa",
    price: 7800,
    change: 1.8,
    high7: 7950,
    low7: 7600,
    trend30: 6.9,
    source: "ECX + reporter",
    history: [6800, 6900, 7000, 7050, 7100, 7200, 7300, 7400, 7500, 7650, 7663, 7800],
  },
  teff_mixed: {
    id: "teff_mixed",
    nameEn: "Teff (Mixed)",
    nameAm: "ጤፍ (ቡናማ)",
    shortEn: "Teff Mixed",
    shortAm: "ቡናማ ጤፍ",
    unit: "quintal",
    unitAm: "ኩንታል",
    category: "grains",
    color: "#993C1D",
    market: "addis",
    price: 2750,
    change: -0.3,
    high7: 2820,
    low7: 2700,
    trend30: -0.9,
    source: "Mercato reporter",
    history: [2850, 2840, 2830, 2820, 2810, 2800, 2790, 2780, 2770, 2760, 2758, 2750],
  },
};

export const categories = [
  { id: "all",      labelEn: "All",       labelAm: "ሁሉ" },
  { id: "coffee",   labelEn: "Coffee",    labelAm: "ቡና" },
  { id: "grains",   labelEn: "Grains",    labelAm: "እህሎች" },
  { id: "oilseeds", labelEn: "Oilseeds",  labelAm: "ቅባት" },
  { id: "pulses",   labelEn: "Pulses",    labelAm: "ጥብሶች" },
  { id: "other",    labelEn: "Other",     labelAm: "ሌላ" },
];

export const lastUpdated = "6:30 AM EAT";

// ---------------------------------------------------------------------------
// Supabase live data
// ---------------------------------------------------------------------------

/**
 * Fetches the latest price reading per commodity+market from Supabase,
 * then merges it into the static commodities map so the rest of the app
 * continues to work unchanged.
 *
 * Returns the same shape as `commodities` — a plain object keyed by id.
 * Falls back to static mock data if Supabase is unreachable or not yet wired up.
 */
export async function fetchPrices() {
  try {
    const { data, error } = await supabase
      .from("prices")
      .select("commodity_id, market_id, price, recorded_at, source, submitted_by")
      .order("recorded_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return commodities;

    // Keep only the most-recent row per commodity_id
    const latest = {};
    for (const row of data) {
      if (!latest[row.commodity_id]) latest[row.commodity_id] = row;
    }

    // Deep-merge live prices into the static commodity definitions
    const merged = { ...commodities };
    for (const [id, row] of Object.entries(latest)) {
      if (merged[id]) {
        merged[id] = { ...merged[id], price: row.price, source: row.source ?? merged[id].source };
      }
    }

    return merged;
  } catch (err) {
    console.warn("Supabase fetchPrices failed, using static data:", err.message);
    return commodities;
  }
}

/**
 * Fetches the last 12 price readings for a single commodity+market pair
 * to drive the sparkline / history chart on the Detail screen.
 *
 * Falls back to the static `history` array from the commodity definition.
 */
export async function fetchHistory(commodityId, marketId) {
  try {
    const { data, error } = await supabase
      .from("prices")
      .select("price, recorded_at")
      .eq("commodity_id", commodityId)
      .eq("market_id", marketId)
      .order("recorded_at", { ascending: true })
      .limit(12);

    if (error) throw error;
    if (!data || data.length < 2) return commodities[commodityId]?.history ?? [];

    return data.map((r) => r.price);
  } catch (err) {
    console.warn("Supabase fetchHistory failed, using static data:", err.message);
    return commodities[commodityId]?.history ?? [];
  }
}
