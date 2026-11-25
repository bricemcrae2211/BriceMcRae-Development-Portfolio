"use strict";

/* =========================================
   RETURN TO PORTFOLIO
========================================= */

const PORTFOLIO_URL = "../index.html";


/* =========================================
   RETURN BUTTON
========================================= */

const returnButton = document.querySelector(".return-portfolio-button");

if (returnButton) {

    returnButton.addEventListener("click", function () {

        window.location.href = PORTFOLIO_URL;

    });

}