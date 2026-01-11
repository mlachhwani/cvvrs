/* ============================================================================
   OBS_UI.js — LP LEFT + ALP RIGHT RENDERING
   ML/PHASE2/STEP11 FINAL
   ============================================================================ */

console.log("OBS_UI LOADED");

document.addEventListener("DOMContentLoaded", () => {
  renderObservationUI();
});

/* ==========================================================
   BUILD UI
========================================================== */
function renderObservationUI() {

  const root = document.getElementById("obs_container");
  root.innerHTML = "";

  const lpCol = document.createElement("div");
  lpCol.className = "obs-column";

  const alpCol = document.createElement("div");
  alpCol.className = "obs-column";

  const sections = ["CTO","ONRUN","HALTS","CHO"];

  sections.forEach(sec => {

    /* LP SECTION */
    const lpSec = OBS_MASTER.filter(o => o.section === sec && o.role === "LP");
    if (lpSec.length > 0) {
      const head = document.createElement("h4");
      head.textContent = `SECTION: ${sec} (LP)`;
      lpCol.appendChild(head);

      lpSec.forEach(o => lpCol.appendChild(buildObsBlock(o)));
    }

    /* ALP SECTION */
    const alpSec = OBS_MASTER.filter(o => o.section === sec && o.role === "ALP");
    if (alpSec.length > 0) {
      const head = document.createElement("h4");
      head.textContent = `SECTION: ${sec} (ALP)`;
      alpCol.appendChild(head);

      alpSec.forEach(o => alpCol.appendChild(buildObsBlock(o)));
    }

  });

  root.appendChild(lpCol);
  root.appendChild(alpCol);
}

/* ==========================================================
   BLOCK BUILDER
========================================================== */
function buildObsBlock(o) {
  const div = document.createElement("div");
  div.className = "obs-block";

  const t = document.createElement("div");
  t.className = "obs-title";
  t.textContent = `${o.id}. ${o.title}`;
  div.appendChild(t);

  const row = document.createElement("div");
  row.className = "obs-row";

  /* DROPDOWN */
  const sel = document.createElement("select");
  sel.dataset.id = o.id;
  sel.dataset.default = o.default;

  if (o.type === "YESNO") {
    ["YES","NO"].forEach(v => sel.add(new Option(v,v)));
  }
  if (o.type === "YESNO_DAY") {
    ["YES","NO","DAY TIME"].forEach(v => sel.add(new Option(v,v)));
  }
  if (o.type === "RATING") {
    ["VERY GOOD","FAIR","POOR"].forEach(v => sel.add(new Option(v,v)));
  }
  sel.value = o.default;
  row.appendChild(sel);

  /* PHOTO */
  const file = document.createElement("input");
  file.type = "file";
  file.dataset.id = o.id;
  file.accept = "image/*";
  row.appendChild(file);

  div.appendChild(row);

  return div;
}
