
"use strict";

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY = "selectedProjectInformation";
    const LEGACY_STORAGE_KEY = "selectedGameProject";


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
            value
        );

        row.append(name, content);

        return row;
    }


    /* =====================================================
       CREATE PROJECT INFORMATION DISPLAY
    ===================================================== */

    function createProjectInformation(project, index, totalProjects) {
        const cardNumber = index + 1;

        const output = createElement(
            "section",
            "projectJsonOutput projectInfoCard"
        );

        output.hidden = false;

        output.dataset.projectName = project.name;
        output.dataset.projectPath = project.path;
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
            project.path
        );

        const propertyCount = createElement(
            "div",
            "projectJsonPropertyCount",
            Object.keys(project.data).length +
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
                project.data,
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

       This function now belongs to project-info.js.
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
        const totalProjects = Number(options.totalProjects) || 0;

        const cardNumber = index + 1;

        const group = createElement(
            "article",
            "projectGroup"
        );

        group.dataset.projectName = project.name;
        group.dataset.projectPath = project.path;
        group.dataset.projectOrder = String(index);
        group.dataset.cardNumber = String(cardNumber);
        group.dataset.gridPosition = String(cardNumber);

        const card = options.createCard(
            project,
            index
        );

        if (!card) {
            throw new Error(
                "The project card could not be created for: " +
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
            column.querySelectorAll(":scope > .projectGroup")
        );

        return {
            column: Number(column.dataset.columnIndex) + 1,
            positionInColumn: groups.indexOf(group) + 1
        };
    }


    /* =====================================================
       UPDATE BUTTON INFORMATION
    ===================================================== */

    function updateButtonInformation(group, message = {}) {
        if (!group) {
            return null;
        }

        const projectNumber = Number(
            group.dataset.cardNumber
        ) || 0;

        const buttonNumber = Number(
            message.buttonNumber
        ) || projectNumber;

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

        Object.entries(updates).forEach(([field, value]) => {
            const target = group.querySelector(
                '[data-info-field="' + field + '"] .projectInfoDetailValue'
            );

            if (target) {
                target.textContent = String(value);
            }
        });

        return {
            ...buttonInformation,
            masonryColumn: position.column,
            positionInColumn: position.positionInColumn
        };
    }


    /* =====================================================
       SAVE SELECTED PROJECT
    ===================================================== */

    function saveSelectedProject(options) {
        if (!options || !options.project) {
            throw new Error(
                "Cannot save selected project. Project data is missing."
            );
        }

        const project = options.project;
        const button = options.button || {};
        const card = options.card || {};

        const selectedProject = {
            project: project.data,

            jsonFile: {
                name: project.name,
                path: project.path,
                url: project.url
            },

            button: {
                number: button.number ?? card.number ?? null,
                id: button.id || "Not reported by project card",
                name: button.name || "Not reported by project card",
                status: button.status || "Clicked"
            },

            card: {
                number: card.number ?? null,
                gridPosition: card.gridPosition ?? null,
                originalOrder: card.originalOrder ?? null,
                masonryColumn: card.masonryColumn ?? null,
                positionInColumn: card.positionInColumn ?? null
            },

            totalProjects: options.totalProjects ?? null,

            selectedAt: new Date().toISOString()
        };

        const serialized = JSON.stringify(selectedProject);

        // Store only the currently selected project.
        sessionStorage.setItem(
            STORAGE_KEY,
            serialized
        );

        // Remove the old key so there is one consistent storage location.
        sessionStorage.removeItem(
            LEGACY_STORAGE_KEY
        );

        return selectedProject;
    }


    /* =====================================================
       READ SELECTED PROJECT
    ===================================================== */

    function getSelectedProject() {
        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return null;
        }

        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error(
                "Saved project information is invalid:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ProjectInfo = Object.freeze({
        storageKey: STORAGE_KEY,

        createProjectGroup,
        createProjectInformation,

        updateButtonInformation,
        saveSelectedProject,
        getSelectedProject,

        getGridPosition
    });

})();
