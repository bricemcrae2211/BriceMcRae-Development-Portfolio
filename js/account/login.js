
"use strict";

/* =========================================
   LOGIN
   js/account/login.js

   Supports:
   1. Local Node.js server
   2. GitHub Pages with external backend
========================================= */


/* =========================================
   ENVIRONMENT CONFIGURATION
========================================= */

const LOGIN_CONFIG = {

    /*
     * Local Node.js login endpoint.
     */

    localEndpoint: "/api/login",

    /*
     * GitHub Pages login endpoint.
     *
     * Replace this with your external backend
     * URL when that backend has been configured.
     */

    githubEndpoint: "",

};


/* =========================================
   DETECT ENVIRONMENT
========================================= */

function getLoginEndpoint() {

    const hostname = window.location.hostname;

    const isLocalServer =
        hostname === "localhost" ||
        hostname === "127.0.0.1";

    if (isLocalServer) {

        return LOGIN_CONFIG.localEndpoint;

    }

    /*
     * GitHub Pages or another hosted website.
     */

    if (LOGIN_CONFIG.githubEndpoint) {

        return LOGIN_CONFIG.githubEndpoint;

    }

    return null;

}


/* =========================================
   INITIALIZE LOGIN
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const signInForm =
        document.getElementById("signInForm");

    const signInEmail =
        document.getElementById("signInEmail");

    const signInPassword =
        document.getElementById("signInPassword");

    const signInButton =
        signInForm?.querySelector(".account-button");


    /* =====================================
       CHECK ELEMENTS
    ===================================== */

    if (
        !signInForm ||
        !signInEmail ||
        !signInPassword ||
        !signInButton
    ) {

        console.error(
            "[LOGIN] Login elements are missing."
        );

        return;

    }


    /* =====================================
       LOGIN MESSAGE
    ===================================== */

    let loginMessage =
        document.getElementById("loginMessage");

    if (!loginMessage) {

        loginMessage =
            document.createElement("p");

        loginMessage.id = "loginMessage";

        loginMessage.style.marginTop = "12px";
        loginMessage.style.textAlign = "center";
        loginMessage.style.color = "#ff7777";

        signInForm.appendChild(loginMessage);

    }


    /* =====================================
       LOGIN STATE
    ===================================== */

    let loginInProgress = false;


    /* =====================================
       LOGIN
    ===================================== */

    async function login() {

        if (loginInProgress) {
            return;
        }

        const loginValue =
            signInEmail.value.trim();

        const password =
            signInPassword.value;

        loginMessage.textContent = "";


        /* =================================
           VALIDATE INPUT
        ================================= */

        if (!loginValue || !password) {

            loginMessage.textContent =
                "Enter your username/email and password.";

            return;

        }


        /* =================================
           GET ENDPOINT
        ================================= */

        const loginEndpoint =
            getLoginEndpoint();

        if (!loginEndpoint) {

            loginMessage.textContent =
                "Online authentication has not been configured yet.";

            console.error(
                "[LOGIN] No hosted authentication endpoint configured."
            );

            return;

        }


        /* =================================
           START LOGIN
        ================================= */

        loginInProgress = true;

        signInButton.disabled = true;

        signInButton.textContent =
            "Signing In...";


        try {

            /* =================================
               SEND LOGIN REQUEST
            ================================= */

            const response = await fetch(
                loginEndpoint,
                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        login: loginValue,

                        password: password

                    })

                }
            );


            /* =================================
               READ RESPONSE
            ================================= */

            const data = await response.json();


            /* =================================
               CHECK LOGIN RESULT
            ================================= */

            if (
                !response.ok ||
                !data.success ||
                !data.account
            ) {

                loginMessage.textContent =
                    data.message ||
                    "Incorrect username/email or password.";

                return;

            }


            /* =================================
               VALIDATE ACCOUNT DATA
            ================================= */

            if (
                typeof data.account.username !== "string" ||
                !data.account.username.trim()
            ) {

                loginMessage.textContent =
                    "The server returned invalid account information.";

                return;

            }


            /* =================================
               SEND LOGIN TO PARENT
            ================================= */

            if (window.parent !== window) {

                window.parent.postMessage(

                    {

                        type: "LOGIN_SUCCESS",

                        username:
                            data.account.username,

                        isAdmin:
                            data.account.isAdmin === true,

                        accountId:
                            data.account.accountId

                    },

                    window.location.origin

                );

            }


            /* =================================
               CLEAR LOGIN FIELDS
            ================================= */

            signInEmail.value = "";

            signInPassword.value = "";


            console.log(
                "[LOGIN] Login successful."
            );


        } catch (error) {

            console.error(
                "[LOGIN ERROR]",
                error
            );

            loginMessage.textContent =
                "Unable to connect to the authentication server.";

        } finally {

            loginInProgress = false;

            signInButton.disabled = false;

            signInButton.textContent =
                "Sign In";

        }

    }


    /* =====================================
       BUTTON
    ===================================== */

    signInButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            login();

        }
    );


    /* =====================================
       FORM SUBMISSION
    ===================================== */

    signInForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            login();

        }
    );


    /* =====================================
       ENVIRONMENT DEBUG
    ===================================== */

    console.log(
        "[LOGIN] Environment:",
        window.location.hostname
    );

    console.log(
        "[LOGIN] Endpoint:",
        getLoginEndpoint() || "Not configured"
    );

});
