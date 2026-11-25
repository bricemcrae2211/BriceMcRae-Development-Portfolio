
"use strict";

/* =========================================
   ADMIN PAGE CONTROLLER

   CONTROLS:
   - Admin toolbar
   - Debug panel
   - Add project section
   - Demo reel upload section

   DOES NOT CONTROL:
   - Admin button click handling

   ADMIN OFF:
   - Hides all admin sections
   - Sets AccountStatus.isadmin = false
   - Notifies other controllers
========================================= */

(function () {

    function initialize() {

        const AccountStatus = window.AccountStatus;

        const adminToolbar =
            document.getElementById("adminToolbar");

        const adminDebugPanel =
            document.getElementById("adminDebugPanel");

        const addProjectContainer =
            document.getElementById("addProjectContainer");

        const demoReelUploadContainer =
            document.getElementById("demoReelUploadContainer");

        const debugButton =
            document.getElementById("toolbarDebugButton");

        const addProjectButton =
            document.getElementById("toolbarAddProjectButton");

        const uploadVideoButton =
            document.getElementById("toolbarUploadVideoButton");

        const debugDisableButton =
            document.getElementById("debugDisableButton");

        if (!AccountStatus || !adminToolbar) {
            return;
        }

        /* =====================================
           ACCESS CHECK
        ===================================== */

        function hasAdminAccess() {

            return (
                AccountStatus.isSignedIn === true &&
                AccountStatus.isanadmin === true
            );

        }

        /* =====================================
           ADMIN MODE CHECK
        ===================================== */

        function isAdminEnabled() {

            return (
                hasAdminAccess() &&
                AccountStatus.isadmin === true
            );

        }

        /* =====================================
           NOTIFY OTHER CONTROLLERS
        ===================================== */

        function notifyAdminModeChanged() {

            window.dispatchEvent(
                new CustomEvent("adminModeChanged", {
                    detail: {
                        enabled: isAdminEnabled()
                    }
                })
            );

        }

        /* =====================================
           HIDE ALL ADMIN SECTIONS
        ===================================== */

        function hideAdminSections() {

            if (adminDebugPanel) {
                adminDebugPanel.hidden = true;
            }

            if (addProjectContainer) {
                addProjectContainer.hidden = true;
            }

            if (demoReelUploadContainer) {
                demoReelUploadContainer.hidden = true;
            }

            if (debugButton) {
                debugButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            if (addProjectButton) {
                addProjectButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            if (uploadVideoButton) {
                uploadVideoButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        }

        /* =====================================
           UPDATE ADMIN PAGE
        ===================================== */

        function updatePage() {

            /* FORCE ADMIN OFF IF ACCESS IS LOST */

            if (!hasAdminAccess()) {

                AccountStatus.isadmin = false;

            }

            const enabled = isAdminEnabled();

            adminToolbar.hidden = !enabled;

            if (!enabled) {

                hideAdminSections();

            }

        }

        /* =====================================
           DEBUG PANEL
        ===================================== */

        if (debugButton && adminDebugPanel) {

            debugButton.addEventListener(
                "click",
                function () {

                    if (!isAdminEnabled()) {
                        return;
                    }

                    adminDebugPanel.hidden =
                        !adminDebugPanel.hidden;

                    debugButton.setAttribute(
                        "aria-expanded",
                        String(!adminDebugPanel.hidden)
                    );

                }
            );

        }

        /* =====================================
           ADD PROJECT
        ===================================== */

        if (addProjectButton && addProjectContainer) {

            addProjectButton.addEventListener(
                "click",
                function () {

                    if (!isAdminEnabled()) {
                        return;
                    }

                    addProjectContainer.hidden =
                        !addProjectContainer.hidden;

                    addProjectButton.setAttribute(
                        "aria-expanded",
                        String(!addProjectContainer.hidden)
                    );

                    if (!addProjectContainer.hidden) {

                        addProjectContainer.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }

        /* =====================================
           VIDEO UPLOAD
        ===================================== */

        if (
            uploadVideoButton &&
            demoReelUploadContainer
        ) {

            uploadVideoButton.addEventListener(
                "click",
                function () {

                    if (!isAdminEnabled()) {
                        return;
                    }

                    demoReelUploadContainer.hidden =
                        !demoReelUploadContainer.hidden;

                    uploadVideoButton.setAttribute(
                        "aria-expanded",
                        String(!demoReelUploadContainer.hidden)
                    );

                    if (!demoReelUploadContainer.hidden) {

                        demoReelUploadContainer.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

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

                    if (
                        typeof AccountStatus.saveStatus === "function"
                    ) {

                        AccountStatus.saveStatus();

                    }

                    updatePage();

                    notifyAdminModeChanged();

                }
            );

        }

        /* =====================================
           LISTEN FOR ADMIN MODE CHANGES
        ===================================== */

        window.addEventListener(
            "adminModeChanged",
            updatePage
        );

        /* =====================================
           LISTEN FOR ACCOUNT STATUS CHANGES
        ===================================== */

        window.addEventListener(
            "accountStatusChanged",
            function () {

                updatePage();

                notifyAdminModeChanged();

            }
        );

        /* =====================================
           INITIALIZE
        ===================================== */

        updatePage();

        notifyAdminModeChanged();

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
