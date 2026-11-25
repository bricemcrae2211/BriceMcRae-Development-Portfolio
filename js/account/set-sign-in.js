
"use strict";

/* =========================================
   ACCOUNT STATUS AND SIGN-IN

   This file replaces:
   - account-status.js
   - save-account-status.js

   RESPONSIBILITIES:
   - Maintain account status.
   - Save account status in localStorage.
   - Restore account status after reload.
   - Set username and administrator status.
   - Synchronize the account iframe and portfolio.
   - Notify other scripts when account status changes.
========================================= */

(function () {

    const STORAGE_KEY = "portfolioAccountStatus";


    /* =====================================
       CREATE ACCOUNT STATUS
    ===================================== */

    function createDefaultStatus() {

        return {
            isSignedIn: false,
            isadmin: false,
            isanadmin: false,
            username: ""
        };

    }


    /* =====================================
       LOAD SAVED ACCOUNT STATUS
    ===================================== */

    function loadAccountStatus() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return createDefaultStatus();
            }

            const account = JSON.parse(saved);

            if (
                !account ||
                typeof account !== "object"
            ) {
                return createDefaultStatus();
            }

            const isSignedIn =
                account.isSignedIn === true;

            const isAdmin =
                account.isadmin === true ||
                account.isanadmin === true;

            const username =
                isSignedIn
                    ? String(account.username || "").trim()
                    : "";

            return {

                isSignedIn:
                    isSignedIn && username.length > 0,

                isadmin:
                    isSignedIn && isAdmin,

                isanadmin:
                    isSignedIn && isAdmin,

                username:
                    isSignedIn && username
                        ? username
                        : ""

            };

        } catch (error) {

            console.error(
                "[ACCOUNT STATUS] Unable to load saved status:",
                error
            );

            return createDefaultStatus();

        }

    }


    /* =====================================
       ACCOUNT STATUS OBJECT
    ===================================== */

    const savedStatus = loadAccountStatus();

    const AccountStatus = {

        isSignedIn: savedStatus.isSignedIn,

        isadmin: savedStatus.isadmin,

        isanadmin: savedStatus.isanadmin,

        username: savedStatus.username,


        /* =================================
           SAVE STATUS
        ================================= */

        save: function () {

            const account = {

                isSignedIn:
                    this.isSignedIn === true,

                isadmin:
                    this.isadmin === true,

                isanadmin:
                    this.isanadmin === true,

                username:
                    this.username

            };

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(account)
                );

                return true;

            } catch (error) {

                console.error(
                    "[ACCOUNT STATUS] Unable to save status:",
                    error
                );

                return false;

            }

        },


        /* =================================
           NOTIFY OTHER SCRIPTS
        ================================= */

        notifyChange: function () {

            this.save();

            window.dispatchEvent(
                new Event("accountStatusChanged")
            );

        },


        /* =================================
           SET COMPLETE ACCOUNT
        ================================= */

        setAccount: function (username, isAdmin) {

            const cleanUsername =
                String(username || "").trim();

            if (!cleanUsername) {

                throw new Error(
                    "A username is required."
                );

            }

            this.username = cleanUsername;

            this.isSignedIn = true;

            this.isadmin = isAdmin === true;

            this.isanadmin = isAdmin === true;

            this.notifyChange();

            return true;

        },


        /* =================================
           SET USERNAME
        ================================= */

        setUsername: function (username) {

            this.username =
                String(username || "").trim();

            this.notifyChange();

        },


        /* =================================
           SET ADMIN STATUS
        ================================= */

        setAdmin: function (isAdmin) {

            this.isadmin = isAdmin === true;

            this.isanadmin = isAdmin === true;

            this.notifyChange();

        },


        /* =================================
           SET SIGNED-IN STATUS
        ================================= */

        setSignedIn: function (isSignedIn) {

            this.isSignedIn =
                isSignedIn === true;

            if (!this.isSignedIn) {

                this.username = "";

                this.isadmin = false;

                this.isanadmin = false;

            }

            this.notifyChange();

        },


        /* =================================
           CLEAR ACCOUNT
        ================================= */

        clear: function () {

            this.isSignedIn = false;

            this.isadmin = false;

            this.isanadmin = false;

            this.username = "";

            this.notifyChange();

        },


        /* =================================
           RESTORE SAVED ACCOUNT
        ================================= */

        load: function () {

            const account = loadAccountStatus();

            this.isSignedIn =
                account.isSignedIn;

            this.isadmin =
                account.isadmin;

            this.isanadmin =
                account.isanadmin;

            this.username =
                account.username;

            window.dispatchEvent(
                new Event("accountStatusChanged")
            );

            return account;

        }

    };


    /* =====================================
       PUBLISH ACCOUNT STATUS
    ===================================== */

    window.AccountStatus = AccountStatus;


    /* =====================================
       SET SIGNED-IN ACCOUNT
    ===================================== */

    function setSignIn(account) {

        try {

            if (
                !account ||
                typeof account !== "object"
            ) {

                throw new Error(
                    "Invalid account information."
                );

            }

            const username =
                String(account.username || "").trim();

            if (!username) {

                throw new Error(
                    "Account username is missing."
                );

            }

            const isAdmin =
                account.isAdmin === true;


            /* =================================
               UPDATE LOCAL ACCOUNT STATUS

               Called only after password success.
            ================================= */

            AccountStatus.setAccount(
                username,
                isAdmin
            );


            /* =================================
               NOTIFY PORTFOLIO PARENT
            ================================= */

            if (window.parent !== window) {

                window.parent.postMessage(

                    {
                        type: "accountSignedIn",

                        account: {
                            username: username,
                            isAdmin: isAdmin
                        }
                    },

                    window.location.origin

                );

            }


            console.log(
                "[SET SIGN IN] Account signed in."
            );

            console.log(
                "[SET SIGN IN] Username:",
                username
            );

            console.log(
                "[SET SIGN IN] Administrator:",
                isAdmin
            );

            return true;

        } catch (error) {

            console.error(
                "[SET SIGN IN] FAILED:",
                error
            );

            return false;

        }

    }


    /* =====================================
       PORTFOLIO MESSAGE RECEIVER

       Runs only on the main portfolio page.
    ===================================== */

    if (window.parent === window) {

        window.addEventListener(
            "message",
            function (event) {

                if (
                    event.origin !== window.location.origin
                ) {
                    return;
                }

                const accountFrame =
                    document.getElementById("accountFrame");

                if (
                    !accountFrame ||
                    event.source !== accountFrame.contentWindow
                ) {
                    return;
                }

                if (
                    !event.data ||
                    event.data.type !== "accountSignedIn"
                ) {
                    return;
                }

                const account =
                    event.data.account;

                if (
                    !account ||
                    !account.username
                ) {
                    return;
                }

                try {

                    AccountStatus.setAccount(
                        account.username,
                        account.isAdmin === true
                    );

                    console.log(
                        "[SET SIGN IN] Portfolio account synchronized."
                    );

                } catch (error) {

                    console.error(
                        "[SET SIGN IN] Portfolio update failed:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================
       SYNCHRONIZE OTHER BROWSER TABS
    ===================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key !== STORAGE_KEY) {
                return;
            }

            AccountStatus.load();

        }
    );


    /* =====================================
       PUBLIC SIGN-IN API
    ===================================== */

    window.SetSignIn = {

        setSignIn: setSignIn

    };


    /* =====================================
       INITIALIZATION
    ===================================== */

    console.log(
        "[ACCOUNT STATUS] Initialized."
    );

    console.log(
        "[ACCOUNT STATUS] Signed In:",
        AccountStatus.isSignedIn
    );

    console.log(
        "[ACCOUNT STATUS] Username:",
        AccountStatus.username
    );

    console.log(
        "[ACCOUNT STATUS] Administrator:",
        AccountStatus.isadmin
    );

})();
