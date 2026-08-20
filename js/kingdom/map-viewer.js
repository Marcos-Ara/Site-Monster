
/* ==========================================================
   MONSTER - MAP VIEWER
   Static GitHub Pages compatible viewer.
========================================================== */
(() => {
    "use strict";

    const root = document.getElementById("monster-map-dynamic");
    if (!root) return;

    const mapContainer = root.parentElement;
    const image = mapContainer?.querySelector(".map-image");
    if (!mapContainer || !image) return;

    let phases = [];
    let activeId = null;
    let popup = null;
    let popupTimer = null;
    let popupPinned = false;
    function normalizeAssetPath(path) {
        const value = String(path || "").trim();
        if (!value) return "../../assets/kingdom-map/flags/flag-default.svg";
        if (/^(https?:|data:|blob:)/i.test(value)) return value;
        if (value.startsWith("../assets/")) return `../../assets/${value.slice("../assets/".length)}`;
        if (value.startsWith("./assets/")) return `../../assets/${value.slice("./assets/".length)}`;
        if (value.startsWith("./") || value.startsWith("../")) return value;
        if (value.startsWith("/assets/")) return `../../assets/${value.slice("/assets/".length)}`;
        if (value.startsWith("assets/")) return `../../${value}`;
        return `../../assets/kingdom-map/flags/${value.split("/").pop()}`;
    }

    function youtubeId(url) {
        try {
            const u = new URL(url);
            const host = u.hostname.toLowerCase();
            if (host === "youtu.be") return u.pathname.split("/").filter(Boolean)[0] || null;
            if (host.endsWith("youtube.com")) {
                if (u.pathname === "/watch") return u.searchParams.get("v");
                const parts = u.pathname.split("/").filter(Boolean);
                const index = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
                return index >= 0 ? parts[index + 1] || null : null;
            }
        } catch (_) {}
        return null;
    }

    function closePopup(force = true) {
        if (!force && popupPinned) return;
        activeId = null;
        popupPinned = false;
        if (popup) {
            popup.classList.remove("is-visible");
            popup.setAttribute("aria-hidden", "true");
        }
    }

    function pinPopup() {
        popupPinned = true;
        window.clearTimeout(popupTimer);
        if (popup) popup.classList.add("is-pinned");
    }

    function ensurePopup() {
        if (popup) return popup;
        popup = document.createElement("div");
        popup.className = "monster-map-popup";
        popup.setAttribute("aria-hidden", "true");
        popup.innerHTML = `
            <button type="button" class="monster-map-popup-close" id="monster-map-popup-close" aria-label="Fechar">×</button>
            <div class="monster-map-video" id="monster-map-video"></div>
            <div class="monster-map-popup-body">
                <span class="monster-map-popup-kicker">Guia da fase</span>
                <div class="monster-map-popup-title" id="monster-map-popup-title"></div>
                <div class="monster-map-popup-description" id="monster-map-popup-description"></div>
                <a class="monster-map-popup-link" id="monster-map-popup-link" href="#" target="_blank" rel="noopener noreferrer">Assistir no YouTube</a>
            </div>
        `;
        mapContainer.appendChild(popup);
        const closeButton = popup.querySelector("#monster-map-popup-close");
        closeButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            closePopup(true);
        });
        popup.addEventListener("mouseenter", () => window.clearTimeout(popupTimer));
        popup.addEventListener("mouseleave", () => {
            if (!popupPinned) popupTimer = window.setTimeout(() => closePopup(false), 360);
        });
        return popup;
    }

    function positionPopup(button) {
        if (!popup) return;

        const stageRect = mapContainer.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const margin = 12;
        const gap = 14;

        // Keep the popup away from the flag itself so the flag remains clickable.
        // Prefer the right side, then left, then below/above as fallbacks.
        let popupW = Math.min(320, Math.max(250, stageRect.width * 0.40));
        popup.style.width = `${popupW}px`;

        // Make sure we can measure the rendered card.
        const popupH = popup.offsetHeight || 315;

        const markerLeft = buttonRect.left - stageRect.left;
        const markerRight = buttonRect.right - stageRect.left;
        const markerTop = buttonRect.top - stageRect.top;
        const markerBottom = buttonRect.bottom - stageRect.top;

        const candidates = [
            {
                left: markerRight + gap,
                top: markerTop + (buttonRect.height - popupH) / 2
            },
            {
                left: markerLeft - popupW - gap,
                top: markerTop + (buttonRect.height - popupH) / 2
            },
            {
                left: markerLeft + (buttonRect.width - popupW) / 2,
                top: markerBottom + gap
            },
            {
                left: markerLeft + (buttonRect.width - popupW) / 2,
                top: markerTop - popupH - gap
            }
        ];

        const fits = (candidate) => {
            return (
                candidate.left >= margin &&
                candidate.top >= margin &&
                candidate.left + popupW <= stageRect.width - margin &&
                candidate.top + popupH <= stageRect.height - margin
            );
        };

        let chosen = candidates.find(fits);

        // If none fit perfectly, choose the first candidate and clamp it.
        if (!chosen) chosen = candidates[0];

        const left = Math.max(
            margin,
            Math.min(chosen.left, stageRect.width - popupW - margin)
        );
        const top = Math.max(
            margin,
            Math.min(chosen.top, stageRect.height - popupH - margin)
        );

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    function showPopup(phase, button) {
        const id = youtubeId(phase.youtube_url);
        if (!id) return;

        window.clearTimeout(popupTimer);
        activeId = Number(phase.id);
        const card = ensurePopup();
        const video = card.querySelector("#monster-map-video");
        const title = card.querySelector("#monster-map-popup-title");
        const description = card.querySelector("#monster-map-popup-description");
        const link = card.querySelector("#monster-map-popup-link");

        title.textContent = phase.title || "Fase";
        if (description) {
            description.textContent = phase.description || "Toque para assistir ao vídeo e conferir os detalhes desta fase.";
            description.hidden = false;
        }
        link.href = phase.youtube_url;
        positionPopup(button);

        const thumb = document.createElement("img");
        thumb.className = "monster-map-thumb";
        thumb.alt = `Banner do vídeo: ${phase.title || "Fase"}`;
        thumb.loading = "eager";
        thumb.src = `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;

        const loading = document.createElement("div");
        loading.className = "monster-map-loading";
        loading.textContent = "Carregando vídeo...";

        const iframe = document.createElement("iframe");
        iframe.title = phase.title || "Vídeo da fase";
        iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`;
        iframe.allow = "autoplay; encrypted-media; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.className = "monster-map-iframe";

        iframe.addEventListener("load", () => {
            if (activeId !== Number(phase.id)) return;
            loading.remove();
            thumb.classList.add("is-hidden");
            iframe.classList.add("is-ready");
        }, { once: true });

        video.replaceChildren(thumb, iframe, loading);
        card.classList.add("is-visible");
        card.classList.toggle("is-pinned", popupPinned);
        card.setAttribute("aria-hidden", "false");

        popupTimer = window.setTimeout(() => {
            if (activeId === Number(phase.id) && card.isConnected && !iframe.classList.contains("is-ready")) {
                loading.textContent = "Prévia do YouTube";
                loading.classList.add("is-fallback");
            }
        }, 3200);
    }

    function fitHitboxToOpaquePixels(imageNode, hitbox) {
        const fallback = () => {
            hitbox.style.left = "35%";
            hitbox.style.top = "18%";
            hitbox.style.width = "30%";
            hitbox.style.height = "68%";
        };
        const apply = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = imageNode.naturalWidth;
                canvas.height = imageNode.naturalHeight;
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                ctx.drawImage(imageNode, 0, 0);
                const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let minX = width, minY = height, maxX = -1, maxY = -1;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        if (data[(y * width + x) * 4 + 3] > 35) {
                            minX = Math.min(minX, x); minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
                        }
                    }
                }
                if (maxX < 0) return fallback();
                const insetX = Math.max(2, Math.round((maxX - minX + 1) * 0.08));
                const insetY = Math.max(2, Math.round((maxY - minY + 1) * 0.08));
                minX += insetX; maxX -= insetX; minY += insetY; maxY -= insetY;
                hitbox.style.left = `${(minX / width) * 100}%`;
                hitbox.style.top = `${(minY / height) * 100}%`;
                hitbox.style.width = `${((maxX - minX + 1) / width) * 100}%`;
                hitbox.style.height = `${((maxY - minY + 1) / height) * 100}%`;
            } catch (_) { fallback(); }
        };
        if (imageNode.complete && imageNode.naturalWidth) apply();
        else imageNode.addEventListener("load", apply, { once: true });
    }

    function createMarker(phase) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "monster-map-marker";
        button.style.left = `${Number(phase.x_percent)}%`;
        button.style.top = `${Number(phase.y_percent)}%`;
        button.style.width = `${Number(phase.width_px) || 210}px`;
        button.style.height = `${Number(phase.height_px) || 118}px`;
        button.dataset.phaseId = String(phase.id);
        button.setAttribute("aria-label", `Abrir ${phase.title || "fase"}`);

        const imageNode = document.createElement("img");
        imageNode.src = normalizeAssetPath(phase.flag_image);
        imageNode.alt = "";
        imageNode.draggable = false;

        const name = document.createElement("span");
        name.className = "monster-map-name";
        name.textContent = phase.title || "Fase";

        const hitbox = document.createElement("span");
        hitbox.className = "monster-map-hitbox";
        hitbox.setAttribute("aria-hidden", "true");

        button.append(imageNode, name, hitbox);
        fitHitboxToOpaquePixels(imageNode, hitbox);

        hitbox.addEventListener("mouseenter", () => {
            if (!popupPinned) showPopup(phase, button);
        });
        hitbox.addEventListener("focus", () => {
            if (!popupPinned) showPopup(phase, button);
        });
        hitbox.addEventListener("mouseleave", () => {
            if (!popupPinned) popupTimer = window.setTimeout(() => closePopup(false), 420);
        });
        hitbox.addEventListener("mousedown", (event) => event.stopPropagation());
        hitbox.addEventListener("touchstart", (event) => {
            event.stopPropagation();
            showPopup(phase, button);
            pinPopup();
            popup.classList.add("is-pinned");
        }, { passive: true });
        hitbox.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            showPopup(phase, button);
            pinPopup();
            popup.classList.add("is-pinned");
        });

        return button;
    }

    function render() {
        root.replaceChildren();
        for (const phase of phases) root.appendChild(createMarker(phase));
        if (popup && popup.parentElement !== mapContainer) mapContainer.appendChild(popup);
    }

    async function load() {
        const source = root.dataset.mapData || "../../assets/map-data/phases.json";
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) throw new Error(`Mapa: HTTP ${response.status}`);
        const data = await response.json();
        phases = Array.isArray(data) ? data : (Array.isArray(data.phases) ? data.phases : []);
        phases = phases.filter((phase) => phase && Number.isFinite(Number(phase.x_percent)) && Number.isFinite(Number(phase.y_percent)));
        render();
    }

    mapContainer.addEventListener("wheel", () => {}, { passive: true });
    mapContainer.addEventListener("touchmove", () => {}, { passive: true });
    mapContainer.addEventListener("click", (event) => {
        if (!event.target.closest(".monster-map-hitbox") && !event.target.closest(".monster-map-popup")) {
            closePopup(true);
        }
    });
    mapContainer.addEventListener("mouseleave", () => closePopup(false));
    window.addEventListener("resize", closePopup, { passive: true });
    window.addEventListener("scroll", closePopup, { passive: true });

    load().catch((error) => {
        console.error("Monster map viewer:", error);
        root.replaceChildren();
    });
})();
