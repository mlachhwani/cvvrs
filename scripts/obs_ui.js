/* ==========================================================================
   OBSERVATIONS UI RENDER ENGINE (LP + ALP SPLIT)
   FINAL LOCKED FOR: MLACHHWANI / CVVRS PROJECT
   ========================================================================== */

console.log("obs_ui.js loaded");

/* SECTION HEADINGS MAP */
const SEC_LABELS = {
  CTO:  "DURING CTO",
  RUN:  "ON RUN",
  HALT: "AT HALTS",
  CHO:  "AT CHO"
};

/* ==========================================================================
   BUILD UI
   ========================================================================== */
function renderObservationsUI() {
  const container = document.getElementById("obs_container");
  if (!container) return;

  container.innerHTML = "";

  /* group by section */
  const bySection = {};

  OBS_MASTER.forEach(o => {
    if (!bySection[o.sec]) bySection[o.sec] = [];
    bySection[o.sec].push(o);
  });

  /* generate UI per section */
  Object.keys(bySection).forEach(sec => {
    const secWrap = document.createElement("div");
    secWrap.className = "obs-section";

    const hdr = document.createElement("h4");
    hdr.textContent = SEC_LABELS[sec] || sec;
    secWrap.appendChild(hdr);

    /* LP+ALP split */
    const row = document.createElement("div");
    row.className = "obs-row";

    const colLP  = document.createElement("div");
    colLP.className = "obs-col";
    const colALP = document.createElement("div");
    colALP.className = "obs-col";

    /* headers */
    const lpHead = document.createElement("div");
    lpHead.className = "col-head";
    lpHead.textContent = "LOCO PILOT";

    const alpHead = document.createElement("div");
    alpHead.className = "col-head";
    alpHead.textContent = "ASTT. LOCO PILOT";

    colLP.appendChild(lpHead);
    colALP.appendChild(alpHead);

    /* build items */
    bySection[sec].forEach(obs => {
      const targetCol = obs.role === "LP" ? colLP : colALP;
      targetCol.appendChild(buildObsItem(obs));
    });

    row.appendChild(colLP);
    row.appendChild(colALP);
    secWrap.appendChild(row);
    container.appendChild(secWrap);
  });
}

/* ==========================================================================
   BUILD SINGLE OBSERVATION ITEM
   ========================================================================== */
function buildObsItem(obs) {

  const wrap = document.createElement("div");
  wrap.className = "obs-item";

  /* title */
  const lab = document.createElement("div");
  lab.className = "obs-title";
  lab.textContent = obs.title;
  wrap.appendChild(lab);

  /* selector */
  const sel = document.createElement("select");
  sel.className = "obs-select";
  sel.id = "obs_select_" + obs.id;
  sel.dataset.default = obs.default;

  populateDropdown(sel, obs);

  /* change handler → photo mandatory */
  sel.addEventListener("change", () => onValueChanged(obs, sel));

  wrap.appendChild(sel);

  /* PHOTO UPLOAD */
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.className = "photo-input";
  fileInput.id = "obs_photo_" + obs.id;
  fileInput.accept = "image/*";

  wrap.appendChild(fileInput);

  return wrap;
}

/* ==========================================================================
   POPULATE OPTIONS
   ========================================================================== */
function populateDropdown(sel, obs) {
  const opts = OBS_OPTIONS[obs.type] || [];
  opts.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    if (v === obs.default) opt.selected = true;
    sel.appendChild(opt);
  });
}

/* ==========================================================================
   ON VALUE CHANGE → PHOTO REQUIRED LOGIC
   ========================================================================== */
function onValueChanged(obs, sel) {
  const def = sel.dataset.default;
  const cur = sel.value;

  const photo = document.getElementById("obs_photo_" + obs.id);
  const wrap = sel.closest(".obs-item");

  if (!photo || !wrap) return;

  /* ========== RULE: PHOTO MANDATORY IF VALUE != DEFAULT ========== */
  if (cur !== def) {
    wrap.classList.add("need-photo");
  } else {
    wrap.classList.remove("need-photo");
  }
}

/* ==========================================================================
   VALIDATION FUNCTIONS (CALLED BY submit.js)
   ========================================================================== */
window.OBS_UI = {

  /* ------------------------------------------------------------------------
     1) Check all mandatory photos (VALUE != DEFAULT)
     ------------------------------------------------------------------------ */
  checkPhotoMandatories: function() {
    let ok = true;
    let msg = [];

    OBS_MASTER.forEach(obs => {
      const sel = document.getElementById("obs_select_" + obs.id);
      const photo = document.getElementById("obs_photo_" + obs.id);

      if (!sel || !photo) return;

      const def = sel.dataset.default;
      const cur = sel.value;

      if (cur !== def && photo.files.length === 0) {
        ok = false;
        msg.push(`📷 Photo required for: ${obs.title} (${obs.role})`);
      }
    });

    return {ok, msg};
  },

  /* ------------------------------------------------------------------------
     2) Validate rating abnormalities (VERY IMPORTANT)
        If rating changed OR rating != VERY GOOD → MUST fill FINAL REMARKS
     ------------------------------------------------------------------------ */
  requiresAbnormalRemarks: function() {
    let need = false;

    OBS_MASTER.forEach(obs => {
      if (obs.type === "RATING" && obs.abnormalitiesNeeded) {
        const sel = document.getElementById("obs_select_" + obs.id);
        if (!sel) return;
        if (sel.value !== obs.default) need = true;
      }
    });

    return need;
  }
};

/* ==========================================================================
   INIT (DOM READY)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", renderObservationsUI);
