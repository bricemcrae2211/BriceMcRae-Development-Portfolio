
"use strict";

(function () {

    /* =========================================
       CONFIGURATION
    ========================================= */

    const GAME_PAGE_URL = "./game-page/game-page.html";

    const STORAGE_KEY = "selectedGameProject";

    const BUTTON_SELECTOR =
        "[data-view-game-button], [data-open-game-page]";


    /* =========================================
       INTERNAL STATE
    ========================================= */

    let currentProjectData = null;


    /* =========================================
       NORMALIZE PROJECT DATA
    ========================================= */

    function normalizeProjectData(rawData) {

        if (!rawData || typeof rawData !== "object") {
            return null;
        }

        if (
            rawData.project &&
            typeof rawData.project === "object"
        ) {

            return {
                ...rawData,
                ...rawData.project
            };

        }

        return rawData;
    }


    /* =========================================
       POPULATE PROJECT CARD
    ========================================= */

    function populateProjectCard(rawData) {

        const projectData =
            normalizeProjectData(rawData);

        if (!projectData) {

            console.error(
                "Invalid project data."
            );

            return false;
        }


        if (!window.ProjectCardRenderer) {

            console.error(
                "ProjectCardRenderer is not loaded."
            );

            return false;
        }


        currentProjectData = projectData;


        window.ProjectCardRenderer.populate(
            projectData
        );


        window.ProjectCardResizer?.requestResize();


        return true;
    }


    /* =========================================
       GET CURRENT PROJECT DATA
    ========================================= */

    function getProjectData() {

        return currentProjectData;
    }


    /* =========================================
       CHECK NAVIGATION AVAILABILITY
    ========================================= */

    function canOpenGamePage() {

        if (!currentProjectData) {

            console.error(
                "Cannot open Game Details: No project has been loaded."
            );

            return false;
        }


        if (window.parent === window) {

            console.error(
                "Cannot navigate: Project Card has no parent portfolio page."
            );

            return false;
        }


        return true;
    }


    /* =========================================
       OPEN GAME DETAILS PAGE
    ========================================= */

    function openGamePage() {

        if (!canOpenGamePage()) {
            return false;
        }


        try {

            /* Save selected project */

            window.parent.sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(currentProjectData)
            );


            /* Navigate parent portfolio window */

            window.parent.location.assign(
                GAME_PAGE_URL
            );


            return true;

        } catch (error) {

            console.error(
                "Could not open Game Details page:",
                error
            );

            return false;
        }
    }


    /* =========================================
       PUBLIC NAVIGATION API
    ========================================= */

    window.GamePageNavigation = {

        open: openGamePage,

        getProjectData: getProjectData,

        hasProject: function () {

            return currentProjectData !== null;

        }

    };


    /* =========================================
       PUBLIC PROJECT CARD API
    ========================================= */

    window.populateProjectCard =
        populateProjectCard;


    /* =========================================
       PUBLIC SHORTCUT
    ========================================= */

    window.openGamePage = openGamePage;


    /* =========================================
       UNIVERSAL BUTTON NAVIGATION
    ========================================= */

    document.addEventListener(
        "click",
        function (event) {

            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }


            const button = target.closest(
                BUTTON_SELECTOR
            );


            if (!button) {
                return;
            }


            event.preventDefault();


            openGamePage();

        }
    );


    /* =========================================
       RECEIVE PROJECT DATA FROM PARENT
    ========================================= */

    window.addEventListener(
        "message",
        function (event) {

            /* Only accept messages from the parent */

            if (event.source !== window.parent) {
                return;
            }


            /* Only accept same-origin messages */

            if (event.origin !== window.location.origin) {
                return;
            }


            const message = event.data;


            if (!message || typeof message !== "object") {
                return;
            }


            /* PROJECT DATA */

            if (
                message.type === "populate-project-card" ||
                message.type === "PROJECT_CARD_DATA"
            ) {

                populateProjectCard(
                    message.project ||
                    message.data ||
                    message
                );

                return;
            }


            /* RESIZE REQUEST */

            if (
                message.type === "resize-project-card" ||
                message.type === "PROJECT_CARD_RESIZE"
            ) {

                window.ProjectCardResizer?.requestResize();

                return;
            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    function initialize() {

        const projectCard =
            document.getElementById("projectCard");


        if (!projectCard) {

            console.error(
                "Project Card element was not found."
            );

            return;
        }


        window.ProjectCardResizer?.setup(
            projectCard
        );

    }


    /* =========================================
       STARTUP
    ========================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }

})();
