/* ============================================================
   api.js - GOOGLE SHEET & DRIVE COMMUNICATION LAYER
   ============================================================ */

const GAS_URL = "PASTE_YOUR_WebApp_URL_HERE"; // example: https://script.google.com/macros/s/.../exec

/* ============================================================
   1) DUPLICATE + COUNT VALIDATION
   ============================================================ */
async function validateDuplicate(data) {
  const payload = {
    action: "validate",
    cli_id: data.cli_id,
    train_no: data.train_no,
    date_working: data.date_working,
    loco_no: data.loco_no,
    from_station: data.from_station,
    to_station: data.to_station,
    lp_id: data.lp_id,
    alp_id: data.alp_id
  };

  const res = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const out = await res.json();
  return out; // { duplicate: false, divCount:51, cliCount:03 }
}

/* ============================================================
   2) PDF UPLOAD TO DRIVE (BASE64)
   ============================================================ */
async function uploadPDF(fileBase64, filename) {
  const payload = {
    action: "upload",
    filename: filename,
    file: fileBase64
  };

  const res = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const out = await res.json();
  return out; // { success:true, pdfLink:"..." }
}

/* ============================================================
   3) APPEND HISTORY TO SHEET
   ============================================================ */
async function appendHistory(data) {
  const payload = {
    action: "history",
    row: data
  };

  const res = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  });

  const out = await res.json();
  return out;
}

/* ============================================================
   EXPORT (if needed)
   ============================================================ */
window.API = {
  validateDuplicate,
  uploadPDF,
  appendHistory
};
