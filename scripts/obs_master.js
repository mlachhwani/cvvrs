/* =============================================================================
   obs_master.js — FULL OBSERVATION MASTER DEFINITIONS (NO UI)
   LOCKED PER ML-PHASE-SPECS
   ============================================================================= */

console.log("obs_master.js loaded");

/*
SECTION KEY:
1 = DURING CTO
2 = ON RUN
3 = AT HALTS
4 = AT CHO

FIELD:
id      → Unique per observation
sec     → Section (1‒4)
role    → "LP" or "ALP"
title   → Display text
type    → YESNO | YESNO_DAY | RATING
def     → Default value
*/

window.OBS_MASTER = [

  /* =============================== SECTION-1: DURING CTO =============================== */
  { id: 1, sec:1, role:"LP",  title:"Checking Logbook & BPC",                 type:"YESNO",     def:"YES" },
  { id: 2, sec:1, role:"LP",  title:"Checking Safety Items & HTC",            type:"YESNO",     def:"YES" },
  { id: 3, sec:1, role:"LP",  title:"Energy Meter & SPM check",               type:"YESNO",     def:"YES" },

  { id: 4, sec:1, role:"ALP", title:"Checking RS Valve working",              type:"YESNO",     def:"YES" },
  { id: 5, sec:1, role:"ALP", title:"Checking Safety Items & HTC",            type:"YESNO",     def:"YES" },
  { id: 6, sec:1, role:"ALP", title:"Energy Meter & SPM check & Input",       type:"YESNO",     def:"YES" },

  /* =============================== SECTION-2: ON RUN ================================ */
  { id: 7,  sec:2, role:"LP",  title:"Conducting BFT & BPT",                  type:"YESNO",     def:"YES" },
  { id: 8,  sec:2, role:"LP",  title:"Calling Out Signals with Hand Gesture", type:"YESNO",     def:"YES" },
  { id: 9,  sec:2, role:"LP",  title:"Use of Mobile Phone",                   type:"YESNO",     def:"NO"  },
  { id:10,  sec:2, role:"LP",  title:"Micro Sleep",                           type:"YESNO",     def:"NO"  },
  { id:11,  sec:2, role:"LP",  title:"Exchange of Signals",                   type:"YESNO",     def:"YES" },
  { id:12,  sec:2, role:"LP",  title:"Proper action during Neutral Section",  type:"YESNO",     def:"YES" },
  { id:13,  sec:2, role:"LP",  title:"Alertness",                             type:"RATING",    def:"VERY GOOD" },

  { id:14,  sec:2, role:"ALP", title:"Standing & Holding RS near Danger Signal", type:"YESNO",  def:"YES" },
  { id:15,  sec:2, role:"ALP", title:"Calling Out Signals with Hand Gesture", type:"YESNO",     def:"YES" },
  { id:16,  sec:2, role:"ALP", title:"Use of Mobile Phone",                   type:"YESNO",     def:"NO"  },
  { id:17,  sec:2, role:"ALP", title:"Micro Sleep",                           type:"YESNO",     def:"NO"  },
  { id:18,  sec:2, role:"ALP", title:"Exchange of Signals",                   type:"YESNO",     def:"YES" },
  { id:19,  sec:2, role:"ALP", title:"Checking Formation in curve & Caution Spot", type:"YESNO",def:"YES" },
  { id:20,  sec:2, role:"ALP", title:"Alertness",                             type:"RATING",    def:"VERY GOOD" },

  /* =============================== SECTION-3: AT HALTS ============================== */
  { id:21, sec:3, role:"LP",  title:"Application of A9 & SA9",               type:"YESNO",      def:"YES" },
  { id:22, sec:3, role:"LP",  title:"Reverser in Neutral",                   type:"YESNO",      def:"YES" },
  { id:23, sec:3, role:"LP",  title:"Dimming of Headlight",                  type:"YESNO_DAY",  def:"YES" },
  { id:24, sec:3, role:"LP",  title:"Checking of Undergear & Machine Room",  type:"YESNO",      def:"YES" },
  { id:25, sec:3, role:"LP",  title:"Proper whistle before start",           type:"YESNO",      def:"YES" },

  { id:26, sec:3, role:"ALP", title:"Ensure Application of A9 & SA9",        type:"YESNO",      def:"YES" },
  { id:27, sec:3, role:"ALP", title:"Ensure Reverser in Neutral",            type:"YESNO",      def:"YES" },
  { id:28, sec:3, role:"ALP", title:"Ensure Dimming of Headlight",           type:"YESNO_DAY",  def:"YES" },
  { id:29, sec:3, role:"ALP", title:"Checking of Undergear & Machine Room",  type:"YESNO",      def:"YES" },
  { id:30, sec:3, role:"ALP", title:"Proper Signal Exchange Before start",   type:"YESNO",      def:"YES" },

  /* =============================== SECTION-4: AT CHO =============================== */
  { id:31, sec:4, role:"LP",  title:"Packing of Personal belongings after arrival", type:"YESNO",  def:"YES" },
  { id:32, sec:4, role:"LP",  title:"Over all Performance",                  type:"RATING",     def:"VERY GOOD" },

  { id:33, sec:4, role:"ALP", title:"Packing of Personal belongings after arrival", type:"YESNO", def:"YES" },
  { id:34, sec:4, role:"ALP", title:"Over all Performance",                  type:"RATING",     def:"VERY GOOD" },
];
