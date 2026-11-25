
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY = "selectedProjectInformation";


    /* =====================================================
       HELPERS
    ===================================================== */

    function getValue(value) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return "Not received";
        }

        return value;

    }


    /* =====================================================
       LOAD LOCAL STORAGE
    ===================================================== */

    function loadProjectInformation() {

        let storedProject;

        try {

            storedProject =
                localStorage.getItem(STORAGE_KEY);

        } catch (error) {

            return {
                success: false,
                error: error.message
            };

        }

        if (!storedProject) {

            return {
                success: false,
                error: "No selected project was found in local storage."
            };

        }

        let selectedProject;

        try {

            selectedProject =
                JSON.parse(storedProject);

        } catch (error) {

            return {
                success: false,
                error: "Unable to parse selected project information: " +
                    error.message
            };

        }

        if (
            !selectedProject ||
            typeof selectedProject !== "object" ||
            Array.isArray(selectedProject)
        ) {

            return {
                success: false,
                error: "Selected project information is not a valid object."
            };

        }


        /* =================================================
           BUTTON INFORMATION
        ================================================= */

        const button =
            selectedProject.button || {};

        const oldRecord =
            selectedProject.completeSavedRecord || {};

        const buttonInformation = {

            buttonName: getValue(
                button.name ??
                selectedProject.buttonName ??
                "View Game"
            ),

            buttonNumber: getValue(
                button.number ??
                selectedProject.buttonNumber ??
                oldRecord.buttonNumber
            ),

            buttonID: getValue(
                button.id ??
                selectedProject.buttonId
            ),

            buttonStatus: getValue(button.status),

            buttonPage: getValue(button.page)

        };


        /* =================================================
           CARD INFORMATION
        ================================================= */

        const card =
            selectedProject.card || {};

        const cardInformation = {

            cardNumber: getValue(
                card.number ??
                selectedProject.cardNumber
            ),

            cardID: getValue(
                card.id ??
                selectedProject.cardId
            ),

            gridPosition: getValue(card.gridPosition),

            originalOrder: getValue(card.originalOrder),

            masonryColumn: getValue(card.masonryColumn),

            positionInColumn: getValue(card.positionInColumn)

        };


        /* =================================================
           PROJECT INFORMATION
        ================================================= */

        const projectMetadata =
            selectedProject.projectMetadata || {};

        const jsonFile =
            selectedProject.jsonFile || {};

        const projectInformation = {

            projectName: getValue(
                projectMetadata.title ??
                selectedProject.projectName ??
                jsonFile.name ??
                oldRecord.filename
            ),

            projectID: getValue(projectMetadata.id),

            version: getValue(selectedProject.version),

            jsonFilename: getValue(
                jsonFile.name ??
                selectedProject.filename ??
                oldRecord.filename
            ),

            jsonPath: getValue(jsonFile.path),

            totalProjects: getValue(selectedProject.totalProjects),

            selectedAt: getValue(selectedProject.selectedAt)

        };


        /* =================================================
           PROJECT JSON
        ================================================= */

        let projectJSON =
            selectedProject.project ??
            selectedProject.projectJSON ??
            selectedProject.json ??
            selectedProject.data ??
            null;

        let jsonStatus = "PROJECT JSON FOUND";
        let jsonReason = null;

        if (typeof projectJSON === "string") {

            try {

                projectJSON = JSON.parse(projectJSON);

            } catch (error) {

                jsonStatus = "INVALID PROJECT JSON";

                jsonReason =
                    "The saved project JSON could not be parsed: " +
                    error.message;

            }

        }

        if (!jsonReason) {

            if (
                projectJSON === null ||
                projectJSON === undefined
            ) {

                jsonStatus = "NO PROJECT JSON FOUND";

                jsonReason =
                    "The saved project information does not contain a project JSON object.";

            } else if (
                typeof projectJSON !== "object" ||
                Array.isArray(projectJSON)
            ) {

                jsonStatus = "INVALID PROJECT JSON";

                jsonReason =
                    "The saved project JSON is not a valid project object.";

            } else if (
                Object.keys(projectJSON).length === 0
            ) {

                jsonStatus = "EMPTY PROJECT JSON";

                jsonReason =
                    "The project JSON object was received, but it is empty.";

            }

        }


        /* =================================================
           PAGE INFORMATION
        ================================================= */

        const pageInformation =
            selectedProject.pageInformation || null;


        /* =================================================
           TRANSFER INFORMATION
        ================================================= */

        const transferReport =
            selectedProject.transferReport || null;


        /* =================================================
           COMPLETE INFORMATION
        ================================================= */

        const projectData = {

            success: true,

            buttonInformation: buttonInformation,

            cardInformation: cardInformation,

            projectInformation: projectInformation,

            projectJSON: projectJSON,

            jsonStatus: jsonStatus,

            jsonReason: jsonReason,

            pageInformation: pageInformation,

            transferReport: transferReport,

            completeSavedRecord: selectedProject

        };


        /* =================================================
           MAKE INFORMATION AVAILABLE TO WEBSITE
        ================================================= */

        window.SelectedProjectInformation = projectData;


        return projectData;

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    const projectData = loadProjectInformation();


    /* =====================================================
       PUBLIC INFORMATION ACCESS
    ===================================================== */

    window.ProjectInformationLoader = Object.freeze({

        load: loadProjectInformation,

        get: function () {
            return window.SelectedProjectInformation;
        },

        refresh: function () {

            const updatedInformation =
                loadProjectInformation();

            window.SelectedProjectInformation =
                updatedInformation;

            return updatedInformation;

        },

        storageKey: STORAGE_KEY

    });


});
