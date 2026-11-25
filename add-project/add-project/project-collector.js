"use strict";

window.ProjectCollector = (() => {
    function collectProjectData() {
        const form = document.getElementById("projectForm");
        const data = {};

        form.querySelectorAll("input:not([type=file]), textarea, select").forEach(field => {
            if (field.id) data[field.id] = field.value;
        });

        if (!ProjectState.projectId) {
            ProjectState.projectId = "project_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        }

        if (!ProjectState.createdAt) ProjectState.createdAt = new Date().toISOString();

        data.projectId = ProjectState.projectId;
        data.title = document.getElementById("projectTitle").value.trim();
        data.projectImages = {
            cover: ProjectState.coverData,
            screenshots: [...ProjectState.screenshotData]
        };
        data.coverImage = ProjectState.coverData;
        data.screenshots = [...ProjectState.screenshotData];
        data.createdAt = ProjectState.createdAt;
        data.updatedAt = new Date().toISOString();

        return data;
    }

    return { collectProjectData };
})();
