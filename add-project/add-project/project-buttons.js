"use strict";

window.ProjectButtons = (() => {
    function initializeButtons() {
        const form = document.getElementById("projectForm");
        const saveButton = document.getElementById("saveProjectButton");
        const cancelButton = document.getElementById("cancelProjectButton");
        const importButton = document.getElementById("importButton");
        const exportButton = document.getElementById("exportButton");
        const importInput = document.getElementById("importProjectFile");

        saveButton.addEventListener("click", event => {
            event.preventDefault();
            ProjectSave.saveProject();
        });

        exportButton.addEventListener("click", event => {
            event.preventDefault();
            ProjectExport.exportProject();
        });

        importButton.addEventListener("click", event => {
            event.preventDefault();
            importInput.click();
        });

        importInput.addEventListener("change", () => {
            const file = importInput.files && importInput.files[0];
            if (file) ProjectImport.importProjectFile(file);
            importInput.value = "";
        });

        cancelButton.addEventListener("click", event => {
            event.preventDefault();
            if (ProjectState.saving) return;

            if (confirm("Cancel adding this project?\\n\\nUnsaved changes will be lost.")) {
                window.history.back();
            }
        });

        form.addEventListener("submit", event => event.preventDefault());
    }

    return { initializeButtons };
})();
