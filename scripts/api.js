/* =============================================================================
   API ENGINE — FULL FILE (ML/01 MODE)
   Locked for MLACHHWANI / CVVRS
============================================================================= */

console.log("api.js loaded");

/* =============================================================================
   CONFIG — BACKEND ENDPOINT (Apps Script WebApp)
============================================================================= */
const WEBAPP_URL = "<<<PASTE_WEBAPP_URL_HERE>>>";

/* =============================================================================
   GENERIC POST WRAPPER
============================================================================= */
async function postToBackend(action, payload = {}) {
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ action, payload })
    });

    const out = await res.json();
    return out;

  } catch(err) {
    console.error("❌ Backend communication error:", err);
    return { success:false, message:"NETWORK_ERROR" };
  }
}

/* =============================================================================
   1️⃣ DUPLICATE CHECK
   Checks LP+ALP+Train+Date+Loco+From+To duplicate for current month
============================================================================= */
async function checkDuplicate(data) {
  const out = await postToBackend("CHECK_DUPLICATE", data);
  return {
    duplicate: out.duplicate || false
  };
}

/* =============================================================================
   2️⃣ GET MONTHLY COUNTS
   Returns:
   - divCount: division count for month
   - cliCount: cli-specific count for month
============================================================================= */
async function getCounts(cli_id) {
  const out = await postToBackend("GET_COUNTS", { cli_id });

  if (!out.success) {
    return { divCount: 0, cliCount: 0 };
  }

  return {
    divCount: out.divCount || 0,
    cliCount: out.cliCount || 0
  };
}

/* =============================================================================
   3️⃣ PDF UPLOAD
   Takes base64 + filename → returns Drive link
============================================================================= */
async function uploadPDF(base64, filename) {
  const out = await postToBackend("UPLOAD_PDF", { base64, filename });

  if (!out.success) {
    return { success:false, pdfLink:null };
  }

  return { success:true, pdfLink: out.pdfLink };
}

/* =============================================================================
   4️⃣ APPEND HISTORY ROW
   Will log in sheet for analytics
============================================================================= */
async function appendHistory(row) {
  const out = await postToBackend("APPEND_HISTORY", row);
  return { success: out.success || false };
}

/* =============================================================================
   COMBINED HIGH-LEVEL WORKFLOW USED BY submit.js / pdf_engine.js
============================================================================= */
window.API = {

  async validateDuplicate(data) {
    return await checkDuplicate(data);
  },

  async getMonthlyCounts(cli_id) {
    return await getCounts(cli_id);
  },

  async uploadPDF(base64, filename) {
    return await uploadPDF(base64, filename);
  },

  async appendHistory(row) {
    return await appendHistory(row);
  }
};
