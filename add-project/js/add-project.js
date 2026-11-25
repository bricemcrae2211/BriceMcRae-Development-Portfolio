
"use strict";

/* =====================================================
   ADD PROJECT CONTROLLER

   SUPPORTS:
   - Top-level portfolio pages.
   - Nested pages.
   - Dynamically loaded project sections.
   - Late-loading JavaScript handlers.
===================================================== */

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    let initialized = false;

    let retryInterval = null;

    let attempts = 0;

    const MAX_ATTEMPTS = 50;

    const RETRY_DELAY = 200;


    /* =====================================================
       FIND PROJECT FORM
    ===================================================== */

    function getProjectForm() {

        return (
            document.getElementById("projectForm") ||
            document.querySelector("[data-project-form]") ||
            document.querySelector(".project-form")
        );

    }


    /* =====================================================
       INITIALIZE PROJECT FORM
    ===================================================== */

    function initializeProjectForm() {

        if (initialized) {
            return true;
        }

        const projectForm = getProjectForm();

        if (!projectForm) {
            return false;
        }

        const layoutLoaded =
            document.documentElement.dataset.projectLayoutLoaded === "true";

        if (!layoutLoaded) {
            return false;
        }


        /* -----------------------------------------------
           DROPDOWNS

           Initialize independently so unrelated handlers
           cannot prevent dropdown initialization.
        ----------------------------------------------- */

        if (
            typeof ProjectDropdownHandler !== "undefined" &&
            typeof ProjectDropdownHandler.initializeDropdowns === "function"
        ) {

            ProjectDropdownHandler.initializeDropdowns();

            console.log(
                "[ADD PROJECT] Dropdowns initialized."
            );

        } else {

            return false;

        }


        /* -----------------------------------------------
           TEXTAREAS
        ----------------------------------------------- */

        if (
            typeof ProjectTextareaHandler !== "undefined" &&
            typeof ProjectTextareaHandler.initializeTextareas === "function"
        ) {

            ProjectTextareaHandler.initializeTextareas();

        }


        /* -----------------------------------------------
           IMAGE CONTROLS
        ----------------------------------------------- */

        if (
            typeof ProjectImageControls !== "undefined" &&
            typeof ProjectImageControls.setupImageControls === "function"
        ) {

            ProjectImageControls.setupImageControls();

        }


        /* -----------------------------------------------
           IMAGE PREVIEWS
        ----------------------------------------------- */

        if (
            typeof ProjectImagePreview !== "undefined"
        ) {

            if (
                typeof ProjectImagePreview.updateCoverPreview === "function"
            ) {

                ProjectImagePreview.updateCoverPreview();

            }

            if (
                typeof ProjectImagePreview.updateScreenshotPreviews === "function"
            ) {

                ProjectImagePreview.updateScreenshotPreviews();

            }

        }


        /* -----------------------------------------------
           PROJECT BUTTONS
        ----------------------------------------------- */

        if (
            typeof ProjectButtons !== "undefined" &&
            typeof ProjectButtons.initializeButtons === "function"
        ) {

            ProjectButtons.initializeButtons();

        }


        /* -----------------------------------------------
           SAVE FUNCTION
        ----------------------------------------------- */

        if (
            typeof ProjectSave !== "undefined" &&
            typeof ProjectSave.saveProject === "function"
        ) {

            window.saveProject = ProjectSave.saveProject;

        }


        /* -----------------------------------------------
           EXPORT FUNCTION
        ----------------------------------------------- */

        if (
            typeof ProjectExport !== "undefined" &&
            typeof ProjectExport.exportProject === "function"
        ) {

            window.exportProject = ProjectExport.exportProject;

        }


        /* -----------------------------------------------
           COMPLETE
        ----------------------------------------------- */

        initialized = true;

        if (retryInterval !== null) {

            clearInterval(retryInterval);

            retryInterval = null;

        }

        console.log(
            "[ADD PROJECT] PROJECT FORM INITIALIZED."
        );

        return true;

    }


    /* =====================================================
       RETRY INITIALIZATION
    ===================================================== */

    function startInitialization() {

        if (initializeProjectForm()) {
            return;
        }

        if (retryInterval !== null) {
            return;
        }

        retryInterval = setInterval(() => {

            attempts++;

            if (initializeProjectForm()) {
                return;
            }

            if (attempts >= MAX_ATTEMPTS) {

                clearInterval(retryInterval);

                retryInterval = null;

                console.error(
                    "[ADD PROJECT] INITIALIZATION FAILED. " +
                    "Check the form, layout loader and dropdown handler."
                );

            }

        }, RETRY_DELAY);

    }


    /* =====================================================
       LAYOUT EVENTS
    ===================================================== */

    document.addEventListener(
        "projectLayoutLoaded",
        startInitialization
    );


    document.addEventListener(
        "projectLayoutError",
        event => {

            console.error(
                "[ADD PROJECT] LAYOUT ERROR:",
                event.detail
            );

        }
    );


    /* =====================================================
       INITIALIZE IF LAYOUT ALREADY EXISTS
    ===================================================== */

    if (
        document.documentElement.dataset.projectLayoutLoaded === "true"
    ) {

        startInitialization();

    }


    /* =====================================================
       STARTUP
    ===================================================== */

    startInitialization();


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.AddProjectController = Object.freeze({

        initialize: startInitialization,

        get initialized() {
            return initialized;
        }

    });

})();
