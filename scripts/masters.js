const MASTER_PATH = "/cvvrs/assets/masters/";

let stationMaster=[], crewMaster=[], cliMaster=[];

async function loadMasterCSV(filename) {
  const res = await fetch(MASTER_PATH + filename);
  if (!res.ok) return [];
  const txt = await res.text();
  return Papa.parse(txt.trim(), {header:true}).data;
}

async function loadAllMasters() {
  stationMaster = await loadMasterCSV("station_master.csv");
  crewMaster    = await loadMasterCSV("crew_master.csv");
  cliMaster     = await loadMasterCSV("cli_master.csv");

  console.log("Station:", stationMaster.length);
  console.log("Crew:", crewMaster.length);
  console.log("CLI:", cliMaster.length);
}

loadAllMasters();

function findStation(code) {
  return stationMaster.find(x=>x.STATION_CODE===code.toUpperCase()) || {};
}
function findCrew(id) {
  return crewMaster.find(x=>x.CREW_ID===id.toUpperCase()) || {};
}
function findCLI(id) {
  return cliMaster.find(x=>x.CLI_ID===id.toUpperCase()) || {};
}

document.getElementById("cli_id").addEventListener("change", e=>{
  const c = findCLI(e.target.value);
  document.getElementById("cli_name").value = c.CLI_NAME || "";
});

document.getElementById("from_station").addEventListener("change", e=>{
  const st = findStation(e.target.value);
  document.getElementById("from_station_name").value = st.STATION_NAME || "";
});

document.getElementById("to_station").addEventListener("change", e=>{
  const st = findStation(e.target.value);
  document.getElementById("to_station_name").value = st.STATION_NAME || "";
});

document.getElementById("lp_id").addEventListener("change", e=>{
  const c = findCrew(e.target.value);
  document.getElementById("lp_name").value = c.CREW_NAME || "";
  document.getElementById("lp_desig").value = c.DESIGNATION || "";
  document.getElementById("lp_gcli").value = c.G_CLI || "";
});

document.getElementById("alp_id").addEventListener("change", e=>{
  const c = findCrew(e.target.value);
  document.getElementById("alp_name").value = c.CREW_NAME || "";
  document.getElementById("alp_desig").value = c.DESIGNATION || "";
  document.getElementById("alp_gcli").value = c.G_CLI || "";
});
