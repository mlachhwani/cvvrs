/********************************************************
 * submit.js — FINAL FRONTEND SUBMISSION PIPELINE
 * ML/01 LOCKED — FULL FILE ONLY, NO PARTIAL EDITING
 ********************************************************/

console.log("submit.js loaded");

/* =====================================================
   AUTO-SET ANALYSIS DATE (read-only as per ML rules)
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  document.getElementById("analysis_date").value = `${yyyy}-${mm}-${dd}`;
});

/* =====================================================
   MAIN BUTTON HANDLER
   ===================================================== */
async function onSubmitFinalReport() {
  const btn = document.getElementById("submit_btn");
  btn.disabled = true;
  btn.textContent = "PROCESSING...";

  /* 1. Mandatory Field Validation */
  const v = validateRequiredFields();
  if (!v.ok) {
    alert("❌ VALIDATION ERROR:\n" + v.msg.join("\n"));
    resetBtn();
    return;
  }

  /* 2. Observation & Photo validation */
  const ph = OBS_UI.checkPhotoMandatories();
  if (!ph.ok) {
    alert("❌ PHOTO MISSING:\n" + ph.msg.join("\n"));
    resetBtn();
    return;
  }

  const abnormalNeed = OBS_UI.requiresAbnormalRemarks();
  const remarks = document.getElementById("remarks").value.trim();
  if (abnormalNeed && remarks === "") {
    alert("❌ REMARKS REQUIRED:\nAbnormal performance detected.");
    resetBtn();
    return;
  }

  /* 3. Duplicate check (Frontend placeholder) */
  const dup = await API.validateDuplicateFrontend();
  if (dup.duplicate) {
    alert("❌ DUPLICATE ENTRY BLOCKED!");
    resetBtn();
    return;
  }

  /* 4. Build Payload (base + observations + PDF) */
  const payload = await buildPayloadForBackend();

  /* 5. Send to Backend */
  const out = await API.uploadPDF_Base64(payload);
  if (!out.success) {
    alert("❌ BACKEND ERROR:\n" + out.message);
    resetBtn();
    return;
  }

  /* 6. Success Feedback */
  alert("✅ REPORT SAVED & PDF STORED!\n\n" + out.pdf_url);
  window.open(out.pdf_url, "_blank");

  resetBtn();
}

/* =====================================================
   BUTTON RESET
   ===================================================== */
function resetBtn() {
  const btn = document.getElementById("submit_btn");
  btn.disabled = false;
  btn.textContent = "SAVE & GENERATE PDF";
}

/* =====================================================
   FIELD VALIDATION
   ===================================================== */
function validateRequiredFields() {
  const msg = [];

  const required = [
    "cli_id","cli_name",
    "train_no","date_work",
    "loco_no","from_station","to_station",
    "lp_id","lp_name",
    "alp_id","alp_name"
  ];

  required.forEach(id => {
    if (!value(id)) msg.push(id + " missing/invalid");
  });

  return {ok: msg.length===0, msg};
}

function value(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/* =====================================================
   BUILD FINAL PAYLOAD FOR BACKEND
   ===================================================== */
async function buildPayloadForBackend() {
  const base = {
    analysis_date: value("analysis_date"),
    cli_id: value("cli_id"),
    cli_name: value("cli_name"),
    train_no: value("train_no"),
    date_work: value("date_work"),
    loco_no: value("loco_no"),
    from_station: value("from_station_name"),
    to_station: value("to_station_name"),
    lp_id: value("lp_id"),
    lp_name: value("lp_name"),
    alp_id: value("alp_id"),
    alp_name: value("alp_name"),
    remarks: value("remarks"),
  };

  const obs = OBS_UI.collectObsFull();

  /* Generate PDF (Base64) */
  const pdfObj = await PDF_ENGINE.generateBase64(base, obs);

  return {
    base,
    observations: obs,
    fileName: pdfObj.filename,
    base64: pdfObj.base64
  };
}

/* =====================================================
   BIND BUTTON EVENT
   ===================================================== */
document.getElementById("submit_btn").addEventListener("click", onSubmitFinalReport);
