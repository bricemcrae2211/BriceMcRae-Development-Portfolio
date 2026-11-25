"use strict";

/* =========================================================
   PROJECT ADMIN BRIDGE
   SEND ADMIN STATUS TO PORTFOLIO IFRAMES
========================================================= */

(function () {

    const adminToggle =
        document.getElementById("adminToggle");

    if (!adminToggle) {

        console.error(
            "Project Admin Bridge: Admin toggle was not found."
        );

        return;

    }


    /* =====================================================
       READ ADMIN STATUS
    ===================================================== */

    function isAdminEnabled() {

        return adminToggle.getAttribute(
            "aria-pressed"
        ) === "true";

    }


    /* =====================================================
       SEND ADMIN STATUS TO FRAME
    ===================================================== */

    function sendAdminStatus(frame) {

        if (!frame || !frame.contentWindow) {
            return;
        }

        frame.contentWindow.postMessage(
            {
                type: "portfolio-admin-mode",
                enabled: isAdminEnabled()
            },
            "*"
        );

    }


    /* =====================================================
       BROADCAST ADMIN STATUS
    ===================================================== */

    function broadcastAdminStatus() {

        document.querySelectorAll("iframe").forEach(
            frame => {

                sendAdminStatus(frame);

            }
        );

    }


    /* =====================================================
       ADMIN BUTTON CHANGE
    ===================================================== */

    adminToggle.addEventListener(
        "click",
        function () {

            requestAnimationFrame(function () {

                broadcastAdminStatus();

            });

        }
    );


    /* =====================================================
       IFRAME REQUESTS ADMIN STATUS
    ===================================================== */

    window.addEventListener(
        "message",
        function (event) {

            if (!event.data || typeof event.data !== "object") {
                return;
            }

            if (
                event.data.type !==
                "request-portfolio-admin-mode"
            ) {
                return;
            }

            const frame = Array.from(
                document.querySelectorAll("iframe")
            ).find(function (iframe) {

                return iframe.contentWindow === event.source;

            });

            if (frame) {

                sendAdminStatus(frame);

            }

        }
    );


    /* =====================================================
       SEND STATUS WHEN IFRAME LOADS
    ===================================================== */

    document.querySelectorAll("iframe").forEach(
        frame => {

            frame.addEventListener(
                "load",
                function () {

                    sendAdminStatus(frame);

                }
            );

        }
    );


    /* =====================================================
       INITIAL ADMIN STATUS
    ===================================================== */

    broadcastAdminStatus();


})();