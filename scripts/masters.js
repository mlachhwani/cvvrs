/* ============================================================
   MASTERS.JS  —  LOAD & AUTOFILL (CLI / LP / ALP / STATION)
   SOURCE: GitHub Pages /cvvrs/masters/*.csv
   Locked by ML/01
============================================================ */

console.log("masters.js loaded");

/* ------------------------------------------------------------
   CSV PATH (GitHub Pages)
------------------------------------------------------------ */
const MASTER_PATH = "/cvvrs/masters/";

/* ------------------------------------------------------------
   MASTER ARRAYS
------------------------------------------------------------ */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* ------------------------------------------------------------
   CSV PARSER USING PapaParse
------------------------------------------------------------ */
async function loadCSV(file) {
  const url = MASTER_PATH + file;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("❌ CSV Load Failed:", file);
    return [];
  }

  const text = await res.text();
  const parsed = Papa.parse(text.trim(), { header: true }).data;
  return parsed;
}

/* ------------------------------------------------------------
   LOAD ALL 3 MASTERS
------------------------------------------------------------ */
async function loadMasters() {
  console.log("📁 Loading Masters...");

  stationMaster = await loadCSV("station_master.csv");
  crewMaster    = await loadCSV("crew_master.csv");
  cliMaster     = await loadCSV("cli_master.csv");

  console.log("📌 Station Master:", stationMaster.length);
  console.log("📌 Crew Master:", crewMaster.length);
  console.log("📌 CLI Master:", cliMaster.length);
}

/* ------------------------------------------------------------
   LOOKUP FUNCTIONS
------------------------------------------------------------ */
function findStation(code) {
  if (!code) return null;
  code = code.trim().toUpperCase();
  return stationMaster.find(x => x.STATION_CODE === code) || null;
}

function findCrew(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return crewMaster.find(x => x.CREW_ID === id) || null;
}

function findCLI(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return cliMaster.find(x => x.CLI_ID === id) || null;
}

/* ------------------------------------------------------------
   AUTOFILL BINDINGS (AFTER DOM READY)
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- CLI Autofill ---------- */
  const cliId = document.getElementById("cli_id");
  if (cliId) {
    cliId.addEventListener("change", () => {
      const cli = findCLI(cliId.value);
      document.getElementById("cli_name").value = cli ? cli.CLI_NAME : "";
    });
  }

  /* ---------- STATION Autofill ---------- */
  const fs = document.getElementById("from_station");
  if (fs) {
    fs.addEventListener("change", () => {
      const st = findStation(fs.value);
      document.getElementById("from_station_name").value = st ? st.STATION_NAME : "";
    });
  }

  const ts = document.getElementById("to_station");
  if (ts) {
    ts.addEventListener("change", () => {
      const st = findStation(ts.value);
      document.getElementById("to_station_name").value = st ? st.STATION_NAME : "";
    });
  }

  /* ---------- LP Autofill ---------- */
  const lp = document.getElementById("lp_id");
  if (lp) {
    lp.addEventListener("change", () => {
      const c = findCrew(lp.value);
      document.getElementById("lp_name").value = c ? c.CREW_NAME : "";
      document.getElementById("lp_desig").value = c ? c.DESIGNATION : "";
      document.getElementById("lp_gcli").value = c ? c.G_CLI : "";
    });
  }

  /* ---------- ALP Autofill ---------- */
  const alp = document.getElementById("alp_id");
  if (alp) {
    alp.addEventListener("change", () => {
      const c = findCrew(alp.value);
      document.getElementById("alp_name").value = c ? c.CREW_NAME : "";
      document.getElementById("alp_desig").value = c ? c.DESIGNATION : "";
      document.getElementById("alp_gcli").value = c ? c.G_CLI : "";
    });
  }
});

/* ------------------------------------------------------------
   TRIGGER MASTER LOAD
------------------------------------------------------------ */
loadMasters();

/* ------------------------------------------------------------
   EXPORT (if needed)
------------------------------------------------------------ */
window.MASTERS = {
  findCLI,
  findCrew,
  findStation
};
