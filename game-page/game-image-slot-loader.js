
"use strict";

(function () {

    /* =========================================================
       SETTINGS
    ========================================================= */

    const SLOT_MIN_WIDTH = 180;
    const SLOT_HEIGHT = 100;
    const GRID_GAP = 12;

    const CATEGORY_CONTAINERS = {
        gameplay: "gameScreenshots",
        environment: "gameEnvironmentImages",
        character: "gameCharacterImages",
        ui: "gameUIImages",
        technical: "gameTechnicalImages",
        other: "gameOtherImages"
    };

    const CATEGORY_NAMES = {
        gameplay: "Gameplay Screenshots",
        environment: "Environment Images",
        character: "Character Images",
        ui: "User Interface Images",
        technical: "Technical Images",
        other: "Other Images"
    };

    /* =========================================================
       STATE
    ========================================================= */

    let slots = [];
    let initialized = false;
    let initializing = false;
    let initializationPromise = null;

    const slotMap = new Map();

    const categoryCounts = {
        gameplay: 0,
        environment: 0,
        character: 0,
        ui: 0,
        technical: 0,
        other: 0,
        total: 0
    };

    /* =========================================================
       CATEGORY DETECTION
    ========================================================= */

    function getCategory(entry) {

        const category = String(
            entry.category || ""
        ).toLowerCase();

        if (
            category.includes("gameplay") ||
            category.includes("screenshot")
        ) {
            return "gameplay";
        }

        if (category.includes("environment")) {
            return "environment";
        }

        if (category.includes("character")) {
            return "character";
        }

        if (
            category === "ui" ||
            category.includes("interface")
        ) {
            return "ui";
        }

        if (category.includes("technical")) {
            return "technical";
        }

        const arrayName = String(
            entry.arrayName || ""
        ).toLowerCase();

        const arrayCategories = {
            screenshots: "gameplay",
            gameplayimages: "gameplay",
            environmentimages: "environment",
            characterimages: "character",
            uiimages: "ui",
            technicalimages: "technical",
            others: "other"
        };

        return arrayCategories[arrayName] || "other";
    }

    /* =========================================================
       GET GALLERY CONTAINER
    ========================================================= */

    function getContainer(category) {

        const containerId =
            CATEGORY_CONTAINERS[category] ||
            CATEGORY_CONTAINERS.other;

        return document.getElementById(containerId);
    }

    /* =========================================================
       PREPARE GRID
    ========================================================= */

    function prepareGrid(container) {

        if (!container) {
            return;
        }

        container.style.display = "grid";

        container.style.gridTemplateColumns =
            `repeat(auto-fit, minmax(${SLOT_MIN_WIDTH}px, 1fr))`;

        container.style.gap = `${GRID_GAP}px`;

        container.style.width = "100%";

        container.style.alignItems = "stretch";

        container.style.boxSizing = "border-box";

        container.dataset.slotLoader = "ready";
    }

    /* =========================================================
       RESET COUNTS
    ========================================================= */

    function resetCounts() {

        Object.keys(categoryCounts).forEach(function (key) {
            categoryCounts[key] = 0;
        });

    }

    /* =========================================================
       CREATE SLOT
    ========================================================= */

    function createSlot(entry, index) {

        const category = getCategory(entry);

        const container = getContainer(category);

        if (!container) {

            console.warn(
                "[GameImageSlotLoader] Gallery container missing:",
                CATEGORY_CONTAINERS[category],
                "Category:",
                category
            );

            return null;
        }

        prepareGrid(container);

        const categoryName =
            CATEGORY_NAMES[category];

        const slotId =
            `game-image-slot-${index}`;

        const slot = document.createElement("div");

        slot.id = slotId;

        slot.className = "game-image-slot";

        /* =====================================================
           SLOT INFORMATION
        ===================================================== */

        slot.dataset.slotId = slotId;

        slot.dataset.imageIndex = String(index);

        slot.dataset.category = category;

        slot.dataset.categoryName = categoryName;

        slot.dataset.arrayName =
            entry.arrayName || "";

        slot.dataset.imageId =
            String(entry.id || "");

        slot.dataset.imageName =
            entry.name ||
            entry.title ||
            `${categoryName} ${index + 1}`;

        slot.dataset.imageDescription =
            entry.description || "";

        slot.dataset.imagePath =
            entry.path || "";

        slot.dataset.normalizedPath =
            entry.normalizedPath || "";

        slot.dataset.imageUrl =
            entry.url || "";

        slot.dataset.imageSource =
            entry.url ||
            entry.normalizedPath ||
            entry.path ||
            "";

        slot.dataset.imageLoaded = "false";

        slot.dataset.cardLoaded = "false";

        /* =====================================================
           SLOT SIZE
        ===================================================== */

        slot.style.width = "100%";

        slot.style.minWidth = "0";

        slot.style.minHeight =
            `${SLOT_HEIGHT}px`;

        slot.style.boxSizing = "border-box";

        /* =====================================================
           EMPTY SLOT PLACEHOLDER
        ===================================================== */

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "game-image-slot-placeholder";

        placeholder.textContent =
            "No card loaded";

        placeholder.style.width = "100%";

        placeholder.style.minHeight =
            `${SLOT_HEIGHT}px`;

        placeholder.style.display = "flex";

        placeholder.style.alignItems = "center";

        placeholder.style.justifyContent = "center";

        placeholder.style.textAlign = "center";

        slot.appendChild(placeholder);

        /* =====================================================
           ADD SLOT TO CATEGORY GALLERY
        ===================================================== */

        container.appendChild(slot);

        slots.push(slot);

        slotMap.set(slotId, {
            element: slot,
            entry: entry,
            category: category,
            index: index
        });

        categoryCounts[category]++;

        categoryCounts.total++;

        return slot;
    }

    /* =========================================================
       CLEAR GALLERY SLOTS
    ========================================================= */

    function clearSlots() {

        Object.values(CATEGORY_CONTAINERS).forEach(
            function (containerId) {

                const container =
                    document.getElementById(containerId);

                if (!container) {
                    return;
                }

                container
                    .querySelectorAll(".game-image-slot")
                    .forEach(function (slot) {
                        slot.remove();
                    });

                container.dataset.requiredSlots = "0";

                container.dataset.loadedSlots = "0";
            }
        );

        slots = [];

        slotMap.clear();

        resetCounts();

        initialized = false;
    }

    /* =========================================================
       UPDATE GALLERY COUNTS
    ========================================================= */

    function updateGalleryCounts() {

        Object.entries(CATEGORY_CONTAINERS).forEach(
            function ([category, containerId]) {

                const container =
                    document.getElementById(containerId);

                if (!container) {
                    return;
                }

                const count =
                    categoryCounts[category] || 0;

                container.dataset.requiredSlots =
                    String(count);

                container.dataset.loadedSlots =
                    String(
                        container.querySelectorAll(
                            ".game-image-slot"
                        ).length
                    );

                container.dataset.category = category;

                container.dataset.categoryName =
                    CATEGORY_NAMES[category];
            }
        );

    }

    /* =========================================================
       LOAD ALL GALLERY SLOTS

       IMPORTANT:
       Wait for the JSON loader before reading entries.
    ========================================================= */

    async function loadSlots() {

        if (initializing) {
            return initializationPromise;
        }

        if (initialized) {
            return slots;
        }

        if (!window.GameProjectData) {

            console.warn(
                "[GameImageSlotLoader] GameProjectData is not available."
            );

            return [];
        }

        initializing = true;

        initializationPromise = (async function () {

            try {

                const dataLoader =
                    window.GameProjectData;

                /* =============================================
                   WAIT FOR PROJECT JSON
                ============================================= */

                if (!dataLoader.isInitialized()) {

                    await dataLoader.initialize();

                }

                /* =============================================
                   READ ALL IMAGE ENTRIES
                ============================================= */

                const entries =
                    dataLoader.getImageEntries();

                if (!Array.isArray(entries)) {

                    throw new Error(
                        "Project image data did not return an image array."
                    );

                }

                /* =============================================
                   CLEAR PREVIOUS SLOTS
                ============================================= */

                clearSlots();

                /* =============================================
                   CREATE A SLOT FOR EVERY IMAGE
                ============================================= */

                entries.forEach(function (entry, index) {

                    if (
                        !entry ||
                        typeof entry !== "object"
                    ) {
                        return;
                    }

                    createSlot(entry, index);

                });

                /* =============================================
                   UPDATE CATEGORY COUNTS
                ============================================= */

                updateGalleryCounts();

                /* =============================================
                   MARK READY
                ============================================= */

                initialized = true;

                console.log(
                    "[GameImageSlotLoader] Gallery ready."
                );

                console.table(categoryCounts);

                /* =============================================
                   DISPATCH READY EVENT
                ============================================= */

                window.dispatchEvent(
                    new CustomEvent(
                        "game-image-slots-ready",
                        {
                            detail: {
                                slots: slots.slice(),
                                total: slots.length,
                                counts: {
                                    ...categoryCounts
                                }
                            }
                        }
                    )
                );

                return slots;

            } catch (error) {

                console.error(
                    "[GameImageSlotLoader] Failed to create gallery slots:",
                    error
                );

                return [];

            } finally {

                initializing = false;

                initializationPromise = null;

            }

        })();

        return initializationPromise;
    }

    /* =========================================================
       SLOT ACCESS
    ========================================================= */

    function getSlots() {
        return slots.slice();
    }

    function getSlot(slotId) {

        const result = slotMap.get(slotId);

        return result ? result.element : null;
    }

    function getSlotData(slotId) {

        return slotMap.get(slotId) || null;
    }

    function getCount() {
        return slots.length;
    }

    function getCounts() {
        return { ...categoryCounts };
    }

    /* =========================================================
       CARD LOADER SUPPORT
    ========================================================= */

    function setCardLoaded(slotId, loaded) {

        const slot = getSlot(slotId);

        if (!slot) {
            return false;
        }

        slot.dataset.cardLoaded =
            loaded ? "true" : "false";

        return true;
    }

    function resetSlot(slotId) {

        const slot = getSlot(slotId);

        if (!slot) {
            return false;
        }

        slot.replaceChildren();

        const placeholder =
            document.createElement("div");

        placeholder.className =
            "game-image-slot-placeholder";

        placeholder.textContent =
            "No card loaded";

        placeholder.style.width = "100%";

        placeholder.style.minHeight =
            `${SLOT_HEIGHT}px`;

        placeholder.style.display = "flex";

        placeholder.style.alignItems = "center";

        placeholder.style.justifyContent = "center";

        slot.appendChild(placeholder);

        slot.dataset.cardLoaded = "false";

        slot.dataset.imageLoaded = "false";

        return true;
    }

    /* =========================================================
       RELOAD
    ========================================================= */

    async function reload() {

        clearSlots();

        return loadSlots();
    }

    /* =========================================================
       PUBLIC API
    ========================================================= */

    window.GameImageSlotLoader = {

        start: loadSlots,

        reload: reload,

        getSlots: getSlots,

        getSlot: getSlot,

        getSlotData: getSlotData,

        getCount: getCount,

        getCounts: getCounts,

        setCardLoaded: setCardLoaded,

        resetSlot: resetSlot,

        isInitialized: function () {
            return initialized;
        }

    };

    /* =========================================================
       WAIT FOR PROJECT DATA
    ========================================================= */

    window.addEventListener(
        "game-project-data-ready",
        loadSlots
    );

    /* =========================================================
       START
    ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            loadSlots,
            { once: true }
        );

    } else {

        loadSlots();

    }

})();
