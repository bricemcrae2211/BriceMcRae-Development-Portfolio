
"use strict";

/* =========================================
   ACCOUNT EXIT CONTROLLER

   Responsibilities:
   - Close the entire parent account overlay.
   - Work inside an account iframe.
   - Prevent accidental page navigation.
   - Provide a fallback when not inside an iframe.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENT REFERENCES
    ===================================== */

    const closeButton =
        document.getElementById("closeAccount");


    if (!closeButton) {

        console.error(
            "[ACCOUNT EXIT] Close button not found."
        );

        return;

    }


    /* =====================================
       CLOSE ACCOUNT
    ===================================== */

    function closeAccount() {

        console.log(
            "[ACCOUNT EXIT] Closing account window."
        );


        /* =================================
           CHECK FOR PARENT WINDOW
        ================================= */

        if (window.parent !== window) {

            try {

                window.parent.postMessage(
                    "CLOSE_ACCOUNT_OVERLAY",
                    window.location.origin
                );

                console.log(
                    "[ACCOUNT EXIT] Close message sent to parent."
                );

                return;

            } catch (error) {

                console.error(
                    "[ACCOUNT EXIT] Parent communication failed.",
                    error
                );

            }

        }


        /* =================================
           FALLBACK

           If this page is not inside an
           iframe, hide its account container.
        ================================= */

        const accountContainer =
            document.querySelector(".account-container");

        if (accountContainer) {

            accountContainer.hidden = true;

        }

    }


    /* =====================================
       CLOSE BUTTON EVENT
    ===================================== */

    closeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            closeAccount();

        }
    );


    console.log(
        "[ACCOUNT EXIT] Initialized."
    );

});
