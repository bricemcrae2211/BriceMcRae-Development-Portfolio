
/* =========================================
   ACCOUNT SETTINGS
========================================= */

const DEFAULT_ADMIN_PASSWORD = "1234567890";


/* =========================================
   ACCOUNT SECTIONS
========================================= */

const signInSection = document.getElementById("signInSection");
const signUpSection = document.getElementById("signUpSection");
const adminSignUpSection = document.getElementById("adminSignUpSection");


/* =========================================
   SECTION DISPLAY
========================================= */

function showAccountSection(section) {

    signInSection.hidden = section !== "signin";
    signUpSection.hidden = section !== "signup";
    adminSignUpSection.hidden = section !== "admin";

}


/* =========================================
   SHOW SIGN IN
========================================= */

document.getElementById("showSignIn").addEventListener("click", function() {

    showAccountSection("signin");

});


/* =========================================
   SHOW SIGN UP
========================================= */

document.getElementById("showSignUp").addEventListener("click", function() {

    showAccountSection("signup");

});


/* =========================================
   SHOW ADMIN SIGN UP
========================================= */

document.getElementById("showAdminSignUp").addEventListener("click", function() {

    showAccountSection("admin");

});


/* =========================================
   BACK TO NORMAL SIGN UP
========================================= */

document.getElementById("backToSignUp").addEventListener("click", function() {

    showAccountSection("signup");

});


/* =========================================
   SIGN IN FORM
========================================= */

document.getElementById("signInForm").addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Sign in is not connected yet.");

});


/* =========================================
   NORMAL SIGN UP
========================================= */

document.getElementById("signUpForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Your passwords do not match.");
        return;

    }

    alert("Account information accepted. Account creation is not connected yet.");

});


/* =========================================
   ADMIN SIGN UP
========================================= */

document.getElementById("adminSignUpForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const setupPassword = document.getElementById("adminSetupPassword").value;
    const password = document.getElementById("adminPassword").value;
    const confirmPassword = document.getElementById("adminConfirmPassword").value;

    if (setupPassword !== DEFAULT_ADMIN_PASSWORD) {

        alert("Incorrect initial admin setup password.");
        return;

    }

    if (password !== confirmPassword) {

        alert("Your passwords do not match.");
        return;

    }

    alert("Admin account information accepted. Admin account creation is not connected yet.");

});
