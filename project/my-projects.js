
"use strict";

/* =========================================================
   PAGE SETTINGS
========================================================= */

const PROJECT_CARD_TEMPLATE = "../project-card/project-card.html";

const MASONRY_GAP = 14;
const SINGLE_COLUMN_WIDTH = 650;


/* =========================================================
   ELEMENTS
========================================================= */

const elements = {
    status: document.getElementById("projectLoadStatus"),

    found: document.getElementById("jsonFoundCount"),
    valid: document.getElementById("validProjectCount"),
    invalid: document.getElementById("invalidProjectCount"),

    count: document.getElementById("projectCount"),

    cards: document.getElementById("projectCardsContainer"),

    empty: document.getElementById("projectsEmpty"),
    error: document.getElementById("projectError"),

    analyzeButton: document.getElementById("analyzeButton"),

    debugWindow: document.getElementById("debugWindow"),
    debugStatus: document.getElementById("debugStatus"),
    debugSummary: document.getElementById("debugSummary"),

    debugGoodList: document.getElementById("debugGoodList"),
    debugBadList: document.getElementById("debugBadList"),

    allProjectInformation: document.getElementById(
        "allProjectInformation"
    ),

    allProjectInformationContent: document.getElementById(
        "allProjectInformationContent"
    ),

    allProjectInformationCount: document.getElementById(
        "allProjectInformationCount"
    ),

    projectInformationSearch: document.getElementById(
        "projectInformationSearch"
    )
};


/* =========================================================
   REQUIRED ELEMENT VALIDATION
========================================================= */

const missingElements = Object.entries(elements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

if (missingElements.length > 0) {
    console.error(
        "My Projects page is missing required HTML elements:",
        missingElements
    );

    throw new Error(
        "My Projects initialization failed. Missing: " +
        missingElements.join(", ")
    );
}


/* =========================================================
   PROJECT MODULE VALIDATION
========================================================= */

if (!window.ProjectInfo) {
    throw new Error(
        "ProjectInfo is unavailable. " +
        "Make sure project-info.js loads before my-projects.js."
    );
}

if (!window.ProjectLoader) {
    throw new Error(
        "ProjectLoader is unavailable. " +
        "Make sure project-loader.js loads before my-projects.js."
    );
}

if (!window.ProjectDebug) {
    throw new Error(
        "ProjectDebug is unavailable. " +
        "Make sure project-debug.js loads before my-projects.js."
    );
}

if (!window.ProjectAnalysis) {
    throw new Error(
        "ProjectAnalysis is unavailable. " +
        "Make sure project-analysis.js loads before my-projects.js."
    );
}

const ProjectInfo = window.ProjectInfo;
const ProjectLoader = window.ProjectLoader;
const ProjectDebug = window.ProjectDebug;
const ProjectAnalysis = window.ProjectAnalysis;


/* =========================================================
   PAGE URLS
========================================================= */

const projectCardURL = new URL(
    PROJECT_CARD_TEMPLATE,
    window.location.href
);


/* =========================================================
   STATE
========================================================= */

let loadedProjects = [];
let discoveredProjectFiles = [];
let invalidProjects = [];

let masonryObserver = null;
let containerResizeObserver = null;

let masonryReflowFrame = null;

let previousColumnCount = 0;

let isLoadingProjects = false;


/* =========================================================
   STATUS
========================================================= */

function setStatus(message, isError = false) {
    elements.status.textContent = message;

    elements.status.classList.toggle("error", isError);
    elements.status.classList.toggle("success", !isError);
}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics(found, valid, invalid) {
    elements.found.textContent = found;
    elements.valid.textContent = valid;
    elements.invalid.textContent = invalid;

    elements.count.textContent =
        valid + (valid === 1 ? " project" : " projects");
}


/* =========================================================
   PROJECT LOADER CONNECTION
========================================================= */

async function discoverProjectFiles() {
    const files = await ProjectLoader.discoverProjectFiles();

    discoveredProjectFiles =
        ProjectLoader.getDiscoveredProjectFiles();

    return files;
}


async function loadFilesWithConcurrency(files, onProgress = null) {
    return ProjectLoader.loadFilesWithConcurrency(
        files,
        onProgress
    );
}


/* =========================================================
   PROJECT ANALYSIS CONNECTION
========================================================= */

function initializeProjectAnalysis() {

    if (!ProjectAnalysis) {
        throw new Error(
            "ProjectAnalysis is unavailable."
        );
    }

    if (typeof ProjectAnalysis.initialize !== "function") {
        throw new Error(
            "ProjectAnalysis.initialize is unavailable."
        );
    }

    ProjectAnalysis.initialize(() => {

        return {
            elements,

            loadedProjects,

            discoveredProjectFiles,

            getColumnCount,

            findProjectByPath,

            ProjectInfo
        };

    });

}


/* =========================================================
   ALL PROJECT INFORMATION
========================================================= */

function createInformationProperty(name, value, depth = 0) {
    const property = document.createElement("div");

    property.className = "informationProperty";
    property.dataset.depth = String(depth);

    const heading = document.createElement("div");

    heading.className = "informationPropertyName";
    heading.textContent = name;

    const content = document.createElement("div");

    content.className = "informationPropertyValue";

    property.appendChild(heading);

    if (value === null) {
        content.textContent = "null";
        property.appendChild(content);
        return property;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            content.textContent = "[] (empty array)";
            property.appendChild(content);
            return property;
        }

        const arrayContent = document.createElement("div");

        arrayContent.className = "informationNestedContent";

        value.forEach((item, index) => {
            arrayContent.appendChild(
                createInformationProperty(
                    "[" + index + "]",
                    item,
                    depth + 1
                )
            );
        });

        property.appendChild(arrayContent);
        return property;
    }

    if (typeof value === "object") {
        const entries = Object.entries(value);

        if (entries.length === 0) {
            content.textContent = "{} (empty object)";
            property.appendChild(content);
            return property;
        }

        const objectContent = document.createElement("div");

        objectContent.className = "informationNestedContent";

        entries.forEach(([key, item]) => {
            objectContent.appendChild(
                createInformationProperty(
                    key,
                    item,
                    depth + 1
                )
            );
        });

        property.appendChild(objectContent);
        return property;
    }

    if (value === "") {
        content.textContent = '"" (empty string)';
        property.appendChild(content);
        return property;
    }

    content.textContent = String(value);

    property.appendChild(content);

    return property;
}


/* =========================================================
   CREATE PROJECT INFORMATION ENTRY
========================================================= */

function createProjectInformationEntry(project, index) {
    const entry = document.createElement("article");

    entry.className = "allProjectInformationEntry";

    entry.dataset.projectName = project.name;
    entry.dataset.projectPath = project.path;
    entry.dataset.projectIndex = String(index);

    const header = document.createElement("div");

    header.className = "projectInformationEntryHeader";

    const title = document.createElement("h3");

    title.textContent =
        project.data.projectTitle ||
        project.data.title ||
        project.name;

    const filename = document.createElement("div");

    filename.className = "projectInformationFilename";
    filename.textContent = project.path;

    const propertyCount = document.createElement("div");

    propertyCount.className = "projectInformationPropertyCount";

    propertyCount.textContent =
        Object.keys(project.data).length +
        " top-level properties";

    header.append(
        title,
        filename,
        propertyCount
    );

    const properties = document.createElement("div");

    properties.className = "allProjectInformationProperties";

    Object.entries(project.data).forEach(([key, value]) => {
        properties.appendChild(
            createInformationProperty(key, value)
        );
    });

    entry.append(
        header,
        properties
    );

    return entry;
}


/* =========================================================
   DISPLAY ALL PROJECT INFORMATION
========================================================= */

function displayAllProjectInformation(projects) {
    const container = elements.allProjectInformationContent;

    container.replaceChildren();

    elements.allProjectInformation.hidden = false;
    elements.allProjectInformation.style.display = "";

    elements.allProjectInformationCount.textContent =
        projects.length +
        (projects.length === 1 ? " project" : " projects");

    if (projects.length === 0) {
        const empty = document.createElement("p");

        empty.textContent = "No project information available.";

        container.appendChild(empty);

        return;
    }

    projects.forEach((project, index) => {
        container.appendChild(
            createProjectInformationEntry(project, index)
        );
    });

    filterProjectInformation(
        elements.projectInformationSearch.value
    );
}


/* =========================================================
   SEARCH ALL PROJECT INFORMATION
========================================================= */

function filterProjectInformation(searchValue) {
    const search = String(searchValue || "")
        .trim()
        .toLowerCase();

    const entries = elements.allProjectInformationContent
        .querySelectorAll(".allProjectInformationEntry");

    let visibleCount = 0;

    entries.forEach(entry => {
        const matches =
            search === "" ||
            entry.textContent.toLowerCase().includes(search);

        entry.hidden = !matches;

        if (matches) {
            visibleCount++;
        }
    });

    if (search !== "") {
        elements.allProjectInformationCount.textContent =
            visibleCount +
            " matching " +
            (visibleCount === 1 ? "project" : "projects");
    } else {
        elements.allProjectInformationCount.textContent =
            loadedProjects.length +
            (loadedProjects.length === 1 ? " project" : " projects");
    }
}


/* =========================================================
   COLUMN COUNT
========================================================= */

function getColumnCount() {
    const availableWidth =
        elements.cards.getBoundingClientRect().width;

    if (availableWidth <= SINGLE_COLUMN_WIDTH) {
        return 1;
    }

    return 2;
}


/* =========================================================
   CREATE MASONRY COLUMNS
========================================================= */

function createMasonryColumns(container) {
    if (masonryObserver) {
        masonryObserver.disconnect();
        masonryObserver = null;
    }

    container.replaceChildren();

    const columns = [];
    const columnCount = getColumnCount();

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement("div");

        column.className = "projectMasonryColumn";
        column.dataset.columnIndex = String(i);

        columns.push(column);

        container.appendChild(column);
    }

    previousColumnCount = columnCount;

    return columns;
}


/* =========================================================
   MASONRY OBSERVER
========================================================= */

function initializeMasonryObserver() {
    if (masonryObserver) {
        masonryObserver.disconnect();
    }

    if (!("ResizeObserver" in window)) {
        masonryObserver = null;
        return;
    }

    masonryObserver = new ResizeObserver(() => {
        scheduleMasonryReflow();
    });
}


/* =========================================================
   CONTAINER RESIZE OBSERVER
========================================================= */

function initializeContainerResizeObserver() {
    if (!("ResizeObserver" in window)) {
        return;
    }

    if (containerResizeObserver) {
        containerResizeObserver.disconnect();
    }

    containerResizeObserver = new ResizeObserver(() => {
        const newColumnCount = getColumnCount();

        if (newColumnCount !== previousColumnCount) {
            rebuildMasonryColumns();
        } else {
            scheduleMasonryReflow();
        }
    });

    containerResizeObserver.observe(elements.cards);
}


/* =========================================================
   REBUILD MASONRY WITHOUT RELOADING IFRAMES
========================================================= */

function rebuildMasonryColumns() {
    const groups = getProjectGroups();

    const columns = createMasonryColumns(elements.cards);

    initializeMasonryObserver();

    groups.forEach(group => {
        columns[0].appendChild(group);

        if (masonryObserver) {
            masonryObserver.observe(group);
        }
    });

    scheduleMasonryReflow();
}


/* =========================================================
   SCHEDULE MASONRY REFLOW
========================================================= */

function scheduleMasonryReflow() {
    if (masonryReflowFrame !== null) {
        return;
    }

    masonryReflowFrame = requestAnimationFrame(() => {
        masonryReflowFrame = null;
        reflowMasonry();
    });
}


/* =========================================================
   PROJECT GROUPS IN ORIGINAL ORDER
========================================================= */

function getProjectGroups() {
    return Array.from(
        elements.cards.querySelectorAll(".projectGroup")
    ).sort((a, b) => {
        return Number(a.dataset.projectOrder) -
            Number(b.dataset.projectOrder);
    });
}


/* =========================================================
   MASONRY REFLOW
========================================================= */

function reflowMasonry() {
    const columns = Array.from(
        elements.cards.querySelectorAll(".projectMasonryColumn")
    );

    if (columns.length === 0) {
        return;
    }

    const groups = getProjectGroups();

    if (groups.length === 0) {
        return;
    }

    const heights = columns.map(() => 0);
    const assignments = columns.map(() => []);

    groups.forEach(group => {
        const height = group.getBoundingClientRect().height;

        let shortestColumn = 0;

        for (let i = 1; i < columns.length; i++) {
            if (heights[i] < heights[shortestColumn]) {
                shortestColumn = i;
            }
        }

        assignments[shortestColumn].push(group);

        heights[shortestColumn] += height + MASONRY_GAP;
    });

    assignments.forEach((assignedGroups, index) => {
        const column = columns[index];

        assignedGroups.forEach(group => {
            if (group.parentElement !== column) {
                column.appendChild(group);
            }
        });
    });
}


/* =========================================================
   FIND PROJECT BY PATH
========================================================= */

function findProjectByPath(path) {
    return loadedProjects.find(project => {
        return project.path === path;
    }) || null;
}


/* =========================================================
   SEND PROJECT DATA TO CARD
========================================================= */

function sendProjectDataToCard(slot) {
    if (!slot || !slot.contentWindow) {
        return false;
    }

    const projectPath = slot.dataset.projectPath;

    if (!projectPath) {
        return false;
    }

    const projectIndex = loadedProjects.findIndex(project => {
        return project.path === projectPath;
    });

    if (projectIndex === -1) {
        console.error(
            "Could not find project data for:",
            projectPath
        );

        return false;
    }

    const project = loadedProjects[projectIndex];

    slot.contentWindow.postMessage(
        {
            type: "load-project-data",

            filename: project.name,
            projectPath: project.path,
            project: project.data,

            cardNumber: projectIndex + 1,
            buttonNumber: projectIndex + 1,

            gridPosition: projectIndex + 1,
            totalProjects: loadedProjects.length
        },
        projectCardURL.origin
    );

    slot.dataset.projectDataSent = "true";

    return true;
}


/* =========================================================
   FIND PROJECT CARD FRAME
========================================================= */

function findProjectFrame(source) {
    return Array.from(
        elements.cards.querySelectorAll(".projectCardSlot")
    ).find(slot => {
        return slot.contentWindow === source;
    }) || null;
}


/* =========================================================
   RESPOND TO PROJECT DATA REQUEST
========================================================= */

function sendSelectedProjectDataToCard(frame, message, event) {
    if (!frame || !event?.source) {
        return;
    }

    const projectPath =
        message.projectPath ||
        frame.dataset.projectPath;

    if (!projectPath) {
        console.error(
            "Selected project path is missing."
        );

        return;
    }

    const projectIndex = loadedProjects.findIndex(project => {
        return project.path === projectPath;
    });

    if (projectIndex === -1) {
        console.error(
            "Project JSON could not be found:",
            projectPath
        );

        return;
    }

    const project = loadedProjects[projectIndex];

    const group = frame.closest(".projectGroup");

    let gridPosition = {
        column: null,
        positionInColumn: null
    };

    if (
        group &&
        typeof ProjectInfo.getGridPosition === "function"
    ) {
        gridPosition = ProjectInfo.getGridPosition(group);
    }

    event.source.postMessage(
        {
            type: "project-card-project-data",

            requestId: message.requestId || null,

            filename: project.name,
            projectPath: project.path,
            project: project.data,

            button: message.button || message,

            card: {
                number: projectIndex + 1,
                gridPosition: projectIndex + 1,
                originalOrder: projectIndex,

                masonryColumn: gridPosition.column,
                positionInColumn: gridPosition.positionInColumn
            },

            totalProjects: loadedProjects.length
        },
        event.origin
    );

    console.log("PROJECT DATA SENT TO CARD", {
        filename: project.name,
        path: project.path,
        cardNumber: projectIndex + 1,
        totalProjects: loadedProjects.length
    });
}


/* =========================================================
   IFRAME MESSAGE HANDLING
========================================================= */

window.addEventListener("message", event => {
    if (event.origin !== projectCardURL.origin) {
        return;
    }

    const data = event.data;

    if (!data || typeof data !== "object") {
        return;
    }

    const frame = findProjectFrame(event.source);

    if (!frame) {
        return;
    }

    if (data.type === "project-card-ready") {
        sendProjectDataToCard(frame);
        return;
    }

    if (data.type === "project-card-resized") {
        const height = Number(data.height);

        if (!Number.isFinite(height) || height <= 0) {
            return;
        }

        const newHeight = Math.ceil(height);

        if (frame.dataset.cardHeight === String(newHeight)) {
            return;
        }

        frame.dataset.cardHeight = String(newHeight);

        frame.style.height = newHeight + "px";
        frame.setAttribute("height", String(newHeight));

        scheduleMasonryReflow();

        return;
    }

    if (data.type === "project-card-request-project-data") {
        sendSelectedProjectDataToCard(
            frame,
            data,
            event
        );

        return;
    }

    if (data.type === "project-card-open-game") {
        console.warn(
            "The old project-card-open-game message is no longer " +
            "handled as a save operation. Update project-card-navigation.js " +
            "to request project data from the parent."
        );
    }
});


/* =========================================================
   CREATE PROJECT CARD IFRAME
========================================================= */

function createProjectCardSlot(project, index) {
    const slot = document.createElement("iframe");

    const cardNumber = index + 1;

    slot.className = "projectCardSlot";

    slot.title =
        "Project card " + cardNumber + ": " + project.name;

    slot.loading = "eager";
    slot.scrolling = "no";

    slot.setAttribute("frameborder", "0");

    slot.dataset.projectName = project.name;
    slot.dataset.projectPath = project.path;
    slot.dataset.projectNumber = String(cardNumber);
    slot.dataset.gridPosition = String(cardNumber);

    slot.dataset.templateLoaded = "false";
    slot.dataset.projectDataSent = "false";
    slot.dataset.cardHeight = "0";

    slot.style.width = "100%";
    slot.style.height = "100px";
    slot.style.border = "0";
    slot.style.display = "block";

    slot.addEventListener("load", () => {
        slot.dataset.templateLoaded = "true";

        sendProjectDataToCard(slot);

        if (slot.contentWindow) {
            slot.contentWindow.postMessage(
                "resize-project-card",
                projectCardURL.origin
            );
        }
    });

    slot.addEventListener("error", () => {
        slot.dataset.templateLoaded = "false";

        console.error(
            "Could not load project card:",
            project.path,
            projectCardURL.href
        );
    });

    slot.src = projectCardURL.href;

    return slot;
}


/* =========================================================
   CREATE PROJECT GROUP
   PROJECT-INFO.JS OWNS GROUP CREATION AND JSON DISPLAY.
========================================================= */

function createProjectGroup(project, index) {
    return ProjectInfo.createProjectGroup({
        project: project,
        index: index,
        totalProjects: loadedProjects.length,

        createCard: (projectData, projectIndex) => {
            return createProjectCardSlot(
                projectData,
                projectIndex
            );
        }
    });
}


/* =========================================================
   DISPLAY PROJECTS
========================================================= */

function displayProjects(projects) {
    const columns = createMasonryColumns(
        elements.cards
    );

    initializeMasonryObserver();

    if (columns.length === 0) {
        return;
    }

    projects.forEach((project, index) => {
        const group = createProjectGroup(
            project,
            index
        );

        columns[index % columns.length].appendChild(group);

        if (masonryObserver) {
            masonryObserver.observe(group);
        }
    });

    scheduleMasonryReflow();
}


/* =========================================================
   LOAD PROJECTS
========================================================= */

async function loadProjects() {
    if (isLoadingProjects) {
        return;
    }

    isLoadingProjects = true;

    if (masonryObserver) {
        masonryObserver.disconnect();
        masonryObserver = null;
    }

    elements.cards.replaceChildren();

    elements.empty.hidden = true;
    elements.error.hidden = true;

    ProjectAnalysis.closeWindow();

    loadedProjects = [];
    discoveredProjectFiles = [];
    invalidProjects = [];

    elements.projectInformationSearch.value = "";

    updateStatistics(0, 0, 0);

    displayAllProjectInformation([]);

    setStatus("Starting fresh GitHub scan...");

    try {

        /* =============================================
           STEP 1: DISCOVER JSON FILES
        ============================================= */

        setStatus(
            "Scanning GitHub for the latest project JSON files..."
        );

        const files = await discoverProjectFiles();

        const totalDiscovered = discoveredProjectFiles.length;

        elements.found.textContent = totalDiscovered;

        console.log(
            "Latest GitHub scan found:",
            totalDiscovered,
            "JSON files."
        );

        if (totalDiscovered === 0) {
            elements.empty.hidden = false;

            elements.empty.textContent =
                "No JSON files were found in the GitHub projects folder or its subfolders.";

            setStatus(
                "GitHub scan complete. 0 JSON files found."
            );

            return;
        }

        if (files.length === 0) {
            elements.empty.hidden = false;

            elements.empty.textContent =
                "No project files were selected.";

            setStatus("No project files selected.");

            return;
        }


        /* =============================================
           STEP 2: LOAD JSON FILES
        ============================================= */

        setStatus(
            "Found " +
            totalDiscovered +
            " JSON files. Loading " +
            files.length +
            " selected projects..."
        );

        const results = await loadFilesWithConcurrency(
            files,
            (completed, total, file) => {
                setStatus(
                    "Loading project " +
                    completed +
                    " of " +
                    total +
                    ": " +
                    file.path
                );
            }
        );


        /* =============================================
           STEP 3: SEPARATE VALID AND INVALID PROJECTS
        ============================================= */

        const validProjects = [];
        const errors = [];

        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                validProjects.push(result.value);
            } else {
                const errorMessage =
                    result.reason?.message ||
                    "Unknown loading error.";

                errors.push(
                    files[index].path +
                    ": " +
                    errorMessage
                );

                invalidProjects.push({
                    path: files[index].path,
                    error: errorMessage
                });
            }
        });


        /* =============================================
           STEP 4: STORE VALID PROJECTS
        ============================================= */

        loadedProjects = validProjects;


        /* =============================================
           STEP 5: DISPLAY ALL PROJECT INFORMATION
        ============================================= */

        displayAllProjectInformation(loadedProjects);


        /* =============================================
           STEP 6: DISPLAY PROJECT CARDS AND JSON
        ============================================= */

        displayProjects(loadedProjects);


        /* =============================================
           STEP 7: UPDATE STATISTICS
        ============================================= */

        updateStatistics(
            totalDiscovered,
            validProjects.length,
            errors.length
        );

        if (validProjects.length === 0) {
            elements.empty.hidden = false;

            elements.empty.textContent =
                "No valid project JSON files could be loaded.";
        }


        /* =============================================
           STEP 8: DISPLAY FILE ERRORS
        ============================================= */

        if (errors.length > 0) {
            elements.error.hidden = false;
            elements.error.textContent = errors.join(" | ");
        }


        /* =============================================
           STEP 9: FINAL STATUS
        ============================================= */

        setStatus(
            "Fresh GitHub scan complete. Loaded " +
            validProjects.length +
            " of " +
            files.length +
            " selected JSON files. " +
            totalDiscovered +
            " total JSON files discovered. " +
            "Complete JSON and project information are displayed."
        );

        console.log("PROJECT LOADING COMPLETE", {
            discovered: totalDiscovered,
            selected: files.length,
            loaded: validProjects.length,
            invalid: errors.length,
            projects: loadedProjects.map(project => project.path)
        });

        if (errors.length > 0) {
            console.warn(
                "Some project JSON files could not be loaded:",
                errors
            );
        }

    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );

        loadedProjects = [];
        discoveredProjectFiles = [];

        displayAllProjectInformation([]);

        elements.error.hidden = false;
        elements.error.textContent = error.message;

        elements.empty.hidden = false;
        elements.empty.textContent = "Projects could not be loaded.";

        updateStatistics(0, 0, 0);

        setStatus(
            "Unable to complete the fresh GitHub scan: " +
            error.message,
            true
        );

    } finally {
        isLoadingProjects = false;
    }
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

elements.projectInformationSearch.addEventListener(
    "input",
    () => {
        filterProjectInformation(
            elements.projectInformationSearch.value
        );
    }
);


/* =========================================================
   RESPONSIVE INITIALIZATION
========================================================= */

function initializeResponsiveLayout() {
    previousColumnCount = getColumnCount();

    initializeContainerResizeObserver();
}


/* =========================================================
   INITIALIZE
========================================================= */

function initialize() {

    initializeResponsiveLayout();

    /* =============================================
       CONNECT PROJECT ANALYSIS
    ============================================= */

    initializeProjectAnalysis();

    /* =============================================
       EVERY PAGE LOAD STARTS A FRESH GITHUB SCAN
    ============================================= */

    loadProjects();
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initialize,
        { once: true }
    );

} else {

    initialize();

}
