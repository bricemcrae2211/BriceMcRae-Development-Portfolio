"use strict";

window.ProjectImagePreview = (() => {
    function updateCoverPreview() {
        const previewImage = document.getElementById("previewImage");
        const previewText = document.getElementById("previewText");
        if (!previewImage || !previewText) return;

        if (ProjectState.coverData) {
            previewImage.src = ProjectState.coverData;
            previewImage.style.display = "block";
            previewText.style.display = "none";
        } else {
            previewImage.removeAttribute("src");
            previewImage.style.display = "none";
            previewText.style.display = "block";
        }
    }

    function updateScreenshotPreviews() {
        const container = document.getElementById("screenshotPreviews");
        if (!container) return;

        container.innerHTML = "";
        ProjectState.screenshotData.forEach((src, index) => {
            const image = document.createElement("img");
            image.src = src;
            image.alt = "Project screenshot " + (index + 1);
            container.appendChild(image);
        });
    }

    return { updateCoverPreview, updateScreenshotPreviews };
})();
