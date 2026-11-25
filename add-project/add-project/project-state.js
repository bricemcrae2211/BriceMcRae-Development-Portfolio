"use strict";

window.ProjectState = (() => {
    let coverData = "";
    let screenshotData = [];
    let projectId = null;
    let createdAt = null;
    let saving = false;
    const SAVE_API = "http://localhost:3000/api/projects";

    return {
        get coverData() { return coverData; },
        set coverData(value) { coverData = value; },
        get screenshotData() { return screenshotData; },
        set screenshotData(value) { screenshotData = value; },
        get projectId() { return projectId; },
        set projectId(value) { projectId = value; },
        get createdAt() { return createdAt; },
        set createdAt(value) { createdAt = value; },
        get saving() { return saving; },
        set saving(value) { saving = value; },
        get SAVE_API() { return SAVE_API; }
    };
})();
