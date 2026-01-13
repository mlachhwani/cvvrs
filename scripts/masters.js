/**************************************************************
 * masters.js — LOAD CSV MASTERS FROM GITHUB (ML/01 LOCKED)
 * FULL FILE — NO PARTIAL EDITS
 **************************************************************/

console.log("masters.js loaded");

/* ============================================================
   PATH FOR GITHUB PAGES
   We load CSVs from /cvvrs/masters/
   ============================================================ */
const MASTER_PATH = "masters/";

/* ============================================================
   DATA HOLDERS
   ============================================================ */
let stationMaster = [];
let crewMaster    = [];
let cliMaster     = [];

/* ============================================================
   LOAD CSV GENERIC
   ============================================================ */
async function loadCSV(file) {
  const url = MASTER_PATH + file;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ Failed to load:", url);
      return [];
    }

    const text = await res.text();
    const rows = Papa.parse(text.trim(), { header: true }).data;
    return rows;
  } catch (err) {
    console.error("❌ ERROR:", err);
    return [];
  }
}

/* ============================================================
   LOAD ALL (RUN AT STARTUP)
   ============================================================ */
async function loadAllMasters() {
  console.log("🔄 Loading CSV masters from GitHub...");

  stationMaster = await loadCSV("station_master.csv");
  crewMaster    = await loadCSV("crew_master.csv");
  cliMaster     = await loadCSV("cli_master.csv");

  console.log("📊 Station Master:", stationMaster.length);
  console.log("📊 Crew Master:",    crewMaster.length);
  console.log("📊 CLI Master:",     cliMaster.length);
}

/* init */
loadAllMasters();

/* ============================================================
   LOOKUP FUNCTIONS
   ============================================================ */
function findStationByCode(code) {
  if (!code) return null;
  code = code.trim().toUpperCase();
  return stationMaster.find(r => r.STATION_CODE === code) || null;
}

function findCrewById(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return crewMaster.find(r => r.CREW_ID === id) || null;
}

function findCLIById(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return cliMaster.find(r => r.CLI_ID === id) || null;
}

/* ============================================================
   EXPORT
   ============================================================ */
window.MASTERS = {
  findStationByCode,
  findCrewById,
  findCLIById
};
