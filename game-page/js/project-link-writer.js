
"use strict";

(function () {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const MAX_ATTEMPTS = 400;
    const CHECK_INTERVAL = 50;

    const LINKS_SECTION_ID = "links";

    let writerStarted = false;
    let waitInterval = null;
    let attempts = 0;


    /* =====================================================
       GET PROJECT INFORMATION

       USES:
       window.ProjectInformationLoader.get()

       FALLBACK:
       window.SelectedProjectInformation
    ===================================================== */

    function getProjectInformation() {

        if (
            window.ProjectInformationLoader &&
            typeof window.ProjectInformationLoader.get === "function"
        ) {

            return window.ProjectInformationLoader.get();

        }

        if (window.SelectedProjectInformation) {

            return window.SelectedProjectInformation;

        }

        return null;

    }


    /* =====================================================
       GET PROJECT JSON

       USES THE EXACT FIELD CREATED BY
       YOUR PROJECT INFORMATION LOADER.
    ===================================================== */

    function getProjectData() {

        const information = getProjectInformation();

        if (!information) {

            console.warn(
                "Game Links Writer: Project information was not received."
            );

            return null;

        }


        if (information.success === false) {

            console.warn(
                "Game Links Writer: Project information loading failed."
            );

            return null;

        }


        /* ---------------------------------------------
           PRIMARY PROJECT JSON
        --------------------------------------------- */

        let project = information.projectJSON;


        /* ---------------------------------------------
           FALLBACK TO COMPLETE SAVED RECORD
        --------------------------------------------- */

        if (
            (
                project === null ||
                project === undefined
            ) &&
            information.completeSavedRecord
        ) {

            const savedRecord =
                information.completeSavedRecord;

            project =
                savedRecord.project ??
                savedRecord.projectJSON ??
                savedRecord.json ??
                savedRecord.data ??
                null;

        }


        /* ---------------------------------------------
           PARSE JSON STRING IF NECESSARY
        --------------------------------------------- */

        if (typeof project === "string") {

            try {

                project = JSON.parse(project);

            } catch (error) {

                console.error(
                    "Game Links Writer: Project JSON could not be parsed.",
                    error
                );

                return null;

            }

        }


        /* ---------------------------------------------
           VALIDATE PROJECT JSON
        --------------------------------------------- */

        if (
            !project ||
            typeof project !== "object" ||
            Array.isArray(project)
        ) {

            console.warn(
                "Game Links Writer: No valid project JSON was received.",
                information.jsonStatus || "NO PROJECT JSON"
            );

            return null;

        }


        if (Object.keys(project).length === 0) {

            console.warn(
                "Game Links Writer: Project JSON is empty."
            );

            return null;

        }


        return project;

    }


    /* =====================================================
       CHECK VALID URL
    ===================================================== */

    function isValidURL(value) {

        if (
            typeof value !== "string" ||
            !value.trim()
        ) {

            return false;

        }


        try {

            const url = new URL(value.trim());

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );

        } catch (error) {

            return false;

        }

    }


    /* =====================================================
       GET URL DISPLAY TITLE
    ===================================================== */

    function getLinkTitle(value) {

        try {

            const url = new URL(value);

            return url.hostname.replace(/^www\./i, "");

        } catch (error) {

            return value;

        }

    }


    /* =====================================================
       FIND ALL PROJECT LINKS

       SEARCHES THE ENTIRE PROJECT JSON.

       THE FIRST PROPERTY NAME CONTAINING A URL
       BECOMES THE GROUP TITLE.

       NESTED OBJECTS AND ARRAYS KEEP THAT
       ORIGINAL FIRST PROPERTY NAME.
    ===================================================== */

    function findProjectLinks(project) {

        const linkGroups = [];
        const groupLookup = new Map();
        const visited = new WeakSet();


        /* =================================================
           ADD LINK
        ================================================= */

        function addLink(parentName, url) {

            if (!parentName) {
                return;
            }


            const title = parentName;


            if (!groupLookup.has(title)) {

                const group = {

                    title: title,

                    links: []

                };

                groupLookup.set(title, group);

                linkGroups.push(group);

            }


            const group = groupLookup.get(title);


            if (!group.links.includes(url)) {

                group.links.push(url);

            }

        }


        /* =================================================
           SCAN EVERY VALUE
        ================================================= */

        function scanValue(value, parentName) {

            if (
                value === null ||
                value === undefined
            ) {

                return;

            }


            /* ---------------------------------------------
               URL STRING
            --------------------------------------------- */

            if (typeof value === "string") {

                const url = value.trim();

                if (isValidURL(url)) {

                    addLink(
                        parentName,
                        url
                    );

                }

                return;

            }


            /* ---------------------------------------------
               IGNORE OTHER VALUE TYPES
            --------------------------------------------- */

            if (typeof value !== "object") {

                return;

            }


            /* ---------------------------------------------
               PREVENT REPEATED OBJECT SCANNING
            --------------------------------------------- */

            if (visited.has(value)) {

                return;

            }

            visited.add(value);


            /* ---------------------------------------------
               SCAN ARRAYS
            --------------------------------------------- */

            if (Array.isArray(value)) {

                value.forEach(item => {

                    scanValue(
                        item,
                        parentName
                    );

                });

                return;

            }


            /* ---------------------------------------------
               SCAN OBJECT PROPERTIES
            --------------------------------------------- */

            Object.keys(value).forEach(key => {

                scanValue(

                    value[key],

                    parentName || key

                );

            });

        }


        /* =================================================
           START SEARCH AT PROJECT ROOT
        ================================================= */

        scanValue(project, null);


        return linkGroups;

    }


    /* =====================================================
       GET LINKS SECTION
    ===================================================== */

    function getLinksSection() {

        return document.getElementById(
            LINKS_SECTION_ID
        );

    }


    /* =====================================================
       GET OR CREATE LINKS CONTAINER
    ===================================================== */

    function getLinksContainer(section) {

        let container = section.querySelector(
            '[data-generated-project-links="true"]'
        );


        if (!container) {

            container = document.createElement("div");

            container.className =
                "generated-project-links";

            container.setAttribute(
                "data-generated-project-links",
                "true"
            );

            section.appendChild(container);

        }


        return container;

    }


    /* =====================================================
       WRITE LINK GROUP
    ===================================================== */

    function writeLinkGroup(container, group) {

        const groupElement =
            document.createElement("div");

        groupElement.className =
            "project-link-group";

        groupElement.dataset.linkGroup =
            group.title;


        /* ---------------------------------------------
           GROUP TITLE
        --------------------------------------------- */

        const heading =
            document.createElement("h3");

        heading.textContent =
            group.title;

        groupElement.appendChild(heading);


        /* ---------------------------------------------
           LINKS LIST
        --------------------------------------------- */

        const list =
            document.createElement("ul");

        list.className =
            "project-link-list";


        group.links.forEach(url => {

            const listItem =
                document.createElement("li");

            const link =
                document.createElement("a");


            link.href = url;

            link.textContent =
                getLinkTitle(url);

            link.target = "_blank";

            link.rel =
                "noopener noreferrer";


            listItem.appendChild(link);

            list.appendChild(listItem);

        });


        groupElement.appendChild(list);

        container.appendChild(groupElement);

    }


    /* =====================================================
       WRITE ALL PROJECT LINKS
    ===================================================== */

    function writeAllProjectLinks() {

        const project = getProjectData();

        if (!project) {

            return false;

        }


        const section = getLinksSection();

        if (!section) {

            return false;

        }


        const container =
            getLinksContainer(section);


        /* ---------------------------------------------
           CLEAR OLD GENERATED CONTENT
        --------------------------------------------- */

        container.innerHTML = "";


        /* ---------------------------------------------
           FIND LINKS
        --------------------------------------------- */

        const linkGroups =
            findProjectLinks(project);


        /* ---------------------------------------------
           NO LINKS FOUND
        --------------------------------------------- */

        if (linkGroups.length === 0) {

            const message =
                document.createElement("p");

            message.textContent =
                "No project links have been provided.";

            container.appendChild(message);


            console.log(
                "Game Links Writer: No project URLs found."
            );

            return true;

        }


        /* ---------------------------------------------
           WRITE ALL GROUPS
        --------------------------------------------- */

        let totalLinks = 0;


        linkGroups.forEach(group => {

            writeLinkGroup(
                container,
                group
            );

            totalLinks += group.links.length;

        });


        console.log(
            "Game Links Writer: Displayed " +
            totalLinks +
            " URLs in " +
            linkGroups.length +
            " property groups."
        );


        return true;

    }


    /* =====================================================
       CHECK LINKS SECTION
    ===================================================== */

    function isLinksSectionLoaded() {

        return Boolean(
            getLinksSection()
        );

    }


    /* =====================================================
       WAIT FOR PROJECT INFORMATION AND HTML
    ===================================================== */

    function waitForInformation() {

        const information =
            getProjectInformation();

        const sectionLoaded =
            isLinksSectionLoaded();


        if (
            information &&
            sectionLoaded &&
            writeAllProjectLinks()
        ) {

            if (waitInterval !== null) {

                clearInterval(waitInterval);

                waitInterval = null;

            }


            console.log(
                "Game Links Writer: Project links loaded successfully."
            );

            return true;

        }


        attempts++;


        if (attempts >= MAX_ATTEMPTS) {

            if (waitInterval !== null) {

                clearInterval(waitInterval);

                waitInterval = null;

            }


            console.warn(
                "Game Links Writer: Maximum loading attempts reached."
            );

            return false;

        }


        return false;

    }


    /* =====================================================
       INITIALIZE WRITER
    ===================================================== */

    function initializeWriter() {

        if (writerStarted) {

            return;

        }

        writerStarted = true;


        console.log(
            "Game Links Writer: Initializing."
        );


        if (waitForInformation()) {

            return;

        }


        if (waitInterval === null) {

            waitInterval = setInterval(

                waitForInformation,

                CHECK_INTERVAL

            );

        }

    }


    /* =====================================================
       GAME SECTIONS LOADED EVENT
    ===================================================== */

    window.addEventListener(
        "gameSectionsLoaded",
        function () {

            attempts = 0;


            if (waitInterval === null) {

                waitInterval = setInterval(

                    waitForInformation,

                    CHECK_INTERVAL

                );

            }


            waitForInformation();

        }
    );


    /* =====================================================
       PROJECT INFORMATION UPDATED EVENT
    ===================================================== */

    window.addEventListener(
        "projectInformationUpdated",
        function () {

            attempts = 0;


            if (waitInterval === null) {

                waitInterval = setInterval(

                    waitForInformation,

                    CHECK_INTERVAL

                );

            }


            waitForInformation();

        }
    );


    /* =====================================================
       PAGE INITIALIZATION
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeWriter
        );

    } else {

        initializeWriter();

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.GameLinksWriter = Object.freeze({

        writeAllProjectLinks,

        getProjectData,

        findProjectLinks

    });


})();
