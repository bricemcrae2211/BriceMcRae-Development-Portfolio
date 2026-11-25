
"use strict";

(function () {

    let initialized = false;

    /* =========================================
       GET PROJECT DATA
    ========================================= */

    function getProjectData() {

        const source = window.GameProjectData;

        if (!source) {
            return {};
        }

        // Check common project-data access methods.
        const methods = [
            "getProjectData",
            "getData",
            "getProject",
            "getCurrentProject"
        ];

        for (const method of methods) {

            if (typeof source[method] === "function") {

                try {

                    const result = source[method]();

                    if (result && typeof result === "object") {
                        return result;
                    }

                } catch (error) {

                    console.warn(
                        "[CardInformationLoader] Could not read project data:",
                        error
                    );

                }
            }
        }

        // Check common stored project-data properties.
        const properties = [
            "projectData",
            "data",
            "project",
            "currentProject"
        ];

        for (const property of properties) {

            if (
                source[property] &&
                typeof source[property] === "object"
            ) {
                return source[property];
            }
        }

        return {};
    }

    /* =========================================
       GET TEXT SAFELY
    ========================================= */

    function getText(value) {

        if (typeof value === "string") {
            return value.trim();
        }

        if (Array.isArray(value)) {
            return value
                .filter(item => typeof item === "string")
                .join(", ");
        }

        return "";
    }

    /* =========================================
       GET CATEGORY DESCRIPTION
    ========================================= */

    function getCategoryDescription(slot, project) {

        const category = (
            slot.dataset.category ||
            slot.dataset.categoryName ||
            ""
        ).toLowerCase();

        /* =====================================
           GAMEPLAY / SCREENSHOTS
        ===================================== */

        if (
            category.includes("screenshot") ||
            category.includes("gameplay")
        ) {

            return (
                getText(project.gameplay) ||
                getText(project.shortDescription) ||
                getText(project.longDescription)
            );
        }

        /* =====================================
           ENVIRONMENT
        ===================================== */

        if (category.includes("environment")) {

            return (
                getText(project.worldDescription) ||
                getText(project.worldSetting) ||
                getText(project.worldTheme)
            );
        }

        /* =====================================
           CHARACTERS
        ===================================== */

        if (category.includes("character")) {

            return (
                getText(project.playerCharacter?.description) ||
                getText(project.characters)
            );
        }

        /* =====================================
           USER INTERFACE
        ===================================== */

        if (
            category === "ui" ||
            category.includes("interface")
        ) {

            const features = getText(project.gameplayFeatures);

            return [
                features,
                getText(project.gameplay)
            ].filter(Boolean).join(". ");
        }

        /* =====================================
           TECHNICAL
        ===================================== */

        if (category.includes("technical")) {

            return (
                getText(project.technicalOverview) ||
                getText(project.technicalAdditional)
            );
        }

        /* =====================================
           OTHER IMAGES
        ===================================== */

        return (
            getText(project.shortDescription) ||
            getText(project.longDescription)
        );
    }

    /* =========================================
       FILL CARD INFORMATION
    ========================================= */

    function loadInformation(slot) {

        if (!slot) {
            return false;
        }

        const card = slot.querySelector(
            ".screenshot-card"
        );

        if (!card) {
            return false;
        }

        const title = card.querySelector(
            ".screenshot-card-title"
        );

        const description = card.querySelector(
            ".screenshot-card-description"
        );

        const project = getProjectData();

        /* =====================================
           TITLE
        ===================================== */

        if (title) {

            title.textContent =
                slot.dataset.imageName ||
                slot.dataset.imageId ||
                slot.dataset.categoryName ||
                "Game Image";

        }

        /* =====================================
           DESCRIPTION
        ===================================== */

        if (description) {

            // Individual image description has priority.
            const individualDescription =
                getText(slot.dataset.imageDescription);

            // Otherwise use the project description
            // matching the image category.
            const categoryDescription =
                getCategoryDescription(slot, project);

            // Final fallback if no category data exists.
            const fallbackDescription =
                getText(project.shortDescription) ||
                getText(project.longDescription) ||
                "Anchor Bound project image.";

            const finalDescription =
                individualDescription ||
                categoryDescription ||
                fallbackDescription;

            description.textContent = finalDescription;

            // Never hide the description element.
            description.hidden = false;
            description.style.display = "";

        }

        slot.dataset.informationLoaded = "true";

        return true;
    }

    /* =========================================
       LOAD ALL CARD INFORMATION
    ========================================= */

    function start() {

        const slots = document.querySelectorAll(
            ".game-image-slot"
        );

        let loaded = 0;

        slots.forEach(function (slot) {

            if (loadInformation(slot)) {
                loaded++;
            }

        });

        initialized = true;

        console.log(
            "[CardInformationLoader] Information loaded:",
            loaded,
            "of",
            slots.length
        );

        window.dispatchEvent(
            new CustomEvent(
                "game-image-card-information-ready",
                {
                    detail: {
                        total: slots.length,
                        loaded: loaded
                    }
                }
            )
        );

        return loaded;
    }

    /* =========================================
       PUBLIC API
    ========================================= */

    window.GameImageCardInformationLoader = {

        start: start,

        loadInformation: loadInformation,

        isInitialized: function () {
            return initialized;
        }

    };

    /* =========================================
       WAIT FOR CARDS
    ========================================= */

    window.addEventListener(
        "game-image-cards-ready",
        start
    );

    /* =========================================
       WAIT FOR SLOTS
    ========================================= */

    window.addEventListener(
        "game-image-slots-ready",
        start
    );

    /* =========================================
       START IF ALREADY LOADED
    ========================================= */

    if (
        window.GameImageCardLoader &&
        typeof window.GameImageCardLoader.isInitialized === "function" &&
        window.GameImageCardLoader.isInitialized()
    ) {

        start();

    }

})();
