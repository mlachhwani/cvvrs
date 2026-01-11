/* =============================================================================
   PDF ENGINE — FULL FILE (ML/01 MODE)
   Locked for MLACHHWANI / CVVRS
============================================================================= */

console.log("pdf_engine.js loaded");

/* =============================================================================
   HELPERS
============================================================================= */

function getIST() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 19800000); // +5:30
}

function fileToBase64(file) {
  return new Promise((resolve,reject) => {
    const r = new FileReader();
    r.onload = () => {
      const base64 = r.result.split(",")[1];
      resolve(base64);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* load IR logo */
async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  return await fileToBase64(blob);
}

/* Build standard filename */
function buildFilename(divCount, cliId, cliCount, d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `CVVRS_R(${divCount})_${cliId}(${cliCount})_${yyyy}-${mm}-${dd}.pdf`;
}

/* =============================================================================
   VALIDATION LOGIC (OBSERVATION RULES)
============================================================================= */

function validateObsRules(obsRows) {
  for (const o of obsRows) {
    const changed = (o.value !== o.default);
    const needsAbn = (o.type === "RATING" && o.value !== "VERY GOOD");

    /* PHOTO rule */
    if (o.type === "YESNO" || o.type === "YESNO_DAY") {
      if (changed && !o.photoFile) {
        alert(`❌ PHOTO REQUIRED for OBS ${o.id}: ${o.title}`);
        return false;
      }
      if (o.type === "YESNO_DAY" && o.value === "NO" && !o.photoFile) {
        alert(`❌ PHOTO REQUIRED (value=NO) for OBS ${o.id}: ${o.title}`);
        return false;
      }
    }

    if (o.type === "RATING") {
      if (needsAbn && !o.abnormalities) {
        alert(`❌ ABNORMALITIES REQUIRED for OBS ${o.id}: ${o.title}`);
        return false;
      }
      if (needsAbn && !o.photoFile) {
        alert(`❌ PHOTO REQUIRED (RATING change) for OBS ${o.id}: ${o.title}`);
        return false;
      }
    }
  }
  return true;
}

/* =============================================================================
   BUILD OBSERVATION TABLE FOR PDF
============================================================================= */

function buildObsTable(obsRows, title) {
  const body = [
    [
      {text:"Obs#", bold:true},
      {text:"Observation", bold:true},
      {text:"Role", bold:true},
      {text:"Status", bold:true},
      {text:"Abn", bold:true}
    ]
  ];

  obsRows.forEach(r => {
    const same = (r.value === r.default);
    const color = same ? "#006600" : "#cc0000";

    body.push([
      {text:String(r.id), color},
      {text:r.title, color},
      {text:r.role, color},
      {text:r.value, color},
      {text:r.abnormalities || "-", color}
    ]);
  });

  return [
    {text:title, bold:true, margin:[0,5,0,3]},
    {
      table:{
        widths:["auto","*","auto","auto","auto"],
        body
      },
      layout:"lightHorizontalLines",
      margin:[0,0,0,8]
    }
  ];
}

/* =============================================================================
   BUILD PHOTO PAGES (3 PER ROW, 6 PER PAGE)
============================================================================= */

async function buildPhotoPages(obsRows) {
  const rows = obsRows.filter(o => o.photoFile);
  if (rows.length === 0) return [];

  const pages = [{ text:"PHOTO EVIDENCE", bold:true, fontSize:13, margin:[0,0,0,10], pageBreak:'before'}];

  let row = [];
  let count = 0;

  for (const r of rows) {
    const base64 = await fileToBase64(r.photoFile);
    const same = (r.value === r.default);
    const borderColor = same ? "#006600" : "#cc0000";

    row.push({
      stack:[
        {
          image:`data:image/jpeg;base64,${base64}`,
          width:160,
          border:[true,true,true,true],
          borderColor:borderColor,
          margin:[0,0,0,5]
        },
        {
          text:`${r.id}. ${r.title}`,
          fontSize:9,
          margin:[0,2,0,0]
        }
      ],
      margin:[0,5,0,5]
    });

    count++;
    if (count % 3 === 0) {
      pages.push({columns:row, columnGap:5});
      row = [];
    }
    if (count % 6 === 0) {
      pages.push({text:"", pageBreak:'before'});
    }
  }

  if (row.length > 0) {
    pages.push({columns:row, columnGap:5});
  }

  return pages;
}

/* =============================================================================
   MAIN GENERATOR
============================================================================= */
async function generatePDF_and_Upload() {

  /* --- COLLECT FORM DATA --- */
  const data = {
    cli_id: document.getElementById("cli_id").value.trim(),
    cli_name: document.getElementById("cli_name").value.trim(),
    train_no: document.getElementById("train_no").value.trim(),
    date_working: document.getElementById("date_work").value.trim(),
    loco_no: document.getElementById("loco_no").value.trim(),
    from_station: document.getElementById("from_station").value.trim(),
    from_station_name: document.getElementById("from_station_name").value.trim(),
    to_station: document.getElementById("to_station").value.trim(),
    to_station_name: document.getElementById("to_station_name").value.trim(),
    lp_id: document.getElementById("lp_id").value.trim(),
    lp_name: document.getElementById("lp_name").value.trim(),
    alp_id: document.getElementById("alp_id").value.trim(),
    alp_name: document.getElementById("alp_name").value.trim(),
    final_remarks: document.getElementById("remarks").value.trim()
  };

  /* Required checks */
  for (const k in data) {
    if (!data[k]) {
      alert(`❌ REQUIRED FIELD MISSING: ${k}`);
      return;
    }
  }

  /* --- DUPLICATE CHECK --- */
  const dup = await API.validateDuplicate(data);
  if (dup.duplicate) {
    alert("❌ DUPLICATE ENTRY BLOCKED FOR THIS MONTH!");
    return;
  }

  /* --- GET COUNTS --- */
  const counts = await API.getMonthlyCounts(data.cli_id);
  const divCount = counts.divCount || 0;
  const cliCount = counts.cliCount || 0;

  /* --- OBSERVE DATA --- */
  const obsRows = OBS_UI.getData();

  /* --- RULE CHECK --- */
  if (!validateObsRules(obsRows)) return;

  /* --- BUILD PDF --- */
  const logo = await loadLogoBase64();
  const now = getIST();
  const filename = buildFilename(divCount, data.cli_id, cliCount, now);

  /* Section splits */
  const CTO = obsRows.filter(o => o.id>=1 && o.id<=6);
  const ONRUN = obsRows.filter(o => o.id>=7 && o.id<=20);
  const HALTS = obsRows.filter(o => o.id>=21 && o.id<=30);
  const CHO = obsRows.filter(o => o.id>=31 && o.id<=34);

  const CONTENT = [];

  /* HEADER */
  CONTENT.push({
    columns:[
      { image:`data:image/png;base64,${logo}`, width:60 },
      {
        width:"*",
        alignment:"center",
        stack:[
          {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:14},
          {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:11},
          {text:"CVVRS ANALYSIS REPORT", bold:true, fontSize:13, margin:[0,3,0,0]}
        ]
      },
      {
        width:120,
        alignment:"right",
        text:`CLI:\n${data.cli_id}`,
        fontSize:10
      }
    ],
    margin:[0,0,0,8]
  });

  /* INFO TABLE */
  CONTENT.push({
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Train No:", data.train_no, "Working Date:", data.date_working],
        ["Loco No:", data.loco_no, "LP:", data.lp_id],
        ["From:", data.from_station+" ("+data.from_station_name+")", "ALP:", data.alp_id],
        ["To:", data.to_station+" ("+data.to_station_name+")", "", ""]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,0,0,10]
  });

  /* OBS TABLES */
  CONTENT.push(...buildObsTable(CTO, "SECTION-1: DURING CTO"));
  CONTENT.push({text:"", pageBreak:'before'});
  CONTENT.push(...buildObsTable(ONRUN, "SECTION-2: ON RUN"));
  CONTENT.push({text:"", pageBreak:'before'});
  CONTENT.push(...buildObsTable(HALTS, "SECTION-3: AT HALTS"));
  CONTENT.push({text:"", pageBreak:'before'});
  CONTENT.push(...buildObsTable(CHO, "SECTION-4: AT CHO"));

  /* FINAL REMARKS */
  CONTENT.push({
    table:{ widths:["auto","*"], body:[[ {text:"FINAL REMARKS:", bold:true}, data.final_remarks ]] },
    layout:"noBorders",
    margin:[0,10,0,10]
  });

  /* PHOTOS */
  const photoPages = await buildPhotoPages(obsRows);
  CONTENT.push(...photoPages);

  const docDef = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    footer:(current,total)=>({
      text:`Page ${current} of ${total}`,
      alignment:"center",
      fontSize:8
    }),
    content: CONTENT
  };

  /* --- EXPORT PDF BASE64 --- */
  const pdfObj = await new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);
    pdf.getBase64(b64 => resolve({ base64:b64 }));
  });

  /* --- UPLOAD --- */
  const up = await API.uploadPDF(pdfObj.base64, filename);
  if (!up.success) {
    alert("❌ PDF UPLOAD FAILED");
    return;
  }

  /* --- HISTORY APPEND --- */
  await API.appendHistory({
    timestamp: now.toISOString(),
    cli_id: data.cli_id,
    cli_name: data.cli_name,
    train_no: data.train_no,
    date_working: data.date_working,
    loco_no: data.loco_no,
    from: data.from_station,
    to: data.to_station,
    lp_id: data.lp_id,
    lp_name: data.lp_name,
    alp_id: data.alp_id,
    alp_name: data.alp_name,
    divCount,
    cliCount,
    pdfLink: up.pdfLink
  });

  alert(
    "✅ SUCCESS!\n\n" +
    "Division Count: "+divCount+"\n" +
    "CLI Count: "+cliCount+"\n\n" +
    "PDF Uploaded!"
  );

  window.open(up.pdfLink, "_blank");
}

/* =============================================================================
   PUBLIC ENTRY
============================================================================= */
window.PDF_ENGINE = {
  run: generatePDF_and_Upload
};
