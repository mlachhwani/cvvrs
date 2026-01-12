/* =============================================================================
      PDF ENGINE — Delivery-4 (ML/01 FULL FILE)
      PHOTO ORDER = RECORD ORDER
      PHOTO SIZE = 160px
============================================================================= */

/* ========= HELPERS ========= */

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

function istNow() {
  const d = new Date();
  return new Date(d.getTime() + (330 * 60000)); // UTC+5:30
}

function buildFilename(divCount, cliCount, dateObj, cliId) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2,"0");
  const d = String(dateObj.getDate()).padStart(2,"0");
  return `CVVRS_R(${divCount})_${cliId}(${cliCount})_${y}-${m}-${d}.pdf`;
}

/* =============================================================================
      OBS COLLECTION
============================================================================= */
function collectObserved() {
  return window.FORM.collectObservations(); // already implemented in Delivery-3
}

/* =============================================================================
      SECTION TABLE BUILDER
============================================================================= */
function buildSection(title, rows) {

  const head = [
    [
      {text:"Obs#", bold:true},
      {text:"Observation", bold:true},
      {text:"Role", bold:true},
      {text:"Status", bold:true},
      {text:"Abnormalities", bold:true}
    ]
  ];

  const body = [...head];

  rows.forEach(r => {
    const borderColor = (r.value === r.default) ? "#009900" : "#cc0000";
    body.push([
      {text:String(r.id), color:borderColor},
      {text:r.title, color:borderColor},
      {text:r.role, color:borderColor},
      {text:r.value, color:borderColor},
      {text:r.abnormalities || "-", color:borderColor}
    ]);
  });

  return [
    {text:title, bold:true, fontSize:12, margin:[0,5,0,5]},
    {
      table:{
        widths:["auto","*", "auto","auto","*"],
        body
      },
      layout:"lightHorizontalLines"
    }
  ];
}

/* =============================================================================
      PHOTO GRID BUILDER
============================================================================= */
async function buildPhotoPages(obsRows) {
  const filtered = obsRows.filter(o => o.photoFile);
  if (filtered.length === 0) return [];

  const PHOTO_WIDTH = 160;
  const out = [{ text:"PHOTO EVIDENCE", style:"photoTitle", pageBreak:"before" }];

  let row = [];
  let count = 0;

  for (const p of filtered) {
    const b64 = await fileToBase64(p.photoFile);
    const borderColor = (p.value === p.default) ? "#009900" : "#cc0000";

    row.push({
      stack:[
        { image:`data:image/jpeg;base64,${b64}`, width:PHOTO_WIDTH,
          border:[true,true,true,true], borderColor, margin:[0,0,0,5] },
        { text:`${p.id}. ${p.title}`, fontSize:9, margin:[0,2,0,0] }
      ],
      margin:[0,5,0,5]
    });

    count++;

    if (count % 3 === 0) {
      out.push({columns:row, columnGap:5});
      row = [];
    }

    if (count % 6 === 0) {
      out.push({text:"", pageBreak:"before"});
    }
  }

  if (row.length > 0) {
    out.push({columns:row, columnGap:5});
  }

  return out;
}

/* =============================================================================
      MAIN PDF GENERATOR (RETURNS BASE64 + FILENAME)
============================================================================= */
async function generatePDF(data, obsRows, divCount, cliCount) {

  const logo = await loadLogoBase64();
  const now = istNow();
  const filename = buildFilename(divCount, cliCount, now, data.cli_id);

  /* === SECTION GROUPING === */
  const CTO   = obsRows.filter(o => o.id >= 1 && o.id <= 6);
  const ONRUN = obsRows.filter(o => o.id >= 7 && o.id <= 20);
  const HALTS = obsRows.filter(o => o.id >= 21 && o.id <= 30);
  const CHO   = obsRows.filter(o => o.id >= 31 && o.id <= 34);

  /* === HEADER === */
  const HEADER = {
    margin:[0,0,0,10],
    columns:[
      { image:logo, width:60 },
      {
        width:"*", alignment:"center",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:14},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:11},
          {text:"CVVRS ANALYSIS REPORT", bold:true, fontSize:13, margin:[0,3,0,0]}
        ]
      },
      {
        width:130, alignment:"right",
        text:`CLI (Observer):\n${data.cli_id}`, fontSize:10
      }
    ]
  };

  /* === INFO BLOCK === */
  const INFO = {
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Analysis Date:", data.analysis_date, "Working Date:", data.date_working],
        ["Train No:", data.train_no, "Loco No:", data.loco_no],
        ["From:", data.from_station, "To:", data.to_station],
        ["LP:", data.lp_id, "ALP:", data.alp_id]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,0,0,10]
  };

  /* === FINAL REMARKS === */
  const FINAL = {
    table:{
      widths:["auto","*"],
      body:[[ {text:"FINAL REMARKS:", bold:true}, data.final_remarks ]]
    },
    layout:"noBorders",
    margin:[0,10,0,10]
  };

  /* === OBS TABLES === */
  const sections = [
    ...buildSection("SECTION-1: DURING CTO", CTO),
    {text:"", pageBreak:"before"},
    ...buildSection("SECTION-2: ON RUN", ONRUN),
    {text:"", pageBreak:"before"},
    ...buildSection("SECTION-3: AT HALTS", HALTS),
    {text:"", pageBreak:"before"},
    ...buildSection("SECTION-4: AT CHO", CHO)
  ];

  /* === PHOTOS === */
  const PHOTOS = await buildPhotoPages(obsRows);

  const docDef = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    footer:(pg,pc)=>({text:`Page ${pg} of ${pc}`, alignment:"center", fontSize:9}),
    styles:{ photoTitle:{bold:true,fontSize:12,margin:[0,0,0,10]} },
    content:[
      HEADER,
      INFO,
      ...sections,
      FINAL,
      ...PHOTOS
    ]
  };

  // Return as base64 + filename
  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);
    pdf.getBase64(b64 => resolve({ base64: b64, filename }));
  });
}

/* =============================================================================
      EXPORT API (Frontend Consumption)
============================================================================= */
window.PDF_ENGINE = {
  generate: generatePDF
};
