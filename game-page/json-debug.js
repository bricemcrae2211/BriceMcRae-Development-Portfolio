
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const debugButton =
        document.getElementById("jsonDebugToggle");

    const debugPanel =
        document.getElementById("jsonDebugPanel");

    const debugOutput =
        document.getElementById("jsonDebugOutput");

    if (!debugButton || !debugPanel || !debugOutput) {

        console.error("JSON debug elements were not found.");
        return;

    }


    /* =====================================================
       HELPERS
    ===================================================== */

    function formatJSON(value) {

        return JSON.stringify(value, null, 4);

    }


    /* =====================================================
       DISPLAY INFORMATION
    ===================================================== */

    function displaySelectedProject() {

        const projectData =
            window.SelectedProjectInformation;

        if (!projectData || !projectData.success) {

            debugOutput.textContent =
                "PROJECT INFORMATION NOT RECEIVED\n\n" +
                (
                    projectData?.error ||
                    "The project information loader has not supplied any information."
                );

            return;

        }


        let output = "";


        output +=
            "PROJECT BUTTON INFORMATION\n" +
            "===========================\n\n";

        output += formatJSON(
            projectData.buttonInformation
        );


        output +=
            "\n\n\nPROJECT CARD INFORMATION\n" +
            "========================\n\n";

        output += formatJSON(
            projectData.cardInformation
        );


        output +=
            "\n\n\nPROJECT INFORMATION\n" +
            "===================\n\n";

        output += formatJSON(
            projectData.projectInformation
        );


        output +=
            "\n\n\nPROJECT JSON\n" +
            "============\n\n";

        output +=
            "JSON Status: " +
            projectData.jsonStatus +
            "\n\n";


        if (projectData.jsonStatus === "PROJECT JSON FOUND") {

            output += formatJSON(
                projectData.projectJSON
            );

        } else {

            output +=
                "JSON could not be displayed.\n\n" +
                "Reason: " +
                projectData.jsonReason +
                "\n\n" +
                "Button and card information was still received.";

        }


        output +=
            "\n\n\nPAGE INFORMATION\n" +
            "================\n\n";

        output +=
            projectData.pageInformation
                ? formatJSON(projectData.pageInformation)
                : "No page information was received.";


        output +=
            "\n\n\nTRANSFER REPORT\n" +
            "===============\n\n";

        output +=
            projectData.transferReport
                ? formatJSON(projectData.transferReport)
                : "No transfer report was received.";


        output +=
            "\n\n\nCOMPLETE SAVED RECORD\n" +
            "=====================\n\n";

        output += formatJSON(
            projectData.completeSavedRecord
        );


        /* =================================================
           DISPLAY
        ================================================= */

        debugOutput.textContent = output;


        /* =================================================
           CONSOLE DEBUG
        ================================================= */

        console.log(
            "Project Button Information:",
            projectData.buttonInformation
        );

        console.log(
            "Project Card Information:",
            projectData.cardInformation
        );

        console.log(
            "Project Information:",
            projectData.projectInformation
        );

        console.log(
            "Project JSON Status:",
            projectData.jsonStatus
        );

        if (projectData.jsonStatus === "PROJECT JSON FOUND") {

            console.log(
                "Project JSON:",
                projectData.projectJSON
            );

        } else {

            console.warn(
                "Project JSON Missing or Invalid:",
                projectData.jsonReason
            );

        }

    }


    /* =====================================================
       DEBUG PANEL TOGGLE
    ===================================================== */

    debugButton.addEventListener("click", () => {

        const isOpen = !debugPanel.hidden;

        debugPanel.hidden = isOpen;

        debugButton.textContent = isOpen
            ? "SHOW JSON DEBUG"
            : "HIDE JSON DEBUG";

        debugButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        if (!isOpen) {

            displaySelectedProject();

        }

    });


    /* =====================================================
       INITIAL DISPLAY
    ===================================================== */

    displaySelectedProject();


    /* =====================================================
       PUBLIC DEBUG ACCESS
    ===================================================== */

    window.ProjectJSONDebug = Object.freeze({

        refresh: displaySelectedProject

    });

});
