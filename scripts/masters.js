/* ==========================================================================
   MASTER LOADER + AUTOFILL HANDLERS
   FINAL LOCKED FOR: MLACHHWANI / CVVRS PROJECT
   ========================================================================== */

console.log("masters.js loaded");

/* --------------------------------------------------------------------------
   MASTER PATH (GitHub Pages)
   -------------------------------------------------------------------------- */
const MASTER_PATH = "masters/";

/* --------------------------------------------------------------------------
   MASTER DATA CONTAINERS
   -------------------------------------------------------------------------- */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* --------------------------------------------------------------------------
   LOAD CSV FROM GITHUB
   -------------------------------------------------------------------------- */
async function loadMasterCSV(filename) {
  const url = MASTER_PATH + filename;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ Master load failed:", filename);
      return [];
    }

    const text = await res.text();
    const parsed = Papa.parse(text.trim(), { header: true }).data;
    return parsed;

  } catch (err) {
    console.error("❌ Fetch error:", filename, err);
    return [];
  }
}

/* --------------------------------------------------------------------------
   LOAD ALL 3 MASTER FILES
   -------------------------------------------------------------------------- */
async function loadAllMasters() {
  console.log("📦 Loading Master CSVs...");

  stationMaster = await loadMasterCSV("station_master.csv");
  crewMaster    = await loadMasterCSV("crew_master.csv");
  cliMaster     = await loadMasterCSV("cli_master.csv");

  console.log("📌 Station Count:", stationMaster.length);
  console.log("📌 Crew Count:", crewMaster.length);
  console.log("📌 CLI Count:", cliMaster.length);
}

/* Immediately load */
loadAllMasters();

/* --------------------------------------------------------------------------
   LOOKUP HELPERS
   -------------------------------------------------------------------------- */
function findStation(code) {
  code = code.trim().toUpperCase();
  return stationMaster.find(x => x.STATION_CODE === code) || null;
}

function findCrew(id) {
  id = id.trim().toUpperCase();
  return crewMaster.find(x => x.CREW_ID === id) || null;
}

function findCLI(id) {
  id = id.trim().toUpperCase();
  return cliMaster.find(x => x.CLI_ID === id) || null;
}

/* --------------------------------------------------------------------------
   UI AUTOFILL LOGIC
   -------------------------------------------------------------------------- */
function initAutofillHandlers() {

  /* ---- CLI ---- */
  const cliInput = document.getElementById("cli_id");
  const cliName  = document.getElementById("cli_name");

  if (cliInput) {
    cliInput.addEventListener("change", () => {
      const id = cliInput.value.trim();
      const rec = findCLI(id);

      if (!rec) {
        alert("❌ Invalid CLI ID");
        cliName.value = "";
        return;
      }
      cliName.value = rec.CLI_NAME;
    });
  }

  /* ---- LP ---- */
  const lpInput  = document.getElementById("lp_id");
  const lpName   = document.getElementById("lp_name");
  const lpDesig  = document.getElementById("lp_desig");
  const lpGCLI   = document.getElementById("lp_gcli");

  if (lpInput) {
    lpInput.addEventListener("change", () => {
      const id = lpInput.value.trim();
      const rec = findCrew(id);

      if (!rec) {
        alert("❌ Invalid LP ID");
        lpName.value = "";
        lpDesig.value = "";
        lpGCLI.value = "";
        return;
      }

      lpName.value  = rec.CREW_NAME || "";
      lpDesig.value = rec.DESIGNATION || "";
      lpGCLI.value  = rec.G_CLI || "";
    });
  }

  /* ---- ALP ---- */
  const alpInput  = document.getElementById("alp_id");
  const alpName   = document.getElementById("alp_name");
  const alpDesig  = document.getElementById("alp_desig");
  const alpGCLI   = document.getElementById("alp_gcli");

  if (alpInput) {
    alpInput.addEventListener("change", () => {
      const id = alpInput.value.trim();
      const rec = findCrew(id);

      if (!rec) {
        alert("❌ Invalid ALP ID");
        alpName.value = "";
        alpDesig.value = "";
        alpGCLI.value = "";
        return;
      }

      alpName.value  = rec.CREW_NAME || "";
      alpDesig.value = rec.DESIGNATION || "";
      alpGCLI.value  = rec.G_CLI || "";
    });
  }

  /* ---- STATION: FROM ---- */
  const fsInput = document.getElementById("from_station");
  const fsName  = document.getElementById("from_station_name");

  if (fsInput) {
    fsInput.addEventListener("change", () => {
      const code = fsInput.value.trim();
      const rec = findStation(code);

      if (!rec) {
        alert("❌ Invalid FROM Station Code");
        fsName.value = "";
        return;
      }
      fsName.value = rec.STATION_NAME;
    });
  }

  /* ---- STATION: TO ---- */
  const tsInput = document.getElementById("to_station");
  const tsName  = document.getElementById("to_station_name");

  if (tsInput) {
    tsInput.addEventListener("change", () => {
      const code = tsInput.value.trim();
      const rec = findStation(code);

      if (!rec) {
        alert("❌ Invalid TO Station Code");
        tsName.value = "";
        return;
      }
      tsName.value = rec.STATION_NAME;
    });
  }
}

/* --------------------------------------------------------------------------
   WAIT UNTIL DOM READY
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", initAutofillHandlers);

/* --------------------------------------------------------------------------
   EXPORT (optional debugging)
   -------------------------------------------------------------------------- */
window.MASTERS = {
  findStation,
  findCrew,
  findCLI
};
