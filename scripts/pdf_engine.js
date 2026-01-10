/* ============================================================
   PDF ENGINE + FRONTEND WORKFLOW (FULL PIPELINE)
   Author: CVVRS SECR
   ============================================================ */

/* ----------------- BASE64 CONVERTORS ---------------------- */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

async function loadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  const base64 = await fileToBase64(blob);
  return `data:image/png;base64,${base64}`;
}

/* ----------------- IST TIMESTAMP + FILENAME ---------------------- */
function getISTTimestamp() {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 5.5));
}

function buildFilename(divCount, cliId, cliCount, dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth()+1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `CVVRS_R(${divCount})_${cliId}(${cliCount})_${yyyy}-${mm}-${dd}.pdf`;
}

/* ----------------- PDF GENERATOR (RETURNS BASE64) ---------------------- */
function generatePDF_ReturnBase64(data, meta, TEST="CVVRS REPORT WILL BE HERE") {
  return new Promise(async resolve => {

    const logoBase64 = await loadLogoBase64();
    const ist = getISTTimestamp();
    const fname = buildFilename(meta.divCount, data.cli_id, meta.cliCount, ist);

    const HEADER = {
      margin: [0,0,0,10],
      columns: [
        { image: logoBase64, width: 60 },
        {
          width: "*",
          alignment: "center",
          stack: [
            {text:"SOUTH EAST CENTRAL RAILWAY", bold:true, fontSize:14},
            {text:"ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize:11},
            {text:"CVVRS ANALYSIS REPORT", bold:true, fontSize:13, margin:[0,3,0,0]}
          ]
        },
        {
          width: 130,
          alignment: "right",
          text:`CLI (Observer):\n${data.cli_id}`,
          fontSize:10
        }
      ]
    };

    const INFO_TABLE = {
      margin:[0,0,0,10],
      table:{
        widths:['auto','*','auto','*'],
        body:[
          ["Train No:", data.train_no, "Working Date:", data.date_working],
          ["Loco No:", data.loco_no, "LP:", data.lp_id],
          ["From:", data.from_station, "ALP:", data.alp_id],
          ["To:", data.to_station, "", ""]
        ]
      },
      layout:'lightHorizontalLines'
    };

    const FINAL_REMARKS = {
      margin:[0,5,0,10],
      table:{
        widths:['auto','*'],
        body:[
          [{text:"FINAL REMARKS:", bold:true}, data.final_remarks || "NO ABNORMALITIES OBSERVED"]
        ]
      },
      layout:'noBorders'
    };

    const docDef = {
      pageSize:"A4",
      pageMargins:[25,30,25,30],
      footer:(pg,pc)=>({
        alignment:"center",
        text:`Page ${pg} of ${pc}`,
        fontSize:9
      }),
      content:[
        HEADER,
        INFO_TABLE,
        {
          text: TEST, // temporary placeholder
          margin:[0,0,0,10],
          color:"#555",
          italics:true
        },
        FINAL_REMARKS
      ]
    };

    const pdf = pdfMake.createPdf(docDef);

    // return Base64 to caller + also download for user
    pdf.getBase64(b64 => {
      resolve({ filename: fname, file: b64 });
    });

    pdf.download(fname);
  });
}

/* ============================================================
   FINAL FRONTEND WORKFLOW
   ============================================================ */
async function generateReport() {

  // 1. COLLECT FORM DATA
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

  // 2. REQUIRED FIELD CHECK
  for (const k in data) {
    if (!data[k]) {
      alert("❌ REQUIRED FIELD MISSING: " + k);
      return;
    }
  }

  // 3. GOOGLE SHEET VALIDATION
  const res = await API.validateDuplicate(data);
  if (res.duplicate) {
    alert("❌ DUPLICATE ENTRY BLOCKED\nSame crew/train record exists this month!");
    return;
  }

  const meta = { divCount: res.divCount, cliCount: res.cliCount };

  // 4. PDF GENERATE + BASE64
  const b64pdf = await generatePDF_ReturnBase64(data, meta);
  const filename = b64pdf.filename;

  // 5. UPLOAD PDF
  const up = await API.uploadPDF(b64pdf.file, filename);
  if (!up.success) {
    alert("❌ PDF UPLOAD FAILED");
    return;
  }

  // 6. APPEND HISTORY
  await API.appendHistory({
    cli_id: data.cli_id,
    cli_name: data.cli_name,
    train_no: data.train_no,
    date_working: data.date_working,
    loco_no: data.loco_no,
    from_station: data.from_station,
    to_station: data.to_station,
    lp_id: data.lp_id,
    alp_id: data.alp_id,
    divCount: meta.divCount,
    cliCount: meta.cliCount,
    pdfLink: up.pdfLink
  });

  // 7. DONE
  alert(
    "✅ SUCCESS!\n\n" +
    "Division Count: " + meta.divCount + "\n" +
    "CLI Count: " + meta.cliCount + "\n\n" +
    "PDF LINK:\n" + up.pdfLink
  );
}
