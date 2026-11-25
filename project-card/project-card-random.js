
"use strict";

/* =========================================
   RANDOM PROJECT INFORMATION

   This file handles all random demonstration
   information displayed by the project card.

   It does not handle card styling or resizing.
========================================= */


/* =========================================
   RANDOM DATA
========================================= */

const demoData = {

    projectTitle: [
        "Forgotten Kingdom",
        "Echoes of the Deep",
        "Frozen Frontier",
        "Shattered Realms",
        "Beyond the Horizon",
        "The Last Expedition",
        "Lost Civilization",
        "Project Nightfall",
        "Silent Valley",
        "Worlds Unwritten"
    ],

    shortDescription: [
        "An experimental game focused on exploration, discovery, and interactive environments.",
        "A procedurally generated world filled with unique locations and gameplay opportunities.",
        "An independent development project featuring custom mechanics and an evolving world.",
        "Explore an unfamiliar environment, discover its secrets, and overcome challenging obstacles.",
        "A technical game development experiment exploring custom gameplay systems and procedural content."
    ],

    longDescription: [
        "This project explores the development of a custom interactive experience. It combines multiple gameplay systems with an expandable architecture designed to support future development.",
        "The project began as a small prototype and gradually developed into a larger experiment involving gameplay programming, environmental systems, and technical design.",
        "The goal of this project is to create an engaging experience while experimenting with different programming techniques and development workflows."
    ],

    story: [
        "A forgotten civilization once controlled the region. Its abandoned structures hold clues about what happened to its inhabitants.",
        "After a mysterious event, the world changed. The player must explore the environment to discover the truth.",
        "An expedition travels into unknown territory, uncovering strange locations and unexpected discoveries.",
        "The world has been abandoned for generations. New discoveries reveal fragments of its forgotten history."
    ],

    world: [
        "A large environment containing forests, mountains, rivers, abandoned settlements, and unexplored regions.",
        "A mysterious landscape with several distinct environments connected through natural pathways.",
        "An evolving world featuring different biomes, hidden locations, and interactive objects.",
        "The environment contains a mixture of natural terrain, constructed locations, and unusual landmarks."
    ],

    characters: [
        "The main character is an explorer travelling through an unfamiliar environment.",
        "Several characters inhabit the world, each with their own background and objectives.",
        "Character development is currently being explored during the prototyping stage.",
        "The player encounters different characters who provide information and objectives."
    ],

    gameplay: [
        "Exploration, movement, interaction, and environmental challenges form the core gameplay loop.",
        "Players explore the environment, interact with objects, and discover new areas.",
        "The gameplay focuses on experimentation, navigation, and completing objectives.",
        "Players progress by exploring locations, solving problems, and interacting with the world."
    ],

    mechanics: [
        "Custom movement, collision detection, interaction systems, and procedural world generation.",
        "A collection of connected systems designed to support the main gameplay experience.",
        "Environmental interaction, resource management, and custom gameplay logic.",
        "Dynamic world systems, object interactions, and configurable gameplay parameters."
    ],

    controls: [
        "WASD or left stick to move. Mouse or right stick to control the camera.",
        "Keyboard and gamepad controls are supported through configurable input actions.",
        "Movement, interaction, and other gameplay actions use a dedicated input system.",
        "Controls are designed around keyboard, mouse, and gamepad input."
    ],

    features: [
        "Custom systems, expandable architecture, interactive environments, and procedural generation.",
        "A modular project structure with reusable components and configurable settings.",
        "Dynamic environments, custom gameplay mechanics, and experimental features.",
        "Custom tools, interactive objects, and systems designed for future expansion."
    ],

    technicalAdditional: [
        "Developed reusable scripts and components to support the project's core systems.",
        "Implemented and tested gameplay features while improving the overall project architecture.",
        "Created modular code to make the project easier to expand, maintain, and debug.",
        "Worked on system integration, performance improvements, and the development of reusable functionality."
    ],

    technicalChallenges: [
        "One challenge was keeping multiple systems synchronized while maintaining reliable performance.",
        "The project required testing and adjusting several connected systems to produce consistent results.",
        "Development involved debugging complex interactions and improving the reliability of the code.",
        "Balancing flexibility and performance required careful testing and adjustments."
    ],

    genre: [
        "Adventure", "Strategy", "Simulation", "Puzzle",
        "Action", "RPG", "Sandbox", "Survival"
    ],

    subgenre: [
        "Exploration", "Procedural", "Tactical", "Survival",
        "Open World", "Management", "Construction", "Adventure"
    ],

    type: [
        "Game", "Prototype", "Technical Demo",
        "Game Jam", "Experiment", "Vertical Slice"
    ],

    perspective: [
        "Top-Down", "Third Person", "First Person",
        "2D", "Isometric", "Side View"
    ],

    gameMode: [
        "Single Player", "Multiplayer",
        "Local Co-op", "Experimental"
    ],

    ageRating: [
        "Everyone", "Everyone 10+", "Teen", "Not Rated"
    ],

    engine: [
        "Unity", "Unreal Engine", "Godot"
    ],

    engineVersion: [
        "Unity 6", "Unity 2022 LTS",
        "Unreal Engine 5", "Godot 4"
    ],

    status: [
        "In Development", "Prototype",
        "Completed", "Experimental", "On Hold"
    ],

    releaseStatus: [
        "Unreleased", "Playable Demo",
        "Development Build", "Released"
    ],

    languages: [
        "C#", "C++", "JavaScript", "Python"
    ],

    technologies: [
        "Unity", "Git", "JSON", "Procedural Generation",
        "Shader Graph", "Input System", "Physics",
        "Object Pooling", "UI Toolkit"
    ],

    role: [
        "Solo Developer", "Gameplay Programmer",
        "Game Designer", "Programmer", "Technical Designer"
    ],

    teamSize: [
        "1", "2", "3", "4", "5"
    ],

    startDate: [
        "January 2025", "March 2025", "June 2025",
        "September 2025", "January 2026"
    ],

    endDate: [
        "Ongoing", "December 2025",
        "March 2026", "June 2026"
    ],

    projectId: [
        "DEMO-001", "GAME-024", "PROJECT-105",
        "PROTO-008", "DEV-2026"
    ]
};


/* =========================================
   RANDOM HELPERS
========================================= */

function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];
}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


function randomParagraph() {

    const sentences = [
        "The system was designed to remain flexible and expandable.",
        "Additional functionality can be introduced as development continues.",
        "This feature was tested and adjusted during development.",
        "The implementation focuses on reliability and maintainability.",
        "Several approaches were explored before selecting the final solution.",
        "The feature connects with other systems throughout the project.",
        "Further improvements are planned as development progresses.",
        "The system was built using reusable components and configurable settings.",
        "Testing helped identify areas where the implementation could be improved.",
        "The final implementation supports the project's main objectives."
    ];

    const count = randomNumber(2, 6);
    const selected = [];

    for (let i = 0; i < count; i++) {

        selected.push(
            randomItem(sentences)
        );

    }

    return selected.join(" ");
}


/* =========================================
   FILL EMPTY TEXT FIELDS
========================================= */

function fillTextField(field, value) {

    const element = document.querySelector(
        `[data-project-field="${field}"]`
    );

    if (!element) return;

    if (
        element.textContent.trim() !== "" ||
        element.getAttribute("src") ||
        element.getAttribute("href")
    ) {
        return;
    }

    element.textContent = value;

    element.dataset.demoValue = "true";
}


function fillRandomTextFields() {

    Object.entries(demoData).forEach(([field, options]) => {

        fillTextField(
            field,
            randomItem(options)
        );

    });
}


/* =========================================
   RANDOM DESCRIPTION LENGTHS
========================================= */

function fillRandomDescriptions() {

    const fields = [
        "shortDescription",
        "longDescription",
        "story",
        "world",
        "characters",
        "gameplay",
        "mechanics",
        "controls",
        "features",
        "technicalAdditional",
        "technicalChallenges"
    ];

    fields.forEach(field => {

        const element = document.querySelector(
            `[data-project-field="${field}"]`
        );

        if (!element || element.textContent.trim() !== "") {
            return;
        }

        if (field === "shortDescription") {

            fillTextField(
                field,
                randomItem(demoData.shortDescription)
            );

        } else {

            fillTextField(
                field,
                randomParagraph()
            );

        }

    });
}


/* =========================================
   RANDOM TAGS AND PLATFORMS
========================================= */

function fillRandomList(field, options, className) {

    const container = document.querySelector(
        `[data-project-field="${field}"]`
    );

    if (!container || container.children.length > 0) {
        return;
    }

    const shuffled = [...options].sort(
        () => Math.random() - 0.5
    );

    const amount = randomNumber(2, 5);

    shuffled.slice(0, amount).forEach(value => {

        const item = document.createElement("span");

        item.className = className;
        item.textContent = value;
        item.dataset.demoValue = "true";

        container.appendChild(item);

    });
}


function fillRandomLists() {

    fillRandomList(
        "platforms",
        [
            "Windows", "Linux", "Mac",
            "Xbox", "PlayStation", "Web", "Android"
        ],
        "platform-item"
    );

    fillRandomList(
        "tags",
        [
            "Indie", "Procedural", "Experimental",
            "Open World", "Unity", "Gameplay",
            "Strategy", "Exploration", "Simulation",
            "Prototype", "Adventure", "Sandbox"
        ],
        "project-tag"
    );
}


/* =========================================
   RANDOM PROJECT LINKS
========================================= */

function fillRandomLinks() {

    const links = document.querySelectorAll(
        ".project-links .project-link"
    );

    links.forEach(link => {

        if (link.hasAttribute("href")) {
            return;
        }

        link.dataset.demoValue = "true";

        link.textContent = randomItem([
            "View Project",
            "Project Page",
            "View Source",
            "Watch Demo",
            "Download"
        ]);

    });
}


/* =========================================
   PUBLIC INITIALIZATION FUNCTION

   Called by project-card.html.
========================================= */

window.fillRandomProjectInformation = function () {

    fillRandomTextFields();

    fillRandomDescriptions();

    fillRandomLists();

    fillRandomLinks();

};
