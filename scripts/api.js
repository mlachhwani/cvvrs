/* ===========================================================================
   API.js — MATCHING BACKEND HANDLER (validate + upload + history)
   Backend URL required (Web App deployed as "Anyone with link")
   =========================================================================== */

const API = {};

API.WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw-vvjXMzkOpOvdPpjaAfTbJU3mlUV4YeDoDQMr_zCv5nQekYeGj0OmPyPiTk0wod4R/exec"; // <-- REQUIRED

/* ===========================================================================
   COMMON POST WRAPPER
   =========================================================================== */
API._post = async function(action, payload) {
  const res = await fetch(API.WEBAPP_URL, {
    method: "POST",
    body: JSON.stringify({ action, payload }),
    headers: { "Content-Type": "application/json" }
  });

  return await res.json();
};

/* ===========================================================================
   1) VALIDATION + COUNTS + DUPLICATE CHECK
   FRONTEND CALLS BEFORE PDF CREATION
   =========================================================================== */
API.validateDuplicate = async function(formData) {

  const payload = {
    cli_id: formData.cli_id,
    train_no: formData.train_no,
    date_working: formData.date_working,
    loco_no: formData.loco_no,
    from_station: formData.from_station,
    to_station: formData.to_station,
    lp_id: formData.lp_id,
    alp_id: formData.alp_id,
    analysis_date: formData.analysis_date  // must be YYYY-MM-DD
  };

  const out = await API._post("validate", payload);

  if (!out.success) {
    alert("❌ VALIDATION ERROR: " + out.error);
    return { duplicate:false, cliCount:0, divCount:0 };
  }

  return {
    duplicate: out.duplicate,
    cliCount: out.cliCount,
    divCount: out.divCount
  };
};

/* ===========================================================================
   2) PDF UPLOAD (BASE64 -> DRIVE)
   =========================================================================== */
API.uploadPDF = async function(base64, filename, analysis_date) {

  const payload = {
    filename,
    base64,
    analysis_date // required for folder YYYY/MM
  };

  const out = await API._post("upload", payload);

  if (!out.success) {
    alert("❌ PDF UPLOAD ERROR: " + out.error);
    return { success:false };
  }

  return {
    success:true,
    pdfLink: out.pdfLink
  };
};

/* ===========================================================================
   3) APPEND HISTORY TO SHEET (INCLUDING PERFORMANCE)
   =========================================================================== */
API.appendHistory = async function(h) {

  const payload = {
    analysis_date: h.analysis_date,
    month: h.analysis_date.substring(0,7),

    cli_id: h.cli_id,
    cli_name: h.cli_name,

    train_no: h.train_no,
    date_working: h.date_working,
    loco_no: h.loco_no,
    from_station: h.from_station,
    to_station: h.to_station,

    lp_id: h.lp_id,
    lp_name: h.lp_name,

    alp_id: h.alp_id,
    alp_name: h.alp_name,

    observations: h.observations, // REQUIRED FOR LP/ALP PERFORMANCE

    pdfLink: h.pdfLink
  };

  const out = await API._post("history", payload);

  if (!out.success) {
    alert("❌ HISTORY SAVE ERROR: " + out.error);
    return { success:false };
  }

  return { success:true };
};
