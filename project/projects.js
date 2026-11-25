        // "use strict";

        // (() => {

        //     /* =========================================
        //        ELEMENT REFERENCES
        //     ========================================= */

        //     const root = document.getElementById("cardContentRoot");
        //     const card = document.getElementById("projectCard");

        //     const image = document.querySelector(
        //         '[data-project-field="image"]'
        //     );

        //     const imageContainer = document.querySelector(
        //         "[data-project-image-container]"
        //     );


        //     /* =========================================
        //        FIELD ALIASES

        //        Allows multiple JSON naming conventions.
        //     ========================================= */

        //     const fieldAliases = {

        //         projectTitle: [
        //             "projectTitle",
        //             "title",
        //             "name"
        //         ],

        //         shortDescription: [
        //             "shortDescription",
        //             "description",
        //             "summary"
        //         ],

        //         longDescription: [
        //             "longDescription",
        //             "fullDescription",
        //             "about"
        //         ],

        //         story: [
        //             "story",
        //             "narrative"
        //         ],

        //         world: [
        //             "world",
        //             "setting"
        //         ],

        //         characters: [
        //             "characters",
        //             "characterInformation"
        //         ],

        //         gameplay: [
        //             "gameplay",
        //             "gameplayDescription"
        //         ],

        //         mechanics: [
        //             "mechanics",
        //             "gameMechanics"
        //         ],

        //         controls: [
        //             "controls",
        //             "controlScheme"
        //         ],

        //         features: [
        //             "features",
        //             "keyFeatures"
        //         ],

        //         platforms: [
        //             "platforms",
        //             "platform"
        //         ],

        //         tags: [
        //             "tags",
        //             "categories"
        //         ],

        //         genre: ["genre"],

        //         subgenre: [
        //             "subgenre",
        //             "subGenre"
        //         ],

        //         type: [
        //             "type",
        //             "projectType"
        //         ],

        //         perspective: [
        //             "perspective",
        //             "cameraPerspective"
        //         ],

        //         gameMode: [
        //             "gameMode",
        //             "mode"
        //         ],

        //         ageRating: [
        //             "ageRating",
        //             "rating"
        //         ],

        //         engine: [
        //             "engine",
        //             "gameEngine"
        //         ],

        //         engineVersion: [
        //             "engineVersion"
        //         ],

        //         status: [
        //             "status",
        //             "developmentStatus"
        //         ],

        //         releaseStatus: [
        //             "releaseStatus"
        //         ],

        //         languages: [
        //             "languages",
        //             "programmingLanguages"
        //         ],

        //         technologies: [
        //             "technologies",
        //             "tools"
        //         ],

        //         role: [
        //             "role",
        //             "myRole"
        //         ],

        //         teamSize: [
        //             "teamSize"
        //         ],

        //         startDate: [
        //             "startDate"
        //         ],

        //         endDate: [
        //             "endDate"
        //         ],

        //         projectId: [
        //             "projectId",
        //             "id"
        //         ],

        //         technicalAdditional: [
        //             "technicalAdditional",
        //             "technicalContributions",
        //             "contributions"
        //         ],

        //         technicalChallenges: [
        //             "technicalChallenges",
        //             "challenges"
        //         ],

        //         image: [
        //             "image",
        //             "imageURL",
        //             "imageUrl",
        //             "thumbnail",
        //             "thumbnailURL",
        //             "thumbnailUrl",
        //             "coverImage"
        //         ],

        //         itchURL: [
        //             "itchURL",
        //             "itchUrl",
        //             "itchio",
        //             "itchLink"
        //         ],

        //         githubURL: [
        //             "githubURL",
        //             "githubUrl",
        //             "github",
        //             "githubLink"
        //         ],

        //         websiteURL: [
        //             "websiteURL",
        //             "websiteUrl",
        //             "website",
        //             "siteURL"
        //         ],

        //         downloadURL: [
        //             "downloadURL",
        //             "downloadUrl",
        //             "downloadLink"
        //         ],

        //         videoURL: [
        //             "videoURL",
        //             "videoUrl",
        //             "video",
        //             "trailerURL"
        //         ]
        //     };


        //     /* =========================================
        //        PROJECT DATA NORMALIZATION
        //     ========================================= */

        //     function normalizeProject(rawData) {

        //         if (
        //             !rawData ||
        //             typeof rawData !== "object" ||
        //             Array.isArray(rawData)
        //         ) {
        //             return {};
        //         }

        //         const nestedProject =
        //             rawData.project &&
        //             typeof rawData.project === "object" &&
        //             !Array.isArray(rawData.project)
        //                 ? rawData.project
        //                 : {};

        //         return {
        //             ...rawData,
        //             ...nestedProject
        //         };
        //     }


        //     /* =========================================
        //        FIND JSON FIELD
        //     ========================================= */

        //     function getProjectValue(data, field) {

        //         const aliases =
        //             fieldAliases[field] || [field];

        //         for (const alias of aliases) {

        //             if (
        //                 Object.prototype.hasOwnProperty.call(
        //                     data,
        //                     alias
        //                 ) &&
        //                 data[alias] !== null &&
        //                 data[alias] !== undefined
        //             ) {
        //                 return data[alias];
        //             }
        //         }

        //         return undefined;
        //     }


        //     /* =========================================
        //        CONVERT VALUES TO TEXT
        //     ========================================= */

        //     function valueToText(value) {

        //         if (
        //             value === null ||
        //             value === undefined
        //         ) {
        //             return "";
        //         }

        //         if (Array.isArray(value)) {

        //             return value
        //                 .map(valueToText)
        //                 .filter(Boolean)
        //                 .join("\n");
        //         }

        //         if (typeof value === "object") {

        //             if (value.name !== undefined) {
        //                 return valueToText(value.name);
        //             }

        //             if (value.title !== undefined) {
        //                 return valueToText(value.title);
        //             }

        //             if (value.text !== undefined) {
        //                 return valueToText(value.text);
        //             }

        //             if (value.description !== undefined) {
        //                 return valueToText(value.description);
        //             }

        //             return Object.entries(value)
        //                 .map(([key, item]) => {
        //                     const text = valueToText(item);

        //                     return text
        //                         ? key + ": " + text
        //                         : "";
        //                 })
        //                 .filter(Boolean)
        //                 .join("\n");
        //         }

        //         return String(value);
        //     }


        //     /* =========================================
        //        FILL TEXT FIELDS
        //     ========================================= */

        //     function fillTextFields(data) {

        //         const elements = root.querySelectorAll(
        //             "[data-project-field]"
        //         );

        //         elements.forEach(element => {

        //             const field = element.dataset.projectField;

        //             /*
        //                Image and links are handled separately.
        //                Platforms and tags are rendered as lists.
        //             */

        //             if (
        //                 field === "image" ||
        //                 field === "platforms" ||
        //                 field === "tags" ||
        //                 fieldAliases[field]?.some(name => {
        //                     return [
        //                         "itchURL",
        //                         "itchUrl",
        //                         "itchio",
        //                         "itchLink",
        //                         "githubURL",
        //                         "githubUrl",
        //                         "github",
        //                         "githubLink",
        //                         "websiteURL",
        //                         "websiteUrl",
        //                         "website",
        //                         "siteURL",
        //                         "downloadURL",
        //                         "downloadUrl",
        //                         "downloadLink",
        //                         "videoURL",
        //                         "videoUrl",
        //                         "video",
        //                         "trailerURL"
        //                     ].includes(name);
        //                 })
        //             ) {
        //                 return;
        //             }

        //             const value = getProjectValue(data, field);

        //             element.textContent = valueToText(value);
        //         });
        //     }


        //     /* =========================================
        //        LIST CONVERSION
        //     ========================================= */

        //     function toList(value) {

        //         if (
        //             value === undefined ||
        //             value === null ||
        //             value === ""
        //         ) {
        //             return [];
        //         }

        //         if (Array.isArray(value)) {

        //             return value
        //                 .map(valueToText)
        //                 .filter(Boolean);
        //         }

        //         if (typeof value === "string") {

        //             return value
        //                 .split(/[,;\n]/)
        //                 .map(item => item.trim())
        //                 .filter(Boolean);
        //         }

        //         return [valueToText(value)].filter(Boolean);
        //     }


        //     /* =========================================
        //        FILL PLATFORMS AND TAGS
        //     ========================================= */

        //     function fillListField(data, field, className) {

        //         const container = root.querySelector(
        //             `[data-project-field="${field}"]`
        //         );

        //         if (!container) return;

        //         const value = getProjectValue(data, field);
        //         const items = toList(value);

        //         container.replaceChildren();

        //         items.forEach(item => {

        //             const element = document.createElement("span");

        //             element.className = className;
        //             element.textContent = item;

        //             container.appendChild(element);
        //         });
        //     }


        //     function fillLists(data) {

        //         fillListField(
        //             data,
        //             "platforms",
        //             "platform-item"
        //         );

        //         fillListField(
        //             data,
        //             "tags",
        //             "project-tag"
        //         );
        //     }


        //     /* =========================================
        //        SAFE URL
        //     ========================================= */

        //     function getSafeURL(value) {

        //         if (!value) return "";

        //         if (typeof value === "object") {

        //             value =
        //                 value.url ||
        //                 value.href ||
        //                 value.src ||
        //                 "";
        //         }

        //         if (
        //             typeof value !== "string" ||
        //             !value.trim()
        //         ) {
        //             return "";
        //         }

        //         try {

        //             const url = new URL(
        //                 value.trim(),
        //                 window.location.href
        //             );

        //             if (
        //                 url.protocol !== "https:" &&
        //                 url.protocol !== "http:"
        //             ) {
        //                 return "";
        //             }

        //             return url.href;

        //         } catch {

        //             return "";
        //         }
        //     }


        //     /* =========================================
        //        FILL PROJECT LINKS
        //     ========================================= */

        //     function fillProjectLinks(data) {

        //         const linkFields = [
        //             "itchURL",
        //             "githubURL",
        //             "websiteURL",
        //             "downloadURL",
        //             "videoURL"
        //         ];

        //         linkFields.forEach(field => {

        //             const link = root.querySelector(
        //                 `[data-project-field="${field}"]`
        //             );

        //             if (!link) return;

        //             const value = getProjectValue(data, field);
        //             const url = getSafeURL(value);

        //             if (url) {

        //                 link.href = url;
        //                 link.hidden = false;

        //             } else {

        //                 link.removeAttribute("href");
        //                 link.hidden = true;
        //             }
        //         });
        //     }


        //     /* =========================================
        //        FILL PROJECT IMAGE
        //     ========================================= */

        //     function updateThumbnail() {

        //         if (!image || !imageContainer) return;

        //         const hasImage =
        //             image.complete &&
        //             image.naturalWidth > 0;

        //         image.hidden = !hasImage;

        //         imageContainer.classList.toggle(
        //             "has-image",
        //             hasImage
        //         );

        //         requestCardResize();
        //     }


        //     function fillProjectImage(data) {

        //         if (!image || !imageContainer) return;

        //         const value = getProjectValue(data, "image");
        //         const url = getSafeURL(value);

        //         image.removeAttribute("src");
        //         image.hidden = true;

        //         imageContainer.classList.remove("has-image");

        //         if (!url) {

        //             requestCardResize();
        //             return;
        //         }

        //         image.onload = updateThumbnail;

        //         image.onerror = () => {

        //             image.removeAttribute("src");
        //             image.hidden = true;

        //             imageContainer.classList.remove("has-image");

        //             requestCardResize();
        //         };

        //         image.src = url;
        //     }


        //     /* =========================================
        //        POPULATE COMPLETE PROJECT CARD
        //     ========================================= */

        //     function populateProjectCard(rawData) {

        //         const data = normalizeProject(rawData);

        //         fillTextFields(data);
        //         fillLists(data);
        //         fillProjectLinks(data);
        //         fillProjectImage(data);

        //         console.log(
        //             "[Project Card] Project data populated:",
        //             data
        //         );

        //         /*
        //            Measure after the browser has applied
        //            the new text, lists, links and image.
        //         */

        //         requestCardResize();

        //         requestAnimationFrame(() => {
        //             requestCardResize();

        //             requestAnimationFrame(() => {
        //                 requestCardResize();
        //             });
        //         });

        //         setTimeout(requestCardResize, 100);
        //         setTimeout(requestCardResize, 400);
        //     }


        //     /* =========================================
        //        AUTOMATIC CARD HEIGHT
        //     ========================================= */

        //     let resizeObserver = null;
        //     let mutationObserver = null;

        //     let resizeFrame = null;
        //     let lastHeight = -1;
        //     let measuring = false;


        //     function getCardHeight() {

        //         if (!root || !card) return 0;

        //         const cardRect = card.getBoundingClientRect();
        //         const rootRect = root.getBoundingClientRect();

        //         const height = Math.max(
        //             cardRect.height,
        //             card.offsetHeight,
        //             card.scrollHeight,
        //             rootRect.height,
        //             root.offsetHeight,
        //             root.scrollHeight
        //         );

        //         if (
        //             !Number.isFinite(height) ||
        //             height <= 0
        //         ) {
        //             return 0;
        //         }

        //         return Math.ceil(height);
        //     }


        //     function updateFrameHeight() {

        //         resizeFrame = null;

        //         if (measuring) return;

        //         measuring = true;

        //         try {

        //             const frame = window.frameElement;

        //             const height = getCardHeight();

        //             if (!height) return;

        //             if (height === lastHeight) return;

        //             lastHeight = height;

        //             /*
        //                Direct iframe sizing works when the
        //                parent and card are same-origin.
        //             */

        //             if (frame) {

        //                 frame.style.setProperty(
        //                     "display",
        //                     "block",
        //                     "important"
        //                 );

        //                 frame.style.setProperty(
        //                     "width",
        //                     "100%",
        //                     "important"
        //                 );

        //                 frame.style.setProperty(
        //                     "height",
        //                     `${height}px`,
        //                     "important"
        //                 );

        //                 frame.style.setProperty(
        //                     "min-height",
        //                     "0",
        //                     "important"
        //                 );

        //                 frame.style.setProperty(
        //                     "max-height",
        //                     "none",
        //                     "important"
        //                 );

        //                 frame.style.setProperty(
        //                     "overflow",
        //                     "hidden",
        //                     "important"
        //                 );

        //                 frame.setAttribute(
        //                     "height",
        //                     String(height)
        //                 );
        //             }

        //             /*
        //                Notify the parent page so it can
        //                update its card layout.
        //             */

        //             if (window.parent !== window) {

        //                 window.parent.postMessage(
        //                     {
        //                         type: "project-card-resized",
        //                         height: height
        //                     },
        //                     window.location.origin
        //                 );
        //             }

        //         } finally {

        //             measuring = false;
        //         }
        //     }


        //     function requestCardResize() {

        //         if (resizeFrame !== null) {
        //             cancelAnimationFrame(resizeFrame);
        //         }

        //         resizeFrame = requestAnimationFrame(() => {
        //             updateFrameHeight();
        //         });
        //     }


        //     /* =========================================
        //        RESIZE OBSERVERS
        //     ========================================= */

        //     function setupCardResize() {

        //         if (!root || !card) return;

        //         resizeObserver?.disconnect();
        //         mutationObserver?.disconnect();


        //         /*
        //            Watch the card and root.
        //         */

        //         resizeObserver = new ResizeObserver(() => {
        //             requestCardResize();
        //         });

        //         resizeObserver.observe(root);
        //         resizeObserver.observe(card);


        //         /*
        //            Watch content changes.
        //         */

        //         mutationObserver = new MutationObserver(() => {

        //             root.querySelectorAll("*").forEach(element => {
        //                 resizeObserver.observe(element);
        //             });

        //             requestCardResize();
        //         });

        //         mutationObserver.observe(root, {
        //             childList: true,
        //             subtree: true,
        //             attributes: true,
        //             characterData: true
        //         });


        //         /*
        //            Watch dropdown changes.
        //         */

        //         root.querySelectorAll("details").forEach(details => {

        //             details.addEventListener(
        //                 "toggle",
        //                 requestCardResize
        //             );

        //         });


        //         /*
        //            Watch images.
        //         */

        //         root.querySelectorAll("img").forEach(img => {

        //             img.addEventListener(
        //                 "load",
        //                 requestCardResize
        //             );

        //             img.addEventListener(
        //                 "error",
        //                 requestCardResize
        //             );

        //         });


        //         /*
        //            Watch browser font loading.
        //         */

        //         if (document.fonts) {

        //             document.fonts.ready.then(() => {
        //                 requestCardResize();
        //             });

        //             document.fonts.addEventListener(
        //                 "loadingdone",
        //                 requestCardResize
        //             );
        //         }


        //         /*
        //            Watch viewport changes.
        //         */

        //         window.addEventListener(
        //             "resize",
        //             requestCardResize
        //         );


        //         requestCardResize();

        //         requestAnimationFrame(requestCardResize);

        //         requestAnimationFrame(() => {
        //             requestAnimationFrame(requestCardResize);
        //         });
        //     }


        //     /* =========================================
        //        RECEIVE PROJECT DATA FROM PARENT
        //     ========================================= */

        //     window.addEventListener("message", event => {

        //         /*
        //            Only accept messages from the parent
        //            page on the same origin.
        //         */

        //         if (event.origin !== window.location.origin) {
        //             return;
        //         }

        //         if (event.source !== window.parent) {
        //             return;
        //         }

        //         const message = event.data;

        //         if (
        //             !message ||
        //             typeof message !== "object"
        //         ) {
        //             return;
        //         }

        //         if (
        //             message.type === "populate-project-card" ||
        //             message.type === "PROJECT_CARD_DATA"
        //         ) {

        //             const projectData =
        //                 message.project ||
        //                 message.data ||
        //                 {};

        //             populateProjectCard(projectData);
        //         }

        //         if (
        //             message.type === "resize-project-card" ||
        //             message.type === "PROJECT_CARD_RESIZE"
        //         ) {

        //             requestCardResize();
        //         }
        //     });


        //     /* =========================================
        //        INITIALIZE
        //     ========================================= */

        //     function initializeProjectCard() {

        //         setupCardResize();

        //         /*
        //            Do not generate demo information here.
        //            The parent page supplies the real JSON.
        //         */

        //         requestCardResize();
        //     }


        //     if (document.readyState === "loading") {

        //         document.addEventListener(
        //             "DOMContentLoaded",
        //             initializeProjectCard,
        //             { once: true }
        //         );

        //     } else {

        //         initializeProjectCard();
        //     }


        //     /* =========================================
        //        DEBUG ACCESS
        //     ========================================= */

        //     window.populateProjectCard = populateProjectCard;

        // })();
