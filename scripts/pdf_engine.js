/**************************************************************
 * pdf_engine.js — Delivery-25 (STRUCTURED CONTENT, NO PHOTOS)
 * ML/01 LOCKED — FULL FILE DELIVERY ONLY
 **************************************************************/

console.log("pdf_engine.js loaded");

/**************************************************************
 * LOAD LOGO BASE64
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
 * TIME & FORMAT HELPERS
 **************************************************************/
function pdfGetIST() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 5.5);
}

function pdfDateYMD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

/**************************************************************
 * SECTION BUILDER — OBSERVATION GRID (4 BLOCKS)
 **************************************************************/
function buildObsSection(title, lpRows, alpRows) {

  const max = Math.max(lpRows.length, alpRows.length);
  const body = [];

  // header row
  body.push([
    {text:"LP OBSERVATION", bold:true, alignment:"center"},
    {text:"ALP OBSERVATION", bold:true, alignment:"center"}
  ]);

  for (let i=0; i<max; i++) {
    const lp = lpRows[i];
    const alp = alpRows[i];

    body.push([
      lp ? `${lp.id}. ${lp.title} → ${lp.value}` : "",
      alp ? `${alp.id}. ${alp.title} → ${alp.value}` : ""
    ]);
  }

  return [
    {text:title, bold:true, margin:[0,10,0,4]},
    {
      table:{
        widths:["50%","50%"],
        body: body
      },
      layout:"lightHorizontalLines"
    }
  ];
}

/**************************************************************
 * MAIN STRUCTURED PDF (NO PHOTOS)
 **************************************************************/
async function pdfMakeStructured(base, obs) {

  const logo = await pdfLoadLogoBase64();
  const ist  = pdfGetIST();
  const ymd  = pdfDateYMD(ist);

  const filename = `CVVRS_${base.cli_id}_${ymd}.pdf`;

  /******************************
   * PREP SECTION GROUPING
   ******************************/
  const CTO_LP   = obs.filter(o=>o.sec==="CTO"   && o.role==="LP");
  const CTO_ALP  = obs.filter(o=>o.sec==="CTO"   && o.role==="ALP");
  const RUN_LP   = obs.filter(o=>o.sec==="RUN"   && o.role==="LP");
  const RUN_ALP  = obs.filter(o=>o.sec==="RUN"   && o.role==="ALP");
  const HALT_LP  = obs.filter(o=>o.sec==="HALT"  && o.role==="LP");
  const HALT_ALP = obs.filter(o=>o.sec==="HALT"  && o.role==="ALP");
  const CHO_LP   = obs.filter(o=>o.sec==="CHO"   && o.role==="LP");
  const CHO_ALP  = obs.filter(o=>o.sec==="CHO"   && o.role==="ALP");

  /******************************
   * DOC CONTENT
   ******************************/
  const docDef = {
    pageSize:"A4",
    pageMargins:[25,30,25,30],
    footer:(pg,pc)=>({text:`Page ${pg} of ${pc}`, alignment:"center", fontSize:9}),

    content:[
      /**************** HEADER ****************/
      {
        columns:[
          { image:logo, width:60 },
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
            width:120, alignment:"right",
            text:`CLI: ${base.cli_id}\nAnalysis: ${base.analysis_date}`, fontSize:10
          }
        ],
        margin:[0,0,0,10]
      },

      /**************** TRAIN SUMMARY ****************/
      {text:"TRAIN SUMMARY", bold:true, margin:[0,5,0,5]},
      {
        table:{
          widths:["auto","*","auto","*"],
          body:[
            ["Train No:", base.train_no,  "Working Date:", base.date_work],
            ["Loco No:",  base.loco_no,   "Analysis By:",  base.cli_name],
            ["From:",     base.from_station_name,  "To:", base.to_station_name]
          ]
        },
        layout:"lightHorizontalLines",
        margin:[0,0,0,10]
      },

      /**************** CREW INFO ****************/
      {text:"CREW DETAILS", bold:true, margin:[0,5,0,5]},
      {
        table:{
          widths:["auto","*","auto","*"],
          body:[
            ["LP ID:", base.lp_id,    "ALP ID:", base.alp_id],
            ["LP Name:", base.lp_name, "ALP Name:", base.alp_name]
          ]
        },
        layout:"lightHorizontalLines",
        margin:[0,0,0,10]
      },

      /**************** SECTION-1 CTO ****************/
      ...buildObsSection("SECTION-1: DURING CTO", CTO_LP, CTO_ALP),

      /**************** SECTION-2 ON RUN ****************/
      {text:"", pageBreak:"before"},
      ...buildObsSection("SECTION-2: ON RUN", RUN_LP, RUN_ALP),

      /**************** SECTION-3 HALTS ****************/
      {text:"", pageBreak:"before"},
      ...buildObsSection("SECTION-3: AT HALTS", HALT_LP, HALT_ALP),

      /**************** SECTION-4 CHO ****************/
      {text:"", pageBreak:"before"},
      ...buildObsSection("SECTION-4: AT CHO", CHO_LP, CHO_ALP),

      /**************** FINAL REMARKS ****************/
      {text:"FINAL REMARKS", bold:true, margin:[0,10,0,4]},
      {text: base.remarks || "NIL", margin:[0,0,0,5]}
    ]
  };

  return new Promise(resolve => {
    const pdf = pdfMake.createPdf(docDef);
    pdf.getBase64(b64=>resolve({filename, base64:b64}));
    pdf.download(filename);
  });
}

/**************************************************************
 * PUBLIC HOOK FOR submit.js
 **************************************************************/
window.PDF_ENGINE = {
  generateStructured: pdfMakeStructured
};
