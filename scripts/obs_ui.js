/* =============================================================================
   obs_ui.js — RENDER OBSERVATIONS INTO UI (FULL FILE)
   DEPENDS ON:
     → obs_master.js
   ============================================================================= */

console.log("obs_ui.js loaded");

/* -----------------------------------------------------------------------------
   OPTION SETS PER TYPE
   ----------------------------------------------------------------------------- */
const OPTS_YESNO     = ["YES","NO"];
const OPTS_YESNO_DAY = ["YES","NO","DAY TIME"];
const OPTS_RATING    = ["VERY GOOD","FAIR","POOR"];

/* -----------------------------------------------------------------------------
   SECTION HEADERS
   ----------------------------------------------------------------------------- */
const SECTION_TITLES = {
  1: "SECTION-1: DURING CTO",
  2: "SECTION-2: ON RUN",
  3: "SECTION-3: AT HALTS",
  4: "SECTION-4: AT CHO"
};

/* -----------------------------------------------------------------------------
   Render helper: returns <option> HTML for dropdown
   ----------------------------------------------------------------------------- */
function buildSelectOptions(type, defVal) {
  let opts = [];

  if (type === "YESNO")      opts = OPTS_YESNO;
  if (type === "YESNO_DAY")  opts = OPTS_YESNO_DAY;
  if (type === "RATING")     opts = OPTS_RATING;

  return opts.map(v => `<option value="${v}" ${v===defVal ? "selected" : ""}>${v}</option>`).join("");
}

/* -----------------------------------------------------------------------------
   MAIN RENDER — called on DOMContentLoaded
   ----------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const lpBox  = document.getElementById("obs_container_lp");
  const alpBox = document.getElementById("obs_container_alp");

  if (!lpBox || !alpBox) {
    console.error("❌ obs_ui.js: Container missing in index.html");
    return;
  }

  /* group by section then role */
  for (let sec = 1; sec <= 4; sec++) {

    // Section header LP
    const lpHeader = document.createElement("h4");
    lpHeader.textContent = SECTION_TITLES[sec];
    lpHeader.style.marginTop = "12px";
    lpBox.appendChild(lpHeader);

    // Section header ALP
    const alpHeader = document.createElement("h4");
    alpHeader.textContent = SECTION_TITLES[sec];
    alpHeader.style.marginTop = "12px";
    alpBox.appendChild(alpHeader);

    // LP items for section
    OBS_MASTER.filter(o => o.sec===sec && o.role==="LP").forEach(o => {
      const row = document.createElement("div");
      row.className = "obs-row";

      row.innerHTML = `
        <label class="obs-title">${o.title}</label>
        <select id="obs_sel_${o.id}" data-type="${o.type}" data-def="${o.def}">
          ${buildSelectOptions(o.type, o.def)}
        </select>
        <input type="file" id="obs_pic_${o.id}" accept="image/*" style="display:none;">
      `;

      lpBox.appendChild(row);
    });

    // ALP items for section
    OBS_MASTER.filter(o => o.sec===sec && o.role==="ALP").forEach(o => {
      const row = document.createElement("div");
      row.className = "obs-row";

      row.innerHTML = `
        <label class="obs-title">${o.title}</label>
        <select id="obs_sel_${o.id}" data-type="${o.type}" data-def="${o.def}">
          ${buildSelectOptions(o.type, o.def)}
        </select>
        <input type="file" id="obs_pic_${o.id}" accept="image/*" style="display:none;">
      `;

      alpBox.appendChild(row);
    });
  }

  console.log("obs_ui.js → Observations rendered ✔");
});
