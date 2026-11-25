"use strict";

window.ProjectDropdownHandler = (() => {
    function initializeDropdowns() {
        document.querySelectorAll("#projectForm .dropdown-header").forEach(button => {
            const content = document.getElementById(button.getAttribute("aria-controls"));
            if (!content) return;

            button.setAttribute("aria-expanded", "false");
            content.style.display = "none";

            const arrow = button.querySelector(".dropdown-arrow");
            if (arrow) arrow.textContent = "▼";

            button.addEventListener("click", () => {
                const open = button.getAttribute("aria-expanded") !== "true";
                button.setAttribute("aria-expanded", String(open));
                content.style.display = open ? "block" : "none";
                if (arrow) arrow.textContent = open ? "▲" : "▼";
            });
        });
    }

    return { initializeDropdowns };
})();
