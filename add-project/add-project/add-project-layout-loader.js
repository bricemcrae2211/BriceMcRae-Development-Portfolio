"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const SECTION_FILES = [
        "sections/01-project-description.html",
        "sections/02-project-images.html",
        "sections/03-about-project.html",
        "sections/04-project-information.html",
        "sections/05-story-world.html",
        "sections/06-gameplay.html",
        "sections/07-project-features.html",
        "sections/08-technical-overview.html",
        "sections/09-development-challenges.html",
        "sections/10-development-information.html",
        "sections/11-contributions-team.html",
        "sections/12-development-tools-learning.html",
        "sections/13-future-development.html",
        "sections/14-system-requirements.html",
        "sections/15-external-links-downloads.html",
        "sections/16-credits-additional-information.html"
    ];

    const sectionsContainer = document.getElementById("projectSections");

    async function loadSections() {
        if (!sectionsContainer) {
            throw new Error("Project sections container was not found.");
        }

        sectionsContainer.innerHTML = "";

        for (const file of SECTION_FILES) {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Could not load ${file} (HTTP ${response.status}).`);
            }

            const html = await response.text();
            const template = document.createElement("template");
            template.innerHTML = html.trim();
            sectionsContainer.appendChild(template.content.cloneNode(true));
        }
    }

    try {
        await loadSections();
        document.documentElement.dataset.projectLayoutLoaded = "true";
        document.dispatchEvent(new CustomEvent("projectLayoutLoaded"));
    } catch (error) {
        console.error("SECTION LOAD ERROR:", error);

        if (sectionsContainer) {
            sectionsContainer.innerHTML =
                '<div class="section-error">' +
                'Could not load the project sections. ' +
                'Open this page through your local web server, not directly as a file. ' +
                error.message +
                '</div>';
        }

        document.dispatchEvent(new CustomEvent("projectLayoutError", {
            detail: error
        }));
    }
});
