/* ==========================================================
                    HOME
========================================================== */

"use strict";

const Home = {

    name:"Home",

    initialized:false,

    hero:null,

    featuredVideo:null,

    latestVideos:[],

    subscribeButton:null,

    youtubeButton:null,

    twitchButton:null,

    /* ======================================================
                        INIT
    ====================================================== */

    init(){

        if(this.initialized) return;

        if(!this.isHome()) return;

        this.cache();

        this.bindEvents();

        this.load();

        this.initialized = true;

        console.log("Home iniciada.");

    },

    /* ======================================================
                        PAGE
    ====================================================== */

    isHome(){

        return document.body.dataset.page === "home";

    },

    /* ======================================================
                        CACHE
    ====================================================== */

    cache(){

        this.hero = $(".hero");

        this.featuredVideo = $("#featured-video");

        this.latestVideos = $$(".video-card");

        this.subscribeButton = $("#subscribe-button");

        this.youtubeButton = $("#youtube-button");

        this.twitchButton = $("#twitch-button");

    },


    /* ======================================================
                        EVENTS
    ====================================================== */

    bindEvents(){

        this.bindButtons();

        this.bindCards();

        this.bindKeyboard();

    },

    /* ======================================================
                        BUTTONS
    ====================================================== */

    bindButtons(){

        if(this.subscribeButton){

            on(

                this.subscribeButton,

                EVENTS.click,

                ()=>{

                    this.subscribe();

                }

            );

        }

        if(this.youtubeButton){

            on(

                this.youtubeButton,

                EVENTS.click,

                ()=>{

                    this.openYoutube();

                }

            );

        }

        if(this.twitchButton){

            on(

                this.twitchButton,

                EVENTS.click,

                ()=>{

                    this.openTwitch();

                }

            );

        }

    },

    /* ======================================================
                        CARDS
    ====================================================== */

    bindCards(){

        this.latestVideos.forEach(card=>{

            on(

                card,

                "mouseenter",

                ()=>{

                    this.cardEnter(card);

                }

            );

            on(

                card,

                "mouseleave",

                ()=>{

                    this.cardLeave(card);

                }

            );

            on(

                card,

                EVENTS.click,

                ()=>{

                    this.openVideo(card);

                }

            );

        });

    },

    /* ======================================================
                        KEYBOARD
    ====================================================== */

    bindKeyboard(){

        document.addEventListener(

            "keydown",

            event=>{

                if(event.key === "Enter"){

                    const active =

                        document.activeElement;

                    if(

                        active &&

                        active.classList.contains(

                            "video-card"

                        )

                    ){

                        this.openVideo(active);

                    }

                }

            }

        );

    },

    /* ======================================================
                        YOUTUBE
    ====================================================== */

    youtubeChannel:

        "https://www.youtube.com/@Monster",

    youtubeSubscribe:

        "https://www.youtube.com/@Monster?sub_confirmation=1",

    /* ======================================================
                        OPEN CHANNEL
    ====================================================== */

    openYoutube(){

        window.open(

            this.youtubeChannel,

            "_blank",

            "noopener,noreferrer"

        );

    },

    /* ======================================================
                        SUBSCRIBE
    ====================================================== */

    subscribe(){

        window.open(

            this.youtubeSubscribe,

            "_blank",

            "noopener,noreferrer"

        );

    },

    /* ======================================================
                        EMBED
    ====================================================== */

    loadYoutubeVideo(videoId){

        if(

            !this.featuredVideo

        ) return;

        this.featuredVideo.innerHTML = `

            <iframe

                src="https://www.youtube.com/embed/${videoId}"

                title="Featured Video"

                allowfullscreen

                loading="lazy"

                referrerpolicy="strict-origin-when-cross-origin">

            </iframe>

        `;

    },

    /* ======================================================
                        CHANGE VIDEO
    ====================================================== */

    changeFeaturedVideo(card){

        const id =

            card.dataset.youtube;

        if(!id) return;

        this.loadYoutubeVideo(id);

    },

    /* ======================================================
                        TWITCH
    ====================================================== */

    twitchChannel:

        "Monster",

    twitchUrl:

        "https://www.twitch.tv/Monster",

    twitchPlayer:null,

    /* ======================================================
                        OPEN
    ====================================================== */

    openTwitch(){

        window.open(

            this.twitchUrl,

            "_blank",

            "noopener,noreferrer"

        );

    },

    /* ======================================================
                        LOAD PLAYER
    ====================================================== */

    loadTwitchPlayer(){

        this.twitchPlayer =

            $("#twitch-player");

        if(

            !this.twitchPlayer

        ) return;

        this.twitchPlayer.innerHTML =

        `

        <iframe

            src="https://player.twitch.tv/?channel=${this.twitchChannel}&parent=${location.hostname}"

            allowfullscreen

            scrolling="no"

            frameborder="0">

        </iframe>

        `;

    },

    /* ======================================================
                        CHAT
    ====================================================== */

    loadTwitchChat(){

        const chat =

            $("#twitch-chat");

        if(!chat) return;

        chat.innerHTML =

        `

        <iframe

            src="https://www.twitch.tv/embed/${this.twitchChannel}/chat?parent=${location.hostname}"

            frameborder="0">

        </iframe>

        `;

    },

    /* ======================================================
                        TWITCH INIT
    ====================================================== */

    initTwitch(){

        this.loadTwitchPlayer();

        this.loadTwitchChat();

    },

/* ==========================================================
                    VIDEO DATA
========================================================== */

    videos:[

        {

            title:"Kingdom Rush Origins #01",

            thumbnail:"assets/img/thumbs/origins01.webp",

            youtube:"abc123",

            duration:"32:15",

            category:"Origins"

        },

        {

            title:"Kingdom Rush Frontiers #12",

            thumbnail:"assets/img/thumbs/frontiers12.webp",

            youtube:"def456",

            duration:"28:41",

            category:"Frontiers"

        },

        {

            title:"Kingdom Rush Alliance #05",

            thumbnail:"assets/img/thumbs/alliance05.webp",

            youtube:"ghi789",

            duration:"41:52",

            category:"Alliance"

        }

    ],

    /* ======================================================
                    RENDER VIDEOS
    ====================================================== */

    renderVideos(){

        const container =

            $("#latest-videos");

        if(!container) return;

        container.innerHTML = "";

        this.videos.forEach(video=>{

            container.appendChild(

                this.createCard(video)

            );

        });

        this.latestVideos =

            $$(".video-card");

        this.bindCards();

    },

    /* ======================================================
                    CREATE CARD
    ====================================================== */

    createCard(video){

        const card =

            document.createElement("article");

        card.className =

            "video-card";

        card.tabIndex = 0;

        card.dataset.youtube =

            video.youtube;

        card.innerHTML = `

            <div class="video-thumb">

                <img

                    src="${video.thumbnail}"

                    alt="${video.title}"

                    loading="lazy">

                <span class="duration">

                    ${video.duration}

                </span>

            </div>

            <div class="video-info">

                <h3>

                    ${video.title}

                </h3>

                <span>

                    ${video.category}

                </span>

            </div>

        `;

        return card;

    },

/* ==========================================================
                    HERO
========================================================== */

    heroTitle:null,

    heroDescription:null,

    heroBackground:null,

    heroCategory:null,

    heroButton:null,

    /* ======================================================
                        CACHE HERO
    ====================================================== */

    cacheHero(){

        this.heroTitle =

            $("#hero-title");

        this.heroDescription =

            $("#hero-description");

        this.heroBackground =

            $("#hero-background");

        this.heroCategory =

            $("#hero-category");

        this.heroButton =

            $("#hero-watch");

    },

    /* ======================================================
                        LOAD HERO
    ====================================================== */

    loadHero(){

        this.cacheHero();

        if(

            !this.videos.length

        ) return;

        this.updateHero(

            this.videos[0]

        );

    },

    /* ======================================================
                        UPDATE HERO
    ====================================================== */

    updateHero(video){

        if(!video) return;

        if(this.heroTitle){

            this.heroTitle.textContent =

                video.title;

        }

        if(this.heroDescription){

            this.heroDescription.textContent =

                video.description ||

                "Assista ao mais novo vídeo do canal.";

        }

        if(this.heroCategory){

            this.heroCategory.textContent =

                video.category;

        }

        if(this.heroBackground){

            this.heroBackground.style.backgroundImage =

                `url(${video.thumbnail})`;

        }

        if(this.heroButton){

            this.heroButton.dataset.youtube =

                video.youtube;

        }

        this.animateHero();

    },

    /* ======================================================
                        HERO EFFECT
    ====================================================== */

    animateHero(){

        if(!this.hero) return;

        this.hero.classList.remove(

            "hero-show"

        );

        requestAnimationFrame(()=>{

            this.hero.classList.add(

                "hero-show"

            );

        });

    },

/* ==========================================================
                FEATURED VIDEO
========================================================== */

featuredIframe: null,

featuredTitle: null,

featuredCategory: null,

featuredDuration: null,

featuredLoading: false,

/* ======================================================
                    CACHE
====================================================== */

cacheFeatured(){

    this.featuredIframe =

        $("#featured-video");

    this.featuredTitle =

        $("#featured-title");

    this.featuredCategory =

        $("#featured-category");

    this.featuredDuration =

        $("#featured-duration");

},

/* ======================================================
                    LOAD
====================================================== */

loadFeatured(){

    this.cacheFeatured();

    if(!this.videos.length) return;

    this.showFeatured(

        this.videos[0]

    );

},

/* ======================================================
                    SHOW
====================================================== */

showFeatured(video){

    if(!video) return;

    this.featuredLoading = true;

    this.featuredIframe.innerHTML = `

    <iframe

        src="https://www.youtube.com/embed/${video.youtube}?autoplay=1&rel=0"

        allowfullscreen

        loading="lazy"

        allow="autoplay"

        referrerpolicy="strict-origin-when-cross-origin">

    </iframe>

    `;

    if(this.featuredTitle){

        this.featuredTitle.textContent =

            video.title;

    }

    if(this.featuredCategory){

        this.featuredCategory.textContent =

            video.category;

    }

    if(this.featuredDuration){

        this.featuredDuration.textContent =

            video.duration;

    }

    this.featuredLoading = false;

},

/* ======================================================
                    CHANGE
====================================================== */

changeFeaturedVideo(card){

    const id =

        card.dataset.youtube;

    if(!id) return;

    const video =

        this.videos.find(

            item=>item.youtube===id

        );

    if(!video) return;

    this.updateHero(video);

    this.showFeatured(video);

},

/* ======================================================
                    SHARE
====================================================== */

shareFeatured(){

    if(!navigator.share) return;

    const iframe =

        this.featuredIframe.querySelector("iframe");

    if(!iframe) return;

    navigator.share({

        title:"Monster",

        url:iframe.src

    });

},

/* ======================================================
                    COPY
====================================================== */

copyFeatured(){

    const iframe =

        this.featuredIframe.querySelector("iframe");

    if(!iframe) return;

    navigator.clipboard.writeText(

        iframe.src

    );

},

/* ======================================================
                    LIKE
====================================================== */

likeFeatured(){

    window.open(

        this.youtubeChannel,

        "_blank",

        "noopener"

    );

},

/* ==========================================================
                    LATEST VIDEOS
========================================================== */

latestContainer:null,

latestLimit:8,

filteredVideos:[],

/* ======================================================
                    CACHE
====================================================== */

cacheLatest(){

    this.latestContainer =

        $("#latest-videos");

},

/* ======================================================
                    LOAD
====================================================== */

loadLatest(){

    this.cacheLatest();

    if(!this.latestContainer) return;

    this.filteredVideos =

        [...this.videos];

    this.renderLatest();

},

/* ======================================================
                    RENDER
====================================================== */

renderLatest(){

    this.latestContainer.innerHTML = "";

    this.filteredVideos

    .slice(0,this.latestLimit)

    .forEach(video=>{

        this.latestContainer.appendChild(

            this.createLatestCard(video)

        );

    });

},

/* ======================================================
                    CARD
====================================================== */

createLatestCard(video){

    const card =

        document.createElement("article");

    card.className =

        "latest-card";

    card.dataset.youtube =

        video.youtube;

    card.tabIndex = 0;

    card.innerHTML = `

        <img

            src="${video.thumbnail}"

            alt="${video.title}"

            loading="lazy">

        <div class="latest-content">

            <h3>

                ${video.title}

            </h3>

            <p>

                ${video.category}

            </p>

            <span>

                ${video.duration}

            </span>

        </div>

    `;

    on(

        card,

        EVENTS.click,

        ()=>{

            this.changeFeaturedVideo(card);

        }

    );

    return card;

},

/* ==========================================================
                    LATEST VIDEOS
========================================================== */

latestContainer:null,

latestLimit:8,

filteredVideos:[],

/* ======================================================
                    CACHE
====================================================== */

cacheLatest(){

    this.latestContainer =

        $("#latest-videos");

},

/* ======================================================
                    LOAD
====================================================== */

loadLatest(){

    this.cacheLatest();

    if(!this.latestContainer) return;

    this.filteredVideos =

        [...this.videos];

    this.renderLatest();

},

/* ======================================================
                    RENDER
====================================================== */

renderLatest(){

    this.latestContainer.innerHTML = "";

    this.filteredVideos

    .slice(0,this.latestLimit)

    .forEach(video=>{

        this.latestContainer.appendChild(

            this.createLatestCard(video)

        );

    });

},

/* ======================================================
                    CARD
====================================================== */

createLatestCard(video){

    const card =

        document.createElement("article");

    card.className =

        "latest-card";

    card.dataset.youtube =

        video.youtube;

    card.tabIndex = 0;

    card.innerHTML = `

        <img

            src="${video.thumbnail}"

            alt="${video.title}"

            loading="lazy">

        <div class="latest-content">

            <h3>

                ${video.title}

            </h3>

            <p>

                ${video.category}

            </p>

            <span>

                ${video.duration}

            </span>

        </div>

    `;

    on(

        card,

        EVENTS.click,

        ()=>{

            this.changeFeaturedVideo(card);

        }

    );

    return card;

},

/* ==========================================================
                    MODULE API
========================================================== */

    /* ======================================================
                        REFRESH
    ====================================================== */

    refresh(){

        if(

            !this.isHome()

        ) return;

        this.cache();

        this.renderVideos();

        this.loadLatest();

        this.loadFeatured();

    },

    /* ======================================================
                        RESIZE
    ====================================================== */

    resize(){

        if(!this.isHome()) return;

    },

    /* ======================================================
                        SCROLL
    ====================================================== */

    scroll(){

        if(!this.isHome()) return;

    },

    /* ======================================================
                        PAUSE
    ====================================================== */

    pause(){

        const iframe =

            $("#featured-video iframe");

        if(

            iframe

        ){

            iframe.style.pointerEvents =

                "none";

        }

    },

    /* ======================================================
                        RESUME
    ====================================================== */

    resume(){

        const iframe =

            $("#featured-video iframe");

        if(

            iframe

        ){

            iframe.style.pointerEvents =

                "auto";

        }

    },

    /* ======================================================
                        DESTROY
    ====================================================== */

    destroy(){

        this.latestVideos = [];

        this.filteredVideos = [];

        this.initialized = false;

    },

    /* ======================================================
                        VERSION
    ====================================================== */

    version(){

        return{

            name:"Home",

            version:"1.0.0",

            author:"Monster"

        };

    }

};

/* ==========================================================
                    EXPORT
========================================================== */

window.Home = Home;