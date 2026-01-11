/************************************************************************************
 * pdf_engine.js — FULL FILE (ML/01 MODE)
 * Locked for MLACHHWANI CVVRS
 * Generates PDF Base64 → Sends to backend → Backend uploads + logs
 ************************************************************************************/

console.log("pdf_engine.js loaded");

/* ======================================================
   HELPERS
====================================================== */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = e => reject(e);
    r.readAsDataURL(file);
  });
}

async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const base64 = await fileToBase64(blob);
  return `data:image/png;base64,${base64}`;
}

/* ======================================================
   COLLECT OBSERVATION ROWS
====================================================== */
function collectObservations() {
  const rows = [];
  OBS_MASTER.forEach(o => {
    const sel = document.querySelector(`.obs-select[data-id="${o.id}"]`);
    const abn = document.querySelector(`.obs-abn[data-id="${o.id}"]`);
    const file = document.querySelector(`.obs-photo[data-id="${o.id}"]`);

    rows.push({
      id: o.id,
      title: o.title,
      role: o.role,
      type: o.type,
      default: o.default,
      value: sel.value,
      abnormalities: abn ? abn.value.trim() : "",
      photoFile: (file && file.files.length > 0) ? file.files[0] : null
    });
  });
  return rows;
}

/* ======================================================
   VALIDATION RULES
====================================================== */
async function validateObsRules(rows) {
  for (const r of rows) {
    const changed = (r.value !== r.default);

    // PHOTO required when changed
    if (changed && !r.photoFile) {
      alert(`PHOTO REQUIRED for Obs#${r.id} — ${r.title}`);
      return false;
    }

    // RATING needs abnormalities + photo if not VERY GOOD
    if (r.type === "RATING" && r.value !== "VERY GOOD") {
      if (!r.abnormalities) {
        alert(`ABNORMALITIES REQUIRED for Obs#${r.id} — ${r.title}`);
        return false;
      }
      if (!r.photoFile) {
        alert(`PHOTO REQUIRED for RATING change Obs#${r.id} — ${r.title}`);
        return false;
      }
    }
  }
  return true;
}

/* ======================================================
   BUILD PDF CONTENT
====================================================== */
function buildObservationTables(rows) {
  const sections = {
    CTO: rows.filter(r => r.id>=1 && r.id<=6),
    ONRUN: rows.filter(r => r.id>=7 && r.id<=20),
    HALTS: rows.filter(r => r.id>=21 && r.id<=30),
    CHO: rows.filter(r => r.id>=31 && r.id<=34),
  };

  const mk = (title, arr) => {
    const body = [[ "Obs#", "Observation", "Role", "Value", "Abn" ]];
    arr.forEach(r => {
      body.push([
        String(r.id),
        r.title,
        r.role,
        r.value,
        r.abnormalities || "-"
      ]);
    });
    return [
      {text:title, bold:true, margin:[0,5,0,5]},
      {table:{body}, layout:"lightHorizontalLines"}
    ];
  };

  const out = [];
  out.push(...mk("SECTION-1: DURING CTO", sections.CTO));
  out.push({text:"", pageBreak:'before'});
  out.push(...mk("SECTION-2: ON RUN", sections.ONRUN));
  out.push({text:"", pageBreak:'before'});
  out.push(...mk("SECTION-3: AT HALTS", sections.HALTS));
  out.push({text:"", pageBreak:'before'});
  out.push(...mk("SECTION-4: AT CHO", sections.CHO));

  return out;
}

async function buildPhotoPages(rows) {
  const photos = rows.filter(r=>r.photoFile);
  if (photos.length===0) return [];

  const PH_W = 160;
  const blocks = [{text:"PHOTO EVIDENCE", bold:true, margin:[0,0,0,10], pageBreak:'before'}];

  let row=[];
  let cnt=0;

  for (const p of photos) {
    const b64 = await fileToBase64(p.photoFile);
    row.push({
      stack:[
        { image:`data:image/jpeg;base64,${b64}`, width:PH_W },
        { text:`${p.id}. ${p.title}`, fontSize:9 }
      ],
      margin:[0,5,0,5]
    });
    cnt++;
    if (cnt%3===0) {
      blocks.push({columns:row});
      row=[];
    }
    if (cnt%6===0) blocks.push({text:"", pageBreak:'before'});
  }

  if (row.length>0) blocks.push({columns:row});
  return blocks;
}

/* ======================================================
   MAIN GENERATE + SEND
====================================================== */
async function generateReport() {

  // BASIC DATA
  const data = {
    cli_id: document.getElementById("cli_id").value.trim(),
    cli_name: document.getElementById("cli_name").value.trim(),
    train_no: document.getElementById("train_no").value.trim(),
    date_working: document.getElementById("date_work").value.trim(),
    loco_no: document.getElementById("loco_no").value.trim(),
    from: document.getElementById("from_station").value.trim(),
    to: document.getElementById("to_station").value.trim(),
    lp_id: document.getElementById("lp_id").value.trim(),
    lp_name: document.getElementById("lp_name")?.value.trim() || "",
    alp_id: document.getElementById("alp_id").value.trim(),
    alp_name: document.getElementById("alp_name")?.value.trim() || "",
    lp_performance: "",
    alp_performance: "",
  };

  // MANDATORY CHECK
  for (const k in data) {
    if (!data[k]) {
      alert(`FIELD MISSING: ${k}`);
      return;
    }
  }

  // OBS
  const rows = collectObservations();
  const ok = await validateObsRules(rows);
  if (!ok) return;

  // PERFORMANCE EXTRACTION
  const lpPerf = rows.find(r=>r.role==="LP" && r.title.includes("Over"));
  const alpPerf = rows.find(r=>r.role==="ALP" && r.title.includes("Over"));
  data.lp_performance = lpPerf?.value || "";
  data.alp_performance = alpPerf?.value || "";

  // PDF BUILD
  const logo = await loadLogoBase64();
  const content = [];

  content.push({
    columns:[
      { image:logo, width:60 },
      {
        width:"*", alignment:"center",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION"},
          {text:"CVVRS ANALYSIS REPORT", bold:true, margin:[0,5,0,0]}
        ]
      }
    ],
    margin:[0,0,0,10]
  });

  content.push({
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Train No", data.train_no, "Working Date", data.date_working],
        ["Loco No", data.loco_no, "CLI", data.cli_id],
        ["From", data.from, "To", data.to],
        ["LP", data.lp_id, "ALP", data.alp_id]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,0,0,10]
  });

  content.push(...buildObservationTables(rows));

  content.push({
    text:"FINAL REMARKS:",
    margin:[0,10,0,0],
    bold:true
  });

  content.push({
    text:document.getElementById("remarks").value.trim() || "-",
    margin:[0,3,0,10]
  });

  const photoPages = await buildPhotoPages(rows);
  content.push(...photoPages);

  const doc = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    content
  };

  const pdfObj = await new Promise(resolve=>{
    const pdf = pdfMake.createPdf(doc);
    pdf.getBase64(b64=>resolve(b64));
  });

  // FILENAME
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const dd = String(now.getDate()).padStart(2,"0");
  const filename = `CVVRS_${data.cli_id}_${yyyy}-${mm}-${dd}.pdf`;

  // SEND TO BACKEND
  const out = await API.sendReport(data, filename, pdfObj);

  if (!out.success) {
    alert("BACKEND ERROR\n"+out.message);
    return;
  }

  alert(
    "SUCCESS!\n\n" +
    "Division Count: "+out.divisionCount+"\n" +
    "CLI Count: "+out.cliCount+"\n\n" +
    "PDF stored successfully."
  );

  window.open(out.pdfLink, "_blank");
}
