"use strict";

window.ProjectImageControls = (() => {
    function setupImageControls() {
        const coverInput = document.getElementById("projectImage");
        const screenshotInput = document.getElementById("screenshots");

        document.getElementById("uploadCoverButton").addEventListener("click", () => coverInput.click());

        document.getElementById("removeCoverButton").addEventListener("click", () => {
            ProjectState.coverData = "";
            coverInput.value = "";
            ProjectImagePreview.updateCoverPreview();
        });

        coverInput.addEventListener("change", async () => {
            const file = coverInput.files && coverInput.files[0];
            if (!file) return;

            try {
                const image = await ProjectImageReader.readImageFile(file);
                await ProjectImageReader.verifyImageData(image);
                ProjectState.coverData = image;
                ProjectImagePreview.updateCoverPreview();
            } catch (error) {
                ProjectState.coverData = "";
                coverInput.value = "";
                ProjectImagePreview.updateCoverPreview();
                alert("COVER IMAGE ERROR:\\n\\n" + error.message);
            }
        });

        document.getElementById("uploadScreenshotsButton").addEventListener("click", () => screenshotInput.click());

        document.getElementById("removeScreenshotsButton").addEventListener("click", () => {
            ProjectState.screenshotData = [];
            screenshotInput.value = "";
            ProjectImagePreview.updateScreenshotPreviews();
        });

        screenshotInput.addEventListener("change", async () => {
            const files = Array.from(screenshotInput.files || []);
            for (const file of files) {
                try {
                    const image = await ProjectImageReader.readImageFile(file);
                    await ProjectImageReader.verifyImageData(image);
                    ProjectState.screenshotData.push(image);
                } catch (error) {
                    alert(file.name + "\\n\\n" + error.message);
                }
            }
            ProjectImagePreview.updateScreenshotPreviews();
            screenshotInput.value = "";
        });
    }

    return { setupImageControls };
})();
