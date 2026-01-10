const API={};
API.WEBAPP_URL="https://script.google.com/macros/s/AKfycbw-vvjXMzkOpOvdPpjaAfTbJU3mlUV4YeDoDQMr_zCv5nQekYeGj0OmPyPiTk0wod4R/exec";

API._post=async function(action,payload){
  const r=await fetch(API.WEBAPP_URL,{
    method:"POST",
    body:JSON.stringify({action,payload}),
    headers:{"Content-Type":"application/json"}
  });
  return await r.json();
};

API.validateDuplicate=async function(d){
  const p={
    cli_id:d.cli_id,
    train_no:d.train_no,
    date_working:d.date_work,
    loco_no:d.loco_no,
    from_station:d.from_station,
    to_station:d.to_station,
    lp_id:d.lp_id,
    alp_id:d.alp_id,
    analysis_date:d.analysis_date
  };
  return await API._post("validate",p);
};

API.uploadPDF=async function(b64,fn,ad){
  return await API._post("upload",{filename:fn,base64:b64,analysis_date:ad});
};

API.appendHistory=async function(h){
  return await API._post("history",{
    analysis_date:h.analysis_date,
    month:h.analysis_date.substring(0,7),
    cli_id:h.cli_id,
    cli_name:h.cli_name,
    train_no:h.train_no,
    date_working:h.date_work,
    loco_no:h.loco_no,
    from_station:h.from_station,
    to_station:h.to_station,
    lp_id:h.lp_id,
    lp_name:h.lp_name,
    alp_id:h.alp_id,
    alp_name:h.alp_name,
    observations:h.observations,
    pdfLink:h.pdfLink
  });
};
