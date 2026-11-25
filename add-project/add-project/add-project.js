"use strict";

document.addEventListener("DOMContentLoaded", () => {
    let initialized = false;

    function initializeProjectForm() {
        if (initialized) return;
        initialized = true;

        ProjectDropdownHandler.initializeDropdowns();
        ProjectTextareaHandler.initializeTextareas();
        ProjectImageControls.setupImageControls();

        ProjectImagePreview.updateCoverPreview();
        ProjectImagePreview.updateScreenshotPreviews();

        ProjectButtons.initializeButtons();

        window.saveProject = ProjectSave.saveProject;
        window.exportProject = ProjectExport.exportProject;
    }

    document.addEventListener("projectLayoutLoaded", initializeProjectForm, { once: true });

    document.addEventListener("projectLayoutError", event => {
        console.error("PROJECT FORM COULD NOT INITIALIZE:", event.detail);
    }, { once: true });

    // Supports cases where the layout loader completed before this controller ran.
    if (document.documentElement.dataset.projectLayoutLoaded === "true") {
        initializeProjectForm();
    }
});
