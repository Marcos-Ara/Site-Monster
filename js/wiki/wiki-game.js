(() => {
    'use strict';

    const phases = [
        { n: '01', name: 'Corvos cinzentos', group: 'base', contentFolder: 'Corvos%20Cinzentos' },
        { n: '02', name: 'Cruzamento alto', group: 'base', contentFolder: 'Cruzamento%20alto' },
        { n: '03', name: 'Trilha da caichoeira', group: 'base' },
        { n: '04', name: 'Defesa do bosque rubro', group: 'base' },
        { n: '05', name: 'Jardins reais', group: 'base' },
        { n: '06', name: 'Ponto dos grifos', group: 'base' },
        { n: '07', name: 'Pedrahenge', group: 'base' },
        { n: '08', name: 'Grimsburgo', group: 'base' },
        { n: '09', name: 'Lago de cristal', group: 'base' },
        { n: '10', name: 'Nuncavila', group: 'base' },
        { n: '11', name: 'Corte unseelie', group: 'base' },
        { n: '12', name: 'A ascensão', group: 'base' },
        { n: '13', name: 'Terreno arcano', group: 'base' },
        { n: '14', name: 'Retiro dos mactans', group: 'base' },
        { n: '15', name: 'Altar de Elyne', group: 'base' },
        { n: 'Orc I', name: 'Muro de galadrian', group: 'special' },
        { n: 'Orc II', name: 'Pedreira de Sangue', group: 'special' },
        { n: 'Orc III', name: 'Trono do decapitador', group: 'special' },
        { n: 'Vulcão I', name: 'Portôes de Dwaraman', group: 'special' },
        { n: 'Vulcão II', name: 'Poço corrompido', group: 'special' },
        { n: 'Bajnimen I', name: 'Portões do Bosque do Ocaso', group: 'special' },
        { n: 'Bajnimen II', name: 'Arredores de Duredhel', group: 'special' }
    ];

    const list = document.getElementById('phase-list');
    const search = document.getElementById('phase-search');
    const count = document.getElementById('phase-count');
    const filterButtons = document.querySelectorAll('.phase-filter-btn');
    const modal = document.getElementById('phase-modal');
    const modalTitle = document.getElementById('phase-modal-title');
    const modalKicker = document.getElementById('phase-modal-kicker');
    const modalDescription = document.getElementById('phase-modal-description');
    const modalActions = document.getElementById('phase-category-actions');
    const modalDone = document.getElementById('phase-modal-done');
    const modalClose = document.getElementById('phase-modal-close');
    let currentGroup = 'all';
    let lastTrigger = null;

    function phaseDescription(phase) {
        if (phase.contentFolder) {
            return `Você abriu “${phase.name}”. Escolha abaixo a dificuldade que deseja consultar. As páginas Normal, Heróis e Ferreiro estão disponíveis.`;
        }
        const kind = phase.group === 'special' ? 'fase especial' : 'fase de campanha';
        return `Você abriu “${phase.name}”, uma ${kind}. O conteúdo desta fase ainda não possui uma página própria na Wiki.`;
    }

    function openModal(phase, trigger) {
        if (!modal) return;
        lastTrigger = trigger || null;

        modalKicker.textContent = `${phase.n} • ${phase.group === 'special' ? 'ESPECIAL' : 'CAMPANHA'}`;
        modalTitle.textContent = phase.name;
        modalDescription.textContent = phaseDescription(phase);
        modalDescription.hidden = false;

        const hasContent = Boolean(phase.contentFolder);
        if (modalActions) {
            modalActions.hidden = !hasContent;
            modalActions.querySelectorAll('a').forEach((link) => {
                const category = link.dataset.category || 'normal';
                const pageName = category === 'heroi' ? 'wiki-game-heroi.html' : category === 'ferreiro' ? 'wiki-game-ferreiro.html' : 'wiki-game-normal.html';
                link.href = `${phase.contentFolder}/${pageName}`;
                link.tabIndex = hasContent ? 0 : -1;
                link.setAttribute('aria-hidden', hasContent ? 'false' : 'true');
            });
        }
        if (modalDone) modalDone.hidden = false;

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('wiki-modal-open');

        if (hasContent) {
            modalActions?.querySelector('[data-category="normal"]')?.focus();
        } else {
            modalClose?.focus();
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('wiki-modal-open');
        lastTrigger?.focus();
        lastTrigger = null;
    }

    function render() {
        if (!list) return;
        const query = (search?.value || '').trim().toLocaleLowerCase('pt-BR');
        const filtered = phases.filter((phase) => {
            const inGroup = currentGroup === 'all' || phase.group === currentGroup;
            const haystack = `${phase.n} ${phase.name}`.toLocaleLowerCase('pt-BR');
            return inGroup && haystack.includes(query);
        });

        if (!filtered.length) {
            list.innerHTML = '<div class="phase-empty">Nenhuma fase encontrada para essa busca.</div>';
        } else {
            list.innerHTML = filtered.map((phase) => {
                const available = Boolean(phase.contentFolder);
                return `
                <article class="phase-item ${phase.group === 'special' ? 'special' : ''}">
                    <div class="phase-num">${phase.n}</div>
                    <div>
                        <div class="phase-name">${phase.name}</div>
                        <div class="phase-type">${phase.group === 'special' ? 'Fase especial' : 'Campanha'}</div>
                    </div>
                    <button class="phase-open" type="button" data-phase="${phase.n}" aria-label="${available ? `Abrir ${phase.name}` : `Conteúdo de ${phase.name} indisponível`}" ${available ? '' : 'disabled aria-disabled="true"'}>Abrir</button>
                </article>
            `;
            }).join('');
        }

        if (count) {
            count.textContent = `${filtered.length} ${filtered.length === 1 ? 'fase' : 'fases'}`;
        }

        list.querySelectorAll('.phase-open:not(:disabled)').forEach((button) => {
            button.addEventListener('click', () => {
                const phase = phases.find((item) => item.n === button.dataset.phase);
                if (phase && phase.contentFolder) openModal(phase, button);
            });
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentGroup = button.dataset.group || 'all';
            filterButtons.forEach((item) => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            render();
        });
    });

    search?.addEventListener('input', render);
    modalClose?.addEventListener('click', closeModal);
    modalDone?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    const heroImage = document.getElementById('game-hero-logo-image');
    heroImage?.addEventListener('error', () => {
        document.getElementById('game-hero-logo')?.classList.add('asset-missing');
        heroImage.hidden = true;
    }, { once: true });

    // Referências sublinhadas: hover/foco mostra a imagem anexada; clique mantém aberta no toque.
    document.querySelectorAll('.wiki-ref-wrap').forEach((wrap) => {
        const trigger = wrap.querySelector('.wiki-reference');
        if (!trigger) return;
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const wasOpen = wrap.classList.contains('is-open');
            document.querySelectorAll('.wiki-ref-wrap.is-open').forEach((item) => item.classList.remove('is-open'));
            wrap.classList.toggle('is-open', !wasOpen);
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.wiki-ref-wrap')) {
            document.querySelectorAll('.wiki-ref-wrap.is-open').forEach((item) => item.classList.remove('is-open'));
        }
    });

    const lightbox = document.getElementById('wiki-lightbox');
    const lightboxImage = document.getElementById('wiki-lightbox-image');
    let lastImageTrigger = null;

    function openLightbox(trigger) {
        if (!lightbox || !lightboxImage) return;
        const src = trigger?.dataset.lightboxSrc;
        if (!src) return;
        lastImageTrigger = trigger;
        lightboxImage.src = src;
        lightboxImage.alt = trigger.dataset.lightboxAlt || 'Imagem ampliada';
        lightbox.hidden = false;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('wiki-modal-open');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.hidden = true;
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImage) lightboxImage.src = '';
        document.body.classList.remove('wiki-modal-open');
        lastImageTrigger?.focus();
        lastImageTrigger = null;
    }

    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
        trigger.addEventListener('click', () => openLightbox(trigger));
    });
    lightbox?.addEventListener('click', (event) => {
        if (event.target.matches('[data-lightbox-close]')) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (lightbox && !lightbox.hidden) closeLightbox();
            else if (modal && !modal.hidden) closeModal();
        }
    });

    render();
})();
