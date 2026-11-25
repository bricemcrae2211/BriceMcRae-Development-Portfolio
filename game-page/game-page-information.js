
// "use strict";

// window.GamePageInformation = (() => {

//     /* =====================================================
//        SETTINGS
//     ===================================================== */

//     const MISSING_VALUE = "NA";


//     /* =====================================================
//        FIELD DEFINITIONS

//        INFORMATION ONLY.

//        THIS MODULE MUST NEVER:

//        - Load images or photos.
//        - Load videos.
//        - Read image or video URLs.
//        - Access media elements.
//        - Access media containers.
//        - Create media elements.
//        - Modify the DOM.
//        - Load downloads.
//        - Load ratings or reviews.

//        External systems are handled separately.
//     ===================================================== */

//     const fields = {

//         /* PROJECT INFORMATION */

//         projectTitle: ["projectTitle", "title", "name"],
//         shortDescription: ["shortDescription", "description"],
//         longDescription: ["longDescription", "about", "overview"],

//         projectId: ["projectId", "id"],
//         version: ["version", "projectVersion"],
//         build: ["build", "buildNumber"],

//         /* STORY AND WORLD */

//         story: ["story", "narrative", "gameStory"],
//         world: ["world", "worldDescription", "setting"],
//         worldBuilding: ["worldBuilding", "worldInformation"],

//         characters: ["characters", "characterInformation"],
//         characterDevelopment: ["characterDevelopment"],

//         /* GAMEPLAY */

//         gameplay: ["gameplay", "gameplayDescription"],
//         mechanics: ["mechanics", "gameplayMechanics"],
//         controls: ["controls", "controlScheme"],
//         features: ["features", "gameFeatures"],

//         gameMode: ["gameMode", "mode", "gameModes"],
//         multiplayer: ["multiplayer", "multiplayerInformation"],
//         perspective: ["perspective", "cameraPerspective"],

//         /* ABILITIES AND SYSTEMS */

//         abilities: ["abilities", "playerAbilities"],
//         abilitySystem: ["abilitySystem", "anchorSystem", "anchors"],

//         combat: ["combat", "combatSystem"],
//         enemies: ["enemies", "enemyAI", "enemyInformation"],
//         progression: ["progression", "progressionSystem"],

//         environment: ["environment", "environmentSystem"],
//         arena: ["arena", "arenaSystem", "arenaInformation"],
//         camera: ["camera", "cameraSystem"],

//         /* TECHNICAL INFORMATION */

//         technical: ["technical", "technicalOverview"],
//         technicalSystems: ["technicalSystems", "systems"],
//         technicalAdditional: ["technicalAdditional"],

//         technicalChallenges: ["technicalChallenges", "challenges"],
//         performance: ["performance", "optimizations"],

//         achievements: ["achievements", "projectAchievements"],

//         /* DEVELOPMENT */

//         development: ["development", "developmentProcess"],
//         milestones: ["milestones", "developmentMilestones"],
//         updates: ["updates", "developmentUpdates"],

//         contributions: ["contributions", "individualContributions"],
//         learning: ["learning", "learningOutcomes"],

//         limitations: ["limitations", "knownLimitations"],
//         futureDevelopment: ["futureDevelopment", "futurePlans"],

//         /* TEAM */

//         team: ["team", "teamMembers"],
//         teamSize: ["teamSize"],
//         role: ["role", "developerRole"],

//         /* DEVELOPMENT TOOLS */

//         tools: ["tools", "developmentTools", "softwareTools"],
//         software: ["software", "developmentSoftware"],
//         hardware: ["hardware", "developmentHardware"],

//         /* GAME INFORMATION */

//         platforms: ["platforms", "platform"],
//         tags: ["tags", "categories"],

//         genre: ["genre"],
//         subgenre: ["subgenre", "subGenre"],
//         type: ["type", "projectType"],
//         ageRating: ["ageRating", "rating"],

//         /* ENGINE AND PROGRAMMING */

//         developer: ["developer", "studio", "company"],
//         engine: ["engine", "gameEngine"],
//         engineVersion: ["engineVersion"],

//         language: ["language", "programmingLanguage"],
//         languages: ["languages", "supportedLanguages"],

//         /* STATUS AND DATES */

//         status: ["status", "developmentStatus"],
//         releaseStatus: ["releaseStatus"],

//         releaseDate: ["releaseDate"],
//         startDate: ["startDate"],
//         endDate: ["endDate"],

//         lastUpdated: ["lastUpdated", "updatedAt"],

//         /* REQUIREMENTS */

//         minimumRequirements: [
//             "minimumRequirements",
//             "minimumSystemRequirements"
//         ],

//         recommendedRequirements: [
//             "recommendedRequirements",
//             "recommendedSystemRequirements"
//         ],

//         /* DOCUMENTS */

//         documents: ["documents", "projectDocuments"],

//         /* CREDITS */

//         audioCredits: ["audioCredits"],
//         credits: ["credits", "projectCredits"]

//     };


//     /* =====================================================
//        PAGE SECTION DEFINITIONS

//        INFORMATION SECTIONS ONLY.

//        NO GALLERY.
//        NO VIDEOS.
//        NO DOWNLOADS.
//        NO RATINGS.
//        NO REVIEWS.
//        NO MEDIA SETTINGS.
//     ===================================================== */

//     const sections = {

//         /* 01 */

//         about: {
//             title: "About This Game",
//             fields: [
//                 "longDescription",
//                 "shortDescription"
//             ]
//         },

//         /* 02 */

//         story: {
//             title: "Story and World",
//             fields: [
//                 "story",
//                 "world",
//                 "worldBuilding"
//             ]
//         },

//         /* 03 */

//         gameplay: {
//             title: "Gameplay",
//             fields: [
//                 "gameplay",
//                 "mechanics",
//                 "gameMode",
//                 "multiplayer"
//             ]
//         },

//         /* 04 */

//         features: {
//             title: "Game Features",
//             fields: [
//                 "features"
//             ]
//         },

//         /* 05 */

//         characters: {
//             title: "Characters",
//             fields: [
//                 "characters",
//                 "characterDevelopment"
//             ]
//         },

//         /* 06 */

//         abilities: {
//             title: "Player Abilities",
//             fields: [
//                 "abilities"
//             ]
//         },

//         /* 07 */

//         anchors: {
//             title: "Special Ability System",
//             fields: [
//                 "abilitySystem"
//             ]
//         },

//         /* 08 */

//         combat: {
//             title: "Combat System",
//             fields: [
//                 "combat"
//             ]
//         },

//         /* 09 */

//         enemies: {
//             title: "Enemy AI and Progression",
//             fields: [
//                 "enemies"
//             ]
//         },

//         /* 10 */

//         progression: {
//             title: "Progression System",
//             fields: [
//                 "progression"
//             ]
//         },

//         /* 11 */

//         arena: {
//             title: "Arena and Environment Systems",
//             fields: [
//                 "arena",
//                 "environment"
//             ]
//         },

//         /* 12 */

//         camera: {
//             title: "Camera Systems",
//             fields: [
//                 "camera",
//                 "perspective"
//             ]
//         },

//         /* 13 */

//         controls: {
//             title: "Controls and Multiplayer",
//             fields: [
//                 "controls",
//                 "multiplayer"
//             ]
//         },

//         /* 14 */

//         technical: {
//             title: "Technical Overview",
//             fields: [
//                 "technical",
//                 "engine",
//                 "engineVersion",
//                 "language",
//                 "languages"
//             ]
//         },

//         /* 15 */

//         technicalSystems: {
//             title: "Technical Systems",
//             fields: [
//                 "technicalSystems"
//             ]
//         },

//         /* 16 */

//         challenges: {
//             title: "Technical Challenges and Performance",
//             fields: [
//                 "technicalChallenges",
//                 "technicalAdditional",
//                 "performance"
//             ]
//         },

//         /* 17 */

//         development: {
//             title: "Development Process",
//             fields: [
//                 "development"
//             ]
//         },

//         /* 18 */

//         milestones: {
//             title: "Development Milestones and Updates",
//             fields: [
//                 "milestones",
//                 "updates"
//             ]
//         },

//         /* 19 */

//         contributions: {
//             title: "Individual Contributions",
//             fields: [
//                 "role",
//                 "contributions"
//             ]
//         },

//         /* 20 */

//         team: {
//             title: "Team Contributions",
//             fields: [
//                 "team",
//                 "teamSize"
//             ]
//         },

//         /* 21 */

//         tools: {
//             title: "Development Tools",
//             fields: [
//                 "tools",
//                 "software",
//                 "hardware"
//             ]
//         },

//         /* 22 */

//         learning: {
//             title: "Learning Outcomes and Achievements",
//             fields: [
//                 "learning",
//                 "achievements"
//             ]
//         },

//         /* 23 */

//         future: {
//             title: "Known Limitations and Future Development",
//             fields: [
//                 "limitations",
//                 "futureDevelopment"
//             ]
//         },

//         /* 24 */

//         requirements: {
//             title: "System Requirements",
//             fields: [
//                 "minimumRequirements",
//                 "recommendedRequirements"
//             ]
//         },

//         /* 25 */

//         credits: {
//             title: "Languages and Credits",
//             fields: [
//                 "languages",
//                 "audioCredits",
//                 "credits"
//             ]
//         },

//         /* 26 */

//         documents: {
//             title: "Project Documents",
//             fields: [
//                 "documents"
//             ]
//         },

//         /* 27 */

//         additional: {
//             title: "Additional Information",
//             fields: [
//                 "technicalAdditional",
//                 "development"
//             ]
//         }

//     };


//     /* =====================================================
//        NESTED FIELD READING
//     ===================================================== */

//     function readPath(object, path) {

//         if (
//             object === null ||
//             object === undefined ||
//             typeof path !== "string"
//         ) {
//             return undefined;
//         }

//         return path.split(".").reduce((current, key) => {

//             if (
//                 current === null ||
//                 current === undefined ||
//                 typeof current !== "object"
//             ) {
//                 return undefined;
//             }

//             return current[key];

//         }, object);

//     }


//     /* =====================================================
//        FIELD VALUE VALIDATION
//     ===================================================== */

//     function isValidInformation(value) {

//         if (
//             value === undefined ||
//             value === null
//         ) {
//             return false;
//         }

//         if (typeof value === "string") {

//             const normalized = value.trim().toLowerCase();

//             const missingValues = [
//                 "",
//                 "na",
//                 "n/a",
//                 "none",
//                 "null",
//                 "undefined"
//             ];

//             return !missingValues.includes(normalized);

//         }

//         if (Array.isArray(value)) {

//             return value.some(isValidInformation);

//         }

//         return true;

//     }


//     /* =====================================================
//        NORMALIZE INFORMATION

//        Missing information becomes NA.
//        Valid information is preserved.
//     ===================================================== */

//     function normalizeInformation(value) {

//         if (!isValidInformation(value)) {

//             return MISSING_VALUE;

//         }

//         if (Array.isArray(value)) {

//             return value
//                 .filter(isValidInformation)
//                 .map(normalizeInformation);

//         }

//         if (
//             typeof value === "object" &&
//             value !== null
//         ) {

//             const result = {};

//             for (const [key, item] of Object.entries(value)) {

//                 result[key] = normalizeInformation(item);

//             }

//             return result;

//         }

//         return value;

//     }


//     /* =====================================================
//        FIELD VALUE LOOKUP

//        Returns the first valid matching alias.
//     ===================================================== */

//     function findValue(project, aliases) {

//         if (
//             !project ||
//             typeof project !== "object" ||
//             !Array.isArray(aliases)
//         ) {

//             return MISSING_VALUE;

//         }

//         for (const alias of aliases) {

//             const value = readPath(project, alias);

//             if (isValidInformation(value)) {

//                 return normalizeInformation(value);

//             }

//         }

//         return MISSING_VALUE;

//     }


//     /* =====================================================
//        GET ALL PROJECT INFORMATION

//        Every defined field receives a value.
//     ===================================================== */

//     function getFieldValues(project) {

//         const result = {};

//         for (const [fieldName, aliases] of Object.entries(fields)) {

//             result[fieldName] = findValue(project, aliases);

//         }

//         return result;

//     }


//     /* =====================================================
//        GET SECTION INFORMATION

//        Returns all fields assigned to a section.
//        Missing values are returned as NA.
//     ===================================================== */

//     function getSectionValues(project, sectionName) {

//         const section = sections[sectionName];

//         if (!section) {

//             return MISSING_VALUE;

//         }

//         const values = getFieldValues(project);

//         const result = {};

//         for (const fieldName of section.fields) {

//             result[fieldName] =
//                 values[fieldName] ?? MISSING_VALUE;

//         }

//         return result;

//     }


//     /* =====================================================
//        GET ALL SECTION INFORMATION

//        Returns information for all 27 sections.
//     ===================================================== */

//     function getAllSectionValues(project) {

//         const result = {};

//         for (const sectionName of Object.keys(sections)) {

//             result[sectionName] =
//                 getSectionValues(project, sectionName);

//         }

//         return result;

//     }


//     /* =====================================================
//        GET SECTION DEFINITIONS
//     ===================================================== */

//     function getSectionNames() {

//         return Object.keys(sections);

//     }


//     /* =====================================================
//        PUBLIC API
//     ===================================================== */

//     return Object.freeze({

//         MISSING_VALUE,

//         fields,
//         sections,

//         readPath,
//         isValidInformation,
//         normalizeInformation,
//         findValue,

//         getFieldValues,
//         getSectionValues,
//         getAllSectionValues,
//         getSectionNames

//     });

// })();
