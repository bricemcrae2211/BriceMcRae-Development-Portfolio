
"use strict";

/* =========================================
   PORTFOLIO LOADER

   RESPONSIBILITIES:
   - Load portfolio HTML.
   - Load external CSS.
   - Load inline CSS.
   - Execute loaded JavaScript.
   - Resolve relative file paths.
   - Automatically size video containers.
   - Load the Projects section.

   VIDEO SIZING:
   - Uses actual video aspect ratio.
   - Automatically adjusts container height.
   - Responds to browser resizing and zoom.
   - Keeps the complete video visible.

   DOES NOT HANDLE:
   - Account login or logout.
   - Account status.
   - Admin controls.
   - Admin mode.
   - Authentication.
========================================= */

(function () {

    /* =====================================
       ELEMENTS
    ===================================== */

    const projectsSectionContainer =
        document.getElementById("projectsSectionContainer");

    const addProjectContainer =
        document.getElementById("addProjectContainer");

    const demoReelContainer =
        document.getElementById("demoReelContainer");

    const demoReelUploadContainer =
        document.getElementById("demoReelUploadContainer");

    const futureGameDevelopmentContainer =
        document.getElementById("futureGameDevelopmentContainer");


    /* =====================================
       FILE PATHS
    ===================================== */

    const FILE_PATHS = {

        projects:
            "../project/projects.html",

        addProject:
            "../add-project/add-project.html",

        demoReel:
            "../demo/demo-reel.html",

        demoReelUpload:
            "../demo/demo-reel-upload.html",

        futureGameDevelopment:
            "../../future-game-development/future-game-development.html"

    };


    /* =====================================
       LOADED STYLESHEETS
    ===================================== */

    const loadedStylesheets = new Set();


    /* =====================================
       VIDEO SETTINGS
    ===================================== */

    const VIDEO_SETTINGS = {

        maximumHeight: 0,

        minimumHeight: 0,

        defaultAspectRatio: 16 / 9

    };


    /* =====================================
       LOAD EXTERNAL CSS
    ===================================== */

    async function loadExternalCSS(loadedDocument, baseURL) {

        const stylesheetLinks = Array.from(
            loadedDocument.querySelectorAll(
                'link[rel~="stylesheet"]'
            )
        );

        for (const stylesheet of stylesheetLinks) {

            const href =
                stylesheet.getAttribute("href");

            if (!href) continue;

            const cssURL =
                new URL(href, baseURL).href;

            if (loadedStylesheets.has(cssURL)) continue;

            loadedStylesheets.add(cssURL);

            const newStylesheet =
                document.createElement("link");

            newStylesheet.rel = "stylesheet";
            newStylesheet.href = cssURL;

            const loaded = new Promise((resolve, reject) => {

                newStylesheet.onload = resolve;

                newStylesheet.onerror = function () {

                    loadedStylesheets.delete(cssURL);

                    reject(
                        new Error(
                            "Failed to load CSS: " + cssURL
                        )
                    );

                };

            });

            document.head.appendChild(newStylesheet);

            await loaded;

            console.log(
                "[PORTFOLIO] CSS loaded:",
                cssURL
            );

        }

    }


    /* =====================================
       LOAD INLINE CSS
    ===================================== */

    function loadInlineCSS(loadedDocument) {

        const styles =
            loadedDocument.querySelectorAll("style");

        styles.forEach(style => {

            const newStyle =
                document.createElement("style");

            newStyle.textContent =
                style.textContent;

            document.head.appendChild(newStyle);

        });

    }


    /* =====================================
       RESOLVE FILE PATHS
    ===================================== */

    function resolveFilePaths(container, baseURL) {

        container.querySelectorAll("[src]").forEach(element => {

            const src =
                element.getAttribute("src");

            if (!src) return;

            if (
                src.startsWith("data:") ||
                src.startsWith("blob:") ||
                src.startsWith("http:") ||
                src.startsWith("https:") ||
                src.startsWith("//") ||
                src.startsWith("/")
            ) return;

            element.setAttribute(
                "src",
                new URL(src, baseURL).href
            );

        });


        container.querySelectorAll("[href]").forEach(element => {

            const href =
                element.getAttribute("href");

            if (!href) return;

            if (
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                href.startsWith("javascript:") ||
                href.startsWith("http:") ||
                href.startsWith("https:") ||
                href.startsWith("//") ||
                href.startsWith("/")
            ) return;

            element.setAttribute(
                "href",
                new URL(href, baseURL).href
            );

        });

    }


    /* =====================================
       EXECUTE LOADED SCRIPTS
    ===================================== */

    async function executeScripts(loadedDocument, baseURL) {

        const scripts = Array.from(
            loadedDocument.querySelectorAll("script")
        );

        for (const script of scripts) {

            const newScript =
                document.createElement("script");

            if (script.type) {
                newScript.type = script.type;
            }

            if (script.noModule) {
                newScript.noModule = true;
            }

            if (script.getAttribute("nonce")) {

                newScript.setAttribute(
                    "nonce",
                    script.getAttribute("nonce")
                );

            }

            const scriptSource =
                script.getAttribute("src");

            if (scriptSource) {

                newScript.src = new URL(
                    scriptSource,
                    baseURL
                ).href;

                newScript.async = false;

                const loaded = new Promise((resolve, reject) => {

                    newScript.onload = resolve;

                    newScript.onerror = function () {

                        reject(
                            new Error(
                                "Failed to load JavaScript: " +
                                newScript.src
                            )
                        );

                    };

                });

                document.body.appendChild(newScript);

                await loaded;

            } else {

                newScript.textContent =
                    script.textContent;

                document.body.appendChild(newScript);

            }

        }

    }


    /* =====================================
       GET VIDEO DIMENSIONS
    ===================================== */

    function getVideoAspectRatio(video) {

        const width =
            video.videoWidth;

        const height =
            video.videoHeight;

        if (width > 0 && height > 0) {

            return width / height;

        }

        return VIDEO_SETTINGS.defaultAspectRatio;

    }


    /* =====================================
       SIZE VIDEO ELEMENT
    ===================================== */

    function sizeVideo(video) {

        if (!video || !video.isConnected) {
            return;
        }

        const parent =
            video.parentElement;

        if (!parent) {
            return;
        }

        const availableWidth =
            parent.clientWidth;

        if (availableWidth <= 0) {
            return;
        }

        const aspectRatio =
            getVideoAspectRatio(video);

        const calculatedHeight =
            availableWidth / aspectRatio;

        video.style.width = "100%";

        video.style.height =
            calculatedHeight + "px";

        video.style.maxHeight = "none";

        video.style.maxWidth = "100%";

        video.style.objectFit = "contain";

        video.style.objectPosition = "center center";

        video.style.aspectRatio = "auto";

    }


    /* =====================================
       SIZE EMBEDDED VIDEO
    ===================================== */

    function sizeIframe(iframe) {

        if (!iframe || !iframe.isConnected) {
            return;
        }

        const parent =
            iframe.parentElement;

        if (!parent) {
            return;
        }

        const availableWidth =
            parent.clientWidth;

        if (availableWidth <= 0) {
            return;
        }

        const aspectRatio =
            VIDEO_SETTINGS.defaultAspectRatio;

        iframe.style.width = "100%";

        iframe.style.height =
            (availableWidth / aspectRatio) + "px";

        iframe.style.maxHeight = "none";

        iframe.style.maxWidth = "100%";

        iframe.style.display = "block";

    }


    /* =====================================
       UPDATE VIDEO SIZING
    ===================================== */

    function updateVideoSizing(container) {

        if (!container) {
            return;
        }

        const videos =
            container.querySelectorAll("video");

        videos.forEach(video => {

            if (!video.dataset.videoSizingInitialized) {

                video.dataset.videoSizingInitialized = "true";

                video.addEventListener(
                    "loadedmetadata",
                    () => sizeVideo(video)
                );

                video.addEventListener(
                    "loadeddata",
                    () => sizeVideo(video)
                );

                video.addEventListener(
                    "resize",
                    () => sizeVideo(video)
                );

                video.addEventListener(
                    "emptied",
                    () => sizeVideo(video)
                );

            }

            sizeVideo(video);

        });


        const iframes =
            container.querySelectorAll("iframe");

        iframes.forEach(iframe => {

            /*
             Project cards control their own
             height through their own messages.

             Do not force a video aspect ratio
             onto project card iframes.
            */

            if (
                iframe.classList.contains("projectCardSlot")
            ) {
                return;
            }

            sizeIframe(iframe);

        });

    }


    /* =====================================
       VIDEO RESIZE OBSERVER
    ===================================== */

    const videoResizeObserver =
        new ResizeObserver(function (entries) {

            entries.forEach(entry => {

                updateVideoSizing(entry.target);

            });

        });


    /* =====================================
       REGISTER VIDEO CONTAINER
    ===================================== */

    function registerVideoContainer(container) {

        if (!container) {
            return;
        }

        if (
            container.dataset.videoResizeRegistered === "true"
        ) {
            return;
        }

        container.dataset.videoResizeRegistered = "true";

        videoResizeObserver.observe(container);

        updateVideoSizing(container);

    }


    /* =====================================
       REGISTER ALL VIDEO CONTAINERS
    ===================================== */

    function registerAllVideoContainers() {

        registerVideoContainer(demoReelContainer);

        registerVideoContainer(demoReelUploadContainer);

    }


    /* =====================================
       WINDOW RESIZE
    ===================================== */

    window.addEventListener("resize", function () {

        updateVideoSizing(demoReelContainer);

        updateVideoSizing(demoReelUploadContainer);

    });


    /* =====================================
       LOAD HTML FILE
    ===================================== */

    async function loadHTMLFile(filePath, container) {

        if (!container) {

            console.error(
                "[PORTFOLIO] Missing HTML container for:",
                filePath
            );

            return false;

        }

        try {

            console.log(
                "[PORTFOLIO] Loading:",
                filePath
            );

            const fileURL = new URL(
                filePath,
                window.location.href
            );

            const response = await fetch(fileURL, {

                method: "GET",
                cache: "no-store"

            });

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status +
                    " - " +
                    response.statusText +
                    " - " +
                    fileURL.href
                );

            }

            const html =
                await response.text();

            const parser =
                new DOMParser();

            const loadedDocument =
                parser.parseFromString(
                    html,
                    "text/html"
                );

            if (loadedDocument.querySelector("parsererror")) {

                throw new Error(
                    "Unable to parse HTML file."
                );

            }

            await loadExternalCSS(
                loadedDocument,
                fileURL
            );

            loadInlineCSS(loadedDocument);

            const loadedBody =
                loadedDocument.body.cloneNode(true);

            loadedBody.querySelectorAll("script").forEach(script => {
                script.remove();
            });

            container.replaceChildren(
                ...Array.from(loadedBody.childNodes)
            );

            resolveFilePaths(
                container,
                fileURL
            );

            registerVideoContainer(container);

            await executeScripts(
                loadedDocument,
                fileURL
            );

            updateVideoSizing(container);

            console.log(
                "[PORTFOLIO] Successfully loaded:",
                fileURL.href
            );

            return true;

        } catch (error) {

            console.error(
                "[PORTFOLIO] Loading Error:",
                filePath,
                error
            );

            container.textContent =
                "Unable to load " +
                filePath +
                ". Error: " +
                error.message;

            return false;

        }

    }


    /* =====================================
       INITIALIZE PORTFOLIO
    ===================================== */

    async function initializePortfolio() {

        console.log(
            "[PORTFOLIO] Starting portfolio..."
        );

        registerAllVideoContainers();

        const results = await Promise.all([

            loadHTMLFile(
                FILE_PATHS.projects,
                projectsSectionContainer
            ),

            loadHTMLFile(
                FILE_PATHS.addProject,
                addProjectContainer
            ),

            loadHTMLFile(
                FILE_PATHS.futureGameDevelopment,
                futureGameDevelopmentContainer
            ),

            loadHTMLFile(
                FILE_PATHS.demoReel,
                demoReelContainer
            ),

            loadHTMLFile(
                FILE_PATHS.demoReelUpload,
                demoReelUploadContainer
            )

        ]);

        const successfulLoads =
            results.filter(Boolean).length;

        console.log(
            "[PORTFOLIO] Loaded sections:",
            successfulLoads,
            "/",
            results.length
        );

        updateVideoSizing(demoReelContainer);

        updateVideoSizing(demoReelUploadContainer);

        document.dispatchEvent(
            new CustomEvent("portfolioSectionsLoaded", {

                detail: {

                    successfulLoads: successfulLoads,

                    totalSections: results.length

                }

            })
        );

        console.log(
            "[PORTFOLIO] Portfolio initialization complete."
        );

    }


    /* =====================================
       INITIALIZE
    ===================================== */

    initializePortfolio();


    /* =====================================
       PUBLIC PORTFOLIO API
    ===================================== */

    window.PortfolioLoader = {

        loadHTMLFile: loadHTMLFile,

        updateVideoSizing: function () {

            updateVideoSizing(demoReelContainer);

            updateVideoSizing(demoReelUploadContainer);

        },

        reloadProjects: function () {

            return loadHTMLFile(
                FILE_PATHS.projects,
                projectsSectionContainer
            );

        }

    };

})();
