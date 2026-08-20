/* ==========================================================
                    NAVIGATION
========================================================== */

"use strict";

const Navigation = {

    menu: null,

    button: null,

    links: [],

    header: null,

    quickMenu: null,

    initialized: false,

    /* ======================================================
                        INIT
    ====================================================== */

    init(){

        if(this.initialized) return;

        this.cache();

        this.bindEvents();

        this.bindWindowEvents();

        this.bindAnchors();

        document.addEventListener("click", event=>{

            if(!this.isOpen()) return;

            if(this.menu && this.menu.contains(event.target)) return;

            if(this.quickMenu && this.quickMenu.contains(event.target)) return;

            if(this.button && this.button.contains(event.target)) return;

            this.close();

        });

        this.setActiveLink();

        this.initialized = true;

        log("Navigation inicializada.");

    },

    /* ======================================================
                        CACHE
    ====================================================== */

    cache(){

        // Cache direct DOM references so the hamburger does not depend on
        // another module being initialized first.
        this.header = document.querySelector("header.header") || document.querySelector("header");
        this.menu = document.querySelector(".navbar");
        this.button = document.querySelector(".menu-toggle");
        this.links = Array.from(document.querySelectorAll(".navbar a"));
        this.quickMenu = document.querySelector(".quick-menu");

    },

    createQuickMenu(){

        return document.querySelector(".quick-menu");

    },

    /* ======================================================
                        EVENTS
    ====================================================== */

    bindEvents(){

        this.links.forEach(link=>{

            on(

                link,

                EVENTS.click,

                ()=>this.close()

            );

        });

        if(this.quickMenu){
            this.quickMenu.querySelectorAll("a").forEach(link=>{
                link.addEventListener("click", ()=>this.close(), { once: false });
            });
        }

    },

    /* ======================================================
                        OPEN
    ====================================================== */

    open(){

        const target = this.quickMenu;

        if(!target) return;

        addClass(target, CLASSES.open);
        target.setAttribute("aria-hidden", "false");

        if(this.button){
            this.button.setAttribute("aria-expanded","true");
            this.button.setAttribute("aria-label","Fechar menu");
            addClass(this.button, "active");
        }

        if (DOM.body) addClass(DOM.body, "menu-open");

    },

    /* ======================================================
                        CLOSE
    ====================================================== */

    close(){

        if(this.menu){
            removeClass(this.menu, CLASSES.open);
        }

        if(this.quickMenu){
            removeClass(this.quickMenu, CLASSES.open);
            this.quickMenu.setAttribute("aria-hidden", "true");
        }

        if(this.button){
            this.button.setAttribute("aria-expanded","false");
            this.button.setAttribute("aria-label","Abrir menu");
            removeClass(this.button, "active");
        }

        if (DOM.body) removeClass(DOM.body, "menu-open");

    },

    /* ======================================================
                        TOGGLE
    ====================================================== */

    toggle(){

        // O hamburger controla sempre o painel quick-menu.
        // O cabeçalho principal permanece visível e não é
        // transformado em menu lateral.
        if(this.quickMenu && hasClass(this.quickMenu, CLASSES.open)){

            this.close();

            return;

        }

        this.open();

    },

    /* ======================================================
                        HEADER
    ====================================================== */

    lastScroll: 0,

    scrollLimit: 20,

    updateHeader(){

        if(!this.header) return;

        const current = WINDOW.scrollY;

        /* ==========================================
                    BACKGROUND
        ========================================== */

        if(current > this.scrollLimit){

            addClass(

                this.header,

                "header-scrolled"

            );

        }

        else{

            removeClass(

                this.header,

                "header-scrolled"

            );

        }

        /* ==========================================
                    SHOW / HIDE
        ========================================== */

        if(current > 120){

            if(current > this.lastScroll){

                addClass(

                    this.header,

                    "header-hidden"

                );

            }

            else{

                removeClass(

                    this.header,

                    "header-hidden"

                );

            }

        }

        else{

            removeClass(

                this.header,

                "header-hidden"

            );

        }

        this.lastScroll = current;

    },

    /* ======================================================
                        RESIZE
    ====================================================== */

    resize(){

        if(

            WINDOW.width >

            BREAKPOINTS.tablet

        ){

            this.close();

        }

    },

    /* ======================================================
                        GLOBAL EVENTS
    ====================================================== */

    bindWindowEvents(){

        on(

            window,

            EVENTS.scroll,

            throttle(

                ()=>{

                    this.updateHeader();

                },

                16

            )

        );

        on(

            window,

            EVENTS.resize,

            debounce(

                ()=>{

                    this.resize();

                },

                200

            )

        );

    },

    /* ======================================================
                        CURRENT PAGE
    ====================================================== */

    getCurrentPage(){

        const path = window.location.pathname;

        const file = path.split("/").pop();

        if(file === "" || file === "index.html"){

            return "index";

        }

        return file.replace(".html","");

    },

    /* ======================================================
                        ACTIVE LINK
    ====================================================== */

    setActiveLink(){

        if(!this.links.length) return;

        const current = this.getCurrentPage();

        this.links.forEach(link=>{

            removeClass(

                link,

                CLASSES.active

            );

            const href =

                link.getAttribute("href") || "";

            const page = href

                .split("/")

                .pop()

                .replace(".html","");

            if(

                (current === "index" &&

                 (page === "" || page === "index"))

                ||

                page === current

            ){

                addClass(

                    link,

                    CLASSES.active

                );

            }

        });

    },

    /* ======================================================
                        NAVIGATION
    ====================================================== */

    navigate(url){

        if(!url) return;

        window.location.href = url;

    },

    /* ======================================================
                        OPEN PAGE
    ====================================================== */

    open(link){

        if(!link) return;

        const href =

            link.getAttribute("href");

        if(!href) return;

        this.navigate(href);

    },

    /* ======================================================
                        MENU LINKS
    ====================================================== */

    bindLinks(){

        this.links.forEach(link=>{

            on(

                link,

                EVENTS.click,

                ()=>{

                    this.close();

                }

            );

        });

    },

    /* ======================================================
                        PAGE INFO
    ====================================================== */

    page(){

        return{

            current:this.getCurrentPage(),

            title:document.title,

            url:window.location.href

        };

    },

    /* ======================================================
                        SCROLL TO
    ====================================================== */

    scrollTo(target){

        if(!target) return;

        const element =

            typeof target === "string"

                ? $(target)

                : target;

        if(!element) return;

        const offset =

            UI.navbarHeight;

        const top =

            element.getBoundingClientRect().top +

            window.pageYOffset -

            offset;

        window.scrollTo({

            top,

            behavior:"smooth"

        });

    },

    /* ======================================================
                        HASH
    ====================================================== */

    updateHash(id){

        if(!id) return;

        history.pushState(

            null,

            null,

            `#${id}`

        );

    },

    /* ======================================================
                        SCROLL LINK
    ====================================================== */

    handleAnchor(link){

        if(!link) return;

        const href =

            link.getAttribute("href");

        if(

            !href ||

            !href.startsWith("#")

        ) return;

        const section =

            $(href);

        if(!section) return;

        this.scrollTo(section);

        this.updateHash(

            section.id

        );

        this.close();

    },

    /* ======================================================
                        ANCHORS
    ====================================================== */

    bindAnchors(){

        $$('a[href^="#"]').forEach(link=>{

            on(

                link,

                EVENTS.click,

                event=>{

                    event.preventDefault();

                    this.handleAnchor(link);

                }

            );

        });

    },

    /* ======================================================
                        INITIAL HASH
    ====================================================== */

    openHash(){

        const hash =

            window.location.hash;

        if(!hash) return;

        const element =

            $(hash);

        if(!element) return;

        setTimeout(()=>{

            this.scrollTo(element);

        },150);

    },


    /* ======================================================
                        MENU STATE
    ====================================================== */

    isOpen(){

        return !!this.quickMenu && hasClass(this.quickMenu, CLASSES.open);

    },

    /* ======================================================
                        KEYBOARD
    ====================================================== */

    keyboard(event){

        if(event.key === "Escape") this.close();

    },

    /* ======================================================
                        VERSION
    ====================================================== */

    version(){

        return {
            name: "Navigation",
            version: "1.1.0"
        };

    }

};

/* ==========================================================
                    GLOBAL EVENTS
========================================================== */

on(

    document,

    "keydown",

    event=>{

        Navigation.keyboard(event);

    }

);

/* ==========================================================
                    START
========================================================== */

domReady(()=>{

    Navigation.init();

});

/* ==========================================================
                    EXPORT
========================================================== */

window.Navigation = Navigation;

/* ==========================================================
                    END OF FILE
========================================================== */