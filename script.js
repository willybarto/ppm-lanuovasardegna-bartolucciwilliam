/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad min */

const hamburger = document.querySelector('.nav-hamburger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('sideMenuOverlay');
const closeBtn = document.querySelector('.side-menu-close');


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, qu */

function getFocusable() {
    if (!sideMenu) return [];

    return Array.from(
        sideMenu.querySelectorAll('a[href], button:not([disabled])')
    );
}


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi */

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


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad m */

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


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad m */

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


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad */

if (hamburger) {
    hamburger.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud */
(function () {
    function enableScroller(scroller, bar, wrap, track) {
        if (!scroller || !bar || !wrap || !track) return;

        let isDown = false;
        let didDrag = false; // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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

        // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        wrap.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (didDrag) { didDrag = false; return; }
            jumpTo(e.clientX);
        });

        scroller.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            isDown = true;
            didDrag = false; // Lorem ipsum dolor sit amet
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
            if (Math.abs(deltaX) > 4) didDrag = true; // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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

    // Lorem ipsum dolor sit amet
    const gridTop = document.getElementById('videoScrollerTop');
    const barTop  = document.getElementById('videoIndicator');
    const wrapTop = document.querySelector('.video-indicator-wrap');
    const trackTop = wrapTop;

    enableScroller(gridTop, barTop, wrapTop, trackTop);

    // Lorem ipsum
    const gridBottom  = document.getElementById('videoScrollerBottom');
    const barBottom   = document.getElementById('videoIndicatorBottom');
    const wrapBottom  = document.getElementById('latestVideosIndicatorWrap');
    // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    const trackBottom = wrapBottom
        ? wrapBottom.querySelector('.latest-videos__indicator-track')
        : null;

    enableScroller(gridBottom, barBottom, wrapBottom, trackBottom);

    // Lorem ipsum
    const networkStrip = document.getElementById('networkStrip');
    const networkBar   = document.getElementById('networkIndicator');
    const networkWrap  = document.querySelector('.network-indicator-wrap');
    const networkTrack = networkWrap;

    enableScroller(networkStrip, networkBar, networkWrap, networkTrack);

    // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    const storieScroller  = document.getElementById('storieChannelsScroller');
    const storieBar       = document.getElementById('storieChannelsIndicator');
    const storieWrap      = document.getElementById('storieChannelsIndicatorWrap');
    const storieTrack     = storieWrap ? storieWrap.querySelector('.storie-channels__indicator-track') : null;
    enableScroller(storieScroller, storieBar, storieWrap, storieTrack);
})();

/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis */

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

    // Lorem ipsum
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            searchOverlay.classList.remove('open');
        }
    });
}


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commo */

(function () {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const DEAD_ZONE = 60; // Lorem ipsum dolor sit amet, consectetur adipiscing elit.

    const mql = window.matchMedia('(max-width: 768px)');

    function onScroll() {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;

            // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ei
            if (!mql.matches || document.body.classList.contains('menu-open')) {
                document.body.classList.remove('header-hidden', 'header-visible');
                return;
            }

            const currentY = window.scrollY;
            const delta = currentY - lastScrollY;

            // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            if (currentY <= 10) {
                document.body.classList.remove('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
                return;
            }

            // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            if (delta > DEAD_ZONE) {
                document.body.classList.add('header-hidden');
                document.body.classList.remove('header-visible');
                lastScrollY = currentY;
            }
            // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            else if (delta < -DEAD_ZONE) {
                document.body.classList.remove('header-hidden');
                document.body.classList.add('header-visible');
                lastScrollY = currentY;
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    mql.addEventListener('change', function () {
        if (!mql.matches) {
            document.body.classList.remove('header-hidden', 'header-visible');
        }
    });
})();


/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons */

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

        // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo
        const firstFeatured = document.querySelector('.ev-card--featured');
        if (homeMain && homeVideos && firstFeatured) {
            firstFeatured.after(homeVideos);
        } else if (homeMain && homeVideos && heroSection) {
            // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            heroSection.after(homeVideos);
        }
    }

    function restoreDesktopLayout() {
        if (!isMobileLayout) return;
        isMobileLayout = false;

        // Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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

/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim venia */
(function() {
    const sectionHeaders = document.querySelectorAll('.side-menu-section h2');

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const mql = window.matchMedia('(max-width: 1024px)');
            if (!mql.matches) return; // Lorem ipsum dolor sit amet

            const section = header.parentElement;

            // Lorem ipsum dolor sit amet
            if (section.classList.contains('open')) {
                section.classList.remove('open');
            } else {
                // Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiu
                /* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud */
                section.classList.add('open');
            }
        });
    });
})();