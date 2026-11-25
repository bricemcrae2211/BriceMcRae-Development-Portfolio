
"use strict";

/* =========================================================
   ACCOUNT WINDOW EXIT SYSTEM
========================================================= */

(function () {

    function initializeAccountExit() {

        const closeButton =
            document.getElementById("closeAccount");

        if (!closeButton) {

            console.error(
                "[ACCOUNT EXIT] Cannot find #closeAccount."
            );

            return;

        }

        if (closeButton.dataset.exitConnected === "true") {
            return;
        }

        closeButton.dataset.exitConnected = "true";

        /* =================================================
           FIND AND CLOSE THE WINDOW CONTAINING THIS ACCOUNT
        ================================================= */

        function closeAccountWindow() {

            console.log(
                "[ACCOUNT EXIT] Closing current account window."
            );

            /* =============================================
               FIND CURRENT ACCOUNT DOCUMENT
            ============================================= */

            const currentDocument =
                closeButton.ownerDocument;

            const currentWindow =
                currentDocument.defaultView;

            /* =============================================
               FIND ACCOUNT IFRAME
            ============================================= */

            try {

                if (
                    currentWindow.frameElement
                ) {

                    const accountFrame =
                        currentWindow.frameElement;

                    const frameParent =
                        accountFrame.parentElement;

                    console.log(
                        "[ACCOUNT EXIT] Account iframe found.",
                        accountFrame
                    );

                    /* CLOSE THE FRAME'S OVERLAY CONTAINER */

                    const overlay =
                        accountFrame.closest(
                            "#accountOverlay, " +
                            ".account-overlay, " +
                            ".account-modal, " +
                            ".account-window"
                        );

                    if (overlay) {

                        overlay.remove();

                        console.log(
                            "[ACCOUNT EXIT] Account overlay removed."
                        );

                        return;

                    }

                    /* CLOSE THE FRAME ITSELF */

                    accountFrame.remove();

                    console.log(
                        "[ACCOUNT EXIT] Account iframe removed."
                    );

                    return;

                }

            } catch (error) {

                console.warn(
                    "[ACCOUNT EXIT] Could not remove account iframe.",
                    error
                );

            }

            /* =============================================
               STANDALONE ACCOUNT WINDOW
            ============================================= */

            const accountContainer =
                currentDocument.querySelector(
                    ".account-container"
                );

            if (accountContainer) {

                accountContainer.remove();

                console.log(
                    "[ACCOUNT EXIT] Account container removed."
                );

                return;

            }

            /* =============================================
               LAST RESORT
            ============================================= */

            currentDocument.body.replaceChildren();

            console.log(
                "[ACCOUNT EXIT] Current account document closed."
            );

        }

        /* =================================================
           CONNECT X BUTTON
        ================================================= */

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeAccountWindow();

            }
        );

        console.log(
            "[ACCOUNT EXIT] X button successfully connected."
        );

    }

    /* =====================================================
       STARTUP
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAccountExit,
            { once: true }
        );

    } else {

        initializeAccountExit();

    }

})();
