
"use strict";

(function () {

    const CARD_TEMPLATE_PATH = "game-image-card.html";

    let template = null;
    let initialized = false;
    let loading = false;
    let loadingPromise = null;

    /* =========================================
       LOAD CARD TEMPLATE
    ========================================= */

    async function loadTemplate() {

        if (template) {
            return template;
        }

        const response = await fetch(
            CARD_TEMPLATE_PATH,
            { cache: "no-cache" }
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load game-image-card.html"
            );
        }

        const html = await response.text();

        const documentTemplate =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        const card =
            documentTemplate.querySelector(
                ".screenshot-card"
            );

        if (!card) {
            throw new Error(
                "Screenshot card element is missing."
            );
        }

        const styles =
            Array.from(
                documentTemplate.querySelectorAll("style")
            ).map(style => style.textContent).join("\n");

        if (!document.getElementById(
            "game-image-card-styles"
        )) {

            const style = document.createElement("style");

            style.id = "game-image-card-styles";
            style.textContent = styles;

            document.head.appendChild(style);
        }

        template = card.cloneNode(true);

        return template;
    }

    /* =========================================
       CREATE CARD
    ========================================= */

    function createCard(slot) {

        if (!slot) {
            return false;
        }

        if (slot.querySelector(".screenshot-card")) {
            return true;
        }

        if (!template) {
            return false;
        }

        const card = template.cloneNode(true);

        slot.replaceChildren(card);

        slot.dataset.cardLoaded = "true";

        slot.dataset.cardStatus = "loaded";

        slot.dispatchEvent(
            new CustomEvent(
                "game-image-card-loaded",
                {
                    bubbles: true,
                    detail: {
                        slot: slot,
                        card: card
                    }
                }
            )
        );

        return true;
    }

    /* =========================================
       LOAD ALL CARDS
    ========================================= */

    async function start() {

        if (loading) {
            return loadingPromise;
        }

        if (initialized) {
            return true;
        }

        loading = true;

        loadingPromise = (async function () {

            try {

                if (!window.GameImageSlotLoader) {
                    throw new Error(
                        "GameImageSlotLoader unavailable."
                    );
                }

                await window.GameImageSlotLoader.start();

                if (!window.GameImageSlotLoader.isInitialized()) {
                    return false;
                }

                await loadTemplate();

                const slots =
                    window.GameImageSlotLoader.getSlots();

                let count = 0;

                slots.forEach(function (slot) {

                    if (createCard(slot)) {
                        count++;
                    }

                });

                initialized = true;

                window.dispatchEvent(
                    new CustomEvent(
                        "game-image-cards-ready",
                        {
                            detail: {
                                total: slots.length,
                                loaded: count
                            }
                        }
                    )
                );

                console.log(
                    "[CardLoader] Cards loaded:",
                    count
                );

                return true;

            } catch (error) {

                console.error(
                    "[CardLoader]",
                    error
                );

                return false;

            } finally {

                loading = false;
                loadingPromise = null;

            }

        })();

        return loadingPromise;
    }

    /* =========================================
       PUBLIC API
    ========================================= */

    window.GameImageCardLoader = {

        start: start,

        createCard: createCard,

        getTemplate: function () {
            return template;
        },

        isInitialized: function () {
            return initialized;
        }

    };

    window.addEventListener(
        "game-image-slots-ready",
        start
    );

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            { once: true }
        );

    } else {

        start();

    }

})();
