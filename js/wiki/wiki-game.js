(() => {
    'use strict';

    const phases = [
        {
            n: '01', name: 'Corvos cinzentos', group: 'base', contentFolder: 'Corvos%20Cinzentos',
            description: 'Minha única dúvida é por que a palavra “corvos” existe nesse nome, a não ser que seja o nome do porto onde os barcos chegam? talvez eu nunca saiba...'
        },
        {
            n: '02', name: 'Cruzamento alto', group: 'base', contentFolder: 'Cruzamento%20alto',
            description: 'Ainda estou tentando entender o propósito de uma ponte imensa dessas, por que se fosse para transporte até entenderia... se não tivesse pedaços dominantes de gramado no centro. Afinal de contas do outro lado da ponte ficam aonde estão a maioria dos monstros vem, além de “Bran, o decapitador” que mora la.',
            descriptionHtml: 'Ainda estou tentando entender o propósito de uma ponte imensa dessas, por que se fosse para transporte até entenderia... se não tivesse pedaços dominantes de gramado no centro. Afinal de contas do outro lado da ponte ficam aonde estão a maioria dos monstros vem, além de <strong class="wiki-colored" style="--wiki-color:#696463">“Bran, o decapitador”</strong> que mora la.'
        },
        {
            n: '03', name: 'Trilha da cachoeira', group: 'base', contentFolder: 'Trilha%20da%20cachoeira',
            description: 'Os elfos acharam relevante construir uma ponte minúscula acima de uma das nascentes mas deixaram o resto quieto, o que faria um certo sentido nesse período de guerra onde o jogo se passa mas só até aí! Será que os responsáveis pelas construções apenas entraram em consenso sobre qualquer pessoa ter a capacidade de pular nas pedras?'
        },
        {
            n: '04', name: 'Defesa do bosque rubro', group: 'base', contentFolder: 'Defesa%20do%20bosque%20rubro',
            description: 'Tenho consciência de que tudo pode acontecer em uma guerra, imprevistos e coisas fora do nosso controle, porém já parou para pensar no péssimo trabalho dos Awoks?! Deixaram a floresta ser queimada livremente pelos monstros, liberando novos caminhos para ficar gerenciando.'
        },
        {
            n: '05', name: 'Jardins reais', group: 'base',
            description: 'Isso é um jardim real ou público? tem mais estradas e caminhos abertos do que decoração, parece até um lugar pacífico com livre acesso... espera, como eles definiam o conceito de “propriedade privada”?'
        },
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

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        })[character]);
    }

    function phaseDescription(phase) {
        const description = phase.descriptionHtml || escapeHtml(phase.description || 'Esta fase ainda não recebeu uma descrição própria.');
        const status = phase.contentFolder
            ? 'Escolha abaixo o modo de jogo que deseja consultar: Campanha, Heróico ou Ferrenho.'
            : 'O conteúdo jogável desta fase ainda está bloqueado na Wiki.';
        return `<span>${description}</span><span class="phase-modal-help">${status}</span>`;
    }

    function openModal(phase, trigger) {
        if (!modal) return;
        lastTrigger = trigger || null;

        modalKicker.textContent = `${phase.n} • ${phase.group === 'special' ? 'ESPECIAL' : 'CAMPANHA'}`;
        modalTitle.textContent = phase.name;
        modalDescription.innerHTML = phaseDescription(phase);
        modalDescription.hidden = false;

        const hasContent = Boolean(phase.contentFolder);
        if (modalActions) {
            modalActions.hidden = !hasContent;
            modalActions.querySelectorAll('a').forEach((link) => {
                const category = link.dataset.category || 'campanha';
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
            modalActions?.querySelector('[data-category="campanha"], [data-category="normal"]')?.focus();
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
                    <button class="phase-open ${available ? '' : 'is-preview'}" type="button" data-phase="${phase.n}" aria-label="${available ? `Abrir ${phase.name}` : `Ver detalhes de ${phase.name}; conteúdo indisponível`}">${available ? 'Abrir' : 'Detalhes'}</button>
                </article>
            `;
            }).join('');
        }

        if (count) {
            count.textContent = `${filtered.length} ${filtered.length === 1 ? 'fase' : 'fases'}`;
        }

        list.querySelectorAll('.phase-open').forEach((button) => {
            button.addEventListener('click', () => {
                const phase = phases.find((item) => item.n === button.dataset.phase);
                if (phase) openModal(phase, button);
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

    function attemptNumber(element, fallback) {
        const source = `${element?.dataset.attemptLabel || ''} ${element?.id || ''} ${element?.textContent || ''}`;
        const match = source.match(/(?:tentativa[-\s]*)(\d+)/i);
        return match ? Number(match[1]) : fallback;
    }

    function setupAttemptNavigation() {
        const analysis = document.getElementById('analise');
        const categoryNav = document.querySelector('.wiki-game-category-nav');
        if (!analysis || !categoryNav) return;

        const firstContent = analysis.querySelector('.wiki-step-card, .corvos-step-card, .wiki-balloon-section')
            || analysis.querySelector('.wiki-steps, .corvos-steps');
        const targetSet = [];

        if (firstContent) {
            const explicitTargets = Array.from(analysis.querySelectorAll('[id^="tentativa-"], [data-attempt-label]'));
            const dividerTargets = Array.from(analysis.querySelectorAll('.wiki-attempt-divider'));

            if (explicitTargets.length) {
                if (attemptNumber(explicitTargets[0], 1) > 1) {
                    firstContent.id ||= 'tentativa-1';
                    firstContent.dataset.attemptLabel = 'Tentativa 1';
                    targetSet.push(firstContent);
                }
                explicitTargets.forEach((target, index) => {
                    const number = attemptNumber(target, index + 1);
                    if (!target.id) target.id = `tentativa-${number}`;
                    target.dataset.attemptLabel ||= `Tentativa ${number}`;
                    targetSet.push(target);
                });
            } else if (dividerTargets.length) {
                firstContent.id ||= 'tentativa-1';
                firstContent.dataset.attemptLabel = 'Tentativa 1';
                targetSet.push(firstContent);
                dividerTargets.forEach((target, index) => {
                    const number = attemptNumber(target, index + 2);
                    target.id ||= `tentativa-${number}`;
                    target.dataset.attemptLabel ||= `Tentativa ${number}`;
                    targetSet.push(target);
                });
            } else {
                firstContent.id ||= 'tentativa-1';
                firstContent.dataset.attemptLabel = 'Tentativa 1';
                targetSet.push(firstContent);
            }
        }

        const targets = targetSet.filter((target, index, items) => items.indexOf(target) === index);
        const finalTimePanel = document.querySelector('.corvos-final-time-panel');
        if (finalTimePanel) finalTimePanel.id ||= 'tempos-das-tentativas';

        const nav = document.createElement('nav');
        nav.className = 'wiki-attempt-nav';
        nav.setAttribute('aria-label', 'Navegação da análise');
        nav.innerHTML = `
            <button class="wiki-attempt-toggle" type="button" aria-expanded="false" aria-label="Abrir navegação da análise">
                <span aria-hidden="true">☰</span><b>Conteúdo</b>
            </button>
            <div class="wiki-attempt-stack">
                <div class="wiki-attempt-panel">
                    <strong>CONTEÚDO</strong>
                    <div class="wiki-attempt-links"></div>
                    <div class="wiki-attempt-actions"></div>
                </div>
                <div class="wiki-mode-panel">
                    <strong>MODOS</strong>
                    <div class="wiki-mode-links"></div>
                </div>
            </div>`;

        const links = nav.querySelector('.wiki-attempt-links');
        if (!targets.length) {
            links.innerHTML = '<p class="wiki-attempt-empty">Em preparação</p>';
        }
        targets.forEach((target, index) => {
            const number = attemptNumber(target, index + 1);
            const label = target.dataset.attemptLabel || `Tentativa ${number}`;
            const link = document.createElement('a');
            link.href = `#${target.id}`;
            link.dataset.attemptTarget = target.id;
            link.innerHTML = `<span>${String(number).padStart(2, '0')}</span><b>${escapeHtml(label)}</b>`;
            links.appendChild(link);
        });

        const actions = nav.querySelector('.wiki-attempt-actions');
        actions.innerHTML = `
            <a href="../wiki-game.html#fases"><span aria-hidden="true">←</span><b>Voltar à Wiki de Origins</b></a>
            ${finalTimePanel ? `<a href="#${escapeHtml(finalTimePanel.id)}"><span aria-hidden="true">⏱</span><b>Tempos das tentativas</b></a>` : ''}`;

        const modeLinks = nav.querySelector('.wiki-mode-links');
        categoryNav.querySelectorAll('a').forEach((source) => {
            const active = source.classList.contains('active') || source.getAttribute('aria-current') === 'page';
            source.toggleAttribute('aria-current', active);
            if (active) source.setAttribute('aria-current', 'page');
            const link = document.createElement('a');
            link.href = source.getAttribute('href') || '#';
            link.textContent = source.textContent.trim();
            link.className = active ? 'active' : '';
            if (active) link.setAttribute('aria-current', 'page');
            modeLinks.appendChild(link);
        });

        const toggle = nav.querySelector('.wiki-attempt-toggle');
        const closeNavigation = () => {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir navegação da análise');
        };
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Fechar navegação da análise' : 'Abrir navegação da análise');
        });
        nav.querySelector('.wiki-attempt-stack').addEventListener('click', (event) => {
            if (!event.target.closest('a')) return;
            closeNavigation();
        });
        document.addEventListener('click', (event) => {
            if (!nav.contains(event.target)) closeNavigation();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                closeNavigation();
                toggle.focus();
            }
        });
        document.body.appendChild(nav);

        const navLinks = Array.from(links.querySelectorAll('a'));
        const activate = id => navLinks.forEach(link => link.classList.toggle('active', link.dataset.attemptTarget === id));
        if (targets.length) activate(targets[0].id);
        if (targets.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) activate(visible.target.id);
            }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .05, .2] });
            targets.forEach(target => observer.observe(target));
        }
    }

    function restartGif(media) {
        if (!media) return;
        if (media.tagName === 'VIDEO') {
            media.pause();
            try { media.currentTime = 0; } catch (error) { /* metadata may still be loading */ }
            const playRequest = media.play();
            return playRequest;
        }
        const source = media.dataset.gifSrc || media.getAttribute('src')?.split('?')[0];
        if (!source) return;
        media.dataset.gifSrc = source;
        const separator = source.includes('?') ? '&' : '?';
        media.src = `${source}${separator}restart=${Date.now()}`;
    }

    // Referências
    let activeReference = null;
    let referenceHideTimer = null;

    function referenceParts(wrap) {
        const trigger = wrap?.querySelector('.wiki-reference');
        let popover = wrap?.querySelector('.wiki-ref-popover');
        if (!popover && wrap?.dataset.referenceId) popover = document.body.querySelector(`.wiki-ref-popover[data-reference-owner="${wrap.dataset.referenceId}"]`);
        return { trigger, popover };
    }

    function positionReferencePopover(wrap) {
        const { trigger, popover } = referenceParts(wrap);
        if (!trigger || !popover) return;
        if (!wrap.dataset.referenceId) wrap.dataset.referenceId = `ref-${Math.random().toString(36).slice(2,10)}`;
        popover.dataset.referenceOwner = wrap.dataset.referenceId;
        if (popover.parentElement !== document.body) document.body.appendChild(popover);
        const rect = trigger.getBoundingClientRect();
        const pad = 10, gap = 10;
        const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom || 0;
        const safeTop = Math.max(pad, Math.ceil(headerBottom) + pad);
        const safeBottom = window.innerHeight - pad;
        if (rect.bottom <= safeTop || rect.top >= safeBottom) {
            wrap.classList.remove('is-open');
            popover.classList.remove('is-open');
            if (activeReference === wrap) activeReference = null;
            return;
        }
        const width = Math.min(360, Math.max(220, window.innerWidth - pad*2));
        let left = Math.max(pad, Math.min(rect.left, window.innerWidth - width - pad));
        let top = Math.max(safeTop, rect.bottom + gap);
        popover.style.width = `${width}px`;
        popover.style.maxWidth = `calc(100vw - ${pad*2}px)`;
        popover.style.setProperty('--ref-popover-left', `${left}px`);
        popover.style.setProperty('--ref-popover-top', `${top}px`);
        requestAnimationFrame(() => {
            if (!document.body.contains(popover)) return;
            const box = popover.getBoundingClientRect();
            if (box.bottom > safeBottom) top = rect.top - box.height - gap;
            if (top < safeTop) top = safeTop;
            left = Math.max(pad, Math.min(rect.left, window.innerWidth - width - pad));
            popover.style.setProperty('--ref-popover-left', `${left}px`);
            popover.style.setProperty('--ref-popover-top', `${top}px`);
        });
    }

    function openReference(wrap) {
        const { trigger, popover } = referenceParts(wrap);
        if (!trigger || !popover) return;
        clearTimeout(referenceHideTimer);
        document.querySelectorAll('.wiki-ref-wrap.is-open').forEach(item => item.classList.remove('is-open'));
        document.querySelectorAll('.wiki-ref-popover.is-open').forEach(item => item.classList.remove('is-open'));
        if (!wrap.dataset.referenceId) wrap.dataset.referenceId = `ref-${Math.random().toString(36).slice(2,10)}`;
        popover.dataset.referenceOwner = wrap.dataset.referenceId;
        if (popover.parentElement !== document.body) document.body.appendChild(popover);
        wrap.classList.add('is-open');
        popover.classList.add('is-open');
        restartGif(popover.querySelector('img[data-gif-src]'));
        activeReference = wrap;
        positionReferencePopover(wrap);
    }

    function scheduleCloseReference(wrap) {
        clearTimeout(referenceHideTimer);
        referenceHideTimer = setTimeout(() => {
            if (activeReference !== wrap) return;
            const { popover } = referenceParts(wrap);
            if (popover?.matches(':hover')) return;
            wrap.classList.remove('is-open');
            popover?.classList.remove('is-open');
            activeReference = null;
        }, 140);
    }

    function closeAllReferences() {
        clearTimeout(referenceHideTimer);
        document.querySelectorAll('.wiki-ref-wrap.is-open').forEach(item => item.classList.remove('is-open'));
        document.querySelectorAll('.wiki-ref-popover.is-open').forEach(item => item.classList.remove('is-open'));
        activeReference = null;
    }

    document.querySelectorAll('.wiki-ref-wrap').forEach(wrap => {
        const trigger = wrap.querySelector('.wiki-reference');
        const popover = wrap.querySelector('.wiki-ref-popover');
        if (!trigger || !popover) return;
        wrap.dataset.referenceId = `ref-${Math.random().toString(36).slice(2,10)}`;
        popover.dataset.referenceOwner = wrap.dataset.referenceId;
        wrap.addEventListener('mouseenter', () => openReference(wrap));
        wrap.addEventListener('mouseleave', () => scheduleCloseReference(wrap));
        wrap.addEventListener('focusin', () => openReference(wrap));
        wrap.addEventListener('focusout', () => scheduleCloseReference(wrap));
        trigger.addEventListener('click', event => {
            event.preventDefault();
            openReference(wrap);
        });
        popover.addEventListener('mouseenter', () => clearTimeout(referenceHideTimer));
        popover.addEventListener('mouseleave', () => scheduleCloseReference(wrap));
        popover.querySelector('img')?.addEventListener('load', () => positionReferencePopover(wrap));
    });

    window.addEventListener('resize', () => { if (activeReference) positionReferencePopover(activeReference); });
    window.addEventListener('scroll', () => { if (activeReference) positionReferencePopover(activeReference); }, { passive:true });
    document.addEventListener('click', event => {
        if (!event.target.closest?.('.wiki-ref-wrap') && !event.target.closest?.('.wiki-ref-popover')) closeAllReferences();
    });

    function showMissingAsset(media) {
        if (!media) return;
        media.dataset.assetError = 'true';
        const scope = media.closest('[data-wiki-asset-wrap], .wiki-ref-popover');
        const fallback = scope?.querySelector('.wiki-missing-asset, .wiki-ref-missing');
        if (media.tagName === 'IMG') {
            media.hidden = true;
            media.closest('.wiki-image-button')?.setAttribute('hidden', '');
        } else if (media.tagName === 'VIDEO') {
            media.hidden = true;
        }
        if (fallback) fallback.hidden = false;
    }

    document.querySelectorAll('[data-wiki-asset]').forEach((media) => {
        media.addEventListener('error', () => showMissingAsset(media), { once: true });
        if (media.tagName === 'VIDEO') {
            media.querySelectorAll('source').forEach((source) => source.addEventListener('error', () => showMissingAsset(media), { once: true }));
        }
    });

    // GIFs e vídeos reiniciáveis
    document.querySelectorAll('.wiki-gif-restart[data-gif-target]').forEach((button) => {
        const media = document.getElementById(button.dataset.gifTarget);
        if (!media) {
            button.disabled = true;
            return;
        }

        const controls = button.closest('.wiki-gif-controls');
        const stage = media.closest('.wiki-step-media, .corvos-step-media');
        if (stage && controls) {
            stage.classList.add('wiki-gif-stage');
            controls.classList.add('wiki-gif-overlay');
            stage.appendChild(controls);
        }

        const setPlaying = playing => {
            stage?.classList.toggle('is-media-playing', playing);
            button.setAttribute('aria-hidden', playing ? 'true' : 'false');
            button.tabIndex = playing ? -1 : 0;
        };

        if (media.tagName === 'VIDEO') {
            media.autoplay = false;
            media.loop = false;
            media.removeAttribute('autoplay');
            media.removeAttribute('loop');
            media.addEventListener('playing', () => setPlaying(true));
            media.addEventListener('ended', () => setPlaying(false));
            media.addEventListener('pause', () => setPlaying(false));
        } else {
            media.dataset.gifSrc = media.dataset.gifSrc || media.getAttribute('src')?.split('?')[0];
        }

        if (media.dataset.assetError === 'true') button.disabled = true;
        media.addEventListener('error', () => { button.disabled = true; }, { once: true });
        button.addEventListener('click', () => {
            const playRequest = restartGif(media);
            setPlaying(true);
            if (media.tagName === 'VIDEO') {
                playRequest?.catch?.(() => setPlaying(false));
            } else {
                window.setTimeout(() => setPlaying(false), 3200);
            }
        });
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

    setupAttemptNavigation();
    render();
})();
