
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       GET HTML ELEMENTS
    ===================================== */

    const signInForm =
        document.getElementById("signInForm");

    const signInButton =
        signInForm?.querySelector(".account-button");

    const usernameInput =
        document.getElementById("signInEmail");

    const passwordInput =
        document.getElementById("signInPassword");


    /* =====================================
       CHECK ELEMENTS
    ===================================== */

    if (
        !signInForm ||
        !signInButton ||
        !usernameInput ||
        !passwordInput
    ) {

        console.error(
            "[SIGN IN] FAIL: Required elements not found."
        );

        return;

    }


    /* =====================================
       CONFIGURATION
    ===================================== */

    const ACCOUNT_FILE = "./account.json";

    let signInInProgress = false;


    /* =====================================
       CREATE MESSAGE
    ===================================== */

    const message = document.createElement("p");

    message.id = "loginMessage";

    Object.assign(message.style, {

        display: "none",
        width: "100%",
        margin: "0",
        padding: "10px",
        borderRadius: "6px",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: "bold",
        lineHeight: "1.5",
        boxSizing: "border-box"

    });

    passwordInput.insertAdjacentElement(
        "afterend",
        message
    );


    /* =====================================
       DISPLAY MESSAGE
    ===================================== */

    function showMessage(text, success = false) {

        message.textContent = text;

        message.style.display = "block";

        message.style.color =
            success ? "#55e58a" : "#ff5555";

        message.style.background =
            success
                ? "rgba(40, 180, 90, 0.12)"
                : "rgba(220, 50, 50, 0.12)";

        message.style.border =
            success
                ? "1px solid rgba(85, 229, 138, 0.35)"
                : "1px solid rgba(255, 85, 85, 0.35)";

        message.setAttribute(
            "role",
            success ? "status" : "alert"
        );

    }


    /* =====================================
       CLEAR MESSAGE
    ===================================== */

    function clearMessage() {

        message.textContent = "";

        message.style.display = "none";

    }


    /* =====================================
       CHECK ACCOUNT
    ===================================== */

    async function checkAccount() {

        if (signInInProgress) {
            return;
        }

        signInInProgress = true;

        clearMessage();


        /* =================================
           GET INPUT VALUES
        ================================= */

        const username =
            usernameInput.value.trim().toLowerCase();

        const password =
            passwordInput.value;


        /* =================================
           CHECK USERNAME
        ================================= */

        if (!username) {

            showMessage(
                "Please enter your username or email."
            );

            signInInProgress = false;

            return;

        }


        /* =================================
           CHECK PASSWORD
        ================================= */

        if (!password) {

            showMessage(
                "Please enter your password."
            );

            signInInProgress = false;

            return;

        }


        /* =================================
           DISABLE BUTTON
        ================================= */

        signInButton.disabled = true;

        signInButton.textContent = "Checking...";


        try {

            /* =================================
               LOAD ACCOUNT JSON
            ================================= */

            console.log(
                "[SIGN IN] Loading account.json."
            );

            const response = await fetch(
                ACCOUNT_FILE,
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load account.json. HTTP " +
                    response.status
                );

            }


            /* =================================
               READ ACCOUNT DATA
            ================================= */

            const data = await response.json();

            if (!Array.isArray(data.accounts)) {

                throw new Error(
                    "Invalid account.json format."
                );

            }

            console.log(
                "[SIGN IN] Account file loaded."
            );


            /* =================================
               FIND ACCOUNT
            ================================= */

            const account = data.accounts.find(user => {

                const storedUsername =
                    String(user.username || "")
                        .trim()
                        .toLowerCase();

                const storedEmail =
                    String(user.email || "")
                        .trim()
                        .toLowerCase();

                return (
                    storedUsername === username ||
                    storedEmail === username
                );

            });


            /* =================================
               CHECK ACCOUNT EXISTS
            ================================= */

            if (!account) {

                console.error(
                    "[SIGN IN] Account not found."
                );

                showMessage(
                    "Username or email not found."
                );

                return;

            }


            /* =================================
               CHECK PASSWORD

               NO ACCOUNT STATUS CHANGES
               BEFORE THIS CHECK SUCCEEDS.
            ================================= */

            if (account.password !== password) {

                console.error(
                    "[SIGN IN] Incorrect password."
                );

                showMessage(
                    "Incorrect password."
                );

                return;

            }

            console.log(
                "[SIGN IN] Password verified."
            );


            /* =================================
               CHECK SET SIGN IN
            ================================= */

            if (
                !window.SetSignIn ||
                typeof window.SetSignIn.setSignIn !==
                "function"
            ) {

                throw new Error(
                    "SetSignIn is not loaded."
                );

            }


            /* =================================
               SET SIGNED-IN ACCOUNT

               ONLY AFTER PASSWORD SUCCESS
            ================================= */

            const signInSuccessful =
                window.SetSignIn.setSignIn({

                    username: account.username,

                    isAdmin: account.isAdmin === true

                });

            if (!signInSuccessful) {

                throw new Error(
                    "Unable to update account status."
                );

            }


            /* =================================
               CHECK ACCOUNT TYPE
            ================================= */

            if (account.isAdmin === true) {

                console.log(
                    "[SIGN IN] Administrator login successful."
                );

                showMessage(
                    "Administrator login successful!",
                    true
                );

            } else {

                console.log(
                    "[SIGN IN] Normal account login successful."
                );

                showMessage(
                    "Login successful! Welcome, " +
                    account.username + ".",
                    true
                );

            }


            /* =================================
               CHECK COMPLETE
            ================================= */

            console.log(
                "[SIGN IN] Account status successfully updated."
            );

            console.log(
                "[SIGN IN] Username:",
                account.username
            );

            console.log(
                "[SIGN IN] Signed In: true"
            );

            console.log(
                "[SIGN IN] Administrator:",
                account.isAdmin === true
            );


        } catch (error) {

            console.error(
                "[SIGN IN] FAIL:",
                error
            );

            showMessage(
                "Sign-in failed: " + error.message
            );

        } finally {

            signInInProgress = false;

            signInButton.disabled = false;

            signInButton.textContent = "Sign In";

        }

    }


    /* =====================================
       CLEAR MESSAGE WHEN TYPING
    ===================================== */

    usernameInput.addEventListener(
        "input",
        clearMessage
    );

    passwordInput.addEventListener(
        "input",
        clearMessage
    );


    /* =====================================
       SIGN IN BUTTON
    ===================================== */

    signInButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            checkAccount();

        }
    );


    /* =====================================
       PREVENT FORM SUBMISSION
    ===================================== */

    signInForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            checkAccount();

        }
    );


    /* =====================================
       INITIALIZATION
    ===================================== */

    console.log(
        "[SIGN IN] Sign-in controller initialized."
    );

});
