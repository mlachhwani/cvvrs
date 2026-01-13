/**************************************************************
 * obs_photo.js — Photo Handling Module (Delivery-22)
 * CVVRS — ML/01 LOCKED
 **************************************************************/
console.log("obs_photo.js loaded");

/* ===================================================================
 * BASE64 CONVERTER
 * =================================================================== */
async function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

/* ===================================================================
 * COLLECT PHOTOS FROM DOM
 * Called from submit.js → buildPayload()
 * =================================================================== */
async function collectObservationPhotos(obsList) {
  const out = [];

  for (const obs of obsList) {
    const photoInput = document.getElementById("obs_photo_" + obs.id);
    let b64 = null;

    if (photoInput && photoInput.files && photoInput.files.length > 0) {
      b64 = await fileToBase64(photoInput.files[0]);
    }

    out.push({ id: obs.id, base64: b64 });
  }

  return out;
}

/* ===================================================================
 * PHOTO MANDATORY CHECK
 * RULE:
 *  - If observation.type === "FLAG" AND value != default  → photo required
 *  - Default values are considered "normal" → photo NOT required
 * =================================================================== */
function checkPhotoMandatories(obsList) {
  const msg = [];

  for (const obs of obsList) {
    if (obs.type !== "FLAG") continue;

    const dropdown = document.getElementById("obs_select_" + obs.id);
    if (!dropdown) continue;

    const val = dropdown.value;
    const def = obs.default || "";

    if (val !== def) {
      const pic = document.getElementById("obs_photo_" + obs.id);
      const hasPic = pic && pic.files && pic.files.length > 0;
      if (!hasPic) {
        msg.push(`Photo required for '${obs.title}' (${obs.role})`);
      }
    }
  }

  return { ok: msg.length === 0, msg };
}

/* ===================================================================
 * LINK TO submit.js — inject photos into payload
 * This function is called inside buildPayload()
 * =================================================================== */
async function attachPhotosToPayload(payload) {
  const photos = await collectObservationPhotos(payload.observations);

  payload.observations = payload.observations.map(o => {
    const p = photos.find(x => x.id === o.id);
    return {
      ...o,
      photo: p ? p.base64 : null
    };
  });

  return payload;
}

/**************************************************************
 * END FILE
 **************************************************************/
