/**************************************************************
 * pdf_engine.js — Delivery-24 (PDF FOUNDATION LAYER)
 * Stage: Base Ready (NO formatting yet)
 * ML/01 LOCKED — Full file delivery only
 **************************************************************/

console.log("pdf_engine.js loaded");

/**************************************************************
 * LOAD LOGO AS BASE64 (USED IN HEADER)
 **************************************************************/
async function pdfLoadLogoBase64() {
  const res = await fetch("assets/ir_logo.png");
  const blob = await res.blob();
  return await blobToBase64(blob);
}

function blobToBase64(blob) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
}

/**************************************************************
 * TIME HELPERS (IST)
 **************************************************************/
function pdfGetIST() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

function pdfDateYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${dd}`;
}

/**************************************************************
 * CORE GENERATOR (EMPTY CONTENT)
 * Returns Base64 + triggers download
 **************************************************************/
async function pdfMakeEmpty(data) {

  const logo = await pdfLoadLogoBase64();
  const ist  = pdfGetIST();
  const ymd  = pdfDateYMD(ist);

  /* filename format for now (will change later) */
  const filename = `CVVRS_${data.cli_id}_${ymd}.pdf`;

  const docDef = {
    pageSize: "A4",
    pageMargins: [25, 30, 25, 30],

    footer: function(page, pages) {
      return {
        text: `Page ${page} of ${pages}`,
        alignment: 'center',
        fontSize: 9
      };
    },

    content: [
      {
        columns: [
          { image: logo, width: 60 },
          {
            width: "*",
            alignment: "center",
            stack: [
              { text: "SOUTH EAST CENTRAL RAILWAY", bold: true, fontSize: 14 },
              { text: "ELECTRICAL (OP) DEPARTMENT, RAIPUR DIVISION", fontSize: 11 },
              { text: "CVVRS ANALYSIS REPORT", bold: true, fontSize: 13, margin: [0,3,0,0] }
            ]
          },
          {
            width: 120,
            alignment: "right",
            text: `CLI: ${data.cli_id}\nDate: ${ymd}`,
            fontSize: 10
          }
        ],
        margin: [0,0,0,10]
      },

      /* placeholder (no table yet) */
      {
        text: "PDF ENGINE READY\nFormatting in Delivery-25",
        fontSize: 12,
        margin: [0,50,0,0]
      }
    ]
  };

  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);

    pdf.getBase64(b64 => {
      resolve({
        filename,
        base64: b64
      });
    });

    pdf.download(filename);
  });
}

/**************************************************************
 * TEST HOOK (for submit.js)
 **************************************************************/
window.PDF_ENGINE = {
  generateEmpty: pdfMakeEmpty
};
