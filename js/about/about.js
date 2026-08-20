/*==================================================
                ABOUT.JS
==================================================*/

"use strict";

/*==================================================
            OBJETO ABOUT
==================================================*/

const About = {

    init(){

        this.cache();

        this.events();

        this.startCounters();

        this.startTyping();

    },

/*==================================================
            ELEMENTOS
==================================================*/

    cache(){

        this.counters = document.querySelectorAll(

            "[data-counter]"

        );

        this.typing = document.querySelector(

            "#typing-text"

        );

        this.photo = document.querySelector(

            ".about-photo"

        );

        this.timeline = document.querySelectorAll(

            ".timeline-item"

        );

        this.socialButtons = document.querySelectorAll(

            ".about-social a"

        );

    },

/*==================================================
            EVENTOS
==================================================*/

    events(){

        if(this.photo){

            this.photo.addEventListener(

                "mouseenter",

                ()=>{

                    this.photo.classList.add("active");

                }

            );

            this.photo.addEventListener(

                "mouseleave",

                ()=>{

                    this.photo.classList.remove("active");

                }

            );

        }

        this.socialButtons.forEach(button=>{

            button.addEventListener(

                "mouseenter",

                ()=>{

                    button.classList.add("active");

                }

            );

            button.addEventListener(

                "mouseleave",

                ()=>{

                    button.classList.remove("active");

                }

            );

        });

    },

/*==================================================
            CONTADORES
==================================================*/

    startCounters(){

        this.counters.forEach(counter=>{

            this.animateCounter(counter);

        });

    },

    animateCounter(counter){

        const target = Number(

            counter.dataset.counter

        );

        let current = 0;

        const speed = target / 100;

        const update = ()=>{

            current += speed;

            if(current < target){

                counter.textContent =

                Math.floor(current);

                requestAnimationFrame(update);

            }else{

                counter.textContent = target;

            }

        };

        update();

    },

/*==================================================
            EFEITO DE DIGITAÇÃO
==================================================*/

    startTyping(){

        if(!this.typing){

            return;

        }

        const text =

        "Olá! Eu sou Monster, criador de conteúdo focado em Kingdom Rush, estratégias, desafios e muito mais.";

        let index = 0;

        this.typing.textContent = "";

        const type = ()=>{

            if(index < text.length){

                this.typing.textContent +=

                text.charAt(index);

                index++;

                setTimeout(type,40);

            }

        };

        type();

    },

/*==================================================
            TIMELINE
==================================================*/

    animateTimeline(){

        this.timeline.forEach(

            (item,index)=>{

                setTimeout(()=>{

                    item.classList.add(

                        "show"

                    );

                },index*250);

            }

        );

    },

/*==================================================
        OBSERVAR ELEMENTOS
==================================================*/

    observeTimeline(){

        const observer = new IntersectionObserver(

            entries=>{

                entries.forEach(entry=>{

                    if(entry.isIntersecting){

                        entry.target.classList.add(

                            "show"

                        );

                    }

                });

            },

            {

                threshold:0.25

            }

        );

        this.timeline.forEach(item=>{

            observer.observe(item);

        });

    },

/*==================================================
            FOTO
==================================================*/

    photoAnimation(){

        if(!this.photo){

            return;

        }

        this.photo.addEventListener(

            "mousemove",

            (event)=>{

                const rect =

                this.photo.getBoundingClientRect();

                const x =

                event.clientX - rect.left;

                const y =

                event.clientY - rect.top;

                this.photo.style.setProperty(

                    "--x",

                    `${x}px`

                );

                this.photo.style.setProperty(

                    "--y",

                    `${y}px`

                );

            }

        );

    },

/*==================================================
            RECARREGAR
==================================================*/

    refresh(){

        this.startCounters();

        this.animateTimeline();

    },

/*==================================================
            REDES SOCIAIS
==================================================*/

    openYoutube(){

        window.open(

            DATA.SOCIAL.youtube,

            "_blank"

        );

    },

    openTwitch(){

        window.open(

            DATA.SOCIAL.twitch,

            "_blank"

        );

    },

/*==================================================
            COMPARTILHAR
==================================================*/

    async share(){

        if(navigator.share){

            try{

                await navigator.share({

                    title:DATA.CHANNEL.name,

                    text:DATA.CHANNEL.description,

                    url:DATA.SOCIAL.youtube

                });

            }

            catch(error){

                console.log(

                    "Compartilhamento cancelado."

                );

            }

        }

        else{

            navigator.clipboard.writeText(

                DATA.SOCIAL.youtube

            );

            alert(

                "Link copiado!"

            );

        }

    }

};

/*==================================================
            FUNÇÕES GLOBAIS
==================================================*/

window.openAboutYoutube=function(){

    About.openYoutube();

};

window.openAboutTwitch=function(){

    About.openTwitch();

};

window.shareAbout=function(){

    About.share();

};

window.reloadAbout=function(){

    About.refresh();

};

/*==================================================
            INICIAR
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        About.init();

        About.animateTimeline();

        About.observeTimeline();

        About.photoAnimation();

        console.log(

            "About.js carregado."

        );

    }

);

