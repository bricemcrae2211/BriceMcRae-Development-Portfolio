
"use strict";

(function () {

    /* =========================================================
       GITHUB SETTINGS
    ========================================================= */

    const GITHUB_OWNER = "bricemcrae2211";
    const GITHUB_REPOSITORY = "bricemcraeMyPortfolioSite.github.io";
    const GITHUB_BRANCH = "main";
    const GITHUB_PROJECT_FOLDER = "projects";

    const GITHUB_TREE_API_URL =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/git/trees/${GITHUB_BRANCH}?recursive=1`;

    const GITHUB_RAW_BASE_URL =
        `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/`;


    /* =========================================================
       LOADING SETTINGS
    ========================================================= */

    const PROJECT_FILE_LIMIT = 100;
    const MAX_CONCURRENT_DOWNLOADS = 6;

    let discoveredProjectFiles = [];


    /* =========================================================
       FETCH ERROR
    ========================================================= */

    function getFetchErrorMessage(error, filename = "") {
        const prefix = filename ? filename + ": " : "";

        if (!navigator.onLine) {
            return prefix + "Your browser is offline.";
        }

        if (error instanceof TypeError) {
            return prefix +
                "Network request failed. Check your connection, CORS access or GitHub availability.";
        }

        return prefix + (error?.message || "Unknown error.");
    }


    /* =========================================================
       DISCOVER GITHUB JSON FILES
    ========================================================= */

    async function discoverProjectFiles() {
        let response;

        try {
            response = await fetch(GITHUB_TREE_API_URL, {
                method: "GET",
                cache: "no-store"
            });

        } catch (error) {
            throw new Error(getFetchErrorMessage(error));
        }

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error(
                    "GitHub API access denied or rate limit reached."
                );
            }

            if (response.status === 404) {
                throw new Error(
                    "GitHub could not find the repository, branch or tree."
                );
            }

            throw new Error(
                "GitHub API request failed. HTTP " + response.status
            );
        }

        const tree = await response.json();

        if (!Array.isArray(tree.tree)) {
            throw new Error("Invalid GitHub repository tree.");
        }

        if (tree.truncated) {
            throw new Error("GitHub truncated the repository tree.");
        }

        // Remove leading and trailing slashes safely.
        const projectFolder = GITHUB_PROJECT_FOLDER.replace(/^\/+|\/+$/g, "");

        const folderPrefix = projectFolder + "/";

        discoveredProjectFiles = tree.tree
            .filter(item =>
                item &&
                item.type === "blob" &&
                typeof item.path === "string" &&
                item.path.startsWith(folderPrefix) &&
                item.path.toLowerCase().endsWith(".json")
            )
            .map(item => {
                const path = item.path;

                const encodedPath = path
                    .split("/")
                    .map(segment => encodeURIComponent(segment))
                    .join("/");

                return {
                    name: path.split("/").pop(),
                    path: path,
                    url: GITHUB_RAW_BASE_URL + encodedPath
                };
            })
            .sort((a, b) => a.path.localeCompare(b.path));

        console.log("GITHUB PROJECT SCAN", {
            repository: GITHUB_OWNER + "/" + GITHUB_REPOSITORY,
            branch: GITHUB_BRANCH,
            projectFolder: projectFolder,
            discovered: discoveredProjectFiles.length,
            limit: PROJECT_FILE_LIMIT
        });

        return discoveredProjectFiles.slice(0, PROJECT_FILE_LIMIT);
    }


    /* =========================================================
       LOAD ONE JSON FILE
    ========================================================= */

    async function loadProjectJSON(file) {
        if (!file || !file.url || !file.path) {
            throw new Error("Invalid project file information.");
        }

        let response;

        try {
            response = await fetch(file.url, {
                method: "GET",
                cache: "no-store"
            });

        } catch (error) {
            throw new Error(
                getFetchErrorMessage(error, file.name)
            );
        }

        if (!response.ok) {
            throw new Error(
                "Download failed. HTTP " + response.status
            );
        }

        const jsonText = await response.text();

        if (!jsonText.trim()) {
            throw new Error("The JSON file is empty.");
        }

        let data;

        try {
            data = JSON.parse(jsonText);

        } catch (error) {
            throw new Error("Invalid JSON: " + error.message);
        }

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new Error("The JSON root must be an object.");
        }

        return {
            name: file.name,
            path: file.path,
            url: file.url,
            data: data
        };
    }


    /* =========================================================
       LOAD FILES WITH LIMITED CONCURRENCY
    ========================================================= */

    async function loadFilesWithConcurrency(
        files,
        onProgress = null
    ) {
        if (!Array.isArray(files)) {
            throw new Error("Project files must be provided as an array.");
        }

        const results = new Array(files.length);

        let nextIndex = 0;
        let completed = 0;

        const workerCount = Math.min(
            MAX_CONCURRENT_DOWNLOADS,
            files.length
        );

        async function worker() {
            while (true) {
                const index = nextIndex++;

                if (index >= files.length) {
                    return;
                }

                try {
                    results[index] = {
                        status: "fulfilled",
                        value: await loadProjectJSON(files[index])
                    };

                } catch (error) {
                    results[index] = {
                        status: "rejected",
                        reason: error
                    };
                }

                completed++;

                if (typeof onProgress === "function") {
                    try {
                        onProgress(
                            completed,
                            files.length,
                            files[index]
                        );
                    } catch (error) {
                        console.error("Project loading progress callback failed:", error);
                    }
                }
            }
        }

        await Promise.all(
            Array.from(
                { length: workerCount },
                () => worker()
            )
        );

        return results;
    }


    /* =========================================================
       PUBLIC API
    ========================================================= */

    window.ProjectLoader = Object.freeze({

        discoverProjectFiles,

        loadFilesWithConcurrency,

        getDiscoveredProjectFiles() {
            return discoveredProjectFiles.slice();
        },

        getSettings() {
            return {
                projectFileLimit: PROJECT_FILE_LIMIT,
                maxConcurrentDownloads: MAX_CONCURRENT_DOWNLOADS
            };
        }

    });

})();
