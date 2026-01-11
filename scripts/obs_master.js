/* ============================================================================
   OBS_MASTER.js — FINAL LOCKED OBSERVATION MASTER (LP + ALP)
   ML/PHASE2/STEP10 — DO NOT MODIFY WITHOUT VERSION BUMP
   ============================================================================ */

window.OBS_MASTER = [

  /* ================= SECTION: DURING CTO ================= */
  { id:1,  section:"CTO",   role:"LP",  title:"Checking Logbook & BPC",                           type:"YESNO",     default:"YES" },
  { id:2,  section:"CTO",   role:"LP",  title:"Checking Safety Items & HTC",                      type:"YESNO",     default:"YES" },
  { id:3,  section:"CTO",   role:"LP",  title:"Energy Meter & SPM Check",                         type:"YESNO",     default:"YES" },

  { id:4,  section:"CTO",   role:"ALP", title:"Checking RS Valve working",                        type:"YESNO",     default:"YES" },
  { id:5,  section:"CTO",   role:"ALP", title:"Checking Safety Items & HTC",                      type:"YESNO",     default:"YES" },
  { id:6,  section:"CTO",   role:"ALP", title:"Energy Meter & SPM check & Input",                 type:"YESNO",     default:"YES" },

  /* ================= SECTION: ON RUN ===================== */
  { id:7,  section:"ONRUN", role:"LP",  title:"Conducting BFT & BPT",                              type:"YESNO",     default:"YES" },
  { id:8,  section:"ONRUN", role:"LP",  title:"Calling Out Signals with Hand Gesture",             type:"YESNO",     default:"YES" },
  { id:9,  section:"ONRUN", role:"LP",  title:"Use of Mobile Phone",                               type:"YESNO",     default:"NO"  },
  { id:10, section:"ONRUN", role:"LP",  title:"Micro Sleep",                                       type:"YESNO",     default:"NO"  },
  { id:11, section:"ONRUN", role:"LP",  title:"Exchange of Signals",                               type:"YESNO",     default:"YES" },
  { id:12, section:"ONRUN", role:"LP",  title:"Proper action during Neutral Section",              type:"YESNO",     default:"YES" },
  { id:13, section:"ONRUN", role:"LP",  title:"Alertness",                                         type:"RATING",    default:"VERY GOOD" },

  { id:14, section:"ONRUN", role:"ALP", title:"Standing & Holding RS while approaching Danger Signal",  type:"YESNO",  default:"YES" },
  { id:15, section:"ONRUN", role:"ALP", title:"Calling Out Signals with Hand Gesture",             type:"YESNO",     default:"YES" },
  { id:16, section:"ONRUN", role:"ALP", title:"Use of Mobile Phone",                               type:"YESNO",     default:"NO"  },
  { id:17, section:"ONRUN", role:"ALP", title:"Micro Sleep",                                       type:"YESNO",     default:"NO"  },
  { id:18, section:"ONRUN", role:"ALP", title:"Exchange of Signals",                               type:"YESNO",     default:"YES" },
  { id:19, section:"ONRUN", role:"ALP", title:"Checking Formation in curve & Caution Spot",        type:"YESNO",     default:"YES" },
  { id:20, section:"ONRUN", role:"ALP", title:"Alertness",                                         type:"RATING",    default:"VERY GOOD" },

  /* ================= SECTION: AT HALTS =================== */
  { id:21, section:"HALTS", role:"LP",  title:"Application of A9 & SA9",                           type:"YESNO",     default:"YES" },
  { id:22, section:"HALTS", role:"LP",  title:"Reverser in Neutral",                               type:"YESNO",     default:"YES" },
  { id:23, section:"HALTS", role:"LP",  title:"Dimming of Headlight",                              type:"YESNO_DAY", default:"YES" },
  { id:24, section:"HALTS", role:"LP",  title:"Checking of Undergear & Machine Room",              type:"YESNO",     default:"YES" },
  { id:25, section:"HALTS", role:"LP",  title:"Proper whistle before start",                       type:"YESNO",     default:"YES" },

  { id:26, section:"HALTS", role:"ALP", title:"Ensure Application of A9 & SA9",                    type:"YESNO",     default:"YES" },
  { id:27, section:"HALTS", role:"ALP", title:"Ensure Reverser in Neutral",                        type:"YESNO",     default:"YES" },
  { id:28, section:"HALTS", role:"ALP", title:"Ensure Dimming of Headlight",                       type:"YESNO_DAY", default:"YES" },
  { id:29, section:"HALTS", role:"ALP", title:"Checking of Undergear & Machine Room",              type:"YESNO",     default:"YES" },
  { id:30, section:"HALTS", role:"ALP", title:"Proper Signal Exchange Before start",               type:"YESNO",     default:"YES" },

  /* ================= SECTION: AT CHO ===================== */
  { id:31, section:"CHO",   role:"LP",  title:"Packing of Personal belongings after arrival",      type:"YESNO",     default:"YES" },
  { id:32, section:"CHO",   role:"LP",  title:"Over-all Performance",                              type:"RATING",    default:"VERY GOOD" },

  { id:33, section:"CHO",   role:"ALP", title:"Packing of Personal belongings after arrival",      type:"YESNO",     default:"YES" },
  { id:34, section:"CHO",   role:"ALP", title:"Over-all Performance",                              type:"RATING",    default:"VERY GOOD" }

];

/* ================= END OF FILE ========================== */
