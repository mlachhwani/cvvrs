/* ======================================================================
   submit.js
   FRONTEND VALIDATION + PDF TRIGGER + BACKEND CALL
   ML/PHASE1 LOCKED — FULL FILE (ML/01 COMPLIANT)
   ====================================================================== */

console.log("submit.js loaded");

/* ----------------------------------------------------------------------
   AUTO-SET ANALYSIS DATE (READONLY, USER CANNOT EDIT)
---------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  document.getElementById("analysis_date").value = `${yyyy}-${mm}-${dd}`;
});

/* ======================================================================
   CLICK HANDLER
====================================================================== */
document.getElementById("submit_btn").addEventListener("click", onSubmit);

async function onSubmit() {

  const btn = document.getElementById("submit_btn");
  btn.disabled = true;
  btn.textContent = "PROCESSING…";

  /* ----------------- VALIDATE BASE FIELDS ----------------- */
  const base = validateBaseInputs();
  if (!base.ok) {
    alert("❌ VALIDATION ERROR:\n\n" + base.msg.join("\n"));
    unlockButton();
    return;
  }

  /* ----------------- OBSERVATION VALIDATION ----------------- */
  if (!window.collectObservations || !window.validateObservationRules) {
    alert("❌ OBS LOGIC ERROR — Missing JS Function");
    unlockButton();
    return;
  }

  const obsRows = collectObservations();
  const obsOK = await validateObservationRules(obsRows);
  if (!obsOK) {
    unlockButton();
    return;
  }

  /* ----------------- GET PERFORMANCE FOR BACKEND ----------------- */
  const lpPerf = obsRows.find(x => x.id === 32)?.value || "VERY GOOD";
  const alpPerf = obsRows.find(x => x.id === 34)?.value || "VERY GOOD";

  /* ----------------- CREATE PDF BASE64 ----------------- */
  const docData = {
    cli_id: value("cli_id"),
    cli_name: value("cli_name"),
    train_no: value("train_no"),
    date_working: value("date_work"),
    loco_no: value("loco_no"),
    from: value("from_station"),
    to: value("to_station"),
    lp_id: value("lp_id"),
    lp_name: value("lp_name"),
    alp_id: value("alp_id"),
    alp_name: value("alp_name"),
    final_remarks: value("remarks")
  };

  const pdfObj = await generatePDF_ReturnBase64(docData, {
    lpPerformance: lpPerf,
    alpPerformance: alpPerf
  }, obsRows);

  /* ----------------- SEND TO BACKEND ----------------- */
  const payload = {
    data: {
      cli_id: docData.cli_id,
      cli_name: docData.cli_name,
      train_no: docData.train_no,
      date_working: docData.date_working,
      loco_no: docData.loco_no,
      from: docData.from,
      to: docData.to,
      lp_id: docData.lp_id,
      lp_name: docData.lp_name,
      alp_id: docData.alp_id,
      alp_name: docData.alp_name,
      lp_performance: lpPerf,
      alp_performance: alpPerf
    },
    pdf: {
      filename: pdfObj.filename,
      base64: pdfObj.base64
    }
  };

  const res = await API.sendReport(payload);

  if (!res.success) {
    alert("❌ BACKEND ERROR:\n" + res.message);
    unlockButton();
    return;
  }

  alert(
    "✅ REPORT SAVED & PDF STORED!\n\n" +
    "DIVISION COUNT: " + res.divisionCount + "\n" +
    "CLI COUNT: " + res.cliCount + "\n\n" +
    "PDF LINK:\n" + res.pdfLink
  );

  window.open(res.pdfLink, "_blank");
  unlockButton();
}

/* ======================================================================
   BASE INPUT VALIDATION
====================================================================== */
function validateBaseInputs() {
  const msg = [];

  const cli_id = value("cli_id");
  const cli_name = value("cli_name");
  const train = value("train_no");
  const work = value("date_work");
  const loco = value("loco_no");
  const fs = value("from_station");
  const fsn = value("from_station_name");
  const ts = value("to_station");
  const tsn = value("to_station_name");
  const lp = value("lp_id");
  const lpn = value("lp_name");
  const alp = value("alp_id");
  const alpn = value("alp_name");

  if (!cli_id) msg.push("CLI ID missing");
  if (!cli_name) msg.push("CLI NAME invalid");
  if (!train) msg.push("Train No missing");
  if (!work) msg.push("Working Date missing");
  if (!loco) msg.push("Loco No missing");
  if (!fs) msg.push("FROM Station Code missing");
  if (!fsn) msg.push("Invalid FROM Station Code");
  if (!ts) msg.push("TO Station Code missing");
  if (!tsn) msg.push("Invalid TO Station Code");
  if (!lp) msg.push("LP ID missing");
  if (!lpn) msg.push("LP ID invalid");
  if (!alp) msg.push("ALP ID missing");
  if (!alpn) msg.push("ALP ID invalid");

  /* ---------- FUTURE DATE CHECK ---------- */
  const now = new Date();
  const dt = new Date(work);
  if (dt.getTime() > now.getTime()) {
    msg.push("Working Date cannot be in future");
  }

  return { ok: msg.length === 0, msg };
}

/* ======================================================================
   HELPERS
====================================================================== */
function value(id) {
  return (document.getElementById(id)?.value || "").trim();
}

function unlockButton() {
  const btn = document.getElementById("submit_btn");
  btn.disabled = false;
  btn.textContent = "SAVE & GENERATE PDF";
}
