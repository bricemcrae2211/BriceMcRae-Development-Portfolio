
/* =========================================
   ACCOUNT OVERLAY CONTROLLER

   - Opens account.html over the portfolio.
   - Closes account.html when requested.
   - Does not reload the portfolio.
========================================= */

(function () {

    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        const accountButton =
            document.getElementById("accountButton");

        const accountOverlay =
            document.getElementById("accountOverlay");

        const accountFrame =
            document.getElementById("accountFrame");


        if (!accountButton || !accountOverlay || !accountFrame) {
            return;
        }


        // OPEN ACCOUNT

        accountButton.addEventListener("click", function () {

            accountFrame.src = "../account/account.html";

            accountOverlay.hidden = false;

        });


        // CLOSE ACCOUNT

        window.addEventListener("message", function (event) {

            if (event.origin !== window.location.origin) {
                return;
            }

            if (event.source !== accountFrame.contentWindow) {
                return;
            }

            if (event.data === "closeAccount") {

                accountOverlay.hidden = true;

                accountFrame.src = "about:blank";

            }

        });

    });

})();
