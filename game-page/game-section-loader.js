
    "use strict";

    /* =========================================================
    GAME SECTION HTML LOADER

    LOADS ALL 33 GAME SECTIONS.

    LOCATION:
    game-sections/

    RESPONSIBILITIES:
    - Load individual section HTML files.
    - Preserve section order.
    - Insert sections into the main page.
    - Wait until all sections are loaded.
    - Notify the information loader.

    DOES NOT:
    - Load project JSON.
    - Load images.
    - Load videos.
    - Modify account information.
    ========================================================= */

    (function () {

        const SECTION_FOLDER = "sections/";

        const sections = [

            ["01-about.html", "about"],
            ["02-story.html", "story"],
            ["03-gameplay.html", "gameplay"],
            ["04-features.html", "features"],
            ["05-characters.html", "characters"],
            ["06-abilities.html", "abilities"],
            ["07-anchors.html", "anchors"],
            ["08-combat.html", "combat"],
            ["09-enemies.html", "enemies"],
            ["10-progression.html", "progression"],
            ["11-arena.html", "arena"],
            ["12-camera.html", "camera"],
            ["13-controls.html", "controls"],
            ["14-technical.html", "technical"],
            ["15-technical-systems.html", "technicalSystems"],
            ["16-challenges.html", "challenges"],
            ["17-development.html", "development"],
            ["18-milestones.html", "milestones"],
            ["19-contributions.html", "contributions"],
            ["20-team.html", "team"],
            ["21-tools.html", "tools"],
            ["22-learning.html", "learning"],
            ["23-future.html", "future"],
            ["24-requirements.html", "requirements"],
            ["25-links.html", "links"],
            ["26-downloads.html", "downloads"],
            ["27-credits.html", "credits"],
            ["28-gallery.html", "gallery"],
            ["29-videos.html", "videos"],
            ["30-documents.html", "documents"],
            ["31-additional.html", "additional"],
            ["32-ratings.html", "ratings"],
            ["33-comments.html", "comments"]

        ];

        /* =====================================================
        LOAD ONE SECTION
        ===================================================== */

        async function loadSection(file, sectionID) {

            const response = await fetch(
                SECTION_FOLDER + file
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load " + file +
                    " (HTTP " + response.status + ")"
                );

            }

            const html = await response.text();

            const template = document.createElement("template");

            template.innerHTML = html.trim();

            const section = template.content.querySelector(
                ".game-section"
            );

            if (!section) {

                throw new Error(
                    file + " does not contain a .game-section element."
                );

            }

            if (section.id !== sectionID) {

                throw new Error(
                    file + " has an incorrect section ID."
                );

            }

            section.dataset.sectionKey = sectionID;

            return section;

        }

        /* =====================================================
        LOAD ALL 33 SECTIONS
        ===================================================== */

        async function loadAllSections() {

            const container = document.getElementById(
                "gameSectionsContainer"
            );

            if (!container) {

                console.error(
                    "GAME SECTION LOADER: Main container missing."
                );

                return false;

            }

            container.replaceChildren();

            const loading = document.createElement("div");

            loading.id = "gameSectionsLoading";

            loading.textContent = "Loading game information...";

            container.appendChild(loading);

            try {

                const loadedSections = await Promise.all(

                    sections.map(([file, sectionID]) => {

                        return loadSection(file, sectionID);

                    })

                );

                container.replaceChildren();

                loadedSections.forEach(section => {

                    container.appendChild(section);

                });

                /* =============================================
                ALL SECTIONS LOADED
                ============================================= */

                window.GameSectionsLoaded = true;

                window.dispatchEvent(

                    new CustomEvent("gameSectionsLoaded", {

                        detail: {

                            count: loadedSections.length,

                            sections: sections.map(
                                section => section[1]
                            )

                        }

                    })

                );

                console.log(
                    "GAME SECTION LOADER: All 33 sections loaded."
                );

                return true;

            } catch (error) {

                window.GameSectionsLoaded = false;

                console.error(
                    "GAME SECTION LOADER:",
                    error
                );

                container.replaceChildren();

                const errorMessage = document.createElement("p");

                errorMessage.textContent =
                    "Unable to load game sections. Check the game-sections folder.";

                container.appendChild(errorMessage);

                return false;

            }

        }

        /* =====================================================
        PUBLIC API
        ===================================================== */

        window.GameSectionLoader = Object.freeze({

            loadAllSections,

            sections

        });

        /* =====================================================
        INITIALIZE
        ===================================================== */

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                loadAllSections,
                { once: true }
            );

        } else {

            loadAllSections();

        }

    })();
