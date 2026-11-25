
"use strict";

/* =========================================================
   PROJECT DEBUG STATUS

   ONE STATUS:
   window.projectDebugStatus

   TRUE  = ADMIN ON
   FALSE = ADMIN OFF

   ALWAYS SYNCHRONIZED WITH ADMIN MODE.
========================================================= */

(function () {

    /* INITIAL STATUS */

    window.projectDebugStatus = false;

    window.projectDebugSetterStatus = false;

    /* =====================================
       UPDATE STATUS
    ===================================== */

    function updateDebugStatus() {

        const account = window.AccountStatus;

        const status = !!(
            account &&
            account.isSignedIn === true &&
            account.isanadmin === true &&
            account.isadmin === true
        );

        /* UPDATE THE ONE GLOBAL STATUS */

        window.projectDebugStatus = status;

        window.projectDebugSetterStatus = status;

        /* UPDATE OTHER DEBUG SYSTEMS */

        if (typeof window.setProjectDebugStatus === "function") {

            window.setProjectDebugStatus(status);

        }

        /* ONLY BROADCAST WHEN STATUS CHANGES */

        if (window.projectDebugLastStatus !== status) {

            window.projectDebugLastStatus = status;

            window.dispatchEvent(
                new CustomEvent("projectDebugStatusChanged", {
                    detail: {
                        enabled: status
                    }
                })
            );

            console.log(
                "[PROJECT DEBUG]",
                status
            );

        }

    }

    /* =====================================
       WATCH ADMIN STATUS CHANGES
    ===================================== */

    window.addEventListener(
        "adminModeChanged",
        updateDebugStatus
    );

    /* =====================================
       WATCH ACCOUNT STATUS CHANGES
    ===================================== */

    window.addEventListener(
        "accountStatusChanged",
        updateDebugStatus
    );

    /* =====================================
       INITIALIZE
    ===================================== */

    function initialize() {

        updateDebugStatus();

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
