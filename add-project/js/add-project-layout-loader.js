
"use strict";

/* =====================================================
   ADD PROJECT - COMPLETE MAIN LAYOUT LOADER

   PURPOSE:
   1. Load all project section HTML files.
   2. Preserve numbered section order.
   3. Load each section's CSS.
   4. Execute inline section JavaScript.
   5. Load external section JavaScript.
   6. Support dynamically created buttons.
   7. Preserve each section's own dropdown handling.
   8. Initialize loaded sections.
   9. Notify other project systems when finished.

   IMPORTANT:
   - THIS LOADER DOES NOT HANDLE DROPDOWNS.
   - EACH SECTION HANDLES ITS OWN DROPDOWNS.
   - EACH SECTION KEEPS ITS OWN BUTTON HANDLERS.

   MAIN CONTAINER:
       #projectSections

   SECTION DIRECTORY:
       /sections/

   THIS IS THE ONLY LAYOUT LOADER.
===================================================== */

(function () {

    /* =====================================================
       01. PREVENT DUPLICATE INITIALIZATION
    ===================================================== */

    if (window.AddProjectLayoutLoader) {
        return;
    }

    /* =====================================================
       02. FIND LOADER LOCATION
    ===================================================== */

    const currentScript = document.currentScript;

    if (!currentScript || !currentScript.src) {

        console.error(
            "[ADD PROJECT] Could not determine loader location."
        );

        return;
    }

    const LOADER_URL = new URL(currentScript.src);

    const PROJECT_URL = new URL(
        "../",
        LOADER_URL
    );

    const SECTIONS_URL = new URL(
        "sections/",
        PROJECT_URL
    );

    const CONTAINER_SELECTOR = "#projectSections";

    let isLoading = false;

    const loadedStylesheets = new Set();

    const executedScripts = new Set();

    /* =====================================================
       03. SECTION HTML FILES

       Controls the exact page loading order.
    ===================================================== */

    const SECTION_FILES = [

        "01-project-description.html",

        "02-project-images.html",

        "03-about-project.html",

        "04-project-information.html",

        "05-story-world.html",

        "06-gameplay.html",

        "07-project-features.html",

        "08-technical-overview.html",

        "09-development-challenges.html",

        "10-development-information.html",

        "11-contributions-team.html",

        "12-development-tools-learning.html",

        "13-future-development.html",

        "14-system-requirements.html",

        "15-external-links-downloads.html",

        "16-credits-additional-information.html",

        "17-project-downloads.html"

    ];

    /* =====================================================
       04. LOAD SECTION CSS
    ===================================================== */

    function loadStylesheet(href) {

        return new Promise(function (resolve, reject) {

            const stylesheetURL = new URL(
                href,
                document.baseURI
            ).href;

            if (loadedStylesheets.has(stylesheetURL)) {

                resolve();

                return;
            }

            const existing = Array.from(
                document.querySelectorAll(
                    'link[rel="stylesheet"]'
                )
            ).find(function (link) {

                return link.href === stylesheetURL;

            });

            if (existing) {

                loadedStylesheets.add(stylesheetURL);

                resolve();

                return;
            }

            const link = document.createElement("link");

            link.rel = "stylesheet";

            link.href = stylesheetURL;

            link.onload = function () {

                loadedStylesheets.add(stylesheetURL);

                console.log(
                    "[ADD PROJECT] CSS loaded:",
                    stylesheetURL
                );

                resolve();

            };

            link.onerror = function () {

                reject(
                    new Error(
                        "Could not load CSS: " + stylesheetURL
                    )
                );

            };

            document.head.appendChild(link);

        });

    }

    /* =====================================================
       05. LOAD SECTION STYLESHEETS

       Resolve CSS paths relative to each HTML file.
    ===================================================== */

    async function loadSectionStyles(wrapper, sectionURL) {

        const stylesheetElements = Array.from(
            wrapper.querySelectorAll(
                'link[rel="stylesheet"]'
            )
        );

        for (const originalLink of stylesheetElements) {

            const originalHref = originalLink.getAttribute(
                "href"
            );

            originalLink.remove();

            if (!originalHref) {
                continue;
            }

            const stylesheetURL = new URL(
                originalHref,
                sectionURL
            ).href;

            try {

                await loadStylesheet(stylesheetURL);

            } catch (error) {

                console.error(
                    "[ADD PROJECT] CSS error:",
                    error
                );

            }

        }

        /* LOAD INLINE STYLE ELEMENTS */

        const styleElements = Array.from(
            wrapper.querySelectorAll("style")
        );

        styleElements.forEach(function (style) {

            if (
                style.dataset.mainLoaderInstalled === "true"
            ) {
                return;
            }

            style.dataset.mainLoaderInstalled = "true";

            document.head.appendChild(style);

        });

    }

    /* =====================================================
       06. EXECUTE SECTION JAVASCRIPT
    ===================================================== */

    function executeSectionScript(originalScript, sectionURL) {

        return new Promise(function (resolve, reject) {

            const source = originalScript.getAttribute("src");

            const script = document.createElement("script");

            /* COPY ORIGINAL SCRIPT ATTRIBUTES */

            Array.from(originalScript.attributes).forEach(
                function (attribute) {

                    if (
                        attribute.name !== "src" &&
                        attribute.name !== "async" &&
                        attribute.name !== "defer"
                    ) {

                        script.setAttribute(
                            attribute.name,
                            attribute.value
                        );

                    }

                }
            );

            /* EXTERNAL JAVASCRIPT */

            if (source) {

                const scriptURL = new URL(
                    source,
                    sectionURL
                ).href;

                if (executedScripts.has(scriptURL)) {

                    originalScript.remove();

                    resolve();

                    return;
                }

                script.src = scriptURL;

                script.async = false;

                script.onload = function () {

                    executedScripts.add(scriptURL);

                    console.log(
                        "[ADD PROJECT] JavaScript loaded:",
                        scriptURL
                    );

                    resolve();

                };

                script.onerror = function () {

                    reject(
                        new Error(
                            "Could not load JavaScript: " + scriptURL
                        )
                    );

                };

            }

            /* INLINE JAVASCRIPT */

            else {

                script.textContent =
                    originalScript.textContent;

            }

            originalScript.parentNode.replaceChild(
                script,
                originalScript
            );

            if (!source) {
                resolve();
            }

        });

    }

    /* =====================================================
       07. EXECUTE ALL SECTION SCRIPTS
    ===================================================== */

    async function executeSectionScripts(wrapper, sectionURL) {

        const scripts = Array.from(
            wrapper.querySelectorAll("script")
        );

        for (const originalScript of scripts) {

            try {

                await executeSectionScript(
                    originalScript,
                    sectionURL
                );

            } catch (error) {

                console.error(
                    "[ADD PROJECT] Section script error:",
                    error
                );

            }

        }

    }

    /* =====================================================
       08. INITIALIZE SECTION

       Dropdowns are intentionally NOT initialized here.
       Their individual section JavaScript handles them.
    ===================================================== */

    async function initializeSection(wrapper, sectionURL) {

        /* LOAD SECTION CSS */

        await loadSectionStyles(
            wrapper,
            sectionURL
        );

        /* EXECUTE SECTION JAVASCRIPT */

        await executeSectionScripts(
            wrapper,
            sectionURL
        );

        /* MARK SECTION AS READY */

        wrapper.dataset.sectionInitialized = "true";

        wrapper.dispatchEvent(
            new CustomEvent("projectSectionInitialized", {

                bubbles: true

            })
        );

    }

    /* =====================================================
       09. LOAD ONE SECTION
    ===================================================== */

    async function loadOneSection(file, container) {

        const sectionURL = new URL(
            file,
            SECTIONS_URL
        );

        try {

            const response = await fetch(
                sectionURL.href
            );

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }

            const html = await response.text();

            if (!html.trim()) {

                throw new Error(
                    "Section HTML is empty."
                );

            }

            const template = document.createElement(
                "template"
            );

            template.innerHTML = html;

            const wrapper = document.createElement("div");

            wrapper.className = "loaded-project-section";

            wrapper.dataset.sectionFile = file;

            wrapper.dataset.sectionLoaded = "true";

            wrapper.appendChild(
                template.content.cloneNode(true)
            );

            /* INSERT SECTION IN NUMBERED ORDER */

            container.appendChild(wrapper);

            /* LOAD CSS AND EXECUTE JAVASCRIPT */

            await initializeSection(
                wrapper,
                sectionURL
            );

            console.log(
                "[ADD PROJECT] Section ready:",
                file
            );

            return true;

        } catch (error) {

            console.error(
                "[ADD PROJECT] Failed to load:",
                file,
                error
            );

            const errorElement = document.createElement("p");

            errorElement.className = "section-loading-error";

            errorElement.textContent =
                "Failed to load " +
                file +
                ": " +
                error.message;

            container.appendChild(errorElement);

            return false;

        }

    }

    /* =====================================================
       10. LOAD ALL SECTIONS
    ===================================================== */

    async function loadSections() {

        if (isLoading) {
            return false;
        }

        const container = document.querySelector(
            CONTAINER_SELECTOR
        );

        if (!container) {

            console.error(
                "[ADD PROJECT] Missing container:",
                CONTAINER_SELECTOR
            );

            return false;

        }

        isLoading = true;

        container.innerHTML = "";

        let successful = 0;

        let failed = 0;

        try {

            for (const file of SECTION_FILES) {

                const result = await loadOneSection(
                    file,
                    container
                );

                if (result) {

                    successful++;

                } else {

                    failed++;

                }

            }

            console.log(
                "[ADD PROJECT] All sections processed.",
                {
                    successful: successful,
                    failed: failed,
                    total: SECTION_FILES.length
                }
            );

            /* ANNOUNCE COMPLETION */

            document.dispatchEvent(
                new CustomEvent("projectLayoutLoaded", {

                    detail: {

                        successful: successful,

                        failed: failed,

                        total: SECTION_FILES.length

                    }

                })
            );

            return failed === 0;

        } finally {

            isLoading = false;

        }

    }

    /* =====================================================
       11. INITIALIZE MAIN LOADER
    ===================================================== */

    function initialize() {

        loadSections();

    }

    /* =====================================================
       12. START WHEN PAGE IS READY
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }

    /* =====================================================
       13. PUBLIC API
    ===================================================== */

    window.AddProjectLayoutLoader = Object.freeze({

        loadSections: loadSections,

        loadOneSection: loadOneSection,

        initializeSection: initializeSection,

        get sectionFiles() {

            return SECTION_FILES.slice();

        },

        get sectionsURL() {

            return SECTIONS_URL.href;

        },

        get projectURL() {

            return PROJECT_URL.href;

        }

    });

})();
