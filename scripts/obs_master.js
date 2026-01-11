/* ============================================================
   OBS MASTER MODEL (ML/PHASE1 STEP-4 LOCKED)
   FULL FILE — NO PATCHES (ML/01 COMPLIANT)
   ============================================================ */

window.OBS_MASTER = [

  /* =========================
     SECTION 1: DURING CTO
     ========================= */

  { id: 1, sec: "CTO", role: "LP",  title: "Checking Logbook & BPC",                   type: "YESNO",       def: "YES" },
  { id: 2, sec: "CTO", role: "LP",  title: "Checking Safety Items & HTC",             type: "YESNO",       def: "YES" },
  { id: 3, sec: "CTO", role: "LP",  title: "Energy Meter & SPM check",                type: "YESNO",       def: "YES" },

  { id: 4, sec: "CTO", role: "ALP", title: "Checking RS Valve working",               type: "YESNO",       def: "YES" },
  { id: 5, sec: "CTO", role: "ALP", title: "Checking Safety Items & HTC",             type: "YESNO",       def: "YES" },
  { id: 6, sec: "CTO", role: "ALP", title: "Energy Meter & SPM check & Input",        type: "YESNO",       def: "YES" },

  /* =========================
     SECTION 2: ON-RUN
     ========================= */

  { id: 7,  sec: "RUN", role: "LP",  title: "Conducting BFT & BPT",                    type: "YESNO",       def: "YES" },
  { id: 8,  sec: "RUN", role: "LP",  title: "Calling Out Signals with Hand Gesture",  type: "YESNO",       def: "YES" },
  { id: 9,  sec: "RUN", role: "LP",  title: "Use of Mobile Phone",                    type: "YESNO",       def: "NO"  },
  { id: 10, sec: "RUN", role: "LP",  title: "Micro Sleep",                            type: "YESNO",       def: "NO"  },
  { id: 11, sec: "RUN", role: "LP",  title: "Exchange of Signals",                    type: "YESNO",       def: "YES" },
  { id: 12, sec: "RUN", role: "LP",  title: "Proper action during Neutral Section",   type: "YESNO",       def: "YES" },
  { id: 13, sec: "RUN", role: "LP",  title: "Alertness",                              type: "RATING",      def: "VERY GOOD" },

  { id: 14, sec: "RUN", role: "ALP", title: "Standing & Holding RS while approaching Danger Signal", type: "YESNO", def: "YES" },
  { id: 15, sec: "RUN", role: "ALP", title: "Calling Out Signals with Hand Gesture",  type: "YESNO",       def: "YES" },
  { id: 16, sec: "RUN", role: "ALP", title: "Use of Mobile Phone",                    type: "YESNO",       def: "NO"  },
  { id: 17, sec: "RUN", role: "ALP", title: "Micro Sleep",                            type: "YESNO",       def: "NO"  },
  { id: 18, sec: "RUN", role: "ALP", title: "Exchange of Signals",                    type: "YESNO",       def: "YES" },
  { id: 19, sec: "RUN", role: "ALP", title: "Checking Formation in curve & Caution Spot", type: "YESNO",  def: "YES" },
  { id: 20, sec: "RUN", role: "ALP", title: "Alertness",                              type: "RATING",      def: "VERY GOOD" },

  /* =========================
     SECTION 3: AT HALTS
     ========================= */

  { id: 21, sec: "HALT", role: "LP",  title: "Application of A9 & SA9",                type: "YESNO",        def: "YES" },
  { id: 22, sec: "HALT", role: "LP",  title: "Reverser in Neutral",                    type: "YESNO",        def: "YES" },
  { id: 23, sec: "HALT", role: "LP",  title: "Dimming of Headlight",                   type: "YESNO_DAY",    def: "YES" },
  { id: 24, sec: "HALT", role: "LP",  title: "Checking of Undergear & Machine Room",   type: "YESNO",        def: "YES" },
  { id: 25, sec: "HALT", role: "LP",  title: "Proper whistle before start",            type: "YESNO",        def: "YES" },

  { id: 26, sec: "HALT", role: "ALP", title: "Ensure Application of A9 & SA9",         type: "YESNO",        def: "YES" },
  { id: 27, sec: "HALT", role: "ALP", title: "Ensure Reverser in Neutral",             type: "YESNO",        def: "YES" },
  { id: 28, sec: "HALT", role: "ALP", title: "Ensure Dimming of Headlight",            type: "YESNO_DAY",    def: "YES" },
  { id: 29, sec: "HALT", role: "ALP", title: "Checking of Undergear & Machine Room",   type: "YESNO",        def: "YES" },
  { id: 30, sec: "HALT", role: "ALP", title: "Proper Signal Exchange Before start",    type: "YESNO",        def: "YES" },

  /* =========================
     SECTION 4: AT CHO
     ========================= */

  { id: 31, sec: "CHO", role: "LP",  title: "Packing of Personal belongings after arrival", type: "YESNO", def: "YES" },
  { id: 32, sec: "CHO", role: "LP",  title: "Over-all Performance",                        type: "RATING", def: "VERY GOOD" },

  { id: 33, sec: "CHO", role: "ALP", title: "Packing of Personal belongings after arrival", type: "YESNO", def: "YES" },
  { id: 34, sec: "CHO", role: "ALP", title: "Over-all Performance",                        type: "RATING", def: "VERY GOOD" }

];
