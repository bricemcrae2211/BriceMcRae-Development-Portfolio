
"use strict";

window.ZipExport = (() => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const MIME_TYPE = "application/zip";

    const COMPRESSION = "DEFLATE";

    const COMPRESSION_LEVEL = 6;


    /* =====================================================
       SAFE FOLDER NAME
    ===================================================== */

    function safeName(value) {

        return String(value || "Untitled")
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
            .replace(/[. ]+$/g, "")
            .trim() || "Untitled";
    }


    /* =====================================================
       CREATE PROJECT FOLDER
    ===================================================== */

    function createProjectFolder(zip, projectTitle) {

        const root = safeName(projectTitle);

        const folders = [

            "images",
            "images/cover",
            "images/screenshots",
            "images/gameplayImages",
            "images/environmentImages",
            "images/characterImages",
            "images/uiImages",
            "images/technicalImages",
            "images/others",

            "videos",
            "videos/gameplayVideos",
            "videos/developmentVideos",
            "videos/technicalDemonstrations",
            "videos/trailers",

            "documents",
            "documents/projectDocuments"

        ];

        for (const folder of folders) {

            zip.folder(root + "/" + folder);
        }

        return root;
    }


    /* =====================================================
       ADD FILE
    ===================================================== */

    function addFile(zip, root, folder, filename, content) {

        if (
            content === null ||
            content === undefined
        ) {
            return false;
        }

        const safeFilename = safeName(filename);

        zip.file(
            root + "/" + folder + "/" + safeFilename,
            content
        );

        return true;
    }


    /* =====================================================
       ADD JSON
    ===================================================== */

    function addJson(zip, root, data) {

        const json = JSON.stringify(
            data,
            null,
            4
        );

        JSON.parse(json);

        zip.file(
            root + "/project.json",
            json
        );

        return json;
    }


    /* =====================================================
       GENERATE ZIP
    ===================================================== */

    async function generate(zip) {

        if (typeof JSZip === "undefined") {

            throw new Error(
                "JSZip is not loaded."
            );
        }

        return await zip.generateAsync({

            type: "blob",

            mimeType: MIME_TYPE,

            compression: COMPRESSION,

            compressionOptions: {
                level: COMPRESSION_LEVEL
            }

        });
    }


    /* =====================================================
       DOWNLOAD ZIP
    ===================================================== */

    async function download(blob, projectTitle) {

        const filename =
            safeName(projectTitle) + ".zip";

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(() => {

            URL.revokeObjectURL(url);

        }, 2000);

        return filename;
    }


    /* =====================================================
       CREATE AND DOWNLOAD PROJECT ZIP
    ===================================================== */

    async function exportZip(projectTitle, projectData, mediaFiles = []) {

        if (typeof JSZip === "undefined") {

            throw new Error(
                "JSZip is not loaded. Load JSZip before zip-export.js."
            );
        }

        if (!projectTitle || !String(projectTitle).trim()) {

            throw new Error(
                "A project title is required."
            );
        }

        const zip = new JSZip();

        // Create project folder.
        const root = createProjectFolder(
            zip,
            projectTitle
        );

        // Add project JSON.
        addJson(
            zip,
            root,
            projectData
        );

        // Add supplied media files.
        for (const media of mediaFiles) {

            if (
                !media ||
                !media.folder ||
                !media.filename
            ) {
                continue;
            }

            addFile(
                zip,
                root,
                media.folder,
                media.filename,
                media.content
            );
        }

        // Generate ZIP.
        const blob = await generate(zip);

        // Download ZIP.
        return await download(
            blob,
            projectTitle
        );
    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    return {

        safeName,

        createProjectFolder,

        addFile,

        addJson,

        generate,

        download,

        exportZip

    };

})();
