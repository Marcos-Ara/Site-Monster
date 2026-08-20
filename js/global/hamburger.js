/* ==========================================================
                HAMBURGER — STANDALONE CONTROLLER
   Deliberately independent from App/Navigation/Animations.
========================================================== */

(function () {
    "use strict";

    function initHamburger() {
        const button = document.getElementById("menu-toggle");
        const menu = document.getElementById("quick-menu");
        const body = document.body;

        if (!button || !menu) return;
        if (button.dataset.hamburgerReady === "true") return;
        button.dataset.hamburgerReady = "true";

        function isOpen() {
            return menu.classList.contains("open");
        }

        function openMenu() {
            menu.classList.add("open");
            menu.setAttribute("aria-hidden", "false");
            button.setAttribute("aria-expanded", "true");
            button.setAttribute("aria-label", "Fechar menu");
            button.classList.add("active");
            if (body) body.classList.add("menu-open");
        }

        function closeMenu() {
            menu.classList.remove("open");
            menu.setAttribute("aria-hidden", "true");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-label", "Abrir menu");
            button.classList.remove("active");
            if (body) body.classList.remove("menu-open");
        }

        function toggleMenu(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (isOpen()) closeMenu();
            else openMenu();
        }

        button.addEventListener("click", toggleMenu);

        menu.addEventListener("click", function (event) {
            const link = event.target.closest("a");
            if (link) closeMenu();
        });

        document.addEventListener("click", function (event) {
            if (!isOpen()) return;
            if (menu.contains(event.target)) return;
            if (button.contains(event.target)) return;
            closeMenu();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen()) closeMenu();
        });

        window.MonsterHamburger = { open: openMenu, close: closeMenu, toggle: toggleMenu };
        closeMenu();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initHamburger, { once: true });
    } else {
        initHamburger();
    }
})();
