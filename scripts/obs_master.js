/* ============================================================================
   obs_master.js — OBSERVATION MASTER DEFINITIONS
   MODE: ML/01 — FULL FILE DELIVERY
   SECTION SPLIT + LP/ALP + DEFAULT LOGIC
   ============================================================================ */

/*
 SECTIONS:
 1 = DURING CTO
 2 = ON RUN
 3 = AT HALTS
 4 = AT CHO

 FIELD TYPES:
 - YES_NO
 - YES_NO_DAY
 - RATING (VERY GOOD / FAIR / POOR)

 DEFAULT LOGIC:
 - YES_NO:      default = one string
 - YES_NO_DAY:  default = array ["YES","DAY TIME"]
 - RATING:      default = "VERY GOOD"

 PHOTO RULES:
 - YES_NO:      photo if value != default
 - YES_NO_DAY:  photo if value == "NO"
 - RATING:      photo if value != "VERY GOOD"

 ABNORMALITIES:
 - If rating != VERY GOOD → abnormalities required
*/

window.OBS_MASTER = [

  /* ============================================================
     SECTION 1: DURING CTO
     ============================================================ */
  {id:  1, section:1, role:"LP",  title:"Checking Logbook & BPC",                type:"YES_NO",      default:"YES"},
  {id:  2, section:1, role:"LP",  title:"Checking Safety Items & HTC",          type:"YES_NO",      default:"YES"},
  {id:  3, section:1, role:"LP",  title:"Energy Meter & SPM check",             type:"YES_NO",      default:"YES"},

  {id:  4, section:1, role:"ALP", title:"Checking RS Valve working",            type:"YES_NO",      default:"YES"},
  {id:  5, section:1, role:"ALP", title:"Checking Safety Items & HTC",          type:"YES_NO",      default:"YES"},
  {id:  6, section:1, role:"ALP", title:"Energy Meter & SPM check & Input",     type:"YES_NO",      default:"YES"},

  /* ============================================================
     SECTION 2: ON RUN
     ============================================================ */
  {id:  7, section:2, role:"LP",  title:"Conducting BFT & BPT",                 type:"YES_NO",      default:"YES"},
  {id:  8, section:2, role:"LP",  title:"Calling Out Signals with Hand Gesture",type:"YES_NO",      default:"YES"},
  {id:  9, section:2, role:"LP",  title:"Use of Mobile Phone",                  type:"YES_NO",      default:"NO"},     // MOBILE_DEFAULT = NO
  {id: 10, section:2, role:"LP",  title:"Micro Sleep",                          type:"YES_NO",      default:"NO"},
  {id: 11, section:2, role:"LP",  title:"Exchange of Signals",                  type:"YES_NO",      default:"YES"},
  {id: 12, section:2, role:"LP",  title:"Proper action during Neutral Section", type:"YES_NO",      default:"YES"},
  {id: 13, section:2, role:"LP",  title:"Alertness",                            type:"RATING",      default:"VERY GOOD", ratingScale:["VERY GOOD","FAIR","POOR"]},

  {id: 14, section:2, role:"ALP", title:"Standing & Holding RS near Danger Signal", type:"YES_NO", default:"YES"},
  {id: 15, section:2, role:"ALP", title:"Calling Out Signals with Hand Gesture", type:"YES_NO",     default:"YES"},
  {id: 16, section:2, role:"ALP", title:"Use of Mobile Phone",                  type:"YES_NO",      default:"NO"},
  {id: 17, section:2, role:"ALP", title:"Micro Sleep",                          type:"YES_NO",      default:"NO"},
  {id: 18, section:2, role:"ALP", title:"Exchange of Signals",                  type:"YES_NO",      default:"YES"},
  {id: 19, section:2, role:"ALP", title:"Checking Formation in curve & Caution Spot", type:"YES_NO",default:"YES"},
  {id: 20, section:2, role:"ALP", title:"Alertness",                            type:"RATING",      default:"VERY GOOD", ratingScale:["VERY GOOD","FAIR","POOR"]},

  /* ============================================================
     SECTION 3: AT HALTS
     ============================================================ */
  {id: 21, section:3, role:"LP",  title:"Application of A9 & SA9",              type:"YES_NO",      default:"YES"},
  {id: 22, section:3, role:"LP",  title:"Reverser in Neutral",                 type:"YES_NO",      default:"YES"},
  {id: 23, section:3, role:"LP",  title:"Dimming of Headlight",                type:"YES_NO_DAY",  default:["YES","DAY TIME"]}, // Multi-default
  {id: 24, section:3, role:"LP",  title:"Checking of Undergear & Machine Room",type:"YES_NO",      default:"YES"},
  {id: 25, section:3, role:"LP",  title:"Proper whistle before start",         type:"YES_NO",      default:"YES"},

  {id: 26, section:3, role:"ALP", title:"Ensure Application of A9 & SA9",      type:"YES_NO",      default:"YES"},
  {id: 27, section:3, role:"ALP", title:"Ensure Reverser in Neutral",          type:"YES_NO",      default:"YES"},
  {id: 28, section:3, role:"ALP", title:"Ensure Dimming of Headlight",         type:"YES_NO_DAY",  default:["YES","DAY TIME"]}, // Multi-default
  {id: 29, section:3, role:"ALP", title:"Checking of Undergear & Machine Room",type:"YES_NO",      default:"YES"},
  {id: 30, section:3, role:"ALP", title:"Proper Signal Exchange Before start", type:"YES_NO",      default:"YES"},

  /* ============================================================
     SECTION 4: AT CHO
     ============================================================ */
  {id: 31, section:4, role:"LP",  title:"Packing of Personal belongings after arrival", type:"YES_NO", default:"YES"},
  {id: 32, section:4, role:"LP",  title:"Over-all Performance",                      type:"RATING",  default:"VERY GOOD", ratingScale:["VERY GOOD","FAIR","POOR"]},

  {id: 33, section:4, role:"ALP", title:"Packing of Personal belongings after arrival", type:"YES_NO", default:"YES"},
  {id: 34, section:4, role:"ALP", title:"Over-all Performance",                      type:"RATING",  default:"VERY GOOD", ratingScale:["VERY GOOD","FAIR","POOR"]}

];

/* Export for UI */
window.OBS_SECTIONS = {
  "1":"DURING CTO",
  "2":"ON RUN",
  "3":"AT HALTS",
  "4":"AT CHO"
};
