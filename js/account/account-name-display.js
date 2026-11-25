
"use strict";

/* =========================================
   ACCOUNT NAME DISPLAY

   RESPONSIBILITIES:
   - Show the username when signed in.
   - Show "Name" when signed in but username is empty.
   - Show "Not Signed In" when signed out.
   - Update when AccountStatus changes.

   DOES NOT:
   - Sign users in.
   - Sign users out.
   - Change account status.
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const nameDisplay =
        document.getElementById("accountNameDisplay");


    /* =====================================
       CHECK HTML ELEMENT
    ===================================== */

    if (!nameDisplay) {

        console.error(
            "[ACCOUNT NAME] FAIL: Display element not found."
        );

        return;

    }


    /* =====================================
       UPDATE ACCOUNT NAME
    ===================================== */

    function updateAccountName() {

        const account = window.AccountStatus;


        /* =================================
           ACCOUNT STATUS NOT FOUND
        ================================= */

        if (!account) {

            nameDisplay.textContent = "Not Signed In";

            console.error(
                "[ACCOUNT NAME] AccountStatus not found."
            );

            return;

        }


        /* =================================
           SIGNED OUT
        ================================= */

        if (account.isSignedIn !== true) {

            nameDisplay.textContent = "Not Signed In";

            return;

        }


        /* =================================
           SIGNED IN

           SHOW USERNAME.
           IF EMPTY, SHOW "NAME".
        ================================= */

        const username =
            String(account.username || "").trim();

        if (username.length > 0) {

            nameDisplay.textContent = username;

        } else {

            nameDisplay.textContent = "Name";

        }

    }


    /* =====================================
       INITIAL UPDATE
    ===================================== */

    updateAccountName();


    /* =====================================
       LISTEN FOR STATUS CHANGES
    ===================================== */

    window.addEventListener(
        "accountStatusChanged",
        updateAccountName
    );


    console.log(
        "[ACCOUNT NAME] Display initialized."
    );

});
