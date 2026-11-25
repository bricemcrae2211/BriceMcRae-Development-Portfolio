
"use strict";

(function () {

    /* =========================================================
       SETTINGS
    ========================================================= */

    const GAME_PAGE_URL =
        "../game-page/game-page.html";

    const STORAGE_KEY =
        "selectedProjectInformation";

    const REQUEST_TIMEOUT =
        10000;

    let requestCounter = 0;
    let pendingRequest = null;
    let navigationInProgress = false;


    /* =========================================================
       GET PROJECT CARD
    ========================================================= */

    function getProjectCard(button) {

        return (
            button.closest("[data-project-card]") ||
            button.closest(".projectGroup") ||
            button.closest(".projectCard") ||
            button.parentElement
        );

    }


    /* =========================================================
       GET PARENT PROJECT GROUP
    ========================================================= */

    function getParentProjectGroup() {

        try {

            const frame = window.frameElement;

            if (!frame) {
                return null;
            }

            return (
                frame.closest(".projectGroup") ||
                frame.closest("[data-project-card]") ||
                frame.parentElement
            );

        } catch (error) {

            console.warn(
                "Parent project group could not be accessed:",
                error
            );

            return null;

        }

    }


    /* =========================================================
       GET CARD NUMBER
    ========================================================= */

    function getCardNumber(card) {

        const numberElement = card.querySelector(
            "[data-project-card-number]"
        );

        const rawNumber =
            numberElement?.textContent?.trim() ||
            card.dataset.projectNumber ||
            card.dataset.cardNumber ||
            card.dataset.projectOrder ||
            "";

        const number = parseInt(
            String(rawNumber).replace("#", "").trim(),
            10
        );

        return Number.isFinite(number)
            ? number
            : null;

    }


    /* =========================================================
       GET CARD INFORMATION
    ========================================================= */

    function getCardInformation(button, card) {

        const parentGroup =
            getParentProjectGroup();

        const cardNumber =
            getCardNumber(card);

        let cardID =
            card.id ||
            card.dataset.projectCardId ||
            card.dataset.cardId ||
            null;

        if (!cardID && cardNumber !== null) {

            cardID = "project-card-" + cardNumber;
            card.id = cardID;

        }

        let buttonID =
            button.id ||
            button.dataset.buttonId ||
            null;

        if (!buttonID && cardNumber !== null) {

            buttonID =
                "view-game-button-" + cardNumber;

            button.id = buttonID;

        }

        const filenameElement =
            card.querySelector(
                "[data-project-json-button]"
            );

        const filename =
            card.dataset.projectFilename ||
            card.dataset.jsonFilename ||
            parentGroup?.dataset.projectFilename ||
            parentGroup?.dataset.jsonFilename ||
            filenameElement?.textContent?.trim() ||
            null;

        const api =
            window.parent.ProjectInfo || window.ProjectInfo;

        let gridPosition = null;

        if (
            api &&
            typeof api.getGridPosition === "function"
        ) {

            try {

                gridPosition =
                    api.getGridPosition(parentGroup || card);

            } catch (error) {

                console.warn(
                    "Grid position unavailable:",
                    error
                );

            }

        }

        const projectPath =
            card.dataset.projectPath ||
            card.dataset.jsonPath ||
            parentGroup?.dataset.projectPath ||
            parentGroup?.dataset.jsonPath ||
            window.frameElement?.dataset.projectPath ||
            null;

        return {

            button: {

                number: cardNumber,

                id: buttonID,

                name:
                    button.dataset.buttonName ||
                    button.getAttribute("aria-label") ||
                    button.textContent.trim() ||
                    "View Game",

                status: "Clicked",

                page: window.location.href

            },

            card: {

                number: cardNumber,

                id: cardID,

                gridPosition:
                    gridPosition?.gridPosition ??
                    (Number(card.dataset.gridPosition) || null),

                originalOrder:
                    Number(
                        parentGroup?.dataset.projectOrder ||
                        card.dataset.projectOrder
                    ) || null,

                masonryColumn:
                    gridPosition?.column ?? null,

                positionInColumn:
                    gridPosition?.positionInColumn ?? null

            },

            filename,

            path: projectPath

        };

    }


    /* =========================================================
       REQUEST PROJECT JSON FROM MAIN PAGE
    ========================================================= */

    function requestProjectData(button) {

        if (pendingRequest) {

            throw new Error(
                "A project information request is already running."
            );

        }

        const card =
            getProjectCard(button);

        if (!card) {

            throw new Error(
                "The project card containing the View Game button could not be found."
            );

        }

        const information =
            getCardInformation(button, card);

        if (!information.path) {

            throw new Error(
                "The project JSON path is missing. The parent project card must provide data-project-path."
            );

        }

        requestCounter++;

        const requestId =
            "project-request-" +
            Date.now() +
            "-" +
            requestCounter;

        return new Promise(function (resolve, reject) {

            const timeout = window.setTimeout(function () {

                if (
                    pendingRequest &&
                    pendingRequest.requestId === requestId
                ) {

                    pendingRequest = null;

                    reject(
                        new Error(
                            "The main projects page did not return the project JSON. The request timed out."
                        )
                    );

                }

            }, REQUEST_TIMEOUT);

            pendingRequest = {

                requestId,

                information,

                resolve,

                reject,

                timeout

            };

            window.parent.postMessage({

                type:
                    "project-card-request-project-data",

                requestId,

                projectPath:
                    information.path,

                button:
                    information.button,

                card:
                    information.card

            }, window.location.origin);

        });

    }


    /* =========================================================
       RECEIVE PROJECT JSON FROM MAIN PAGE
    ========================================================= */

    function receiveProjectData(event) {

        if (event.source !== window.parent) {
            return;
        }

        if (event.origin !== window.location.origin) {
            return;
        }

        const message = event.data;

        if (
            !message ||
            message.type !== "project-card-project-data"
        ) {
            return;
        }

        if (
            !pendingRequest ||
            message.requestId !== pendingRequest.requestId
        ) {
            return;
        }

        const request = pendingRequest;

        pendingRequest = null;

        window.clearTimeout(request.timeout);

        if (message.error) {

            request.reject(
                new Error(message.error)
            );

            return;

        }

        if (
            !message.project ||
            typeof message.project !== "object" ||
            Array.isArray(message.project)
        ) {

            request.reject(
                new Error(
                    "The main page returned missing or invalid project JSON."
                )
            );

            return;

        }

        request.resolve({

            project: message.project,

            filename:
                message.filename ||
                request.information.filename,

            projectPath:
                message.projectPath ||
                request.information.path,

            url:
                message.url || null,

            button:
                message.button ||
                request.information.button,

            card:
                message.card ||
                request.information.card,

            totalProjects:
                message.totalProjects ?? null

        });

    }


    /* =========================================================
       SAVE COMPLETE PROJECT INFORMATION
    ========================================================= */

    function saveProjectInformation(data) {

        if (
            !data.project ||
            typeof data.project !== "object" ||
            Array.isArray(data.project)
        ) {

            throw new Error(
                "Cannot save the project because its JSON data is invalid."
            );

        }

        const destinationURL = new URL(
            GAME_PAGE_URL,
            window.parent.location.href
        );

        const selectedProject = {

            version: "5.2",

            /* Complete original project JSON */
            project: data.project,

            projectMetadata: {

                title:
                    data.project.title ||
                    data.project.name ||
                    null,

                id:
                    data.project.id ||
                    null

            },

            jsonFile: {

                name:
                    data.filename,

                path:
                    data.projectPath,

                url:
                    data.url

            },

            button:
                data.button,

            card:
                data.card,

            totalProjects:
                data.totalProjects,

            selectedAt:
                new Date().toISOString(),

            pageInformation: {

                sourcePage:
                    window.location.href,

                sourceOrigin:
                    window.location.origin,

                destinationPage:
                    destinationURL.href,

                buttonPage:
                    window.location.href

            },

            transferReport: {

                storageType:
                    "localStorage",

                storageKey:
                    STORAGE_KEY,

                projectJSONReceived:
                    true,

                projectJSONSaved:
                    false,

                filenameReceived:
                    Boolean(data.filename),

                buttonInformationReceived:
                    Boolean(data.button?.id),

                cardInformationReceived:
                    Boolean(data.card?.id),

                storageWriteSucceeded:
                    false,

                status:
                    "SAVING",

                message:
                    "Complete project JSON, button information, and card information are being saved."

            }

        };


        /* =====================================================
           BACKWARDS COMPATIBILITY
        ===================================================== */

        selectedProject.buttonNumber =
            data.button?.number !== null &&
            data.button?.number !== undefined
                ? "#" + data.button.number
                : null;

        selectedProject.buttonID =
            data.button?.id || null;

        selectedProject.filename =
            data.filename || null;


        /* =====================================================
           SAVE TO LOCAL STORAGE
        ===================================================== */

        const storage =
            window.localStorage;

        const serializedProject =
            JSON.stringify(selectedProject);

        if (!serializedProject) {

            throw new Error(
                "The selected project could not be converted into JSON."
            );

        }

        try {

            storage.setItem(
                STORAGE_KEY,
                serializedProject
            );

            const verification =
                storage.getItem(STORAGE_KEY);

            if (!verification) {

                throw new Error(
                    "No information was returned from localStorage."
                );

            }

            const recovered =
                JSON.parse(verification);

            if (
                !recovered ||
                recovered.version !== "5.2" ||
                !recovered.project ||
                typeof recovered.project !== "object"
            ) {

                throw new Error(
                    "The saved project information failed verification."
                );

            }

            selectedProject.transferReport
                .storageWriteSucceeded = true;

            selectedProject.transferReport
                .projectJSONSaved = true;

            selectedProject.transferReport.status =
                "COMPLETE PROJECT INFORMATION SAVED SUCCESSFULLY";

            storage.setItem(
                STORAGE_KEY,
                JSON.stringify(selectedProject)
            );

            /* Verify the final saved record. */
            const finalVerification =
                JSON.parse(storage.getItem(STORAGE_KEY));

            if (
                !finalVerification ||
                !finalVerification.project ||
                finalVerification.transferReport
                    ?.projectJSONSaved !== true
            ) {

                throw new Error(
                    "The final project information could not be verified."
                );

            }

        } catch (error) {

            selectedProject.transferReport.status =
                "STORAGE FAILED";

            selectedProject.transferReport.message =
                error.message;

            throw error;

        }


        /* =====================================================
           CONSOLE DEBUG
        ===================================================== */

        console.log(
            "COMPLETE PROJECT INFORMATION SAVED:",
            selectedProject
        );

        console.log(
            "PROJECT JSON:",
            selectedProject.project
        );

        console.log(
            "BUTTON INFORMATION:",
            selectedProject.button
        );

        console.log(
            "CARD INFORMATION:",
            selectedProject.card
        );

        console.log(
            "JSON FILE:",
            selectedProject.jsonFile
        );

        console.log(
            "STORAGE KEY:",
            STORAGE_KEY
        );


        /* =====================================================
           SAVE MESSAGE
        ===================================================== */

        window.alert(

            "PROJECT INFORMATION SAVED SUCCESSFULLY.\n\n" +

            "Button Name: " +
            (data.button?.name || "Missing") + "\n" +

            "Button Number: #" +
            (data.button?.number ?? "Missing") + "\n" +

            "Button ID: " +
            (data.button?.id || "Missing") + "\n\n" +

            "Card Number: #" +
            (data.card?.number ?? "Missing") + "\n" +

            "Card ID: " +
            (data.card?.id || "Missing") + "\n\n" +

            "JSON Filename: " +
            (data.filename || "Missing") + "\n\n" +

            "Project JSON: SAVED\n\n" +

            "The game page will now open."

        );

        return selectedProject;

    }


    /* =========================================================
       OPEN GAME PAGE
    ========================================================= */

    async function openGamePage(button) {

        if (navigationInProgress) {
            return;
        }

        navigationInProgress = true;

        try {

            console.log(
                "REQUESTING COMPLETE PROJECT INFORMATION..."
            );

            const data =
                await requestProjectData(button);

            console.log(
                "PROJECT JSON RECEIVED:",
                data.project
            );

            saveProjectInformation(data);

            const destinationURL = new URL(
                GAME_PAGE_URL,
                window.parent.location.href
            );

            window.parent.location.assign(
                destinationURL.href
            );

        } catch (error) {

            navigationInProgress = false;

            console.error(
                "PROJECT INFORMATION COULD NOT BE SAVED:",
                error
            );

            window.alert(

                "PROJECT INFORMATION COULD NOT BE SAVED.\n\n" +

                error.message +

                "\n\nThe game page will not open because the project information was not saved."

            );

        }

    }


    /* =========================================================
       RECEIVE PARENT MESSAGES
    ========================================================= */

    window.addEventListener(
        "message",
        receiveProjectData
    );


    /* =========================================================
       VIEW GAME BUTTON CLICK DETECTION
    ========================================================= */

    document.addEventListener(

        "click",

        function (event) {

            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const button = target.closest(
                "[data-view-game-button]"
            );

            if (!button) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            openGamePage(button);

        },

        true

    );


    /* =========================================================
       PUBLIC NAVIGATION FUNCTION
    ========================================================= */

    window.openGamePage = function () {

        const button = document.querySelector(
            "[data-view-game-button]"
        );

        if (button) {

            openGamePage(button);

        } else {

            console.error(
                "No View Game button was found."
            );

        }

    };


})();
