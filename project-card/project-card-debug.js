
"use strict";

(function () {

    /* =========================================================
       CHECK GLOBAL DEBUG STATUS
    ========================================================= */

    function isDebugStatusEnabled() {

        return window.projectDebugStatus === true;

    }


    /* =========================================================
       UPDATE ONE PROJECT CARD
    ========================================================= */

    function updateProjectCardDebug(card) {

        if (!card) return;

        const enabled = isDebugStatusEnabled();

        card.dataset.cardDebug = enabled ? "on" : "off";


        /* =====================================================
           DEBUG ELEMENTS
        ===================================================== */

        const debugElements = [

            card.querySelector(
                "[data-project-card-number]"
            ),

            card.querySelector(
                "[data-project-grid-position]"
            ),

            card.querySelector(
                "[data-project-json-button]"
            )

        ];


        /* =====================================================
           SHOW OR HIDE ALL DEBUG ELEMENTS
        ===================================================== */

        debugElements.forEach(function (element) {

            if (!element) return;

            element.hidden = !enabled;

        });

    }


    /* =========================================================
       INITIALIZE ONE PROJECT CARD
    ========================================================= */

    function initializeProjectCardDebug(card) {

        if (!card) return;

        updateProjectCardDebug(card);

    }


    /* =========================================================
       INITIALIZE ALL PROJECT CARDS
    ========================================================= */

    function initializeAllProjectCardDebug() {

        document.querySelectorAll(
            "[data-project-card]"
        ).forEach(function (card) {

            initializeProjectCardDebug(card);

        });

    }


    /* =========================================================
       UPDATE ALL PROJECT CARDS
    ========================================================= */

    function updateAllProjectCardDebug() {

        initializeAllProjectCardDebug();

    }


    /* =========================================================
       GLOBAL FUNCTIONS
    ========================================================= */

    window.initializeProjectCardDebug =
        initializeProjectCardDebug;

    window.initializeAllProjectCardDebug =
        initializeAllProjectCardDebug;

    window.updateAllProjectCardDebug =
        updateAllProjectCardDebug;


    /* =========================================================
       STARTUP
    ========================================================= */

    function startDebug() {

        initializeAllProjectCardDebug();

    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startDebug
        );

    } else {

        startDebug();

    }

})();
