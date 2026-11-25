
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MAIN PAGE ELEMENT
    ===================================================== */

    const mainLoader =
        document.getElementById("mainGamePageLoader");

    if (!mainLoader) {
        console.error("Main game page loader was not found.");
        return;
    }

    /* =====================================================
       MAIN PAGE HTML
    ===================================================== */

    mainLoader.innerHTML = `

        <!-- THREE-COLUMN PAGE LAYOUT -->
        <div class="page-layout">

            <!-- LEFT ADVERTISEMENTS -->
            <aside class="side-ad side-ad-left"
                aria-label="Left advertisements">

                <div
                    id="leftAdvertisementContainer"
                    class="advertisement-loader">

                    <div class="advertisement-slot" id="leftAd1"></div>
                    <div class="advertisement-slot" id="leftAd2"></div>
                    <div class="advertisement-slot" id="leftAd3"></div>
                    <div class="advertisement-slot" id="leftAd4"></div>

                </div>

            </aside>

            <!-- MAIN GAME PAGE -->
            <main class="game-page">

                <!-- GAME BANNER -->
                <section class="game-banner" id="overview">

                    <div class="game-banner-background"></div>

                    <div class="game-banner-content">

                        <div class="game-tags" id="gameTags">

                            <span class="game-tag">NA</span>

                        </div>

                        <h1 id="gameTitle">
                            NA
                        </h1>

                        <p id="gameDescription">
                            NA
                        </p>

                    </div>

                </section>

                <!-- GAME CONTENT LAYOUT -->
                <div class="game-layout">

                    <!-- GAME SIDEBAR -->
                    <aside class="game-sidebar">

                        <!-- GAME COVER -->
                        <section class="game-cover-section">

                            <div
                                class="game-cover-container"
                                id="gameCoverContainer">

                                <img
                                    id="coverImage"
                                    class="game-cover-image"
                                    alt="Game cover"
                                    loading="eager"
                                    decoding="async"
                                    hidden
                                >

                                <img
                                    id="coverImageMissing"
                                    class="cover-image-missing"
                                    alt="Game cover unavailable"
                                    hidden
                                >

                            </div>

                        </section>

                        <!-- GAME INFORMATION -->
                        <section class="game-sidebar-section">

                            <h2>Game Information</h2>

                            <div
                                class="information-list"
                                id="gameSidebarInformation">

                                <div class="information-row">
                                    <span>Developer</span>
                                    <strong id="sidebarDeveloper">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Engine</span>
                                    <strong id="sidebarEngine">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Language</span>
                                    <strong id="sidebarLanguage">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Platform</span>
                                    <strong id="sidebarPlatform">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Release Date</span>
                                    <strong id="sidebarReleaseDate">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Status</span>
                                    <strong id="sidebarStatus">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Genre</span>
                                    <strong id="sidebarGenre">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Game Mode</span>
                                    <strong id="sidebarGameMode">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Perspective</span>
                                    <strong id="sidebarPerspective">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Age Rating</span>
                                    <strong id="sidebarAgeRating">NA</strong>
                                </div>

                            </div>

                        </section>

                        <!-- QUICK NAVIGATION -->
                        <section class="game-sidebar-section">

                            <h2>Quick Navigation</h2>

                            <div class="sidebar-navigation">

                                <a href="#about">About This Game</a>
                                <a href="#story">Story and World</a>
                                <a href="#gameplay">Gameplay</a>
                                <a href="#features">Game Features</a>
                                <a href="#characters">Characters</a>
                                <a href="#abilities">Abilities</a>
                                <a href="#anchors">Special Ability System</a>
                                <a href="#combat">Combat System</a>
                                <a href="#enemies">Enemy AI</a>
                                <a href="#progression">Progression</a>
                                <a href="#arena">Arena and Environment</a>
                                <a href="#camera">Camera Systems</a>
                                <a href="#controls">Controls</a>
                                <a href="#technical">Technical Overview</a>
                                <a href="#technicalSystems">Technical Systems</a>
                                <a href="#challenges">Technical Challenges</a>
                                <a href="#development">Development</a>
                                <a href="#milestones">Milestones</a>
                                <a href="#contributions">Contributions</a>
                                <a href="#team">Team</a>
                                <a href="#tools">Development Tools</a>
                                <a href="#learning">Learning Outcomes</a>
                                <a href="#future">Future Development</a>
                                <a href="#requirements">Requirements</a>
                                <a href="#links">External Links</a>
                                <a href="#downloads">Downloads</a>
                                <a href="#credits">Credits</a>
                                <a href="#gallery">Gallery</a>
                                <a href="#videos">Videos</a>
                                <a href="#documents">Documents</a>
                                <a href="#additional">Additional Information</a>
                                <a href="#ratings">Ratings</a>
                                <a href="#comments">Comments</a>

                            </div>

                        </section>

                        <!-- DEVELOPMENT DETAILS -->
                        <section class="game-sidebar-section">

                            <h2>Development Details</h2>

                            <div
                                class="information-list"
                                id="gameDevelopmentInformation">

                                <div class="information-row">
                                    <span>Project Type</span>
                                    <strong id="sidebarProjectType">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Developer</span>
                                    <strong id="sidebarDevelopmentRole">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Team Size</span>
                                    <strong id="sidebarTeamSize">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Build</span>
                                    <strong id="sidebarBuild">NA</strong>
                                </div>

                                <div class="information-row">
                                    <span>Last Updated</span>
                                    <strong id="sidebarLastUpdated">NA</strong>
                                </div>

                            </div>

                        </section>

                    </aside>

                    <!-- MAIN GAME INFORMATION -->
                    <main
                        class="game-main-content"
                        id="gameSectionsContainer">

                        <div id="gameSectionsLoading">
                            Loading game information...
                        </div>

                    </main>

                </div>

            </main>

            <!-- RIGHT ADVERTISEMENTS -->
            <aside class="side-ad side-ad-right"
                aria-label="Right advertisements">

                <div
                    id="rightAdvertisementContainer"
                    class="advertisement-loader">

                    <div class="advertisement-slot" id="rightAd1"></div>
                    <div class="advertisement-slot" id="rightAd2"></div>
                    <div class="advertisement-slot" id="rightAd3"></div>
                    <div class="advertisement-slot" id="rightAd4"></div>
                    <div class="advertisement-slot" id="rightAd5"></div>
                    <div class="advertisement-slot" id="rightAd6"></div>

                </div>

            </aside>

        </div>

    `;

    /* =====================================================
       MAIN PAGE LOADING COMPLETE
    ===================================================== */

    const loadingMessage =
        document.getElementById("mainGamePageLoading");

    if (loadingMessage) {
        loadingMessage.remove();
    }

    document.dispatchEvent(
        new CustomEvent("mainGamePageLoaded")
    );

});
