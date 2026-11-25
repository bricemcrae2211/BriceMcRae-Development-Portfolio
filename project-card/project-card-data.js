
"use strict";

(function () {

    /* =========================================
       INTERNAL STATE
    ========================================= */

    let currentProject = null;
    let currentFilename = "";
    let currentCardNumber = 0;
    let currentGridPosition = 0;

    let isLoaded = false;


    /* =========================================
       ELEMENT REFERENCES
    ========================================= */

    const card = document.querySelector("[data-project-card]");

    if (!card) {
        console.error("Project card element was not found.");
        return;
    }


    /* =========================================
       FIELD ALIASES
    ========================================= */

    const FIELD_ALIASES = {

        image: [
            "image",
            "imageURL",
            "imageUrl",
            "thumbnail",
            "thumbnailURL",
            "thumbnailUrl",
            "projectImage"
        ],

        projectTitle: [
            "projectTitle",
            "title",
            "name",
            "projectName"
        ],

        shortDescription: [
            "shortDescription",
            "description",
            "summary"
        ],

        longDescription: [
            "longDescription",
            "fullDescription",
            "about",
            "aboutProject"
        ],

        story: [
            "story",
            "narrative",
            "gameStory"
        ],

        world: [
            "world",
            "gameWorld",
            "setting"
        ],

        characters: [
            "characters",
            "characterInformation"
        ],

        gameplay: [
            "gameplay",
            "gameplayDescription"
        ],

        mechanics: [
            "mechanics",
            "gameMechanics"
        ],

        controls: [
            "controls",
            "controlInformation"
        ],

        features: [
            "features",
            "keyFeatures"
        ],

        platforms: [
            "platforms",
            "supportedPlatforms"
        ],

        tags: [
            "tags",
            "projectTags",
            "categories"
        ],

        genre: [
            "genre"
        ],

        subgenre: [
            "subgenre",
            "subGenre"
        ],

        type: [
            "type",
            "projectType"
        ],

        perspective: [
            "perspective",
            "cameraPerspective"
        ],

        gameMode: [
            "gameMode",
            "gameModes"
        ],

        ageRating: [
            "ageRating",
            "rating"
        ],

        engine: [
            "engine",
            "gameEngine"
        ],

        engineVersion: [
            "engineVersion",
            "version"
        ],

        status: [
            "status",
            "developmentStatus"
        ],

        releaseStatus: [
            "releaseStatus",
            "release"
        ],

        languages: [
            "languages",
            "programmingLanguages"
        ],

        technologies: [
            "technologies",
            "technology",
            "tools"
        ],

        role: [
            "role",
            "projectRole"
        ],

        teamSize: [
            "teamSize",
            "team"
        ],

        startDate: [
            "startDate",
            "developmentStart"
        ],

        endDate: [
            "endDate",
            "developmentEnd"
        ],

        projectId: [
            "projectId",
            "id"
        ],

        technicalAdditional: [
            "technicalAdditional",
            "technicalContributions",
            "technicalDetails"
        ],

        technicalChallenges: [
            "technicalChallenges",
            "challenges"
        ],

        itchURL: [
            "itchURL",
            "itchUrl",
            "itch",
            "itchLink"
        ],

        githubURL: [
            "githubURL",
            "githubUrl",
            "github",
            "githubLink"
        ],

        websiteURL: [
            "websiteURL",
            "websiteUrl",
            "website",
            "websiteLink"
        ],

        downloadURL: [
            "downloadURL",
            "downloadUrl",
            "download",
            "downloadLink"
        ],

        videoURL: [
            "videoURL",
            "videoUrl",
            "video",
            "videoLink"
        ]

    };


    /* =========================================
       VALUE HELPERS
    ========================================= */

    function getValue(object, aliases) {

        if (!object || typeof object !== "object") {
            return null;
        }

        for (const key of aliases) {

            if (
                Object.prototype.hasOwnProperty.call(object, key) &&
                object[key] !== null &&
                object[key] !== undefined
            ) {
                return object[key];
            }

        }

        return null;

    }


    function formatValue(value) {

        if (value === null || value === undefined) {
            return "";
        }

        if (Array.isArray(value)) {

            return value
                .map(formatValue)
                .filter(Boolean)
                .join(", ");

        }

        if (typeof value === "object") {

            if (value.name) {
                return String(value.name);
            }

            if (value.title) {
                return String(value.title);
            }

            return Object.values(value)
                .map(formatValue)
                .filter(Boolean)
                .join(", ");

        }

        return String(value);

    }


    /* =========================================
       TEXT FIELD RENDERING
    ========================================= */

    function renderTextField(fieldName, value) {

        const element = card.querySelector(
            '[data-project-field="' + fieldName + '"]'
        );

        if (!element) {
            return;
        }

        element.textContent = formatValue(value);

    }


    /* =========================================
       IMAGE RENDERING
    ========================================= */

    function renderImage(value) {

        const image = card.querySelector(
            '[data-project-field="image"]'
        );

        const placeholder = card.querySelector(
            ".thumbnail-placeholder"
        );

        if (!image) {
            return;
        }

        const imageURL = formatValue(value).trim();

        if (!imageURL) {

            image.hidden = true;

            if (placeholder) {
                placeholder.hidden = false;
            }

            return;

        }

        image.onerror = function () {

            image.hidden = true;

            if (placeholder) {
                placeholder.hidden = false;
            }

        };

        image.onload = function () {

            image.hidden = false;

            if (placeholder) {
                placeholder.hidden = true;
            }

        };

        image.src = imageURL;

    }


    /* =========================================
       ARRAY FIELD RENDERING
    ========================================= */

    function renderListField(fieldName, value, className) {

        const container = card.querySelector(
            '[data-project-field="' + fieldName + '"]'
        );

        if (!container) {
            return;
        }

        container.replaceChildren();

        let values = [];

        if (Array.isArray(value)) {

            values = value;

        } else if (typeof value === "string" && value.trim()) {

            values = value.split(",");

        } else if (value !== null && value !== undefined) {

            values = [value];

        }

        values.forEach(function (item) {

            const text = formatValue(item).trim();

            if (!text) {
                return;
            }

            const element = document.createElement("span");

            element.className = className;
            element.textContent = text;

            container.appendChild(element);

        });

    }


    /* =========================================
       PROJECT LINK RENDERING
    ========================================= */

    function renderLink(fieldName, value) {

        const element = card.querySelector(
            '[data-project-field="' + fieldName + '"]'
        );

        if (!element) {
            return;
        }

        const url = formatValue(value).trim();

        if (!url) {

            element.hidden = true;
            element.removeAttribute("href");

            return;

        }

        try {

            const parsedURL = new URL(url, window.location.href);

            if (
                parsedURL.protocol !== "http:" &&
                parsedURL.protocol !== "https:"
            ) {

                element.hidden = true;
                element.removeAttribute("href");

                return;

            }

            element.href = parsedURL.href;
            element.hidden = false;

        } catch (error) {

            element.hidden = true;
            element.removeAttribute("href");

        }

    }


    /* =========================================
       CARD NUMBER AND GRID POSITION
    ========================================= */

    function renderCardInformation() {

        const cardNumber = card.querySelector(
            "[data-project-card-number]"
        );

        const gridPosition = card.querySelector(
            "[data-project-grid-position]"
        );

        const filename = card.querySelector(
            "[data-project-json-button]"
        );

        if (cardNumber) {

            cardNumber.textContent =
                currentCardNumber > 0
                    ? "#" + currentCardNumber
                    : "#Unavailable";

        }

        if (gridPosition) {

            gridPosition.textContent =
                currentGridPosition > 0
                    ? "Grid " + currentGridPosition
                    : "Grid Unavailable";

        }

        if (filename) {

            filename.textContent =
                currentFilename || "Filename Unavailable";

        }

    }


    /* =========================================
       RENDER PROJECT INFORMATION
    ========================================= */

    function renderProject(project) {

        if (
            !project ||
            typeof project !== "object" ||
            Array.isArray(project)
        ) {

            console.error("Invalid project JSON object.");
            return false;

        }

        currentProject = project;

        /* IMAGE */

        renderImage(
            getValue(project, FIELD_ALIASES.image)
        );


        /* TEXT FIELDS */

        const textFields = [

            "projectTitle",
            "shortDescription",
            "longDescription",
            "story",
            "world",
            "characters",
            "gameplay",
            "mechanics",
            "controls",
            "features",
            "genre",
            "subgenre",
            "type",
            "perspective",
            "gameMode",
            "ageRating",
            "engine",
            "engineVersion",
            "status",
            "releaseStatus",
            "languages",
            "technologies",
            "role",
            "teamSize",
            "startDate",
            "endDate",
            "projectId",
            "technicalAdditional",
            "technicalChallenges"

        ];

        textFields.forEach(function (fieldName) {

            renderTextField(
                fieldName,
                getValue(project, FIELD_ALIASES[fieldName])
            );

        });


        /* ARRAY FIELDS */

        renderListField(
            "platforms",
            getValue(project, FIELD_ALIASES.platforms),
            "platform-item"
        );

        renderListField(
            "tags",
            getValue(project, FIELD_ALIASES.tags),
            "project-tag"
        );


        /* PROJECT LINKS */

        renderLink(
            "itchURL",
            getValue(project, FIELD_ALIASES.itchURL)
        );

        renderLink(
            "githubURL",
            getValue(project, FIELD_ALIASES.githubURL)
        );

        renderLink(
            "websiteURL",
            getValue(project, FIELD_ALIASES.websiteURL)
        );

        renderLink(
            "downloadURL",
            getValue(project, FIELD_ALIASES.downloadURL)
        );

        renderLink(
            "videoURL",
            getValue(project, FIELD_ALIASES.videoURL)
        );


        isLoaded = true;

        card.dataset.projectLoaded = "true";

        console.log(
            "Project card loaded:",
            currentFilename,
            currentProject
        );

        return true;

    }


    /* =========================================
       RECEIVE PROJECT DATA
    ========================================= */

    function receiveProjectData(message) {

        if (!message || typeof message !== "object") {
            return;
        }

        const project =
            message.project ||
            message.json ||
            message.data;

        if (
            !project ||
            typeof project !== "object" ||
            Array.isArray(project)
        ) {

            console.error(
                "Project card received invalid project data."
            );

            return;

        }

        currentFilename =
            message.filename ||
            message.jsonFilename ||
            message.currentJSONFilename ||
            "";

        currentCardNumber = Number(
            message.cardNumber ??
            message.buttonNumber ??
            message.currentCardNumber ??
            0
        );

        currentGridPosition = Number(
            message.gridPosition ??
            message.currentGridPosition ??
            0
        );


        renderCardInformation();

        if (!renderProject(project)) {
            return;
        }

    }


    /* =========================================
       RECEIVE DATA FROM PARENT PAGE
    ========================================= */

    window.addEventListener("message", function (event) {

        /*
         * Only accept messages from the parent
         * website that contains this card.
         */

        if (event.source !== window.parent) {
            return;
        }

        if (event.origin !== window.location.origin) {
            return;
        }

        const message = event.data;

        if (
            !message ||
            typeof message !== "object"
        ) {
            return;
        }

        if (
            message.type === "load-project-data" ||
            message.type === "populate-project-card" ||
            message.type === "PROJECT_CARD_DATA"
        ) {

            receiveProjectData(message);

        }

    });


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    card.dataset.projectLoaded = "false";

    renderCardInformation();

    console.log("Project card data loader ready.");

})();
