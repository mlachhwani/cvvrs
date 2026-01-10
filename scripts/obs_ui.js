/* ============================================================
   OBSERVATION UI (LP LEFT | ALP RIGHT)
   PHOTO_MODE = A (RED BORDER + 📷 REQUIRED)
   ============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  renderObservationsUI();
});

function renderObservationsUI() {
  if (!window.OBS_MASTER) {
    console.error("OBS_MASTER missing!");
    return;
  }

  const container = document.getElementById("obs_container");
  container.innerHTML = "";

  /* SECTION GROUPS BY ID RANGE */
  const sections = [
    { title: "DURING CTO", ids:[1, 6] },
    { title: "ON RUN",     ids:[7, 20] },
    { title: "AT HALTS",   ids:[21, 30] },
    { title: "AT CHO",     ids:[31, 34] }
  ];

  sections.forEach(sec => {
    const secDiv = document.createElement("div");
    secDiv.className = "obs-section";

    const title = document.createElement("h4");
    title.textContent = sec.title;
    secDiv.appendChild(title);

    const row = document.createElement("div");
    row.className = "obs-row";

    const lpCol = document.createElement("div");
    const alpCol = document.createElement("div");
    lpCol.className = "obs-col";
    alpCol.className = "obs-col";

    /* Column headers */
    const lpHead = document.createElement("div");
    lpHead.className = "col-head";
    lpHead.textContent = "LP OBSERVATIONS";
    lpCol.appendChild(lpHead);

    const alpHead = document.createElement("div");
    alpHead.className = "col-head";
    alpHead.textContent = "ALP OBSERVATIONS";
    alpCol.appendChild(alpHead);

    /* Filter section items */
    OBS_MASTER.filter(o => o.id>=sec.ids[0] && o.id<=sec.ids[1]).forEach(obs => {
      const block = document.createElement("div");
      block.className = "obs-item";

      /* Title */
      const t = document.createElement("div");
      t.className = "obs-title";
      t.textContent = obs.title;
      block.appendChild(t);

      /* Dropdown */
      const sel = document.createElement("select");
      sel.className = "obs-select";

      if (obs.type === "YESNO")       ["YES","NO"].forEach(v => sel.add(new Option(v,v)));
      if (obs.type === "YESNO_DAY")   ["YES","NO","DAY TIME"].forEach(v => sel.add(new Option(v,v)));
      if (obs.type === "RATING")      ["VERY GOOD","FAIR","POOR"].forEach(v => sel.add(new Option(v,v)));

      sel.value = obs.default;
      block.appendChild(sel);

      /* Photo input */
      const file = document.createElement("input");
      file.type = "file";
      file.accept = "image/*";
      file.className = "photo-input";
      block.appendChild(file);

      /* PHOTO_MODE = A → Red border when changed */
      sel.addEventListener("change", () => {
        if (sel.value !== obs.default) {
          block.classList.add("need-photo");
        } else {
          block.classList.remove("need-photo");
        }
      });

      /* Append to correct column */
      if (obs.role === "LP") lpCol.appendChild(block);
      else alpCol.appendChild(block);
    });

    row.appendChild(lpCol);
    row.appendChild(alpCol);
    secDiv.appendChild(row);
    container.appendChild(secDiv);
  });
}
