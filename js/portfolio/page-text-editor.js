
"use strict";

/* =========================================
   SETTINGS
========================================= */

const PAGE_TEXT_API = "/api/page-text";

const PAGE_TEXT_SELECTOR = [
    "h1", "h2", "h3", "h4",
    "p", "a", "span", "li",
    "label", "button"
].join(",");

/* =========================================
   EDITOR STATE
========================================= */

let savedPageText = {};
let pageTextLoaded = false;
let pageTextLoadPromise = null;
let pageTextLoadError = null;
let pageTextScanning = false;

/* Text editing starts OFF */
let pageTextEditingEnabled = false;

/* Active editing elements */
const activePageTextEditors = new Set();

/* =========================================
   STYLES
========================================= */

const editorStyles = document.createElement("style");

editorStyles.id = "pageTextEditorStyles";

editorStyles.textContent = `

    .page-text-edit-wrapper {
        position: relative;
        display: inline-flex;
        align-items: flex-start;
        width: fit-content;
        max-width: 100%;
        vertical-align: middle;
        gap: 9px;
    }

    .page-text-edit-content {
        display: block;
        flex: 0 1 auto;
        min-width: 0;
        max-width: 100%;
        overflow-wrap: anywhere;
        word-wrap: break-word;
    }

    .page-text-edit-control {
        position: relative;
        flex: 0 0 auto;
        display: none !important;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 2px;
        background: #20242b;
        border: 1px solid #444;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    body.page-text-admin-enabled.page-text-editing-enabled
    .page-text-edit-control:not([hidden]) {
        display: flex !important;
    }

    .page-text-edit-control[hidden],
    .page-text-edit-control button[hidden] {
        display: none !important;
    }

    .page-text-edit-control button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 19px;
        height: 19px;
        min-width: 19px;
        min-height: 19px;
        padding: 0;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        transition: background 0.15s ease;
    }

    .page-text-edit-control button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .page-text-edit-button {
        background: #2878e5;
    }

    .page-text-edit-button:hover {
        background: #155dbb;
    }

    .page-text-save-button {
        background: #238b50;
    }

    .page-text-save-button:hover {
        background: #176a3b;
    }

    .page-text-cancel-button {
        background: #555;
    }

    .page-text-cancel-button:hover {
        background: #777;
    }

    .page-text-edit-control svg {
        display: block;
        width: 11px;
        height: 11px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .page-text-editing {
        outline: 2px dashed #2878e5;
        outline-offset: 3px;
        min-width: 30px;
    }

    body:not(.page-text-editing-enabled)
    .page-text-edit-content {
        outline: none !important;
        cursor: inherit;
    }

`;

if (!document.getElementById("pageTextEditorStyles")) {
    document.head.appendChild(editorStyles);
}

/* =========================================
   ICONS
========================================= */

function createEditorIcon(type) {

    const icons = {

        edit: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>
            </svg>
        `,

        save: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 5 5L20 7"/>
            </svg>
        `,

        cancel: `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
            </svg>
        `

    };

    const container = document.createElement("span");

    container.innerHTML = icons[type] || "";

    return container.firstElementChild;

}

/* =========================================
   ADMIN PERMISSION
========================================= */

function isPageTextAdminAllowed() {

    if (typeof window.getAccountState !== "function") {
        return false;
    }

    const accountState = window.getAccountState();

    return Boolean(
        accountState &&
        accountState.adminModeEnabled === true
    );

}

/* =========================================
   TEXT EDITING PERMISSION
========================================= */

function isPageTextEditorAllowed() {

    return (
        isPageTextAdminAllowed() &&
        pageTextEditingEnabled === true
    );

}

/* =========================================
   CREATE TEXT SLUG
========================================= */

function createPageTextSlug(value) {

    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 80);

}

/* =========================================
   GET PAGE IDENTIFIER
========================================= */

function getPageTextPageIdentifier() {

    const pathname = window.location.pathname;

    return pathname
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "")
        .split("/")
        .pop()
        .replace(/\.html?$/i, "") || "home";

}

/* =========================================
   GET ORIGINAL ELEMENT LABEL
========================================= */

function getPageTextLabel(element) {

    if (
        typeof element.dataset.pageTextOriginalLabel ===
        "undefined"
    ) {

        element.dataset.pageTextOriginalLabel =
            element.textContent.trim();

    }

    return element.dataset.pageTextOriginalLabel;

}

/* =========================================
   GET SECTION ID
========================================= */

function getPageTextSectionId(element) {

    const parentSection = element.closest(
        "section[id], div[id], header[id], footer[id], nav[id]"
    );

    return parentSection
        ? parentSection.id
        : "page";

}

/* =========================================
   GET ELEMENT OCCURRENCE
========================================= */

function getPageTextOccurrence(element) {

    const tag = element.tagName.toLowerCase();

    const sectionId = getPageTextSectionId(element);

    const labelSlug = createPageTextSlug(
        getPageTextLabel(element)
    ) || "empty";

    const matchingElements = Array.from(
        document.querySelectorAll(PAGE_TEXT_SELECTOR)
    ).filter(function (candidate) {

        if (
            candidate.closest(".page-text-edit-control") ||
            candidate.closest(".page-text-edit-wrapper")
        ) {
            return false;
        }

        if (candidate.tagName.toLowerCase() !== tag) {
            return false;
        }

        if (
            getPageTextSectionId(candidate) !== sectionId
        ) {
            return false;
        }

        return (
            (createPageTextSlug(
                getPageTextLabel(candidate)
            ) || "empty") === labelSlug
        );

    });

    const occurrence = matchingElements.indexOf(element);

    return occurrence >= 0 ? occurrence + 1 : 1;

}

/* =========================================
   ELEMENT STORAGE KEY
========================================= */

function getPageTextKey(element) {

    if (element.dataset.pageTextKey) {
        return element.dataset.pageTextKey;
    }

    const key = [
        getPageTextPageIdentifier(),
        getPageTextSectionId(element),
        element.tagName.toLowerCase(),
        createPageTextSlug(getPageTextLabel(element)) || "empty",
        getPageTextOccurrence(element)
    ].join("::");

    element.dataset.pageTextKey = key;

    return key;

}

/* =========================================
   GET LEGACY DOM-PATH KEY
========================================= */

function getLegacyPageTextKey(element) {

    if (element.id) {
        return "id-" + element.id;
    }

    const path = [];

    let current = element;

    while (current && current !== document.body) {

        const parent = current.parentElement;

        if (!parent) {
            break;
        }

        const siblings = Array.from(parent.children).filter(
            function (child) {

                return !child.classList.contains(
                    "page-text-edit-control"
                ) &&
                !child.classList.contains(
                    "page-text-edit-wrapper"
                );

            }
        );

        const index = siblings.indexOf(current);

        path.unshift(
            current.tagName.toLowerCase() + "-" + index
        );

        current = parent;

    }

    return path.join("-");

}

/* =========================================
   FIND SAVED RECORD
========================================= */

function findSavedPageTextRecord(element) {

    const key = getPageTextKey(element);

    if (savedPageText[key]) {
        return savedPageText[key];
    }

    const legacyKey = getLegacyPageTextKey(element);

    if (savedPageText[legacyKey]) {
        return savedPageText[legacyKey];
    }

    const page = getPageTextPageIdentifier();
    const sectionId = getPageTextSectionId(element);
    const tag = element.tagName.toLowerCase();
    const elementId = element.id || "";

    const elementClass =
        element.className instanceof SVGAnimatedString
            ? element.className.baseVal
            : String(element.className || "");

    const label = getPageTextLabel(element);
    const labelSlug = createPageTextSlug(label);
    const occurrence = getPageTextOccurrence(element);

    for (const [savedKey, savedItem] of Object.entries(savedPageText)) {

        if (!savedItem || typeof savedItem !== "object") {
            continue;
        }

        if (savedItem.page && savedItem.page !== page) {
            continue;
        }

        if (
            savedItem.sectionId &&
            savedItem.sectionId !== sectionId
        ) {
            continue;
        }

        if (
            savedItem.element &&
            savedItem.element.toLowerCase() !== tag
        ) {
            continue;
        }

        if (
            savedItem.elementId &&
            savedItem.elementId !== elementId
        ) {
            continue;
        }

        if (
            savedItem.elementClass &&
            savedItem.elementClass !== elementClass
        ) {
            continue;
        }

        if (
            savedItem.label &&
            createPageTextSlug(savedItem.label) !== labelSlug
        ) {
            continue;
        }

        if (
            savedItem.occurrence &&
            Number(savedItem.occurrence) !== occurrence
        ) {
            continue;
        }

        if (
            !savedItem.page &&
            !savedItem.sectionId &&
            !savedItem.element &&
            !savedItem.elementId &&
            !savedItem.label
        ) {
            continue;
        }

        console.log(
            "[PAGE TEXT] Matched saved record:",
            savedKey
        );

        return savedItem;

    }

    return null;

}

/* =========================================
   LOAD SAVED TEXT INTO ELEMENT
========================================= */

function loadSavedPageText(element) {

    const savedItem = findSavedPageTextRecord(element);

    if (!savedItem) {
        return false;
    }

    const savedHTML =
        typeof savedItem === "string"
            ? savedItem
            : savedItem.html;

    if (typeof savedHTML !== "string") {
        return false;
    }

    if (element.innerHTML !== savedHTML) {
        element.innerHTML = savedHTML;
    }

    console.log(
        "[PAGE TEXT] Restored:",
        getPageTextKey(element)
    );

    return true;

}

/* =========================================
   LOAD SAVED TEXT FROM SERVER
========================================= */

async function loadPageTextFromServer() {

    pageTextLoaded = false;
    pageTextLoadError = null;

    try {

        console.log("[PAGE TEXT] Loading saved text...");

        const response = await fetch(PAGE_TEXT_API, {

            method: "GET",

            headers: {
                "Accept": "application/json"
            },

            cache: "no-store"

        });

        if (!response.ok) {
            throw new Error(
                "Server returned HTTP " + response.status
            );
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "Could not load saved text."
            );
        }

        if (
            !result.content ||
            typeof result.content !== "object" ||
            Array.isArray(result.content)
        ) {
            throw new Error(
                "The server returned invalid page text data."
            );
        }

        savedPageText = result.content;

        pageTextLoaded = true;
        pageTextLoadError = null;

        console.log(
            "[PAGE TEXT] Saved text loaded successfully.",
            savedPageText
        );

        return true;

    } catch (error) {

        pageTextLoaded = false;
        pageTextLoadError = error;

        console.error(
            "[PAGE TEXT] Loading failed:",
            error
        );

        return false;

    }

}

/* =========================================
   WAIT FOR SAVED TEXT
========================================= */

async function waitForPageText() {

    if (pageTextLoaded) {
        return true;
    }

    if (!pageTextLoadPromise) {
        pageTextLoadPromise = loadPageTextFromServer();
    }

    let loaded = await pageTextLoadPromise;

    if (!loaded) {

        console.log("[PAGE TEXT] Retrying load...");

        pageTextLoadPromise = loadPageTextFromServer();

        loaded = await pageTextLoadPromise;

    }

    return loaded;

}

/* =========================================
   GET ELEMENT ATTRIBUTES
========================================= */

function getPageTextAttributes(element) {

    const attributes = {};

    Array.from(element.attributes).forEach(function (attribute) {

        if (
            attribute.name === "contenteditable" ||
            attribute.name === "data-page-text-editor-created" ||
            attribute.name === "data-page-text-key" ||
            attribute.name === "data-page-text-original-label"
        ) {
            return;
        }

        attributes[attribute.name] = attribute.value;

    });

    return attributes;

}

/* =========================================
   GET COMPLETE ELEMENT RECORD
========================================= */

function getPageTextRecord(element) {

    return {

        key: getPageTextKey(element),

        page: getPageTextPageIdentifier(),

        sectionId: getPageTextSectionId(element),

        element: element.tagName.toLowerCase(),

        elementId: element.id || "",

        elementClass:
            element.className instanceof SVGAnimatedString
                ? element.className.baseVal
                : String(element.className || ""),

        label: getPageTextLabel(element),

        editedText: element.textContent || "",

        occurrence: getPageTextOccurrence(element),

        title: element.getAttribute("title") || "",

        ariaLabel: element.getAttribute("aria-label") || "",

        name: element.getAttribute("name") || "",

        href: element.getAttribute("href") || "",

        attributes: getPageTextAttributes(element),

        html: element.innerHTML

    };

}

/* =========================================
   PRINT COMPLETE RECORD
========================================= */

function printPageTextRecord(record) {

    console.log("");
    console.log("======================================");
    console.log("[PAGE TEXT] COMPLETE ELEMENT RECORD");
    console.log("======================================");

    console.log(JSON.stringify(record, null, 4));

    console.log("======================================");
    console.log("");

}

/* =========================================
   SAVE PAGE TEXT TO SERVER
========================================= */

async function savePageText(element) {

    if (!isPageTextEditorAllowed()) {

        console.warn(
            "[PAGE TEXT] Save blocked: text editing is OFF."
        );

        return false;

    }

    const record = getPageTextRecord(element);

    try {

        printPageTextRecord(record);

        const response = await fetch(PAGE_TEXT_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Accept": "application/json",

                "X-Admin-Mode": String(
                    isPageTextAdminAllowed()
                )

            },

            body: JSON.stringify(record)

        });

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "The server could not save your changes."
            );

        }

        const savedRecord =
            result.saved &&
            typeof result.saved === "object"
                ? result.saved
                : {
                    ...record,
                    updatedAt: result.updatedAt || null
                };

        savedPageText[record.key] = savedRecord;

        console.log(
            "[PAGE TEXT] Server confirmed saved record:",
            savedRecord
        );

        return true;

    } catch (error) {

        console.error(
            "[PAGE TEXT] Save failed:",
            error
        );

        alert(
            "Your changes could not be saved.\n\n" +
            error.message
        );

        return false;

    }

}

/* =========================================
   RESET ACTIVE EDITOR
========================================= */

function resetPageTextEditor(editor, restorePrevious) {

    if (!editor) {
        return;
    }

    const {
        element,
        controls,
        editButton,
        saveButton,
        cancelButton,
        getPreviousContent
    } = editor;

    if (restorePrevious) {
        element.innerHTML = getPreviousContent();
    }

    element.contentEditable = "false";

    element.removeAttribute("contenteditable");

    element.classList.remove("page-text-editing");

    editButton.hidden = false;
    saveButton.hidden = true;
    cancelButton.hidden = true;

    editButton.disabled = false;
    saveButton.disabled = false;
    cancelButton.disabled = false;

    controls.hidden = !isPageTextEditorAllowed();

    activePageTextEditors.delete(editor);

}

/* =========================================
   DISABLE ALL ACTIVE EDITORS
========================================= */

function cancelAllPageTextEditors() {

    Array.from(activePageTextEditors).forEach(
        function (editor) {

            resetPageTextEditor(editor, true);

        }
    );

    document.querySelectorAll(
        ".page-text-edit-content[contenteditable]"
    ).forEach(function (element) {

        element.contentEditable = "false";
        element.removeAttribute("contenteditable");

        element.classList.remove("page-text-editing");

    });

}

/* =========================================
   CREATE TEXT EDITOR
========================================= */

function createPageTextEditor(element) {

    if (
        element.dataset.pageTextEditorCreated === "true"
    ) {
        return;
    }

    if (
        element.closest(".page-text-edit-control") ||
        element.closest(".page-text-edit-wrapper")
    ) {
        return;
    }

    if (
        element.closest("script") ||
        element.closest("style") ||
        element.closest("textarea") ||
        element.closest("input") ||
        element.closest("select") ||
        element.closest("iframe")
    ) {
        return;
    }

    if (element.isContentEditable) {
        return;
    }

    element.dataset.pageTextEditorCreated = "true";

    getPageTextLabel(element);
    getPageTextKey(element);

    loadSavedPageText(element);

    const wrapper = document.createElement("span");

    wrapper.className = "page-text-edit-wrapper";

    element.parentNode.insertBefore(wrapper, element);

    element.classList.add("page-text-edit-content");

    wrapper.appendChild(element);

    const controls = document.createElement("span");

    controls.className = "page-text-edit-control";

    controls.hidden = true;

    /* Edit button */

    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.className = "page-text-edit-button";
    editButton.title = "Edit text";

    editButton.setAttribute("aria-label", "Edit text");

    editButton.appendChild(createEditorIcon("edit"));

    /* Save button */

    const saveButton = document.createElement("button");

    saveButton.type = "button";
    saveButton.className = "page-text-save-button";
    saveButton.title = "Save changes";
    saveButton.hidden = true;

    saveButton.setAttribute("aria-label", "Save changes");

    saveButton.appendChild(createEditorIcon("save"));

    /* Cancel button */

    const cancelButton = document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className = "page-text-cancel-button";
    cancelButton.title = "Cancel editing";
    cancelButton.hidden = true;

    cancelButton.setAttribute("aria-label", "Cancel editing");

    cancelButton.appendChild(createEditorIcon("cancel"));

    controls.appendChild(editButton);
    controls.appendChild(saveButton);
    controls.appendChild(cancelButton);

    wrapper.appendChild(controls);

    let previousContent = element.innerHTML;

    const editor = {

        element,
        controls,
        editButton,
        saveButton,
        cancelButton,

        getPreviousContent: function () {
            return previousContent;
        }

    };

    /* =====================================
       EDIT
    ===================================== */

    editButton.addEventListener("click", async function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (!isPageTextEditorAllowed()) {

            updatePageTextEditorVisibility();

            return;

        }

        editButton.disabled = true;

        const loaded = await waitForPageText();

        editButton.disabled = false;

        if (!isPageTextEditorAllowed()) {
            updatePageTextEditorVisibility();
            return;
        }

        if (!loaded) {

            alert(
                "Could not load saved page text.\n\n" +
                (
                    pageTextLoadError
                        ? pageTextLoadError.message
                        : "The server did not respond."
                )
            );

            return;

        }

        loadSavedPageText(element);

        previousContent = element.innerHTML;

        element.contentEditable = "true";

        element.classList.add("page-text-editing");

        editButton.hidden = true;
        saveButton.hidden = false;
        cancelButton.hidden = false;

        controls.hidden = false;

        activePageTextEditors.add(editor);

        element.focus();

    });

    /* =====================================
       SAVE
    ===================================== */

    saveButton.addEventListener("click", async function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (!isPageTextEditorAllowed()) {

            resetPageTextEditor(editor, true);

            updatePageTextEditorVisibility();

            return;

        }

        saveButton.disabled = true;

        const saveSuccessful = await savePageText(element);

        saveButton.disabled = false;

        if (!isPageTextEditorAllowed()) {

            resetPageTextEditor(editor, true);

            updatePageTextEditorVisibility();

            return;

        }

        if (!saveSuccessful) {
            return;
        }

        previousContent = element.innerHTML;

        resetPageTextEditor(editor, false);

    });

    /* =====================================
       CANCEL
    ===================================== */

    cancelButton.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        resetPageTextEditor(editor, true);

    });

}

/* =========================================
   SCAN PAGE TEXT
========================================= */

function scanPageText() {

    if (!pageTextLoaded || pageTextScanning) {
        return;
    }

    pageTextScanning = true;

    try {

        const textElements = document.querySelectorAll(
            PAGE_TEXT_SELECTOR
        );

        textElements.forEach(function (element) {

            if (
                element.closest(".page-text-edit-control") ||
                element.closest(".page-text-edit-wrapper")
            ) {
                return;
            }

            createPageTextEditor(element);

        });

        updatePageTextEditorVisibility();

    } finally {

        pageTextScanning = false;

    }

}

/* =========================================
   UPDATE EDITOR VISIBILITY
========================================= */

function updatePageTextEditorVisibility() {

    const adminAllowed = isPageTextAdminAllowed();

    const editingAllowed = isPageTextEditorAllowed();

    document.body.classList.toggle(
        "page-text-admin-enabled",
        adminAllowed
    );

    document.body.classList.toggle(
        "page-text-editing-enabled",
        editingAllowed
    );

    /* Synchronize the navigation button display */

    const editButton = document.getElementById(
        "debugEditTextButton"
    );

    if (editButton) {

        editButton.disabled = !adminAllowed;

        editButton.setAttribute(
            "aria-pressed",
            String(editingAllowed)
        );

        editButton.textContent = editingAllowed
            ? "Edit Text: ON"
            : "Edit Text: OFF";

    }

    /* Show or hide editing controls */

    document.querySelectorAll(
        ".page-text-edit-control"
    ).forEach(function (controls) {

        controls.hidden = !editingAllowed;

    });

    /* Never leave text editable without permission */

    if (!editingAllowed) {

        cancelAllPageTextEditors();

        document.querySelectorAll(
            ".page-text-edit-control"
        ).forEach(function (controls) {

            controls.hidden = true;

        });

    }

}

/* =========================================
   CHANGE TEXT EDITING MODE
========================================= */

function setPageTextEditingEnabled(enabled) {

    const permitted =
        enabled === true &&
        isPageTextAdminAllowed();

    pageTextEditingEnabled = permitted;

    if (!permitted) {
        cancelAllPageTextEditors();
    }

    updatePageTextEditorVisibility();

    console.log(
        "[PAGE TEXT] Editing:",
        pageTextEditingEnabled ? "ON" : "OFF"
    );

    document.dispatchEvent(
        new CustomEvent("pageTextEditModeChanged", {

            detail: {
                enabled: pageTextEditingEnabled
            }

        })
    );

}

/* =========================================
   EXTERNAL EDITING STATE NOTIFICATION
   HTML BUTTON SENDS THE STATE.
   THIS SCRIPT DOES NOT ADD A CLICK HANDLER.
========================================= */

document.addEventListener(
    "pageTextEditModeChanged",
    function (event) {

        const requestedState =
            event.detail &&
            event.detail.enabled === true;

        const permittedState =
            requestedState &&
            isPageTextAdminAllowed();

        pageTextEditingEnabled = permittedState;

        if (!permittedState) {
            cancelAllPageTextEditors();
        }

        updatePageTextEditorVisibility();

        console.log(
            "[PAGE TEXT] Editing:",
            pageTextEditingEnabled ? "ON" : "OFF"
        );

    }
);

/* =========================================
   WATCH FOR LOADED CONTENT
========================================= */

const pageTextObserver = new MutationObserver(function (mutations) {

    if (!pageTextLoaded) {
        return;
    }

    const relevantMutation = mutations.some(
        function (mutation) {

            if (mutation.type !== "childList") {
                return false;
            }

            const target = mutation.target;

            if (
                target.closest &&
                target.closest(".page-text-edit-wrapper")
            ) {
                return false;
            }

            return true;

        }
    );

    if (relevantMutation) {
        scanPageText();
    }

});

pageTextObserver.observe(document.body, {

    childList: true,

    subtree: true

});

/* =========================================
   ADMIN BUTTON UPDATES
========================================= */

const adminToggleButton = document.getElementById(
    "adminToggleButton"
);

if (adminToggleButton) {

    adminToggleButton.addEventListener("click", function () {

        setTimeout(function () {

            if (!isPageTextAdminAllowed()) {

                setPageTextEditingEnabled(false);

            } else {

                updatePageTextEditorVisibility();

            }

        }, 100);

    });

}

/* =========================================
   ACCOUNT STATE UPDATES
========================================= */

window.addEventListener("storage", function (event) {

    if (
        event.key === "bricePortfolioAccountState"
    ) {

        if (!isPageTextAdminAllowed()) {

            setPageTextEditingEnabled(false);

        } else {

            updatePageTextEditorVisibility();

        }

    }

});

window.addEventListener(
    "accountStateChanged",
    function () {

        if (!isPageTextAdminAllowed()) {

            setPageTextEditingEnabled(false);

        } else {

            updatePageTextEditorVisibility();

        }

    }
);

/* =========================================
   INITIALIZE
========================================= */

async function initializePageTextEditor() {

    console.log(
        "[PAGE TEXT] Initializing editor..."
    );

    pageTextEditingEnabled = false;

    updatePageTextEditorVisibility();

    pageTextLoadPromise = loadPageTextFromServer();

    const loaded = await pageTextLoadPromise;

    if (!loaded) {

        console.error(
            "[PAGE TEXT] Initial loading failed. " +
            "Editing will retry when clicked."
        );

    }

    scanPageText();

    updatePageTextEditorVisibility();

    console.log(
        "[PAGE TEXT] Admin mode:",
        isPageTextAdminAllowed()
    );

    console.log(
        "[PAGE TEXT] Text editing:",
        pageTextEditingEnabled
    );

    console.log(
        "[PAGE TEXT] Page:",
        getPageTextPageIdentifier()
    );

    console.log(
        "[PAGE TEXT] Saved records:",
        Object.keys(savedPageText).length
    );

}

initializePageTextEditor();
