/* ============================================================================
   masters.js — Master Loader + Autofill Logic
   ML/PHASE2/STEP12 (FULL FILE)
   ============================================================================ */

console.log("masters.js loaded");

/* ---------------------------------------------------------------------------
   MASTER FILE PATH
--------------------------------------------------------------------------- */
const MASTER_PATH = "/cvvrs/masters/";

/* ---------------------------------------------------------------------------
   MASTER ARRAYS
--------------------------------------------------------------------------- */
let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* ---------------------------------------------------------------------------
   CSV LOADER (PapaParse)
--------------------------------------------------------------------------- */
async function loadMasterCSV(filename) {
  const url = MASTER_PATH + filename;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.error("❌ Master Load Failed:", filename);
    return [];
  }
  const text = await resp.text();
  const rows = Papa.parse(text.trim(), { header:true }).data;
  return rows;
}

/* ---------------------------------------------------------------------------
   LOAD ALL MASTERS ON START
--------------------------------------------------------------------------- */
async function loadAllMasters() {
  console.log("📁 Loading Master CSVs...");

  stationMaster = await loadMasterCSV("station_master.csv");
  crewMaster    = await loadMasterCSV("crew_master.csv");
  cliMaster     = await loadMasterCSV("cli_master.csv");

  console.log("✔ Station Master:", stationMaster.length);
  console.log("✔ Crew Master:", crewMaster.length);
  console.log("✔ CLI Master:", cliMaster.length);
}

document.addEventListener("DOMContentLoaded", loadAllMasters);

/* ---------------------------------------------------------------------------
   LOOKUP FUNCTIONS
--------------------------------------------------------------------------- */
function findStation(code) {
  code = code.trim().toUpperCase();
  return stationMaster.find(r => r.STATION_CODE === code) || null;
}

function findCrew(id) {
  id = id.trim().toUpperCase();
  return crewMaster.find(r => r.CREW_ID === id) || null;
}

function findCLI(id) {
  id = id.trim().toUpperCase();
  return cliMaster.find(r => r.CLI_ID === id) || null;
}

/* ---------------------------------------------------------------------------
   AUTO SET ANALYSIS DATE (BROWSER TIME TEMP)
--------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  document.getElementById("analysis_date").value = `${yyyy}-${mm}-${dd}`;
});

/* ---------------------------------------------------------------------------
   CLI AUTOFILL
--------------------------------------------------------------------------- */
document.addEventListener("input", event => {
  if (event.target.id === "cli_id") {
    const id = event.target.value;
    const r = findCLI(id);
    document.getElementById("cli_name").value = r ? r.CLI_NAME : "";
  }
});

/* ---------------------------------------------------------------------------
   LP AUTOFILL
--------------------------------------------------------------------------- */
document.addEventListener("input", event => {
  if (event.target.id === "lp_id") {
    const id = event.target.value;
    const r = findCrew(id);
    document.getElementById("lp_name").value  = r ? r.CREW_NAME   : "";
    document.getElementById("lp_desig").value = r ? r.DESIGNATION : "";
    document.getElementById("lp_gcli").value  = r ? r.G_CLI       : "";
  }
});

/* ---------------------------------------------------------------------------
   ALP AUTOFILL
--------------------------------------------------------------------------- */
document.addEventListener("input", event => {
  if (event.target.id === "alp_id") {
    const id = event.target.value;
    const r = findCrew(id);
    document.getElementById("alp_name").value  = r ? r.CREW_NAME   : "";
    document.getElementById("alp_desig").value = r ? r.DESIGNATION : "";
    document.getElementById("alp_gcli").value  = r ? r.G_CLI       : "";
  }
});

/* ---------------------------------------------------------------------------
   STATION AUTOFILL + MANUAL MODE
--------------------------------------------------------------------------- */
function enableManualStation(id) {
  const nameField = document.getElementById(id+"_name");
  nameField.readOnly = false;
  nameField.value = "";
  nameField.style.background = "#fff3cd";
}

document.addEventListener("input", event => {
  if (event.target.id === "from_station" || event.target.id === "to_station") {
    const code = event.target.value;
    const r = findStation(code);

    const nameField = document.getElementById(event.target.id+"_name");

    if (r) {
      nameField.value = r.STATION_NAME;
      nameField.readOnly = true;
      nameField.style.background = "#e9ecef";
    } else {
      nameField.value = "";
      nameField.readOnly = true;
      nameField.style.background = "#ffeaea";

      // create manual entry button if not exists
      const btnId = event.target.id+"_manual_btn";
      if (!document.getElementById(btnId)) {
        const btn = document.createElement("button");
        btn.id = btnId;
        btn.textContent = "Manual Entry";
        btn.style.marginLeft="5px";
        btn.onclick = () => enableManualStation(event.target.id);
        event.target.insertAdjacentElement("afterend", btn);
      }
    }
  }
});
