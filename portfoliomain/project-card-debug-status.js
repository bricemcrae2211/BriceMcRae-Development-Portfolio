"use strict";

/* GLOBAL PROJECT DEBUG STATUS */

(function () {

    window.projectDebugStatus = false;

    window.setProjectDebugStatus = function (enabled) {

        window.projectDebugStatus = enabled === true;

        if (typeof window.updateAllProjectCardDebug === "function") {
            window.updateAllProjectCardDebug();
        }

    };

})();