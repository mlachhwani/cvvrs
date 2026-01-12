/* =============================================================================
   submit.js — FINAL FRONTEND SUBMISSION + VALIDATION LOGIC
   LOCKED FOR: ML/01 (NO PARTIAL PATCHES, FULL FILE DELIVERY ONLY)
============================================================================= */

console.log("submit.js loaded");

// -----------------------------------------------------------------------------
// BACKEND ENDPOINT  (To be set in Delivery-12 automatically)
// -----------------------------------------------------------------------------
const WEBAPP_URL = "";  // <-- will be injected in Delivery-12

// -----------------------------------------------------------------------------
// ON LOAD → SET ANALYSIS DATE (READONLY)
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}`;

  const fld = document.getElementById("analysis_date");
  if (fld) {
    fld.value = iso;
    fld.setAttribute("readonly", true);
  }
});

// -----------------------------------------------------------------------------
// MAIN HANDLER — BIND SAVE BUTTON
// -----------------------------------------------------------------------------
const BTN = document.getElementById("submit_btn");
if (BTN) BTN.addEventListener("click", submitReport);

// -----------------------------------------------------------------------------
// MAIN PIPELINE
// -----------------------------------------------------------------------------
async function submitReport() {

  // freeze button
  freezeButton(true);

  // 1) field validation
  const v = validateFields();
  if (!v.ok) return stop("❌ VALIDATION ERROR:\n" + v.msg.join("\n"));

  // 2) observation validation (photo & abnormalities)
  const ov = validateObservations();
  if (!ov.ok) return stop("❌ OBSERVATION ERROR:\n" + ov.msg.join("\n"));

  // 3) build payload for backend
  const payload = await buildPayload();

  // 4) push to backend
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {"Content-Type": "application/json"}
    });

    const out = await res.json();
    if (!out.success) {
      return stop("❌ BACKEND ERROR:\n" + out.message);
    }

    alert("✅ REPORT SAVED SUCCESSFULLY!\nOpening PDF...");
    if (out.pdfLink) window.open(out.pdfLink, "_blank");

  } catch(e) {
    console.error(e);
    return stop("❌ NETWORK ERROR — check console.");
  }

  freezeButton(false);
}

// -----------------------------------------------------------------------------
// VALIDATE CORE FIELDS
// -----------------------------------------------------------------------------
function validateFields() {
  const e = msg => errs.push(msg);
  const value = id => document.getElementById(id)?.value.trim() || "";

  const errs = [];

  const cli_id     = value("cli_id");
  const cli_name   = value("cli_name");
  const train_no   = value("train_no");
  const date_work  = value("date_work");
  const loco_no    = value("loco_no");
  const fs         = value("from_station");
  const fs_name    = value("from_station_name");
  const ts         = value("to_station");
  const ts_name    = value("to_station_name");
  const lp_id      = value("lp_id");
  const lp_name    = value("lp_name");
  const alp_id     = value("alp_id");
  const alp_name   = value("alp_name");

  if (!cli_id)   e("CLI ID missing");
  if (!cli_name) e("CLI NAME invalid");
  if (!train_no) e("Train Number missing");
  if (!date_work) e("Date of Working missing");
  if (!loco_no) e("Loco No missing");
  if (!fs)      e("FROM Station Code missing");
  if (!fs_name) e("FROM Station invalid");
  if (!ts)      e("TO Station Code missing");
  if (!ts_name) e("TO Station invalid");
  if (!lp_id)   e("LP ID missing");
  if (!lp_name) e("LP not found");
  if (!alp_id)  e("ALP ID missing");
  if (!alp_name)e("ALP not found");

  return {ok: errs.length === 0, msg: errs};
}

// -----------------------------------------------------------------------------
// VALIDATE OBSERVATIONS (PHOTO & ABNORMALITY RULES)
// -----------------------------------------------------------------------------
function validateObservations() {
  const errs = [];
  const rows = document.querySelectorAll(".obs-row");

  rows.forEach(row => {
    const id = row.dataset.id;
    const sel = row.querySelector("select");
    const abn = row.querySelector(".obs-abn");
    const photo = row.querySelector("input[type='file']");
    const def = sel.dataset.default;
    const val = sel.value;

    const changed = (val !== def);

    // rule: if changed → photo required
    if (changed && photo.files.length === 0) {
      errs.push(`Photo required for Obs ${id}`);
    }

    // rule: if rating & not "VERY GOOD" → abn + photo required
    if (sel.dataset.type === "RATING" && val !== "VERY GOOD") {
      if (!abn.value.trim()) errs.push(`Abnormality required for Rating Obs ${id}`);
      if (photo.files.length === 0) errs.push(`Photo required for Rating Obs ${id}`);
    }
  });

  return {ok: errs.length === 0, msg: errs};
}

// -----------------------------------------------------------------------------
// BUILD PAYLOAD (BASE INFO + OBS + BASE64 PHOTOS)
// -----------------------------------------------------------------------------
async function buildPayload() {
  const value = id => document.getElementById(id)?.value.trim() || "";
  const base = {
    analysis_date : value("analysis_date"),
    cli_id        : value("cli_id"),
    cli_name      : value("cli_name"),
    train_no      : value("train_no"),
    date_work     : value("date_work"),
    loco_no       : value("loco_no"),
    from_station  : value("from_station"),
    from_station_name: value("from_station_name"),
    to_station    : value("to_station"),
    to_station_name  : value("to_station_name"),
    lp_id         : value("lp_id"),
    lp_name       : value("lp_name"),
    alp_id        : value("alp_id"),
    alp_name      : value("alp_name"),
    remarks       : value("remarks")
  };

  const observations = [];
  const rows = document.querySelectorAll(".obs-row");

  for (const row of rows) {
    const id = row.dataset.id;
    const sel = row.querySelector("select");
    const abn = row.querySelector(".obs-abn");
    const photo = row.querySelector("input[type='file']");

    const rec = {
      id:id,
      value:sel.value,
      default:sel.dataset.default,
      type:sel.dataset.type,
      abnormalities:abn ? abn.value.trim() : "",
      photo:null
    };

    if (photo && photo.files.length > 0) {
      rec.photo = await fileToBase64(photo.files[0]);
    }

    observations.push(rec);
  }

  return {base, observations};
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
function freezeButton(state) {
  if (!BTN) return;
  BTN.disabled = state;
  BTN.textContent = state ? "Processing..." : "Save & Generate PDF";
}

function stop(msg) {
  alert(msg);
  freezeButton(false);
  return false;
}

function fileToBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}
