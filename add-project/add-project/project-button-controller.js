
"use strict";

/* =====================================================
   BUTTON CONTROLLER

   CONTROLS:
   01. All page buttons
   02. Button input
   03. Button clicking
   04. Attached click functions
   05. Missing click functions
   06. Button status
   07. Button debugging

   DEBUG MESSAGES ARE HANDLED BY DEBUG CONTROLLER.
===================================================== */

window.ButtonController = (() => {

    /* =====================================================
       SETTINGS
    ===================================================== */

    const BUTTON_SELECTOR =
        "button, input[type='button'], input[type='submit'], input[type='reset']";

    const registeredHandlers = new WeakMap();

    let initialized = false;


    /* =====================================================
       DEBUG CONTROLLER CONNECTION
    ===================================================== */

    function debug(type, message, details = null) {

        if (
            window.DebugController &&
            typeof window.DebugController[type] === "function"
        ) {

            window.DebugController[type](
                "BUTTON CONTROLLER",
                message,
                details
            );

        } else {

            console.warn(
                "[BUTTON CONTROLLER] Debug Controller is not loaded.",
                message
            );

        }

    }


    /* =====================================================
       CHECK BUTTON ELEMENT
    ===================================================== */

    function isButton(element) {

        return Boolean(
            element &&
            element.nodeType === 1 &&
            typeof element.matches === "function" &&
            element.matches(BUTTON_SELECTOR)
        );

    }


    /* =====================================================
       GET BUTTON NAME
    ===================================================== */

    function getButtonName(button) {

        return (
            button.id ||
            button.textContent.trim() ||
            button.value ||
            "Unnamed Button"
        );

    }


    /* =====================================================
       GET CAPTURE OPTION
    ===================================================== */

    function getCaptureOption(options) {

        return typeof options === "boolean"
            ? options
            : Boolean(options && options.capture);

    }


    /* =====================================================
       TRACK ATTACHED CLICK FUNCTIONS
    ===================================================== */

    function trackHandler(button, listener, capture) {

        if (!isButton(button) || !listener) return;

        let handlers = registeredHandlers.get(button);

        if (!handlers) {

            handlers = new Map();

            registeredHandlers.set(button, handlers);

        }

        let captures = handlers.get(listener);

        if (!captures) {

            captures = new Set();

            handlers.set(listener, captures);

        }

        captures.add(capture);

    }


    /* =====================================================
       REMOVE TRACKED CLICK FUNCTIONS
    ===================================================== */

    function untrackHandler(button, listener, capture) {

        if (!isButton(button) || !listener) return;

        const handlers = registeredHandlers.get(button);

        if (!handlers) return;

        const captures = handlers.get(listener);

        if (!captures) return;

        captures.delete(capture);

        if (captures.size === 0) {

            handlers.delete(listener);

        }

    }


    /* =====================================================
       MONITOR JAVASCRIPT EVENT LISTENERS

       Install before other page scripts register
       their button click listeners.
    ===================================================== */

    function installListenerTracking() {

        const prototype = EventTarget.prototype;

        if (prototype.__buttonControllerInstalled) {

            debug(
                "warning",
                "Button event tracking was already installed."
            );

            return;

        }

        const originalAddEventListener =
            prototype.addEventListener;

        const originalRemoveEventListener =
            prototype.removeEventListener;


        /* TRACK ADDED CLICK FUNCTIONS */

        prototype.addEventListener = function (
            type,
            listener,
            options
        ) {

            const result = originalAddEventListener.call(
                this,
                type,
                listener,
                options
            );

            if (
                type === "click" &&
                isButton(this) &&
                listener
            ) {

                trackHandler(
                    this,
                    listener,
                    getCaptureOption(options)
                );

                debug(
                    "info",
                    "Click function attached to button: " +
                    getButtonName(this)
                );

            }

            return result;

        };


        /* TRACK REMOVED CLICK FUNCTIONS */

        prototype.removeEventListener = function (
            type,
            listener,
            options
        ) {

            const result = originalRemoveEventListener.call(
                this,
                type,
                listener,
                options
            );

            if (
                type === "click" &&
                isButton(this) &&
                listener
            ) {

                untrackHandler(
                    this,
                    listener,
                    getCaptureOption(options)
                );

                debug(
                    "info",
                    "Click function removed from button: " +
                    getButtonName(this)
                );

            }

            return result;

        };


        Object.defineProperty(
            prototype,
            "__buttonControllerInstalled",
            {
                value: true,
                configurable: false
            }
        );

        debug(
            "success",
            "Button click tracking installed."
        );

    }


    /* =====================================================
       CHECK IF BUTTON HAS AN ATTACHED SCRIPT
    ===================================================== */

    function hasScript(button) {

        if (!isButton(button)) return false;

        /* INLINE OR PROPERTY CLICK FUNCTION */

        if (typeof button.onclick === "function") {

            return true;

        }

        /* REGISTERED JAVASCRIPT CLICK FUNCTIONS */

        const handlers = registeredHandlers.get(button);

        return Boolean(
            handlers && handlers.size > 0
        );

    }


    /* =====================================================
       CHECK BUTTON STATUS
    ===================================================== */

    function checkButton(button) {

        if (!isButton(button)) return false;

        const attached = hasScript(button);

        button.dataset.buttonControllerStatus =
            attached
                ? "SCRIPT ATTACHED"
                : "NO SCRIPT HOOKED UP";

        return attached;

    }


    /* =====================================================
       BUTTON PRESSED
    ===================================================== */

    function buttonPressed(button) {

        if (!isButton(button)) return;

        const name = getButtonName(button);

        button.dataset.buttonPressed = "true";

        debug(
            "info",
            "BUTTON IS PRESSED: " + name
        );


        /* CHECK ATTACHED SCRIPT */

        if (checkButton(button)) {

            debug(
                "success",
                "BUTTON HAS A SCRIPT ATTACHED: " + name
            );

            return;

        }


        /* NO SCRIPT ATTACHED */

        debug(
            "warning",
            "NO SCRIPT HOOKED UP TO THIS BUTTON. BUTTON WAS PRESSED: " +
            name
        );

        alert(
            "BUTTON IS PRESSED!\n\n" +
            "NO SCRIPT HOOKED UP TO THIS BUTTON!\n\n" +
            "Button: " + name
        );

    }


    /* =====================================================
       HANDLE BUTTON CLICKING
    ===================================================== */

    function handleButtonClick(event) {

        const target = event.target;

        if (!target || typeof target.closest !== "function") {
            return;
        }

        const button = target.closest(BUTTON_SELECTOR);

        if (!button) return;

        buttonPressed(button);

    }


    /* =====================================================
       SCAN ALL BUTTONS
    ===================================================== */

    function scanButtons() {

        const buttons =
            document.querySelectorAll(BUTTON_SELECTOR);

        buttons.forEach(button => {

            checkButton(button);

        });

        debug(
            "success",
            "Button scan complete. Buttons found: " +
            buttons.length
        );

        return buttons.length;

    }


    /* =====================================================
       INITIALIZE BUTTON CONTROLLER
    ===================================================== */

    function initialize() {

        if (initialized) {

            debug(
                "warning",
                "Button Controller is already initialized."
            );

            return;

        }

        initialized = true;

        /* INSTALL CLICK TRACKING */

        installListenerTracking();

        /* MONITOR ALL BUTTON CLICKS */

        document.addEventListener(
            "click",
            handleButtonClick,
            true
        );

        /* CHECK EXISTING BUTTONS */

        scanButtons();

        debug(
            "success",
            "Button Controller initialized successfully."
        );

    }


    /* =====================================================
       DOCUMENT READY
    ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            { once: true }
        );

    } else {

        initialize();

    }


    /* =====================================================
       PUBLIC FUNCTIONS
    ===================================================== */

    return {

        initialize,

        scanButtons,

        checkButton,

        buttonPressed,

        hasScript

    };

})();
