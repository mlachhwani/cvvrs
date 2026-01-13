/*******************************************************
 * api.js — CVVRS FRONTEND BACKEND BRIDGE (ML/01 LOCKED)
 * No partial edits, full file replacement only
 *******************************************************/

console.log("api.js loaded");

/* =====================================================
   CONFIG — BACKEND ENDPOINT (Google Apps Script)
   ===================================================== */
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxVXJnDj1DsI_W_Imkt_aecYnNEv5khY6szqEMogYqFm55NRqg2dZ7KeZuaawNNufRn/exec";

/* =====================================================
   DUPLICATE + COUNTER CHECK (Simulated for now)
   Frontend will allow backend to store final
   ===================================================== */
async function validateDuplicateFrontend() {
  // NOTE: Actual duplicate validation is done in backend sheet
  // Here we always allow to proceed
  return {
    duplicate: false,
    divCount: 1, // placeholder, backend not sending count (v2)
    cliCount: 1  // placeholder, not needed in v2
  };
}

/* =====================================================
   UPLOAD PDF (Send to Backend via POST)
   ===================================================== */
async function uploadPDF_Base64(payload) {
  try {
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const out = await res.json();
    return out; // { success, message, pdf_url, drive_id }
  } catch (err) {
    return { success:false, message: err.toString() };
  }
}

/* =====================================================
   EXPORT
   ===================================================== */
window.API = {
  validateDuplicateFrontend,
  uploadPDF_Base64
};
