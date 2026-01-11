/* ============================================================================
   masters.js — MASTER CSV LOADER + AUTO FILL + VALIDATION
   MODE: ML/01 — FULL FILE DELIVERY
   FORMAT: CSV (Comma-separated), Header=true
   DELIMITER: ','
   ============================================================================ */

/* -------------------------------
   MASTER FILE PATH (GITHUB PAGES)
   ------------------------------- */
const MASTER_PATH = "masters/";

/* -------------------------------
   MASTER DATA CONTAINERS
   ------------------------------- */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* -------------------------------
   HELPER: FETCH + PARSE CSV
   ------------------------------- */
async function loadCSV(name) {
  const url = MASTER_PATH + name;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error("CSV LOAD FAILED:", name);
      return [];
    }
    const text = await resp.text();
    const parsed = Papa.parse(text.trim(), {
      header: true,
      delimiter: ","
    });
    return parsed.data;
  } catch (err) {
    console.error("CSV ERROR:", name, err);
    return [];
  }
}

/* -------------------------------
   LOAD ALL MASTERS (ASYNC)
   ------------------------------- */
async function loadMasters() {
  stationMaster = await loadCSV("station_master.csv");
  crewMaster    = await loadCSV("crew_master.csv");
  cliMaster     = await loadCSV("cli_master.csv");

  console.log("Masters Loaded =>",
    "Stations:", stationMaster.length,
    "Crew:", crewMaster.length,
    "CLI:", cliMaster.length
  );

  applyAnalysisDate(); // Set IST date after load
}

/* -------------------------------
   ANALYSIS DATE (DA1 LOCKED)
   IST TIME, READONLY, AUTO-FILL
   ------------------------------- */
function applyAnalysisDate() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (5.5 * 60 * 60 * 1000));

  const yyyy = ist.getFullYear();
  const mm = String(ist.getMonth() + 1).padStart(2, "0");
  const dd = String(ist.getDate()).padStart(2, "0");

  const field = document.getElementById("analysis_date");
  if (field) {
    field.value = `${yyyy}-${mm}-${dd}`;
  }
}

/* -------------------------------
   LOOKUP FUNCTIONS
   ------------------------------- */
function findStation(code) {
  if (!code) return null;
  code = code.trim().toUpperCase();
  return stationMaster.find(x => (x.STATION_CODE || "").toUpperCase() === code) || null;
}

function findCrew(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return crewMaster.find(x => (x.CREW_ID || "").toUpperCase() === id) || null;
}

function findCLI(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return cliMaster.find(x => (x.CLI_ID || "").toUpperCase() === id) || null;
}

/* -------------------------------
   UI FIELD ACCESS HELPERS
   ------------------------------- */
function setValid(field) {
  field.style.borderColor = "#2E7D32"; // green
}

function setInvalid(field) {
  field.style.borderColor = "#D32F2F"; // red
}

function clearStyle(field) {
  field.style.borderColor = "";
}

/* ============================================================================
   AUTO-FILL BINDINGS
   ============================================================================ */

/* -------- CLI AUTO-FILL -------- */
document.getElementById("cli_id").addEventListener("change", () => {
  const fld = document.getElementById("cli_id");
  const nameFld = document.getElementById("cli_name");

  const cli = findCLI(fld.value);
  if (!cli) {
    setInvalid(fld);
    nameFld.value = "";
    alert("❌ Invalid CLI ID!");
    return;
  }

  setValid(fld);
  nameFld.value = cli.CLI_NAME || "";
});

/* -------- CREW (LP) AUTO-FILL -------- */
document.getElementById("lp_id").addEventListener("change", () => {
  const fld = document.getElementById("lp_id");
  const nameFld = document.getElementById("lp_name");
  const desigFld = document.getElementById("lp_desig");
  const gcliFld  = document.getElementById("lp_gcli");

  const crew = findCrew(fld.value);
  if (!crew) {
    setInvalid(fld);
    nameFld.value = "";
    desigFld.value = "";
    gcliFld.value = "";
    alert("❌ Invalid LP ID!");
    return;
  }

  setValid(fld);
  nameFld.value = crew.CREW_NAME || "";
  desigFld.value = crew.DESIGNATION || "";
  gcliFld.value  = crew.G_CLI || "";
});

/* -------- CREW (ALP) AUTO-FILL -------- */
document.getElementById("alp_id").addEventListener("change", () => {
  const fld = document.getElementById("alp_id");
  const nameFld = document.getElementById("alp_name");
  const desigFld = document.getElementById("alp_desig");
  const gcliFld  = document.getElementById("alp_gcli");

  const crew = findCrew(fld.value);
  if (!crew) {
    setInvalid(fld);
    nameFld.value = "";
    desigFld.value = "";
    gcliFld.value = "";
    alert("❌ Invalid ALP ID!");
    return;
  }

  setValid(fld);
  nameFld.value = crew.CREW_NAME || "";
  desigFld.value = crew.DESIGNATION || "";
  gcliFld.value  = crew.G_CLI || "";
});

/* -------- STATION (FROM) -------- */
document.getElementById("from_station").addEventListener("input", () => {
  const fld = document.getElementById("from_station");
  const nameFld = document.getElementById("from_station_name");

  const st = findStation(fld.value);
  if (!st) {
    setInvalid(fld);
    nameFld.value = "";
    return; // ST3 = no alert
  }

  setValid(fld);
  nameFld.value = st.STATION_NAME || "";
});

/* -------- STATION (TO) -------- */
document.getElementById("to_station").addEventListener("input", () => {
  const fld = document.getElementById("to_station");
  const nameFld = document.getElementById("to_station_name");

  const st = findStation(fld.value);
  if (!st) {
    setInvalid(fld);
    nameFld.value = "";
    return; // ST3 = no alert
  }

  setValid(fld);
  nameFld.value = st.STATION_NAME || "";
});

/* ============================================================================
   INIT
   ============================================================================ */
window.addEventListener("DOMContentLoaded", loadMasters);

/* ============================================================================
   EXPORTS (OPTIONAL)
   ============================================================================ */
window.MASTERS = {
  findCrew,
  findCLI,
  findStation
};
