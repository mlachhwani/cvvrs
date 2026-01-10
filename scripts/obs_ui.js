/* ============================================================
   OBSERVATION UI (LP LEFT | ALP RIGHT)
   ============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  renderObservationsUI();
});

function renderObservationsUI() {
  if (!window.OBS_MASTER) return console.error("OBS_MASTER missing!");

  const container = document.getElementById("obs_container");
  container.innerHTML = "";

  const sections = [
    { title: "DURING CTO",   ids:[1,6]  },
    { title: "ON RUN",       ids:[7,20] },
    { title: "AT HALTS",     ids:[21,30]},
    { title: "AT CHO",       ids:[31,34]},
  ];

  sections.forEach(sec => {
    const secDiv = document.createElement("div");
    secDiv.className = "obs-section";

    const h = document.createElement("h4");
    h.textContent = sec.title;
    secDiv.appendChild(h);

    const row = document.createElement("div");
    row.className = "obs-row";

    const lpCol = document.createElement("div");
    const alpCol = document.createElement("div");
    lpCol.className = "obs-col lp-col";
    alpCol.className = "obs-col alp-col";

    const lpHead = document.createElement("div");
    const alpHead = document.createElement("div");
    lpHead.className = alpHead.className = "col-head";
    lpHead.textContent = "LP OBSERVATIONS";
    alpHead.textContent = "ALP OBSERVATIONS";

    lpCol.appendChild(lpHead);
    alpCol.appendChild(alpHead);

    OBS_MASTER.filter(o=>o.id>=sec.ids[0] && o.id<=sec.ids[1]).forEach(obs=>{
      const block = document.createElement("div");
      block.className = "obs-item";

      const title = document.createElement("div");
      title.className = "obs-title";
      title.textContent = obs.title;
      block.appendChild(title);

      const sel = document.createElement("select");
      sel.className = "obs-select";

      if (obs.type==="YESNO") ["YES","NO"].forEach(v=>sel.add(new Option(v,v)));
      if (obs.type==="YESNO_DAY") ["YES","NO","DAY TIME"].forEach(v=>sel.add(new Option(v,v)));
      if (obs.type==="RATING") ["VERY GOOD","FAIR","POOR"].forEach(v=>sel.add(new Option(v,v)));

      sel.value = obs.default;
      block.appendChild(sel);

      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.className = "photo-input";
      block.appendChild(file);

      // PHOTO REQUIRED LOGIC
      sel.addEventListener("change", ()=>{
        if (sel.value !== obs.default) block.classList.add("need-photo");
        else block.classList.remove("need-photo");
      });

      if (obs.role==="LP") lpCol.appendChild(block);
      else alpCol.appendChild(block);
    });

    row.appendChild(lpCol);
    row.appendChild(alpCol);
    secDiv.appendChild(row);
    container.appendChild(secDiv);
  });
}
