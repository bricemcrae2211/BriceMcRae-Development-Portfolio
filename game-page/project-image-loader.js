
"use strict";

(function () {

    /* =========================================================
       SETTINGS
    ========================================================= */

    const GITHUB_OWNER = "bricemcrae2211";
    const GITHUB_REPOSITORY = "bricemcraeMyPortfolioSite.github.io";
    const GITHUB_BRANCH = "main";

    const PROJECT_ID = "project_1795071175192_tdp2p37";

    const RAW_BASE_URL =
        `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}`;

    const PROJECT_JSON_URL =
        `${RAW_BASE_URL}/projects/${PROJECT_ID}.json`;

    const IMAGE_EXTENSION = ".png";

    /* =========================================================
       IMAGE ARRAYS

       Every image array is read.

       Unknown categories are classified as OTHER.
       No images are inserted into the page.
    ========================================================= */

    const IMAGE_ARRAY_NAMES = [
        "screenshots",
        "gameplayImages",
        "environmentImages",
        "characterImages",
        "uiImages",
        "technicalImages",
        "others"
    ];

    /* =========================================================
       CATEGORY DEFINITIONS
    ========================================================= */

    const CATEGORY_DEFINITIONS = {

        screenshots: {
            id: "gameplay",
            name: "Gameplay Screenshots"
        },

        gameplayImages: {
            id: "gameplay",
            name: "Gameplay Screenshots"
        },

        environmentImages: {
            id: "environment",
            name: "Environment Images"
        },

        characterImages: {
            id: "character",
            name: "Character Images"
        },

        uiImages: {
            id: "ui",
            name: "User Interface Images"
        },

        technicalImages: {
            id: "technical",
            name: "Technical Images"
        },

        others: {
            id: "other",
            name: "Other Images"
        }

    };

    /* =========================================================
       SHARED DATA
    ========================================================= */

    let projectData = null;

    let imageEntries = [];

    let initialized = false;

    let loadingPromise = null;

    let lastError = null;

    let imageCounts = {};

    /* =========================================================
       RESET DATA
    ========================================================= */

    function resetData() {

        projectData = null;

        imageEntries = [];

        initialized = false;

        lastError = null;

        imageCounts = {

            gameplay: 0,
            environment: 0,
            character: 0,
            ui: 0,
            technical: 0,
            other: 0,

            total: 0,
            invalid: 0

        };

    }

    /* =========================================================
       LOAD PROJECT JSON
    ========================================================= */

    async function loadProjectJSON() {

        const response = await fetch(
            PROJECT_JSON_URL,
            {
                method: "GET",
                cache: "no-cache"
            }
        );

        if (!response.ok) {

            throw new Error(
                `Project JSON loading failed: HTTP ${response.status}`
            );

        }

        const data = await response.json();

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {

            throw new Error(
                "Invalid project JSON object."
            );

        }

        return data;

    }

    /* =========================================================
       VALIDATE PROJECT
    ========================================================= */

    function validateProject(data) {

        if (
            String(data.projectId) !== PROJECT_ID
        ) {

            throw new Error(
                `Project ID mismatch. Expected ${PROJECT_ID}.`
            );

        }

        if (
            !data.projectImages ||
            typeof data.projectImages !== "object" ||
            Array.isArray(data.projectImages)
        ) {

            throw new Error(
                "Project JSON does not contain projectImages."
            );

        }

    }

    /* =========================================================
       GET IMAGE CATEGORY
    ========================================================= */

    function getCategory(arrayName) {

        return CATEGORY_DEFINITIONS[arrayName] || {

            id: "other",

            name: "Other Images"

        };

    }

    /* =========================================================
       GET IMAGE NAME
    ========================================================= */

    function getImageName(image, fallback) {

        if (
            typeof image.name === "string" &&
            image.name.trim()
        ) {

            return image.name.trim();

        }

        if (
            typeof image.title === "string" &&
            image.title.trim()
        ) {

            return image.title.trim();

        }

        return fallback;

    }

    /* =========================================================
       GET IMAGE DESCRIPTION
    ========================================================= */

    function getImageDescription(image) {

        if (
            typeof image.description === "string"
        ) {

            return image.description;

        }

        return "";

    }

    /* =========================================================
       NORMALIZE IMAGE PATH
       
       Preserves the original path separately.
    ========================================================= */

    function normalizeImagePath(assetPath) {

        if (
            typeof assetPath !== "string" ||
            !assetPath.trim()
        ) {

            return "";

        }

        let path = assetPath
            .trim()
            .replace(/\\/g, "/");

        path = path.split("#")[0].split("?")[0];

        if (/^[a-z]:\//i.test(path)) {
            return "";
        }

        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        if (path.startsWith("/")) {
            return "";
        }

        if (
            path.toLowerCase().startsWith("projects/")
        ) {

            path = path.substring(
                "projects/".length
            );

        }

        if (
            path.startsWith(PROJECT_ID + "/")
        ) {

            path = path.substring(
                PROJECT_ID.length + 1
            );

        }

        const segments = path.split("/");

        if (
            !path ||
            segments.some(segment =>
                !segment ||
                segment === "." ||
                segment === ".."
            )
        ) {

            return "";

        }

        if (!/\.[a-z0-9]+$/i.test(path)) {

            path += IMAGE_EXTENSION;

        }

        return path;

    }

    /* =========================================================
       BUILD IMAGE URL

       Provides a ready-to-use image URL for other loaders.

       Does not create or load an image element.
    ========================================================= */

    function buildImageURL(path) {

        if (!path) {
            return "";
        }

        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        const encodedPath = path
            .split("/")
            .map(segment =>
                encodeURIComponent(segment)
            )
            .join("/");

        return (
            `${RAW_BASE_URL}/projects/` +
            `${encodeURIComponent(PROJECT_ID)}/` +
            encodedPath
        );

    }

    /* =========================================================
       CREATE IMAGE ENTRY

       Stores all information required by card and
       image loaders.
    ========================================================= */

    function createImageEntry(
        image,
        arrayName,
        index
    ) {

        if (
            !image ||
            typeof image !== "object" ||
            Array.isArray(image)
        ) {

            return null;

        }

        if (
            typeof image.path !== "string" ||
            !image.path.trim()
        ) {

            return null;

        }

        const originalPath = image.path.trim();

        const path = normalizeImagePath(originalPath);

        if (!path) {
            return null;
        }

        const category = getCategory(arrayName);

        const name = getImageName(
            image,
            `${category.name} ${index + 1}`
        );

        return {

            id:
                image.id ||
                `${arrayName}-${index + 1}`,

            name: name,

            title:
                image.title || name,

            description:
                getImageDescription(image),

            path: originalPath,

            normalizedPath: path,

            url: buildImageURL(path),

            arrayName: arrayName,

            category: category.id,

            categoryName: category.name,

            index: index,

            image: image

        };

    }

    /* =========================================================
       COLLECT ALL IMAGES

       Reads every configured array.

       Does not filter by tags.

       Does not insert anything into HTML.
    ========================================================= */

    function collectImages(data) {

        const entries = [];

        IMAGE_ARRAY_NAMES.forEach(function (arrayName) {

            const collection =
                data.projectImages[arrayName];

            if (!Array.isArray(collection)) {

                return;

            }

            collection.forEach(function (image, index) {

                const entry = createImageEntry(
                    image,
                    arrayName,
                    index
                );

                if (!entry) {

                    imageCounts.invalid++;

                    console.warn(
                        `Invalid image entry in ${arrayName}, index ${index}.`,
                        image
                    );

                    return;

                }

                entries.push(entry);

                imageCounts[entry.category]++;

                imageCounts.total++;

            });

        });

        /*
         * Read any additional image arrays not listed above.
         *
         * These images are kept under OTHER.
         */

        Object.keys(data.projectImages).forEach(
            function (arrayName) {

                if (
                    IMAGE_ARRAY_NAMES.includes(arrayName)
                ) {
                    return;
                }

                const collection =
                    data.projectImages[arrayName];

                if (!Array.isArray(collection)) {
                    return;
                }

                collection.forEach(function (image, index) {

                    const entry = createImageEntry(
                        image,
                        arrayName,
                        index
                    );

                    if (!entry) {

                        imageCounts.invalid++;

                        return;

                    }

                    entry.category = "other";

                    entry.categoryName = "Other Images";

                    entries.push(entry);

                    imageCounts.other++;

                    imageCounts.total++;

                });

            }
        );

        return entries;

    }

    /* =========================================================
       GET IMAGES BY CATEGORY
    ========================================================= */

    function getImagesByCategory(category) {

        return imageEntries.filter(function (entry) {

            return entry.category === category;

        });

    }

    /* =========================================================
       GET IMAGE BY ID
    ========================================================= */

    function getImageById(id) {

        return imageEntries.find(function (entry) {

            return String(entry.id) === String(id);

        }) || null;

    }

    /* =========================================================
       GET IMAGE BY PATH
    ========================================================= */

    function getImageByPath(path) {

        return imageEntries.find(function (entry) {

            return (
                entry.path === path ||
                entry.normalizedPath === path ||
                entry.url === path
            );

        }) || null;

    }

    /* =========================================================
       INITIALIZE PROJECT DATA
    ========================================================= */

    async function initialize() {

        if (initialized) {
            return projectData;
        }

        if (loadingPromise) {
            return loadingPromise;
        }

        loadingPromise = (async function () {

            resetData();

            try {

                console.log(
                    "Loading game project image data..."
                );

                const data =
                    await loadProjectJSON();

                validateProject(data);

                projectData = data;

                imageEntries =
                    collectImages(projectData);

                initialized = true;

                window.gameProjectData =
                    projectData;

                window.gameProjectImages =
                    imageEntries;

                console.log(
                    "PROJECT IMAGE DATA READY",
                    {
                        projectId: PROJECT_ID,
                        total: imageCounts.total,
                        counts: imageCounts,
                        images: imageEntries
                    }
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "game-project-data-ready",
                        {
                            detail: {

                                projectId: PROJECT_ID,

                                projectData: projectData,

                                images: imageEntries,

                                counts: imageCounts

                            }
                        }
                    )
                );

                return projectData;

            } catch (error) {

                lastError = error;

                initialized = false;

                console.error(
                    "Project image data loader:",
                    error
                );

                throw error;

            } finally {

                loadingPromise = null;

            }

        })();

        return loadingPromise;

    }

    /* =========================================================
       RELOAD PROJECT DATA
    ========================================================= */

    async function reload() {

        initialized = false;

        projectData = null;

        imageEntries = [];

        window.gameProjectData = null;

        window.gameProjectImages = [];

        return initialize();

    }

    /* =========================================================
       PUBLIC API

       Used by:
       - Game Image Slot Loader
       - Game Image Card Loader
       - Game Image Loader
       - JSON Debug
    ========================================================= */

    window.GameProjectData = Object.freeze({

        initialize: initialize,

        reload: reload,

        isInitialized: function () {

            return initialized;

        },

        getProject: function () {

            return projectData;

        },

        getImageEntries: function () {

            return imageEntries.slice();

        },

        getImagesByCategory: getImagesByCategory,

        getImageById: getImageById,

        getImageByPath: getImageByPath,

        getCounts: function () {

            return Object.assign({}, imageCounts);

        },

        getProjectId: function () {

            return PROJECT_ID;

        },

        getProjectJSONURL: function () {

            return PROJECT_JSON_URL;

        },

        getLastError: function () {

            return lastError;

        }

    });

    /* =========================================================
       START
    ========================================================= */

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
