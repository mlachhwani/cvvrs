/* =============================================================================
   submit.js — FINAL FRONTEND SUBMISSION + VALIDATION LOGIC (LOCKED)
   Project: CVVRS (ML/01 Compliant)
============================================================================= */

console.log("submit.js loaded");

/* ----------------------------------------------------------------------------- 
   CONFIG — BACKEND ENDPOINT (APPS SCRIPT)
----------------------------------------------------------------------------- */
const WEBAPP_URL = "<<<PASTE_YOUR_WEBAPP_URL_HERE>>>";

/* ----------------------------------------------------------------------------- 
   AUTO-SET ANALYSIS DATE (READONLY)
----------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const fld = document.getElementById("analysis_date");
  if (fld) {
    fld.value = `${yyyy}-${mm}-${dd}`;
    fld.setAttribute("readonly", true);
    fld.style.backgroundColor = "#eee";
  }
});

/* =============================================================================
   CLICK EVENT
============================================================================= */
const btn = document.getElementById("submit_btn");
if (btn) {
  btn.addEventListener("click", onSubmitReport);
}

async function onSubmitReport() {

  lockButton(true);

  /* ---------- STAGE-1 BASIC FIELD VALIDATION ---------- */
  const basic = validateFields();
  if (!basic.ok) {
    alert("❌ VALIDATION ERROR:\n" + basic.msg.join("\n"));
    lockButton(false);
    return;
  }

  /* ---------- STAGE-2 OBSERVATION VALIDATION ---------- */
  const obsCheck = await validateObservationRules();
  if (!obsCheck.ok) {
    alert("❌ OBSERVATION ERROR:\n" + obsCheck.msg.join("\n"));
    lockButton(false);
    return;
  }

  /* ---------- STAGE-3 REMARKS VALIDATION ---------- */
  if (obsCheck.abnormalExists) {
    const r = value("remarks");
    if (r === "" || r.toUpperCase() === "NO ABNORMALITIES OBSERVED") {
      alert("❌ FINAL REMARKS REQUIRED for Abnormal Observations.");
      lockButton(false);
      return;
    }
  }

  /* ---------- STAGE-4 BUILD PAYLOAD ---------- */
  const payload = await buildPayload();

  /* ---------- STAGE-5 SEND TO BACKEND ---------- */
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {"Content-Type":"application/json"}
    });
    const out = await res.json();

    if (!out.success) {
      alert("❌ BACKEND ERROR:\n" + out.message);
      lockButton(false);
      return;
    }

    alert("✅ REPORT SAVED & PDF GENERATED SUCCESSFULLY!");
    if (out.pdf_url) window.open(out.pdf_url, "_blank");

  } catch (err) {
    console.error(err);
    alert("❌ NETWORK / SERVER ERROR — Check Console.");
  }

  lockButton(false);
}

/* =============================================================================
   BASIC FIELD VALIDATION
============================================================================= */
function validateFields() {

  const msg = [];

  const cli_id = value("cli_id");
  const cli_name = value("cli_name");
  const train_no = value("train_no");
  const date_work = value("date_work");
  const loco_no = value("loco_no");
  const fs = value("from_station");
  const fs_name = value("from_station_name");
  const ts = value("to_station");
  const ts_name = value("to_station_name");
  const lp_id = value("lp_id");
  const lp_name = value("lp_name");
  const alp_id = value("alp_id");
  const alp_name = value("alp_name");

  if (!cli_id) msg.push("CLI ID missing");
  if (!cli_name) msg.push("CLI NAME invalid");
  if (!train_no) msg.push("Train No missing");
  if (!date_work) msg.push("Date of Working missing");
  if (!loco_no) msg.push("Loco No missing");
  if (!fs) msg.push("From Station (CODE) missing");
  if (!fs_name) msg.push("From Station invalid");
  if (!ts) msg.push("To Station (CODE) missing");
  if (!ts_name) msg.push("To Station invalid");
  if (!lp_id) msg.push("LP ID missing");
  if (!lp_name) msg.push("LP invalid");
  if (!alp_id) msg.push("ALP ID missing");
  if (!alp_name) msg.push("ALP invalid");

  return { ok: msg.length === 0, msg };
}

/* =============================================================================
   OBSERVATION VALIDATION (PHOTO + ABNORMAL)
============================================================================= */
async function validateObservationRules() {

  const msg = [];
  let abnormalExists = false;

  for (const obs of window.OBS_MASTER) {
    const sel = getSel(obs.id);
    const val = sel ? sel.value : "";
    const def = obs.def;
    const photo = getPhoto(obs.id);
    const changed = (val !== def);

    // YESNO & YESNO_DAY changed → photo mandatory
    if ((obs.type === "YESNO" || obs.type === "YESNO_DAY") && changed) {
      if (!photo) msg.push(`PHOTO REQUIRED: Obs#${obs.id} (${obs.title})`);
    }

    // RATING abnormal → photo + remarks mandatory
    if (obs.type === "RATING" && val !== "VERY GOOD") {
      abnormalExists = true;
      if (!photo) msg.push(`PHOTO REQUIRED (Rating Change): Obs#${obs.id}`);
    }
  }

  return { ok: msg.length === 0, msg, abnormalExists };
}

/* =============================================================================
   BUILD PAYLOAD FOR BACKEND
============================================================================= */
async function buildPayload() {

  const base = {
    analysis_date: value("analysis_date"),
    cli_id: value("cli_id"),
    cli_name: value("cli_name"),
    train_no: value("train_no"),
    date_work: value("date_work"),
    loco_no: value("loco_no"),
    from_station: value("from_station"),
    from_station_name: value("from_station_name"),
    to_station: value("to_station"),
    to_station_name: value("to_station_name"),
    lp_id: value("lp_id"),
    lp_name: value("lp_name"),
    alp_id: value("alp_id"),
    alp_name: value("alp_name"),
    remarks: value("remarks")
  };

  const observations = [];
  for (const obs of window.OBS_MASTER) {
    const sel = getSel(obs.id);
    const photoFile = getPhotoFile(obs.id);

    const rec = {
      id: obs.id,
      sec: obs.sec,
      role: obs.role,
      type: obs.type,
      title: obs.title,
      def: obs.def,
      value: sel ? sel.value : "",
      photo: null
    };

    if (photoFile) {
      rec.photo = await fileToBase64(photoFile);
    }

    observations.push(rec);
  }

  return { base, observations };
}

/* =============================================================================
   HELPERS
============================================================================= */
function getSel(id) {
  return document.getElementById(`obs_sel_${id}`);
}
function getPhoto(id) {
  const f = document.getElementById(`obs_photo_${id}`);
  return (f && f.files.length > 0) ? f.files[0].name : null;
}
function getPhotoFile(id) {
  const f = document.getElementById(`obs_photo_${id}`);
  return (f && f.files.length > 0) ? f.files[0] : null;
}
function value(id) {
  const v = document.getElementById(id);
  return v ? v.value.trim() : "";
}
function lockButton(state) {
  if (!btn) return;
  btn.disabled = state;
  btn.textContent = state ? "PROCESSING..." : "SAVE & GENERATE PDF";
}
function fileToBase64(file) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.readAsDataURL(file);
  });
}
