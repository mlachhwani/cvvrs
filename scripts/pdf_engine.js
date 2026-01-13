/************************************************************
 * pdf_engine.js — CVVRS PDF BUILDER (ML/01 LOCKED)
 * Produces BASE64 + filename for backend storage
 ************************************************************/

console.log("pdf_engine.js loaded");

/* ==========================================================
   HELPER — CONVERT FILE/BLOB TO BASE64 (RAW without prefix)
   ========================================================== */
function fileToBase64Raw(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const base64 = r.result.split(",")[1];
      resolve(base64);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ==========================================================
   LOAD LOGO AS BASE64
   ========================================================== */
async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const raw = await fileToBase64Raw(blob);
  return `data:image/png;base64,${raw}`;
}

/* ==========================================================
   AUTO FILENAME BUILDER
   ========================================================== */
function buildFilename(base) {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');

  const train = base.train_no ? base.train_no.replace(/\s+/g,'') : "NA";
  const cli   = base.cli_id ? base.cli_id.replace(/\s+/g,'') : "NA";

  return `${yyyy}${mm}${dd}_CVVRS_${train}_${cli}.pdf`;
}

/* ==========================================================
   OBSERVATION TABLE BUILDER (SECTION SPLIT)
   ========================================================== */
function buildObsTables(obsList) {

  const S1 = obsList.filter(o => o.sec === "CTO");
  const S2 = obsList.filter(o => o.sec === "ONRUN");
  const S3 = obsList.filter(o => o.sec === "HALTS");
  const S4 = obsList.filter(o => o.sec === "CHO");

  function makeTable(title, rows) {
    const body = [
      [
        {text:"ID", bold:true, fontSize:9},
        {text:"OBSERVATION", bold:true, fontSize:9},
        {text:"ROLE", bold:true, fontSize:9},
        {text:"VALUE", bold:true, fontSize:9},
        {text:"ABNORMALITIES", bold:true, fontSize:9},
      ]
    ];

    rows.forEach(r => {
      const borderColor = (r.value === r.default) ? "#009900" : "#CC0000";
      body.push([
        {text:String(r.id), fontSize:8, color:borderColor},
        {text:r.title, fontSize:8, color:borderColor},
        {text:r.role, fontSize:8, color:borderColor},
        {text:r.value, fontSize:8, color:borderColor},
        {text:r.abnormal || "-", fontSize:8, color:borderColor},
      ]);
    });

    return [
      {text:title, bold:true, fontSize:10, margin:[0,6,0,2]},
      {
        table: {
          widths: ["auto","*","auto","auto","*"],
          body: body
        },
        layout: "lightHorizontalLines",
        margin:[0,0,0,6]
      }
    ];
  }

  return [
    ...makeTable("SECTION-1: DURING CTO", S1),
    ...makeTable("SECTION-2: ON RUN",      S2),
    ...makeTable("SECTION-3: AT HALTS",    S3),
    ...makeTable("SECTION-4: AT CHO",      S4),
  ];
}

/* ==========================================================
   PHOTO PAGES (6 per page, 3 per row)
   ========================================================== */
async function buildPhotoPages(obsList) {
  const photoObs = obsList.filter(o => o.photo);

  if (photoObs.length === 0) return [];

  const blocks = [
    {text:"PHOTO EVIDENCE", bold:true, fontSize:12, pageBreak:"before", margin:[0,0,0,8]}
  ];

  let row = [];
  let count = 0;

  for (const p of photoObs) {
    const raw = await fileToBase64Raw(p.photo);
    const borderColor = (p.value === p.default) ? "#009900" : "#CC0000";

    row.push({
      stack:[
        {
          image:`data:image/jpeg;base64,${raw}`,
          width:160,
          border:[true,true,true,true],
          borderColor:borderColor,
          margin:[0,0,0,4]
        },
        {text:`${p.id}. ${p.title}`, fontSize:8}
      ],
      margin:[2,2,2,2]
    });

    count++;
    if (count % 3 === 0) {
      blocks.push({columns: row, columnGap:4});
      row = [];
    }
    if (count % 6 === 0) {
      blocks.push({text:"", pageBreak:"before"});
    }
  }

  if (row.length > 0) {
    blocks.push({columns: row, columnGap:4});
  }

  return blocks;
}

/* ==========================================================
   FINAL PDF BUILDER
   returns { filename, base64 }
   ========================================================== */
async function generateBase64PDF(base, obsList) {

  const logo = await loadLogoBase64();
  const filename = buildFilename(base);

  /* HEADER */
  const HEADER = {
    columns:[
      { image:logo, width:55 },
      {
        alignment:"center",
        width:"*",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:13},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:10},
          {text:"CVVRS ANALYSIS REPORT", bold:true, fontSize:12, margin:[0,2,0,0]}
        ]
      },
      {
        alignment:"right",
        width:110,
        text:`CLI (Observer):\n${base.cli_id}`,
        fontSize:9
      }
    ],
    margin:[0,0,0,8]
  };

  /* SUMMARY INFO TABLE */
  const INFO = {
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Analysis Date:", base.analysis_date, "Train No:",   base.train_no],
        ["Working Date:", base.date_work,     "Loco No:",     base.loco_no],
        ["From:", base.from_station,          "To:",          base.to_station],
        ["LP ID:", base.lp_id,                "ALP ID:",      base.alp_id],
        ["LP Name:", base.lp_name,            "ALP Name:",    base.alp_name]
      ]
    },
    layout:"lightHorizontalLines",
    fontSize:9,
    margin:[0,0,0,10]
  };

  /* OBS TABLES */
  const OBS = buildObsTables(obsList);

  /* FINAL REMARKS */
  const REMARKS = {
    table:{
      widths:["auto","*"],
      body:[
        [{text:"FINAL REMARKS:", bold:true}, base.remarks || "—"]
      ]
    },
    layout:"noBorders",
    fontSize:9,
    margin:[0,8,0,8]
  };

  /* PHOTO PAGES */
  const PHOTOS = await buildPhotoPages(obsList);

  const docDef = {
    pageSize:"A4",
    pageMargins:[25,28,25,28],
    content:[
      HEADER,
      INFO,
      ...OBS,
      REMARKS,
      ...PHOTOS
    ],
    footer:(page,pageCount)=>({
      text:`Page ${page} of ${pageCount}`,
      alignment:"center",
      fontSize:8
    })
  };

  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);
    pdf.getBase64(b64 => resolve({filename, base64:b64}));
  });
}

/* ==========================================================
   EXPORT
   ========================================================== */
window.PDF_ENGINE = {
  generateBase64: generateBase64PDF
};
