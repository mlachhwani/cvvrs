/* ============================================================================
   VALIDATION KIT — DELIVERY-2 (LOCKED UNDER ML/01)
   System: CVVRS / SECR / MLACHHWANI
   ============================================================================ */

/* ===================== FIELD ACCESSOR ===================== */
function V(id) {
  return document.getElementById(id)?.value.trim() || "";
}

/* ===================== TIME PARSER ===================== */
function parseDT(v) {
  // expects: YYYY-MM-DDTHH:MM or YYYY-MM-DD HH:MM
  if (!v) return null;
  if (v.includes("T")) return new Date(v);
  if (v.includes(" ")) return new Date(v.replace(" ", "T"));
  return null;
}

/* ===================== VALIDATION CORE ===================== */
async function validateInputs() {

  /* ---- BASIC REQUIRED FIELDS ---- */
  const required = {
    cli_id: "CLI ID",
    cli_name: "CLI NAME",
    train_no: "TRAIN NO",
    work_date: "DATE OF WORKING",
    loco_no: "LOCO NO",
    from_station: "FROM STATION CODE",
    from_station_name: "FROM STATION NAME",
    to_station: "TO STATION CODE",
    to_station_name: "TO STATION NAME",
    dep_time: "DEPARTURE TIME",
    arr_time: "ARRIVAL TIME",
    lp_id: "LP ID",
    lp_name: "LP NAME",
    alp_id: "ALP ID",
    alp_name: "ALP NAME"
  };

  const missing = [];
  for (const k in required) {
    if (!V(k)) missing.push(required[k]);
  }
  if (missing.length) {
    return { ok:false, msg:`Missing:\n- ${missing.join("\n- ")}` };
  }

  /* ---- DATE VALIDATION ---- */
  const dtWork = V("work_date");
  const dtDep  = V("dep_time");
  const dtArr  = V("arr_time");

  const dep = parseDT(dtDep);
  const arr = parseDT(dtArr);
  const now = await getServerIST(); // future-safe

  if (!dep) return {ok:false, msg:"Invalid Departure DateTime format"};
  if (!arr) return {ok:false, msg:"Invalid Arrival DateTime format"};

  if (arr < dep) {
    return {ok:false, msg:"Arrival time cannot be before Departure time"};
  }

  if (arr > now) {
    return {ok:false, msg:"Arrival time cannot be in future vs Server Time"};
  }

  /* ---- DATE OF WORKING <= ANALYSIS DATE ---- */
  const analysis = V("analysis_date");
  if (dtWork > analysis) {
    return {ok:false, msg:"Date of Working cannot be future vs Analysis Date"};
  }

  return {ok:true};
}

/* ===================== SERVER TIME ===================== */
async function getServerIST() {
  // using GitHub CDN header-time
  const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
  const js = await r.json();
  return new Date(js.datetime);
}

/* ===================== EXPORT ===================== */
window.VALIDATION = { validateInputs };
