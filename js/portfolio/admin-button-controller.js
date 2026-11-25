
"use strict";

/* =========================================
   ADMIN BUTTON CONTROLLER

   RESPONSIBILITIES:
   - Show Admin button for administrators.
   - Turn Admin Mode ON/OFF.
   - Display current Admin Mode status.
   - Save Admin Mode changes.
   - Notify the Admin Page Controller.

   ACCOUNT STATUS:
   isSignedIn = Account signed in
   isanadmin  = Administrator permission
   isadmin    = Admin Mode active
========================================= */

(function () {

    function initialize() {

        const adminToggle =
            document.getElementById("adminToggle");

        const AccountStatus =
            window.AccountStatus;

        if (!adminToggle || !AccountStatus) {
            return;
        }

        /* =====================================
           CHECK ADMIN PERMISSION
        ===================================== */

        function hasAdminAccess() {

            return (
                AccountStatus.isSignedIn === true &&
                AccountStatus.isanadmin === true
            );

        }

        /* =====================================
           SAVE ADMIN MODE
        ===================================== */

        function saveAdminMode() {

            if (
                typeof AccountStatus.saveStatus === "function"
            ) {
                AccountStatus.saveStatus();
            }

        }

        /* =====================================
           UPDATE BUTTON DISPLAY
        ===================================== */

        function updateButton() {

            const hasAccess =
                hasAdminAccess();

            if (!hasAccess) {

                AccountStatus.isadmin = false;

            }

            const adminEnabled =
                hasAccess &&
                AccountStatus.isadmin === true;

            adminToggle.hidden = !hasAccess;

            adminToggle.style.display =
                hasAccess ? "inline-flex" : "none";

            adminToggle.textContent =
                adminEnabled
                    ? "ADMIN : ON"
                    : "ADMIN : OFF";

            adminToggle.setAttribute(
                "aria-pressed",
                String(adminEnabled)
            );

        }

        /* =====================================
           NOTIFY ADMIN PAGE CONTROLLER
        ===================================== */

        function notifyAdminPage() {

            window.dispatchEvent(
                new CustomEvent("adminModeChanged", {
                    detail: {
                        enabled:
                            hasAdminAccess() &&
                            AccountStatus.isadmin === true
                    }
                })
            );

        }

        /* =====================================
           ADMIN BUTTON CLICK
        ===================================== */

        adminToggle.addEventListener(
            "click",
            function () {

                if (!hasAdminAccess()) {

                    AccountStatus.isadmin = false;

                    updateButton();

                    notifyAdminPage();

                    return;

                }

                AccountStatus.isadmin =
                    AccountStatus.isadmin !== true;

                saveAdminMode();

                updateButton();

                notifyAdminPage();

            }
        );

        /* =====================================
           ACCOUNT STATUS CHANGED
        ===================================== */

        window.addEventListener(
            "accountStatusChanged",
            function () {

                updateButton();

                notifyAdminPage();

            }
        );

        /* =====================================
           OTHER ADMIN MODE CHANGES
        ===================================== */

        window.addEventListener(
            "adminModeChanged",
            updateButton
        );

        /* =====================================
           INITIAL STATE
        ===================================== */

        updateButton();

        notifyAdminPage();

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
