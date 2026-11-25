
"use strict";

/* =====================================================
   DEBUG CONTROLLER

   CENTRAL DEBUG SYSTEM

   CONTROLS:
   01. Debug messages
   02. Information messages
   03. Success messages
   04. Warning messages
   05. Error messages
   06. Debug history
   07. Debug enable / disable
===================================================== */

window.DebugController = (() => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    let enabled = true;

    const debugHistory = [];


    /* =====================================================
       CREATE DEBUG MESSAGE
    ===================================================== */

    function log(type, source, message, details = null) {

        const entry = {

            timestamp: new Date().toISOString(),

            type,

            source,

            message,

            details

        };

        debugHistory.push(entry);

        if (!enabled) return entry;

        const prefix =
            "[" + source + "] [" + type.toUpperCase() + "]";

        switch (type) {

            case "success":

                console.log(prefix, message, details ?? "");

                break;

            case "warning":

                console.warn(prefix, message, details ?? "");

                break;

            case "error":

                console.error(prefix, message, details ?? "");

                break;

            default:

                console.info(prefix, message, details ?? "");

                break;

        }

        return entry;

    }


    /* =====================================================
       INFORMATION MESSAGE
    ===================================================== */

    function info(source, message, details = null) {

        return log("info", source, message, details);

    }


    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    function success(source, message, details = null) {

        return log("success", source, message, details);

    }


    /* =====================================================
       WARNING MESSAGE
    ===================================================== */

    function warning(source, message, details = null) {

        return log("warning", source, message, details);

    }


    /* =====================================================
       ERROR MESSAGE
    ===================================================== */

    function error(source, message, details = null) {

        return log("error", source, message, details);

    }


    /* =====================================================
       GET DEBUG HISTORY
    ===================================================== */

    function getHistory() {

        return [...debugHistory];

    }


    /* =====================================================
       CLEAR DEBUG HISTORY
    ===================================================== */

    function clearHistory() {

        debugHistory.length = 0;

        info(
            "DEBUG CONTROLLER",
            "Debug history cleared."
        );

    }


    /* =====================================================
       ENABLE DEBUGGING
    ===================================================== */

    function enable() {

        enabled = true;

        success(
            "DEBUG CONTROLLER",
            "Debugging enabled."
        );

    }


    /* =====================================================
       DISABLE DEBUGGING
    ===================================================== */

    function disable() {

        enabled = false;

        debugHistory.push({

            timestamp: new Date().toISOString(),

            type: "info",

            source: "DEBUG CONTROLLER",

            message: "Debugging disabled.",

            details: null

        });

    }


    /* =====================================================
       CHECK DEBUG STATUS
    ===================================================== */

    function isEnabled() {

        return enabled;

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    info(
        "DEBUG CONTROLLER",
        "Debug Controller initialized."
    );


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    return {

        log,

        info,

        success,

        warning,

        error,

        getHistory,

        clearHistory,

        enable,

        disable,

        isEnabled

    };

})();
