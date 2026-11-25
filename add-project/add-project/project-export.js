
"use strict";

window.ProjectExport = (() => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const MEDIA_COLLECTIONS = [
        "screenshots",
        "gameplayImages",
        "environmentImages",
        "characterImages",
        "uiImages",
        "technicalImages",
        "others",
        "gameplayVideos",
        "developmentVideos",
        "technicalDemonstrations",
        "trailers",
        "projectDocuments"
    ];

    const URL_FIELDS = [
        "websiteLink",
        "githubLink",
        "storeLink",
        "videoLink",
        "documentationLink",
        "downloadLink",
        "demoLink"
    ];

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
        "path",
        "base64",
        "dataUrl",
        "imageData",
        "videoData",
        "fileData",
        "downloadUrl"
    ];


    /* =====================================================
       VALUE VALIDATION
    ===================================================== */

    function isEmptyValue(value) {

        return (
            value === null ||
            value === undefined ||
            value === ""
        );
    }


    /* =====================================================
       URL VALIDATION
    ===================================================== */

    function isValidUrl(value) {

        if (
            typeof value !== "string" ||
            !value.trim()
        ) {
            return false;
        }

        try {

            const url = new URL(value.trim());

            return (
                url.protocol === "http:" ||
                url.protocol === "https:" ||
                url.protocol === "data:" ||
                url.protocol === "blob:"
            );

        } catch (error) {

            return false;
        }
    }


    /* =====================================================
       MEDIA VALIDATION
    ===================================================== */

    function isValidMediaEntry(item) {

        return (
            item !== null &&
            item !== undefined &&
            typeof item === "object" &&
            !Array.isArray(item)
        );
    }


    /* =====================================================
       CLEAN ARRAYS
    ===================================================== */

    function cleanArray(array) {

        return array.map(item => {

            if (Array.isArray(item)) {
                return cleanArray(item);
            }

            if (
                typeof item === "object" &&
                item !== null &&
                !(item instanceof Blob)
            ) {
                return cleanObject(item);
            }

            return item;

        });
    }


    /* =====================================================
       CLEAN OBJECTS
       PRESERVE PROJECT INFORMATION
    ===================================================== */

    function cleanObject(object) {

        if (
            !object ||
            typeof object !== "object" ||
            Array.isArray(object)
        ) {
            return object;
        }

        const cleanedObject = {};

        for (const [key, value] of Object.entries(object)) {

            if (
                value instanceof Blob ||
                value instanceof File
            ) {

                cleanedObject[key] = {
                    type: value.type,
                    size: value.size,
                    exportedAsMedia: true
                };

                continue;
            }

            if (Array.isArray(value)) {

                cleanedObject[key] = cleanArray(value);

                continue;
            }

            if (
                typeof value === "object" &&
                value !== null
            ) {

                cleanedObject[key] = cleanObject(value);

                continue;
            }

            cleanedObject[key] = value;
        }

        return cleanedObject;
    }


    /* =====================================================
       CLEAN MEDIA COLLECTIONS
    ===================================================== */

    function cleanMediaCollections(data) {

        for (const collection of MEDIA_COLLECTIONS) {

            if (!Array.isArray(data[collection])) {
                continue;
            }

            data[collection] = data[collection].map(item => {

                if (isValidMediaEntry(item)) {
                    return cleanObject(item);
                }

                return item;
            });
        }

        return data;
    }


    /* =====================================================
       PROJECT URL FIELDS
    ===================================================== */

    function cleanProjectUrls(data) {

        for (const field of URL_FIELDS) {

            if (
                Object.prototype.hasOwnProperty.call(
                    data,
                    field
                )
            ) {
                data[field] = data[field];
            }
        }

        return data;
    }


    /* =====================================================
       EXTERNAL LINKS
    ===================================================== */

    function cleanExternalLinks(data) {

        if (!Array.isArray(data.externalLinks)) {
            return data;
        }

        data.externalLinks = data.externalLinks.map(link => {

            if (
                link &&
                typeof link === "object" &&
                !Array.isArray(link)
            ) {
                return cleanObject(link);
            }

            return link;
        });

        return data;
    }


    /* =====================================================
       PROJECT TITLE
    ===================================================== */

    function cleanProjectTitle(data) {

        const projectTitle =
            data.projectTitle ||
            data.title;

        if (
            typeof projectTitle !== "string" ||
            !projectTitle.trim()
        ) {
            throw new Error(
                "A project title is required before exporting."
            );
        }

        data.projectTitle = projectTitle.trim();
        data.title = projectTitle.trim();

        return data;
    }


    /* =====================================================
       PROJECT METADATA
    ===================================================== */

    function cleanProjectMetadata(data) {

        return data;
    }


    /* =====================================================
       PREPARE PROJECT EXPORT
    ===================================================== */

    function prepareProjectExport(rawData) {

        if (
            !rawData ||
            typeof rawData !== "object" ||
            Array.isArray(rawData)
        ) {
            throw new Error(
                "The collected project data is invalid."
            );
        }

        let data = cleanObject(rawData);

        data = cleanProjectTitle(data);

        data = cleanMediaCollections(data);

        data = cleanProjectUrls(data);

        data = cleanExternalLinks(data);

        data = cleanProjectMetadata(data);

        return data;
    }


    /* =====================================================
       SAFE FOLDER AND FILE NAMES
    ===================================================== */

    function safeName(value) {

        return String(value || "Untitled")
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
            .replace(/[. ]+$/g, "")
            .trim() || "Untitled";
    }


    /* =====================================================
       FILE EXTENSION
    ===================================================== */

    function getExtension(filename, mimeType) {

        if (filename && filename.includes(".")) {

            return filename
                .split(".")
                .pop()
                .toLowerCase();
        }

        const extensions = {

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

        return extensions[mimeType] || "bin";
    }


    /* =====================================================
       FIND MEDIA SOURCE
    ===================================================== */

    function getMediaSource(item) {

        if (
            typeof item === "string" ||
            item instanceof Blob ||
            item instanceof File
        ) {
            return item;
        }

        if (!item || typeof item !== "object") {
            return null;
        }

        for (const field of MEDIA_SOURCE_FIELDS) {

            const value = item[field];

            if (
                typeof value === "string" &&
                value.trim()
            ) {
                return value;
            }

            if (value instanceof Blob) {
                return value;
            }
        }

        return null;
    }


    /* =====================================================
       GET MEDIA FILE NAME
    ===================================================== */

    function getMediaFilename(item, index, collection) {

        if (item && typeof item === "object") {

            const possibleNames = [
                item.filename,
                item.fileName,
                item.name,
                item.originalName,
                item.title
            ];

            for (const name of possibleNames) {

                if (
                    typeof name === "string" &&
                    name.trim()
                ) {
                    return safeName(name);
                }
            }
        }

        return safeName(collection) + "_" + (index + 1);
    }


    /* =====================================================
       CONVERT MEDIA SOURCE TO BLOB
    ===================================================== */

    async function getMediaBlob(source) {

        if (!source) {
            throw new Error("Media source is missing.");
        }

        if (source instanceof Blob) {
            return source;
        }

        if (typeof source !== "string") {
            throw new Error("Unsupported media source.");
        }

        const value = source.trim();

        if (value.startsWith("data:")) {

            const response = await fetch(value);

            if (!response.ok) {
                throw new Error("Could not read data URL.");
            }

            return await response.blob();
        }

        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {

            const response = await fetch(value);

            if (!response.ok) {
                throw new Error(
                    "Could not download media: " + value
                );
            }

            return await response.blob();
        }

        if (value.startsWith("blob:")) {

            const response = await fetch(value);

            if (!response.ok) {
                throw new Error("Could not read Blob URL.");
            }

            return await response.blob();
        }

        throw new Error(
            "Unsupported media path: " + value
        );
    }


    /* =====================================================
       CREATE UNIQUE FILE NAME
    ===================================================== */

    function createUniqueFilename(zip, destination, filename) {

        const extensionIndex = filename.lastIndexOf(".");

        const hasExtension =
            extensionIndex > 0;

        const baseName = hasExtension
            ? filename.substring(0, extensionIndex)
            : filename;

        const extension = hasExtension
            ? filename.substring(extensionIndex)
            : "";

        let result = filename;
        let counter = 2;

        while (zip.file(destination + "/" + result)) {

            result = baseName + "_" + counter + extension;

            counter++;
        }

        return result;
    }


    /* =====================================================
       EXPORT MEDIA FILE
    ===================================================== */

    async function exportMediaFile(
        zip,
        item,
        index,
        collection,
        destination
    ) {

        const source = getMediaSource(item);

        if (!source) {

            console.warn(
                "MEDIA SOURCE MISSING:",
                collection,
                item
            );

            return null;
        }

        try {

            const blob = await getMediaBlob(source);

            const originalName = getMediaFilename(
                item,
                index,
                collection
            );

            const extension = getExtension(
                originalName,
                blob.type
            );

            const filename = originalName.includes(".")
                ? originalName
                : originalName + "." + extension;

            const uniqueFilename = createUniqueFilename(
                zip,
                destination,
                safeName(filename)
            );

            const filePath =
                destination + "/" + uniqueFilename;

            zip.file(filePath, blob);

            return filePath;

        } catch (error) {

            console.error(
                "MEDIA EXPORT FAILED:",
                collection,
                error
            );

            return null;
        }
    }


    /* =====================================================
       GET COVER IMAGE SOURCE
       SUPPORT projectImages.cover
    ===================================================== */

    function getCoverImageSource(data) {

        if (
            data.projectImages &&
            typeof data.projectImages === "object" &&
            data.projectImages.cover
        ) {
            return {
                field: "projectImages.cover",
                source: getMediaSource(
                    data.projectImages.cover
                ),
                original: data.projectImages.cover
            };
        }

        for (const field of COVER_FIELDS) {

            if (data[field]) {

                return {
                    field,
                    source: getMediaSource(data[field]),
                    original: data[field]
                };
            }
        }

        return null;
    }


    /* =====================================================
       EXPORT COVER IMAGE
       SAVE INSIDE images/cover images/
    ===================================================== */

    async function exportCoverImage(zip, data, rootFolder) {

        const coverInfo = getCoverImageSource(data);

        if (!coverInfo || !coverInfo.source) {
            return null;
        }

        try {

            const blob = await getMediaBlob(
                coverInfo.source
            );

            let originalName = "cover";

            if (
                coverInfo.original &&
                typeof coverInfo.original === "object"
            ) {

                originalName = getMediaFilename(
                    coverInfo.original,
                    0,
                    "cover"
                );
            }

            const extension = getExtension(
                originalName,
                blob.type
            );

            const filename = originalName.includes(".")
                ? originalName
                : "cover." + extension;

            const destination =
                rootFolder + "/images/cover images";

            const uniqueFilename = createUniqueFilename(
                zip,
                destination,
                safeName(filename)
            );

            const filePath =
                destination + "/" + uniqueFilename;

            zip.file(filePath, blob);

            return {
                field: coverInfo.field,
                path: filePath.replace(rootFolder + "/", "")
            };

        } catch (error) {

            console.error(
                "COVER IMAGE EXPORT ERROR:",
                error
            );

            throw new Error(
                "The cover image could not be exported: " +
                error.message
            );
        }
    }


    /* =====================================================
       EXPORT MEDIA COLLECTIONS
       EACH IMAGE TYPE GETS ITS OWN FOLDER
    ===================================================== */

    async function exportMediaCollections(
        zip,
        data,
        rootFolder
    ) {

        const mediaResults = {};

        const allCollections = [
            ...IMAGE_COLLECTIONS,
            ...VIDEO_COLLECTIONS,
            ...DOCUMENT_COLLECTIONS
        ];

        for (const collection of allCollections) {

            const items = data[collection];

            if (!Array.isArray(items)) {
                continue;
            }

            let destination;

            if (IMAGE_COLLECTIONS.includes(collection)) {

                destination =
                    rootFolder +
                    "/images/" +
                    IMAGE_FOLDERS[collection];
            }

            else if (VIDEO_COLLECTIONS.includes(collection)) {

                destination =
                    rootFolder +
                    "/videos/" +
                    collection;
            }

            else {

                destination =
                    rootFolder +
                    "/documents/" +
                    collection;
            }

            mediaResults[collection] = [];

            for (let i = 0; i < items.length; i++) {

                const result = await exportMediaFile(
                    zip,
                    items[i],
                    i,
                    collection,
                    destination
                );

                mediaResults[collection].push(result);
            }
        }

        return mediaResults;
    }


    /* =====================================================
       REPLACE COVER JSON PATH
       SUPPORT NESTED projectImages.cover
    ===================================================== */

    function replaceCoverJsonPath(
        exportData,
        coverExported
    ) {

        if (!coverExported) {
            return;
        }

        const coverPath = coverExported.path;

        if (coverExported.field === "projectImages.cover") {

            if (
                !exportData.projectImages ||
                typeof exportData.projectImages !== "object"
            ) {
                exportData.projectImages = {};
            }

            exportData.projectImages.cover = coverPath;

            return;
        }

        exportData[coverExported.field] = coverPath;

        for (const field of COVER_FIELDS) {

            if (
                Object.prototype.hasOwnProperty.call(
                    exportData,
                    field
                )
            ) {
                exportData[field] = coverPath;
            }
        }
    }


    /* =====================================================
       REPLACE MEDIA SOURCE WITH PATH
       PRESERVE OTHER MEDIA INFORMATION
    ===================================================== */

    function replaceMediaWithPath(item, relativePath) {

        if (
            typeof item === "string" ||
            item instanceof Blob ||
            item instanceof File
        ) {
            return relativePath;
        }

        if (
            !item ||
            typeof item !== "object" ||
            Array.isArray(item)
        ) {
            return relativePath;
        }

        const updatedItem = { ...item };

        let originalSourceField = null;

        for (const field of MEDIA_SOURCE_FIELDS) {

            if (
                Object.prototype.hasOwnProperty.call(
                    updatedItem,
                    field
                )
            ) {

                if (!originalSourceField) {
                    originalSourceField = field;
                }

                delete updatedItem[field];
            }
        }

        // Store the exported path in the original
        // media source field when available.

        if (originalSourceField) {
            updatedItem[originalSourceField] = relativePath;
        } else {
            updatedItem.exportedPath = relativePath;
        }

        return updatedItem;
    }


    /* =====================================================
       REMOVE ANY REMAINING BASE64 IMAGE DATA
       FROM NESTED JSON OBJECTS
    ===================================================== */

    function removeRemainingBase64(value) {

        if (Array.isArray(value)) {

            return value.map(item =>
                removeRemainingBase64(item)
            );
        }

        if (
            !value ||
            typeof value !== "object"
        ) {
            if (
                typeof value === "string" &&
                /^data:image\//i.test(value)
            ) {
                return "";
            }

            return value;
        }

        for (const key of Object.keys(value)) {

            const item = value[key];

            if (
                typeof item === "string" &&
                /^data:image\//i.test(item)
            ) {

                value[key] = "";

                continue;
            }

            if (
                item instanceof Blob ||
                item instanceof File
            ) {

                delete value[key];

                continue;
            }

            if (
                typeof item === "object" &&
                item !== null
            ) {

                value[key] = removeRemainingBase64(item);
            }
        }

        return value;
    }


    /* =====================================================
       CREATE EXPORT JSON
       USE ONLY RELATIVE IMAGE PATHS
    ===================================================== */

    function createExportJson(
        data,
        rootFolder,
        mediaResults,
        coverExported
    ) {

        const exportData = cleanObject(data);


        /* -----------------------------------------------
           COVER IMAGE
        ----------------------------------------------- */

        replaceCoverJsonPath(
            exportData,
            coverExported
        );


        /* -----------------------------------------------
           MEDIA COLLECTIONS
        ----------------------------------------------- */

        for (const [collection, paths] of Object.entries(mediaResults)) {

            if (!Array.isArray(exportData[collection])) {
                continue;
            }

            exportData[collection] = exportData[collection].map(
                (item, index) => {

                    const exportedFile = paths[index];

                    if (!exportedFile) {
                        return item;
                    }

                    const relativePath =
                        exportedFile.replace(
                            rootFolder + "/",
                            ""
                        );

                    return replaceMediaWithPath(
                        item,
                        relativePath
                    );
                }
            );
        }


        /* -----------------------------------------------
           REMOVE ANY REMAINING BASE64 IMAGE DATA
        ----------------------------------------------- */

        removeRemainingBase64(exportData);


        /* -----------------------------------------------
           EXPORT INFORMATION
        ----------------------------------------------- */

        exportData.exportFolder = rootFolder;

        exportData.exportFormat = "Project Folder";

        return exportData;
    }


    /* =====================================================
       EXPORT PROJECT ZIP
    ===================================================== */

    async function exportProject() {

        try {

            if (typeof JSZip === "undefined") {

                throw new Error(
                    "JSZip is not loaded. Load JSZip before ProjectExport.js."
                );
            }

            if (
                !window.ProjectCollector ||
                typeof ProjectCollector.collectProjectData !== "function"
            ) {

                throw new Error(
                    "ProjectCollector.collectProjectData() is unavailable."
                );
            }

            const rawData =
                ProjectCollector.collectProjectData();

            if (
                !rawData ||
                typeof rawData !== "object"
            ) {

                throw new Error(
                    "No project information was collected."
                );
            }

            const data = prepareProjectExport(rawData);

            const projectTitle = safeName(data.projectTitle);

            const zip = new JSZip();

            const rootFolder = projectTitle;

            zip.folder(rootFolder);


            /* -----------------------------------------------
               EXPORT COVER IMAGE
            ----------------------------------------------- */

            const coverExported = await exportCoverImage(
                zip,
                data,
                rootFolder
            );


            /* -----------------------------------------------
               EXPORT MEDIA COLLECTIONS
            ----------------------------------------------- */

            const mediaResults = await exportMediaCollections(
                zip,
                data,
                rootFolder
            );


            /* -----------------------------------------------
               CREATE JSON WITH IMAGE PATHS
            ----------------------------------------------- */

            const exportData = createExportJson(
                data,
                rootFolder,
                mediaResults,
                coverExported
            );


            /* -----------------------------------------------
               SAVE READABLE JSON
            ----------------------------------------------- */

            zip.file(
                rootFolder + "/project.json",
                JSON.stringify(
                    exportData,
                    null,
                    4
                )
            );


            /* -----------------------------------------------
               GENERATE ZIP
               NO ENCRYPTION
            ----------------------------------------------- */

            const blob = await zip.generateAsync({

                type: "blob",

                compression: "DEFLATE",

                compressionOptions: {
                    level: 6
                }

            });


            /* -----------------------------------------------
               DOWNLOAD ZIP
            ----------------------------------------------- */

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = projectTitle + ".zip";

            document.body.appendChild(link);

            link.click();

            link.remove();

            setTimeout(() => {

                URL.revokeObjectURL(url);

            }, 2000);


            console.log(
                "PROJECT ZIP EXPORT SUCCESSFUL:",
                projectTitle
            );

        } catch (error) {

            console.error(
                "PROJECT EXPORT ERROR:",
                error
            );

            alert(
                "EXPORT FAILED!\n\n" +
                error.message
            );
        }
    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    return {

        exportProject,

        prepareProjectExport,

        cleanObject,

        cleanArray,

        cleanMediaCollections,

        cleanExternalLinks,

        cleanProjectUrls,

        isValidUrl,

        isValidMediaEntry,

        exportMediaCollections,

        getMediaSource,

        getMediaBlob

    };

})();
