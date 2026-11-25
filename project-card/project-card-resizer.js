
"use strict";

(() => {

    /* =========================================
       ELEMENT REFERENCES
    ========================================= */

    const root = document.getElementById("cardContentRoot");
    const card = document.getElementById("projectCard");


    /* =========================================
       RESIZE SYSTEM
    ========================================= */

    let resizeObserver = null;
    let mutationObserver = null;

    let resizeFrame = null;
    let lastHeight = -1;
    let measuring = false;


    /* =========================================
       GET CARD HEIGHT
    ========================================= */

    function getCardHeight() {

        if (!root || !card) return 0;

        const cardRect = card.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();

        const height = Math.max(
            cardRect.height,
            card.offsetHeight,
            card.scrollHeight,
            rootRect.height,
            root.offsetHeight,
            root.scrollHeight
        );

        if (
            !Number.isFinite(height) ||
            height <= 0
        ) {
            return 0;
        }

        return Math.ceil(height);
    }


    /* =========================================
       UPDATE FRAME HEIGHT
    ========================================= */

    function updateFrameHeight() {

        resizeFrame = null;

        if (measuring) return;

        measuring = true;

        try {

            const frame = window.frameElement;
            const height = getCardHeight();

            if (!height) return;

            if (height === lastHeight) return;

            lastHeight = height;


            /*
               Resize the iframe.
            */

            if (frame) {

                frame.style.setProperty(
                    "display",
                    "block",
                    "important"
                );

                frame.style.setProperty(
                    "width",
                    "100%",
                    "important"
                );

                frame.style.setProperty(
                    "height",
                    `${height}px`,
                    "important"
                );

                frame.style.setProperty(
                    "min-height",
                    "0",
                    "important"
                );

                frame.style.setProperty(
                    "max-height",
                    "none",
                    "important"
                );

                frame.style.setProperty(
                    "overflow",
                    "hidden",
                    "important"
                );

                frame.setAttribute(
                    "height",
                    String(height)
                );
            }


            /*
               Notify the parent page.
            */

            if (window.parent !== window) {

                window.parent.postMessage(
                    {
                        type: "project-card-resized",
                        height: height
                    },
                    window.location.origin
                );
            }

        } finally {

            measuring = false;
        }
    }


    /* =========================================
       REQUEST CARD RESIZE
    ========================================= */

    function requestCardResize() {

        if (resizeFrame !== null) {
            cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = requestAnimationFrame(() => {
            updateFrameHeight();
        });
    }


    /* =========================================
       OBSERVE NEW ELEMENTS
    ========================================= */

    function observeElements(element) {

        if (!resizeObserver || !element) return;

        if (element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        resizeObserver.observe(element);

        element.querySelectorAll("*").forEach(child => {
            resizeObserver.observe(child);
        });
    }


    /* =========================================
       SETUP CARD RESIZE
    ========================================= */

    function setupCardResize() {

        if (!root || !card) return;

        resizeObserver?.disconnect();
        mutationObserver?.disconnect();


        /*
           Watch card dimensions.
        */

        resizeObserver = new ResizeObserver(() => {
            requestCardResize();
        });

        resizeObserver.observe(root);
        resizeObserver.observe(card);

        observeElements(root);


        /*
           Watch content changes.
        */

        mutationObserver = new MutationObserver(mutations => {

            mutations.forEach(mutation => {

                mutation.addedNodes.forEach(node => {

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        observeElements(node);
                    }

                });

            });

            requestCardResize();
        });

        mutationObserver.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });


        /*
           Watch dropdown changes.
           Capture phase handles dynamically
           added details elements too.
        */

        root.addEventListener(
            "toggle",
            requestCardResize,
            true
        );


        /*
           Watch image loading.
        */

        root.addEventListener(
            "load",
            requestCardResize,
            true
        );

        root.addEventListener(
            "error",
            requestCardResize,
            true
        );


        /*
           Watch browser font loading.
        */

        if (document.fonts) {

            document.fonts.ready.then(() => {
                requestCardResize();
            });

            document.fonts.addEventListener(
                "loadingdone",
                requestCardResize
            );
        }


        /*
           Watch viewport changes.
        */

        window.addEventListener(
            "resize",
            requestCardResize
        );


        /*
           Initial measurements.
        */

        requestCardResize();

        requestAnimationFrame(requestCardResize);

        requestAnimationFrame(() => {
            requestAnimationFrame(requestCardResize);
        });
    }


    /* =========================================
       PUBLIC ACCESS
    ========================================= */

    window.ProjectCardResizer = {

        setup: setupCardResize,

        requestResize: requestCardResize,

        getHeight: getCardHeight

    };

})();
