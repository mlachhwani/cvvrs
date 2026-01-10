/* ============================================================
   OBSERVATION UI RENDER ENGINE
   Requires: OBS_MASTER (from obs_master.js)
   ============================================================ */

function renderObservationsUI() {
  const container = document.getElementById("obs_container");
  container.innerHTML = ""; // clean

  OBS_MASTER.forEach(obs => {
    const row = document.createElement("div");
    row.className = "obs-row";
    row.dataset.obsId = obs.id;

    // ROLE badge color
    const roleColor = obs.role === "LP" ? "blue" : "green";

    // LABEL SECTION
    const titleDiv = document.createElement("div");
    titleDiv.innerHTML = `
      <span class="obs-title">${obs.id}. ${obs.title}</span>
      <span class="obs-role" style="background:${roleColor}">${obs.role}</span>
    `;
    row.appendChild(titleDiv);

    // DROPDOWN
    const select = document.createElement("select");
    select.className = "obs-select";
    select.dataset.default = obs.default;
    select.dataset.type = obs.type;
    select.dataset.id = obs.id;

    // FILL OPTIONS
    if (obs.type === "YESNO") {
      ["YES","NO"].forEach(o=>{
        const opt = document.createElement("option");
        opt.value = o; opt.textContent = o;
        select.appendChild(opt);
      });
    }
    if (obs.type === "YESNO_DAY") {
      ["YES","NO","DAY TIME"].forEach(o=>{
        const opt = document.createElement("option");
        opt.value = o; opt.textContent = o;
        select.appendChild(opt);
      });
    }
    if (obs.type === "RATING") {
      ["VERY GOOD","FAIR","POOR"].forEach(o=>{
        const opt = document.createElement("option");
        opt.value = o; opt.textContent = o;
        select.appendChild(opt);
      });
    }

    // SET DEFAULT
    select.value = obs.default;

    // PHOTO INPUT
    const photoInput = document.createElement("input");
    photoInput.type = "file";
    photoInput.accept = "image/*";
    photoInput.className = "obs-photo";
    photoInput.dataset.id = obs.id;

    // ABNORMALITIES TEXTBOX (hidden by default)
    const abnInput = document.createElement("input");
    abnInput.type = "text";
    abnInput.placeholder = "Enter abnormalities...";
    abnInput.className = "obs-abn";
    abnInput.style.display = "none";
    abnInput.dataset.id = obs.id;

    // ON CHANGE LOGIC
    select.addEventListener("change", () => {
      const def = select.dataset.default;
      const val = select.value;

      // PHOTO MANDATORY CHECK
      if (val !== def) {
        photoInput.classList.add("mandatory");
      } else {
        photoInput.classList.remove("mandatory");
      }

      // RATING Logics
      if (obs.type === "RATING") {
        if (val !== "VERY GOOD") {
          abnInput.style.display = "block";
        } else {
          abnInput.style.display = "none";
          abnInput.value = "";
        }
      }
    });

    // APPEND UI ELEMENTS
    row.appendChild(select);
    row.appendChild(photoInput);
    row.appendChild(abnInput);

    container.appendChild(row);
  });
}

/* ============================================================
   AUTO INIT WHEN PAGE LOADS
   ============================================================ */
window.addEventListener("load", () => {
  renderObservationsUI();
});
