/* =============================================================================
   pdf_engine.js — FINAL PDF BUILDER (ML/01 COMPLIANT)
   Project: CVVRS (SECR/R)
   Output: Base64 + Browser Download
============================================================================= */

/* ---------------------------------------------------------------------------
   LOGO LOADER (BASE64)
--------------------------------------------------------------------------- */
function toBase64(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(fileOrBlob);
  });
}

async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const b64 = await toBase64(blob);
  return `data:image/png;base64,${b64}`;
}

/* ---------------------------------------------------------------------------
   DATE HELPERS 
--------------------------------------------------------------------------- */
function IST() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

function DD(v) {
  return (v < 10 ? "0" : "") + v;
}

/* ---------------------------------------------------------------------------
   FILENAME BUILDER
--------------------------------------------------------------------------- */
function buildPDFname(base) {
  const now = IST();
  return `CVVRS_${base.cli_id}_${now.getFullYear()}-${DD(now.getMonth()+1)}-${DD(now.getDate())}.pdf`;
}

/* ---------------------------------------------------------------------------
   OBS → SECTIONS SPLIT
--------------------------------------------------------------------------- */
function sectionSplit(obsList) {
  return {
    CTO:   obsList.filter(o => o.sec === "CTO"),
    ONRUN: obsList.filter(o => o.sec === "ONRUN"),
    HALTS: obsList.filter(o => o.sec === "HALTS"),
    CHO:   obsList.filter(o => o.sec === "CHO"),
  };
}

/* ---------------------------------------------------------------------------
   LP/ALP SPLIT (inside section)
--------------------------------------------------------------------------- */
function splitRole(rows) {
  return {
    LP:  rows.filter(r => r.role === "LP"),
    ALP: rows.filter(r => r.role === "ALP")
  };
}

/* ---------------------------------------------------------------------------
   YES/NO/RATING Color Logic
--------------------------------------------------------------------------- */
function cellColor(type, val, def) {
  if (type === "RATING") {
    return (val === "VERY GOOD") ? "#008000" : "#CC0000";
  }
  return (val === def) ? "#008000" : "#CC0000";
}

/* ---------------------------------------------------------------------------
   SECTION TABLE BUILDER
--------------------------------------------------------------------------- */
function buildRoleTable(title, rows) {

  const body = [[
    {text:"Obs#", bold:true},
    {text:"Observation", bold:true},
    {text:"Status", bold:true},
    {text:"Remarks", bold:true}
  ]];

  rows.forEach(r => {
    const clr = cellColor(r.type, r.value, r.def);
    body.push([
      {text:String(r.id), color:clr},
      {text:r.title, color:clr},
      {text:r.value, color:clr},
      {text:(r.value === r.def ? "-" : "ABNORMAL"), color:clr}
    ]);
  });

  return [
    {text:title, bold:true, margin:[0,8,0,4]},
    {
      table:{widths:["auto","*","auto","*"], body},
      layout:"lightHorizontalLines"
    }
  ];
}

/* ---------------------------------------------------------------------------
   PHOTO PAGE BUILDER
--------------------------------------------------------------------------- */
async function buildPhotoSection(allObs) {
  const list = allObs.filter(o => o.photo);
  if (list.length === 0) return [];

  const out = [{text:"PHOTO EVIDENCE", style:"photoTitle", pageBreak:"before"}];

  let row = [];
  let count = 0;

  for (const p of list) {
    const base64 = p.photo;
    const clr = cellColor(p.type, p.value, p.def);

    row.push({
      stack:[
        {
          image: base64,
          width:150,
          border:[true,true,true,true],
          borderColor:clr,
          margin:[0,0,0,4]
        },
        {text:`${p.id}. ${p.title}`, fontSize:9}
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

/* ---------------------------------------------------------------------------
   PERFORMANCE EXTRACTION (RATING)
--------------------------------------------------------------------------- */
function extractPerformance(allObs) {
  const lp = allObs.find(o => o.role==="LP" && o.type==="RATING" && o.value);
  const alp = allObs.find(o => o.role==="ALP" && o.type==="RATING" && o.value);

  return {
    lp_perf: lp ? lp.value : "N/A",
    alp_perf: alp ? alp.value : "N/A"
  };
}

/* ---------------------------------------------------------------------------
   MAIN PDF BUILDER
--------------------------------------------------------------------------- */
async function generatePDF(base, observations) {

  const logo = await loadLogoBase64();
  const sec = sectionSplit(observations);

  /* HEADER */
  const HEADER = {
    columns:[
      { image:logo, width:60 },
      {
        width:"*", alignment:"center",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:14},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:10},
          {text:"CVVRS ANALYSIS REPORT", bold:true, margin:[0,3,0,0]}
        ]
      },
      {}
    ],
    margin:[0,0,0,10]
  };

  /* BASE INFO TABLE */
  const INFO = {
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Analysis Date:", base.analysis_date, "Train No:", base.train_no],
        ["CLI:", base.cli_id, "Date of Working:", base.date_work],
        ["Loco:", base.loco_no, "From:", base.from_station_name],
        ["LP:", base.lp_name,   "To:", base.to_station_name],
        ["ALP:", base.alp_name, "", ""]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,0,0,10]
  };

  /* BUILD SECTION TABLES */
  const CONTENT = [HEADER, INFO];

  const order = [
    {key:"CTO",   title:"DURING CTO"},
    {key:"ONRUN", title:"ON RUN"},
    {key:"HALTS", title:"AT HALTS"},
    {key:"CHO",   title:"AT CHO"}
  ];

  order.forEach(s => {
    const {LP, ALP} = splitRole(sec[s.key]);
    CONTENT.push({text:s.title, bold:true, fontSize:12, margin:[0,6,0,2]});
    CONTENT.push(...buildRoleTable("LOCO PILOT", LP));
    CONTENT.push(...buildRoleTable("ASTT. LOCO PILOT", ALP));
  });

  /* PERFORMANCE BLOCK */
  const perf = extractPerformance(observations);
  CONTENT.push({
    table:{
      widths:["auto","auto","auto","auto"],
      body:[
        ["LP Performance:", perf.lp_perf, "ALP Performance:", perf.alp_perf]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,10,0,10]
  });

  /* REMARKS */
  CONTENT.push({
    table:{widths:["auto","*"], body:[["Final Remarks:", base.remarks]]},
    layout:"noBorders",
    margin:[0,0,0,10]
  });

  /* PHOTO PAGES */
  const photos = await buildPhotoSection(observations);
  CONTENT.push(...photos);

  /* FINAL DOC DEF */
  const doc = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    footer:(pg,pc) => ({text:`Page ${pg} of ${pc}`, alignment:"center", fontSize:8}),
    styles:{ photoTitle:{bold:true,fontSize:12,margin:[0,0,0,8]} },
    content:CONTENT
  };

  /* RETURN + DOWNLOAD */
  const fileName = buildPDFname(base);

  return new Promise(res => {
    const pdf = pdfMake.createPdf(doc);
    pdf.getBase64(b64 => res({fileName, base64:b64}));
    pdf.download(fileName);
  });
}

/* =============================================================================
   EXPORT (GLOBAL)
============================================================================= */
window.PDF_ENGINE = { generatePDF };
console.log("pdf_engine.js loaded (ML/01 LOCKED)");
