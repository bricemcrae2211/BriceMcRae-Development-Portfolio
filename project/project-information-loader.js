
"use strict";

/* =========================================
   PROJECT INFORMATION LOADER
   READ SELECTED PROJECT FROM SESSION STORAGE
========================================= */

const ProjectInformationLoader = {

    storageKey: "selectedGameProject",

    filenameElement: null,
    statusElement: null,
    jsonElement: null,

    /* =====================================
       INITIALIZE
    ===================================== */

    initialize() {

        this.filenameElement = document.getElementById(
            "projectJsonFilename"
        );

        this.statusElement = document.getElementById(
            "projectJsonStatus"
        );

        this.jsonElement = document.getElementById(
            "projectJsonDebug"
        );

        if (
            !this.filenameElement ||
            !this.statusElement ||
            !this.jsonElement
        ) {

            console.error(
                "Project Information Loader: HTML elements missing."
            );

            return;

        }

        this.reset();

        /* Load only the explicitly selected project */

        this.loadSelectedProject();

        /* Listen for changes to the selected project */

        window.addEventListener("storage", (event) => {

            if (event.key === this.storageKey) {

                this.loadSelectedProject();

            }

        });

    },


    /* =====================================
       RESET DISPLAY
    ===================================== */

    reset() {

        this.filenameElement.textContent =
            "Waiting for project...";

        this.statusElement.textContent =
            "Waiting for project...";

        this.jsonElement.textContent =
            "Waiting for project data...";

    },


    /* =====================================
       LOAD SELECTED PROJECT
    ===================================== */

    loadSelectedProject() {

        const storedProject = sessionStorage.getItem(
            this.storageKey
        );

        if (!storedProject) {

            this.reset();

            return;

        }

        let selectedProject;

        try {

            selectedProject = JSON.parse(storedProject);

        } catch (error) {

            this.setStatus(
                "Failed to read selected project storage."
            );

            this.jsonElement.textContent = error.message;

            return;

        }

        if (
            !selectedProject ||
            typeof selectedProject !== "object"
        ) {

            this.setStatus(
                "Invalid selected project information."
            );

            return;

        }

        /* Get the actual project JSON */

        const projectData = selectedProject.project;

        if (
            !projectData ||
            typeof projectData !== "object" ||
            Array.isArray(projectData)
        ) {

            this.setStatus(
                "Selected project contains no valid JSON data."
            );

            this.jsonElement.textContent =
                "The selected project storage object does not contain a valid project property.";

            return;

        }

        /* Display the selected filename */

        const filename =
            selectedProject.filename ||
            projectData.filename ||
            projectData.fileName ||
            "JSON filename not provided";

        this.filenameElement.textContent = filename;

        /* Display the selected JSON */

        this.displayJSON(projectData);

        /* Update status */

        this.setStatus(
            "Project JSON loaded successfully."
        );

        console.log(
            "Project Information Loader:",
            filename
        );

    },


    /* =====================================
       DISPLAY JSON
    ===================================== */

    displayJSON(projectData) {

        this.jsonElement.textContent = JSON.stringify(
            projectData,
            null,
            4
        );

    },


    /* =====================================
       UPDATE STATUS
    ===================================== */

    setStatus(status) {

        this.statusElement.textContent = status;

    }

};


/* =========================================
   START LOADER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    ProjectInformationLoader.initialize();

});
