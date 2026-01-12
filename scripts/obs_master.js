/* ===============================================
   OBSERVATION MASTER (LP + ALP)
   Clean definitions only — no UI, no logic
   =============================================== */

window.OBS_MASTER = [

  //============== DURING CTO ==============
  {id:1, role:"LP",  title:"Checking Logbook & BPC", type:"YESNO", default:"YES"},
  {id:2, role:"LP",  title:"Checking Safety Items & HTC", type:"YESNO", default:"YES"},
  {id:3, role:"LP",  title:"Energy Meter & SPM check", type:"YESNO", default:"YES"},

  {id:4, role:"ALP", title:"Checking RS Valve working", type:"YESNO", default:"YES"},
  {id:5, role:"ALP", title:"Checking Safety Items & HTC", type:"YESNO", default:"YES"},
  {id:6, role:"ALP", title:"Energy Meter & SPM check & Input", type:"YESNO", default:"YES"},

  //================ ON RUN =================
  {id:7,  role:"LP",  title:"Conducting BFT & BPT", type:"YESNO", default:"YES"},
  {id:8,  role:"LP",  title:"Calling Out Signals with Hand Gesture", type:"YESNO", default:"YES"},
  {id:9,  role:"LP",  title:"Use of Mobile Phone", type:"YESNO", default:"NO"},
  {id:10, role:"LP",  title:"Micro Sleep", type:"YESNO", default:"NO"},
  {id:11, role:"LP",  title:"Exchange of Signals", type:"YESNO", default:"YES"},
  {id:12, role:"LP",  title:"Proper action during Neutral Section", type:"YESNO", default:"YES"},
  {id:13, role:"LP",  title:"Alertness", type:"RATING", default:"VERY GOOD"},

  {id:14, role:"ALP", title:"Standing & Holding RS near Danger Signal", type:"YESNO", default:"YES"},
  {id:15, role:"ALP", title:"Calling Out Signals with Hand Gesture", type:"YESNO", default:"YES"},
  {id:16, role:"ALP", title:"Use of Mobile Phone", type:"YESNO", default:"NO"},
  {id:17, role:"ALP", title:"Micro Sleep", type:"YESNO", default:"NO"},
  {id:18, role:"ALP", title:"Exchange of Signals", type:"YESNO", default:"YES"},
  {id:19, role:"ALP", title:"Checking Formation in curve & Caution Spot", type:"YESNO", default:"YES"},
  {id:20, role:"ALP", title:"Alertness", type:"RATING", default:"VERY GOOD"},

  //================ AT HALTS =================
  {id:21, role:"LP",  title:"Application of A9 & SA9", type:"YESNO", default:"YES"},
  {id:22, role:"LP",  title:"Reverser in Neutral", type:"YESNO", default:"YES"},
  {id:23, role:"LP",  title:"Dimming of Headlight", type:"YESNO_DAY", default:"YES"},
  {id:24, role:"LP",  title:"Checking of Undergear & Machine Room", type:"YESNO", default:"YES"},
  {id:25, role:"LP",  title:"Proper whistle before start", type:"YESNO", default:"YES"},

  {id:26, role:"ALP", title:"Ensure Application of A9 & SA9", type:"YESNO", default:"YES"},
  {id:27, role:"ALP", title:"Ensure Reverser in Neutral", type:"YESNO", default:"YES"},
  {id:28, role:"ALP", title:"Ensure Dimming of Headlight", type:"YESNO_DAY", default:"YES"},
  {id:29, role:"ALP", title:"Checking of Undergear & Machine Room", type:"YESNO", default:"YES"},
  {id:30, role:"ALP", title:"Proper Signal Exchange Before start", type:"YESNO", default:"YES"},

  //================ AT CHO =================
  {id:31, role:"LP",  title:"Packing of Personal belongings after arrival", type:"YESNO", default:"YES"},
  {id:32, role:"LP",  title:"Over-all Performance", type:"RATING", default:"VERY GOOD"},

  {id:33, role:"ALP", title:"Packing of Personal belongings after arrival", type:"YESNO", default:"YES"},
  {id:34, role:"ALP", title:"Over-all Performance", type:"RATING", default:"VERY GOOD"},

];
