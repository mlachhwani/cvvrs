/* =============================================================================
    SUBMIT & INTEGRATION ENGINE — Delivery-5 (ML/01 FULL)
    Works with: masters.js + obs_master.js + obs_ui.js + validation.js + pdf_engine.js + api.js
============================================================================= */

console.log("submit.js loaded");

/* ========= HELPER ========= */
function GV(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/* =============================================================================
    MAIN WORKFLOW
============================================================================= */
async function onSubmit() {

  // UI Lock
  const btn = document.getElementById("submit_btn");
  btn.disabled = true;
  btn.textContent = "PROCESSING...";

  /* ================= VALIDATE INPUTS ================= */
  const check = await VALIDATION.validateInputs();
  if (!check.ok) {
    alert("❌ VALIDATION ERROR:\n" + check.msg);
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* ================= COLLECT FORM DATA ================= */
  const data = {
    analysis_date: GV("analysis_date"),
    cli_id: GV("cli_id"),
    cli_name: GV("cli_name"),
    train_no: GV("train_no"),
    date_working: GV("work_date"),
    loco_no: GV("loco_no"),
    from_station: GV("from_station"),
    to_station: GV("to_station"),
    lp_id: GV("lp_id"),
    lp_name: GV("lp_name"),
    lp_desig: GV("lp_desig"),
    lp_gcli: GV("lp_gcli"),
    alp_id: GV("alp_id"),
    alp_name: GV("alp_name"),
    alp_desig: GV("alp_desig"),
    alp_gcli: GV("alp_gcli"),
    final_remarks: GV("remarks"),
    dep_time: GV("dep_time"),
    arr_time: GV("arr_time")
  };

  /* ================= GET OBSERVATIONS ================= */
  const obsRows = window.FORM.collectObservations();

  /* +++++++++++++ RATING EXTRACTION (LP + ALP) +++++++++++++ */
  const lpRate = obsRows.find(o => o.id === 32)?.value || "";
  const alpRate = obsRows.find(o => o.id === 34)?.value || "";

  data.lp_performance = lpRate;
  data.alp_performance = alpRate;

  /* ================= DUPLICATE + COUNTS ================= */
  const meta = await API.duplicateAndCounts({
    cli_id:data.cli_id,
    train_no:data.train_no,
    date_working:data.date_working,
    loco_no:data.loco_no,
    from_station:data.from_station,
    to_station:data.to_station,
    lp_id:data.lp_id,
    alp_id:data.alp_id
  });

  if (meta.duplicate) {
    alert("❌ DUPLICATE ENTRY BLOCKED FOR THIS MONTH!");
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* ================= PDF GENERATE ================= */
  const pdf = await PDF_ENGINE.generate(data, obsRows, meta.divCount, meta.cliCount);

  /* ================= UPLOAD PDF ================= */
  const upload = await API.uploadPDF(pdf.base64, pdf.filename);
  if (!upload.success) {
    alert("❌ PDF UPLOAD FAILED!");
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* ================= APPEND SHEET HISTORY ================= */
  await API.appendHistory({
    timestamp: data.analysis_date,
    month: data.analysis_date.slice(0,7),
    cli_id: data.cli_id,
    cli_name: data.cli_name,
    train_no: data.train_no,
    date_working: data.date_working,
    loco_no: data.loco_no,
    from: data.from_station,
    to: data.to_station,
    lp_id: data.lp_id,
    lp_name: data.lp_name,
    alp_id: data.alp_id,
    alp_name: data.alp_name,
    lp_performance:data.lp_performance,
    alp_performance:data.alp_performance,
    pdf_url: upload.link
  });

  /* ================= SUCCESS ================= */
  alert(
    "✅ REPORT COMPLETED!\n\n" +
    `Division Count: ${meta.divCount}\n` +
    `CLI Count: ${meta.cliCount}\n\n` +
    `PDF URL:\n${upload.link}`
  );

  btn.disabled = false;
  btn.textContent = "SAVE & GENERATE PDF";
}

/* =============================================================================
    WIRE BUTTON
============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("submit_btn");
  if (b) b.addEventListener("click", onSubmit);
});
