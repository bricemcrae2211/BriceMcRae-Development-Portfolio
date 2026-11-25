
"use strict";

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const MAX_ATTEMPTS = 400;
    const CHECK_INTERVAL = 50;

    let writerStarted = false;
    let waitInterval = null;
    let attempts = 0;


    /* =====================================================
       SECTION DEFINITIONS
    ===================================================== */

    const SECTION_DEFINITIONS = [

        {
            id: "about",
            heading: "01. About This Game",
            fields: [
                ["projectTitle", "Project Title"],
                ["shortDescription", "Short Description"],
                ["longDescription", "Long Description"],
                ["about", "About This Game"],
                ["projectPurpose", "Project Purpose"],
                ["projectGoals", "Project Goals"],
                ["projectCategory", "Project Category"],
                ["gameGenre", "Game Genre"],
                ["gameSubgenre", "Game Subgenre"],
                ["gameType", "Game Type"],
                ["gamePerspective", "Game Perspective"],
                ["gameMode", "Game Mode"],
                ["gameTags", "Game Tags"]
            ]
        },

        {
            id: "story",
            heading: "02. Story and Setting",
            fields: [
                ["story", "Story"],
                ["worldDescription", "World Description"],
                ["worldHistory", "World History"]
            ]
        },

        {
            id: "gameplay",
            heading: "03. Gameplay",
            fields: [
                ["gameplay", "Gameplay Description"],
                ["gameplayLoop", "Gameplay Loop"],
                ["mechanics", "Game Mechanics"],
                ["multiplayer", "Multiplayer"]
            ]
        },

        {
            id: "features",
            heading: "04. Game Features",
            fields: [
                ["features", "Game Features"],
                ["uniqueFeatures", "Unique Features"],
                ["gameTags", "Game Tags"]
            ]
        },

        {
            id: "characters",
            heading: "05. Characters",
            fields: [
                ["characters", "Characters"]
            ]
        },

        {
            id: "abilities",
            heading: "06. Abilities",
            fields: []
        },

        {
            id: "anchors",
            heading: "07. Anchors",
            fields: []
        },

        {
            id: "combat",
            heading: "08. Combat",
            fields: [
                ["mechanics", "Combat and Gameplay Mechanics"]
            ]
        },

        {
            id: "enemies",
            heading: "09. Enemies",
            fields: []
        },

        {
            id: "progression",
            heading: "10. Progression",
            fields: [
                ["projectStatus", "Project Status"],
                ["releaseStatus", "Release Status"],
                ["developmentUpdates", "Development Updates"]
            ]
        },

        {
            id: "arena",
            heading: "11. Arena and Environment",
            fields: [
                ["worldDescription", "World Description"],
                ["worldHistory", "World History"]
            ]
        },

        {
            id: "camera",
            heading: "12. Camera",
            fields: [
                ["gamePerspective", "Game Perspective"]
            ]
        },

        {
            id: "controls",
            heading: "13. Controls",
            fields: [
                ["platforms", "Supported Platforms"]
            ]
        },

        {
            id: "technical",
            heading: "14. Technical Information",
            fields: [
                ["engine", "Game Engine"],
                ["engineVersion", "Engine Version"],
                ["languages", "Programming Languages"],
                ["platforms", "Platforms"],
                ["technologies", "Technologies"],
                ["technicalAdditional", "Additional Technical Information"],
                ["technicalArchitecture", "Technical Architecture"],
                ["technicalPerformance", "Technical Performance"],
                ["technicalImplementation", "Technical Implementation"]
            ]
        },

        {
            id: "technicalSystems",
            heading: "15. Technical Systems",
            fields: [
                ["technicalSystems", "Technical Systems"],
                ["technicalArchitecture", "Technical Architecture"],
                ["technicalImplementation", "Technical Implementation"],
                ["technologies", "Technologies"]
            ]
        },

        {
            id: "challenges",
            heading: "16. Challenges and Performance",
            fields: [
                ["technicalChallenges", "Technical Challenges"],
                ["challengeSolutions", "Challenge Solutions"],
                ["technicalPerformance", "Technical Performance"],
                ["knownIssues", "Known Issues"]
            ]
        },

        {
            id: "development",
            heading: "17. Development",
            fields: [
                ["projectStatus", "Project Status"],
                ["releaseStatus", "Release Status"],
                ["startDate", "Development Start Date"],
                ["completionDate", "Completion Date"],
                ["yourRole", "My Role"],
                ["developmentAdditional", "Additional Development Information"],
                ["developmentUpdates", "Development Updates"]
            ]
        },

        {
            id: "milestones",
            heading: "18. Development Milestones",
            fields: [
                ["milestones", "Development Milestones"],
                ["completedMilestones", "Completed Milestones"],
                ["upcomingMilestones", "Upcoming Milestones"]
            ]
        },

        {
            id: "contributions",
            heading: "19. My Contributions",
            fields: [
                ["contributions", "My Contributions"],
                ["individualResponsibilities", "Individual Responsibilities"],
                ["developmentCredits", "Development Credits"]
            ]
        },

        {
            id: "team",
            heading: "20. Development Team",
            fields: [
                ["teamSize", "Team Size"],
                ["teamInformation", "Team Information"],
                ["teamMembers", "Team Members"],
                ["teamResponsibilities", "Team Responsibilities"]
            ]
        },

        {
            id: "tools",
            heading: "21. Tools and Software",
            fields: [
                ["developmentTools", "Development Tools"],
                ["versionControl", "Version Control"],
                ["softwareTools", "Software Tools"],
                ["technologies", "Technologies"]
            ]
        },

        {
            id: "learning",
            heading: "22. What I Learned",
            fields: [
                ["learning", "What I Learned"],
                ["skillsDeveloped", "Skills Developed"],
                ["knowledgeGained", "Knowledge Gained"],
                ["lessonsLearned", "Lessons Learned"]
            ]
        },

        {
            id: "future",
            heading: "23. Future Plans",
            fields: [
                ["future", "Future Plans"],
                ["plannedFeatures", "Planned Features"],
                ["knownIssues", "Known Issues"]
            ]
        },

        {
            id: "requirements",
            heading: "24. System Requirements",
            fields: [
                ["minimumRequirements", "Minimum Requirements"],
                ["recommendedRequirements", "Recommended Requirements"],
                ["platforms", "Supported Platforms"]
            ]
        }

    ];


    /* =====================================================
       GET PROJECT INFORMATION
    ===================================================== */

    function getProjectInformation() {

        if (
            window.ProjectInformationLoader &&
            typeof window.ProjectInformationLoader.get === "function"
        ) {

            const information =
                window.ProjectInformationLoader.get();

            if (information) {
                return information;
            }

        }

        return window.SelectedProjectInformation || null;

    }


    /* =====================================================
       PARSE PROJECT JSON
    ===================================================== */

    function parseProjectJSON(project) {

        if (!project) {
            return null;
        }

        if (typeof project === "string") {

            try {

                project = JSON.parse(project);

            } catch (error) {

                console.error(
                    "GAME INFORMATION WRITER: JSON parsing failed.",
                    error
                );

                return null;

            }

        }

        if (
            typeof project !== "object" ||
            Array.isArray(project)
        ) {
            return null;
        }

        return project;

    }


    /* =====================================================
       GET ACTUAL PROJECT DATA
    ===================================================== */

    function getProjectData(information) {

        if (!information) {
            return {};
        }

        const possibleProjects = [

            information.projectJSON,

            information.completeSavedRecord &&
                information.completeSavedRecord.project,

            information.completeSavedRecord &&
                information.completeSavedRecord.projectJSON,

            information.completeSavedRecord &&
                information.completeSavedRecord.json,

            information.completeSavedRecord &&
                information.completeSavedRecord.data

        ];

        for (let i = 0; i < possibleProjects.length; i++) {

            const project =
                parseProjectJSON(possibleProjects[i]);

            if (
                project &&
                Object.keys(project).length > 0
            ) {

                return project;

            }

        }

        return {};

    }


    /* =====================================================
       FORMAT PROJECT VALUE
    ===================================================== */

    function formatProjectValue(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "";
        }

        if (Array.isArray(value)) {

            return value
                .map(item => formatProjectValue(item))
                .filter(item => item !== "")
                .join(", ");

        }

        if (typeof value === "object") {

            return JSON.stringify(
                value,
                null,
                2
            );

        }

        return String(value);

    }


    /* =====================================================
       GET PROJECT VALUE
    ===================================================== */

    function getProjectValue(project, fieldName) {

        if (!project) {
            return "";
        }

        return formatProjectValue(
            project[fieldName]
        );

    }


    /* =====================================================
       CREATE SECTION CONTENT CONTAINER
    ===================================================== */

    function getSectionContentContainer(section) {

        let container =
            section.querySelector(
                ":scope > .generated-project-information"
            );

        if (!container) {

            container =
                document.createElement("div");

            container.className =
                "generated-project-information";

            container.setAttribute(
                "data-generated-project-information",
                "true"
            );

            section.appendChild(container);

        }

        return container;

    }


    /* =====================================================
       WRITE ONE FIELD
    ===================================================== */

    function writeSectionField(container, fieldName, label, value) {

        const fieldContainer =
            document.createElement("div");

        fieldContainer.className =
            "project-information-field";

        fieldContainer.dataset.projectField =
            fieldName;

        const heading =
            document.createElement("h3");

        heading.textContent = label;

        const paragraph =
            document.createElement("p");

        paragraph.textContent =
            value || "No information provided.";

        fieldContainer.appendChild(heading);
        fieldContainer.appendChild(paragraph);

        container.appendChild(fieldContainer);

    }


    /* =====================================================
       WRITE ABOUT DESCRIPTION IDS
    ===================================================== */

    function writeAboutDescription(project) {

        const shortDescription =
            document.getElementById(
                "aboutShortDescription"
            );

        const longDescription =
            document.getElementById(
                "aboutLongDescription"
            );

        if (shortDescription) {

            let paragraph =
                shortDescription.querySelector("p");

            if (!paragraph) {

                paragraph =
                    document.createElement("p");

                shortDescription.appendChild(paragraph);

            }

            paragraph.textContent =
                getProjectValue(
                    project,
                    "shortDescription"
                ) || "No information provided.";

        }

        if (longDescription) {

            let paragraph =
                longDescription.querySelector("p");

            if (!paragraph) {

                paragraph =
                    document.createElement("p");

                longDescription.appendChild(paragraph);

            }

            paragraph.textContent =
                getProjectValue(
                    project,
                    "longDescription"
                ) || "No information provided.";

        }

    }


    /* =====================================================
       WRITE ONE GAME SECTION
    ===================================================== */

    function writeGameSection(project, definition) {

        const section =
            document.getElementById(
                definition.id
            );

        if (!section) {
            return false;
        }

        const container =
            getSectionContentContainer(section);

        container.replaceChildren();

        if (
            definition.id === "about"
        ) {

            writeAboutDescription(project);

        }

        if (definition.fields.length === 0) {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                "No saved project fields are currently assigned to this section.";

            container.appendChild(paragraph);

            return true;

        }

        definition.fields.forEach(field => {

            const fieldName = field[0];
            const fieldLabel = field[1];

            const value =
                getProjectValue(
                    project,
                    fieldName
                );

            writeSectionField(
                container,
                fieldName,
                fieldLabel,
                value
            );

        });

        return true;

    }


    /* =====================================================
       WRITE ALL 24 GAME SECTIONS
    ===================================================== */

    function writeAllGameSections() {

        const information =
            getProjectInformation();

        if (!information) {
            return false;
        }

        const project =
            getProjectData(information);

        if (
            !project ||
            Object.keys(project).length === 0
        ) {

            console.error(
                "GAME INFORMATION WRITER: Project JSON not found.",
                information
            );

            return false;

        }

        let completedSections = 0;

        SECTION_DEFINITIONS.forEach(definition => {

            if (
                writeGameSection(
                    project,
                    definition
                )
            ) {

                completedSections++;

            }

        });

        console.log(
            "GAME INFORMATION WRITER:",
            completedSections,
            "of 24 sections written."
        );

        console.log(
            "GAME INFORMATION WRITER: Project title:",
            getProjectValue(
                project,
                "projectTitle"
            )
        );

        return completedSections === 24;

    }


    /* =====================================================
       CHECK ALL 24 SECTIONS
    ===================================================== */

    function areAllSectionsLoaded() {

        return SECTION_DEFINITIONS.every(definition => {

            return Boolean(
                document.getElementById(
                    definition.id
                )
            );

        });

    }


    /* =====================================================
       WAIT FOR PROJECT AND HTML SECTIONS
    ===================================================== */

    function waitForInformation() {

        if (
            getProjectInformation() &&
            areAllSectionsLoaded() &&
            writeAllGameSections()
        ) {

            if (waitInterval) {

                clearInterval(waitInterval);

                waitInterval = null;

            }

            console.log(
                "GAME INFORMATION WRITER: All 24 sections loaded successfully."
            );

            return;

        }

        attempts++;

        if (attempts >= MAX_ATTEMPTS) {

            if (waitInterval) {

                clearInterval(waitInterval);

                waitInterval = null;

            }

            console.error(
                "GAME INFORMATION WRITER: Loading timed out."
            );

            console.log(
                "All 24 sections loaded:",
                areAllSectionsLoaded()
            );

            console.log(
                "Project information:",
                getProjectInformation()
            );

        }

    }


    /* =====================================================
       INITIALIZE WRITER
    ===================================================== */

    function initializeWriter() {

        if (writerStarted) {
            return;
        }

        writerStarted = true;

        if (
            areAllSectionsLoaded() &&
            writeAllGameSections()
        ) {
            return;
        }

        waitInterval = setInterval(
            waitForInformation,
            CHECK_INTERVAL
        );

        waitForInformation();

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeWriter,
            { once: true }
        );

    } else {

        initializeWriter();

    }


    /* =====================================================
       GAME SECTIONS LOADED EVENT
    ===================================================== */

    window.addEventListener(
        "gameSectionsLoaded",
        function () {

            attempts = 0;

            if (!waitInterval) {

                waitInterval = setInterval(
                    waitForInformation,
                    CHECK_INTERVAL
                );

            }

            waitForInformation();

        }
    );


    /* =====================================================
       PROJECT INFORMATION UPDATED EVENT
    ===================================================== */

    window.addEventListener(
        "projectInformationUpdated",
        function () {

            attempts = 0;

            waitForInformation();

        }
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.GameInformationWriter = Object.freeze({

        writeAllGameSections,

        writeGameSection,

        getProjectData,

        sections: SECTION_DEFINITIONS

    });

})();
