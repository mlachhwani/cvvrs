/* ============================================================
   PDF ENGINE (pdfMake) for CVVRS REPORT
   ------------------------------------------------------------
   Author: Your System (GitHub UI + Google Storage)
   ============================================================ */

/**
 * Convert image file -> Base64 for pdfMake
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Load Logo as Base64
 */
async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const base64 = await fileToBase64(blob);
  return `data:image/png;base64,${base64}`;
}

/**
 * IST Timestamp
 */
function getISTTimestamp() {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 5.5)); // IST
}

/**
 * PDF Filename Builder
 */
function buildFilename(divCount, cliId, cliCount, dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth()+1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `CVVRS_R(${divCount})_${cliId}(${cliCount})_${yyyy}-${mm}-${dd}.pdf`;
}

/**
 * MAIN PDF GENERATOR
 */
async function generatePDF(data, photos = [], meta = {}) {
  /* 
     data = {
        cli_id, cli_name,
        train_no, date_working, loco_no,
        from_station, to_station,
        lp_id, alp_id,
        final_remarks
     }

     photos = Array<File>
     meta = { divCount, cliCount }
  */

  const logoBase64 = await loadLogoBase64();
  const ist = getISTTimestamp();
  const fname = buildFilename(meta.divCount, data.cli_id, meta.cliCount, ist);

  /* HEADER BLOCK */
  const HEADER = {
    margin: [0,0,0,10],
    columns: [
      {
        image: logoBase64,
        width: 60,
        margin: [0,0,10,0]
      },
      {
        width: '*',
        alignment: 'center',
        stack: [
          {text: "SOUTH EAST CENTRAL RAILWAY", bold: true, fontSize: 14},
          {text: "ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize: 11},
          {text: "CVVRS ANALYSIS REPORT", bold: true, fontSize: 13, margin:[0,3,0,0]}
        ]
      },
      {
        width: 120,
        alignment: "right",
        text: `CLI (Observer):\n${data.cli_id}`,
        fontSize: 10
      }
    ]
  };

  /* TRAIN/CREW TABLE */
  const INFO_TABLE = {
    margin:[0,0,0,10],
    table: {
      widths: ['auto','*','auto','*'],
      body: [
        ["Train No:", data.train_no, "Working Date:", data.date_working],
        ["Loco No:", data.loco_no, "LP:", data.lp_id],
        ["From:", data.from_station, "ALP:", data.alp_id],
        ["To:", data.to_station, "", ""]
      ]
    },
    layout: 'lightHorizontalLines'
  };

  /* OBSERVATION TABLE PLACEHOLDER (Full 36 obs will inject here) */
  const OBSERVATIONS = {
    margin:[0,0,0,10],
    table: {
      widths: ['*','auto','auto'],
      body: [
        [{text:"Observation", bold:true}, {text:"Role", bold:true}, {text:"Status", bold:true}],
        // TODO: inject your 36 observation rows with status + LP/ALP
        // Example row:
        ["Conducting BFT & BPT", "LP", "YES (default)"],
        ["Use of Mobile Phone", "LP", "NO (default)"],
      ]
    },
    layout: 'lightHorizontalLines'
  };

  /* FINAL REMARKS */
  const FINAL_REMARKS = {
    margin:[0,5,0,10],
    table: {
      widths: ['auto','*'],
      body: [
        [{text:"FINAL REMARKS:", bold:true}, data.final_remarks || "NO ABNORMALITIES OBSERVED"]
      ]
    },
    layout: 'noBorders'
  };

  /* PHOTO PAGES */
  const PHOTO_SECTIONS = [];
  if (photos.length > 0) {
    PHOTO_SECTIONS.push({text: "PHOTO EVIDENCE", style: "photoTitle", pageBreak:'before'});

    let row = [];
    let count = 0;

    for (const file of photos) {
      const base64 = await fileToBase64(file);
      row.push({
        image: `data:image/jpeg;base64,${base64}`,
        width: 160,
        margin:[0,5,0,5],
        border: [true,true,true,true]
      });
      count++;

      if (count % 3 === 0) {
        PHOTO_SECTIONS.push({columns: row, columnGap: 5});
        row = [];
      }
      if (count % 6 === 0) {
        PHOTO_SECTIONS.push({text:"", pageBreak:'before'});
      }
    }
    if (row.length > 0) {
      PHOTO_SECTIONS.push({columns: row, columnGap: 5});
    }
  }

  /* FOOTER */
  function footer(currentPage, pageCount) {
    return {
      alignment: 'center',
      text: `Page ${currentPage.toString()} of ${pageCount}`,
      fontSize: 9
    };
  }

  /* DOCUMENT DEFINITION */
  const docDef = {
    pageSize: "A4",
    pageMargins: [25, 30, 25, 30],
    footer: footer,
    content: [
      HEADER,
      INFO_TABLE,
      OBSERVATIONS,
      FINAL_REMARKS,
      ...PHOTO_SECTIONS
    ],
    styles: {
      photoTitle:{ bold:true, fontSize:12, margin:[0,0,0,10] }
    }
  };

  /* DOWNLOAD PDF TO USER */
  pdfMake.createPdf(docDef).download(fname);

  return fname; // for logging
}

/* ============================================================
   TRIGGER FROM UI
   ============================================================ */
async function generateReport() {
  // Collect form data
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

  // TODO: Before PDF:
  // call validateDuplicate() via api.js
  // get {divCount, cliCount}
  const meta = { divCount: 1, cliCount: 1 }; // TEMP until API returns

  // TODO: collect photos from UI input
  const photos = []; // TEMP placeholder

  await generatePDF(data, photos, meta);
}

