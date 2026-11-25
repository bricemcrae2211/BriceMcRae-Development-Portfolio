
"use strict";

window.ProjectSave = (() => {

    /* =====================================================
       GITHUB SETTINGS
    ===================================================== */

    const GITHUB_OWNER = "bricemcrae2211";
    const GITHUB_REPOSITORY = "bricemcraeMyPortfolioSite.github.io";
    const GITHUB_BRANCH = "main";

    const API_BASE =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}`;

    const RAW_BASE =
        `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}`;

    /* =====================================================
       MEDIA COLLECTIONS
    ===================================================== */

    const IMAGE_COLLECTIONS = [
        "screenshots",
        "gameplayImages",
        "environmentImages",
        "characterImages",
        "uiImages",
        "technicalImages",
        "others"
    ];

    const VIDEO_COLLECTIONS = [
        "gameplayVideos",
        "developmentVideos",
        "technicalDemonstrations",
        "trailers"
    ];

    const DOCUMENT_COLLECTIONS = [
        "projectDocuments"
    ];

    const IMAGE_FOLDERS = {
        screenshots: "screenshots",
        gameplayImages: "gameplay",
        environmentImages: "environment",
        characterImages: "character",
        uiImages: "ui",
        technicalImages: "technical",
        others: "extra"
    };

    const COVER_FIELDS = [
        "coverImage",
        "projectCoverImage",
        "cover"
    ];

    const MEDIA_SOURCE_FIELDS = [
        "data",
        "src",
        "url",
        "image",
        "video",
        "file",
        "base64",
        "dataUrl",
        "imageData",
        "videoData",
        "fileData",
        "downloadUrl",
        "path",
        "exportedPath"
    ];

    const MIME_EXTENSIONS = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "image/bmp": "bmp",
        "image/avif": "avif",
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/ogg": "ogv",
        "video/quicktime": "mov",
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/zip": "zip",
        "text/plain": "txt"
    };

    let githubToken = null;
    let saving = false;

    /* =====================================================
       GITHUB TOKEN
    ===================================================== */

    function getToken() {

        if (githubToken) {
            return githubToken;
        }

        const token = prompt(
            "Enter your GitHub Personal Access Token.\n\n" +
            "Required permission:\n" +
            "Contents: Read and write"
        );

        if (!token || !token.trim()) {
            throw new Error("GitHub token was not provided.");
        }

        githubToken = token.trim();

        return githubToken;
    }

    /* =====================================================
       GITHUB HEADERS
    ===================================================== */

    function getHeaders() {

        return {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${getToken()}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json"
        };
    }

    /* =====================================================
       SAFE NAMES
    ===================================================== */

    function safeName(value) {

        return String(value || "Untitled")
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
            .replace(/[. ]+$/g, "")
            .trim() || "Untitled";
    }

    /* =====================================================
       ENCODE GITHUB PATH
    ===================================================== */

    function encodeGitHubPath(path) {

        return path
            .split("/")
            .map(segment => encodeURIComponent(segment))
            .join("/");
    }

    /* =====================================================
       FILE EXTENSION
    ===================================================== */

    function getExtension(filename, mimeType) {

        if (filename && /\.[a-z0-9]+$/i.test(filename)) {
            return filename.split(".").pop().toLowerCase();
        }

        return MIME_EXTENSIONS[mimeType] || "bin";
    }

    /* =====================================================
       MEDIA SOURCE
    ===================================================== */

    function getMediaSource(item) {

        if (
            typeof item === "string" ||
            (typeof Blob !== "undefined" && item instanceof Blob)
        ) {
            return item;
        }

        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return null;
        }

        for (const field of MEDIA_SOURCE_FIELDS) {

            const value = item[field];

            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }

            if (typeof Blob !== "undefined" && value instanceof Blob) {
                return value;
            }
        }

        return null;
    }

    /* =====================================================
       MEDIA FILE NAME
    ===================================================== */

    function getMediaFilename(item, index, collection) {

        if (item && typeof item === "object") {

            const names = [
                item.filename,
                item.fileName,
                item.originalName,
                item.name,
                item.title
            ];

            for (const name of names) {

                if (typeof name === "string" && name.trim()) {
                    return safeName(name);
                }
            }
        }

        return safeName(collection) + "_" + (index + 1);
    }

    /* =====================================================
       MEDIA TO BLOB
    ===================================================== */

    async function getMediaBlob(source, projectFolder) {

        if (typeof Blob !== "undefined" && source instanceof Blob) {
            return source;
        }

        if (typeof source !== "string" || !source.trim()) {
            throw new Error("Invalid media source.");
        }

        let value = source.trim();

        if (
            value.startsWith("data:") ||
            value.startsWith("blob:") ||
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {

            const response = await fetch(value);

            if (!response.ok) {
                throw new Error(
                    `Could not download media: ${response.status}`
                );
            }

            return response.blob();
        }

        value = value
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");

        if (value.startsWith("projects/")) {
            value = value.substring("projects/".length);
        }

        if (value.startsWith(projectFolder + "/")) {
            value = value.substring(projectFolder.length + 1);
        }

        if (value.startsWith(projectFolder + "/")) {
            throw new Error("Invalid project media path.");
        }

        const url =
            `${RAW_BASE}/projects/` +
            `${encodeURIComponent(projectFolder)}/` +
            encodeGitHubPath(value);

        const response = await fetch(url, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `Could not load existing project media: ${value}`
            );
        }

        return response.blob();
    }

    /* =====================================================
       BLOB TO BASE64
    ===================================================== */

    async function blobToBase64(blob) {

        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const CHUNK_SIZE = 0x8000;

        let binary = "";

        for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {

            binary += String.fromCharCode(
                ...bytes.subarray(i, i + CHUNK_SIZE)
            );
        }

        return btoa(binary);
    }

    /* =====================================================
       EXISTING GITHUB FILE SHA
    ===================================================== */

    async function getExistingFileSHA(path) {

        const url =
            `${API_BASE}/contents/${encodeGitHubPath(path)}` +
            `?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders()
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `GitHub file lookup failed: ${response.status}`
            );
        }

        const result = await response.json();

        return result.sha || null;
    }

    /* =====================================================
       UPLOAD FILE TO GITHUB
    ===================================================== */

    async function uploadFile(path, content, isBinary = false) {

        const sha = await getExistingFileSHA(path);

        let encodedContent;

        if (isBinary) {

            encodedContent = await blobToBase64(content);

        } else {

            encodedContent = btoa(
                unescape(encodeURIComponent(content))
            );
        }

        const body = {
            message: `Save project file: ${path}`,
            content: encodedContent,
            branch: GITHUB_BRANCH
        };

        if (sha) {
            body.sha = sha;
        }

        const url =
            `${API_BASE}/contents/${encodeGitHubPath(path)}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {

            let message = "";

            try {
                const error = await response.json();
                message = error.message || "";
            } catch (_) {}

            throw new Error(
                `GitHub upload failed for ${path} ` +
                `(HTTP ${response.status}). ${message}`
            );
        }

        const result = await response.json();

        console.log("GITHUB FILE SAVED:", path);

        return result;
    }

    /* =====================================================
       UNIQUE FILE NAMES
    ===================================================== */

    function createUniqueFilename(filename, usedPaths) {

        const dot = filename.lastIndexOf(".");
        const hasExtension = dot > 0;

        const base = hasExtension
            ? filename.substring(0, dot)
            : filename;

        const extension = hasExtension
            ? filename.substring(dot)
            : "";

        let result = filename;
        let counter = 2;

        while (usedPaths.has(result.toLowerCase())) {

            result = `${base}_${counter}${extension}`;
            counter++;
        }

        usedPaths.add(result.toLowerCase());

        return result;
    }

    /* =====================================================
       UPLOAD MEDIA FILE
    ===================================================== */

    async function uploadMediaFile(
        item,
        index,
        collection,
        destination,
        projectFolder,
        usedPaths
    ) {

        const source = getMediaSource(item);

        if (!source) {
            console.warn("MEDIA SOURCE MISSING:", collection, item);
            return null;
        }

        const blob = await getMediaBlob(source, projectFolder);

        let filename = getMediaFilename(item, index, collection);

        const extension = getExtension(filename, blob.type);

        if (!/\.[a-z0-9]+$/i.test(filename)) {
            filename += "." + extension;
        }

        filename = createUniqueFilename(filename, usedPaths);

        const relativePath =
            `${projectFolder}/${destination}/${filename}`;

        const githubPath =
            `projects/${relativePath}`;

        await uploadFile(githubPath, blob, true);

        return relativePath;
    }

    /* =====================================================
       REPLACE MEDIA SOURCE WITH RELATIVE PATH
    ===================================================== */

    function replaceMediaWithPath(item, relativePath) {

        if (
            typeof item === "string" ||
            (typeof Blob !== "undefined" && item instanceof Blob)
        ) {
            return {
                name: relativePath.split("/").pop(),
                path: relativePath
            };
        }

        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return {
                path: relativePath
            };
        }

        const updated = { ...item };

        for (const field of MEDIA_SOURCE_FIELDS) {
            delete updated[field];
        }

        updated.path = relativePath;

        return updated;
    }

    /* =====================================================
       EXPORT COLLECTION
    ===================================================== */

    async function exportCollection(
        data,
        collection,
        location,
        projectFolder,
        usedPaths,
        results
    ) {

        const items = data[collection];

        if (!Array.isArray(items)) {
            return;
        }

        const isImage = IMAGE_COLLECTIONS.includes(collection);
        const isVideo = VIDEO_COLLECTIONS.includes(collection);
        const isDocument = DOCUMENT_COLLECTIONS.includes(collection);

        if (!isImage && !isVideo && !isDocument) {
            return;
        }

        let destination;

        if (isImage) {
            destination = "images/" + IMAGE_FOLDERS[collection];
        } else if (isVideo) {
            destination = "videos/" + collection;
        } else {
            destination = "documents/" + collection;
        }

        results[location] = [];

        for (let i = 0; i < items.length; i++) {

            const relativePath = await uploadMediaFile(
                items[i],
                i,
                collection,
                destination,
                projectFolder,
                usedPaths
            );

            results[location].push(relativePath);
        }
    }

    /* =====================================================
       EXPORT ALL MEDIA COLLECTIONS
    ===================================================== */

    async function exportMediaCollections(
        data,
        projectFolder,
        usedPaths
    ) {

        const results = {};

        const allCollections = [
            ...IMAGE_COLLECTIONS,
            ...VIDEO_COLLECTIONS,
            ...DOCUMENT_COLLECTIONS
        ];

        for (const collection of allCollections) {

            await exportCollection(
                data,
                collection,
                collection,
                projectFolder,
                usedPaths,
                results
            );
        }

        if (
            data.projectImages &&
            typeof data.projectImages === "object"
        ) {

            for (const collection of IMAGE_COLLECTIONS) {

                await exportCollection(
                    data.projectImages,
                    collection,
                    "projectImages." + collection,
                    projectFolder,
                    usedPaths,
                    results
                );
            }
        }

        return results;
    }

    /* =====================================================
       FIND COVER IMAGE
    ===================================================== */

    function getCoverImage(data) {

        if (data.projectImages && data.projectImages.cover) {

            return {
                field: "projectImages.cover",
                original: data.projectImages.cover
            };
        }

        for (const field of COVER_FIELDS) {

            if (data[field]) {
                return {
                    field,
                    original: data[field]
                };
            }
        }

        return null;
    }

    /* =====================================================
       EXPORT COVER IMAGE

       projects/PROJECT TITLE/images/cover images/
    ===================================================== */

    async function exportCoverImage(
        data,
        projectFolder,
        usedPaths
    ) {

        const coverInfo = getCoverImage(data);

        if (!coverInfo) {
            return null;
        }

        const source = getMediaSource(coverInfo.original);

        if (!source) {
            throw new Error("Cover image source is missing.");
        }

        const blob = await getMediaBlob(source, projectFolder);

        let filename = getMediaFilename(
            coverInfo.original,
            0,
            "cover"
        );

        const extension = getExtension(filename, blob.type);

        if (!/\.[a-z0-9]+$/i.test(filename)) {
            filename += "." + extension;
        }

        filename = createUniqueFilename(filename, usedPaths);

        const relativePath =
            `${projectFolder}/images/cover images/${filename}`;

        const githubPath =
            `projects/${relativePath}`;

        await uploadFile(githubPath, blob, true);

        return {
            field: coverInfo.field,
            path: relativePath
        };
    }

    /* =====================================================
       REMOVE REMAINING BASE64 AND BLOB DATA
    ===================================================== */

    function removeRemainingBase64(value) {

        if (Array.isArray(value)) {
            return value.map(removeRemainingBase64);
        }

        if (!value || typeof value !== "object") {

            if (
                typeof value === "string" &&
                /^data:(image|video|application)\//i.test(value)
            ) {
                return "";
            }

            return value;
        }

        for (const key of Object.keys(value)) {

            const item = value[key];

            if (typeof Blob !== "undefined" && item instanceof Blob) {
                delete value[key];
                continue;
            }

            if (
                typeof item === "string" &&
                /^data:(image|video|application)\//i.test(item)
            ) {
                value[key] = "";
                continue;
            }

            if (item && typeof item === "object") {
                value[key] = removeRemainingBase64(item);
            }
        }

        return value;
    }

    /* =====================================================
       CREATE PROJECT JSON

       All media paths start with project title.
    ===================================================== */

    function createProjectJSON(
        data,
        projectFolder,
        collectionResults,
        coverResult
    ) {

        const exportData = structuredClone(data);

        exportData.exportFolder = projectFolder;
        exportData.exportFormat = "GitHub Project Folder";
        exportData.lastSaved = new Date().toISOString();

        /* COVER IMAGE PATH */

        if (coverResult) {

            if (coverResult.field === "projectImages.cover") {
                exportData.projectImages.cover = coverResult.path;
            } else {
                exportData[coverResult.field] = coverResult.path;
            }

            for (const field of COVER_FIELDS) {

                if (
                    Object.prototype.hasOwnProperty.call(exportData, field)
                ) {
                    exportData[field] = coverResult.path;
                }
            }
        }

        /* MEDIA COLLECTION PATHS */

        for (const [location, paths] of Object.entries(collectionResults)) {

            const parts = location.split(".");
            let collectionData = exportData;

            for (let i = 0; i < parts.length - 1; i++) {
                collectionData = collectionData[parts[i]];
            }

            const collection = parts[parts.length - 1];

            if (
                !collectionData ||
                !Array.isArray(collectionData[collection])
            ) {
                continue;
            }

            collectionData[collection] =
                collectionData[collection].map((item, index) => {

                    const path = paths[index];

                    if (!path) {
                        return item;
                    }

                    return replaceMediaWithPath(item, path);
                });
        }

        removeRemainingBase64(exportData);

        return exportData;
    }

    /* =====================================================
       COLLECT PROJECT
    ===================================================== */

    function collectProject() {

        if (
            !window.ProjectCollector ||
            typeof window.ProjectCollector.collectProjectData !== "function"
        ) {
            throw new Error(
                "ProjectCollector.collectProjectData() is unavailable."
            );
        }

        const data =
            window.ProjectCollector.collectProjectData();

        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error(
                "Project information could not be collected."
            );
        }

        const project = structuredClone(data);

        const title = project.projectTitle || project.title;

        if (typeof title !== "string" || !title.trim()) {
            throw new Error("Enter a project title before saving.");
        }

        project.projectTitle = title.trim();
        project.title = title.trim();

        return project;
    }

    /* =====================================================
       SAVE PROJECT TO GITHUB

       FINAL STRUCTURE:

       projects/
       └── PROJECT TITLE/
           ├── project.json
           ├── images/
           │   ├── cover images/
           │   ├── screenshots/
           │   ├── gameplay/
           │   ├── environment/
           │   ├── character/
           │   ├── ui/
           │   ├── technical/
           │   └── extra/
           ├── videos/
           └── documents/
    ===================================================== */

    async function saveProject() {

        if (saving) {
            return null;
        }

        saving = true;

        try {

            console.log("STARTING GITHUB PROJECT SAVE...");

            const data = collectProject();

            const projectFolder = safeName(data.projectTitle);
            const usedPaths = new Set();

            /* UPLOAD COVER */

            const coverResult = await exportCoverImage(
                data,
                projectFolder,
                usedPaths
            );

            /* UPLOAD MEDIA */

            const collectionResults =
                await exportMediaCollections(
                    data,
                    projectFolder,
                    usedPaths
                );

            /* CREATE JSON */

            const exportData = createProjectJSON(
                data,
                projectFolder,
                collectionResults,
                coverResult
            );

            /* SAVE JSON */

            const jsonPath =
                `projects/${projectFolder}/project.json`;

            await uploadFile(
                jsonPath,
                JSON.stringify(exportData, null, 4),
                false
            );

            /* SUCCESS */

            console.log("PROJECT SAVED TO GITHUB:", {
                project: data.projectTitle,
                folder: `projects/${projectFolder}/`,
                json: jsonPath,
                cover: coverResult,
                media: collectionResults,
                projectData: exportData
            });

            alert(
                "PROJECT SAVED SUCCESSFULLY!\n\n" +
                "Project: " + data.projectTitle + "\n\n" +
                "GitHub folder:\n" +
                `projects/${projectFolder}/\n\n` +
                "Project JSON:\n" +
                jsonPath
            );

            return exportData;

        } catch (error) {

            console.error("PROJECT SAVE FAILED:", error);

            alert(
                "PROJECT SAVE FAILED!\n\n" +
                error.message
            );

            return null;

        } finally {

            saving = false;
        }
    }

    /* =====================================================
       PUBLIC API
    ===================================================== */

    return Object.freeze({

        saveProject,

        isSaving: function () {
            return saving;
        },

        clearToken: function () {
            githubToken = null;
        }

    });

})();
