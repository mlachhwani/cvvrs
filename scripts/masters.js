/* ===================================================================
   masters.js
   MASTER LOADING + AUTOFILL ENGINE (CLI / CREW / STATION)
   ML/PHASE1 LOCKED — FULL FILE — ML/01 COMPLIANT
   =================================================================== */

console.log("masters.js loaded");

/* ---------------- PATH (GitHub Pages) ---------------- */
const MASTER_PATH = "/cvvrs/masters/";

/* ---------------- MASTER ARRAYS ---------------- */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* ---------------- CSV LOADER ---------------- */
async function loadCSV(file) {
  const url = MASTER_PATH + file;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("❌ Failed loading:", file);
    return [];
  }
  const text = await res.text();
  return Papa.parse(text.trim(), { header: true }).data;
}

/* ---------------- MASTER LOADER ---------------- */
async function loadMasters() {
  console.log("📁 Loading master CSVs…");

  stationMaster = await loadCSV("station_master.csv");
  crewMaster    = await loadCSV("crew_master.csv");
  cliMaster     = await loadCSV("cli_master.csv");

  console.log("✔ Station Master:", stationMaster.length);
  console.log("✔ Crew Master:", crewMaster.length);
  console.log("✔ CLI Master:", cliMaster.length);
}

/* ---------------- LOOKUP UTILS ---------------- */
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

/* ---------------- AUTOFILL HANDLERS ---------------- */
document.addEventListener("DOMContentLoaded", () => {

  const cli = document.getElementById("cli_id");
  if (cli) cli.addEventListener("change", () => {
    const match = findCLI(cli.value);
    document.getElementById("cli_name").value = match ? match.CLI_NAME : "";
  });

  const fs = document.getElementById("from_station");
  if (fs) fs.addEventListener("change", () => {
    const st = findStation(fs.value);
    document.getElementById("from_station_name").value = st ? st.STATION_NAME : "";
  });

  const ts = document.getElementById("to_station");
  if (ts) ts.addEventListener("change", () => {
    const st = findStation(ts.value);
    document.getElementById("to_station_name").value = st ? st.STATION_NAME : "";
  });

  const lp = document.getElementById("lp_id");
  if (lp) lp.addEventListener("change", () => {
    const c = findCrew(lp.value);
    document.getElementById("lp_name").value  = c ? c.CREW_NAME     : "";
    document.getElementById("lp_desig").value = c ? c.DESIGNATION   : "";
    document.getElementById("lp_gcli").value  = c ? c.G_CLI         : "";
  });

  const alp = document.getElementById("alp_id");
  if (alp) alp.addEventListener("change", () => {
    const c = findCrew(alp.value);
    document.getElementById("alp_name").value  = c ? c.CREW_NAME    : "";
    document.getElementById("alp_desig").value = c ? c.DESIGNATION  : "";
    document.getElementById("alp_gcli").value  = c ? c.G_CLI        : "";
  });
});

/* ---------------- INIT ---------------- */
loadMasters();

/* ---------------- EXPORT (IF NEEDED) ---------------- */
window.MASTERS = { findStation, findCrew, findCLI };
