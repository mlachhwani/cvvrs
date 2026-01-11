/* =============================================================================
   SUBMIT ENGINE — FULL FILE (ML/01 MODE)
   Locked for MLACHHWANI / CVVRS
============================================================================= */

console.log("submit.js loaded");

/* =============================================================================
   HELPER — GET VALUE
============================================================================= */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/* =============================================================================
   FRONTEND REQUIRED FIELD VALIDATION
   (pdf_engine.js handles advanced OBS rules)
============================================================================= */
function validateMainFields() {
  const missing = [];

  if (!val("analysis_date")) missing.push("Analysis Date");
  if (!val("cli_id")) missing.push("CLI ID");
  if (!val("cli_name")) missing.push("CLI Name");
  if (!val("train_no")) missing.push("Train No");
  if (!val("date_work")) missing.push("Date of Working");
  if (!val("loco_no")) missing.push("Loco No");

  if (!val("from_station")) missing.push("From Station Code");
  if (!val("from_station_name")) missing.push("From Station Name");
  if (!val("to_station")) missing.push("To Station Code");
  if (!val("to_station_name")) missing.push("To Station Name");

  if (!val("lp_id")) missing.push("LP ID");
  if (!val("lp_name")) missing.push("LP Name");

  if (!val("alp_id")) missing.push("ALP ID");
  if (!val("alp_name")) missing.push("ALP Name");

  return {
    ok: missing.length === 0,
    missing
  };
}

/* =============================================================================
   BUTTON HANDLER
============================================================================= */
async function onSubmitCVVRS() {

  const btn = document.getElementById("submit_btn");
  if (!btn) {
    alert("❌ submit_btn not found in DOM!");
    return;
  }

  /* disable while processing */
  btn.disabled = true;
  const oldText = btn.textContent;
  btn.textContent = "PROCESSING...";

  /* basic field validation */
  const v = validateMainFields();
  if (!v.ok) {
    alert("❌ MISSING REQUIRED FIELDS:\n\n" + v.missing.join("\n"));
    btn.disabled = false;
    btn.textContent = oldText;
    return;
  }

  /* run full PDF + upload engine */
  try {
    await PDF_ENGINE.run();
  } catch(err) {
    console.error(err);
    alert("❌ UNEXPECTED ERROR — Check console.");
  }

  /* restore button */
  btn.disabled = false;
  btn.textContent = oldText;
}

/* =============================================================================
   DOM BINDING (ON LOAD)
============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submit_btn");

  if (btn) {
    btn.addEventListener("click", onSubmitCVVRS);
  } else {
    console.warn("⚠ submit_btn not found; ensure button ID matches.");
  }
});
