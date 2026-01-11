/* =============================================================================
   OBSERVATION UI RENDERING ENGINE (LP LEFT + ALP RIGHT)
   CONFIG LOCKED FOR MLACHHWANI / CVVRS  | ML/01 FULL FILE MODE
   =============================================================================

   UI RULES:
   - Title: Bold + 13px
   - Dropdown Width: 120px
   - Default Border: Grey
   - Changed Border: Red
   - Abnormalities Field: Always visible (disabled if not needed)
   - Photo Button: Round Grey (PIC2)
   - Photo Status: filename + ✔ tick
   - Layout: INLINE ROW → [TITLE] [DROPDOWN] [PHOTO BUTTON] [ABN FIELD]
   - LP on Left, ALP on Right auto-column split
   - YES/NO defaults: photo required only if dropdown != default
   - YES/NO/DAY: photo required only if value == "NO"
   - RATING: photo & abnormalities required if != VERY GOOD

============================================================================= */

/* DOM refs */
const OBS_CONTAINER = document.getElementById("obs_container");

/* Rating options */
const RATING_OPTS = ["VERY GOOD", "FAIR", "POOR"];

/* Yes/No options */
const YESNO_OPTS = ["YES", "NO"];

/* Yes/No/Day options */
const YESNO_DAY_OPTS = ["YES", "NO", "DAY TIME"];

/* =============================================================================
   CREATE ONE OBSERVATION ROW
============================================================================= */
function createObsRow(obs) {
  const row = document.createElement("div");
  row.className = "obs-row";
  row.dataset.id = obs.id;

  /* ---- LEFT PART: TITLE ---- */
  const title = document.createElement("div");
  title.className = "obs-title";
  title.textContent = `${obs.id}. ${obs.title}`;
  row.appendChild(title);

  /* ---- DROPDOWN ---- */
  const sel = document.createElement("select");
  sel.className = "obs-select";
  sel.dataset.id = obs.id;
  sel.dataset.default = obs.default;

  sel.style.width = "120px";
  sel.style.border = "1px solid #aaa"; // default grey

  /* Populate options */
  if (obs.type === "RATING") {
    RATING_OPTS.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  } else if (obs.type === "YESNO") {
    YESNO_OPTS.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  } else if (obs.type === "YESNO_DAY") {
    YESNO_DAY_OPTS.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  }

  sel.value = obs.default;
  row.appendChild(sel);

  /* ---- PHOTO BUTTON ---- */
  const photoWrap = document.createElement("div");
  photoWrap.className = "obs-photo-wrap";

  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.accept = "image/*";
  photoInput.className = "obs-photo";
  photoInput.dataset.id = obs.id;
  photoInput.style.display = "none";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "photo-btn";
  btn.innerHTML = "📷";
  btn.dataset.id = obs.id;

  /* click → open file dialog */
  btn.onclick = () => photoInput.click();

  /* filename + tick container */
  const status = document.createElement("span");
  status.className = "photo-status";
  status.dataset.id = obs.id;
  status.style.fontSize = "10px";
  status.style.marginLeft = "4px";

  photoInput.onchange = () => {
    if (photoInput.files.length > 0) {
      status.innerHTML = `${photoInput.files[0].name} <span style="color:green;font-weight:bold;">✔</span>`;
    } else {
      status.innerHTML = "";
    }
  };

  photoWrap.appendChild(btn);
  photoWrap.appendChild(photoInput);
  photoWrap.appendChild(status);
  row.appendChild(photoWrap);

  /* ---- ABNORMALITIES FIELD (always visible) ---- */
  const abn = document.createElement("input");
  abn.type = "text";
  abn.placeholder = "Abn...";
  abn.className = "obs-abn";
  abn.dataset.id = obs.id;
  abn.style.width = "120px";
  abn.style.fontSize = "11px";
  abn.style.padding = "3px";

  row.appendChild(abn);

  /* ---- DROPDOWN LOGIC ---- */
  function applyUIRules() {
    const val = sel.value;
    const def = obs.default;

    /* border color */
    if (val === def) {
      sel.style.border = "1px solid #aaa"; // grey
    } else {
      sel.style.border = "1px solid red";
    }

    /* abnormalities enable/disable */
    if (obs.type === "RATING") {
      if (val === "VERY GOOD") {
        abn.value = "";
        abn.disabled = true;
      } else {
        abn.disabled = false;
      }
    } else {
      /* normal yes/no → abnormalities optional */
      abn.disabled = false;
    }
  }

  sel.onchange = applyUIRules;
  applyUIRules();

  return row;
}

/* =============================================================================
   RENDER ALL OBSERVATIONS (LP LEFT + ALP RIGHT)
============================================================================= */
function renderObservationsUI() {
  OBS_CONTAINER.innerHTML = "";

  const lpCol = document.createElement("div");
  lpCol.className = "obs-col";

  const alpCol = document.createElement("div");
  alpCol.className = "obs-col";

  /* LP first then ALP */
  OBS_MASTER.forEach(obs => {
    const row = createObsRow(obs);
    if (obs.role === "LP") {
      lpCol.appendChild(row);
    } else {
      alpCol.appendChild(row);
    }
  });

  const wrap = document.createElement("div");
  wrap.className = "obs-wrap";
  wrap.appendChild(lpCol);
  wrap.appendChild(alpCol);

  OBS_CONTAINER.appendChild(wrap);
}

/* =============================================================================
   SUPPORT FUNCTIONS FOR OTHER MODULES
============================================================================= */

/* Collect observations w/ value, photo, abn */
function getObservationData() {
  const arr = [];

  OBS_MASTER.forEach(obs => {
    const sel = document.querySelector(`.obs-select[data-id="${obs.id}"]`);
    const photo = document.querySelector(`.obs-photo[data-id="${obs.id}"]`);
    const abn = document.querySelector(`.obs-abn[data-id="${obs.id}"]`);

    arr.push({
      id: obs.id,
      title: obs.title,
      role: obs.role,
      type: obs.type,
      default: obs.default,
      value: sel?.value || "",
      abnormalities: abn?.value.trim() || "",
      photoFile: (photo && photo.files.length > 0) ? photo.files[0] : null
    });
  });

  return arr;
}

/* To be used by validation engine */
window.OBS_UI = {
  render: renderObservationsUI,
  getData: getObservationData
};

/* Auto render on load */
document.addEventListener("DOMContentLoaded", renderObservationsUI);
