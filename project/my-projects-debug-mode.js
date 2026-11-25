
// /* =========================================================
//    MY PROJECTS - DEBUG MODE VISIBILITY CONTROLLER
// ========================================================= */

// (function () {

//     "use strict";


//     /* =====================================================
//        ELEMENTS
//     ===================================================== */

//     let elements = {};

//     let debugModeEnabled = false;

//     let initialized = false;


//     /* =====================================================
//        INITIALIZE
//     ===================================================== */

//     function initialize() {

//         if (initialized) {
//             return;
//         }

//         elements = {

//             toggle: document.getElementById("debugModeToggle"),

//             loader: document.getElementById("projectLoader"),

//             projectCount: document.getElementById("projectCount"),

//             debugControls: document.getElementById("debugControls"),

//             debugAndInformation: document.getElementById("debugAndInformation"),

//             debugWindow: document.getElementById("debugWindow"),

//             allProjectInformation: document.getElementById("allProjectInformation"),

//             projectDataToggle: document.getElementById("projectDataToggle"),

//             analyzeButton: document.getElementById("analyzeButton")

//         };


//         if (!elements.toggle) {

//             console.error(
//                 "Debug Mode: Could not find #debugModeToggle."
//             );

//             return;
//         }


//         initialized = true;


//         /* =================================================
//            BUTTON EVENT
//         ================================================= */

//         elements.toggle.addEventListener("click", function () {

//             setDebugMode(!debugModeEnabled);

//         });


//         /* =================================================
//            START WITH DEBUG MODE OFF
//         ================================================= */

//         setDebugMode(false);

//         console.log("Debug Mode Controller initialized.");

//     }


//     /* =====================================================
//        SET DEBUG MODE
//     ===================================================== */

//     function setDebugMode(enabled) {

//         debugModeEnabled = Boolean(enabled);


//         /* =================================================
//            UPDATE BUTTON
//         ================================================= */

//         elements.toggle.textContent = debugModeEnabled
//             ? "Debug Mode: ON"
//             : "Debug Mode: OFF";

//         elements.toggle.setAttribute(
//             "aria-expanded",
//             String(debugModeEnabled)
//         );

//         elements.toggle.setAttribute(
//             "aria-pressed",
//             String(debugModeEnabled)
//         );

//         elements.toggle.dataset.debugMode = debugModeEnabled
//             ? "on"
//             : "off";


//         /* =================================================
//            SHOW OR HIDE DEBUG INFORMATION
//         ================================================= */

//         if (elements.loader) {
//             elements.loader.hidden = !debugModeEnabled;
//         }

//         if (elements.projectCount) {
//             elements.projectCount.hidden = !debugModeEnabled;
//         }

//         if (elements.debugControls) {
//             elements.debugControls.hidden = !debugModeEnabled;
//         }

//         if (elements.debugAndInformation) {
//             elements.debugAndInformation.hidden = !debugModeEnabled;
//         }

//         if (elements.debugWindow) {
//             elements.debugWindow.hidden = !debugModeEnabled;
//         }

//         if (elements.allProjectInformation) {
//             elements.allProjectInformation.hidden = !debugModeEnabled;
//         }


//         /* =================================================
//            UPDATE PROJECT DATA VISIBILITY
//         ================================================= */

//         if (
//             window.MyProjectsDebug &&
//             typeof window.MyProjectsDebug.setProjectDataVisibility === "function"
//         ) {

//             window.MyProjectsDebug.setProjectDataVisibility(false);

//         }


//         /* =================================================
//            BODY STATE
//         ================================================= */

//         document.body.classList.toggle(
//             "debugModeEnabled",
//             debugModeEnabled
//         );


//         /* =================================================
//            SECTION STATE
//         ================================================= */

//         const projectsSection = document.getElementById("projectsSection");

//         if (projectsSection) {

//             projectsSection.dataset.debugMode = debugModeEnabled
//                 ? "on"
//                 : "off";

//         }


//         console.log(
//             "Debug Mode:",
//             debugModeEnabled ? "ON" : "OFF"
//         );

//     }


//     /* =====================================================
//        GET DEBUG MODE
//     ===================================================== */

//     function getDebugMode() {

//         return debugModeEnabled;

//     }


//     /* =====================================================
//        PUBLIC API
//     ===================================================== */

//     window.MyProjectsDebugMode = {

//         initialize: initialize,

//         setDebugMode: setDebugMode,

//         getDebugMode: getDebugMode

//     };


//     /* =====================================================
//        START AFTER HTML IS READY
//     ===================================================== */

//     if (document.readyState === "loading") {

//         document.addEventListener(
//             "DOMContentLoaded",
//             initialize,
//             { once: true }
//         );

//     } else {

//         initialize();

//     }

// })();
