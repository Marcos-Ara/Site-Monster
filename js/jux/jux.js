/*==================================================
                    JUX.JS
==================================================*/

"use strict";


/*==================================================
                OBJETO JUX
==================================================*/

const Jux = {


    /*==================================================
                        INICIAR
    ==================================================*/

    init() {

        this.cache();

        this.setupEpisodeAnimation();

        this.setupCardLinks();

        this.setupButtonEffects();

    },


    /*==================================================
                    ELEMENTOS
    ==================================================*/

    cache() {

        this.episodeCards = document.querySelectorAll(
            ".episode-card"
        );

        this.buttons = document.querySelectorAll(
            ".episode-card .btn"
        );

    },


    /*==================================================
                ANIMAÇÃO DOS EPISÓDIOS
    ==================================================*/

    setupEpisodeAnimation() {

        if (!this.episodeCards.length) {

            return;

        }


        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {

                        return;

                    }


                    entry.target.classList.add("show");


                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {

                threshold: 0.15

            }

        );


        this.episodeCards.forEach(

            (card, index) => {

                card.style.transitionDelay =
                    `${index * 0.12}s`;


                observer.observe(card);

            }

        );

    },


    /*==================================================
                CARD INTEIRO INTERAGÍVEL
    ==================================================*/

    setupCardLinks() {

        if (!this.episodeCards.length) {

            return;

        }


        this.episodeCards.forEach((card) => {

            const playlist = card.dataset.playlist;


            if (!playlist) {

                return;

            }


            card.addEventListener("click", (event) => {

                if (event.target.closest("a, button, input, select, textarea")) {

                    return;

                }


                window.open(playlist, "_blank", "noopener,noreferrer");

            });


            card.addEventListener("keydown", (event) => {

                if (event.key !== "Enter" && event.key !== " ") {

                    return;

                }


                event.preventDefault();

                window.open(playlist, "_blank", "noopener,noreferrer");

            });

        });

    },


    /*==================================================
                EFEITO DOS BOTÕES
    ==================================================*/

    setupButtonEffects() {

        if (!this.buttons.length) {

            return;

        }


        this.buttons.forEach((button) => {


            button.addEventListener(

                "mouseenter",

                () => {

                    button.classList.add(
                        "hover"
                    );

                }

            );


            button.addEventListener(

                "mouseleave",

                () => {

                    button.classList.remove(
                        "hover"
                    );

                }

            );

        });

    }

};


/*==================================================
                FUNÇÕES GLOBAIS
==================================================*/

window.reloadJux = function() {

    location.reload();

};


/*==================================================
                DOM READY
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Jux.init();

        console.log(
            "Jux.js carregado corretamente."
        );

    }

);