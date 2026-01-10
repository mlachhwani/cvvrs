/* ============================================================
   MASTER LOADING (CREW / STATION / CLI)
   Source: GitHub Pages Repo (/cvvrs/masters/*.csv)
   ============================================================ */

const MASTER_PATH = "/cvvrs/masters/";

let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* Load CSV from GitHub */
async function loadMasterCSV(filename) {
  const url = MASTER_PATH + filename;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("Master load error:", filename);
    return [];
  }

  const text = await res.text();
  return Papa.parse(text.trim(), { header: true }).data;
}

/* Load all masters */
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

/* LOOKUP HELPERS */
function findStationByCode(code) {
  if (!code) return null;
  return stationMaster.find(x => x.STATION_CODE === code.toUpperCase()) || null;
}
function findCrewById(id) {
  if (!id) return null;
  return crewMaster.find(x => x.CREW_ID === id.toUpperCase()) || null;
}
function findCLIById(id) {
  if (!id) return null;
  return cliMaster.find(x => x.CLI_ID === id.toUpperCase()) || null;
}

/* ============================================================
   DOM BINDINGS (AFTER PAGE LOAD)
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {

  /* CLI */
  document.getElementById("cli_id").addEventListener("change", () => {
    const cli = findCLIById(cli_id.value);
    cli_name.value = cli ? cli.CLI_NAME : "";
    if (!cli) alert("❌ Invalid CLI ID");
  });

  /* LP */
  document.getElementById("lp_id").addEventListener("change", () => {
    const c = findCrewById(lp_id.value);
    if (!c) {
      alert("❌ Invalid LP ID");
      lp_name.value = lp_desig.value = lp_gcli.value = "";
      return;
    }
    lp_name.value  = c.CREW_NAME;
    lp_desig.value = c.DESIGNATION;
    lp_gcli.value  = c.G_CLI;
  });

  /* ALP */
  document.getElementById("alp_id").addEventListener("change", () => {
    const c = findCrewById(alp_id.value);
    if (!c) {
      alert("❌ Invalid ALP ID");
      alp_name.value = alp_desig.value = alp_gcli.value = "";
      return;
    }
    alp_name.value  = c.CREW_NAME;
    alp_desig.value = c.DESIGNATION;
    alp_gcli.value  = c.G_CLI;
  });

  /* FROM Station */
  document.getElementById("from_station").addEventListener("change", () => {
    const s = findStationByCode(from_station.value);
    from_station_name.value = s ? s.STATION_NAME : "";
    if (!s) alert("❌ Invalid FROM Station Code");
  });

  /* TO Station */
  document.getElementById("to_station").addEventListener("change", () => {
    const s = findStationByCode(to_station.value);
    to_station_name.value = s ? s.STATION_NAME : "";
    if (!s) alert("❌ Invalid TO Station Code");
  });

});
