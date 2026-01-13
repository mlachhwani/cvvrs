/* ============================================================
 * obs_ui.js — Render Observations UI (ML/01 LOCKED)
 * Author: CVVRS
 * ============================================================
 */

console.log("obs_ui.js loaded");

// Called when OBS_MASTER is ready
document.addEventListener("DOMContentLoaded", () => {
  if (typeof OBS_MASTER === "undefined") {
    console.error("❌ OBS_MASTER missing");
    return;
  }
  renderObservations();
});

/* ============================================================
 * SECTION ORDER (LOCKED)
 *
 * LP & ALP both follow same sequence:
 *  1. During CTO
 *  2. On Run
 *  3. At Halts
 *  4. At the time of CHO
 * ============================================================
 */
const SECTION_ORDER = [
  { sec: "CTO",   title: "SECTION-1: DURING CTO" },
  { sec: "RUN",   title: "SECTION-2: ON RUN" },
  { sec: "HALT",  title: "SECTION-3: AT HALTS" },
  { sec: "CHO",   title: "SECTION-4: AT THE TIME OF CHO" },
];

/* ============================================================
 * MAIN RENDER
 * ============================================================
 */
function renderObservations() {
  const root = document.getElementById("obs_container");
  root.innerHTML = "";

  /* LP BLOCK */
  const lpBlock = document.createElement("div");
  lpBlock.className = "obs-role-block";
  lpBlock.innerHTML = `<h3 class="obs-role-title">LOCO PILOT (LP)</h3>`;
  renderRole(lpBlock, "LP");
  root.appendChild(lpBlock);

  /* ALP BLOCK */
  const alpBlock = document.createElement("div");
  alpBlock.className = "obs-role-block";
  alpBlock.innerHTML = `<h3 class="obs-role-title">ASSISTANT LOCO PILOT (ALP)</h3>`;
  renderRole(alpBlock, "ALP");
  root.appendChild(alpBlock);

  console.log("obs_ui.js → Observations rendered ✔");
}

/* ============================================================
 * RENDER BY ROLE
 * ============================================================
 */
function renderRole(container, role) {
  for (const secDef of SECTION_ORDER) {
    const items = OBS_MASTER.filter(o => o.role === role && o.sec === secDef.sec);
    if (items.length === 0) continue;

    const sec = document.createElement("div");
    sec.className = "obs-section";
    sec.innerHTML = `<h4 class="obs-sec-title">${secDef.title}</h4>`;
    container.appendChild(sec);

    for (const obs of items) {
      sec.appendChild(renderObsRow(obs));
    }
  }
}

/* ============================================================
 * RENDER SINGLE ROW
 * ============================================================
 */
function renderObsRow(obs) {
  const row = document.createElement("div");
  row.className = "obs-row";

  const title = document.createElement("div");
  title.className = "obs-title";
  title.textContent = obs.title;

  const ctrl = document.createElement("div");
  ctrl.className = "obs-ctrl";

  /* DROPDOWN */
  const sel = document.createElement("select");
  sel.id = "obs_select_" + obs.id;
  sel.dataset.default = obs.def || "";

  // Build dropdown options
  if (obs.opts && Array.isArray(obs.opts)) {
    for (const opt of obs.opts) {
      const op = document.createElement("option");
      op.value = opt;
      op.textContent = opt;
      if (opt === obs.def) op.selected = true;
      sel.appendChild(op);
    }
  }

  ctrl.appendChild(sel);

  /* NO BUTTON (visual helper only for now) */
  const btnNo = document.createElement("button");
  btnNo.type = "button";
  btnNo.className = "obs-btn-no";
  btnNo.textContent = "NO";
  btnNo.addEventListener("click", () => sel.value = "NO");
  ctrl.appendChild(btnNo);

  row.appendChild(title);
  row.appendChild(ctrl);

  return row;
}
