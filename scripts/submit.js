/* =============================================================================
    submit.js — Delivery-3 update to match new backend
============================================================================= */

document.getElementById("submit_btn").addEventListener("click", onSubmit);

async function onSubmit() {

  // VALIDATION
  const v = await VALIDATION.validateInputs();
  if (!v.ok) {
    alert("❌ VALIDATION FAILED:\n" + v.msg);
    return;
  }

  // COLLECT UI DATA
  const data = FORM.collectBase();
  const obs  = FORM.collectObservations();

  // BACKEND DUPLICATE + COUNT
  const chk = await API.validateDuplicate(data);
  if (chk.success === false) {
    alert(chk.message);
    return;
  }

  // GENERATE PDF (returns base64 + filename)
  const pdf = await PDF_ENGINE.generate(data, obs, chk.divCount, chk.cliCount);

  // Upload PDF
  const up = await API.uploadPDF(pdf.base64, pdf.filename);
  if (!up.success) {
    alert("❌ PDF Upload Failed");
    return;
  }

  // SAVE HISTORY
  await API.appendHistory({
    ...data,
    lp_perf: FORM.getLPPerf(obs),
    alp_perf: FORM.getALPPerf(obs),
    pdfLink: up.pdfLink
  });

  alert("✅ SAVED & PDF GENERATED\n" + up.pdfLink);
  window.open(up.pdfLink, "_blank");
}
