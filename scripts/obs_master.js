/* ============================================================
   OBSERVATION MASTER DATA (36 FIELDS)
   ============================================================ */

window.OBS_MASTER = [

  // ===== DURING CTO =====
  {id:1,  title:"Checking Logbook & BPC", role:"LP",  default:"YES", type:"YESNO"},
  {id:2,  title:"Checking Safety Items & HTC", role:"LP", default:"YES", type:"YESNO"},
  {id:3,  title:"Energy Meter & SPM check", role:"LP", default:"YES", type:"YESNO"},
  {id:4,  title:"Checking RS Valve working", role:"ALP", default:"YES", type:"YESNO"},
  {id:5,  title:"Checking Safety Items & HTC", role:"ALP", default:"YES", type:"YESNO"},
  {id:6,  title:"Energy Meter & SPM check & Input", role:"ALP", default:"YES", type:"YESNO"},

  // ===== ON RUN =====
  {id:7,  title:"Conducting BFT & BPT", role:"LP", default:"YES", type:"YESNO"},
  {id:8,  title:"Calling Out Signals with Hand Gesture", role:"LP", default:"YES", type:"YESNO"},
  {id:9,  title:"Use of Mobile Phone", role:"LP", default:"NO", type:"YESNO"},
  {id:10, title:"Micro Sleep", role:"LP", default:"NO", type:"YESNO"},
  {id:11, title:"Exchange of Signals", role:"LP", default:"YES", type:"YESNO"},
  {id:12, title:"Proper action during Neutral Section", role:"LP", default:"YES", type:"YESNO"},
  {id:13, title:"Alertness", role:"LP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

  {id:14, title:"Standing & Holding RS near Danger Signal", role:"ALP", default:"YES", type:"YESNO"},
  {id:15, title:"Calling Out Signals with Hand Gesture", role:"ALP", default:"YES", type:"YESNO"},
  {id:16, title:"Use of Mobile Phone", role:"ALP", default:"NO", type:"YESNO"},
  {id:17, title:"Micro Sleep", role:"ALP", default:"NO", type:"YESNO"},
  {id:18, title:"Exchange of Signals", role:"ALP", default:"YES", type:"YESNO"},
  {id:19, title:"Checking Formation in curve & Caution Spot", role:"ALP", default:"YES", type:"YESNO"},
  {id:20, title:"Alertness", role:"ALP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

  // ===== AT HALTS =====
  {id:21, title:"Application of A9 & SA9", role:"LP", default:"YES", type:"YESNO"},
  {id:22, title:"Reverser in Neutral", role:"LP", default:"YES", type:"YESNO"},
  {id:23, title:"Dimming of Headlight", role:"LP", default:"YES", type:"YESNO_DAY"},
  {id:24, title:"Checking of Undergear & Machine Room", role:"LP", default:"YES", type:"YESNO"},
  {id:25, title:"Proper whistle before start", role:"LP", default:"YES", type:"YESNO"},

  {id:26, title:"Ensure Application of A9 & SA9", role:"ALP", default:"YES", type:"YESNO"},
  {id:27, title:"Ensure Reverser in Neutral", role:"ALP", default:"YES", type:"YESNO"},
  {id:28, title:"Ensure Dimming of Headlight", role:"ALP", default:"YES", type:"YESNO_DAY"},
  {id:29, title:"Checking of Undergear & Machine Room", role:"ALP", default:"YES", type:"YESNO"},
  {id:30, title:"Proper Signal Exchange Before start", role:"ALP", default:"YES", type:"YESNO"},

  // ===== AT CHO =====
  {id:31, title:"Packing of Personal belongings after arrival", role:"LP", default:"YES", type:"YESNO"},
  {id:32, title:"Over all Performance", role:"LP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},
  {id:33, title:"Packing of Personal belongings after arrival", role:"ALP", default:"YES", type:"YESNO"},
  {id:34, title:"Over all Performance", role:"ALP", default:"VERY GOOD", type:"RATING", abnormalitiesNeeded:true},

];
```
