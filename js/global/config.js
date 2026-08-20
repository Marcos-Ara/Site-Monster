/* ==========================================================
                    MONSTER CHANNEL
========================================================== */

"use strict";

/* ==========================================================
                    SITE ROOT
   Resolve the repository root from this script itself.
   This works both on localhost and on GitHub Pages project URLs.
========================================================== */

const MONSTER_ROOT = new URL("../../", document.currentScript?.src || window.location.href).href;
window.MONSTER_ROOT = MONSTER_ROOT;

/* ==========================================================
                    CONFIG
========================================================== */

const CONFIG = Object.freeze({

    name: "Monster Channel",

    version: "1.0.0",

    author: "Monster",

    language: "pt-BR"

});

/* ==========================================================
                    WEBSITE
========================================================== */

const WEBSITE = Object.freeze({

    title: "Monster",

    description: "Canal dedicado a Kingdom Rush e outros jogos.",

    url: window.location.origin

});

/* ==========================================================
                    SOCIAL LINKS
========================================================== */

const SOCIAL = Object.freeze({

    youtube: "",

    twitch: "",

    discord: "",

    instagram: "",

    github: "https://github.com/Marcos-Ara"

});

/* ==========================================================
                    UI
========================================================== */

const UI = Object.freeze({

    animationDuration: 400,

    scrollOffset: 90,

    navbarHeight: 80,

    mobileBreakpoint: 768

});

/* ==========================================================
                    MAP
========================================================== */

const MAP_CONFIG = Object.freeze({

    zoomMin: 1,

    zoomMax: 3,

    zoomStep: 0.25,

    defaultZoom: 1

});

/* ==========================================================
                    VIDEO
========================================================== */

const VIDEO = Object.freeze({

    autoplay: false,

    controls: true,

    mute: false

});

/* ==========================================================
                    SELECTORS
========================================================== */

const SELECTORS = Object.freeze({

    header: "header",

    footer: "footer",

    navigation: ".navbar",

    menuButton: ".menu-toggle",

    modal: ".video-modal",

    map: ".map",

    mapFlags: ".map-flag"

});

/* ==========================================================
                    EVENTS
========================================================== */

const EVENTS = Object.freeze({

    click: "click",

    scroll: "scroll",

    resize: "resize",

    load: "load",

    mousemove: "mousemove"

});

/* ==========================================================
                    STORAGE
========================================================== */

const STORAGE = Object.freeze({

    theme: "monster-theme",

    language: "monster-language"

});

/* ==========================================================
                    FEATURES
========================================================== */

const FEATURES = Object.freeze({

    animations: true,

    particles: true,

    pageTransitions: true,

    lazyLoading: true,

    smoothScroll: true,

    preloadImages: true,

    previewVideos: true,

    mapZoom: false,

    modalVideo: true

});

/* ==========================================================
                    ANIMATION
========================================================== */

const ANIMATION = Object.freeze({

    duration: 400,

    delay: 100,

    easing: "ease",

    observerThreshold: 0.15,

    observerRootMargin: "0px 0px -80px 0px"

});

/* ==========================================================
                    SCROLL
========================================================== */

const SCROLL = Object.freeze({

    behavior: "smooth",

    offset: 80,

    showButtonAfter: 500

});

/* ==========================================================
                    LAZY LOADING
========================================================== */

const LAZY = Object.freeze({

    rootMargin: "200px",

    threshold: 0.01

});

/* ==========================================================
                    BREAKPOINTS
========================================================== */

const BREAKPOINTS = Object.freeze({

    mobile: 576,

    tablet: 768,

    laptop: 992,

    desktop: 1200,

    ultrawide: 1440

});

/* ==========================================================
                    CLASSES
========================================================== */

const CLASSES = Object.freeze({

    active: "active",

    hidden: "hidden",

    show: "show",

    loading: "loading",

    open: "open",

    current: "current",

    completed: "completed",

    locked: "locked"

});

/* ==========================================================
                    DATA ATTRIBUTES
========================================================== */

const DATA = Object.freeze({

    animation: "data-animation",

    delay: "data-delay",

    video: "data-video",

    thumbnail: "data-thumbnail",

    phase: "data-phase",

    map: "data-map"

});

/* ==========================================================
                    DEFAULTS
========================================================== */

const DEFAULTS = Object.freeze({

    image: MONSTER_ROOT + "assets/images/default.webp",

    avatar: MONSTER_ROOT + "assets/images/avatar.webp",

    banner: MONSTER_ROOT + "assets/images/banner.webp"

});

/* ==========================================================
                    DEBUG
========================================================== */

const DEBUG = Object.freeze({

    enabled: false,

    logEvents: false,

    logAnimations: false,

    logMap: false,

    logVideos: false

});

/* ==========================================================
                    FREEZE
========================================================== */

Object.freeze(CONFIG);

Object.freeze(WEBSITE);

Object.freeze(SOCIAL);

Object.freeze(UI);

Object.freeze(MAP_CONFIG);

Object.freeze(VIDEO);

/* ==========================================================
                    DOM HELPERS
========================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

/* ==========================================================
                    EVENTS
========================================================== */

const on = (element, event, callback, options = false) => {

    if (!element) return;

    element.addEventListener(event, callback, options);

};

const off = (element, event, callback) => {

    if (!element) return;

    element.removeEventListener(event, callback);

};

/* ==========================================================
                    ELEMENT
========================================================== */

const createElement = (tag, className = "") => {

    const element = document.createElement(tag);

    if (className)
        element.className = className;

    return element;

};

/* ==========================================================
                    RANDOM
========================================================== */

const random = (min, max) =>

    Math.floor(Math.random() * (max - min + 1)) + min;

/* ==========================================================
                    CLAMP
========================================================== */

const clamp = (value, min, max) =>

    Math.min(Math.max(value, min), max);

/* ==========================================================
                    SLEEP
========================================================== */

const sleep = (ms) =>

    new Promise(resolve => setTimeout(resolve, ms));

/* ==========================================================
                    DEVICE
========================================================== */

const isMobile = () =>

    window.innerWidth <= BREAKPOINTS.tablet;

/* ==========================================================
                    SCROLL
========================================================== */

const scrollToElement = (element) => {

    if (!element) return;

    element.scrollIntoView({

        behavior: SCROLL.behavior,

        block: "start"

    });

};

/* ==========================================================
                    DEBOUNCE
========================================================== */

const debounce = (callback, delay = 250) => {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

};

/* ==========================================================
                    THROTTLE
========================================================== */

const throttle = (callback, delay = 200) => {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

};

/* ==========================================================
                    ATTRIBUTE
========================================================== */

const setAttr = (element, name, value) => {

    if (!element) return;

    element.setAttribute(name, value);

};

const getAttr = (element, name) =>

    element?.getAttribute(name);

/* ==========================================================
                    CLASS
========================================================== */

const addClass = (element, className) => {

    element?.classList.add(className);

};

const removeClass = (element, className) => {

    element?.classList.remove(className);

};

const toggleClass = (element, className) => {

    element?.classList.toggle(className);

};

const hasClass = (element, className) =>

    element?.classList.contains(className);

/* ==========================================================
                    HTML
========================================================== */

const html = (element, value) => {

    if (!element) return;

    element.innerHTML = value;

};

const text = (element, value) => {

    if (!element) return;

    element.textContent = value;

};

/* ==========================================================
                    LOG
========================================================== */

const log = (...message) => {

    if (!DEBUG.enabled) return;

    console.log(

        "%cMONSTER",

        "color:#ff7b00;font-weight:bold",

        ...message

    );

};

/* ==========================================================
                    DOM CACHE
========================================================== */

const DOM = {

    /* ==========================
            DOCUMENT
    ========================== */

    html: document.documentElement,

    body: document.body,

    head: document.head,

    /* ==========================
            LAYOUT
    ========================== */

    header: $(SELECTORS.header),

    footer: $(SELECTORS.footer),

    navigation: $(SELECTORS.navigation),

    menuButton: $(SELECTORS.menuButton),

    /* ==========================
            HOME
    ========================== */

    hero: $(".hero"),

    heroTitle: $(".hero-title"),

    heroSubtitle: $(".hero-subtitle"),

    featured: $(".featured"),

    latestVideos: $(".latest-videos"),

    /* ==========================
            KINGDOM
    ========================== */

    map: $(SELECTORS.map),

    mapContainer: $(".map-container"),

    mapFlags: $$(SELECTORS.mapFlags),

    mapPreview: $(".map-preview"),

    /* ==========================
            MODAL
    ========================== */

    modal: $(SELECTORS.modal),

    modalContent: $(".modal-content"),

    modalVideo: $(".modal-video"),

    modalClose: $(".modal-close"),

    /* ==========================
            JUX
    ========================== */

    juxHero: $(".jux-hero"),

    juxFeatured: $(".jux-featured"),

    juxGrid: $(".jux-grid"),

    /* ==========================
            ABOUT
    ========================== */

    aboutHero: $(".about-hero"),

    aboutCards: $(".about-grid"),

    aboutSkills: $(".skills-grid"),

    /* ==========================
            FOOTER
    ========================== */

    backToTop: $(".back-to-top")

};

/* ==========================================================
                    DOM METHODS
========================================================== */

DOM.refresh = () => {

    DOM.header = $(SELECTORS.header);

    DOM.footer = $(SELECTORS.footer);

    DOM.navigation = $(SELECTORS.navigation);

    DOM.menuButton = $(SELECTORS.menuButton);

    DOM.map = $(SELECTORS.map);

    DOM.mapFlags = $$(SELECTORS.mapFlags);

    DOM.modal = $(SELECTORS.modal);

};

/* ==========================================================
                    READY
========================================================== */

const domReady = (callback) => {

    if (document.readyState === "loading") {

        document.addEventListener(

            "DOMContentLoaded",

            callback

        );

    } else {

        callback();

    }

};

/* ==========================================================
                    WINDOW
========================================================== */

const WINDOW = {

    get width(){

        return window.innerWidth;

    },

    get height(){

        return window.innerHeight;

    },

    get scrollY(){

        return window.scrollY;

    }

};

/* ==========================================================
                    SUPPORT
========================================================== */

const SUPPORT = {

    touch:

        "ontouchstart" in window,

    darkMode:

        window.matchMedia(

            "(prefers-color-scheme: dark)"

        ).matches,

    reducedMotion:

        window.matchMedia(

            "(prefers-reduced-motion: reduce)"

        ).matches

};

/* ==========================================================
                    LOG
========================================================== */

log("DOM carregado.");

/* ==========================================================
                    APP

    A implementação principal está em ./js/global/app.js.
========================================================== */

/* ==========================================================
                    GLOBAL EXPORTS
========================================================== */

window.CONFIG = CONFIG;
window.DOM = DOM;
window.$ = $;
window.$$ = $$;
