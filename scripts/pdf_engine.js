/* ============================================================
   PDF ENGINE + FULL OBS LOGIC + FRONTEND WORKFLOW
   PHOTO_ORDER = A (OBS ORDER)
   OBS_TABLE  = B (SECTION SPLIT)
   PHOTO_SIZE = A (160px)
   ============================================================ */

/* ------------ HELPERS ------------- */
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

function getISTTimestamp() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

function buildFilename(divCount, cliId, cliCount, dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `CVVRS_R(${divCount})_${cliId}(${cliCount})_${y}-${m}-${d}.pdf`;
}

/* ============================================================
   READ OBS DATA FROM UI
============================================================ */
function collectObservations() {
  const rows = [];
  OBS_MASTER.forEach(obs => {
    const sel = document.querySelector(`.obs-select[data-id="${obs.id}"]`);
    const photo = document.querySelector(`.obs-photo[data-id="${obs.id}"]`);
    const abn = document.querySelector(`.obs-abn[data-id="${obs.id}"]`);

    const obj = {
      id: obs.id,
      title: obs.title,
      role: obs.role,
      type: obs.type,
      default: obs.default,
      value: sel.value,
      abnormalities: abn ? abn.value.trim() : "",
      photoFile: photo.files.length > 0 ? photo.files[0] : null
    };

    rows.push(obj);
  });
  return rows;
}

/* ============================================================
   VALIDATION RULES BEFORE PDF
============================================================ */
async function validateObservationRules(obsRows) {
  for (const o of obsRows) {
    const changed = (o.value !== o.default);

    // PHOTO mandatory if changed
    if (changed && !o.photoFile) {
      alert(`❌ PHOTO REQUIRED for OBS ${o.id}: ${o.title}`);
      return false;
    }

    // RATING logic: abnormalities mandatory if not VERY GOOD
    if (o.type === "RATING" && o.value !== "VERY GOOD") {
      if (!o.abnormalities) {
        alert(`❌ ABNORMALITIES REQUIRED for OBS ${o.id}: ${o.title}`);
        return false;
      }
      if (!o.photoFile) {
        alert(`❌ PHOTO REQUIRED for RATING CHANGE at OBS ${o.id}: ${o.title}`);
        return false;
      }
    }
  }
  return true;
}

/* ============================================================
   PDF TABLE BUILDER (SECTION SPLIT)
============================================================ */
function buildObservationTables(obsRows) {
  const sections = {
    CTO: obsRows.filter(o => o.id >= 1 && o.id <= 6),
    ONRUN: obsRows.filter(o => o.id >= 7 && o.id <= 20),
    HALTS: obsRows.filter(o => o.id >= 21 && o.id <= 30),
    CHO: obsRows.filter(o => o.id >= 31 && o.id <= 34),
  };

  const makeTable = (title, rows) => {
    const body = [
      [
        {text:"Obs#", bold:true},
        {text:"Observation", bold:true},
        {text:"Role", bold:true},
        {text:"Status", bold:true},
        {text:"Abnormalities", bold:true}
      ]
    ];

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
        table:{widths:["auto","*", "auto","auto","*"], body:body},
        layout:"lightHorizontalLines"
      }
    ];
  };

  const blocks = [];

  blocks.push(...makeTable("SECTION-1: DURING CTO", sections.CTO));
  blocks.push({text:"", pageBreak:'before'});
  blocks.push(...makeTable("SECTION-2: ON RUN", sections.ONRUN));
  blocks.push({text:"", pageBreak:'before'});
  blocks.push(...makeTable("SECTION-3: AT HALTS", sections.HALTS));
  blocks.push({text:"", pageBreak:'before'});
  blocks.push(...makeTable("SECTION-4: AT CHO", sections.CHO));

  return blocks;
}

/* ============================================================
   PHOTO GRID BUILDER (PHOTO_ORDER = A)
============================================================ */
async function buildPhotoPages(obsRows) {
  const photoObs = obsRows.filter(o => o.photoFile);

  if (photoObs.length === 0) return [];

  const PHOTO_WIDTH = 160; // PHOTO_SIZE = A

  const pages = [{text:"PHOTO EVIDENCE", style:"photoTitle", pageBreak:'before'}];

  let row = [];
  let count = 0;

  for (const p of photoObs) {
    const base64 = await fileToBase64(p.photoFile);

    const borderColor = (p.value === p.default) ? "#009900" : "#cc0000";

    row.push({
      stack:[
        { image:`data:image/jpeg;base64,${base64}`, width:PHOTO_WIDTH, margin:[0,0,0,5],
          border:[true,true,true,true], borderColor:borderColor },
        { text:`${p.id}. ${p.title}`, fontSize:9, margin:[0,2,0,0] }
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

/* ============================================================
   MAIN PDF GENERATOR + BASE64 RETURN
============================================================ */
async function generatePDF_ReturnBase64(data, meta, obsRows) {
  const logo = await loadLogoBase64();
  const ist = getISTTimestamp();
  const filename = buildFilename(meta.divCount, data.cli_id, meta.cliCount, ist);

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

  const INFO = {
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["Train No:", data.train_no, "Working Date:", data.date_working],
        ["Loco No:", data.loco_no, "LP:", data.lp_id],
        ["From:", data.from_station, "ALP:", data.alp_id],
        ["To:", data.to_station, "", ""]
      ]
    },
    layout:"lightHorizontalLines",
    margin:[0,0,0,10]
  };

  const FINAL_REMARKS = {
    table:{ widths:["auto","*"], body:[[ {text:"FINAL REMARKS:", bold:true}, data.final_remarks ]] },
    layout:"noBorders",
    margin:[0,10,0,10]
  };

  const OBS_TABLES = buildObservationTables(obsRows);
  const PHOTO_PAGES = await buildPhotoPages(obsRows);

  const docDef = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    footer:(pg,pc)=>({text:`Page ${pg} of ${pc}`, alignment:"center", fontSize:9}),
    styles:{ photoTitle:{bold:true,fontSize:12,margin:[0,0,0,10]} },
    content:[
      HEADER,
      INFO,
      ...OBS_TABLES,
      FINAL_REMARKS,
      ...PHOTO_PAGES
    ]
  };

  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);
    pdf.getBase64(b64 => resolve({filename, base64:b64}));
    pdf.download(filename);
  });
}

/* ============================================================
   FINAL FRONTEND WORKFLOW
============================================================ */
async function generateReport() {
  // COLLECT FORM DATA
  const data = {
    cli_id: document.getElementById("cli_id").value.trim(),
    cli_name: document.getElementById("cli_name").value.trim(),
    train_no: document.getElementById("train_no").value.trim(),
    date_working: document.getElementById("date_work").value.trim(),
    loco_no: document.getElementById("loco_no").value.trim(),
    from_station: document.getElementById("from_station").value.trim(),
    to_station: document.getElementById("to_station").value.trim(),
    lp_id: document.getElementById("lp_id").value.trim(),
    alp_id: document.getElementById("alp_id").value.trim(),
    final_remarks: document.getElementById("remarks").value.trim()
  };

  // REQUIRED FIELD CHECK
  for (const k in data) {
    if (!data[k]) {
      alert(`❌ REQUIRED FIELD MISSING: ${k}`);
      return;
    }
  }

  // DUPLICATE + COUNT
  const check = await API.validateDuplicate(data);
  if (check.duplicate) {
    alert("❌ DUPLICATE ENTRY BLOCKED FOR THIS MONTH!");
    return;
  }

  const meta = { divCount: check.divCount, cliCount: check.cliCount };

  // OBS DATA
  const obsRows = collectObservations();

  // RULE CHECK
  const ok = await validateObservationRules(obsRows);
  if (!ok) return;

  // PDF BASE64
  const pdfObj = await generatePDF_ReturnBase64(data, meta, obsRows);

  // UPLOAD
  const upload = await API.uploadPDF(pdfObj.base64, pdfObj.filename);
  if (!upload.success) {
    alert("❌ PDF UPLOAD FAILED!");
    return;
  }

  // HISTORY
  await API.appendHistory({
    cli_id:data.cli_id, cli_name:data.cli_name,
    train_no:data.train_no, date_working:data.date_working,
    loco_no:data.loco_no, from_station:data.from_station, to_station:data.to_station,
    lp_id:data.lp_id, alp_id:data.alp_id,
    divCount:meta.divCount, cliCount:meta.cliCount,
    pdfLink:upload.pdfLink
  });

  alert(
    "✅ SUCCESS!\n\n" +
    "Division Count: " + meta.divCount + "\n" +
    "CLI Count: " + meta.cliCount + "\n\n" +
    "PDF Link:\n" + upload.pdfLink
  );
}
