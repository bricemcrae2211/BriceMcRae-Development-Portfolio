
"use strict";

(function () {

    /* =========================================================
       DEBUG STATE
    ========================================================= */

    let debugGood = [];
    let debugBad = [];


    /* =========================================================
       RECORD RESULTS
    ========================================================= */

    function addGood(message) {
        debugGood.push(message);
    }

    function addBad(message) {
        debugBad.push(message);
    }


    /* =========================================================
       DISPLAY DEBUG RESULTS
    ========================================================= */

    function displayResults(elements) {

        elements.debugGoodList.replaceChildren();
        elements.debugBadList.replaceChildren();

        debugGood.forEach(message => {

            const entry = document.createElement("div");

            entry.className = "debugEntry good";
            entry.textContent = "GOOD: " + message;

            elements.debugGoodList.appendChild(entry);

        });

        debugBad.forEach(message => {

            const entry = document.createElement("div");

            entry.className = "debugEntry bad";
            entry.textContent = "BAD: " + message;

            elements.debugBadList.appendChild(entry);

        });

        if (debugGood.length === 0) {

            const empty = document.createElement("div");

            empty.className = "debugEmpty";
            empty.textContent = "No successful checks recorded.";

            elements.debugGoodList.appendChild(empty);

        }

        if (debugBad.length === 0) {

            const empty = document.createElement("div");

            empty.className = "debugEmpty";
            empty.textContent = "No problems detected.";

            elements.debugBadList.appendChild(empty);

        }

        elements.debugSummary.textContent =
            "Successful checks: " + debugGood.length +
            " | Problems found: " + debugBad.length;

        elements.debugStatus.textContent =
            debugBad.length === 0
                ? "Analysis complete. No problems detected."
                : "Analysis complete. Problems require attention.";

    }


    /* =========================================================
       ANALYZE PROJECTS
    ========================================================= */

    async function analyze(options) {

        const {
            elements,
            loadedProjects,
            discoveredProjectFiles,
            getColumnCount,
            findProjectByPath,
            ProjectInfo
        } = options;

        debugGood = [];
        debugBad = [];

        elements.debugWindow.hidden = false;

        elements.debugStatus.textContent = "Analyzing...";

        elements.analyzeButton.disabled = true;
        elements.analyzeButton.textContent = "Analyzing...";

        try {

            /* =============================================
               PROJECT LOADING
            ============================================= */

            addGood(
                "Loaded projects: " + loadedProjects.length
            );

            addGood(
                "Discovered GitHub JSON files: " +
                discoveredProjectFiles.length
            );

            addGood(
                "Masonry columns: " + getColumnCount()
            );


            /* =============================================
               PROJECT JSON VALIDATION
            ============================================= */

            let validJSON = 0;

            loadedProjects.forEach(project => {

                if (
                    !project ||
                    !project.data ||
                    typeof project.data !== "object" ||
                    Array.isArray(project.data)
                ) {

                    addBad(
                        "Invalid project JSON: " +
                        (project?.path || "Unknown file")
                    );

                    return;

                }

                validJSON++;

                if (!project.name) {
                    addBad("Project filename is missing.");
                }

                if (!project.path) {
                    addBad("Project path is missing.");
                }

                if (!project.url) {
                    addBad("Project URL is missing.");
                }

            });

            addGood(
                "Valid loaded project JSON: " +
                validJSON +
                " of " +
                loadedProjects.length
            );


            /* =============================================
               PROJECT CARD VALIDATION
            ============================================= */

            const cardFrames = Array.from(
                elements.cards.querySelectorAll(".projectCardSlot")
            );

            const loadedFrames = cardFrames.filter(frame =>
                frame.dataset.templateLoaded === "true"
            );

            addGood(
                "Project card templates loaded: " +
                loadedFrames.length +
                " of " +
                cardFrames.length
            );

            if (loadedFrames.length !== cardFrames.length) {
                addBad("Some project card templates have not loaded.");
            }


            /* =============================================
               JSON TRANSFER VALIDATION
            ============================================= */

            const sentFrames = cardFrames.filter(frame =>
                frame.dataset.projectDataSent === "true"
            );

            addGood(
                "Project JSON sent to cards: " +
                sentFrames.length +
                " of " +
                cardFrames.length
            );

            if (sentFrames.length !== cardFrames.length) {
                addBad("Some cards have not received project JSON.");
            }


            /* =============================================
               CARD HEIGHT VALIDATION
            ============================================= */

            const measuredFrames = cardFrames.filter(frame =>
                Number(frame.dataset.cardHeight) > 0
            );

            addGood(
                "Cards with measured heights: " +
                measuredFrames.length +
                " of " +
                cardFrames.length
            );

            if (measuredFrames.length !== cardFrames.length) {
                addBad("Some cards have not reported their height.");
            }


            /* =============================================
               COMPLETE JSON DISPLAY VALIDATION
            ============================================= */

            const jsonOutputs = Array.from(
                elements.cards.querySelectorAll(".projectJsonOutput")
            );

            addGood(
                "Complete JSON displays: " +
                jsonOutputs.length +
                " of " +
                loadedProjects.length
            );

            if (jsonOutputs.length !== loadedProjects.length) {
                addBad("Some JSON displays are missing.");
            }

            let verifiedJSONOutputs = 0;

            jsonOutputs.forEach(output => {

                const project = findProjectByPath(
                    output.dataset.projectPath
                );

                const content = output.querySelector(
                    ".projectJsonContent"
                );

                if (!project || !content) {

                    addBad(
                        "JSON display missing project data: " +
                        output.dataset.projectPath
                    );

                    return;

                }

                const expectedJSON = JSON.stringify(
                    project.data,
                    null,
                    4
                );

                if (content.textContent !== expectedJSON) {

                    addBad(
                        "JSON display does not match source: " +
                        project.path
                    );

                    return;

                }

                verifiedJSONOutputs++;

            });

            addGood(
                "JSON displays verified: " +
                verifiedJSONOutputs +
                " of " +
                jsonOutputs.length
            );


            /* =============================================
               INFORMATION PANEL VALIDATION
            ============================================= */

            const informationEntries =
                elements.allProjectInformationContent
                    .querySelectorAll(".allProjectInformationEntry");

            addGood(
                "Information panel entries: " +
                informationEntries.length +
                " of " +
                loadedProjects.length
            );

            if (informationEntries.length !== loadedProjects.length) {
                addBad("Some projects are missing from the information panel.");
            }

            informationEntries.forEach(entry => {

                const project = findProjectByPath(
                    entry.dataset.projectPath
                );

                if (!project) {

                    addBad(
                        "Unknown project in information panel: " +
                        entry.dataset.projectPath
                    );

                    return;

                }

                const propertyContainer = entry.querySelector(
                    ".allProjectInformationProperties"
                );

                if (!propertyContainer) {

                    addBad(
                        "Missing property container: " + project.path
                    );

                    return;

                }

                const displayedCount =
                    propertyContainer.children.length;

                const expectedCount =
                    Object.keys(project.data).length;

                if (displayedCount !== expectedCount) {

                    addBad(
                        "Property count mismatch: " + project.path
                    );

                }

            });


            /* =============================================
               INFORMATION SECTION VALIDATION
            ============================================= */

            if (elements.allProjectInformation.hidden) {

                addBad(
                    "All Project Information section is hidden."
                );

            } else {

                addGood(
                    "All Project Information section is available."
                );

            }

            if (
                elements.allProjectInformationContent.children.length ===
                0 &&
                loadedProjects.length > 0
            ) {

                addBad(
                    "All Project Information content is empty."
                );

            } else if (loadedProjects.length > 0) {

                addGood(
                    "All Project Information content is populated."
                );

            }


            /* =============================================
               PROJECT INFORMATION MODULE
            ============================================= */

            if (
                ProjectInfo &&
                typeof ProjectInfo.createProjectGroup === "function"
            ) {

                addGood(
                    "ProjectInfo group creation is available."
                );

            } else {

                addBad(
                    "ProjectInfo.createProjectGroup is unavailable."
                );

            }


            /* =============================================
               PROJECT FILE STRUCTURE
            ============================================= */

            const nestedFiles = discoveredProjectFiles.filter(file =>
                file.path.split("/").length > 2
            );

            addGood(
                "JSON files discovered in subfolders: " +
                nestedFiles.length
            );


        } catch (error) {

            addBad(
                "Analysis failed: " + error.message
            );

            console.error(
                "Project debug analysis failed:",
                error
            );

        } finally {

            displayResults(elements);

            elements.analyzeButton.disabled = false;
            elements.analyzeButton.textContent = "Analyze Projects";

            console.log("PROJECT DEBUG RESULTS", {
                successfulChecks: debugGood,
                problems: debugBad
            });

        }

    }


    /* =========================================================
       PUBLIC API
    ========================================================= */

    window.ProjectDebug = Object.freeze({
        analyze
    });

})();
