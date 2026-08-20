(() => {
    'use strict';

    const ASSET_PATH = MONSTER_ROOT + 'assets/wiki/logos/';
    const GAME_URL = 'Corvos Cinzentos/wiki-game-normal.html';

    // Os itens abaixo são apenas visuais: não são botões e não são interativos.
    // Para trocar um logo, substitua o arquivo correspondente em assets/wiki/logos/.
    const chronologicalGames = [
        { key: 'origins',   label: 'Kingdom Rush Origins',       short: 'Origins',     file: 'Kingdom Rush Origins.png' },
        { key: 'kingdom',   label: 'Kingdom Rush',               short: 'Kingdom Rush', file: 'Kingdom Rush Logo.png' },
        { key: 'frontiers', label: 'Kingdom Rush Frontiers',     short: 'Frontiers',   file: 'Kingdom Rush Fronties.png' },
        { key: 'vengeance', label: 'Kingdom Rush Vengeance',     short: 'Vengeance',   file: 'Kingdom Rush Vengeance.png' },
        { key: 'alliance',  label: 'Kingdom Rush 5: Alliance',  short: 'Alliance',    file: 'Kingdom Rush 5 Alliance.png' },
        { key: 'genesis',   label: 'Kingdom Rush 6: Genesis',    short: 'Genesis',     file: 'Kingdom Rush 6 Genesis.png' },
        { key: 'legends',   label: 'Legends of Kingdom Rush',    short: 'Legends',     file: 'Legends of Kingdom Rush.png', branch: true }
    ];

    const releaseGames = [
        { key: 'kingdom',   label: 'Kingdom Rush',               short: 'Kingdom Rush', file: 'Kingdom Rush Logo.png',               date: '19/12/2011' },
        { key: 'frontiers', label: 'Kingdom Rush Frontiers',     short: 'Frontiers',    file: 'Kingdom Rush Fronties.png',     date: '06/06/2013' },
        { key: 'origins',   label: 'Kingdom Rush Origins',       short: 'Origins',      file: 'Kingdom Rush Origins.png',       date: '20/11/2014' },
        { key: 'vengeance', label: 'Kingdom Rush Vengeance',     short: 'Vengeance',    file: 'Kingdom Rush Vengeance.png',     date: '22/11/2018' },
        { key: 'legends',   label: 'Legends of Kingdom Rush',    short: 'Legends',      file: 'Legends of Kingdom Rush.png',    date: '11/06/2021' },
        { key: 'alliance',  label: 'Kingdom Rush 5: Alliance',  short: 'Alliance',     file: 'Kingdom Rush 5 Alliance.png',      date: '25/07/2024' },
        { key: 'battles',   label: 'Kingdom Rush Battles',       short: 'Battles',      file: 'Kingdom Rush Battles.png',       date: '09/10/2025' },
        { key: 'genesis',   label: 'Kingdom Rush 6: Genesis',    short: 'Genesis',      file: 'Kingdom Rush 6 Genesis.png',       date: '24/09/2026' }
    ];

    function createImageVisual(game) {
        const visual = document.createElement('div');
        visual.className = 'order-visual';

        const img = document.createElement('img');
        img.src = ASSET_PATH + game.file;
        img.alt = game.label;
        img.loading = 'lazy';
        img.decoding = 'async';

        const fallback = document.createElement('span');
        fallback.className = 'order-fallback';
        fallback.textContent = game.short;
        fallback.hidden = true;

        const showFallback = () => {
            img.hidden = true;
            fallback.hidden = false;
            visual.classList.add('asset-missing');
        };

        img.addEventListener('error', showFallback, { once: true });
        if (img.complete && img.naturalWidth === 0) showFallback();

        visual.append(img, fallback);
        return visual;
    }

    function makeOrderItem(game, type) {
        const item = document.createElement('div');
        item.className = `order-game ${type === 'chronological' ? 'chronological-item' : 'release-item'} ${game.branch ? 'branch-item' : ''}`;
        item.dataset.game = game.key;
        item.title = game.label;
        item.setAttribute('aria-label', game.label);
        item.setAttribute('role', 'img');

        item.appendChild(createImageVisual(game));

        const caption = document.createElement('small');
        caption.innerHTML = game.date
            ? `<strong>${game.short}</strong><span class="release-date">${game.date}</span>`
            : `<strong>${game.short}</strong>`;
        item.appendChild(caption);

        return item;
    }

    function renderOrder(id, games, type) {
        const target = document.getElementById(id);
        if (!target) return;
        target.replaceChildren(...games.map(game => makeOrderItem(game, type)));
    }

    renderOrder('chronological-order', chronologicalGames, 'chronological');
    renderOrder('release-order', releaseGames, 'release');

    const filterButtons = document.querySelectorAll('.wiki-filter-btn');
    const gameCards = document.querySelectorAll('.wiki-game-tile');

    filterButtons.forEach(button => {
        button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';

            filterButtons.forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-selected', active ? 'true' : 'false');
            });

            gameCards.forEach(card => {
                const visible = filter === 'all' || card.dataset.status === filter;
                card.hidden = !visible;
                if (visible && typeof card.animate === 'function') {
                    card.animate([
                        { opacity: .3, transform: 'translateY(10px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ], { duration: 280, easing: 'ease-out' });
                }
            });
        });
    });

    document.querySelectorAll('.wiki-game-logo img.game-logo').forEach(image => {
        const markMissing = () => {
            image.hidden = true;
            image.closest('.wiki-game-logo')?.classList.add('asset-missing');
        };
        image.addEventListener('error', markMissing, { once: true });
        if (image.complete && image.naturalWidth === 0) markMissing();
    });
})();
