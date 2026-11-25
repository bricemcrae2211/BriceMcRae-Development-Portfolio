
"use strict";

/* =========================================
   DEBUG HANDLER
========================================= */

(function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const adminDebugPanel =
        document.getElementById("adminDebugPanel");

    const toolbarDebugButton =
        document.getElementById("toolbarDebugButton");

    const debugRefreshButton =
        document.getElementById("debugRefreshButton");

    const debugDisableButton =
        document.getElementById("debugDisableButton");


    /* =========================================
       DEBUG INFORMATION
    ========================================= */

    function updateDebugInformation() {

        const debugAdminStatus =
            document.getElementById("debugAdminStatus");

        const debugProjectStatus =
            document.getElementById("debugProjectStatus");

        const debugVideoStatus =
            document.getElementById("debugVideoStatus");

        const debugStorageStatus =
            document.getElementById("debugStorageStatus");


        const addProjectContainer =
            document.getElementById("addProjectContainer");

        const demoReelUploadContainer =
            document.getElementById("demoReelUploadContainer");


        if (debugAdminStatus) {
            debugAdminStatus.textContent = "OFF";
        }

        if (debugProjectStatus) {

            debugProjectStatus.textContent =
                addProjectContainer &&
                !addProjectContainer.hidden
                    ? "VISIBLE"
                    : "CLOSED";

        }

        if (debugVideoStatus) {

            debugVideoStatus.textContent =
                demoReelUploadContainer &&
                !demoReelUploadContainer.hidden
                    ? "VISIBLE"
                    : "HIDDEN";

        }

        if (debugStorageStatus) {
            debugStorageStatus.textContent = "OFF";
        }

    }


    /* =========================================
       DEBUG PANEL TOGGLE
    ========================================= */

    function toggleDebugPanel() {

        if (!adminDebugPanel) {

            console.error(
                "[DEBUG] Debug Panel was not found."
            );

            return;

        }

        adminDebugPanel.hidden =
            !adminDebugPanel.hidden;

        if (toolbarDebugButton) {

            toolbarDebugButton.setAttribute(
                "aria-expanded",
                String(!adminDebugPanel.hidden)
            );

        }

        updateDebugInformation();

        console.log(
            "[DEBUG] Debug Panel:",
            adminDebugPanel.hidden ? "CLOSED" : "OPEN"
        );

    }


    /* =========================================
       REFRESH DEBUG INFORMATION
    ========================================= */

    function refreshDebugInformation() {

        updateDebugInformation();

        console.log(
            "[DEBUG] Information refreshed."
        );

    }


    /* =========================================
       DISABLE ADMIN
    ========================================= */

    function disableAdmin() {

        console.log(
            "[DEBUG] Admin disable requested."
        );

        console.warn(
            "[DEBUG] Permission controls are currently disabled."
        );

    }


    /* =========================================
       PORTFOLIO STATE EVENTS
    ========================================= */

    document.addEventListener(
        "portfolioStateChanged",
        updateDebugInformation
    );

    document.addEventListener(
        "addProjectModeChanged",
        updateDebugInformation
    );


    /* =========================================
       BUTTON EVENTS
    ========================================= */

    if (toolbarDebugButton) {

        toolbarDebugButton.addEventListener(
            "click",
            toggleDebugPanel
        );

    }

    if (debugRefreshButton) {

        debugRefreshButton.addEventListener(
            "click",
            refreshDebugInformation
        );

    }

    if (debugDisableButton) {

        debugDisableButton.addEventListener(
            "click",
            disableAdmin
        );

    }


    /* =========================================
       INITIALIZE DEBUG HANDLER
    ========================================= */

    if (adminDebugPanel && toolbarDebugButton) {

        toolbarDebugButton.setAttribute(
            "aria-expanded",
            String(!adminDebugPanel.hidden)
        );

    }

    updateDebugInformation();

    console.log(
        "[DEBUG] Debug Handler initialized."
    );


    /* =========================================
       PUBLIC DEBUG API
    ========================================= */

    window.PortfolioDebug = {

        refresh: updateDebugInformation

    };

})();
