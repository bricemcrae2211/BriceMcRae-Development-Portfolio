
"use strict";

(function () {

    let initialized = false;

    /* =========================================
       GET IMAGE PATH
    ========================================= */

    function getImagePath(slot) {

        return (
            slot.dataset.imageUrl ||
            slot.dataset.normalizedPath ||
            slot.dataset.imagePath ||
            slot.dataset.imageSource ||
            ""
        ).trim();
    }

    /* =========================================
       LOAD IMAGE INTO CARD
    ========================================= */

    function loadImage(slot) {

        const card =
            slot.querySelector(".screenshot-card");

        if (!card) {
            return false;
        }

        const image =
            card.querySelector(
                ".screenshot-card-image"
            );

        const missing =
            card.querySelector(
                ".screenshot-card-image-missing"
            );

        if (!image) {
            return false;
        }

        const imagePath = getImagePath(slot);

        image.onload = function () {

            image.style.display = "block";

            if (missing) {
                missing.style.display = "none";
            }

            slot.dataset.imageLoaded = "true";

        };

        image.onerror = function () {

            image.style.display = "none";

            if (missing) {
                missing.style.display = "flex";
            }

            slot.dataset.imageLoaded = "false";

            console.warn(
                "[CardImageLoader] Image unavailable:",
                imagePath
            );

        };

        if (!imagePath) {

            image.style.display = "none";

            if (missing) {
                missing.style.display = "flex";
            }

            slot.dataset.imageLoaded = "false";

            return false;
        }

        image.alt =
            slot.dataset.imageName ||
            "Game screenshot";

        image.src = imagePath;

        return true;
    }

    /* =========================================
       LOAD ALL CARD IMAGES
    ========================================= */

    function start() {

        const slots =
            document.querySelectorAll(
                ".game-image-slot"
            );

        let loaded = 0;

        slots.forEach(function (slot) {

            if (loadImage(slot)) {
                loaded++;
            }

        });

        initialized = true;

        console.log(
            "[CardImageLoader] Images started:",
            loaded
        );

        window.dispatchEvent(
            new CustomEvent(
                "game-image-card-images-ready",
                {
                    detail: {
                        total: slots.length,
                        started: loaded
                    }
                }
            )
        );

        return loaded;
    }

    /* =========================================
       PUBLIC API
    ========================================= */

    window.GameImageCardImageLoader = {

        start: start,

        loadImage: loadImage,

        isInitialized: function () {
            return initialized;
        }

    };

    /* =========================================
       WAIT FOR CARDS
    ========================================= */

    window.addEventListener(
        "game-image-cards-ready",
        start
    );

})();
