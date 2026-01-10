/* ============================================================
   MASTER LOADING (CREW / STATION / CLI)
   Source: GitHub Repo (assets/masters/*.csv)
   ============================================================ */

const MASTER_PATH = "./assets/masters/";

let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* ============================================================
   CSV LOADER
   ============================================================ */
async function loadMasterCSV(filename) {
  const url = MASTER_PATH + filename;
  const response = await fetch(url);

  if (!response.ok) {
    console.error("Master load error: ", filename);
    return [];
  }

  const text = await response.text();
  const rows = Papa.parse(text.trim(), { header: true }).data;
  return rows;
}

/* ============================================================
   LOAD ALL MASTERS
   ============================================================ */
async function loadAllMasters() {
  console.log("Loading master CSVs from GitHub...");

  stationMaster = await loadMasterCSV("station_master.csv");
  crewMaster    = await loadMasterCSV("crew_master.csv");
  cliMaster     = await loadMasterCSV("cli_master.csv");

  console.log("Station Master:", stationMaster.length);
  console.log("Crew Master:", crewMaster.length);
  console.log("CLI Master:", cliMaster.length);
}

loadAllMasters();

/* ============================================================
   LOOKUP FUNCTIONS
   ============================================================ */
function findStationByCode(code) {
  code = code.trim().toUpperCase();
  return stationMaster.find(x => x.STATION_CODE === code) || null;
}

function findCrewById(id) {
  id = id.trim().toUpperCase();
  return crewMaster.find(x => x.CREW_ID === id) || null;
}

function findCLIById(id) {
  id = id.trim().toUpperCase();
  return cliMaster.find(x => x.CLI_ID === id) || null;
}

/* ============================================================
   UI AUTOFILL HANDLERS (RUN AFTER DOM READY)
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {

  // CLI autofill
  document.getElementById("cli_id").addEventListener("change", () => {
    const id = document.getElementById("cli_id").value;
    const cli = findCLIById(id);

    if (!cli) {
      alert("❌ Invalid CLI ID");
      document.getElementById("cli_name").value = "";
      return;
    }
    document.getElementById("cli_name").value = cli.CLI_NAME;
  });

  // LP autofill
  document.getElementById("lp_id").addEventListener("change", () => {
    const id = document.getElementById("lp_id").value;
    const crew = findCrewById(id);

    if (!crew) return alert("❌ Invalid LP ID");
    console.log("LP:", crew.CREW_NAME, crew.DESIGNATION, crew.G_CLI);
  });

  // ALP autofill
  document.getElementById("alp_id").addEventListener("change", () => {
    const id = document.getElementById("alp_id").value;
    const crew = findCrewById(id);

    if (!crew) return alert("❌ Invalid ALP ID");
    console.log("ALP:", crew.CREW_NAME, crew.DESIGNATION, crew.G_CLI);
  });

  // FROM station
  document.getElementById("from_station").addEventListener("change", () => {
    const code = document.getElementById("from_station").value;
    if (!findStationByCode(code)) alert("❌ Invalid FROM Station Code");
  });

  // TO station
  document.getElementById("to_station").addEventListener("change", () => {
    const code = document.getElementById("to_station").value;
    if (!findStationByCode(code)) alert("❌ Invalid TO Station Code");
  });

});

/* ============================================================
   EXPORT
   ============================================================ */
window.MASTERS = {
  findCLIById,
  findCrewById,
  findStationByCode
};
