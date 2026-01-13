/* =============================================================================
   masters.js — Master Loader + Autofill Logic (FULL FILE)
   ============================================================================= */

console.log("masters.js loaded");

/* -----------------------------------------------------------------------------
   MASTER PATH (GitHub Pages friendly)
   ----------------------------------------------------------------------------- */
const MASTER_PATH = "assets/masters/";

/* -----------------------------------------------------------------------------
   MASTER DATA STORAGE
   ----------------------------------------------------------------------------- */
let STATION_MASTER = [];
let CREW_MASTER = [];
let CLI_MASTER = [];

/* -----------------------------------------------------------------------------
   CSV LOADER USING FETCH + PapaParse
   ----------------------------------------------------------------------------- */
async function loadCSV(name) {
  const url = MASTER_PATH + name;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ Failed to load:", url);
      return [];
    }
    const text = await res.text();
    const parsed = Papa.parse(text.trim(), { header: true }).data;
    console.log("Loaded:", name, parsed.length);
    return parsed;
  } catch (err) {
    console.error("❌ Error loading CSV:", name, err);
    return [];
  }
}

/* -----------------------------------------------------------------------------
   LOAD ALL MASTERS
   ----------------------------------------------------------------------------- */
async function loadMasters() {
  console.log("Loading masters...");
  STATION_MASTER = await loadCSV("station_master.csv");
  CREW_MASTER    = await loadCSV("crew_master.csv");
  CLI_MASTER     = await loadCSV("cli_master.csv");
  console.log("Masters loaded ✔");
}

/* -----------------------------------------------------------------------------
   LOOKUP HELPERS
   ----------------------------------------------------------------------------- */
function findStation(code) {
  code = code.trim().toUpperCase();
  return STATION_MASTER.find(r => r.STATION_CODE === code) || null;
}

function findCrew(id) {
  id = id.trim().toUpperCase();
  return CREW_MASTER.find(r => r.CREW_ID === id) || null;
}

function findCLI(id) {
  id = id.trim().toUpperCase();
  return CLI_MASTER.find(r => r.CLI_ID === id) || null;
}

/* -----------------------------------------------------------------------------
   AUTOFILL BINDINGS (AFTER DOM READY)
   ----------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

  await loadMasters(); // async load

  /* ========== CLI AUTOFILL ========== */
  document.getElementById("cli_id").addEventListener("change", () => {
    const id = cli_id.value.trim();
    const cli = findCLI(id);
    cli_name.value = cli ? cli.CLI_NAME : "";
  });

  /* ========== LP AUTOFILL ========== */
  document.getElementById("lp_id").addEventListener("change", () => {
    const id = lp_id.value.trim();
    const crew = findCrew(id);
    lp_name.value = crew ? crew.CREW_NAME : "";
  });

  /* ========== ALP AUTOFILL ========== */
  document.getElementById("alp_id").addEventListener("change", () => {
    const id = alp_id.value.trim();
    const crew = findCrew(id);
    alp_name.value = crew ? crew.CREW_NAME : "";
  });

  /* ========== FROM STATION AUTOFILL ========== */
  document.getElementById("from_station").addEventListener("change", () => {
    const code = from_station.value.trim();
    const st = findStation(code);
    from_station_name.value = st ? st.STATION_NAME : "";
  });

  /* ========== TO STATION AUTOFILL ========== */
  document.getElementById("to_station").addEventListener("change", () => {
    const code = to_station.value.trim();
    const st = findStation(code);
    to_station_name.value = st ? st.STATION_NAME : "";
  });

});
