/* ============================================================
   OBSERVATION MASTER (LP + ALP) — FINAL LOCKED FOR YOUR ACCOUNT
   ============================================================ */

window.OBS_MASTER = [

  /* ===== DURING CTO ===== */
  {id:1,  sec:"CTO", title:"Checking Logbook & BPC", role:"LP",  default:"YES",        type:"YESNO"},
  {id:2,  sec:"CTO", title:"Checking Safety Items & HTC", role:"LP", default:"YES",    type:"YESNO"},
  {id:3,  sec:"CTO", title:"Energy Meter & SPM check", role:"LP", default:"YES",       type:"YESNO"},
  {id:4,  sec:"CTO", title:"Checking RS Valve working", role:"ALP", default:"YES",     type:"YESNO"},
  {id:5,  sec:"CTO", title:"Checking Safety Items & HTC", role:"ALP", default:"YES",   type:"YESNO"},
  {id:6,  sec:"CTO", title:"Energy Meter & SPM check & Input", role:"ALP", default:"YES", type:"YESNO"},

  /* ===== ON RUN ===== */
  {id:7,  sec:"RUN", title:"Conducting BFT & BPT", role:"LP", default:"YES",           type:"YESNO"},
  {id:8,  sec:"RUN", title:"Calling Out Signals with Hand Gesture", role:"LP", default:"YES", type:"YESNO"},
  {id:9,  sec:"RUN", title:"Use of Mobile Phone", role:"LP", default:"NO",            type:"YESNO"},
  {id:10, sec:"RUN", title:"Micro Sleep", role:"LP", default:"NO",                    type:"YESNO"},
  {id:11, sec:"RUN", title:"Exchange of Signals", role:"LP", default:"YES",           type:"YESNO"},
  {id:12, sec:"RUN", title:"Proper action during Neutral Section", role:"LP", default:"YES", type:"YESNO"},
  {id:13, sec:"RUN", title:"Alertness", role:"LP", default:"VERY GOOD",               type:"RATING", abnormalitiesNeeded:true},

  {id:14, sec:"RUN", title:"Standing & Holding RS near Danger Signal", role:"ALP", default:"YES", type:"YESNO"},
  {id:15, sec:"RUN", title:"Calling Out Signals with Hand Gesture", role:"ALP", default:"YES", type:"YESNO"},
  {id:16, sec:"RUN", title:"Use of Mobile Phone", role:"ALP", default:"NO",          type:"YESNO"},
  {id:17, sec:"RUN", title:"Micro Sleep", role:"ALP", default:"NO",                  type:"YESNO"},
  {id:18, sec:"RUN", title:"Exchange of Signals", role:"ALP", default:"YES",         type:"YESNO"},
  {id:19, sec:"RUN", title:"Checking Formation in curve & Caution Spot", role:"ALP", default:"YES", type:"YESNO"},
  {id:20, sec:"RUN", title:"Alertness", role:"ALP", default:"VERY GOOD",             type:"RATING", abnormalitiesNeeded:true},

  /* ===== AT HALTS ===== */
  {id:21, sec:"HALT", title:"Application of A9 & SA9", role:"LP", default:"YES",      type:"YESNO"},
  {id:22, sec:"HALT", title:"Reverser in Neutral", role:"LP", default:"YES",         type:"YESNO"},
  {id:23, sec:"HALT", title:"Dimming of Headlight", role:"LP", default:"YES",        type:"YESNO_DAY"},
  {id:24, sec:"HALT", title:"Checking of Undergear & Machine Room", role:"LP", default:"YES", type:"YESNO"},
  {id:25, sec:"HALT", title:"Proper whistle before start", role:"LP", default:"YES", type:"YESNO"},

  {id:26, sec:"HALT", title:"Ensure Application of A9 & SA9", role:"ALP", default:"YES", type:"YESNO"},
  {id:27, sec:"HALT", title:"Ensure Reverser in Neutral", role:"ALP", default:"YES", type:"YESNO"},
  {id:28, sec:"HALT", title:"Ensure Dimming of Headlight", role:"ALP", default:"YES", type:"YESNO_DAY"},
  {id:29, sec:"HALT", title:"Checking of Undergear & Machine Room", role:"ALP", default:"YES", type:"YESNO"},
  {id:30, sec:"HALT", title:"Proper Signal Exchange Before start", role:"ALP", default:"YES", type:"YESNO"},

  /* ===== AT CHO ===== */
  {id:31, sec:"CHO", title:"Packing of Personal belongings after arrival", role:"LP", default:"YES", type:"YESNO"},
  {id:32, sec:"CHO", title:"Over all Performance", role:"LP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},
  {id:33, sec:"CHO", title:"Packing of Personal belongings after arrival", role:"ALP", default:"YES", type:"YESNO"},
  {id:34, sec:"CHO", title:"Over all Performance", role:"ALP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},
];

/* LOCKED OPTIONS */
window.OBS_OPTIONS = {
  YESNO:  ["YES","NO"],
  YESNO_DAY: ["YES","NO","DAY TIME"],
  RATING: ["VERY GOOD","FAIR","POOR"]
};
