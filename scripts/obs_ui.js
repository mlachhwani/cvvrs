/* ===================================================================
   obs_ui.js
   RESPONSIBLE FOR RENDERING FULL OBSERVATION UI
   ML/PHASE1 — PART2 LOCKED (FULL FILE, ML/01 COMPLIANT)
   =================================================================== */

console.log("obs_ui.js loaded");

function createDropdown(obs) {
  const sel = document.createElement("select");
  sel.className = "obs-select";
  sel.dataset.id = obs.id;
  sel.dataset.default = obs.def;

  if (obs.type === "YESNO") {
    ["YES", "NO"].forEach(v => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    });
  }

  if (obs.type === "YESNO_DAY") {
    ["YES", "NO", "DAY TIME"].forEach(v => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    });
  }

  if (obs.type === "RATING") {
    ["VERY GOOD", "FAIR", "POOR"].forEach(v => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      sel.appendChild(o);
    });
  }

  sel.value = obs.def;
  return sel;
}

function createPhotoInput(obs) {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "image/*";
  inp.className = "obs-photo";
  inp.dataset.id = obs.id;
  return inp;
}

function createObsRow(obs) {
  const row = document.createElement("div");
  row.className = "obs-row";
  row.dataset.id = obs.id;

  const title = document.createElement("div");
  title.className = "obs-title";
  title.textContent = obs.id + ". " + obs.title;

  const sel = createDropdown(obs);
  const photo = createPhotoInput(obs);

  row.appendChild(title);
  row.appendChild(sel);
  row.appendChild(photo);

  return row;
}

function renderSection(sectionName, list) {
  const wrap = document.createElement("div");
  wrap.className = "obs-section";

  const hdr = document.createElement("div");
  hdr.className = "obs-section-header";
  hdr.textContent = sectionName;
  wrap.appendChild(hdr);

  const container = document.createElement("div");
  container.className = "obs-section-grid";

  const lpCol = document.createElement("div");
  lpCol.className = "obs-col";
  const alpCol = document.createElement("div");
  alpCol.className = "obs-col";

  list.forEach(o => {
    const row = createObsRow(o);
    if (o.role === "LP") lpCol.appendChild(row);
    else alpCol.appendChild(row);
  });

  container.appendChild(lpCol);
  container.appendChild(alpCol);
  wrap.appendChild(container);

  return wrap;
}

function renderObservationsUI() {
  if (!window.OBS_MASTER) {
    console.error("OBS_MASTER NOT FOUND");
    return;
  }

  const root = document.getElementById("obs_container");
  root.innerHTML = "";

  const CTO = OBS_MASTER.filter(o => o.sec === "CTO");
  const RUN = OBS_MASTER.filter(o => o.sec === "RUN");
  const HALT = OBS_MASTER.filter(o => o.sec === "HALT");
  const CHO = OBS_MASTER.filter(o => o.sec === "CHO");

  root.appendChild(renderSection("DURING CTO", CTO));
  root.appendChild(renderSection("ON RUN", RUN));
  root.appendChild(renderSection("AT HALTS", HALT));
  root.appendChild(renderSection("AT CHO", CHO));
}

document.addEventListener("DOMContentLoaded", renderObservationsUI);
