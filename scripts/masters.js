/* ==============================
   MASTER LOADER FOR CSV FILES
   ============================== */

const MASTER_PATH = "masters/";

let stationMaster = [];
let crewMaster = [];
let cliMaster = [];

/* Load single master CSV */
async function loadCSV(filename) {
  const res = await fetch(MASTER_PATH + filename);
  if (!res.ok) return [];
  const text = await res.text();
  return Papa.parse(text, { header: true }).data;
}

/* Load all masters on startup */
async function loadMasters() {
  cliMaster = await loadCSV("cli_master.csv");
  crewMaster = await loadCSV("crew_master.csv");
  stationMaster = await loadCSV("station_master.csv");
}

loadMasters();

/* ===== LOOKUP FUNCTIONS ===== */

function findCLI(id) {
  id = id.trim().toUpperCase();
  return cliMaster.find(x => x.CLI_ID === id) || null;
}

function findCrew(id) {
  id = id.trim().toUpperCase();
  return crewMaster.find(x => x.CREW_ID === id) || null;
}

function findStation(code) {
  code = code.trim().toUpperCase();
  return stationMaster.find(x => x.STATION_CODE === code) || null;
}

/* ===== UI Autofill Hooks ===== */

document.getElementById("cli_id").addEventListener("change", () => {
  const item = findCLI(cli_id.value);
  cli_name.value = item ? item.CLI_NAME : "";
});

document.getElementById("from_station").addEventListener("change", () => {
  const st = findStation(from_station.value);
  from_station_name.value = st ? st.STATION_NAME : "";
});

document.getElementById("to_station").addEventListener("change", () => {
  const st = findStation(to_station.value);
  to_station_name.value = st ? st.STATION_NAME : "";
});

document.getElementById("lp_id").addEventListener("change", () => {
  const c = findCrew(lp_id.value);
  lp_name.value = c ? c.CREW_NAME : "";
  lp_desig.value = c ? c.DESIGNATION : "";
  lp_gcli.value = c ? c.G_CLI : "";
});

document.getElementById("alp_id").addEventListener("change", () => {
  const c = findCrew(alp_id.value);
  alp_name.value = c ? c.CREW_NAME : "";
  alp_desig.value = c ? c.DESIGNATION : "";
  alp_gcli.value = c ? c.G_CLI : "";
});
