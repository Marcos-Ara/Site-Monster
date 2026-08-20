/* ==========================================================
   KINGDOM RUSH
   MONSTER
   Versão 4.0.0
========================================================== */

"use strict";


/* ==========================================================
   KINGDOM
========================================================== */

const Kingdom = {

    name: "Kingdom",

    initialized: false,


    /* ======================================================
       MAP
    ====================================================== */

    map: null,

    wrapper: null,

    canvas: null,

    image: null,


    /* ======================================================
       UI
    ====================================================== */

    flags: [],

    preview: null,

    /* ======================================================
       STATE
    ====================================================== */

    currentGame: "classic",

    /* Compatibilidade com a página atual: o mapa dinâmico é renderizado por map-viewer.js. */
    games: [
        {
            id: "classic",
            map: "../../assets/maps/Mapa Kingdom.png"
        }
    ],

    stages: [],

    currentStage: null,

    /* ======================================================
       PROGRESS
    ====================================================== */

    progressKey: "monster-kingdom-progress",

    progress: {},


    /* ======================================================
       INIT
    ====================================================== */

    init() {

        if (this.initialized) return;

        if (!this.isKingdom()) return;

        this.cache();

        this.loadProgress();

        this.bindEvents();

        this.loadGameMap();

        this.loadFlags();

        this.updateFlags();

        this.createAPI();

        this.initParticles();

        this.initialized = true;

        console.log("Kingdom iniciado.");

    },


    /* ======================================================
       PAGE
    ====================================================== */

    isKingdom() {

        return (
            document.body.dataset.page === "kingdom" ||
            document.querySelector(".map-container") !== null
        );

    },


    /* ======================================================
       CACHE
    ====================================================== */

    cache() {

        this.map =
            document.querySelector(".map-container");

        this.wrapper =
            document.querySelector(".map-container");

        this.image =
            document.querySelector(".map-image");

        this.canvas =
            document.querySelector(".map-container");

        /* --------------------------------------------------
           MODAL REAL DO HTML
        -------------------------------------------------- */

        this.modalOverlay =
            document.querySelector("#modal-overlay");

        this.modalContent =
            document.querySelector(".modal-content");

        this.modalClose =
            document.querySelector("#modal-close");

        this.modalBannerImage =
            document.querySelector("#modal-banner-image");

        this.modalGame =
            document.querySelector("#modal-game");

        this.modalTitle =
            document.querySelector("#modal-title");

        this.modalDescription =
            document.querySelector("#modal-description");

        this.modalYoutube =
            document.querySelector("#modal-youtube");

        this.modalVideo =
            document.querySelector("#modal-video");

    },


    /* ======================================================
       EVENTS
    ====================================================== */

    bindEvents() {

        if (typeof this.bindFlags === "function") {
            this.bindFlags();
        }

        if (typeof this.bindModal === "function") {
            this.bindModal();
        }

        if (typeof this.bindKeyboard === "function") {
            this.bindKeyboard();
        }

        if (typeof this.bindResize === "function") {
            this.bindResize();
        }

    },


    /* ======================================================
       LEGACY FLAGS COMPATIBILITY
       As bandeiras atuais são gerenciadas por map-viewer.js.
    ====================================================== */

    bindFlags() {
        return;
    },


    loadFlags() {
        return;
    },


    updateFlags() {
        return;
    },


    /* ======================================================
       CHANGE GAME
    ====================================================== */

    changeGame(game) {

        const exists =
            this.games.some(
                item =>
                    item.id === game
            );


        if (!exists) return;


        this.currentGame =
            game;


        this.currentStage =
            null;


        this.loadGameMap();

        this.loadFlags();

        this.updateFlags();

    },


    /* ======================================================
       LOAD GAME MAP
    ====================================================== */

    loadGameMap() {

        if (!this.image) return;


        const game =
            this.games.find(
                item =>
                    item.id ===
                    this.currentGame
            );


        if (!game) return;


        this.image.src =
            game.map;

    },


    /* ======================================================
       SEARCH
    ====================================================== */

    searchResults: [],


    searchStage(text) {

        const value =
            String(text || "")
                .trim()
                .toLowerCase();


        if (!value) {

            this.clearSearch();

            return;

        }


        this.searchResults =
            this.stages.filter(stage => {

                return (
                    stage.game ===
                    this.currentGame
                    &&
                    stage.campaign ===
                    this.currentCampaign
                    &&
                    stage.name
                        .toLowerCase()
                        .includes(value)
                );

            });


        this.highlightFlags();

    },


    /* ======================================================
       HIGHLIGHT SEARCH
    ====================================================== */

    highlightFlags() {

        const ids =
            new Set(
                this.searchResults.map(
                    stage =>
                        stage.id
                )
            );


        document
            .querySelectorAll(
                ".map-flag[data-stage]"
            )
            .forEach(flag => {

                const id =
                    Number(
                        flag.dataset.stage
                    );


                if (ids.has(id)) {

                    flag.classList.add(
                        "search-match"
                    );

                } else {

                    flag.classList.remove(
                        "search-match"
                    );

                }

            });

    },


    /* ======================================================
       CLEAR SEARCH
    ====================================================== */

    clearSearch() {

        this.searchResults = [];


        document
            .querySelectorAll(
                ".map-flag"
            )
            .forEach(flag => {

                flag.classList.remove(
                    "search-match"
                );

            });

    },


    /* ======================================================
       CAMPAIGNS
    ====================================================== */

    campaigns: [

        {
            id: "main",
            name: "Campanha Principal",
            icon: "🏰"
        },


        {
            id: "heroic",
            name: "Heroic",
            icon: "⚔️"
        },


        {
            id: "iron",
            name: "Iron Challenge",
            icon: "🛡️"
        }

    ],


    currentCampaign: "main",


    /* ======================================================
       CHANGE CAMPAIGN
    ====================================================== */

    changeCampaign(campaign) {

        const exists =
            this.campaigns.some(
                item =>
                    item.id === campaign
            );


        if (!exists) return;


        this.currentCampaign =
            campaign;


        this.currentStage =
            null;


        this.loadFlags();

    },


    /* ======================================================
       PROGRESS
    ====================================================== */

    loadProgress() {

        try {

            const data =
                localStorage.getItem(
                    this.progressKey
                );


            this.progress =
                data
                    ? JSON.parse(data)
                    : {};

        } catch (error) {

            console.error(
                "Erro ao carregar progresso:",
                error
            );


            this.progress = {};

        }

    },


    /* ======================================================
       SAVE PROGRESS
    ====================================================== */

    saveProgress() {

        try {

            localStorage.setItem(
                this.progressKey,
                JSON.stringify(
                    this.progress
                )
            );

        } catch (error) {

            console.error(
                "Erro ao salvar progresso:",
                error
            );

        }

    },


    /* ======================================================
       COMPLETE STAGE
    ====================================================== */

    completeStage(
        stageId,
        stars = 3
    ) {

        this.progress[stageId] = {

            completed: true,

            stars:
                Math.max(
                    0,
                    Math.min(
                        3,
                        Number(stars)
                    )
                ),

            date:
                Date.now()

        };


        this.saveProgress();

        this.updateFlags();

    },


    /* ======================================================
       GET STARS
    ====================================================== */

    getStars(stageId) {

        const progress =
            this.progress[stageId];


        if (!progress) return 0;


        return Number(
            progress.stars || 0
        );

    },


    /* ======================================================
       MODAL
    ====================================================== */

    modalOverlay: null,

    modalContent: null,

    modalClose: null,

    modalBannerImage: null,

    modalGame: null,

    modalTitle: null,

    modalDescription: null,

    modalYoutube: null,

    modalVideo: null,


    /* ======================================================
       BIND MODAL
    ====================================================== */

    bindModal() {

        if (!this.modalOverlay) return;


        if (this.modalClose) {

            this.modalClose.addEventListener(
                "click",
                () => {

                    this.closeVideo();

                }
            );

        }


        /*
           Clicar fora do conteúdo fecha.
        */

        this.modalOverlay.addEventListener(
            "click",
            () => {

                this.closeVideo();

            }
        );


        /*
           Evita que clicar dentro do modal
           feche o modal.
        */

        if (this.modalContent) {

            this.modalContent.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                }
            );

        }

    },


    /* ======================================================
       OPEN VIDEO / OPEN MODAL
    ====================================================== */

    openVideo(stage) {

        if (!stage) return;


        this.currentStage =
            stage;


        this.updateFlags();


        /*
           --------------------------------------------------
           ATUALIZA BANNER
           --------------------------------------------------
        */

        if (this.modalBannerImage) {

            /*
               Se a fase tiver imagem específica,
               usa ela.

               Caso contrário, usa o banner principal.
            */

            this.modalBannerImage.src =
                stage.image &&
                stage.image !==
                "../../assets/images/thumbs/default.jpg"

                    ? stage.image

                    : "../../assets/banner/kingdom-banner.png";

        }


        /*
           --------------------------------------------------
           GAME
           --------------------------------------------------
        */

        if (this.modalGame) {

            this.modalGame.textContent =
                stage.game === "classic"
                    ? "Kingdom Rush"
                    : stage.game;

        }


        /*
           --------------------------------------------------
           TÍTULO
           --------------------------------------------------
        */

        if (this.modalTitle) {

            /*
               Quando não há vídeo cadastrado,
               mostra exatamente o texto desejado.
            */

            if (!stage.youtube) {

                this.modalTitle.textContent =
                    "Não sabe para onde ir ?";

            } else {

                this.modalTitle.textContent =
                    stage.name;

            }

        }


        /*
           --------------------------------------------------
           DESCRIÇÃO
           --------------------------------------------------
        */

        if (this.modalDescription) {

            if (!stage.youtube) {

                this.modalDescription.textContent =
                    "Clique no botão e seja direcionado para a playlist para começar a assistir.";

            } else {

                this.modalDescription.textContent =
                    stage.description;

            }

        }


        /*
           --------------------------------------------------
           PLAYLIST
           --------------------------------------------------
        */

        const playlist =
            "https://youtube.com/playlist?list=PLHHvBYie7YMA&si=ILM0iDKXDSCJeodD";


        if (this.modalYoutube) {

            this.modalYoutube.href =
                playlist;

        }


        /*
           --------------------------------------------------
           VÍDEO
           --------------------------------------------------
        */

        if (this.modalVideo) {

            if (stage.youtube) {

                this.modalVideo.src =
                    `https://www.youtube.com/embed/${encodeURIComponent(stage.youtube)}?autoplay=1&rel=0`;

            } else {

                /*
                   Sem vídeo individual:

                   mantém a área preta vazia,
                   exatamente como no desenho,
                   e deixa o botão Playlist
                   levar para a playlist.
                */

                this.modalVideo.src =
                    "about:blank";

            }

        }


        /*
           --------------------------------------------------
           ABRIR MODAL
           --------------------------------------------------
        */

        if (this.modalOverlay) {

            this.modalOverlay.classList.add(
                "active"
            );

            this.modalOverlay.classList.add(
                "show"
            );

        }


        if (this.modalContent) {

            this.modalContent.classList.add(
                "active"
            );

            this.modalContent.classList.add(
                "show"
            );

        }


        document.body.classList.add(
            "modal-open"
        );


        document.body.style.overflow =
            "hidden";

    },


    /* ======================================================
       CLOSE VIDEO
    ====================================================== */

    closeVideo() {

        if (this.modalVideo) {

            this.modalVideo.src =
                "about:blank";

        }


        if (this.modalOverlay) {

            this.modalOverlay.classList.remove(
                "active"
            );

            this.modalOverlay.classList.remove(
                "show"
            );

        }


        if (this.modalContent) {

            this.modalContent.classList.remove(
                "active"
            );

            this.modalContent.classList.remove(
                "show"
            );

        }


        document.body.classList.remove(
            "modal-open"
        );


        document.body.style.overflow =
            "";

    },


    /* ======================================================
       KEYBOARD
    ====================================================== */

    bindKeyboard() {

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    this.closeVideo();

                }

            }
        );

    },


    /* ======================================================
       NEXT VIDEO
    ====================================================== */

    nextVideo() {

        if (!this.currentStage) return;


        const stages =
            this.stages.filter(stage => {

                return (
                    stage.game ===
                    this.currentGame
                    &&
                    stage.campaign ===
                    this.currentCampaign
                );

            });


        const index =
            stages.findIndex(
                stage =>
                    stage.id ===
                    this.currentStage.id
            );


        if (
            index === -1 ||
            index >= stages.length - 1
        ) {

            return;

        }


        this.selectStage(
            stages[index + 1]
        );

    },


    /* ======================================================
       SELECT STAGE
    ====================================================== */

    selectStage(stage) {

        if (!stage) return;


        this.currentStage =
            stage;


        this.updateFlags();

        this.openVideo(stage);

    },


    /* ======================================================
       EFFECTS
    ====================================================== */

    effectsEnabled: true,

    glowEnabled: true,

    fogEnabled: true,

    ambientEnabled: true,


    loadEffects() {

        if (!this.effectsEnabled) return;

    },


    /* ======================================================
       PARTICLES
    ====================================================== */

    particles: [],

    particleCanvas: null,

    particleContext: null,

    particleAnimation: null,

    maxParticles: 60,


    initParticles() {

        this.particleCanvas =
            document.querySelector(
                "#particle-canvas"
            );


        if (!this.particleCanvas) return;


        this.particleContext =
            this.particleCanvas.getContext(
                "2d"
            );


        this.resizeParticles();

        this.createParticles();

        this.animateParticles();

    },


    /* ======================================================
       RESIZE PARTICLES
    ====================================================== */

    resizeParticles() {

        if (!this.particleCanvas) return;


        this.particleCanvas.width =
            window.innerWidth;


        this.particleCanvas.height =
            window.innerHeight;

    },


    /* ======================================================
       CREATE PARTICLES
    ====================================================== */

    createParticles() {

        if (!this.particleCanvas) return;


        this.particles = [];


        for (
            let i = 0;
            i < this.maxParticles;
            i++
        ) {

            this.particles.push({

                x:
                    Math.random() *
                    this.particleCanvas.width,

                y:
                    Math.random() *
                    this.particleCanvas.height,

                radius:
                    Math.random() * 2 + 1,

                speed:
                    Math.random() * 0.6 + 0.2,

                alpha:
                    Math.random() * 0.6 + 0.2

            });

        }

    },


    /* ======================================================
       UPDATE PARTICLES
    ====================================================== */

    updateParticles() {

        if (!this.particleCanvas) return;


        this.particles.forEach(
            particle => {

                particle.y -=
                    particle.speed;


                if (
                    particle.y < -10
                ) {

                    particle.y =
                        this.particleCanvas.height + 10;


                    particle.x =
                        Math.random() *
                        this.particleCanvas.width;

                }

            }
        );

    },


    /* ======================================================
       DRAW PARTICLES
    ====================================================== */

    drawParticles() {

        if (
            !this.particleCanvas ||
            !this.particleContext
        ) {

            return;

        }


        const ctx =
            this.particleContext;


        ctx.clearRect(
            0,
            0,
            this.particleCanvas.width,
            this.particleCanvas.height
        );


        this.particles.forEach(
            particle => {

                ctx.beginPath();


                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(255,255,255,${particle.alpha})`;


                ctx.fill();

            }
        );

    },


    /* ======================================================
       ANIMATE PARTICLES
    ====================================================== */

    animateParticles() {

        if (!this.particleCanvas) return;


        this.updateParticles();

        this.drawParticles();


        this.particleAnimation =
            requestAnimationFrame(
                () =>
                    this.animateParticles()
            );

    },


    /* ======================================================
       STOP PARTICLES
    ====================================================== */

    stopParticles() {

        if (
            this.particleAnimation
        ) {

            cancelAnimationFrame(
                this.particleAnimation
            );


            this.particleAnimation =
                null;

        }

    },


    /* ======================================================
       RESIZE
    ====================================================== */

    resize() {

        this.resizeParticles();

    },


    bindResize() {

        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );

    },


    /* ======================================================
       ESCAPE HTML
    ====================================================== */

    escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    },


    /* ======================================================
       API
    ====================================================== */

    api: {},


    createAPI() {

        this.api = {

            openStage:
                stage =>
                    this.selectStage(stage),

            openVideo:
                stage =>
                    this.openVideo(stage),

            changeGame:
                game =>
                    this.changeGame(game),

            changeCampaign:
                campaign =>
                    this.changeCampaign(campaign),

            search:
                value =>
                    this.searchStage(value),

            complete:
                (id, stars) =>
                    this.completeStage(
                        id,
                        stars
                    )

        };

    },


    /* ======================================================
       GET API
    ====================================================== */

    getAPI() {

        return this.api;

    },


    /* ======================================================
       REFRESH
    ====================================================== */

    refresh() {

        if (!this.isKingdom()) return;


        this.cache();

        this.loadProgress();

        this.loadGameMap();

        this.loadFlags();

        this.updateFlags();

    },


    /* ======================================================
       PAUSE
    ====================================================== */

    pause() {

        this.stopParticles();

    },


    /* ======================================================
       RESUME
    ====================================================== */

    resume() {

        if (
            this.particleCanvas &&
            !this.particleAnimation
        ) {

            this.animateParticles();

        }

    },


    /* ======================================================
       DESTROY
    ====================================================== */

    destroy() {

        this.stopParticles();

        this.closeVideo();

        this.initialized =
            false;

    },


    /* ======================================================
       VERSION
    ====================================================== */

    version() {

        return {

            module: "Kingdom",

            version: "4.0.0",

            author: "Monster",

            status: "production"

        };

    }

};


/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Kingdom.init();

    }
);


/* ==========================================================
   GLOBAL API
========================================================== */

window.Kingdom =
    Kingdom;