
"use strict";

/* =========================================
   ACCOUNT STATUS

   RESPONSIBILITIES:
   - Store signed-in status.
   - Store administrator status.
   - Store account username.
   - Save account status in localStorage.
   - Restore account status after page reload.
   - Synchronize account status between pages.
   - Notify other scripts when status changes.

   Does not control buttons.
========================================= */

(function () {

    /* =====================================
       CONFIGURATION
    ===================================== */

    const STORAGE_KEY = "portfolioAccountStatus";


    /* =====================================
       ACCOUNT STATUS
    ===================================== */

    const AccountStatus = {

        /* =====================================
           ACCOUNT INFORMATION
        ===================================== */

        isSignedIn: false,

        isadmin: false,

        isanadmin: false,

        username: "",


        /* =====================================
           SAVE ACCOUNT STATUS
        ===================================== */

        saveStatus() {

            const accountData = {

                isSignedIn: this.isSignedIn,

                isadmin: this.isadmin,

                isanadmin: this.isanadmin,

                username: this.username

            };

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(accountData)
                );

                console.log(
                    "[ACCOUNT STATUS] Status saved."
                );

            } catch (error) {

                console.error(
                    "[ACCOUNT STATUS] Failed to save status.",
                    error
                );

            }

        },


        /* =====================================
           LOAD ACCOUNT STATUS
        ===================================== */

        loadStatus() {

            try {

                const storedData =
                    localStorage.getItem(STORAGE_KEY);

                if (!storedData) {

                    console.log(
                        "[ACCOUNT STATUS] No saved account found."
                    );

                    return;

                }

                const accountData =
                    JSON.parse(storedData);

                if (
                    !accountData ||
                    typeof accountData !== "object"
                ) {

                    throw new Error(
                        "Invalid saved account data."
                    );

                }

                this.isSignedIn =
                    accountData.isSignedIn === true;

                this.isadmin =
                    this.isSignedIn &&
                    accountData.isadmin === true;

                this.isanadmin =
                    this.isadmin;

                this.username =
                    this.isSignedIn
                        ? String(accountData.username || "")
                        : "";

                if (!this.username) {

                    this.isSignedIn = false;

                    this.isadmin = false;

                    this.isanadmin = false;

                }

                console.log(
                    "[ACCOUNT STATUS] Saved status restored."
                );

                console.log(
                    "[ACCOUNT STATUS] Signed in:",
                    this.isSignedIn
                );

                console.log(
                    "[ACCOUNT STATUS] Username:",
                    this.username
                );

                console.log(
                    "[ACCOUNT STATUS] Administrator:",
                    this.isadmin
                );

            } catch (error) {

                console.error(
                    "[ACCOUNT STATUS] Failed to load saved status.",
                    error
                );

                this.isSignedIn = false;

                this.isadmin = false;

                this.isanadmin = false;

                this.username = "";

                try {

                    localStorage.removeItem(STORAGE_KEY);

                } catch (storageError) {

                    console.error(storageError);

                }

            }

        },


        /* =====================================
           SET SIGNED-IN STATUS
        ===================================== */

        setSignedIn(value) {

            this.isSignedIn = Boolean(value);

            if (!this.isSignedIn) {

                this.isadmin = false;

                this.isanadmin = false;

                this.username = "";

            }

            this.notifyChange();

        },


        /* =====================================
           SET ADMIN STATUS
        ===================================== */

        setAdmin(value) {

            this.isadmin = Boolean(value);

            this.isanadmin = this.isadmin;

            this.notifyChange();

        },


        /* =====================================
           SET ADMINISTRATOR STATUS
        ===================================== */

        setAdministrator(value) {

            this.isanadmin = Boolean(value);

            this.isadmin = this.isanadmin;

            this.notifyChange();

        },


        /* =====================================
           SET USERNAME
        ===================================== */

        setUsername(value) {

            this.username = String(value || "");

            this.notifyChange();

        },


        /* =====================================
           SET COMPLETE ACCOUNT
        ===================================== */

        setAccount(username, isAdmin) {

            this.username =
                String(username || "").trim();

            this.isadmin =
                isAdmin === true;

            this.isanadmin =
                this.isadmin;

            this.isSignedIn =
                this.username.length > 0;

            if (!this.isSignedIn) {

                this.isadmin = false;

                this.isanadmin = false;

            }

            this.notifyChange();

            console.log(
                "[ACCOUNT STATUS] Account updated."
            );

            console.log(
                "[ACCOUNT STATUS] Username:",
                this.username
            );

            console.log(
                "[ACCOUNT STATUS] Signed in:",
                this.isSignedIn
            );

            console.log(
                "[ACCOUNT STATUS] Administrator:",
                this.isadmin
            );

        },


        /* =====================================
           CLEAR ACCOUNT
        ===================================== */

        clearAccount() {

            this.isSignedIn = false;

            this.isadmin = false;

            this.isanadmin = false;

            this.username = "";

            try {

                localStorage.removeItem(STORAGE_KEY);

            } catch (error) {

                console.error(
                    "[ACCOUNT STATUS] Failed to clear storage.",
                    error
                );

            }

            this.notifyChange();

            console.log(
                "[ACCOUNT STATUS] Account cleared."
            );

        },


        /* =====================================
           NOTIFY OTHER SCRIPTS
        ===================================== */

        notifyChange() {

            this.saveStatus();

            window.dispatchEvent(
                new Event("accountStatusChanged")
            );

        }

    };


    /* =====================================
       RESTORE SAVED ACCOUNT
    ===================================== */

    AccountStatus.loadStatus();


    /* =====================================
       SYNCHRONIZE OTHER PAGES

       Allows the account iframe and portfolio
       page to share account status.
    ===================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key !== STORAGE_KEY) {
                return;
            }

            if (!event.newValue) {

                AccountStatus.isSignedIn = false;

                AccountStatus.isadmin = false;

                AccountStatus.isanadmin = false;

                AccountStatus.username = "";

            } else {

                try {

                    const accountData =
                        JSON.parse(event.newValue);

                    AccountStatus.isSignedIn =
                        accountData.isSignedIn === true;

                    AccountStatus.isadmin =
                        AccountStatus.isSignedIn &&
                        accountData.isadmin === true;

                    AccountStatus.isanadmin =
                        AccountStatus.isadmin;

                    AccountStatus.username =
                        AccountStatus.isSignedIn
                            ? String(accountData.username || "")
                            : "";

                } catch (error) {

                    console.error(
                        "[ACCOUNT STATUS] Synchronization failed.",
                        error
                    );

                }

            }

            window.dispatchEvent(
                new Event("accountStatusChanged")
            );

            console.log(
                "[ACCOUNT STATUS] Synchronized from another page."
            );

        }
    );


    /* =====================================
       REGISTER GLOBAL ACCOUNT STATUS
    ===================================== */

    window.AccountStatus = AccountStatus;


    /* =====================================
       INITIALIZATION
    ===================================== */

    console.log(
        "[ACCOUNT STATUS] Initialized."
    );

    console.log(
        "[ACCOUNT STATUS] Signed in:",
        AccountStatus.isSignedIn
    );

})();
