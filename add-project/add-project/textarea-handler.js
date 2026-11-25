"use strict";

window.ProjectTextareaHandler = (() => {
    function resizeTextarea(textarea) {
        textarea.style.height = "42px";
        textarea.style.height = Math.max(42, textarea.scrollHeight) + "px";
    }

    function resizeAllTextareas() {
        document.querySelectorAll("#projectForm textarea").forEach(resizeTextarea);
    }

    function initializeTextareas() {
        document.querySelectorAll("#projectForm textarea").forEach(textarea => {
            resizeTextarea(textarea);
            textarea.addEventListener("input", () => resizeTextarea(textarea));
        });
    }

    return { resizeTextarea, resizeAllTextareas, initializeTextareas };
})();
