/**************************************************************
 * submit.js — Final Frontend Submission + Validation Logic
 * CVVRS — ML/01 LOCKED DELIVERY-21
 **************************************************************/

console.log("submit.js loaded");

/* ------------------------------------------------------------
 * CONFIG — BACKEND ENDPOINT
 * ------------------------------------------------------------ */
const WEBAPP_URL = "<<<PASTE_YOUR_WEBAPP_URL_HERE>>>";

/* ------------------------------------------------------------
 * SET ANALYSIS DATE (READONLY)
 * ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const iso = `${yyyy}-${mm}-${dd}`;
  const f = document.getElementById("analysis_date");
  if (f) {
    f.value = iso;
    f.readOnly = true;
  }
});

/* ------------------------------------------------------------
 * CLICK HANDLER
 * ------------------------------------------------------------ */
document.getElementById("submit_btn").addEventListener("click", onSubmitReport);

async function onSubmitReport() {

  const btn = document.getElementById("submit_btn");
  btn.disabled = true;
  btn.textContent = "PROCESSING...";

  /* VALIDATION */
  const v = validateFields();
  if (!v.ok) {
    alert("❌ VALIDATION ERROR:\n" + v.msg.join("\n"));
    btn.disabled = false;
    btn.textContent = "SAVE & GENERATE PDF";
    return;
  }

  /* BUILD PAYLOAD */
  const payload = buildPayload();

  /* SEND → BACKEND */
  try {

    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const out = await res.json();

    if (!out.success) {
      alert("❌ BACKEND ERROR:\n" + out.message);
    } else {
      alert("✅ REPORT SAVED & PDF GENERATED");
      if (out.pdf_url) window.open(out.pdf_url, "_blank");
    }

  } catch(err) {
    console.error(err);
    alert("❌ NETWORK ERROR — See console");
  }

  btn.disabled = false;
  btn.textContent = "SAVE & GENERATE PDF";
}

/* ------------------------------------------------------------
 * VALIDATION
 * ------------------------------------------------------------ */
function validateFields() {
  const msg = [];

  const cli_id   = val("cli_id");
  const cli_name = val("cli_name");
  const train_no = val("train_no");
  const date_work = val("date_work");
  const loco_no  = val("loco_no");

  const fs      = val("from_station");
  const fs_name = val("from_station_name");
  const ts      = val("to_station");
  const ts_name = val("to_station_name");

  const lp_id   = val("lp_id");
  const lp_name = val("lp_name");
  const alp_id  = val("alp_id");
  const alp_name= val("alp_name");

  if (cli_id === "") msg.push("CLI ID missing");
  if (cli_name === "") msg.push("CLI NAME missing");
  if (train_no === "") msg.push("Train No missing");
  if (date_work === "") msg.push("Date of Working missing");
  if (loco_no === "") msg.push("Loco No missing");

  if (fs === "") msg.push("FROM Station Code missing");
  if (fs_name === "") msg.push("FROM Station invalid");
  if (ts === "") msg.push("TO Station Code missing");
  if (ts_name === "") msg.push("TO Station invalid");

  if (lp_id === "") msg.push("LP ID missing");
  if (lp_name === "") msg.push("LP NAME missing/invalid");
  if (alp_id === "") msg.push("ALP ID missing");
  if (alp_name === "") msg.push("ALP NAME missing/invalid");

  /* DATE LOGIC */
  if (!isValidPastOrToday(date_work)) {
    msg.push("Date of Working cannot be future date");
  }

  return { ok: msg.length === 0, msg };
}

/* Field helper */
function val(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/* Date check helper (no future dates) */
function isValidPastOrToday(input) {
  if (!input) return false;
  const d = new Date(input);
  const now = new Date();
  return d <= now;
}

/* ------------------------------------------------------------
 * PAYLOAD BUILDER
 * ------------------------------------------------------------ */
function buildPayload() {
  const base = {
    analysis_date: val("analysis_date"),
    cli_id: val("cli_id"),
    cli_name: val("cli_name"),
    train_no: val("train_no"),
    date_work: val("date_work"),
    loco_no: val("loco_no"),
    from_station: val("from_station"),
    from_station_name: val("from_station_name"),
    to_station: val("to_station"),
    to_station_name: val("to_station_name"),
    lp_id: val("lp_id"),
    lp_name: val("lp_name"),
    alp_id: val("alp_id"),
    alp_name: val("alp_name"),
    remarks: val("remarks")
  };

  /* OBS VALUES */
  const observations = [];
  for (const obs of OBS_MASTER) {
    const sel = document.getElementById("obs_select_" + obs.id);
    const rec = {
      id: obs.id,
      title: obs.title,
      role: obs.role,
      sec: obs.sec,
      type: obs.type,
      value: sel?.value || "",
      default: obs.def || ""
    };
    observations.push(rec);
  }

  return { base, observations };
}
