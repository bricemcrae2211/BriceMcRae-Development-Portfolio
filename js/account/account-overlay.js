
"use strict";

/* =========================================
   ACCOUNT OVERLAY CONTROLLER
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const accountButton =
        document.getElementById("accountButton");

    const accountOverlay =
        document.getElementById("accountOverlay");

    const accountFrame =
        document.getElementById("accountFrame");


    if (!accountButton || !accountOverlay || !accountFrame) {

        console.error(
            "[ACCOUNT] Account overlay elements not found."
        );

        return;

    }


    let previousFocus = null;
    let overlayOpen = false;


    /* =====================================
       ACCOUNT STATUS
    ===================================== */

    function isSignedIn() {

        return window.AccountStatus?.isSignedIn === true;

    }


    /* =====================================
       UPDATE ACCOUNT BUTTON
    ===================================== */

    function updateAccountButton() {

        accountButton.textContent =
            isSignedIn() ? "Sign Out" : "Sign In";

    }


    /* =====================================
       OPEN OVERLAY
    ===================================== */

    function openAccountOverlay() {

        if (isSignedIn()) {
            return;
        }

        if (overlayOpen) {
            return;
        }

        previousFocus = document.activeElement;

        overlayOpen = true;

        accountOverlay.hidden = false;

        accountOverlay.classList.add("open");

        accountOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "account-overlay-open"
        );

        accountFrame.focus();

        console.log(
            "[ACCOUNT] Overlay opened."
        );

    }


    /* =====================================
       CLOSE ENTIRE OVERLAY
    ===================================== */

    function closeAccountOverlay() {

        overlayOpen = false;


        /* HIDE ENTIRE OVERLAY */

        accountOverlay.classList.remove("open");

        accountOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        accountOverlay.hidden = true;


        /* RESTORE BACKGROUND SCROLLING */

        document.body.classList.remove(
            "account-overlay-open"
        );


        /* RESET ACCOUNT PAGE */

        accountFrame.src =
            "../account/account.html";


        /* RESTORE FOCUS */

        if (
            previousFocus &&
            document.contains(previousFocus)
        ) {

            previousFocus.focus();

        }

        previousFocus = null;


        /* UPDATE BUTTON */

        updateAccountButton();


        console.log(
            "[ACCOUNT] Entire overlay closed."
        );

    }


    /* =====================================
       ACCOUNT BUTTON
    ===================================== */

    accountButton.addEventListener(
        "click",
        function () {

            if (isSignedIn()) {

                if (typeof window.AccountStatus?.setSignedIn === "function") {
                    window.AccountStatus.setSignedIn(false);
                }

                updateAccountButton();

                return;

            }

            openAccountOverlay();

        }
    );


    /* =====================================
       ESCAPE KEY
    ===================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                overlayOpen
            ) {

                closeAccountOverlay();

            }

        }
    );


    /* =====================================
       RECEIVE ACCOUNT MESSAGES
    ===================================== */

    window.addEventListener(
        "message",
        function (event) {

            if (
                event.origin !== window.location.origin
            ) {
                return;
            }

            if (
                event.source !== accountFrame.contentWindow
            ) {
                return;
            }


            /* CLOSE ENTIRE OVERLAY */

            if (
                event.data === "CLOSE_ACCOUNT_OVERLAY"
            ) {

                closeAccountOverlay();

                return;

            }


            /* SIGNED IN */

            if (
                event.data === "ACCOUNT_SIGNED_IN"
            ) {

                window.AccountStatus?.setSignedIn?.(true);

                closeAccountOverlay();

                return;

            }


            /* SIGNED OUT */

            if (
                event.data === "ACCOUNT_SIGNED_OUT"
            ) {

                window.AccountStatus?.setSignedIn?.(false);

                closeAccountOverlay();

            }

        }
    );


    /* =====================================
       ACCOUNT STATUS CHANGES
    ===================================== */

    window.addEventListener(
        "accountStatusChanged",
        function () {

            updateAccountButton();

            if (isSignedIn()) {

                closeAccountOverlay();

            }

        }
    );


    /* =====================================
       INITIALIZE
    ===================================== */

    function initializeAccountOverlay() {

        overlayOpen = false;

        accountOverlay.classList.remove("open");

        accountOverlay.hidden = true;

        accountOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "account-overlay-open"
        );

        updateAccountButton();

        console.log(
            "[ACCOUNT] Initialized."
        );

    }


    initializeAccountOverlay();


    /* =====================================
       PUBLIC CONTROLS
    ===================================== */

    window.AccountOverlay = {

        open: openAccountOverlay,

        close: closeAccountOverlay,

        isOpen: function () {

            return overlayOpen;

        }

    };

});
