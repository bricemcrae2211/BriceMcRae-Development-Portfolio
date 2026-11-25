
/*
==================================================
BRICE MCRAE PORTFOLIO
ADVERTISEMENT LOADER
==================================================
*/

// IMPORTANT:
// Capture the script URL immediately.
// document.currentScript can be null inside
// a DOMContentLoaded callback.

const advertisementScriptURL = document.currentScript
    ? document.currentScript.src
    : null;


document.addEventListener("DOMContentLoaded", async function () {

    /*
    ==============================================
    1. FIND ADVERTISEMENT SLOTS
    ==============================================
    */

    const advertisementSlots = document.querySelectorAll(
        ".advertisement-slot"
    );

    if (advertisementSlots.length === 0) {

        console.error(
            "[ADVERTISEMENT ERROR] No advertisement slots found."
        );

        return;
    }


    /*
    ==============================================
    2. CHECK SCRIPT LOCATION
    ==============================================
    */

    if (!advertisementScriptURL) {

        showError(
            "Could not determine the advertisement-loader.js location.",
            "SCRIPT LOCATION ERROR"
        );

        return;
    }


    /*
    ==============================================
    3. BUILD TEMPLATE URL
    ==============================================
    */

    const templateURL = new URL(
        "../../advertisements/advertisement-template.html",
        advertisementScriptURL
    );


    console.log(
        "[ADVERTISEMENT] Template URL:",
        templateURL.href
    );

    console.log(
        "[ADVERTISEMENT] Slots found:",
        advertisementSlots.length
    );


    /*
    ==============================================
    4. DISPLAY LOADING MESSAGE
    ==============================================
    */

    advertisementSlots.forEach(function (slot) {

        slot.textContent = "Loading advertisement...";

    });


    /*
    ==============================================
    5. LOAD ADVERTISEMENT TEMPLATE
    ==============================================
    */

    try {

        const response = await fetch(templateURL.href, {
            method: "GET",
            cache: "no-store"
        });


        /*
        ==========================================
        CHECK HTTP RESPONSE
        ==========================================
        */

        if (!response.ok) {

            let reason = "";

            if (response.status === 404) {

                reason = "The advertisement template file was not found (HTTP 404). Check the folder and filename.";

            } else if (response.status === 403) {

                reason = "The server denied access to the advertisement template (HTTP 403).";

            } else if (response.status === 500) {

                reason = "The server encountered an internal error (HTTP 500).";

            } else {

                reason =
                    "The server returned HTTP " +
                    response.status +
                    " " +
                    response.statusText;

            }

            throw new Error(reason);

        }


        /*
        ==========================================
        6. READ TEMPLATE HTML
        ==========================================
        */

        const html = await response.text();


        if (!html.trim()) {

            throw new Error(
                "The advertisement template file is empty."
            );

        }


        /*
        ==========================================
        7. PARSE TEMPLATE
        ==========================================
        */

        const parser = new DOMParser();

        const parsedHTML = parser.parseFromString(
            html,
            "text/html"
        );


        /*
        ==========================================
        8. CHECK FOR HTML PARSING ERRORS
        ==========================================
        */

        const parserError = parsedHTML.querySelector(
            "parsererror"
        );

        if (parserError) {

            throw new Error(
                "The advertisement template contains invalid HTML."
            );

        }


        /*
        ==========================================
        9. FIND ADVERTISEMENT DESIGN
        ==========================================
        */

        const advertisementDesign =
            parsedHTML.querySelector(".ad-box");


        if (!advertisementDesign) {

            throw new Error(
                "The template loaded, but no element with class 'ad-box' was found. Check advertisement-template.html."
            );

        }


        /*
        ==========================================
        10. DISPLAY IN ALL ADVERTISEMENT SLOTS
        ==========================================
        */

        let successfulSlots = 0;


        advertisementSlots.forEach(function (slot) {

            const clonedAdvertisement =
                advertisementDesign.cloneNode(true);


            slot.replaceChildren(clonedAdvertisement);


            slot.dataset.adStatus = "loaded";

            successfulSlots++;

        });


        /*
        ==========================================
        11. SUCCESS INFORMATION
        ==========================================
        */

        console.log(
            "[ADVERTISEMENT SUCCESS]",
            successfulSlots,
            "advertisement spaces loaded."
        );


    } catch (error) {

        /*
        ==========================================
        12. DISPLAY THE ACTUAL ERROR
        ==========================================
        */

        console.error(
            "[ADVERTISEMENT FAILURE]",
            error
        );


        showError(
            error.message,
            "ADVERTISEMENT LOADING FAILED"
        );

    }


    /*
    ==============================================
    ERROR DISPLAY FUNCTION
    ==============================================
    */

    function showError(message, heading) {

        advertisementSlots.forEach(function (slot) {

            const errorBox = document.createElement("div");

            errorBox.className = "advertisement-error";


            const errorHeading = document.createElement("strong");

            errorHeading.textContent = heading;


            const errorMessage = document.createElement("p");

            errorMessage.textContent = message;


            const errorID = document.createElement("small");

            errorID.textContent = "Slot: " + slot.id;


            errorBox.appendChild(errorHeading);

            errorBox.appendChild(errorMessage);

            errorBox.appendChild(errorID);


            slot.replaceChildren(errorBox);

            slot.dataset.adStatus = "error";

        });


        console.error(
            "[ADVERTISEMENT DIAGNOSTICS]",
            message
        );

    }

});
