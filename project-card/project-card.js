
"use strict";

(() => {

    /* =========================================
       ELEMENT REFERENCES
    ========================================= */

    const root = document.getElementById("cardContentRoot");
    const card = document.getElementById("projectCard");

    const viewGameButton = document.querySelector(
        "[data-view-game-button]"
    );


    /* =========================================
       RECEIVE PROJECT DATA FROM PARENT
    ========================================= */

    window.addEventListener("message", event => {

        /*
           Only accept messages from the parent
           page on the same origin.
        */

        if (event.origin !== window.location.origin) {
            return;
        }

        if (event.source !== window.parent) {
            return;
        }

        const message = event.data;

        if (
            !message ||
            typeof message !== "object"
        ) {
            return;
        }


        /*
           Populate project card.
        */

        if (
            message.type === "populate-project-card" ||
            message.type === "PROJECT_CARD_DATA"
        ) {

            const projectData =
                message.project ||
                message.data ||
                {};

            if (window.ProjectCardRenderer) {

                window.ProjectCardRenderer.populate(
                    projectData
                );

            } else {

                console.error(
                    "[Project Card] Renderer is not loaded."
                );
            }
        }


        /*
           Request card resize.
        */

        if (
            message.type === "resize-project-card" ||
            message.type === "PROJECT_CARD_RESIZE"
        ) {

            window.ProjectCardResizer?.requestResize();
        }

    });


    /* =========================================
       INITIALIZE
    ========================================= */

    function initializeProjectCard() {

        /*
           Initialize automatic card height.
        */

        window.ProjectCardResizer?.setup();


        /*
           Do not generate demo information here.

           The parent page supplies the real JSON.

           View Game remains visual only.
        */

        window.ProjectCardResizer?.requestResize();


        console.log(
            "[Project Card] Controller initialized."
        );
    }


    /* =========================================
       DOM READY
    ========================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeProjectCard,
            { once: true }
        );

    } else {

        initializeProjectCard();
    }


    /* =========================================
       DEBUG ACCESS
    ========================================= */

    window.populateProjectCard = function(rawData) {

        if (!window.ProjectCardRenderer) {

            console.error(
                "[Project Card] Renderer is not loaded."
            );

            return;
        }

        window.ProjectCardRenderer.populate(rawData);
    };

})();
