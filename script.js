/* Gestione dell'apertura e chiusura del Menu Laterale (Hamburger) */
const hamburger = document.querySelector('.nav-hamburger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('sideMenuOverlay');
const closeBtn = document.querySelector('.side-menu-close');


/* Recupera tutti gli elementi focusabili all'interno del menu laterale per la gestione dell'accessibilità */
function getFocusable() {
    if (!sideMenu) return [];

    return Array.from(
        sideMenu.querySelectorAll('a[href], button:not([disabled])')
    );
}


/* Intrappola il focus all'interno del menu laterale quando è aperto, per evitare che gli screen reader leggano il contenuto in background */
function trapFocus(e) {
    const focusable = getFocusable();

    if (!focusable.length || e.key !== 'Tab') return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}


/* Apre il menu laterale e imposta correttamente gli attributi ARIA */
function openMenu() {
    if (!sideMenu || !overlay || !hamburger) return;

    sideMenu.classList.add('open');
    overlay.classList.add('open');

    hamburger.setAttribute('aria-expanded', 'true');
    sideMenu.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');

    document.body.classList.add('menu-open');

    const focusable = getFocusable();
    if (focusable.length) {
        focusable[0].focus();
    }

    sideMenu.addEventListener('keydown', trapFocus);
}


/* Chiude il menu laterale e ripristina gli attributi ARIA */
function closeMenu() {
    if (!sideMenu || !overlay || !hamburger) return;

    sideMenu.classList.remove('open');
    overlay.classList.remove('open');

    hamburger.setAttribute('aria-expanded', 'false');
    sideMenu.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('menu-open');

    sideMenu.removeEventListener('keydown', trapFocus);
    hamburger.focus();
}


/* Aggiunge i listener per i bottoni di apertura e chiusura del menu */
if (hamburger) {
    hamburger.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

/* Inizializzazione degli slider orizzontali (Scroller) per i video e le storie */
(function () {
    function enableScroller(scroller, bar, wrap, track) {
        if (!scroller || !bar || !wrap || !track) return;

        let isDown = false;
        let didDrag = false; // Indica se l'utente ha trascinato lo slider
        let startX = 0;
        let startScrollLeft = 0;
        let pointerId = null;

        function sync() {
            const max = scroller.scrollWidth - scroller.clientWidth;
            const trackW = track.offsetWidth;
            const thumbW = bar.offsetWidth;

            if (max <= 0 || trackW <= 0) {
                bar.style.transform = 'translateX(0)';
                return;
            }

            const pct = scroller.scrollLeft / max;
            const maxTx = Math.max(0, trackW - thumbW);
            bar.style.transform = 'translateX(' + (pct * maxTx) + 'px)';
        }

        function jumpTo(clientX) {
            const max = scroller.scrollWidth - scroller.clientWidth;
            if (max <= 0) return;

            const rect = track.getBoundingClientRect();
            const thumbW = bar.offsetWidth;
            const trackW = rect.width;
            const maxThumbLeft = trackW - thumbW;

            if (maxThumbLeft <= 0) return;

            const clickX = clientX - rect.left;
            let thumbLeft = clickX - thumbW / 2;
            thumbLeft = Math.max(0, Math.min(thumbLeft, maxThumbLeft));

            const targetLeft = (thumbLeft / maxThumbLeft) * max;
            const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            scroller.scrollTo({
                left: targetLeft,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }

        scroller.addEventListener('scroll', sync, { passive: true });
        window.addEventListener('resize', sync);

        // Gestione del click sulla barra spaziatrice o barra indicatrice
        wrap.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (didDrag) { didDrag = false; return; }
            jumpTo(e.clientX);
        });

        scroller.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            isDown = true;
            didDrag = false; // Reset del flag di trascinamento
            pointerId = e.pointerId;
            startX = e.clientX;
            startScrollLeft = scroller.scrollLeft;

            scroller.classList.add('is-dragging');

            if (scroller.setPointerCapture) {
                scroller.setPointerCapture(pointerId);
            }
        });

        scroller.addEventListener('pointermove', function (e) {
            if (!isDown) return;

            const deltaX = e.clientX - startX;
            if (Math.abs(deltaX) > 4) didDrag = true; // Se il movimento è significativo, considera l'azione come drag
            scroller.scrollLeft = startScrollLeft - deltaX;
        });

        function stopDrag(e) {
            if (!isDown) return;

            isDown = false;
            scroller.classList.remove('is-dragging');

            if (
                scroller.releasePointerCapture &&
                pointerId !== null &&
                e &&
                e.pointerId === pointerId
            ) {
                scroller.releasePointerCapture(pointerId);
            }

            pointerId = null;
        }

        scroller.addEventListener('pointerup', stopDrag);
        scroller.addEventListener('pointercancel', stopDrag);
        scroller.addEventListener('pointerleave', function (e) {
            if (e.pointerType === 'mouse') stopDrag(e);
        });

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(sync).observe(scroller);
            new ResizeObserver(sync).observe(track);
        }

        sync();
    }

    // Inizializzazione dello slider Video in evidenza
    const gridTop = document.getElementById('videoScrollerTop');
    const barTop  = document.getElementById('videoIndicator');
    const wrapTop = document.querySelector('.video-indicator-wrap');
    const trackTop = wrapTop;

    enableScroller(gridTop, barTop, wrapTop, trackTop);

    // Inizializzazione dello slider Ultimi Video
    const gridBottom  = document.getElementById('videoScrollerBottom');
    const barBottom   = document.getElementById('videoIndicatorBottom');
    const wrapBottom  = document.getElementById('latestVideosIndicatorWrap');
    // Elemento traccia dell'indicatore
    const trackBottom = wrapBottom
        ? wrapBottom.querySelector('.latest-videos__indicator-track')
        : null;

    enableScroller(gridBottom, barBottom, wrapBottom, trackBottom);

    // Inizializzazione dello slider Network SAE
    const networkStrip = document.getElementById('networkStrip');
    const networkBar   = document.getElementById('networkIndicator');
    const networkWrap  = document.querySelector('.network-indicator-wrap');
    const networkTrack = networkWrap;

    enableScroller(networkStrip, networkBar, networkWrap, networkTrack);

    // Inizializzazione dello slider Storie e Personaggi
    const storieScroller  = document.getElementById('storieChannelsScroller');
    const storieBar       = document.getElementById('storieChannelsIndicator');
    const storieWrap      = document.getElementById('storieChannelsIndicatorWrap');
    const storieTrack     = storieWrap ? storieWrap.querySelector('.storie-channels__indicator-track') : null;
    enableScroller(storieScroller, storieBar, storieWrap, storieTrack);
})();

/* Gestione della barra di ricerca a comparsa (Search Overlay) */
const searchToggle = document.getElementById('searchToggle');
const searchClose = document.getElementById('searchClose');
const searchOverlay = document.getElementById('searchOverlay');

if (searchToggle && searchOverlay && searchClose) {
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('open');
        const input = searchOverlay.querySelector('input');
        if (input) input.focus();
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('open');
    });

    // Chiude la ricerca premendo il tasto ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            searchOverlay.classList.remove('open');
        }
    });
}


/* Gestione della scomparsa/comparsa dell'header durante lo scroll su dispositivi mobili */
(function () {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const DEAD_ZONE = 60; // Zona morta per ignorare i piccoli scroll

    const mql = window.matchMedia('(max-width: 768px)');

    function onScroll() {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;

            // Annulla l'effetto se non siamo su mobile o se il menu è aperto
            if (!mql.matches || document.body.classList.contains('menu-open')) {
                document.body.classList.remove('header-hidden', 'header-visible');
                return;
            }

            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;

            // Torna in cima: mostra l'header
            if (currentY <= 10) {
                document.body.classList.remove('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
                return;
            }

            // Scroll verso il basso: nasconde l'header
            if (delta > DEAD_ZONE) {
                document.body.classList.add('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
            }
            // Scroll verso l'alto: mostra l'header
            else if (delta < -DEAD_ZONE) {
                document.body.classList.remove('header-hidden');
                document.body.classList.add('header-visible');
                lastScrollY = currentY;
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Reset delle classi quando si passa a desktop
    mql.addEventListener('change', function () {
        if (!mql.matches) {
            document.body.classList.remove('header-hidden', 'header-visible');
        }
    });
})();


/* Riorganizzazione del DOM per la vista mobile: sposta la sezione video */
(function () {
    const mql = window.matchMedia('(max-width: 768px)');
    const homeVideos = document.querySelector('.home-videos');
    const homeMain = document.getElementById('main');
    const heroSection = document.querySelector('.home-hero');
    let videoOriginalParent = homeVideos ? homeVideos.parentNode : null;
    let videoOriginalNext = homeVideos ? homeVideos.nextElementSibling : null;

    let isMobileLayout = false;

    function applyMobileLayout() {
        if (isMobileLayout) return;
        isMobileLayout = true;

        // Inserisce i video subito dopo l'articolo in evidenza su mobile
        const firstFeatured = document.querySelector('.ev-card--featured');
        if (homeMain && homeVideos && firstFeatured) {
            firstFeatured.after(homeVideos);
        } else if (homeMain && homeVideos && heroSection) {
            // Fallback se l'articolo in evidenza non c'è
            heroSection.after(homeVideos);
        }
    }

    function restoreDesktopLayout() {
        if (!isMobileLayout) return;
        isMobileLayout = false;

        // Ripristina la posizione originale su desktop
        if (homeVideos && videoOriginalParent) {
            if (videoOriginalNext) {
                videoOriginalParent.insertBefore(homeVideos, videoOriginalNext);
            } else {
                videoOriginalParent.appendChild(homeVideos);
            }
        }
    }

    function handleBreakpoint() {
        if (mql.matches) {
            applyMobileLayout();
        } else {
            restoreDesktopLayout();
        }
    }

    handleBreakpoint();
    mql.addEventListener('change', handleBreakpoint);
})();

/* Gestione dell'apertura a tendina delle sezioni nel menu laterale (mobile) */
(function() {
    const sectionHeaders = document.querySelectorAll('.side-menu-section h2');

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const mql = window.matchMedia('(max-width: 1024px)');
            if (!mql.matches) return; // Funziona solo su mobile/tablet

            const section = header.parentElement;

            // Toggle della classe open per mostrare/nascondere la lista
            if (section.classList.contains('open')) {
                section.classList.remove('open');
            } else {
                // Chiude tutte le altre sezioni e apre quella cliccata
                section.classList.add('open');
            }
        });
    });
})();