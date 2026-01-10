/* =============================================================================
   submit.js — FINAL FRONTEND SUBMISSION + VALIDATION LOGIC
   LOCKED FOR: MLACHHWANI / CVVRS
   ============================================================================= */

console.log("submit.js loaded");

/* ----------------------------------------------------------------------------- 
   CONFIG — BACKEND ENDPOINT (APPS SCRIPT)
   ───────────────────────────────────────────────────────────────────────────── */
const WEBAPP_URL = "<<<PASTE_YOUR_WEBAPP_URL_HERE>>>";

/* ----------------------------------------------------------------------------- 
   AUTO-SET ANALYSIS DATE (READONLY FIELD)
   ───────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  document.getElementById("analysis_date").value = `${yyyy}-${mm}-${dd}`;
});

/* =============================================================================
   MAIN HANDLER — CLICK EVENT
   ============================================================================= */
document.getElementById("submit_btn").addEventListener("click", onSubmitReport);

async function onSubmitReport() {

  /* lock button */
  const btn = document.getElementById("submit_btn");
  btn.disabled = true;
  btn.textContent = "PROCESSING...";

  /* VALIDATE FRONTEND  -------------------------------------- */
  const v = validateFields();
  if (!v.ok) {
    alert("❌ VALIDATION ERROR:\n" + v.msg.join("\n"));
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* Observation photo mandatory check */
  const ph = OBS_UI.checkPhotoMandatories();
  if (!ph.ok) {
    alert("❌ PHOTO MISSING:\n" + ph.msg.join("\n"));
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* Abnormality check → final remarks must not be blank */
  const abnormalNeed = OBS_UI.requiresAbnormalRemarks();
  const remarks = document.getElementById("remarks").value.trim();
  if (abnormalNeed && remarks === "") {
    alert("❌ REMARKS REQUIRED:\nAt least one abnormal rating detected.\nPlease fill Final Remarks.");
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* COLLECT PAYLOAD  ---------------------------------------- */
  const payload = await buildPayload();

  /* SEND TO BACKEND  ---------------------------------------- */
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {"Content-Type": "application/json"}
    });

    const out = await res.json();

    if (!out.success) {
      alert("❌ BACKEND ERROR:\n" + out.message);
      btn.disabled = false;
      btn.textContent = "SAVE & GENERATE PDF";
      return;
    }

    alert("✅ REPORT SAVED & PDF GENERATED!");
    window.open(out.pdf_url, "_blank");

  } catch(err) {
    console.error(err);
    alert("❌ NETWORK ERROR.\nCheck console for details.");
  }

  btn.disabled = false;
  btn.textContent = "SAVE & GENERATE PDF";
}

/* =============================================================================
   FRONTEND VALIDATION (MANDATORY FIELDS)
   ============================================================================= */
function validateFields() {

  const msg = [];

  const cli_id = value("cli_id");
  const cli_name = value("cli_name");
  const train_no = value("train_no");
  const work_date = value("date_work");
  const loco_no = value("loco_no");
  const fs = value("from_station");
  const fs_name = value("from_station_name");
  const ts = value("to_station");
  const ts_name = value("to_station_name");
  const lp_id = value("lp_id");
  const lp_name = value("lp_name");
  const alp_id = value("alp_id");
  const alp_name = value("alp_name");

  /* Mandatory fields */
  if (cli_id === "") msg.push("CLI ID missing");
  if (cli_name === "") msg.push("CLI NAME missing / invalid");
  if (train_no === "") msg.push("Train No missing");
  if (work_date === "") msg.push("Date of Working missing");
  if (loco_no === "") msg.push("Loco No missing");
  if (fs === "") msg.push("FROM Station Code missing");
  if (fs_name === "") msg.push("FROM Station invalid");
  if (ts === "") msg.push("TO Station Code missing");
  if (ts_name === "") msg.push("TO Station invalid");
  if (lp_id === "") msg.push("LP ID missing");
  if (lp_name === "") msg.push("LP invalid / not found");
  if (alp_id === "") msg.push("ALP ID missing");
  if (alp_name === "") msg.push("ALP invalid / not found");

  return {ok: msg.length === 0, msg};
}

/* Helper */
function value(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/* =============================================================================
   BUILD PAYLOAD FOR BACKEND
   (INCLUDING BASE64 IMAGES)
   ============================================================================= */
async function buildPayload() {

  /* BASE INFO ----------------------------------------------- */
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
    lp_desig: value("lp_desig"),
    lp_gcli: value("lp_gcli"),
    alp_id: value("alp_id"),
    alp_name: value("alp_name"),
    alp_desig: value("alp_desig"),
    alp_gcli: value("alp_gcli"),
    remarks: value("remarks"),
  };

  /* OBSERVATIONS -------------------------------------------- */
  const observations = [];
  for (const obs of OBS_MASTER) {
    const sel = document.getElementById("obs_select_" + obs.id);
    const photo = document.getElementById("obs_photo_" + obs.id);

    const rec = {
      id: obs.id,
      title: obs.title,
      role: obs.role,
      section: obs.sec,
      value: sel?.value || "",
      default: sel?.dataset.default || "",
      photo: null
    };

    if (photo && photo.files.length > 0) {
      rec.photo = await fileToBase64(photo.files[0]);
    }

    observations.push(rec);
  }

  return {base, observations};
}

/* =============================================================================
   UTILITY — FILE TO BASE64
   ============================================================================= */
function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
