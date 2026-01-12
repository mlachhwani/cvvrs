/* ===============================================
   OBSERVATION UI (Minimal Functional Rendering)
   No styling, no layout — pure logic only
   =============================================== */

window.OBS_UI = {

  render() {
    const box = document.getElementById("obs_container");
    box.innerHTML = "";

    window.OBS_MASTER.forEach(o => {
      const row = document.createElement("div");
      row.className = "obs-row";

      // Label
      const lbl = document.createElement("label");
      lbl.textContent = `${o.id}. ${o.title} (${o.role})`;

      // Select
      const sel = document.createElement("select");
      sel.id = "obs_" + o.id;
      sel.dataset.default = o.default;

      if (o.type === "YESNO") {
        ["YES","NO"].forEach(v => {
          const opt = document.createElement("option");
          opt.value = v; opt.textContent = v;
          sel.appendChild(opt);
        });
      }

      if (o.type === "YESNO_DAY") {
        ["YES","NO","DAY TIME"].forEach(v => {
          const opt = document.createElement("option");
          opt.value = v; opt.textContent = v;
          sel.appendChild(opt);
        });
      }

      if (o.type === "RATING") {
        ["VERY GOOD","FAIR","POOR"].forEach(v => {
          const opt = document.createElement("option");
          opt.value = v; opt.textContent = v;
          sel.appendChild(opt);
        });
      }

      sel.value = o.default;

      row.appendChild(lbl);
      row.appendChild(sel);
      box.appendChild(row);
    });
  }
};
