    "use strict";

    /* =========================================
    NORMAL ACCOUNT SIGN-UP
    NON-ADMIN ACCOUNTS ONLY
    ========================================= */

    document.addEventListener("DOMContentLoaded", function () {

        const signUpForm =
            document.getElementById("signUpForm");

        const usernameInput =
            document.getElementById("signUpUsername");

        const emailInput =
            document.getElementById("signUpEmail");

        const passwordInput =
            document.getElementById("signUpPassword");

        const confirmPasswordInput =
            document.getElementById("confirmPassword");

        if (
            !signUpForm ||
            !usernameInput ||
            !emailInput ||
            !passwordInput ||
            !confirmPasswordInput
        ) {

            console.error(
                "[SIGN-UP] Normal sign-up elements not found."
            );

            return;

        }


        /* =========================================
        SIGN-UP MESSAGE
        ========================================= */

        let signUpMessage =
            document.getElementById("signUpMessage");

        if (!signUpMessage) {

            signUpMessage = document.createElement("div");

            signUpMessage.id = "signUpMessage";

            signUpMessage.style.marginTop = "12px";
            signUpMessage.style.textAlign = "center";
            signUpMessage.style.fontSize = "14px";

            signUpForm.appendChild(signUpMessage);

        }


        function showMessage(message, success) {

            signUpMessage.textContent = message;

            signUpMessage.style.color =
                success ? "#4caf50" : "#ff5555";

        }


        /* =========================================
        NORMAL ACCOUNT SUBMISSION
        ========================================= */

        signUpForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const username =
                usernameInput.value.trim();

            const email =
                emailInput.value.trim().toLowerCase();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            /* =========================================
            VALIDATION
            ========================================= */

            if (
                !username ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "Please fill in every field.",
                    false
                );

                return;

            }


            if (username.length < 3) {

                showMessage(
                    "Username must be at least 3 characters.",
                    false
                );

                return;

            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ) {

                showMessage(
                    "Please enter a valid email address.",
                    false
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "Password must be at least 6 characters.",
                    false
                );

                return;

            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    false
                );

                return;

            }


            /* =========================================
            SUBMIT BUTTON
            ========================================= */

            const submitButton =
                signUpForm.querySelector('button[type="submit"]');

            const originalButtonText =
                submitButton ? submitButton.textContent : "";

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Account...";

            }


            showMessage(
                "Creating your account...",
                true
            );


            /* =========================================
            SEND NORMAL ACCOUNT TO SERVER
            ========================================= */

            try {

                const response = await fetch("/api/signup", {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        username: username,

                        email: email,

                        password: password,

                        /* NEVER CREATE ADMIN THROUGH NORMAL SIGN-UP */

                        isAdmin: false

                    })

                });


                const data = await response.json();


                /* =========================================
                SERVER RESPONSE
                ========================================= */

                if (
                    !response.ok ||
                    data.success !== true
                ) {

                    showMessage(

                        data.message ||
                        data.error ||
                        "Account creation failed.",

                        false

                    );

                    return;

                }


                /* =========================================
                SUCCESS
                ========================================= */

                showMessage(

                    "Account created successfully! You can now sign in.",

                    true

                );


                signUpForm.reset();


                console.log(
                    "[SIGN-UP] Normal account created.",
                    data.account
                );


                /* =========================================
                RETURN TO SIGN-IN
                ========================================= */

                const showSignInButton =
                    document.getElementById("showSignIn");

                if (showSignInButton) {

                    setTimeout(function () {

                        showSignInButton.click();

                    }, 1200);

                }


            } catch (error) {

                console.error(
                    "[SIGN-UP] Server error:",
                    error
                );

                showMessage(

                    "Could not connect to the server.",

                    false

                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        });


        console.log(
            "[SIGN-UP] Normal sign-up connected to /api/signup."
        );

    });