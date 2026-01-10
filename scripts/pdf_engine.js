function fileToBase64(file) {
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload = ()=> res(r.result.split(",")[1]);
    r.onerror= e=> rej(e);
    r.readAsDataURL(file);
  });
}

function collectObservations() {
  const out=[];
  OBS_MASTER.forEach(o=>{
    const sel = document.querySelector(`.obs-select[data-id="${o.id}"]`);
    const abn = document.querySelector(`.obs-abn[data-id="${o.id}"]`);
    const ph  = document.querySelector(`.obs-photo[data-id="${o.id}"]`);
    out.push({
      id:o.id, title:o.title, role:o.role, default:o.default,
      value:sel.value,
      abnormalities:abn.value.trim(),
      file: ph.files[0]||null
    });
  });
  return out;
}

async function validateObs(obs) {
  for (const o of obs) {
    const changed = (o.value!==o.default);
    if (changed && !o.file) {
      alert(`PHOTO REQUIRED for ${o.id}. ${o.title}`);
      return false;
    }
    if (o.default==="VERY GOOD" && o.value!=="VERY GOOD") {
      if (!o.abnormalities) {
        alert(`ABNORMALITY REQUIRED for ${o.id}. ${o.title}`);
        return false;
      }
      if (!o.file) {
        alert(`PHOTO REQUIRED for ${o.id}. ${o.title}`);
        return false;
      }
    }
  }
  return true;
}

async function generatePDF_ReturnBase64(data, obs, meta) {
  const HEADER={
    text:"CVVRS ANALYSIS REPORT",
    alignment:"center",
    bold:true,fontSize:14,margin:[0,0,0,10]
  };

  const INFO={
    table:{
      widths:["auto","*","auto","*"],
      body:[
        ["CLI",data.cli_id,"Date",data.analysis_date],
        ["Train",data.train_no,"Working",data.date_work],
        ["Loco",data.loco_no,"LP",data.lp_id],
        ["From",data.from_station,"ALP",data.alp_id],
        ["To",data.to_station,"",""]
      ]
    },
    margin:[0,0,0,10]
  };

  const OBS_TABLE={
    table:{
      widths:["auto","*","auto","auto","*"],
      body:[
        ["ID","Observation","Role","Value","Abnorm."],
        ...obs.map(o=>[
          o.id,
          o.title,
          o.role,
          o.value,
          o.abnormalities||"-"
        ])
      ]
    },
    margin:[0,0,0,10]
  };

  const FINAL={
    text:"FINAL REMARKS:\n"+data.remarks,
    margin:[0,10,0,10]
  };

  const doc={
    pageSize:"A4",
    pageMargins:[25,25,25,25],
    content:[HEADER,INFO,OBS_TABLE,FINAL]
  };

  return new Promise(r=>{
    const pdf=pdfMake.createPdf(doc);
    pdf.getBase64(b64=> r({filename:`CVVRS.pdf`,base64:b64}));
  });
}

document.getElementById("submit_btn").addEventListener("click", async()=>{

  const data={
    cli_id:cli_id.value,
    cli_name:cli_name.value,
    train_no:train_no.value,
    date_work:date_work.value,
    loco_no:loco_no.value,
    from_station:from_station.value,
    to_station:to_station.value,
    lp_id:lp_id.value,
    lp_name:lp_name.value,
    alp_id:alp_id.value,
    alp_name:alp_name.value,
    analysis_date:analysis_date.value,
    remarks:remarks.value
  };

  const obs=collectObservations();
  if (!await validateObs(obs)) return;

  const check = await API.validateDuplicate(data);
  if (check.duplicate) {
    alert("Duplicate entry blocked!");
    return;
  }

  const pdfObj = await generatePDF_ReturnBase64(data,obs,check);

  const up = await API.uploadPDF(pdfObj.base64, pdfObj.filename, data.analysis_date);
  if (!up.success) { alert("Upload failed"); return; }

  await API.appendHistory({
    ...data,
    pdfLink:up.pdfLink,
    observations:obs
  });

  alert("SUCCESS!\nPDF: "+up.pdfLink);
});
