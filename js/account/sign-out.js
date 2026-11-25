
"use strict";

/* =========================================
   SIGN OUT
   js/account/sign-out.js

   Responsibilities:
   - Detect Sign Out button clicks.
   - Set signed-in status to false.
   - Update account button.
   - Close account overlay.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const accountButton =
        document.getElementById("accountButton");

    const accountOverlay =
        document.getElementById("accountOverlay");

    if (!accountButton || !accountOverlay) {

        console.error("[SIGN OUT] Account elements not found.");

        return;

    }


    /* =====================================
       SIGN OUT
    ===================================== */

    function signOut() {

        if (!window.AccountStatus?.isSignedIn) {
            return;
        }

        /* SET ACCOUNT AS SIGNED OUT */

        window.AccountStatus.setSignedIn(false);


        /* CLOSE ACCOUNT OVERLAY */

        accountOverlay.classList.remove("open");

        accountOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "account-overlay-open"
        );


        /* UPDATE ACCOUNT BUTTON */

        accountButton.textContent = "Sign In";


        console.log("[SIGN OUT] Account signed out.");

    }


    /* =====================================
       ACCOUNT BUTTON
    ===================================== */

    accountButton.addEventListener(
        "click",
        function () {

            if (window.AccountStatus?.isSignedIn === true) {

                signOut();

            }

        }
    );

});
