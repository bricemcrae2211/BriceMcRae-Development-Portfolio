
"use strict";

/* =========================================================
   PROJECT ANALYSIS MODULE
========================================================= */

(function () {

    /* =====================================================
       STATE
    ===================================================== */

    let elements = {};

    let getAnalysisData = null;

    let isAnalyzing = false;

    let initialized = false;


    /* =====================================================
       INITIALIZE ANALYSIS
    ===================================================== */

    function initialize(dataProvider) {

        if (initialized) {
            return;
        }

        if (typeof dataProvider !== "function") {
            console.error(
                "ProjectAnalysis requires a data provider."
            );
            return;
        }

        getAnalysisData = dataProvider;

        elements = {
            analyzeButton: document.getElementById("analyzeButton"),
            debugWindow: document.getElementById("debugWindow")
        };

        if (!elements.analyzeButton || !elements.debugWindow) {

            console.error(
                "ProjectAnalysis could not find its required HTML elements."
            );

            return;
        }

        elements.analyzeButton.addEventListener(
            "click",
            analyze
        );

        initialized = true;

        console.log(
            "PROJECT ANALYSIS INITIALIZED"
        );
    }


    /* =====================================================
       OPEN ANALYSIS WINDOW
    ===================================================== */

    function openWindow() {

        elements.debugWindow.hidden = false;

        elements.debugWindow.setAttribute(
            "aria-hidden",
            "false"
        );

        elements.debugWindow.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    /* =====================================================
       CLOSE ANALYSIS WINDOW
    ===================================================== */

    function closeWindow() {

        elements.debugWindow.hidden = true;

        elements.debugWindow.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /* =====================================================
       ANALYZE PROJECTS
    ===================================================== */

    async function analyze() {

        if (isAnalyzing) {
            return;
        }

        if (!initialized || !getAnalysisData) {

            console.error(
                "ProjectAnalysis has not been initialized."
            );

            return;
        }

        if (!window.ProjectDebug) {

            console.error(
                "ProjectDebug is unavailable."
            );

            return;
        }

        if (typeof window.ProjectDebug.analyze !== "function") {

            console.error(
                "ProjectDebug.analyze is unavailable."
            );

            return;
        }

        isAnalyzing = true;

        elements.analyzeButton.disabled = true;

        openWindow();

        try {

            /* =============================================
               GET LIVE DATA FROM MY-PROJECTS.JS
            ============================================= */

            const analysisData = getAnalysisData();

            if (!analysisData) {
                throw new Error(
                    "Project analysis data is unavailable."
                );
            }

            /* =============================================
               RUN ORIGINAL PROJECT DEBUG SYSTEM
            ============================================= */

            await window.ProjectDebug.analyze(
                analysisData
            );

            console.log(
                "PROJECT ANALYSIS COMPLETE"
            );

        } catch (error) {

            console.error(
                "Project analysis failed:",
                error
            );

            const debugStatus = document.getElementById(
                "debugStatus"
            );

            if (debugStatus) {
                debugStatus.textContent =
                    "Analysis failed: " + error.message;
            }

        } finally {

            isAnalyzing = false;

            elements.analyzeButton.disabled = false;

        }
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ProjectAnalysis = {

        initialize,

        analyze,

        openWindow,

        closeWindow

    };

})();
