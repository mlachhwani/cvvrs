/* ============================================================
   OBSERVATION UI GENERATOR (LP LEFT | ALP RIGHT)
   ============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  renderObservationsUI();
});

function renderObservationsUI() {

  if (!window.OBS_MASTER) {
    console.error("OBS_MASTER not loaded!");
    return;
  }

  const container = document.getElementById("obs_container");
  container.innerHTML = ""; // clear existing

  // Group definitions by id range
  const sections = [
    { title: "DURING CTO",   ids: [1, 6] },
    { title: "ON RUN",       ids: [7, 20] },
    { title: "AT HALTS",     ids: [21, 30] },
    { title: "AT CHO",       ids: [31, 34] },
  ];

  sections.forEach(sec => {
    const secDiv = document.createElement("div");
    secDiv.className = "obs-section";

    // SECTION TITLE
    const h = document.createElement("h4");
    h.textContent = sec.title;
    secDiv.appendChild(h);

    // 2 column layout container
    const row = document.createElement("div");
    row.className = "obs-row";

    const lpCol = document.createElement("div");
    const alpCol = document.createElement("div");
    lpCol.className = "obs-col lp-col";
    alpCol.className = "obs-col alp-col";

    // Add column headers (HEADER = A)
    const lpHead = document.createElement("div");
    lpHead.className = "col-head";
    lpHead.textContent = "LP OBSERVATIONS";

    const alpHead = document.createElement("div");
    alpHead.className = "col-head";
    alpHead.textContent = "ALP OBSERVATIONS";

    lpCol.appendChild(lpHead);
    alpCol.appendChild(alpHead);

    // Filter observations for this section
    const secObs = window.OBS_MASTER.filter(o => o.id >= sec.ids[0] && o.id <= sec.ids[1]);

    secObs.forEach(obs => {
      const block = document.createElement("div");
      block.className = "obs-item";

      // Title
      const t = document.createElement("div");
      t.className = "obs-title";
      t.textContent = obs.title;
      block.appendChild(t);

      // Dropdown
      const sel = document.createElement("select");
      sel.className = "obs-select";

      if (obs.type === "YESNO") {
        ["YES","NO"].forEach(v => sel.appendChild(new Option(v, v)));
      } else if (obs.type === "YESNO_DAY") {
        ["YES","NO","DAY TIME"].forEach(v => sel.appendChild(new Option(v, v)));
      } else if (obs.type === "RATING") {
        ["VERY GOOD","FAIR","POOR"].forEach(v => sel.appendChild(new Option(v, v)));
      }

      // Default value
      sel.value = obs.default;
      block.appendChild(sel);

      // Photo upload icon
      const up = document.createElement("input");
      up.type = "file";
      up.accept = "image/*";
      up.className = "photo-input";
      block.appendChild(up);

      // Append to correct role column
      if (obs.role === "LP") lpCol.appendChild(block);
      else alpCol.appendChild(block);
    });

    // add both columns to row
    row.appendChild(lpCol);
    row.appendChild(alpCol);

    // add section to container
    secDiv.appendChild(row);
    container.appendChild(secDiv);
  });
}
