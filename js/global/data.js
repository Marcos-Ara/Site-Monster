/* ==========================================================
                    DATABASE
========================================================== */

"use strict";

/* ==========================================================
                    CHANNEL
========================================================== */

const CHANNEL = Object.freeze({

    name: "Monster",

    slogan: "Kingdom Rush • Estratégia • Gameplay",

    description:

        "Canal dedicado à franquia Kingdom Rush e outros jogos de estratégia.",

    youtube: "",

    twitch: "",

    discord: "",

    instagram: "",

    github: "https://github.com/Marcos-Ara",

    avatar: MONSTER_ROOT + "assets/images/avatar.webp",

    banner: MONSTER_ROOT + "assets/images/banner.webp"

});

/* ==========================================================
                    SOCIAL
========================================================== */

const SOCIAL_LINKS = Object.freeze({

    youtube: CHANNEL.youtube,

    twitch: CHANNEL.twitch,

    discord: CHANNEL.discord,

    instagram: CHANNEL.instagram,

    github: CHANNEL.github

});

/* ==========================================================
                    GAMES
========================================================== */

const GAMES = [

    {

        id:1,

        name:"Kingdom Rush",

        slug:"kingdom-rush"

    },

    {

        id:2,

        name:"Kingdom Rush Frontiers",

        slug:"frontiers"

    },

    {

        id:3,

        name:"Kingdom Rush Origins",

        slug:"origins"

    },

    {

        id:4,

        name:"Kingdom Rush Vengeance",

        slug:"vengeance"

    },

    {

        id:5,

        name:"Kingdom Rush Alliance",

        slug:"alliance"

    }

];

/* ==========================================================
                    PLAYLISTS
========================================================== */

const PLAYLISTS = [

    {

        id:1,

        game:1,

        title:"Kingdom Rush"

    },

    {

        id:2,

        game:2,

        title:"Frontiers"

    },

    {

        id:3,

        game:3,

        title:"Origins"

    },

    {

        id:4,

        game:4,

        title:"Vengeance"

    },

    {

        id:5,

        game:5,

        title:"Alliance"

    }

];

/* ==========================================================
                    VIDEOS
========================================================== */

const VIDEOS = [

    {

        id:1,

        game:1,

        playlist:1,

        title:"Southport | Veteran",

        description:"Primeira fase da campanha de Kingdom Rush.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/southport.webp",

        duration:"12:43",

        difficulty:"Veteran",

        map:"Southport",

        featured:true,

        latest:true,

        views:"",

        date:"",

        category:"Gameplay"

    },

    {

        id:2,

        game:1,

        playlist:1,

        title:"The Farmlands | Veteran",

        description:"Gameplay completo da fase The Farmlands.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/the-farmlands.webp",

        duration:"14:18",

        difficulty:"Veteran",

        map:"The Farmlands",

        featured:false,

        latest:true,

        views:"",

        date:"",

        category:"Gameplay"

    },

    {

        id:3,

        game:1,

        playlist:1,

        title:"Pagras | Veteran",

        description:"Estratégia completa para finalizar Pagras.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/pagras.webp",

        duration:"15:05",

        difficulty:"Veteran",

        map:"Pagras",

        featured:false,

        latest:true,

        views:"",

        date:"",

        category:"Gameplay"

    },

    {

        id:4,

        game:2,

        playlist:2,

        title:"Hammerhold | Veteran",

        description:"Gameplay da campanha Frontiers.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/hammerhold.webp",

        duration:"18:42",

        difficulty:"Veteran",

        map:"Hammerhold",

        featured:false,

        latest:false,

        views:"",

        date:"",

        category:"Gameplay"

    },

    {

        id:5,

        game:3,

        playlist:3,

        title:"Origins | Veteran",

        description:"Campanha completa de Origins.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/origins.webp",

        duration:"20:17",

        difficulty:"Veteran",

        map:"Origins",

        featured:false,

        latest:false,

        views:"",

        date:"",

        category:"Gameplay"

    }

];

/* ==========================================================
                    HOME
========================================================== */

const HOME = {

    featured(){

        return VIDEOS.find(

            video => video.featured

        );

    },

    latest(limit = 6){

        return VIDEOS

            .filter(video => video.latest)

            .slice(0, limit);

    }

};

/* ==========================================================
                    FILTERS
========================================================== */

const FILTER = {

    byGame(id){

        return VIDEOS.filter(

            video => video.game === id

        );

    },

    byPlaylist(id){

        return VIDEOS.filter(

            video => video.playlist === id

        );

    },

    byDifficulty(level){

        return VIDEOS.filter(

            video =>

                video.difficulty === level

        );

    }

};

/* ==========================================================
                    KINGDOM MAP
========================================================== */

const KINGDOM_MAP = {

    image: MONSTER_ROOT + "assets/images/maps/kingdom-rush.webp",

    width: 1920,

    height: 1080

};

/* ==========================================================
                    KINGDOM PHASES
========================================================== */

const PHASES = [

    {

        id:1,

        game:1,

        video:1,

        name:"Southport",

        slug:"southport",

        x:18.2,

        y:77.6,

        difficulty:"Veteran",

        completed:true,

        unlocked:true,

        stars:3,

        thumbnail:MONSTER_ROOT + "assets/thumbs/southport.webp"

    },

    {

        id:2,

        game:1,

        video:2,

        name:"The Farmlands",

        slug:"the-farmlands",

        x:28.4,

        y:69.2,

        difficulty:"Veteran",

        completed:true,

        unlocked:true,

        stars:3,

        thumbnail:MONSTER_ROOT + "assets/thumbs/the-farmlands.webp"

    },

    {

        id:3,

        game:1,

        video:3,

        name:"Pagras",

        slug:"pagras",

        x:40.1,

        y:63.4,

        difficulty:"Veteran",

        completed:true,

        unlocked:true,

        stars:3,

        thumbnail:MONSTER_ROOT + "assets/thumbs/pagras.webp"

    },

    {

        id:4,

        game:1,

        video:null,

        name:"Twin Rivers",

        slug:"twin-rivers",

        x:52.8,

        y:58.7,

        difficulty:"Veteran",

        completed:false,

        unlocked:true,

        stars:0,

        thumbnail:MONSTER_ROOT + "assets/thumbs/default.webp"

    },

    {

        id:5,

        game:1,

        video:null,

        name:"Silveroak Forest",

        slug:"silveroak-forest",

        x:63.7,

        y:49.3,

        difficulty:"Veteran",

        completed:false,

        unlocked:false,

        stars:0,

        thumbnail:MONSTER_ROOT + "assets/thumbs/default.webp"

    }

];

/* ==========================================================
                    MAP HELPERS
========================================================== */

const MAP = {

    all(){

        return PHASES;

    },

    completed(){

        return PHASES.filter(

            phase => phase.completed

        );

    },

    unlocked(){

        return PHASES.filter(

            phase => phase.unlocked

        );

    },

    locked(){

        return PHASES.filter(

            phase => !phase.unlocked

        );

    },

    byGame(id){

        return PHASES.filter(

            phase => phase.game === id

        );

    },

    byId(id){

        return PHASES.find(

            phase => phase.id === id

        );

    },

    byVideo(videoId){

        return PHASES.find(

            phase => phase.video === videoId

        );

    }

};

/* ==========================================================
                    JUX SERIES
========================================================== */

const JUX = {

    title: "JUX",

    description:

        "Série especial do canal com gameplays, desafios e conteúdos exclusivos.",

    banner: MONSTER_ROOT + "assets/images/jux/banner.webp",

    logo: MONSTER_ROOT + "assets/images/jux/logo.webp"

};

/* ==========================================================
                    JUX EPISODES
========================================================== */

const JUX_EPISODES = [

    {

        id:1,

        season:1,

        episode:1,

        title:"O Início da Jornada",

        description:"Primeiro episódio da série JUX.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/jux/ep01.webp",

        duration:"18:24",

        featured:true,

        released:true

    },

    {

        id:2,

        season:1,

        episode:2,

        title:"Construindo a Estratégia",

        description:"Novas estratégias e desafios.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/jux/ep02.webp",

        duration:"20:31",

        featured:false,

        released:true

    },

    {

        id:3,

        season:1,

        episode:3,

        title:"Chefes e Batalhas",

        description:"Enfrentando os primeiros chefes.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/jux/ep03.webp",

        duration:"21:42",

        featured:false,

        released:true

    },

    {

        id:4,

        season:1,

        episode:4,

        title:"Segredos do Reino",

        description:"Explorando mapas escondidos.",

        youtube:"",

        thumbnail:MONSTER_ROOT + "assets/thumbs/jux/ep04.webp",

        duration:"19:08",

        featured:false,

        released:false

    }

];

/* ==========================================================
                    JUX HELPERS
========================================================== */

const JUX_DATA = {

    featured(){

        return JUX_EPISODES.find(

            episode => episode.featured

        );

    },

    latest(limit = 6){

        return JUX_EPISODES

            .filter(

                episode => episode.released

            )

            .slice(0, limit);

    },

    bySeason(season){

        return JUX_EPISODES.filter(

            episode =>

                episode.season === season

        );

    },

    byId(id){

        return JUX_EPISODES.find(

            episode => episode.id === id

        );

    }

};

/* ==========================================================
                    CHANNEL STATS
========================================================== */

const STATS = {

    subscribers: "0",

    videos: VIDEOS.length +

            JUX_EPISODES.length,

    kingdoms: PHASES.length,

    playlists: PLAYLISTS.length

};

/* ==========================================================
                    SEARCH
========================================================== */

const SEARCH = {

    /* ===============================================
                    VIDEOS
    =============================================== */

    videos(text){

        if(!text) return VIDEOS;

        const value = text.toLowerCase();

        return VIDEOS.filter(video =>

            video.title.toLowerCase().includes(value) ||

            video.description.toLowerCase().includes(value) ||

            video.category.toLowerCase().includes(value)

        );

    },

    /* ===============================================
                    PHASES
    =============================================== */

    phases(text){

        if(!text) return PHASES;

        const value = text.toLowerCase();

        return PHASES.filter(phase =>

            phase.name.toLowerCase().includes(value)

        );

    },

    /* ===============================================
                    JUX
    =============================================== */

    episodes(text){

        if(!text) return JUX_EPISODES;

        const value = text.toLowerCase();

        return JUX_EPISODES.filter(episode =>

            episode.title.toLowerCase().includes(value) ||

            episode.description.toLowerCase().includes(value)

        );

    }

};

/* ==========================================================
                    SORT
========================================================== */

const SORT = {

    newest(list){

        return [...list].sort((a,b)=>b.id-a.id);

    },

    oldest(list){

        return [...list].sort((a,b)=>a.id-b.id);

    },

    alphabetical(list){

        return [...list].sort((a,b)=>

            a.title.localeCompare(b.title)

        );

    }

};

/* ==========================================================
                    FIND
========================================================== */

const FIND = {

    video(id){

        return VIDEOS.find(

            video => video.id === id

        );

    },

    phase(id){

        return PHASES.find(

            phase => phase.id === id

        );

    },

    episode(id){

        return JUX_EPISODES.find(

            episode => episode.id === id

        );

    }

};

/* ==========================================================
                    STATS
========================================================== */

const DATABASE = {

    totalVideos(){

        return VIDEOS.length;

    },

    totalPhases(){

        return PHASES.length;

    },

    totalEpisodes(){

        return JUX_EPISODES.length;

    },

    totalGames(){

        return GAMES.length;

    }

};

/* ==========================================================
                    RECENT
========================================================== */

const RECENT = {

    videos(limit = 6){

        return SORT.newest(VIDEOS)

            .slice(0,limit);

    },

    episodes(limit = 6){

        return SORT.newest(JUX_EPISODES)

            .slice(0,limit);

    }

};

/* ==========================================================
                    FEATURED
========================================================== */

const FEATURED = {

    video(){

        return VIDEOS.find(

            video => video.featured

        );

    },

    episode(){

        return JUX_EPISODES.find(

            episode => episode.featured

        );

    }

};

/* ==========================================================
                    FREEZE DATABASE
========================================================== */

Object.freeze(CHANNEL);

Object.freeze(SOCIAL_LINKS);

Object.freeze(GAMES);

Object.freeze(PLAYLISTS);

Object.freeze(VIDEOS);

Object.freeze(PHASES);

Object.freeze(JUX);

Object.freeze(JUX_EPISODES);

Object.freeze(STATS);

/* ==========================================================
                    DATABASE
========================================================== */

const Database = {

    version: "1.0.0",

    build: "Release",

    author: "Monster",

    channel: CHANNEL,

    socials: SOCIAL_LINKS,

    games: GAMES,

    playlists: PLAYLISTS,

    videos: VIDEOS,

    phases: PHASES,

    jux: JUX,

    episodes: JUX_EPISODES,

    stats: STATS,

    home: HOME,

    map: MAP,

    filter: FILTER,

    search: SEARCH,

    sort: SORT,

    find: FIND,

    recent: RECENT,

    featured: FEATURED,

    database: DATABASE

};

/* ==========================================================
                    EXPORT
========================================================== */

// Fresh script revisions are used by the HTML files, so these exports are
// intentionally simple and do not mutate a previous cached Database object.
window.Database = Database;
window.CHANNEL = CHANNEL;
window.VIDEOS = VIDEOS;
window.PHASES = PHASES;
window.JUX = JUX;
window.JUX_EPISODES = JUX_EPISODES;


/* ==========================================================
                    READY
========================================================== */

log("Database carregado.");

log(

    `Vídeos: ${VIDEOS.length}`,

    `Fases: ${PHASES.length}`,

    `Episódios: ${JUX_EPISODES.length}`

);

/* ==========================================================
                    TESTS
========================================================== */

if(DEBUG.enabled){

    console.table(VIDEOS);

    console.table(PHASES);

    console.table(JUX_EPISODES);

}

