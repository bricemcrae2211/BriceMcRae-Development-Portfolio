
"use strict";

(() => {

    /* =========================================
       ELEMENT REFERENCES
    ========================================= */

    const root = document.getElementById("cardContentRoot");

    const image = document.querySelector(
        '[data-project-field="image"]'
    );

    const imageContainer = document.querySelector(
        "[data-project-image-container]"
    );


    /* =========================================
       FIELD ALIASES
    ========================================= */

    const fieldAliases = {

        projectTitle: [
            "projectTitle",
            "title",
            "name"
        ],

        shortDescription: [
            "shortDescription",
            "description",
            "summary"
        ],

        longDescription: [
            "longDescription",
            "fullDescription",
            "about"
        ],

        story: [
            "story",
            "narrative"
        ],

        world: [
            "world",
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
            "controlScheme"
        ],

        features: [
            "features",
            "keyFeatures"
        ],

        platforms: [
            "platforms",
            "platform"
        ],

        tags: [
            "tags",
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
            "mode"
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
            "engineVersion"
        ],

        status: [
            "status",
            "developmentStatus"
        ],

        releaseStatus: [
            "releaseStatus"
        ],

        languages: [
            "languages",
            "programmingLanguages"
        ],

        technologies: [
            "technologies",
            "tools"
        ],

        role: [
            "role",
            "myRole"
        ],

        teamSize: [
            "teamSize"
        ],

        startDate: [
            "startDate"
        ],

        endDate: [
            "endDate"
        ],

        projectId: [
            "projectId",
            "id"
        ],

        technicalAdditional: [
            "technicalAdditional",
            "technicalContributions",
            "contributions"
        ],

        technicalChallenges: [
            "technicalChallenges",
            "challenges"
        ],

        image: [
            "image",
            "imageURL",
            "imageUrl",
            "thumbnail",
            "thumbnailURL",
            "thumbnailUrl",
            "coverImage"
        ],

        itchURL: [
            "itchURL",
            "itchUrl",
            "itchio",
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
            "siteURL"
        ],

        downloadURL: [
            "downloadURL",
            "downloadUrl",
            "downloadLink"
        ],

        videoURL: [
            "videoURL",
            "videoUrl",
            "video",
            "trailerURL"
        ]

    };


    /* =========================================
       PROJECT DATA NORMALIZATION
    ========================================= */

    function normalizeProject(rawData) {

        if (
            !rawData ||
            typeof rawData !== "object" ||
            Array.isArray(rawData)
        ) {
            return {};
        }

        const nestedProject =
            rawData.project &&
            typeof rawData.project === "object" &&
            !Array.isArray(rawData.project)
                ? rawData.project
                : {};

        return {
            ...rawData,
            ...nestedProject
        };
    }


    /* =========================================
       FIND JSON FIELD
    ========================================= */

    function getProjectValue(data, field) {

        const aliases =
            fieldAliases[field] || [field];

        for (const alias of aliases) {

            if (
                Object.prototype.hasOwnProperty.call(
                    data,
                    alias
                ) &&
                data[alias] !== null &&
                data[alias] !== undefined
            ) {
                return data[alias];
            }
        }

        return undefined;
    }


    /* =========================================
       CONVERT VALUES TO TEXT
    ========================================= */

    function valueToText(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        if (Array.isArray(value)) {

            return value
                .map(valueToText)
                .filter(Boolean)
                .join("\n");
        }

        if (typeof value === "object") {

            if (value.name !== undefined) {
                return valueToText(value.name);
            }

            if (value.title !== undefined) {
                return valueToText(value.title);
            }

            if (value.text !== undefined) {
                return valueToText(value.text);
            }

            if (value.description !== undefined) {
                return valueToText(value.description);
            }

            return Object.entries(value)
                .map(([key, item]) => {

                    const text = valueToText(item);

                    return text
                        ? key + ": " + text
                        : "";

                })
                .filter(Boolean)
                .join("\n");
        }

        return String(value);
    }


    /* =========================================
       FILL TEXT FIELDS
    ========================================= */

    function fillTextFields(data) {

        const elements = root.querySelectorAll(
            "[data-project-field]"
        );

        elements.forEach(element => {

            const field = element.dataset.projectField;

            /*
               Image, lists and links are handled
               separately.
            */

            if (
                field === "image" ||
                field === "platforms" ||
                field === "tags" ||
                [
                    "itchURL",
                    "githubURL",
                    "websiteURL",
                    "downloadURL",
                    "videoURL"
                ].includes(field)
            ) {
                return;
            }

            const value = getProjectValue(data, field);

            element.textContent = valueToText(value);
        });
    }


    /* =========================================
       LIST CONVERSION
    ========================================= */

    function toList(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return [];
        }

        if (Array.isArray(value)) {

            return value
                .map(valueToText)
                .filter(Boolean);
        }

        if (typeof value === "string") {

            return value
                .split(/[,;\n]/)
                .map(item => item.trim())
                .filter(Boolean);
        }

        return [valueToText(value)].filter(Boolean);
    }


    /* =========================================
       FILL PLATFORMS AND TAGS
    ========================================= */

    function fillListField(data, field, className) {

        const container = root.querySelector(
            `[data-project-field="${field}"]`
        );

        if (!container) return;

        const value = getProjectValue(data, field);
        const items = toList(value);

        container.replaceChildren();

        items.forEach(item => {

            const element = document.createElement("span");

            element.className = className;
            element.textContent = item;

            container.appendChild(element);
        });
    }


    function fillLists(data) {

        fillListField(
            data,
            "platforms",
            "platform-item"
        );

        fillListField(
            data,
            "tags",
            "project-tag"
        );
    }


    /* =========================================
       SAFE URL
    ========================================= */

    function getSafeURL(value) {

        if (!value) return "";

        if (typeof value === "object") {

            value =
                value.url ||
                value.href ||
                value.src ||
                "";
        }

        if (
            typeof value !== "string" ||
            !value.trim()
        ) {
            return "";
        }

        try {

            const url = new URL(
                value.trim(),
                window.location.href
            );

            if (
                url.protocol !== "https:" &&
                url.protocol !== "http:"
            ) {
                return "";
            }

            return url.href;

        } catch {

            return "";
        }
    }


    /* =========================================
       FILL PROJECT LINKS
    ========================================= */

    function fillProjectLinks(data) {

        const linkFields = [
            "itchURL",
            "githubURL",
            "websiteURL",
            "downloadURL",
            "videoURL"
        ];

        linkFields.forEach(field => {

            const link = root.querySelector(
                `[data-project-field="${field}"]`
            );

            if (!link) return;

            const value = getProjectValue(data, field);
            const url = getSafeURL(value);

            if (url) {

                link.href = url;
                link.hidden = false;

            } else {

                link.removeAttribute("href");
                link.hidden = true;
            }
        });
    }


    /* =========================================
       UPDATE THUMBNAIL
    ========================================= */

    function updateThumbnail() {

        if (!image || !imageContainer) return;

        const hasImage =
            image.complete &&
            image.naturalWidth > 0;

        image.hidden = !hasImage;

        imageContainer.classList.toggle(
            "has-image",
            hasImage
        );

        requestCardResize();
    }


    /* =========================================
       FILL PROJECT IMAGE
    ========================================= */

    function fillProjectImage(data) {

        if (!image || !imageContainer) return;

        const value = getProjectValue(data, "image");
        const url = getSafeURL(value);

        image.removeAttribute("src");
        image.hidden = true;

        imageContainer.classList.remove("has-image");

        if (!url) {

            requestCardResize();
            return;
        }

        image.onload = updateThumbnail;

        image.onerror = () => {

            image.removeAttribute("src");
            image.hidden = true;

            imageContainer.classList.remove("has-image");

            requestCardResize();
        };

        image.src = url;
    }


    /* =========================================
       REQUEST CARD RESIZE
    ========================================= */

    function requestCardResize() {

        window.ProjectCardResizer?.requestResize();
    }


    /* =========================================
       POPULATE COMPLETE PROJECT CARD
    ========================================= */

    function populateProjectCard(rawData) {

        if (!root) {
            console.error(
                "[Project Card Renderer] Card root not found."
            );
            return;
        }

        const data = normalizeProject(rawData);

        fillTextFields(data);
        fillLists(data);
        fillProjectLinks(data);
        fillProjectImage(data);


        console.log(
            "[Project Card] Project data populated:",
            data
        );


        /*
           Measure after the browser has applied
           the new content.
        */

        requestCardResize();

        requestAnimationFrame(() => {

            requestCardResize();

            requestAnimationFrame(() => {
                requestCardResize();
            });

        });

        setTimeout(requestCardResize, 100);
        setTimeout(requestCardResize, 400);
    }


    /* =========================================
       PUBLIC ACCESS
    ========================================= */

    window.ProjectCardRenderer = {

        populate: populateProjectCard

    };

})();
