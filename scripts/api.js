/* =============================================================================
   api.js
   BACKEND COMMUNICATION LAYER (ML/01 COMPLIANT — FULL FILE)
   PROJECT: CVVRS ANALYSIS (SECR / RAIPUR)
   ============================================================================= */

console.log("api.js loaded");

/* ---------------------------------------------------------------------------
   CONFIG — APPS SCRIPT WEB APP ENTRY
   (YOU ALREADY PROVIDED FINAL DEPLOY ID)
---------------------------------------------------------------------------- */
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz5AxnfgmXXiYaxh9faTcS9oqGcy0duAZ9kXEV53YVCv3JqS8r43sBjejBB_Iwg9c1U/exec";

/* ===========================================================================
   MAIN EXPORT OBJECT
   All API calls centralized here (Future growth-friendly)
=========================================================================== */
const API = {

  /* ------------------------------------------------------------------------
     SEND REPORT (BASE64 PDF + METADATA)
     Payload Structure Required:
     {
       data: { ...fields },
       pdf: { filename, base64 }
     }
  ------------------------------------------------------------------------ */
  async sendReport(payload) {
    try {
      const res = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "submitReport",
          payload: payload
        })
      });

      const out = await res.json();
      return out;

    } catch (err) {
      console.error("API.sendReport ERROR:", err);
      return {
        success: false,
        message: "NETWORK ERROR"
      };
    }
  },

  /* ------------------------------------------------------------------------
     CHECK DUPLICATE (future use) — For date+LP or Train logic
     Currently backend supports this, frontend may call or skip
  ------------------------------------------------------------------------ */
  async checkDuplicate(data) {
    try {
      const res = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          action: "checkDuplicate",
          data: data
        })
      });

      const out = await res.json();
      return out;

    } catch(err) {
      console.error("API.checkDuplicate ERROR:", err);
      return {duplicate:false};
    }
  },

  /* ------------------------------------------------------------------------
     LOAD HISTORY (future dashboard use)
  ------------------------------------------------------------------------ */
  async loadHistory() {
    try {
      const res = await fetch(WEBAPP_URL + "?action=loadHistory");
      const out = await res.json();
      return out;
    } catch(err) {
      console.error("API.loadHistory ERROR:", err);
      return [];
    }
  }
};

/* ---------------------------------------------------------------------------
   EXPORT FOR DEBUG (OPTIONAL)
--------------------------------------------------------------------------- */
window.API = API;
