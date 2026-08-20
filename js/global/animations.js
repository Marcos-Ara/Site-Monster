/* ==========================================================
                    ANIMATIONS
========================================================== */

"use strict";

const Animations = {

    observer: null,

    animatedElements: [],

    initialized: false,

    duration: 600,

    delay: 100,

    easing: "ease",

    /* ======================================================
                        INIT
    ====================================================== */

    init(){

        if(this.initialized) return;

        this.cache();

        this.createObserver();

        this.observe();

        this.initialized = true;

        log("Animations inicializadas.");

    },

    /* ======================================================
                        CACHE
    ====================================================== */

    cache(){

        this.animatedElements = $$("[data-animation]");

    },

    /* ======================================================
                        OBSERVER
    ====================================================== */

    createObserver(){

        this.observer = new IntersectionObserver(

            entries=>{

                entries.forEach(entry=>{

                    if(

                        entry.isIntersecting

                    ){

                        this.show(

                            entry.target

                        );

                    }

                });

            },

            {

                threshold:.15,

                rootMargin:"0px 0px -80px 0px"

            }

        );

    },

    /* ======================================================
                        OBSERVE
    ====================================================== */

    observe(){

        this.animatedElements.forEach(element=>{

            this.observer.observe(element);

        });

    },

    /* ======================================================
                        SHOW
    ====================================================== */

    show(element){

        if(!element) return;

        const delay =

            Number(

                element.dataset.delay

            ) || 0;

        setTimeout(()=>{

            addClass(

                element,

                "animated"

            );

        },delay);

        this.observer.unobserve(

            element

        );

    },


    /* ======================================================
                        TYPES
    ====================================================== */

    animation(element){

        const type =

            element.dataset.animation ||

            "fade";

        switch(type){

            case "fade":

                this.fade(element);

                break;

            case "up":

                this.up(element);

                break;

            case "down":

                this.down(element);

                break;

            case "left":

                this.left(element);

                break;

            case "right":

                this.right(element);

                break;

            case "zoom":

                this.zoom(element);

                break;

            case "rotate":

                this.rotate(element);

                break;

            case "flip":

                this.flip(element);

                break;

            default:

                this.fade(element);

        }

    },

    /* ======================================================
                        FADE
    ====================================================== */

    fade(element){

        element.style.opacity = 1;

        element.style.transform =

            "translate3d(0,0,0)";

    },

    /* ======================================================
                        UP
    ====================================================== */

    up(element){

        element.style.opacity = 1;

        element.style.transform =

            "translateY(0)";

    },

    /* ======================================================
                        DOWN
    ====================================================== */

    down(element){

        element.style.opacity = 1;

        element.style.transform =

            "translateY(0)";

    },

    /* ======================================================
                        LEFT
    ====================================================== */

    left(element){

        element.style.opacity = 1;

        element.style.transform =

            "translateX(0)";

    },

    /* ======================================================
                        RIGHT
    ====================================================== */

    right(element){

        element.style.opacity = 1;

        element.style.transform =

            "translateX(0)";

    },

    /* ======================================================
                        ZOOM
    ====================================================== */

    zoom(element){

        element.style.opacity = 1;

        element.style.transform =

            "scale(1)";

    },

    /* ======================================================
                        ROTATE
    ====================================================== */

    rotate(element){

        element.style.opacity = 1;

        element.style.transform =

            "rotate(0deg)";

    },

    /* ======================================================
                        FLIP
    ====================================================== */

    flip(element){

        element.style.opacity = 1;

        element.style.transform =

            "rotateY(0deg)";

    },

    /* ======================================================
                        STAGGER
    ====================================================== */

    staggerContainers: [],

    staggerDelay: 120,

    /* ======================================================
                        CACHE STAGGER
    ====================================================== */

    cacheStagger(){

        this.staggerContainers = $$("[data-stagger]");

    },

    /* ======================================================
                        STAGGER INIT
    ====================================================== */

    initStagger(){

        this.cacheStagger();

        this.staggerContainers.forEach(container=>{

            this.prepareStagger(container);

        });

    },

    /* ======================================================
                        PREPARE
    ====================================================== */

    prepareStagger(container){

        const children =

            [...container.children];

        children.forEach((child,index)=>{

            child.dataset.delay =

                index *

                this.staggerDelay;

            if(

                !child.dataset.animation

            ){

                child.dataset.animation =

                    "up";

            }

            this.observer.observe(

                child

            );

        });

    },

    /* ======================================================
                        REFRESH
    ====================================================== */

    refresh(){

        this.cache();

        this.observe();

        this.initStagger();

    },

    /* ======================================================
                        DESTROY
    ====================================================== */

    destroy(){

        if(

            !this.observer

        ) return;

        this.observer.disconnect();

        this.initialized = false;

    },

    /* ======================================================
                        HOVER
    ====================================================== */

    hoverElements: [],

    /* ======================================================
                        CACHE HOVER
    ====================================================== */

    cacheHover(){

        this.hoverElements = $$("[data-hover]");

    },

    /* ======================================================
                        INIT HOVER
    ====================================================== */

    initHover(){

        this.cacheHover();

        this.hoverElements.forEach(element=>{

            on(

                element,

                "mouseenter",

                ()=>{

                    this.hoverIn(element);

                }

            );

            on(

                element,

                "mouseleave",

                ()=>{

                    this.hoverOut(element);

                }

            );

        });

    },

    /* ======================================================
                        ENTER
    ====================================================== */

    hoverIn(element){

        const effect =

            element.dataset.hover ||

            "lift";

        addClass(

            element,

            `hover-${effect}`

        );

    },

    /* ======================================================
                        LEAVE
    ====================================================== */

    hoverOut(element){

        const effect =

            element.dataset.hover ||

            "lift";

        removeClass(

            element,

            `hover-${effect}`

        );

    },

    /* ======================================================
                        REFRESH
    ====================================================== */

    refreshHover(){

        this.initHover();

    },

    /* ======================================================
                        PARALLAX
    ====================================================== */

    parallaxElements: [],

    parallaxTicking: false,

    /* ======================================================
                        CACHE
    ====================================================== */

    cacheParallax(){

        this.parallaxElements = $$("[data-parallax]");

    },

    /* ======================================================
                        INIT
    ====================================================== */

    initParallax(){

        this.cacheParallax();

        if(!this.parallaxElements.length) return;

        this.updateParallax();

        on(

            window,

            EVENTS.scroll,

            ()=>{

                if(this.parallaxTicking) return;

                this.parallaxTicking = true;

                requestAnimationFrame(()=>{

                    this.updateParallax();

                    this.parallaxTicking = false;

                });

            }

        );

    },

    /* ======================================================
                        UPDATE
    ====================================================== */

    updateParallax(){

        this.parallaxElements.forEach(element=>{

            const speed =

                Number(

                    element.dataset.speed

                ) || .25;

            const rect =

                element.getBoundingClientRect();

            const offset =

                rect.top * speed;

            element.style.transform =

                `translate3d(0, ${offset}px, 0)`;

        });

    },

    /* ======================================================
                        RESET
    ====================================================== */

    resetParallax(){

        this.parallaxElements.forEach(element=>{

            element.style.transform = "";

        });

    },

    /* ======================================================
                        REFRESH
    ====================================================== */

    refreshParallax(){

        this.cacheParallax();

        this.updateParallax();

    },

    /* ======================================================
                        HERO
    ====================================================== */

    hero: null,

    heroItems: [],

    heroDelay: 180,

    /* ======================================================
                        CACHE
    ====================================================== */

    cacheHero(){

        this.hero = $(".hero");

        if(!this.hero) return;

        this.heroItems =

            $$("[data-hero]");

    },

    /* ======================================================
                        INIT
    ====================================================== */

    initHero(){

        this.cacheHero();

        if(!this.hero) return;

        this.animateHero();

    },

    /* ======================================================
                        HERO ANIMATION
    ====================================================== */

    animateHero(){

        this.heroItems.forEach(

            (element,index)=>{

                element.style.opacity = "0";

                element.style.transform =

                    "translateY(40px)";

                setTimeout(()=>{

                    element.style.transition =

                        "all .8s ease";

                    element.style.opacity = "1";

                    element.style.transform =

                        "translateY(0)";

                },

                index *

                this.heroDelay

                );

            }

        );

    },

    /* ======================================================
                        HERO RESET
    ====================================================== */

    resetHero(){

        this.heroItems.forEach(element=>{

            element.style.opacity = "";

            element.style.transform = "";

            element.style.transition = "";

        });

    },

    /* ======================================================
                        HERO REFRESH
    ====================================================== */

    refreshHero(){

        this.cacheHero();

        this.animateHero();

    },

    /* ======================================================
                        COUNTERS
    ====================================================== */

    counters: [],

    counterObserver: null,

    counterDuration: 2000,

    /* ======================================================
                        INIT
    ====================================================== */

    initCounters(){

        this.counters = $$("[data-counter]");

        if(!this.counters.length) return;

        this.createCounterObserver();

    },

    /* ======================================================
                    OBSERVER
    ====================================================== */

    createCounterObserver(){

        this.counterObserver =

            new IntersectionObserver(

                entries=>{

                    entries.forEach(entry=>{

                        if(

                            entry.isIntersecting

                        ){

                            this.animateCounter(

                                entry.target

                            );

                            this.counterObserver.unobserve(

                                entry.target

                            );

                        }

                    });

                },

                {

                    threshold:.4

                }

            );

        this.counters.forEach(counter=>{

            this.counterObserver.observe(

                counter

            );

        });

    },

    /* ======================================================
                    ANIMATION
    ====================================================== */

    animateCounter(element){

        const target =

            Number(

                element.dataset.counter

            );

        const prefix =

            element.dataset.prefix ||

            "";

        const suffix =

            element.dataset.suffix ||

            "";

        const duration =

            Number(

                element.dataset.duration

            ) ||

            this.counterDuration;

        let start = 0;

        const startTime =

            performance.now();

        const update = currentTime=>{

            const progress =

                Math.min(

                    (

                        currentTime -

                        startTime

                    ) /

                    duration,

                    1

                );

            const value =

                Math.floor(

                    progress *

                    target

                );

            element.textContent =

                `${prefix}${value.toLocaleString()}${suffix}`;

            if(progress < 1){

                requestAnimationFrame(

                    update

                );

            }

            else{

                element.textContent =

                `${prefix}${target.toLocaleString()}${suffix}`;

            }

        };

        requestAnimationFrame(update);

    },

    /* ======================================================
                    RESET
    ====================================================== */

    resetCounters(){

        this.counters.forEach(counter=>{

            counter.textContent = "0";

        });

    },

    /* ======================================================
                    KINGDOM EFFECTS
    ====================================================== */

    kingdomFlags: [],

    kingdomPreview: null,

    pulseTimer: null,

    /* ======================================================
                    CACHE
    ====================================================== */

    cacheKingdom(){

        this.kingdomFlags = $$("[data-flag]");

        this.kingdomPreview = $(".flag-preview");

    },

    /* ======================================================
                    INIT
    ====================================================== */

    initKingdom(){

        this.cacheKingdom();

        if(!this.kingdomFlags.length) return;

        this.bindKingdomEvents();

        this.startFlagAnimation();

    },

    /* ======================================================
                    EVENTS
    ====================================================== */

    bindKingdomEvents(){

        this.kingdomFlags.forEach(flag=>{

            on(

                flag,

                "mouseenter",

                ()=>{

                    this.flagEnter(flag);

                }

            );

            on(

                flag,

                "mouseleave",

                ()=>{

                    this.flagLeave(flag);

                }

            );

            on(

                flag,

                EVENTS.click,

                ()=>{

                    this.flagClick(flag);

                }

            );

        });

    },

    /* ======================================================
                    ENTER
    ====================================================== */

    flagEnter(flag){

        addClass(

            flag,

            "flag-hover"

        );

        if(this.kingdomPreview){

            addClass(

                this.kingdomPreview,

                "show"

            );

        }

    },

    /* ======================================================
                    LEAVE
    ====================================================== */

    flagLeave(flag){

        removeClass(

            flag,

            "flag-hover"

        );

        if(this.kingdomPreview){

            removeClass(

                this.kingdomPreview,

                "show"

            );

        }

    },

    /* ======================================================
                    CLICK
    ====================================================== */

    flagClick(flag){

        this.kingdomFlags.forEach(item=>{

            removeClass(

                item,

                "flag-active"

            );

        });

        addClass(

            flag,

            "flag-active"

        );

    },

    /* ======================================================
                    FLAG ANIMATION
    ====================================================== */

    startFlagAnimation(){

        this.kingdomFlags.forEach((flag,index)=>{

            flag.style.animationDelay =

                `${index * .25}s`;

        });

    },

    /* ======================================================
                    CURRENT LEVEL
    ====================================================== */

    pulseCurrent(flag){

        clearInterval(

            this.pulseTimer

        );

        this.pulseTimer =

            setInterval(()=>{

                flag.classList.toggle(

                    "flag-pulse"

                );

            },900);

    },

    /* ======================================================
                    REFRESH
    ====================================================== */

    refreshKingdom(){

        this.cacheKingdom();

    },

    /* ======================================================
                    ENABLE
    ====================================================== */

    enable(){

        DOM.body.classList.remove(

            "animations-disabled"

        );

    },

    /* ======================================================
                    DISABLE
    ====================================================== */

    disable(){

        DOM.body.classList.add(

            "animations-disabled"

        );

    },

    /* ======================================================
                    PAUSE
    ====================================================== */

    pause(){

        document.documentElement.style.setProperty(

            "--animation-play-state",

            "paused"

        );

    },

    /* ======================================================
                    RESUME
    ====================================================== */

    resume(){

        document.documentElement.style.setProperty(

            "--animation-play-state",

            "running"

        );

    },

    /* ======================================================
                    REFRESH
    ====================================================== */

    refresh(){

        this.cache();

        this.observe();

        this.refreshHero();

        this.refreshHover();

        this.refreshParallax();

        this.refreshKingdom();

    },

    /* ======================================================
                    DESTROY
    ====================================================== */

    destroy(){

        if(this.observer){

            this.observer.disconnect();

        }

        if(this.counterObserver){

            this.counterObserver.disconnect();

        }

        clearInterval(

            this.pulseTimer

        );

        this.initialized = false;

    },

    /* ======================================================
                    VERSION
    ====================================================== */

    version(){

        return{

            name:"Animations",

            version:"1.0.0",

            author:"Monster"

        };

    }

};

/* ==========================================================
                    START
========================================================== */

domReady(()=>{

    Animations.init();

});

/* ==========================================================
                    EXPORT
========================================================== */

window.Animations = Animations;

/* ==========================================================
                    END OF FILE
========================================================== */