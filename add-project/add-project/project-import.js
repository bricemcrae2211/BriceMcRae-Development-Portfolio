
"use strict";

/* =====================================================
   PROJECT IMPORTER

   CONTROLS:
   01. Import project JSON
   02. Validate project JSON
   03. Restore project state
   04. Import project form fields
   05. Import project images
   06. Update image previews
   07. Resize textareas
   08. Import button

   ALL DEBUG MESSAGES ARE HANDLED BY DEBUG CONTROLLER.
===================================================== */

window.ProjectImport = (() => {


    /* =====================================================
       DEBUG CONTROLLER CONNECTION
    ===================================================== */

    function debug(type, message, details = null) {

        if (
            window.DebugController &&
            typeof window.DebugController[type] === "function"
        ) {

            window.DebugController[type](
                "PROJECT IMPORT",
                message,
                details
            );

        } else {

            console.warn(
                "[PROJECT IMPORT] Debug Controller is not loaded.",
                message
            );

        }

    }


    /* =====================================================
       IMPORT PROJECT FILE
    ===================================================== */

    function importProjectFile(file) {

        if (!file) {

            debug(
                "warning",
                "No project file was selected."
            );

            return;

        }

        debug(
            "info",
            "Reading project file: " + file.name
        );

        const reader = new FileReader();

        reader.onload = () => {

            try {

                const data = JSON.parse(reader.result);

                debug(
                    "success",
                    "Project JSON successfully parsed."
                );


                /* VALIDATE JSON */

                if (
                    !data ||
                    typeof data !== "object" ||
                    Array.isArray(data)
                ) {

                    throw new Error(
                        "Invalid project JSON structure."
                    );

                }


                debug(
                    "success",
                    "Project JSON structure validated."
                );


                if (
                    !data.projectId ||
                    !(data.title || data.projectTitle)
                ) {

                    throw new Error(
                        "Project JSON must contain a project ID and title."
                    );

                }


                /* RESTORE PROJECT STATE */

                ProjectState.projectId = data.projectId;

                ProjectState.createdAt =
                    data.createdAt || new Date().toISOString();


                debug(
                    "success",
                    "Project state restored.",
                    {
                        projectId: data.projectId,
                        projectTitle: data.title || data.projectTitle
                    }
                );


                /* IMPORT FORM FIELDS */

                let importedFields = 0;

                Object.keys(data).forEach(key => {

                    const field = document.getElementById(key);

                    if (!field || field.type === "file") return;

                    const value = data[key];

                    if (value === null || value === undefined) return;


                    if (field.type === "checkbox") {

                        field.checked = Boolean(value);

                    } else if (field.type === "radio") {

                        if (field.value === String(value)) {

                            field.checked = true;

                        }

                    } else if (
                        field.tagName === "SELECT" &&
                        field.multiple
                    ) {

                        const selectedValues = Array.isArray(value)
                            ? value.map(String)
                            : [String(value)];

                        Array.from(field.options).forEach(option => {

                            option.selected =
                                selectedValues.includes(option.value);

                        });

                    } else if (
                        typeof value !== "object" &&
                        typeof value !== "function"
                    ) {

                        field.value = value;

                    } else {

                        return;

                    }

                    importedFields++;

                });


                debug(
                    "success",
                    "Project form fields imported.",
                    {
                        importedFields
                    }
                );


                /* IMPORT PROJECT IMAGES */

                const images = data.projectImages || {};

                ProjectState.coverData =
                    images.cover || data.coverImage || "";

                ProjectState.screenshotData =
                    Array.isArray(images.screenshots)
                        ? [...images.screenshots]
                        : Array.isArray(data.screenshots)
                            ? [...data.screenshots]
                            : [];


                debug(
                    "success",
                    "Project images imported.",
                    {
                        coverImage:
                            ProjectState.coverData
                                ? "Imported"
                                : "Not included",

                        screenshots:
                            ProjectState.screenshotData.length
                    }
                );


                /* UPDATE IMAGE PREVIEWS */

                ProjectImagePreview.updateCoverPreview();

                ProjectImagePreview.updateScreenshotPreviews();


                debug(
                    "success",
                    "Project image previews updated."
                );


                /* RESIZE TEXTAREAS */

                ProjectTextareaHandler.resizeAllTextareas();


                debug(
                    "success",
                    "Project textareas resized."
                );


                /* SUCCESS MESSAGE */

                debug(
                    "success",
                    "PROJECT IMPORT COMPLETED SUCCESSFULLY."
                );


                alert(
                    "PROJECT IMPORTED SUCCESSFULLY!\n\n" +
                    "Project: " +
                    (data.title || data.projectTitle) +
                    "\nCover image: " +
                    (ProjectState.coverData ? "Imported" : "Not included") +
                    "\nScreenshots: " +
                    ProjectState.screenshotData.length
                );


            } catch (error) {

                debug(
                    "error",
                    "PROJECT IMPORT FAILED: " + error.message,
                    error
                );

                alert(
                    "PROJECT IMPORT FAILED!\n\n" +
                    error.message
                );

                console.error(
                    "Project import error:",
                    error
                );

            }

        };


        /* =================================================
           FILE READER ERROR
        ================================================= */

        reader.onerror = () => {

            debug(
                "error",
                "Could not read the selected JSON file."
            );

            alert(
                "Could not read the selected JSON file."
            );

        };


        reader.readAsText(file);

    }


    /* =====================================================
       INITIALIZE IMPORT BUTTON
    ===================================================== */

    function initializeImportButton() {

        const importButton =
            document.getElementById("importButton");

        const importInput =
            document.getElementById("importProjectFile");


        if (!importButton) {

            debug(
                "error",
                "Import button was not found."
            );

            return;

        }


        if (!importInput) {

            debug(
                "error",
                "Import file input was not found."
            );

            return;

        }


        /* PREVENT DUPLICATE INITIALIZATION */

        if (
            importButton.dataset.projectImportInitialized === "true"
        ) {

            debug(
                "warning",
                "Import button is already initialized."
            );

            return;

        }

        importButton.dataset.projectImportInitialized = "true";


        /* OPEN FILE PICKER */

        importButton.addEventListener("click", () => {

            debug(
                "info",
                "Import button pressed. Opening file picker."
            );

            importInput.click();

        });


        /* IMPORT SELECTED JSON FILE */

        importInput.addEventListener("change", event => {

            const file = event.target.files[0];

            if (!file) {

                debug(
                    "warning",
                    "No project file selected."
                );

                return;

            }

            debug(
                "info",
                "Project file selected: " + file.name
            );

            importProjectFile(file);


            /* ALLOW THE SAME FILE TO BE SELECTED AGAIN */

            event.target.value = "";

        });


        debug(
            "success",
            "Import button initialized successfully."
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        debug(
            "info",
            "Initializing Project Import."
        );

        initializeImportButton();

        debug(
            "success",
            "Project Import initialized."
        );

    }


    /* =====================================================
       DOCUMENT READY
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    return {

        importProjectFile,

        initializeImportButton,

        initialize

    };

})();
