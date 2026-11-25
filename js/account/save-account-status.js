
"use strict";

/* =========================================
   SAVE ACCOUNT STATUS

   RESPONSIBILITIES:
   - Save account status in browser cookies.
   - Save username.
   - Save administrator status.
   - Load saved account status.
   - Clear saved account cookies.

   Does not control buttons.
========================================= */

(function () {

    const COOKIE_NAME = "portfolioAccountStatus";

    const COOKIE_DAYS = 30;


    /* =====================================
       SAVE ACCOUNT STATUS
    ===================================== */

    function saveAccountStatus(account) {

        try {

            const accountData = {

                isSignedIn: account.isSignedIn === true,

                isadmin: account.isadmin === true,

                isanadmin: account.isadmin === true,

                username: String(account.username || "")

            };

            const cookieValue = encodeURIComponent(
                JSON.stringify(accountData)
            );

            const expiration = new Date();

            expiration.setTime(
                expiration.getTime() +
                COOKIE_DAYS * 24 * 60 * 60 * 1000
            );

            document.cookie =
                COOKIE_NAME + "=" + cookieValue +
                "; expires=" + expiration.toUTCString() +
                "; path=/; SameSite=Lax";

            console.log(
                "[ACCOUNT COOKIE] Account status saved."
            );

            return true;

        } catch (error) {

            console.error(
                "[ACCOUNT COOKIE] Failed to save account.",
                error
            );

            return false;

        }

    }


    /* =====================================
       LOAD ACCOUNT STATUS
    ===================================== */

    function loadAccountStatus() {

        try {

            const cookies =
                document.cookie.split(";");

            const accountCookie = cookies.find(cookie => {

                return cookie.trim().startsWith(
                    COOKIE_NAME + "="
                );

            });

            if (!accountCookie) {

                return null;

            }

            const cookieValue =
                accountCookie.trim().substring(
                    COOKIE_NAME.length + 1
                );

            const accountData = JSON.parse(
                decodeURIComponent(cookieValue)
            );

            if (
                !accountData ||
                typeof accountData !== "object"
            ) {

                return null;

            }

            const isSignedIn =
                accountData.isSignedIn === true &&
                Boolean(accountData.username);

            return {

                isSignedIn: isSignedIn,

                isadmin:
                    isSignedIn &&
                    accountData.isadmin === true,

                isanadmin:
                    isSignedIn &&
                    accountData.isadmin === true,

                username:
                    isSignedIn
                        ? String(accountData.username)
                        : ""

            };

        } catch (error) {

            console.error(
                "[ACCOUNT COOKIE] Failed to load account.",
                error
            );

            return null;

        }

    }


    /* =====================================
       CLEAR ACCOUNT STATUS
    ===================================== */

    function clearAccountStatus() {

        document.cookie =
            COOKIE_NAME +
            "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

        console.log(
            "[ACCOUNT COOKIE] Account status cleared."
        );

    }


    /* =====================================
       REGISTER PUBLIC FUNCTIONS
    ===================================== */

    window.SaveAccountStatus = {

        save: saveAccountStatus,

        load: loadAccountStatus,

        clear: clearAccountStatus

    };


    console.log(
        "[ACCOUNT COOKIE] Initialized."
    );

})();
