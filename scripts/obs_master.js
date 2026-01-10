/* ============================================================
   OBSERVATION MASTER DATA (36 FIELDS)
   ============================================================ */

window.OBS_MASTER = [

  // ===== DURING CTO =====
  {id:1,  title:"CHECKING LOGBOOK & BPC", role:"LP",  default:"YES", type:"YESNO"},
  {id:2,  title:"CHECKING SAFETY ITEMS & HTC", role:"LP", default:"YES", type:"YESNO"},
  {id:3,  title:"ENERGY METER & SPM CHECK", role:"LP", default:"YES", type:"YESNO"},
  {id:4,  title:"CHECKING RS VALVE WORKING", role:"ALP", default:"YES", type:"YESNO"},
  {id:5,  title:"CHECKING SAFETY ITEMS & HTC", role:"ALP", default:"YES", type:"YESNO"},
  {id:6,  title:"ENERGY METER & SPM CHECK & INPUT", role:"ALP", default:"YES", type:"YESNO"},

  // ===== ON RUN =====
  {id:7,  title:"CONDUCTING BFT & BPT", role:"LP", default:"YES", type:"YESNO"},
  {id:8,  title:"CALLING OUT SIGNALS WITH HAND GESTURE", role:"LP", default:"YES", type:"YESNO"},
  {id:9,  title:"USE OF MOBILE PHONE", role:"LP", default:"NO", type:"YESNO"},
  {id:10, title:"MICRO SLEEP", role:"LP", default:"NO", type:"YESNO"},
  {id:11, title:"EXCHANGE OF SIGNALS", role:"LP", default:"YES", type:"YESNO"},
  {id:12, title:"PROPER ACTION DURING NEUTRAL SECTION", role:"LP", default:"YES", type:"YESNO"},
  {id:13, title:"ALERTNESS", role:"LP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

  {id:14, title:"STANDING & HOLDING RS NEAR DANGER SIGNAL", role:"ALP", default:"YES", type:"YESNO"},
  {id:15, title:"CALLING OUT SIGNALS WITH HAND GESTURE", role:"ALP", default:"YES", type:"YESNO"},
  {id:16, title:"USE OF MOBILE PHONE", role:"ALP", default:"NO", type:"YESNO"},
  {id:17, title:"MICRO SLEEP", role:"ALP", default:"NO", type:"YESNO"},
  {id:18, title:"EXCHANGE OF SIGNALS", role:"ALP", default:"YES", type:"YESNO"},
  {id:19, title:"CHECKING FORMATION IN CURVE & CAUTION SPOT", role:"ALP", default:"YES", type:"YESNO"},
  {id:20, title:"ALERTNESS", role:"ALP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

  // ===== AT HALTS =====
  {id:21, title:"APPLICATION OF A9 & SA9", role:"LP", default:"YES", type:"YESNO"},
  {id:22, title:"REVERSER IN NEUTRAL", role:"LP", default:"YES", type:"YESNO"},
  {id:23, title:"DIMMING OF HEADLIGHT", role:"LP", default:"YES", type:"YESNO_DAY"},
  {id:24, title:"CHECKING OF UNDERGEAR & MACHINE ROOM", role:"LP", default:"YES", type:"YESNO"},
  {id:25, title:"PROPER WHISTLE BEFORE START", role:"LP", default:"YES", type:"YESNO"},

  {id:26, title:"ENSURE APPLICATION OF A9 & SA9", role:"ALP", default:"YES", type:"YESNO"},
  {id:27, title:"ENSURE REVERSER IN NEUTRAL", role:"ALP", default:"YES", type:"YESNO"},
  {id:28, title:"ENSURE DIMMING OF HEADLIGHT", role:"ALP", default:"YES", type:"YESNO_DAY"},
  {id:29, title:"CHECKING OF UNDERGEAR & MACHINE ROOM", role:"ALP", default:"YES", type:"YESNO"},
  {id:30, title:"PROPER SIGNAL EXCHANGE BEFORE START", role:"ALP", default:"YES", type:"YESNO"},

  // ===== AT CHO =====
  {id:31, title:"PACKING OF PERSONAL BELONGINGS AFTER ARRIVAL", role:"LP", default:"YES", type:"YESNO"},
  {id:32, title:"OVER ALL PERFORMANCE", role:"LP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},
  {id:33, title:"PACKING OF PERSONAL BELONGINGS AFTER ARRIVAL", role:"ALP", default:"YES", type:"YESNO"},
  {id:34, title:"OVER ALL PERFORMANCE", role:"ALP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

];
