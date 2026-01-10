function renderObservationsUI() {
  const box = document.getElementById("obs_container");
  box.innerHTML = "";

  OBS_MASTER.forEach(o=>{
    const row = document.createElement("div");
    row.className="obs-box";

    const title = document.createElement("div");
    title.className="obs-title";
    title.innerText = `${o.id}. ${o.title} (${o.role})`;

    const right = document.createElement("div");
    right.className="obs-right";

    const sel = document.createElement("select");
    sel.className="obs-select";
    sel.dataset.id = o.id;
    sel.innerHTML = getOptions(o);
    sel.value = o.default;

    const abn = document.createElement("input");
    abn.className="obs-abn";
    abn.dataset.id = o.id;
    abn.placeholder="Abnorm.";

    const file = document.createElement("input");
    file.type="file";
    file.accept="image/*";
    file.className="obs-photo";
    file.dataset.id = o.id;

    right.appendChild(sel);
    right.appendChild(abn);
    right.appendChild(file);

    row.appendChild(title);
    row.appendChild(right);
    box.appendChild(row);
  });
}

function getOptions(o) {
  if (o.type=="YESNO") return `<option>YES</option><option>NO</option>`;
  if (o.type=="YESNO_DAY") return `<option>YES</option><option>DAY TIME</option><option>NO</option>`;
  if (o.type=="RATING") return `<option>VERY GOOD</option><option>FAIR</option><option>POOR</option>`;
  return `<option>${o.default}</option>`;
}
