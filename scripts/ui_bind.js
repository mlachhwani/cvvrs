/************************************************************
 * ui_bind.js — Autofill Binding for Masters (ML/01)
 ************************************************************/

console.log("ui_bind.js loaded");

/* ===================== CLI Autofill ===================== */
function bindCliAutocomplete() {
  const cli_id = document.getElementById("cli_id");
  const cli_name = document.getElementById("cli_name");

  cli_id.addEventListener("change", () => {
    const rec = MASTERS.findCLIById(cli_id.value);
    if (!rec) {
      cli_name.value = "";
      alert("❌ Invalid CLI ID");
      return;
    }
    cli_name.value = rec.CLI_NAME;
  });
}

/* ===================== CREW Autofill ===================== */
function bindCrewAutocomplete() {
  const lp_id  = document.getElementById("lp_id");
  const lp_name = document.getElementById("lp_name");
  const lp_desig = document.getElementById("lp_desig");
  const lp_gcli = document.getElementById("lp_gcli");

  const alp_id  = document.getElementById("alp_id");
  const alp_name = document.getElementById("alp_name");
  const alp_desig = document.getElementById("alp_desig");
  const alp_gcli = document.getElementById("alp_gcli");

  lp_id.addEventListener("change", () => {
    const rec = MASTERS.findCrewById(lp_id.value);
    if (!rec) {
      lp_name.value = lp_desig.value = lp_gcli.value = "";
      alert("❌ Invalid LP ID");
      return;
    }
    lp_name.value = rec.CREW_NAME;
    lp_desig.value = rec.DESIGNATION;
    lp_gcli.value = rec.G_CLI;
  });

  alp_id.addEventListener("change", () => {
    const rec = MASTERS.findCrewById(alp_id.value);
    if (!rec) {
      alp_name.value = alp_desig.value = alp_gcli.value = "";
      alert("❌ Invalid ALP ID");
      return;
    }
    alp_name.value = rec.CREW_NAME;
    alp_desig.value = rec.DESIGNATION;
    alp_gcli.value = rec.G_CLI;
  });
}

/* ===================== STATION Autofill ===================== */
function bindStationAutocomplete() {
  const fs = document.getElementById("from_station");
  const fsn = document.getElementById("from_station_name");

  const ts = document.getElementById("to_station");
  const tsn = document.getElementById("to_station_name");

  fs.addEventListener("change", () => {
    const rec = MASTERS.findStationByCode(fs.value);
    fsn.value = rec ? rec.STATION_NAME : "";
    if (!rec) alert("❌ Invalid FROM Station");
  });

  ts.addEventListener("change", () => {
    const rec = MASTERS.findStationByCode(ts.value);
    tsn.value = rec ? rec.STATION_NAME : "";
    if (!rec) alert("❌ Invalid TO Station");
  });
}

/* ===================== INIT BINDING ===================== */
document.addEventListener("DOMContentLoaded", () => {
  bindCliAutocomplete();
  bindCrewAutocomplete();
  bindStationAutocomplete();
});
