/* ============================================================================
    FRONTEND API LAYER — Delivery-3
    Connects frontend → Apps Script Backend
============================================================================ */

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz5AxnfgmXXiYaxh9faTcS9oqGcy0duAZ9kXEV53YVCv3JqS8r43sBjejBB_Iwg9c1U/exec";

/* =================== DUPLICATE + COUNT CHECK =================== */
async function validateDuplicate(data) {
  const res = await fetch(WEBAPP_URL, {
    method:"POST",
    body:JSON.stringify({ checkDuplicate:true, ...data }),
    headers:{ "Content-Type":"application/json" }
  });
  return res.json();
}

/* =================== UPLOAD PDF =================== */
async function uploadPDF(base64, filename) {
  const res = await fetch(WEBAPP_URL, {
    method:"POST",
    body:JSON.stringify({ uploadPDF:true, base64, filename }),
    headers:{ "Content-Type":"application/json" }
  });
  return res.json();
}

/* =================== APPEND HISTORY =================== */
async function appendHistory(rec) {
  const res = await fetch(WEBAPP_URL, {
    method:"POST",
    body:JSON.stringify({ appendHistory:true, ...rec }),
    headers:{ "Content-Type":"application/json" }
  });
  return res.json();
}

/* EXPORT */
window.API = { validateDuplicate, uploadPDF, appendHistory };
