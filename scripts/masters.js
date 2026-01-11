/* =============================================================================
   MASTERS ENGINE — FULL FILE (ML/01 MODE)
   Locked for MLACHHWANI / CVVRS
============================================================================= */

console.log("masters.js loaded");

/* =============================================================================
   FILE PATH CONFIG (GitHub Pages)
============================================================================= */
const MASTER_PATH = "/cvvrs/masters/";

/* =============================================================================
   MASTER DATA STORES
============================================================================= */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* =============================================================================
   CSV LOAD HELPER (PapaParse)
============================================================================= */
async function loadCSV(filename) {
  const url = MASTER_PATH + filename;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("❌ MASTER LOAD FAILED →", filename);
    return [];
  }

  const text = await res.text();
  return Papa.parse(text.trim(), { header: true }).data;
}

/* =============================================================================
   UI BORDER HELPERS
============================================================================= */
function markValid(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("invalid-input");
    el.classList.add("valid-input");
  }
}

function markInvalid(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("valid-input");
    el.classList.add("invalid-input");
  }
}

/* =============================================================================
   LOOKUP FUNCTIONS
============================================================================= */

function findStation(code) {
  if (!code) return null;
  code = code.trim().toUpperCase();
  return stationMaster.find(r => r.STATION_CODE === code) || null;
}

function findCrew(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return crewMaster.find(r => r.CREW_ID === id) || null;
}

function findCLI(id) {
  if (!id) return null;
  id = id.trim().toUpperCase();
  return cliMaster.find(r => r.CLI_ID === id) || null;
}

/* =============================================================================
   BIND AUTOFILL EVENTS (AFTER MASTERS LOADED)
============================================================================= */

function bindAutofills() {

  /* --- CLI ID → NAME only --- */
  const cli_id = document.getElementById("cli_id");
  const cli_name = document.getElementById("cli_name");

  if (cli_id && cli_name) {
    cli_id.addEventListener("change", () => {
      const id = cli_id.value.trim().toUpperCase();
      cli_id.value = id;

      const rec = findCLI(id);
      if (!rec) {
        alert("❌ INVALID CLI ID");
        cli_name.value = "";
        markInvalid("cli_id");
      } else {
        cli_name.value = rec.CLI_NAME || "";
        markValid("cli_id");
      }
    });
  }

  /* --- LP AUTO --- */
  const lp_id = document.getElementById("lp_id");
  const lp_name = document.getElementById("lp_name");
  const lp_desig = document.getElementById("lp_desig");
  const lp_gcli = document.getElementById("lp_gcli");

  if (lp_id && lp_name && lp_desig && lp_gcli) {
    lp_id.addEventListener("change", () => {
      const id = lp_id.value.trim().toUpperCase();
      lp_id.value = id;

      const rec = findCrew(id);
      if (!rec) {
        alert("❌ INVALID LP ID");
        lp_name.value = "";
        lp_desig.value = "";
        lp_gcli.value = "";
        markInvalid("lp_id");
      } else {
        lp_name.value = rec.CREW_NAME || "";
        lp_desig.value = rec.DESIGNATION || "";
        lp_gcli.value = rec.G_CLI || "";
        markValid("lp_id");
      }
    });
  }

  /* --- ALP AUTO --- */
  const alp_id = document.getElementById("alp_id");
  const alp_name = document.getElementById("alp_name");
  const alp_desig = document.getElementById("alp_desig");
  const alp_gcli = document.getElementById("alp_gcli");

  if (alp_id && alp_name && alp_desig && alp_gcli) {
    alp_id.addEventListener("change", () => {
      const id = alp_id.value.trim().toUpperCase();
      alp_id.value = id;

      const rec = findCrew(id);
      if (!rec) {
        alert("❌ INVALID ALP ID");
        alp_name.value = "";
        alp_desig.value = "";
        alp_gcli.value = "";
        markInvalid("alp_id");
      } else {
        alp_name.value = rec.CREW_NAME || "";
        alp_desig.value = rec.DESIGNATION || "";
        alp_gcli.value = rec.G_CLI || "";
        markValid("alp_id");
      }
    });
  }

  /* --- STATIONS (ST3 MODE) --- */
  const from_code = document.getElementById("from_station");
  const from_name = document.getElementById("from_station_name");
  const to_code = document.getElementById("to_station");
  const to_name = document.getElementById("to_station_name");

  if (from_code && from_name) {
    from_code.addEventListener("change", () => {
      const code = from_code.value.trim().toUpperCase();
      from_code.value = code;
      const rec = findStation(code);

      if (!rec) {
        from_name.value = "";
        markInvalid("from_station");
      } else {
        from_name.value = rec.STATION_NAME || "";
        markValid("from_station");
      }
    });
  }

  if (to_code && to_name) {
    to_code.addEventListener("change", () => {
      const code = to_code.value.trim().toUpperCase();
      to_code.value = code;
      const rec = findStation(code);

      if (!rec) {
        to_name.value = "";
        markInvalid("to_station");
      } else {
        to_name.value = rec.STATION_NAME || "";
        markValid("to_station");
      }
    });
  }
}

/* =============================================================================
   LOAD ALL MASTERS (ASYNC)
============================================================================= */
async function loadMasters() {
  console.log("📥 Loading master data from GitHub Pages...");

  stationMaster = await loadCSV("station_master.csv");
  crewMaster    = await loadCSV("crew_master.csv");
  cliMaster     = await loadCSV("cli_master.csv");

  console.log(`📊 Station Master: ${stationMaster.length}`);
  console.log(`📊 Crew Master:    ${crewMaster.length}`);
  console.log(`📊 CLI Master:     ${cliMaster.length}`);

  bindAutofills();
}

/* =============================================================================
   EXPORT GLOBAL HELPERS
============================================================================= */
window.MASTERS = {
  findStation,
  findCrew,
  findCLI
};

/* =============================================================================
   AUTO START AFTER DOM
============================================================================= */
document.addEventListener("DOMContentLoaded", loadMasters);
