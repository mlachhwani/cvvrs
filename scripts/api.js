/* =============================================================================
     API BRIDGE — Delivery-7 (FULL | ML/01)
     Works with code.gs backend
============================================================================= */

console.log("api.js loaded");

/* ===== WebApp URL (paste your deployed URL) ===== */
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz5AxnfgmXXiYaxh9faTcS9oqGcy0duAZ9kXEV53YVCv3JqS8r43sBjejBB_Iwg9c1U/exec";

/* ===== Helper: POST JSON ===== */
async function postJSON(payload) {
  const res = await fetch(WEBAPP_URL, {
    method:"POST",
    body:JSON.stringify(payload),
    headers:{"Content-Type":"application/json"}
  });
  return await res.json();
}

/* =============================================================================
   ACTION: DUPLICATE + COUNT CHECK
============================================================================= */
async function duplicateAndCounts(pay) {
  const out = await postJSON({
    action:"checkDuplicate",
    payload:{
      cli_id:pay.cli_id,
      train_no:pay.train_no,
      date_working:pay.date_working,
      loco_no:pay.loco_no,
      from_station:pay.from_station,
      to_station:pay.to_station,
      lp_id:pay.lp_id,
      alp_id:pay.alp_id
    }
  });

  if (!out.success) return {duplicate:false, divCount:1, cliCount:1};
  return out;
}

/* =============================================================================
   ACTION: UPLOAD PDF
============================================================================= */
async function uploadPDF(base64, filename) {
  const out = await postJSON({
    action:"uploadPDF",
    payload:{
      base64,
      filename
    }
  });

  if (!out.success) return {success:false};
  return {success:true, link:out.link};
}

/* =============================================================================
   ACTION: APPEND HISTORY
============================================================================= */
async function appendHistory(pay) {
  const out = await postJSON({
    action:"appendHistory",
    payload:pay
  });

  return {success: out.success ? true : false};
}

/* =============================================================================
   EXPORT API
============================================================================= */
window.API = {
  duplicateAndCounts,
  uploadPDF,
  appendHistory
};
