
// "use strict";

// document.addEventListener("DOMContentLoaded", async () => {

//     /* =====================================================
//        SETTINGS
//     ===================================================== */

//     const STORAGE_KEY = "selectedProjectInformation";

//     const GITHUB_OWNER = "bricemcrae2211";
//     const GITHUB_REPOSITORY = "bricemcraeMyPortfolioSite.github.io";
//     const GITHUB_BRANCH = "main";
//     const GITHUB_PROJECT_FOLDER = "projects";

//     const MISSING_VALUE = "NA";

//     const ALLOWED_SECTIONS = [
//         "About This Game",
//         "Game Information",
//         "Story and Setting",
//         "Gameplay",
//         "Game Features",
//         "Characters",
//         "Abilities",
//         "Anchors",
//         "Combat",
//         "Enemies",
//         "Progression",
//         "Arena and Environment",
//         "Camera",
//         "Controls",
//         "Technical Information",
//         "Technical Systems",
//         "Challenges and Performance",
//         "Development",
//         "Development Milestones",
//         "My Contributions",
//         "Development Team",
//         "Tools and Software",
//         "What I Learned",
//         "Future Plans",
//         "System Requirements",
//         "Project Links",
//         "Credits",
//         "Project Documents",
//         "Additional Information"
//     ];

//     const pageInformation = window.GamePageInformation;

//     if (!pageInformation) {
//         console.error("GamePageInformation was not loaded.");
//         return;
//     }

//     /* =====================================================
//        DEBUG INFORMATION
//     ===================================================== */

//     const debugData = {
//         status: "INITIALIZING",
//         selectedProject: null,
//         projectJSON: null,
//         projectFields: {},
//         pageFields: {},
//         missingFields: [],
//         errors: [],
//         transferReport: {}
//     };

//     /* =====================================================
//        INFORMATION HELPERS
//     ===================================================== */

//     function isMissing(value) {
//         if (value === undefined || value === null) {
//             return true;
//         }

//         if (typeof value === "string") {
//             return [
//                 "",
//                 "na",
//                 "n/a",
//                 "none",
//                 "null",
//                 "undefined"
//             ].includes(value.trim().toLowerCase());
//         }

//         if (Array.isArray(value)) {
//             return !value.some(item => !isMissing(item));
//         }

//         if (typeof value === "object") {
//             return Object.values(value).every(isMissing);
//         }

//         return false;
//     }

//     function getDisplayText(value) {
//         if (isMissing(value)) {
//             return MISSING_VALUE;
//         }

//         if (Array.isArray(value)) {
//             return value
//                 .filter(item => !isMissing(item))
//                 .map(getDisplayText)
//                 .join(", ");
//         }

//         if (typeof value === "object") {
//             return JSON.stringify(value);
//         }

//         return String(value);
//     }

//     function normalizeSectionTitle(value) {
//         return String(value || "")
//             .replace(/^\s*\d+\s*/, "")
//             .replace(/^[.\-:)\s]+/, "")
//             .trim()
//             .toLowerCase();
//     }

//     function formatLabel(value) {
//         return value
//             .replace(/([A-Z])/g, " $1")
//             .replace(/^./, character => character.toUpperCase());
//     }

//     function createElement(tag, className, text) {
//         const element = document.createElement(tag);

//         if (className) {
//             element.className = className;
//         }

//         if (text !== undefined && text !== null) {
//             element.textContent = String(text);
//         }

//         return element;
//     }

//     /* =====================================================
//        RENDER PROJECT INFORMATION
//     ===================================================== */

//     function renderValue(value, container) {
//         if (isMissing(value)) {
//             container.appendChild(
//                 createElement("p", "project-data-text", MISSING_VALUE)
//             );
//             return;
//         }

//         if (Array.isArray(value)) {
//             const items = value.filter(item => !isMissing(item));

//             if (items.length === 0) {
//                 container.appendChild(
//                     createElement("p", "project-data-text", MISSING_VALUE)
//                 );
//                 return;
//             }

//             const list = createElement("ul", "project-data-list");

//             items.forEach(item => {
//                 const listItem = createElement("li");
//                 renderValue(item, listItem);
//                 list.appendChild(listItem);
//             });

//             container.appendChild(list);
//             return;
//         }

//         if (typeof value === "object") {
//             const objectContainer = createElement(
//                 "div",
//                 "project-data-object"
//             );

//             const entries = Object.entries(value);

//             if (entries.length === 0) {
//                 container.appendChild(
//                     createElement("p", "project-data-text", MISSING_VALUE)
//                 );
//                 return;
//             }

//             entries.forEach(([key, item]) => {
//                 const row = createElement("div", "project-data-row");

//                 const label = createElement(
//                     "strong",
//                     "project-data-label",
//                     formatLabel(key)
//                 );

//                 const content = createElement(
//                     "div",
//                     "project-data-value"
//                 );

//                 renderValue(item, content);

//                 row.append(label, content);
//                 objectContainer.appendChild(row);
//             });

//             container.appendChild(objectContainer);
//             return;
//         }

//         container.appendChild(
//             createElement("p", "project-data-text", String(value))
//         );
//     }

//     /* =====================================================
//        READ SELECTED PROJECT
//     ===================================================== */

//     function readSelectedProject() {
//         const stored = localStorage.getItem(STORAGE_KEY);

//         if (!stored) {
//             throw new Error(
//                 "No selected project was found in local storage."
//             );
//         }

//         const selectedProject = JSON.parse(stored);

//         if (
//             !selectedProject ||
//             typeof selectedProject !== "object" ||
//             Array.isArray(selectedProject)
//         ) {
//             throw new Error("Selected project information is invalid.");
//         }

//         return selectedProject;
//     }

//     /* =====================================================
//        GET PROJECT JSON
//     ===================================================== */

//     function extractProjectJSON(selectedProject) {
//         const candidates = [
//             selectedProject.project,
//             selectedProject.projectJSON,
//             selectedProject.json,
//             selectedProject.data,
//             selectedProject.gameInformation,
//             selectedProject.completeSavedRecord?.project,
//             selectedProject.completeSavedRecord?.projectJSON
//         ];

//         for (const candidate of candidates) {
//             if (
//                 candidate &&
//                 typeof candidate === "object" &&
//                 !Array.isArray(candidate)
//             ) {
//                 return candidate;
//             }

//             if (typeof candidate === "string") {
//                 try {
//                     const parsed = JSON.parse(candidate);

//                     if (
//                         parsed &&
//                         typeof parsed === "object" &&
//                         !Array.isArray(parsed)
//                     ) {
//                         return parsed;
//                     }
//                 } catch (error) {
//                     debugData.errors.push(error.message);
//                 }
//             }
//         }

//         return null;
//     }

//     function getJSONFilename(selectedProject) {
//         return (
//             selectedProject.jsonFile?.name ||
//             selectedProject.filename ||
//             selectedProject.completeSavedRecord?.filename ||
//             selectedProject.jsonFilename ||
//             selectedProject.projectMetadata?.filename ||
//             null
//         );
//     }

//     async function fetchProjectJSON(filename) {
//         if (!filename) {
//             throw new Error(
//                 "No project JSON or JSON filename was provided."
//             );
//         }

//         const cleanFilename = filename
//             .replace(/^\/+/, "")
//             .replace(/^projects\//, "")
//             .split("/")
//             .map(encodeURIComponent)
//             .join("/");

//         const url =
//             "https://raw.githubusercontent.com/" +
//             GITHUB_OWNER + "/" +
//             GITHUB_REPOSITORY + "/" +
//             GITHUB_BRANCH + "/" +
//             GITHUB_PROJECT_FOLDER + "/" +
//             cleanFilename;

//         const response = await fetch(url, {
//             method: "GET",
//             cache: "no-store"
//         });

//         if (!response.ok) {
//             throw new Error(
//                 "Unable to retrieve project JSON. HTTP " +
//                 response.status
//             );
//         }

//         return await response.json();
//     }

//     async function getProjectJSON(selectedProject) {
//         const embeddedJSON = extractProjectJSON(selectedProject);

//         if (embeddedJSON) {
//             debugData.transferReport.source = "Embedded project JSON";
//             return embeddedJSON;
//         }

//         const filename = getJSONFilename(selectedProject);

//         debugData.transferReport.source = "GitHub JSON retrieval";
//         debugData.transferReport.filename = filename;

//         return await fetchProjectJSON(filename);
//     }

//     /* =====================================================
//        WAIT FOR HTML SECTIONS
//     ===================================================== */

//     function waitForSections() {
//         if (window.GameSectionsLoaded === true) {
//             return Promise.resolve();
//         }

//         if (
//             window.GameSectionsLoaded === false &&
//             window.GameSectionsLoadAttempted === true
//         ) {
//             return Promise.reject(
//                 new Error("The game sections failed to load.")
//             );
//         }

//         return new Promise((resolve, reject) => {
//             let timeout;

//             function cleanup() {
//                 window.removeEventListener("gameSectionsLoaded", loaded);
//                 window.removeEventListener("gameSectionsLoadFailed", failed);
//                 clearTimeout(timeout);
//             }

//             function loaded() {
//                 if (window.GameSectionsLoaded !== true) return;

//                 cleanup();
//                 resolve();
//             }

//             function failed(event) {
//                 cleanup();

//                 reject(
//                     new Error(
//                         event.detail?.error ||
//                         "The game sections failed to load."
//                     )
//                 );
//             }

//             window.addEventListener("gameSectionsLoaded", loaded);
//             window.addEventListener("gameSectionsLoadFailed", failed);

//             timeout = setTimeout(() => {
//                 cleanup();
//                 reject(
//                     new Error("Timed out waiting for game information sections.")
//                 );
//             }, 20000);

//             if (window.GameSectionsLoaded === true) {
//                 loaded();
//             }
//         });
//     }

//     /* =====================================================
//        GAME INFORMATION FIELD MAPPING

//        These fields are read directly from the project JSON.
//        Missing JSON properties display NA.
//     ===================================================== */

//     function getGameInformation(project) {
//         const firstAvailable = (...keys) => {
//             for (const key of keys) {
//                 if (!isMissing(project[key])) {
//                     return project[key];
//                 }
//             }

//             return MISSING_VALUE;
//         };

//         return {
//             developer: firstAvailable("developer", "developerName"),
//             engine: firstAvailable("engine"),
//             languages: firstAvailable("languages", "language"),
//             platforms: firstAvailable("platforms", "platform"),
//             releaseDate: firstAvailable("releaseDate"),
//             status: firstAvailable("projectStatus", "releaseStatus"),
//             genre: firstAvailable("gameGenre", "gameSubgenre"),
//             gameMode: firstAvailable("gameMode"),
//             perspective: firstAvailable("gamePerspective"),
//             ageRating: firstAvailable("ageRating")
//         };
//     }

//     const GAME_INFORMATION_LABELS = {
//         developer: "Developer",
//         engine: "Engine",
//         languages: "Language",
//         platforms: "Platform",
//         releaseDate: "Release Date",
//         status: "Status",
//         genre: "Genre",
//         gameMode: "Game Mode",
//         perspective: "Perspective",
//         ageRating: "Age Rating"
//     };

//     /* =====================================================
//        GET ALLOWED PAGE SECTIONS
//     ===================================================== */

//     function getAllowedSectionDefinitions() {
//         const definitions = {};
//         const allowedNames = ALLOWED_SECTIONS.map(normalizeSectionTitle);

//         for (const [sectionID, definition] of Object.entries(
//             pageInformation.sections
//         )) {
//             const section = document.getElementById(sectionID);
//             const heading = section?.querySelector(".section-heading");

//             if (!section || !heading) {
//                 continue;
//             }

//             const title = normalizeSectionTitle(heading.textContent);

//             if (allowedNames.includes(title)) {
//                 definitions[sectionID] = definition;
//             }
//         }

//         return definitions;
//     }

//     /* =====================================================
//        GET PROJECT FIELD VALUES
//     ===================================================== */

//     function createPageFieldReport(project, definitions) {
//         const allValues = pageInformation.getFieldValues(project) || {};

//         const allowedFields = new Set([
//             "projectTitle",
//             "shortDescription",
//             "longDescription"
//         ]);

//         Object.values(definitions).forEach(definition => {
//             (definition.fields || []).forEach(field => {
//                 allowedFields.add(field);
//             });
//         });

//         const values = {};
//         const report = {};

//         debugData.missingFields = [];

//         allowedFields.forEach(field => {
//             const value = allValues[field];

//             values[field] = value;

//             const missing = isMissing(value);

//             report[field] = {
//                 received: !missing,
//                 value: getDisplayText(value)
//             };

//             if (missing) {
//                 debugData.missingFields.push(field);
//             }
//         });

//         debugData.projectFields = values;
//         debugData.pageFields = report;

//         return values;
//     }

//     /* =====================================================
//        ABOUT THIS GAME
//     ===================================================== */

//     function populateHero(values) {
//         const title = document.getElementById("gameTitle");
//         const description = document.getElementById("gameDescription");

//         if (title) {
//             title.textContent = getDisplayText(values.projectTitle);
//         }

//         if (description) {
//             description.textContent = getDisplayText(
//                 !isMissing(values.shortDescription)
//                     ? values.shortDescription
//                     : values.longDescription
//             );
//         }
//     }

//     /* =====================================================
//        POPULATE GAME INFORMATION AND OTHER SECTIONS
//     ===================================================== */

//     function populateSections(values, definitions, project) {
//         const gameInformation = getGameInformation(project);

//         for (const [sectionID, definition] of Object.entries(definitions)) {
//             const section = document.getElementById(sectionID);

//             if (!section) continue;

//             const heading = section.querySelector(".section-heading");

//             if (!heading) continue;

//             const isGameInformation =
//                 normalizeSectionTitle(heading.textContent) ===
//                 normalizeSectionTitle("Game Information");

//             section.replaceChildren(heading);

//             let hasInformation = false;

//             let fields = [...(definition.fields || [])];

//             if (isGameInformation) {
//                 fields = [
//                     ...new Set([
//                         ...fields,
//                         ...Object.keys(GAME_INFORMATION_LABELS)
//                     ])
//                 ];
//             }

//             fields.forEach(field => {
//                 const value = isGameInformation &&
//                     Object.prototype.hasOwnProperty.call(gameInformation, field)
//                     ? gameInformation[field]
//                     : values[field];

//                 const fieldContainer = createElement(
//                     "div",
//                     "project-loaded-field"
//                 );

//                 const fieldHeading = createElement(
//                     "h3",
//                     "project-loaded-heading",
//                     isGameInformation
//                         ? GAME_INFORMATION_LABELS[field] || formatLabel(field)
//                         : formatLabel(field)
//                 );

//                 const fieldContent = createElement(
//                     "div",
//                     "project-loaded-content"
//                 );

//                 renderValue(value, fieldContent);

//                 fieldContainer.append(fieldHeading, fieldContent);
//                 section.appendChild(fieldContainer);

//                 if (!isMissing(value)) {
//                     hasInformation = true;
//                 }
//             });

//             if (!hasInformation) {
//                 section.appendChild(
//                     createElement(
//                         "p",
//                         "project-section-missing",
//                         MISSING_VALUE
//                     )
//                 );
//             }

//             section.hidden = false;
//         }
//     }

//     /* =====================================================
//        LOAD GAME PAGE
//     ===================================================== */

//     let loadingPromise = null;

//     async function loadGamePage() {
//         if (loadingPromise) {
//             return loadingPromise;
//         }

//         loadingPromise = performGamePageLoad();

//         try {
//             return await loadingPromise;
//         } finally {
//             loadingPromise = null;
//         }
//     }

//     async function performGamePageLoad() {
//         debugData.status = "LOADING";
//         debugData.errors = [];
//         debugData.missingFields = [];
//         debugData.transferReport = {};

//         try {
//             debugData.selectedProject = readSelectedProject();

//             const [project] = await Promise.all([
//                 getProjectJSON(debugData.selectedProject),
//                 waitForSections()
//             ]);

//             debugData.projectJSON = project;

//             if (
//                 !project ||
//                 typeof project !== "object" ||
//                 Object.keys(project).length === 0
//             ) {
//                 throw new Error("The project JSON is empty.");
//             }

//             const definitions = getAllowedSectionDefinitions();

//             if (Object.keys(definitions).length === 0) {
//                 throw new Error(
//                     "No matching project information sections were found."
//                 );
//             }

//             const values = createPageFieldReport(project, definitions);

//             populateHero(values);
//             populateSections(values, definitions, project);

//             const populatedSections = Object.keys(definitions);

//             debugData.transferReport.completed = true;
//             debugData.transferReport.projectTitle =
//                 getDisplayText(values.projectTitle);
//             debugData.transferReport.sectionsPopulated =
//                 populatedSections.length;
//             debugData.transferReport.sectionNames =
//                 populatedSections.map(sectionID => {
//                     return document.getElementById(sectionID)
//                         ?.querySelector(".section-heading")
//                         ?.textContent.trim() || sectionID;
//                 });

//             debugData.transferReport.gameInformation =
//                 getGameInformation(project);

//             debugData.status = "SUCCESS";

//             document.documentElement.dataset.projectLoaded = "true";

//         } catch (error) {
//             debugData.status = "FAILED";
//             debugData.errors.push(error.message);
//             debugData.transferReport.completed = false;

//             console.error("Game information loading failed:", error);
//         }

//         window.GamePageLoadedData = debugData;

//         window.dispatchEvent(
//             new CustomEvent("gamePageInformationLoaded", {
//                 detail: debugData
//             })
//         );

//         console.log("GAME PAGE INFORMATION:", debugData);

//         return debugData;
//     }

//     /* =====================================================
//        INITIALIZE
//     ===================================================== */

//     await loadGamePage();

//     window.GameInformationLoader = Object.freeze({
//         reload: loadGamePage,
//         getData: () => debugData
//     });

// });
