/* ==========================================================
                        APP
========================================================== */

"use strict";

const AppState = window.__MONSTER_APP_STATE__ || {
    initialized: false,
    loading: false
};
window.__MONSTER_APP_STATE__ = AppState;

/* ==========================================================
                    MONSTER INTRO
========================================================== */
const MonsterIntro={
    started:false,finished:false,
    init(){
        if(this.started)return;
        this.started=true;
        const intro=document.getElementById("monster-intro");
        const video=document.getElementById("monster-intro-video");
        const progress=document.getElementById("monster-intro-progress-bar");
        const soundButton=document.getElementById("monster-intro-sound");
        if(!intro||!video)return;
        let alreadySeen=false;
        try{alreadySeen=sessionStorage.getItem("monsterIntroSeen")==="1";}catch(e){}
        if(alreadySeen){this.removeImmediately(intro,video);return;}
        document.documentElement.classList.add("intro-lock");
        const close=()=>this.finish(intro,video,progress);
        video.addEventListener("timeupdate",()=>{if(progress&&Number.isFinite(video.duration)&&video.duration>0){progress.style.width=Math.min(100,(video.currentTime/video.duration)*100)+"%";}});
        video.addEventListener("ended",close,{once:true});
        video.addEventListener("error",()=>setTimeout(close,900),{once:true});
        if(soundButton){soundButton.addEventListener("click",()=>{video.muted=false;video.volume=1;const r=video.play();if(r&&r.catch)r.catch(()=>{});soundButton.classList.remove("visible");});}
        video.muted=false;video.volume=1;
        const firstPlay=video.play();
        if(firstPlay&&firstPlay.catch){firstPlay.catch(()=>{video.muted=true;const r=video.play();if(r&&r.catch)r.catch(()=>{});if(soundButton)soundButton.classList.add("visible");});}
    },
    finish(intro,video,progress){
        if(this.finished)return;this.finished=true;
        if(progress)progress.style.width="100%";
        try{sessionStorage.setItem("monsterIntroSeen","1");}catch(e){}
        intro.classList.add("intro-leaving");document.documentElement.classList.remove("intro-lock");
        setTimeout(()=>{try{video.pause();video.removeAttribute("src");video.load();}catch(e){}intro.remove();},1050);
    },
    removeImmediately(intro,video){
        try{video.pause();video.removeAttribute("src");video.load();}catch(e){}
        intro.remove();document.documentElement.classList.remove("intro-lock");
    }
};
document.addEventListener("DOMContentLoaded",()=>MonsterIntro.init(),{once:true});

const App = {

    modules:[],

    version:"1.0.0",

    /* ======================================================
                        INIT
    ====================================================== */

    init(){

        if(AppState.initialized) return;

        log("Inicializando aplicação...");

        AppState.loading = true;

        this.registerModules();

        this.startModules();

        this.finishLoading();

        AppState.initialized = true;

        log("Aplicação iniciada.");

    },

    /* ======================================================
                        MODULES
    ====================================================== */

    registerModules(){

        this.modules = [

            Navigation,

            Animations

        ];

    },

    /* ======================================================
                        START
    ====================================================== */

    startModules(){

        this.modules.forEach(module=>{

            if(

                module &&

                typeof module.init === "function"

            ){

                module.init();

            }

        });

    },


    /* ======================================================
                        LOADER
    ====================================================== */

    loader:null,

    /* ======================================================
                        CACHE
    ====================================================== */

    cache(){

        this.loader = $("#loader");

    },

    /* ======================================================
                        FINISH LOADING
    ====================================================== */

    finishLoading(){

        this.cache();

        window.addEventListener(

            "load",

            ()=>{

                this.hideLoader();

            },

            { once:true }

        );

    },

    /* ======================================================
                        HIDE LOADER
    ====================================================== */

    hideLoader(){

        if(!this.loader){

            AppState.loading = false;

            return;

        }

        this.loader.classList.add(

            "loader-hide"

        );

        document.body.classList.add(

            "loaded"

        );

        setTimeout(()=>{

            this.loader.remove();

            AppState.loading = false;

            this.startAnimations();

        },500);

    },

    /* ======================================================
                        START ANIMATIONS
    ====================================================== */

    startAnimations(){

        if(

            window.Animations &&

            typeof Animations.refresh === "function"

        ){

            Animations.refresh();

        }

    },

/* ==========================================================
                    GLOBAL EVENTS
========================================================== */

    /* ======================================================
                        EVENTS
    ====================================================== */

    bindEvents(){

        window.addEventListener(

            "resize",

            ()=>{

                this.onResize();

            }

        );

        window.addEventListener(

            "scroll",

            ()=>{

                this.onScroll();

            },

            {

                passive:true

            }

        );

        document.addEventListener(

            "visibilitychange",

            ()=>{

                this.onVisibility();

            }

        );

        window.addEventListener(

            "online",

            ()=>{

                this.onOnline();

            }

        );

        window.addEventListener(

            "offline",

            ()=>{

                this.onOffline();

            }

        );

        document.addEventListener(

            "keydown",

            event=>{

                this.onKeyDown(event);

            }

        );

    },

    /* ======================================================
                        RESIZE
    ====================================================== */

    onResize(){

        this.modules.forEach(module=>{

            if(

                typeof module.resize === "function"

            ){

                module.resize();

            }

        });

    },

    /* ======================================================
                        SCROLL
    ====================================================== */

    onScroll(){

        this.modules.forEach(module=>{

            if(

                typeof module.scroll === "function"

            ){

                module.scroll();

            }

        });

    },

    /* ======================================================
                        TAB
    ====================================================== */

    onVisibility(){

        if(

            document.hidden

        ){

            this.modules.forEach(module=>{

                if(

                    typeof module.pause === "function"

                ){

                    module.pause();

                }

            });

        }

        else{

            this.modules.forEach(module=>{

                if(

                    typeof module.resume === "function"

                ){

                    module.resume();

                }

            });

        }

    },

    /* ======================================================
                        ONLINE
    ====================================================== */

    onOnline(){

        console.log(

            "Conexão restaurada."

        );

    },

    /* ======================================================
                        OFFLINE
    ====================================================== */

    onOffline(){

        console.warn(

            "Sem conexão."

        );

    },

    /* ======================================================
                        SHORTCUTS
    ====================================================== */

    onKeyDown(event){

        switch(event.key){

            case "F5":

                console.log(

                    "Atualizando..."

                );

                break;

        }

    },

/* ==========================================================
                    MODULE MANAGER
========================================================== */

    /* ======================================================
                        REFRESH
    ====================================================== */

    refresh(){

        this.modules.forEach(module=>{

            if(

                module &&

                typeof module.refresh === "function"

            ){

                module.refresh();

            }

        });

    },

    /* ======================================================
                        RESTART
    ====================================================== */

    restart(){

        this.destroy();

        AppState.initialized = false;

        this.init();

    },

    /* ======================================================
                        DESTROY
    ====================================================== */

    destroy(){

        this.modules.forEach(module=>{

            if(

                module &&

                typeof module.destroy === "function"

            ){

                module.destroy();

            }

        });

    },

    /* ======================================================
                        REGISTER
    ====================================================== */

    register(module){

        if(!module) return;

        if(

            this.modules.includes(module)

        ) return;

        this.modules.push(module);

    },

    /* ======================================================
                        REMOVE
    ====================================================== */

    unregister(module){

        this.modules =

            this.modules.filter(

                item=>item!==module

            );

    },

    /* ======================================================
                        FIND
    ====================================================== */

    get(name){

        return this.modules.find(module=>{

            return (

                module &&

                module.constructor &&

                module.constructor.name === name

            );

        });

    },

    /* ======================================================
                        STATUS
    ====================================================== */

    status(){

        return{

            initialized:AppState.initialized,

            loading:AppState.loading,

            modules:this.modules.length,

            version:this.version

        };

    },

/* ==========================================================
                    DEBUG
========================================================== */

    debug:false,

    /* ======================================================
                        INFO
    ====================================================== */

    info(){

        return{

            name:"Monster Kingdom",

            version:this.version,

            modules:this.modules.length,

            initialized:AppState.initialized,

            loading:AppState.loading,

            online:navigator.onLine,

            language:navigator.language,

            platform:navigator.platform,

            userAgent:navigator.userAgent

        };

    },

    /* ======================================================
                        DEBUG
    ====================================================== */

    enableDebug(){

        this.debug = true;

        console.log(

            "Debug ativado."

        );

    },

    disableDebug(){

        this.debug = false;

    },

    /* ======================================================
                        LOG
    ====================================================== */

    log(...message){

        if(!this.debug) return;

        console.log(

            "[APP]",

            ...message

        );

    },

    /* ======================================================
                        ERROR
    ====================================================== */

    handleError(error){

        console.error(

            "[APP ERROR]",

            error

        );

    },

    /* ======================================================
                        GLOBAL ERRORS
    ====================================================== */

    bindErrors(){

        window.addEventListener(

            "error",

            event=>{

                this.handleError(

                    event.error ||

                    event.message

                );

            }

        );

        window.addEventListener(

            "unhandledrejection",

            event=>{

                this.handleError(

                    event.reason

                );

            }

        );

    }

};

/* ==========================================================
                    START
========================================================== */

domReady(()=>{

    App.init();

});

/* ==========================================================
                    GLOBAL
========================================================== */

window.App = App;
window.AppState = AppState;


/* ==========================================================
                    END
========================================================== */