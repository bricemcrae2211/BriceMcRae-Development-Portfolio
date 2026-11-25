
"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const STORAGE_KEY = "selectedProjectInformation";

    const GITHUB_OWNER = "bricemcrae2211";
    const GITHUB_REPOSITORY = "bricemcraeMyPortfolioSite.github.io";
    const GITHUB_BRANCH = "main";

    const PROJECTS_FOLDER = "projects";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const coverContainer =
        document.getElementById("gameCoverContainer");

    const coverImage =
        document.getElementById("coverImage");

    const coverImageMissing =
        document.getElementById("coverImageMissing");

    if (!coverContainer || !coverImage) {
        console.error("Game cover elements were not found.");
        return;
    }


    /* =====================================================
       PREPARE DISPLAY
    ===================================================== */

    coverImage.hidden = true;
    coverImage.removeAttribute("src");

    if (coverImageMissing) {
        coverImageMissing.hidden = true;
    }

    let status =
        document.getElementById("coverImageStatus");

    if (!status) {
        status = document.createElement("div");
        status.id = "coverImageStatus";
        status.className = "cover-image-status";

        coverContainer.appendChild(status);
    }

    status.textContent = "UNAVAILABLE";
    status.className = "cover-image-status unavailable";
    status.hidden = true;


    /* =====================================================
       READ SELECTED PROJECT INFORMATION
    ===================================================== */

    function getSelectedProject() {

        const storedInformation =
            localStorage.getItem(STORAGE_KEY);

        if (!storedInformation) {
            throw new Error(
                "No selected project information was found."
            );
        }

        let project;

        try {
            project = JSON.parse(storedInformation);
        } catch {
            throw new Error(
                "Selected project information contains invalid JSON."
            );
        }

        if (!project || typeof project !== "object") {
            throw new Error(
                "Selected project information is invalid."
            );
        }

        return project;
    }


    /* =====================================================
       GET PROJECT JSON PATH
    ===================================================== */

    function getProjectJsonPath(project) {

        const jsonFilePath =
            project.jsonFile?.path ||
            project.jsonFilePath ||
            project.filePath;

        if (
            typeof jsonFilePath !== "string" ||
            !jsonFilePath.trim()
        ) {
            throw new Error(
                "Project JSON file path was not provided."
            );
        }

        return jsonFilePath
            .trim()
            .replace(/^\/+/, "");
    }


    /* =====================================================
       GITHUB CONTENTS API
    ===================================================== */

    async function getGitHubContents(path) {

        const encodedPath = path
            .split("/")
            .map(encodeURIComponent)
            .join("/");

        const url =
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/contents/${encodedPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `GitHub request failed: ${response.status}`
            );
        }

        return response.json();
    }


    /* =====================================================
       READ PROJECT JSON
    ===================================================== */

    async function readProjectJson(jsonFilePath) {

        const file =
            await getGitHubContents(jsonFilePath);

        if (!file || file.type !== "file") {
            throw new Error(
                "Project JSON file could not be found."
            );
        }

        let project;

        if (file.download_url) {

            const response = await fetch(file.download_url, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error(
                    "Unable to download project JSON."
                );
            }

            project = await response.json();

        } else if (file.content) {

            const decoded = atob(
                file.content.replace(/\s/g, "")
            );

            const bytes = Uint8Array.from(
                decoded,
                character => character.charCodeAt(0)
            );

            project = JSON.parse(
                new TextDecoder().decode(bytes)
            );

        } else {

            throw new Error(
                "Project JSON has no readable content."
            );
        }

        return project;
    }


    /* =====================================================
       GET COVER IMAGE PATH
    ===================================================== */

    function getCoverImagePath(project) {

        const coverPath =
            project.projectImages?.cover;

        if (
            typeof coverPath !== "string" ||
            !coverPath.trim()
        ) {
            throw new Error(
                "Project cover image path is unavailable."
            );
        }

        return coverPath
            .trim()
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
    }


    /* =====================================================
       GET PROJECT FOLDER
    ===================================================== */

    function getProjectFolder(project) {

        const exportFolder =
            project.exportFolder;

        if (
            typeof exportFolder !== "string" ||
            !exportFolder.trim()
        ) {
            throw new Error(
                "Project export folder is unavailable."
            );
        }

        return `${PROJECTS_FOLDER}/${exportFolder
            .trim()
            .replace(/^\/+|\/+$/g, "")}`;
    }


    /* =====================================================
       BUILD COVER IMAGE URL
    ===================================================== */

    function getCoverImageUrl(projectFolder, coverPath) {

        let relativeImagePath = coverPath;

        const folderName =
            projectFolder.split("/").pop();

        // Remove duplicate project folder name.
        if (
            relativeImagePath.startsWith(
                folderName + "/"
            )
        ) {
            relativeImagePath =
                relativeImagePath.substring(
                    folderName.length + 1
                );
        }

        const fullImagePath =
            `${projectFolder}/${relativeImagePath}`;

        const encodedPath = fullImagePath
            .split("/")
            .map(encodeURIComponent)
            .join("/");

        return (
            `https://raw.githubusercontent.com/` +
            `${GITHUB_OWNER}/` +
            `${GITHUB_REPOSITORY}/` +
            `${GITHUB_BRANCH}/` +
            `${encodedPath}`
        );
    }


    /* =====================================================
       LOAD COVER IMAGE
    ===================================================== */

    function loadCoverImage(imageUrl) {

        return new Promise((resolve, reject) => {

            coverImage.onload = () => {

                coverImage.hidden = false;

                if (coverImageMissing) {
                    coverImageMissing.hidden = true;
                }

                resolve();
            };

            coverImage.onerror = () => {

                coverImage.hidden = true;

                reject(
                    new Error(
                        "Project cover image could not be loaded."
                    )
                );
            };

            coverImage.src = imageUrl;
        });
    }


    /* =====================================================
       LOAD SELECTED PROJECT COVER
    ===================================================== */

    try {

        // Read selected project information.
        const selectedProject =
            getSelectedProject();


        // Get actual JSON file path.
        const jsonFilePath =
            getProjectJsonPath(selectedProject);


        // Download and read project.json.
        const project =
            await readProjectJson(jsonFilePath);


        // Get project folder from exportFolder.
        const projectFolder =
            getProjectFolder(project);


        // Read projectImages.cover.
        const coverPath =
            getCoverImagePath(project);


        // Build GitHub image URL.
        const coverImageUrl =
            getCoverImageUrl(
                projectFolder,
                coverPath
            );


        // Load and display image.
        await loadCoverImage(coverImageUrl);


        // Successful image display:
        // No status text.
        // No project name.
        // No JSON filename.

        status.hidden = true;


    } catch (error) {

        // Hide unavailable image.
        coverImage.hidden = true;

        if (coverImageMissing) {
            coverImageMissing.hidden = true;
        }

        // Display only UNAVAILABLE.
        status.hidden = false;

        status.textContent = "UNAVAILABLE";

        status.className =
            "cover-image-status unavailable";

        console.error(
            "Unable to load project cover image:",
            error
        );

    }

});
