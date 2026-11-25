
"use strict";

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY = "selectedProjectInformation";
    const LEGACY_STORAGE_KEY = "selectedGameProject";

    const GAME_PAGE_URL = "../game-page/game-page.html";

    // Keeps the original project object associated with its card.
    const projectReferences = new WeakMap();


    /* =====================================================
       ELEMENT CREATION
    ===================================================== */

    function createElement(tag, className, text = "") {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined && text !== null) {
            element.textContent = String(text);
        }

        return element;

    }


    /* =====================================================
       INFORMATION ROW
    ===================================================== */

    function createInformationRow(label, value, field) {

        const row = createElement(
            "div",
            "projectInfoDetailRow"
        );

        if (field) {
            row.dataset.infoField = field;
        }

        const name = createElement(
            "span",
            "projectInfoDetailName",
            label
        );

        const content = createElement(
            "span",
            "projectInfoDetailValue",
            value ?? "Not available"
        );

        row.append(name, content);

        return row;

    }


    /* =====================================================
       CREATE PROJECT INFORMATION DISPLAY
    ===================================================== */

    function createProjectInformation(project, index, totalProjects) {

        const cardNumber = index + 1;
        const data = project.data || {};

        const output = createElement(
            "section",
            "projectJsonOutput projectInfoCard"
        );

        output.hidden = false;

        output.dataset.projectName = project.name || "";
        output.dataset.projectPath = project.path || "";
        output.dataset.projectNumber = String(cardNumber);

        const header = createElement(
            "div",
            "projectJsonHeader projectInfoHeader"
        );

        const filename = createElement(
            "div",
            "projectJsonFilename",
            "PROJECT INFORMATION | CARD #" +
            cardNumber +
            " | FILE: " +
            (project.path || project.name || "Unknown")
        );

        const propertyCount = createElement(
            "div",
            "projectJsonPropertyCount",
            Object.keys(data).length +
            " top-level JSON properties"
        );

        header.append(filename, propertyCount);

        const details = createElement(
            "div",
            "projectInfoDetails"
        );

        details.append(

            createInformationRow(
                "Project Name",
                project.name,
                "project-name"
            ),

            createInformationRow(
                "JSON Filename",
                project.name,
                "json-filename"
            ),

            createInformationRow(
                "JSON Path",
                project.path,
                "json-path"
            ),

            createInformationRow(
                "JSON URL",
                project.url,
                "json-url"
            ),

            createInformationRow(
                "Project Title",
                data.projectTitle || data.title || data.name,
                "project-title"
            ),

            createInformationRow(
                "Project ID",
                data.projectId || data.id,
                "project-id"
            ),

            createInformationRow(
                "Card Number",
                cardNumber,
                "card-number"
            ),

            createInformationRow(
                "Original Grid Position",
                cardNumber,
                "grid-position"
            ),

            createInformationRow(
                "Total Projects",
                totalProjects,
                "total-projects"
            ),

            createInformationRow(
                "View Game Button Number",
                cardNumber,
                "button-number"
            ),

            createInformationRow(
                "View Game Button ID",
                "Not reported yet",
                "button-id"
            ),

            createInformationRow(
                "View Game Button Name",
                "Not reported yet",
                "button-name"
            ),

            createInformationRow(
                "View Game Button Status",
                "Waiting for button click",
                "button-status"
            ),

            createInformationRow(
                "Masonry Column",
                "Not calculated yet",
                "masonry-column"
            ),

            createInformationRow(
                "Position Within Column",
                "Not calculated yet",
                "position-in-column"
            )

        );

        const jsonHeading = createElement(
            "div",
            "projectInfoJSONHeading",
            "COMPLETE PROJECT JSON"
        );

        const content = createElement(
            "pre",
            "projectJsonContent projectInfoJSON"
        );

        try {

            const completeJSON = JSON.stringify(
                data,
                null,
                4
            );

            if (typeof completeJSON !== "string") {
                throw new Error(
                    "Project JSON could not be converted to text."
                );
            }

            content.textContent = completeJSON;

        } catch (error) {

            content.textContent =
                "Unable to display the complete project JSON.\n\n" +
                error.message;

            console.error(
                "Project information JSON error:",
                project.path,
                error
            );

        }

        output.append(
            header,
            details,
            jsonHeading,
            content
        );

        return output;

    }


    /* =====================================================
       CREATE PROJECT GROUP
    ===================================================== */

    function createProjectGroup(options) {

        if (!options || !options.project) {

            throw new Error(
                "ProjectInfo.createProjectGroup requires a project."
            );

        }

        if (typeof options.createCard !== "function") {

            throw new Error(
                "ProjectInfo.createProjectGroup requires a createCard function."
            );

        }

        const project = options.project;

        const index = Number(options.index) || 0;

        const totalProjects =
            Number(options.totalProjects) || 0;

        const cardNumber = index + 1;

        const group = createElement(
            "article",
            "projectGroup"
        );

        group.dataset.projectName = project.name || "";
        group.dataset.projectPath = project.path || "";
        group.dataset.projectOrder = String(index);
        group.dataset.cardNumber = String(cardNumber);
        group.dataset.gridPosition = String(cardNumber);
        group.dataset.totalProjects = String(totalProjects);

        // Preserve the complete original project object.
        projectReferences.set(group, project);

        const card = options.createCard(
            project,
            index
        );

        if (!card) {

            throw new Error(
                "The project card could not be created: " +
                project.path
            );

        }

        const information = createProjectInformation(
            project,
            index,
            totalProjects
        );

        group.append(
            card,
            information
        );

        return group;

    }


    /* =====================================================
       GET PROJECT FROM ELEMENT
    ===================================================== */

    function getProjectForElement(element) {

        if (!element) {
            return null;
        }

        const group = element.closest
            ? element.closest(".projectGroup")
            : null;

        if (!group) {
            return null;
        }

        return projectReferences.get(group) || null;

    }


    /* =====================================================
       GET CURRENT MASONRY POSITION
    ===================================================== */

    function getGridPosition(group) {

        const column = group?.parentElement;

        if (
            !column ||
            !column.classList.contains("projectMasonryColumn")
        ) {

            return {
                column: null,
                positionInColumn: null
            };

        }

        const groups = Array.from(
            column.querySelectorAll(
                ":scope > .projectGroup"
            )
        );

        return {

            column:
                Number(column.dataset.columnIndex) + 1,

            positionInColumn:
                groups.indexOf(group) + 1

        };

    }


    /* =====================================================
       UPDATE BUTTON INFORMATION
    ===================================================== */

    function updateButtonInformation(group, message = {}) {

        if (!group) {
            return null;
        }

        const projectNumber =
            Number(group.dataset.cardNumber) || 0;

        const buttonNumber =
            Number(message.buttonNumber) || projectNumber;

        const buttonId =
            message.buttonId ||
            message.buttonID ||
            message.id ||
            message.targetButtonId ||
            "Not reported by project card";

        const buttonName =
            message.buttonName ||
            message.buttonText ||
            message.label ||
            message.name ||
            "Not reported by project card";

        const position = getGridPosition(group);

        const buttonInformation = {

            number: buttonNumber,

            id: String(buttonId),

            name: String(buttonName),

            status: "Clicked"

        };

        const updates = {

            "button-number": buttonInformation.number,

            "button-id": buttonInformation.id,

            "button-name": buttonInformation.name,

            "button-status": buttonInformation.status,

            "masonry-column":
                position.column ?? "Not available",

            "position-in-column":
                position.positionInColumn ?? "Not available"

        };

        Object.entries(updates).forEach(
            ([field, value]) => {

                const target = group.querySelector(
                    '[data-info-field="' +
                    field +
                    '"] .projectInfoDetailValue'
                );

                if (target) {
                    target.textContent = String(value);
                }

            }
        );

        return {

            ...buttonInformation,

            masonryColumn: position.column,

            positionInColumn: position.positionInColumn

        };

    }


    /* =====================================================
       SAVE SELECTED PROJECT
    ===================================================== */

    function saveSelectedProject(options = {}) {

        const project = options.project;

        if (!project || !project.data) {

            throw new Error(
                "Cannot save selected project. Complete project JSON is missing."
            );

        }

        const button = options.button || {};
        const card = options.card || {};

        let completeProjectJSON;

        try {

            const serializedProject = JSON.stringify(
                project.data
            );

            if (typeof serializedProject !== "string") {

                throw new Error(
                    "Project JSON could not be serialized."
                );

            }

            completeProjectJSON = JSON.parse(
                serializedProject
            );

        } catch (error) {

            throw new Error(
                "Unable to copy complete project JSON: " +
                error.message
            );

        }

        const destinationPage = new URL(
            options.destinationPage || GAME_PAGE_URL,
            window.location.href
        ).href;

        const selectedProject = {

            version: "4.0",

            // Complete original JSON object.
            project: completeProjectJSON,

            // Original JSON file information.
            jsonFile: {

                name: project.name || null,

                path: project.path || null,

                url: project.url || null

            },

            // Project metadata.
            projectMetadata: {

                title:
                    completeProjectJSON.projectTitle ||
                    completeProjectJSON.title ||
                    completeProjectJSON.name ||
                    project.name ||
                    null,

                id:
                    completeProjectJSON.projectId ||
                    completeProjectJSON.id ||
                    null

            },

            // View Game button information.
            button: {

                number:
                    button.number ?? card.number ?? null,

                id:
                    button.id || "Not reported by project card",

                name:
                    button.name || "View Game",

                status: "Clicked",

                page:
                    button.page || null

            },

            // Project card information.
            card: {

                number:
                    card.number ?? null,

                gridPosition:
                    card.gridPosition ?? null,

                originalOrder:
                    card.originalOrder ?? null,

                masonryColumn:
                    card.masonryColumn ?? null,

                positionInColumn:
                    card.positionInColumn ?? null

            },

            totalProjects:
                options.totalProjects ?? null,

            // Source and destination information.
            pageInformation: {

                sourcePage:
                    options.sourcePage || window.location.href,

                sourceOrigin:
                    window.location.origin,

                destinationPage:
                    destinationPage,

                buttonPage:
                    button.page || null

            },

            selectedAt:
                new Date().toISOString(),

            // Storage verification information.
            transferReport: {

                storageType: "localStorage",

                storageKey: STORAGE_KEY,

                storageWriteSucceeded: false

            }

        };

        const serialized = JSON.stringify(
            selectedProject
        );

        try {

            // Write to localStorage.
            localStorage.setItem(
                STORAGE_KEY,
                serialized
            );

            // Read the saved information back.
            const savedText = localStorage.getItem(
                STORAGE_KEY
            );

            if (!savedText) {

                throw new Error(
                    "Saved project could not be read back from localStorage."
                );

            }

            const verification = JSON.parse(
                savedText
            );

            if (
                !verification.project ||
                typeof verification.project !== "object"
            ) {

                throw new Error(
                    "The saved project JSON is incomplete."
                );

            }

            if (
                !verification.jsonFile ||
                !verification.button ||
                !verification.card
            ) {

                throw new Error(
                    "Some selected project information is missing."
                );

            }

            // Mark the verified storage write.
            verification.transferReport.storageWriteSucceeded = true;

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(verification)
            );

            // Remove obsolete storage records.
            localStorage.removeItem(
                LEGACY_STORAGE_KEY
            );

            localStorage.removeItem(
                "selectedProjectData"
            );

            localStorage.removeItem(
                "selectedProjectMetadata"
            );

            // Clean up old sessionStorage versions.
            sessionStorage.removeItem(
                STORAGE_KEY
            );

            sessionStorage.removeItem(
                LEGACY_STORAGE_KEY
            );

            sessionStorage.removeItem(
                "selectedProjectData"
            );

            sessionStorage.removeItem(
                "selectedProjectMetadata"
            );

            return verification;

        } catch (error) {

            console.error(
                "Selected project storage error:",
                error
            );

            throw error;

        }

    }


    /* =====================================================
       READ SELECTED PROJECT
    ===================================================== */

    function getSelectedProject() {

        try {

            const saved = localStorage.getItem(
                STORAGE_KEY
            );

            if (!saved) {
                return null;
            }

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to read selected project:",
                error
            );

            return null;

        }

    }


    /* =====================================================
       RECEIVE VIEW GAME BUTTON CLICK FROM PROJECT CARD
    ===================================================== */

    function handleViewGameMessage(event) {

        // Only accept messages from this website.
        if (event.origin !== window.location.origin) {
            return;
        }

        if (
            !event.data ||
            event.data.type !== "VIEW_GAME_CLICKED"
        ) {
            return;
        }

        // Identify the iframe that sent the message.
        const iframe = Array.from(
            document.querySelectorAll("iframe")
        ).find(function (frame) {

            return frame.contentWindow === event.source;

        });

        if (!iframe) {

            console.error(
                "Could not identify the project card iframe."
            );

            return;

        }

        // Identify the parent project group.
        const group = iframe.closest(".projectGroup");

        if (!group) {

            console.error(
                "Could not identify the selected project card."
            );

            return;

        }

        // Retrieve the original project object.
        const project = projectReferences.get(group);

        if (!project || !project.data) {

            console.error(
                "The original project JSON was not found."
            );

            return;

        }

        const cardNumber =
            Number(group.dataset.cardNumber) || null;

        const position = getGridPosition(group);

        // Capture button information.
        const buttonInformation = {

            number:
                Number(event.data.buttonNumber) || cardNumber,

            id:
                event.data.buttonId || null,

            name:
                event.data.buttonName || "View Game",

            page:
                event.data.buttonPage || null,

            status: "Clicked"

        };

        // Capture card information.
        const cardInformation = {

            number:
                cardNumber,

            gridPosition:
                Number(group.dataset.gridPosition) || cardNumber,

            originalOrder:
                Number(group.dataset.projectOrder) + 1,

            masonryColumn:
                position.column,

            positionInColumn:
                position.positionInColumn

        };

        // Update the visible JSON debug information.
        updateButtonInformation(
            group,
            buttonInformation
        );

        try {

            // Save the complete project before navigating.
            const savedProject = saveSelectedProject({

                project: project,

                button: buttonInformation,

                card: cardInformation,

                totalProjects:
                    Number(group.dataset.totalProjects) || null,

                sourcePage:
                    window.location.href,

                destinationPage:
                    GAME_PAGE_URL

            });

            console.log(
                "SELECTED PROJECT SAVED SUCCESSFULLY:",
                savedProject
            );

            console.log(
                "COMPLETE PROJECT JSON:",
                savedProject.project
            );

            console.log(
                "BUTTON INFORMATION:",
                savedProject.button
            );

            console.log(
                "CARD INFORMATION:",
                savedProject.card
            );

            console.log(
                "PAGE INFORMATION:",
                savedProject.pageInformation
            );

            // Navigate only after storage succeeds.
            window.location.href =
                savedProject.pageInformation.destinationPage;

        } catch (error) {

            console.error(
                "Unable to save selected project. Navigation cancelled:",
                error
            );

        }

    }


    /* =====================================================
       REGISTER MESSAGE LISTENER
    ===================================================== */

    window.addEventListener(
        "message",
        handleViewGameMessage
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ProjectInfo = Object.freeze({

        storageKey: STORAGE_KEY,

        createProjectGroup,

        createProjectInformation,

        getProjectForElement,

        updateButtonInformation,

        saveSelectedProject,

        getSelectedProject,

        getGridPosition

    });

})();
