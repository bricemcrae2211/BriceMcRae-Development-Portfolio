
"use strict";

/* =========================================
   ADMIN PAGE CONTROLLER

   RESPONSIBILITIES:
   - Turn the Admin Toolbar ON/OFF.
   - Show admin controls only when Admin Mode
     is active.
   - Display current Admin Mode status.
   - Control the Debug Tools panel.
   - Display current admin information.
   - Allow Admin Mode to be disabled.

   Does not control account sign-in.
========================================= */

(function () {

    function initialize() {

        /* =====================================
           HTML REFERENCES
        ===================================== */

        const adminToolbar =
            document.getElementById("adminToolbar");

        const adminToolbarStatus =
            document.getElementById("adminToolbarStatus");

        const debugButton =
            document.getElementById("toolbarDebugButton");

        const debugPanel =
            document.getElementById("adminDebugPanel");

        const debugAdminStatus =
            document.getElementById("debugAdminStatus");

        const debugProjectStatus =
            document.getElementById("debugProjectStatus");

        const debugVideoStatus =
            document.getElementById("debugVideoStatus");

        const debugStorageStatus =
            document.getElementById("debugStorageStatus");

        const debugRefreshButton =
            document.getElementById("debugRefreshButton");

        const debugDisableButton =
            document.getElementById("debugDisableButton");

        const AccountStatus =
            window.AccountStatus;

        if (!adminToolbar || !AccountStatus) {
            return;
        }

        /* =====================================
           INTERNAL STATE
        ===================================== */

        let debugPanelOpen = false;


        /* =====================================
           CHECK ADMIN STATUS
        ===================================== */

        function isAdminActive() {

            return (
                AccountStatus.isSignedIn === true &&
                AccountStatus.isanadmin === true &&
                AccountStatus.isadmin === true
            );

        }


        /* =====================================
           SAVE ACCOUNT STATUS
        ===================================== */

        function saveAccountStatus() {

            if (
                typeof AccountStatus.saveStatus === "function"
            ) {

                AccountStatus.saveStatus();

            }

        }


        /* =====================================
           UPDATE DEBUG INFORMATION
        ===================================== */

        function updateDebugInformation() {

            const active =
                isAdminActive();

            if (debugAdminStatus) {

                debugAdminStatus.textContent =
                    active ? "ON" : "OFF";

            }

            if (debugProjectStatus) {

                debugProjectStatus.textContent =
                    active
                        ? "ADMIN ACCESS ACTIVE"
                        : "CLOSED";

            }

            if (debugVideoStatus) {

                debugVideoStatus.textContent =
                    active
                        ? "ADMIN ACCESS ACTIVE"
                        : "HIDDEN";

            }

            if (debugStorageStatus) {

                debugStorageStatus.textContent =
                    active
                        ? "ADMIN MODE ENABLED"
                        : "ADMIN MODE DISABLED";

            }

        }


        /* =====================================
           UPDATE ADMIN PAGE
        ===================================== */

        function updateAdminPage() {

            const active =
                isAdminActive();

            /* Show or hide toolbar */

            adminToolbar.hidden = !active;

            /* Update toolbar status */

            if (adminToolbarStatus) {

                adminToolbarStatus.textContent =
                    active
                        ? "ADMIN ACTIVE"
                        : "ADMIN INACTIVE";

            }

            /* Hide debug panel when Admin Mode
               is turned OFF. */

            if (!active) {

                debugPanelOpen = false;

            }

            if (debugPanel) {

                debugPanel.hidden =
                    !active || !debugPanelOpen;

            }

            /* Update Debug Tools button */

            if (debugButton) {

                debugButton.hidden = !active;

                debugButton.setAttribute(
                    "aria-expanded",
                    String(active && debugPanelOpen)
                );

            }

            updateDebugInformation();

        }


        /* =====================================
           DEBUG TOOLS BUTTON
        ===================================== */

        if (debugButton) {

            debugButton.addEventListener(
                "click",
                function () {

                    if (!isAdminActive()) {
                        updateAdminPage();
                        return;
                    }

                    debugPanelOpen =
                        !debugPanelOpen;

                    updateAdminPage();

                }
            );

        }


        /* =====================================
           REFRESH DEBUG INFORMATION
        ===================================== */

        if (debugRefreshButton) {

            debugRefreshButton.addEventListener(
                "click",
                function () {

                    updateDebugInformation();

                }
            );

        }


        /* =====================================
           DISABLE ADMIN MODE
        ===================================== */

        if (debugDisableButton) {

            debugDisableButton.addEventListener(
                "click",
                function () {

                    AccountStatus.isadmin = false;

                    saveAccountStatus();

                    debugPanelOpen = false;

                    updateAdminPage();

                    /* Notify other controllers */

                    window.dispatchEvent(
                        new CustomEvent("adminModeChanged", {
                            detail: {
                                enabled: false
                            }
                        })
                    );

                }
            );

        }


        /* =====================================
           ACCOUNT STATUS CHANGED
        ===================================== */

        window.addEventListener(
            "accountStatusChanged",
            function () {

                updateAdminPage();

            }
        );


        /* =====================================
           ADMIN MODE CHANGED
        ===================================== */

        window.addEventListener(
            "adminModeChanged",
            function () {

                updateAdminPage();

            }
        );


        /* =====================================
           INITIALIZE PAGE STATE
        ===================================== */

        updateAdminPage();

    }


    /* =====================================
       DOCUMENT READY
    ===================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
