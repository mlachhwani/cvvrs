/******************************************************************************
 * API ENGINE — FULL FILE (ML/01 MODE)
 * Locked for MLACHHWANI / CVVRS
 * Backend URL provided directly by user.
 ******************************************************************************/

console.log("api.js loaded");

/* ==========================================
   CONFIG
========================================== */
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz5AxnfgmXXiYaxh9faTcS9oqGcy0duAZ9kXEV53YVCv3JqS8r43sBjejBB_Iwg9c1U/exec";

/* ==========================================
   SEND REPORT + PDF (MAIN CALL)
========================================== */
async function sendReport(data, filename, base64) {

  const payload = {
    data: data,
    pdf: {
      filename: filename,
      base64: base64
    }
  };

  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });

  const out = await res.json();
  return out;
}

/* ==========================================
   EXPORT PUBLIC API
========================================== */
window.API = {
  sendReport
};
