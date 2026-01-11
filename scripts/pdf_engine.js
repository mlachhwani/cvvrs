/* =============================================================================
   pdf_engine.js
   PDF BUILDER + OBS PHOTO LOGIC
   ML/01 COMPLIANT — FULL FILE (NO PARTIALS)
   PROJECT: CVVRS ANALYSIS (SECR / RAIPUR)
   ============================================================================= */

console.log("pdf_engine.js loaded");

/* ===========================================================================
   HELPERS
=========================================================================== */

// Convert File → Base64 string
function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}

// Load IR Logo → Base64 (auto uses assets/ir_logo.png)
async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const b64 = await fileToBase64(blob);
  return `data:image/png;base64,${b64}`;
}

// IST timestamp for naming
function getIST() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 19800000); // +5:30
}

// PDF filename = CVVRS_R(divCount)_CLI(cliCount)_YYYY-MM-DD.pdf
function buildFilename(divCount, cliCount) {
  const d = getIST();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `CVVRS_R(${divCount})_CLI(${cliCount})_${yyyy}-${mm}-${dd}.pdf`;
}

/* ===========================================================================
   OBS VALIDATION (PHOTO + ABNORMAL)
=========================================================================== */
async function validateObsBeforePDF(obs) {

  for (const o of obs) {
    const changed = (o.value !== o.default);

    // Require photo if changed
    if (changed && !o.photoFile) {
      alert(`❌ PHOTO REQUIRED for: ${o.title}`);
      return false;
    }

    // Rating abnormal handling
    if (o.type === "RATING") {
      if (o.value !== "VERY GOOD") {
        if (!o.abnormalities) {
          alert(`❌ ABNORMALITY REQUIRED for: ${o.title}`);
          return false;
        }
        if (!o.photoFile) {
          alert(`❌ PHOTO REQUIRED for RATING ABNORMALITY: ${o.title}`);
          return false;
        }
      }
    }
  }
  return true;
}

/* ===========================================================================
   OBS TABLE BUILDER (4 SECTIONS)
=========================================================================== */
function buildObsTables(obs) {

  const sec = {
    CTO: obs.filter(o => o.section === "CTO"),
    ONRUN: obs.filter(o => o.section === "ONRUN"),
    HALTS: obs.filter(o => o.section === "HALTS"),
    CHO: obs.filter(o => o.section === "CHO"),
  };

  const tables = [];

  const make = (title, rows) => {

    const body = [[
      {text:"ID", bold:true},
      {text:"Observation", bold:true},
      {text:"Role", bold:true},
      {text:"Status", bold:true},
      {text:"Abnormalities", bold:true},
    ]];

    rows.forEach(r => {
      const col = (r.value === r.default ? "green" : "red");
      body.push([
        {text:r.id, color:col},
        {text:r.title, color:col},
        {text:r.role, color:col},
        {text:r.value, color:col},
        {text:r.abnormalities || "-", color:col},
      ]);
    });

    tables.push(
      {text:title, bold:true, fontSize:11, margin:[0,6,0,3]},
      {
        table:{ widths:["auto","*", "auto","auto","*"], body },
        layout:"lightHorizontalLines"
      }
    );
  };

  make("SECTION-1: DURING CTO", sec.CTO);
  make("SECTION-2: ON RUN", sec.ONRUN);
  make("SECTION-3: AT HALTS", sec.HALTS);
  make("SECTION-4: AT CHO", sec.CHO);

  return tables;
}

/* ===========================================================================
   PHOTO PAGES (6 PER PAGE, 3 PER ROW, BORDER COLOR)
=========================================================================== */
async function buildPhotoPages(obs) {

  const photoObs = obs.filter(o => o.photoFile);
  if (photoObs.length === 0) return [];

  const blocks = [];
  const PHOTO_W = 160;
  let row = [];
  let count = 0;

  blocks.push({text:"PHOTO EVIDENCE", bold:true, fontSize:12, margin:[0,8,0,8], pageBreak:"before"});

  for (const p of photoObs) {

    const b64 = await fileToBase64(p.photoFile);
    const borderColor = (p.value === p.default) ? "green" : "red";

    row.push({
      stack:[
        {
          image:`data:image/jpeg;base64,${b64}`,
          width:PHOTO_W,
          margin:[0,0,0,3],
          border:[true,true,true,true],
          borderColor:borderColor
        },
        {text:`${p.id}. ${p.title}`, fontSize:9}
      ],
      margin:[0,5,0,5]
    });

    count++;
    if (count % 3 === 0) {
      blocks.push({columns:row});
      row = [];
    }
    if (count % 6 === 0) {
      blocks.push({text:"", pageBreak:"before"});
    }
  }

  if (row.length > 0) {
    blocks.push({columns:row});
  }

  return blocks;
}

/* ===========================================================================
   MAIN PDF GENERATOR (RETURNS {filename, base64})
=========================================================================== */
async function buildPDF(data, meta, obs) {

  const logo = await loadLogoBase64();
  const filename = buildFilename(meta.divCount, meta.cliCount);

  const HEADER = {
    margin:[0,0,0,10],
    columns:[
      { image:logo, width:60 },
      {
        alignment:"center",
        width:"*",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:14},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:11},
          {text:"CVVRS ANALYSIS REPORT", bold:true, fontSize:13, margin:[0,4,0,0]}
        ]
      },
      {
        width:150,
        alignment:"right",
        text:`CLI: ${data.cli_id}\nDate: ${data.analysis_date}`,
        fontSize:9
      }
    ]
  };

  const INFO = {
    margin:[0,0,0,10],
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Train No:", data.train_no, "Date of Working:", data.date_work],
        ["Loco No:", data.loco_no, "LP ID:", data.lp_id],
        ["From:", data.from_station, "ALP ID:", data.alp_id],
        ["To:", data.to_station, "", ""]
      ]
    },
    layout:"lightHorizontalLines"
  };

  const REMARKS = {
    margin:[0,6,0,6],
    table:{widths:["auto","*"], body:[[ "Final Remarks:", data.final_remarks ]]},
    layout:"noBorders"
  };

  const OBS_TABLES = buildObsTables(obs);
  const PHOTO_PAGES = await buildPhotoPages(obs);

  const doc = {
    pageSize:"A4",
    pageMargins:[25,25,25,30],
    footer:(p,c)=>({text:`Page ${p} of ${c}`, alignment:"center", fontSize:9}),
    content:[
      HEADER,
      INFO,
      ...OBS_TABLES,
      REMARKS,
      ...PHOTO_PAGES
    ]
  };

  return new Promise(resolve=>{
    const pdf = pdfMake.createPdf(doc);
    pdf.getBase64(b64 => resolve({filename, base64:b64}));
  });
}

/* ===========================================================================
   EXPORT API TO GLOBAL
=========================================================================== */
window.PDF_ENGINE = {
  validateObsBeforePDF,
  buildPDF
};
