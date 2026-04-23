/* =========================================================
   01. RIFERIMENTI DOM
========================================================= */

const hamburger = document.querySelector('.nav-hamburger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('sideMenuOverlay');
const closeBtn = document.querySelector('.side-menu-close');


/* =========================================================
   02. ELEMENTI FOCUSABILI NEL MENU
========================================================= */

function getFocusable() {
    if (!sideMenu) return [];

    return Array.from(
        sideMenu.querySelectorAll('a[href], button:not([disabled])')
    );
}


/* =========================================================
   03. TRAP DEL FOCUS
========================================================= */

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


/* =========================================================
   04. APERTURA MENU
========================================================= */

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


/* =========================================================
   05. CHIUSURA MENU
========================================================= */

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


/* =========================================================
   06. EVENTI CLICK
========================================================= */

if (hamburger) {
    hamburger.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

/* =========================================================
   09. SLIDER VIDEO / NETWORK INDICATOR + DRAG
========================================================= */
(function () {
    function enableScroller(scroller, bar, wrap, track) {
        if (!scroller || !bar || !wrap || !track) return;

        let isDown = false;
        let didDrag = false; // FIX: evita che il click scatti dopo un drag
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

        // FIX: preventDefault + stopPropagation + guard drag
        wrap.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (didDrag) { didDrag = false; return; }
            jumpTo(e.clientX);
        });

        scroller.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            isDown = true;
            didDrag = false; // FIX: reset al nuovo gesto
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
            if (Math.abs(deltaX) > 4) didDrag = true; // FIX: soglia minima per distinguere drag da click
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

    // Video del giorno
    const gridTop = document.getElementById('videoScrollerTop');
    const barTop  = document.getElementById('videoIndicator');
    const wrapTop = document.querySelector('.video-indicator-wrap');
    const trackTop = wrapTop;

    enableScroller(gridTop, barTop, wrapTop, trackTop);

    // Ultimi video
    const gridBottom  = document.getElementById('videoScrollerBottom');
    const barBottom   = document.getElementById('videoIndicatorBottom');
    const wrapBottom  = document.getElementById('latestVideosIndicatorWrap');
    // FIX: classe corretta con BEM __ invece di nessun separatore
    const trackBottom = wrapBottom
        ? wrapBottom.querySelector('.latest-videos__indicator-track')
        : null;

    enableScroller(gridBottom, barBottom, wrapBottom, trackBottom);

    // Network SAE
    const networkStrip = document.getElementById('networkStrip');
    const networkBar   = document.getElementById('networkIndicator');
    const networkWrap  = document.querySelector('.network-indicator-wrap');
    const networkTrack = networkWrap;

    enableScroller(networkStrip, networkBar, networkWrap, networkTrack);

    // Storie e Personaggi — scroller canali/rubriche
    const storieScroller  = document.getElementById('storieChannelsScroller');
    const storieBar       = document.getElementById('storieChannelsIndicator');
    const storieWrap      = document.getElementById('storieChannelsIndicatorWrap');
    const storieTrack     = storieWrap ? storieWrap.querySelector('.storie-channels__indicator-track') : null;
    enableScroller(storieScroller, storieBar, storieWrap, storieTrack);
})();

/* =========================================================
   10. LOGICA RICERCA (SEARCH OVERLAY)
========================================================= */

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

    // Chiudi con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            searchOverlay.classList.remove('open');
        }
    });
}


/* =========================================================
   11. SMART HEADER — Nascondi su scroll-down, mostra su scroll-up
   Attivo solo su viewport ≤ 768px.
========================================================= */

(function () {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const DEAD_ZONE = 60; // px di scroll ignorati per evitare flickering

    const mql = window.matchMedia('(max-width: 768px)');

    function onScroll() {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;

            // Non agire se il media query non matcha o il menu laterale è aperto
            if (!mql.matches || document.body.classList.contains('menu-open')) {
                document.body.classList.remove('header-hidden', 'header-visible');
                return;
            }

            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;

            // In cima alla pagina: sempre visibile
            if (currentY <= 10) {
                document.body.classList.remove('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
                return;
            }

            // Scroll DOWN oltre la dead-zone → nascondi
            if (delta > DEAD_ZONE) {
                document.body.classList.add('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
            }
            // Scroll UP oltre la dead-zone → mostra
            else if (delta < -DEAD_ZONE) {
                document.body.classList.remove('header-hidden');
                document.body.classList.add('header-visible');
                lastScrollY = currentY;
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Quando lo schermo cresce oltre 768px, rimuovi le classi
    mql.addEventListener('change', function () {
        if (!mql.matches) {
            document.body.classList.remove('header-hidden', 'header-visible');
        }
    });
})();


/* =========================================================
   12. MOBILE DOM RESTRUCTURING
   Sposta logo e accedi nella nav bar, e video del giorno
   dopo il primo piano. Attivo solo su ≤ 768px.
========================================================= */

(function () {
    const mql = window.matchMedia('(max-width: 768px)');

    // Riferimenti originali per ripristino
    const navInner = document.querySelector('.nav-inner');
    const siteHeader = document.querySelector('.site-header');
    const siteLogo = document.querySelector('.site-logo');
    const accediLink = document.querySelector('.header-actions .accedi');
    const navHamburger = document.querySelector('.nav-hamburger');
    const navSearch = document.querySelector('.nav-search');

    const homeVideos = document.querySelector('.home-videos');
    const homeMain = document.getElementById('main');
    const heroSection = document.querySelector('.home-hero');

    // Riferimenti ai parent originali
    const headerTop = document.querySelector('.header-top');
    const headerActions = document.querySelector('.header-actions');

    // Posizioni originali per ripristino
    let logoOriginalParent = siteLogo ? siteLogo.parentNode : null;
    let logoOriginalNext = siteLogo ? siteLogo.nextElementSibling : null;
    let accediOriginalParent = accediLink ? accediLink.parentNode : null;
    let accediOriginalNext = accediLink ? accediLink.nextElementSibling : null;
    let videoOriginalParent = homeVideos ? homeVideos.parentNode : null;
    let videoOriginalNext = homeVideos ? homeVideos.nextElementSibling : null;

    let isMobileLayout = false;

    function applyMobileLayout() {
        if (isMobileLayout) return;
        isMobileLayout = true;

        // 1. Sposta logo nella nav bar (dopo hamburger)
        if (navInner && siteLogo && navHamburger) {
            navHamburger.after(siteLogo);
        }

        // 2. Sposta accedi nella nav bar (alla fine, prima del search)
        if (navInner && accediLink) {
            if (navSearch) {
                navSearch.before(accediLink);
            } else {
                navInner.appendChild(accediLink);
            }
        }

        // 3. Sposta video del giorno dopo home-hero (primo piano)
        if (homeMain && homeVideos && heroSection) {
            heroSection.after(homeVideos);
        }
    }

    function restoreDesktopLayout() {
        if (!isMobileLayout) return;
        isMobileLayout = false;

        // Ripristina logo nella posizione originale
        if (siteLogo && logoOriginalParent) {
            if (logoOriginalNext) {
                logoOriginalParent.insertBefore(siteLogo, logoOriginalNext);
            } else {
                logoOriginalParent.appendChild(siteLogo);
            }
        }

        // Ripristina accedi nella posizione originale
        if (accediLink && accediOriginalParent) {
            if (accediOriginalNext) {
                accediOriginalParent.insertBefore(accediLink, accediOriginalNext);
            } else {
                accediOriginalParent.appendChild(accediLink);
            }
        }

        // Ripristina video nella posizione originale
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

    // Applica al caricamento
    handleBreakpoint();

    // Ascolta i cambiamenti di viewport
    mql.addEventListener('change', handleBreakpoint);
})();