/* =============================================================================
    OBSERVATION UI — Delivery-8 (FULL | ML/01)
    Works with: obs_master.js + validation + submit
============================================================================= */

console.log("obs_ui.js loaded");

/* ========= DOM GET ========= */
function D(id) { return document.getElementById(id); }

/* ========= CREATE OPTION ========= */
function opt(val) {
  const o = document.createElement("option");
  o.value = val;
  o.textContent = val;
  return o;
}

/* ========= CREATE DROPDOWN ========= */
function makeSelect(obs) {
  const sel = document.createElement("select");
  sel.className = "obs-select";
  sel.dataset.id = obs.id;
  sel.dataset.default = obs.default;

  if (obs.type === "YESNO") {
    sel.append(opt("YES"), opt("NO"));
  }
  if (obs.type === "YESNO_DAY") {
    sel.append(opt("YES"), opt("NO"), opt("DAY TIME"));
  }
  if (obs.type === "RATING") {
    sel.append(opt("VERY GOOD"), opt("FAIR"), opt("POOR"));
  }

  sel.value = obs.default;

  sel.onchange = () => handleChange(obs.id);
  return sel;
}

/* ========= CREATE PHOTO INPUT ========= */
function makePhoto(obs) {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "image/*";
  inp.className = "obs-photo";
  inp.dataset.id = obs.id;
  return inp;
}

/* ========= CREATE ABNORMAL TEXT ========= */
function makeAbn(obs) {
  const t = document.createElement("input");
  t.type = "text";
  t.placeholder = "Abnormality details...";
  t.className = "obs-abn";
  t.dataset.id = obs.id;
  t.style.display = "none";
  return t;
}

/* ========= HANDLE CHANGE (MANDATORY RULES) ========= */
function handleChange(id) {

  const sel = document.querySelector(`.obs-select[data-id="${id}"]`);
  const photo = document.querySelector(`.obs-photo[data-id="${id}"]`);
  const abn = document.querySelector(`.obs-abn[data-id="${id}"]`);

  const def = sel.dataset.default;
  const val = sel.value;

  // PHOTO MANDATORY if changed from default
  if (val !== def) {
    photo.style.border = "2px solid red";
  } else {
    photo.style.border = "";
  }

  // RATING abnormal logic
  const obs = OBS_MASTER.find(o => o.id === id);
  if (obs.type === "RATING") {
    if (val !== "VERY GOOD") {
      abn.style.display = "block";
    } else {
      abn.style.display = "none";
      abn.value = "";
    }
  }
}

/* =============================================================================
    RENDER UI
============================================================================= */
function renderObsUI() {

  const box = D("obs_container");
  box.innerHTML = "";

  const sections = {
    CTO: OBS_MASTER.filter(o=>o.id>=1 && o.id<=6),
    ONRUN: OBS_MASTER.filter(o=>o.id>=7 && o.id<=20),
    HALTS: OBS_MASTER.filter(o=>o.id>=21 && o.id<=30),
    CHO: OBS_MASTER.filter(o=>o.id>=31 && o.id<=34),
  };

  for (const [sect, arr] of Object.entries(sections)) {

    const title = document.createElement("h4");
    title.textContent = `SECTION: ${sect}`;
    box.append(title);

    const table = document.createElement("table");
    table.className = "obs-table";

    arr.forEach(obs => {
      const row = document.createElement("tr");

      const c1 = document.createElement("td");
      c1.textContent = `${obs.id}. ${obs.title} (${obs.role})`;

      const c2 = document.createElement("td");
      c2.append(makeSelect(obs));

      const c3 = document.createElement("td");
      c3.append(makePhoto(obs));

      const c4 = document.createElement("td");
      c4.append(makeAbn(obs));

      row.append(c1,c2,c3,c4);
      table.append(row);
    });

    box.append(table);
  }
}

/* =============================================================================
    COLLECT OBSERVATION RESULTS
============================================================================= */
function collectObservations() {

  const out = [];

  OBS_MASTER.forEach(obs => {
    const sel = document.querySelector(`.obs-select[data-id="${obs.id}"]`);
    const photo = document.querySelector(`.obs-photo[data-id="${obs.id}"]`);
    const abn = document.querySelector(`.obs-abn[data-id="${obs.id}"]`);

    out.push({
      id: obs.id,
      title: obs.title,
      role: obs.role,
      type: obs.type,
      default: obs.default,
      value: sel.value,
      abnormalities: abn?.value || "",
      photoFile: photo.files.length ? photo.files[0] : null
    });
  });

  return out;
}

/* =============================================================================
    EXPORT FORM API
============================================================================= */
window.FORM = {
  renderObservations: renderObsUI,
  collectObservations
};

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
  renderObsUI();
});
