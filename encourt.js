// encourt.js - Encourt Website Scripts
// Version: 1.0.0

(function() {
    'use strict';
    console.log('[Encourt] Script loaded');

    // Load external scripts dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // Load CSS files dynamically
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Add dependencies here when needed (e.g. GSAP, Swiper)
    async function loadDependencies() {
        const dependencies = [
            // 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
        ];
        if (dependencies.length === 0) return true;
        try {
            await Promise.all(dependencies.map(src => loadScript(src)));
            console.log('[Encourt] Dependencies loaded');
            return true;
        } catch (error) {
            console.error('[Encourt] Error loading dependencies:', error);
            return false;
        }
    }

    // Image cycle feature
    function initImageCycle() {
        document.querySelectorAll('[data-image-cycle]').forEach((cycleElement) => {
            const items = cycleElement.querySelectorAll('[data-image-cycle-item]');
            if (items.length < 2) return;

            let currentIndex = 0;
            let intervalId;

            // Get optional custom duration (in seconds), fallback to 2000ms
            const attrValue = cycleElement.getAttribute('data-image-cycle');
            const duration =
                attrValue && !isNaN(attrValue) ? parseFloat(attrValue) * 1000 : 2000;
            const isTwoItems = items.length === 2;

            // Initial state
            items.forEach((item, i) => {
                item.setAttribute(
                    'data-image-cycle-item',
                    i === 0 ? 'active' : 'not-active'
                );
            });

            function cycleImages() {
                const prevIndex = currentIndex;
                currentIndex = (currentIndex + 1) % items.length;

                items[prevIndex].setAttribute('data-image-cycle-item', 'previous');

                if (!isTwoItems) {
                    setTimeout(() => {
                        items[prevIndex].setAttribute(
                            'data-image-cycle-item',
                            'not-active'
                        );
                    }, duration);
                }

                items[currentIndex].setAttribute('data-image-cycle-item', 'active');
            }

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !intervalId) {
                        intervalId = setInterval(cycleImages, duration);
                    } else if (!entry.isIntersecting && intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                },
                { threshold: 0 }
            );

            observer.observe(cycleElement);
        });
    }

    // Initialize all Encourt features
    function initEncourt() {
        try {
            // Add your feature initializers here
            // initSomeFeature();
            initImageCycle();
            console.log('[Encourt] Initialized');
        } catch (error) {
            console.error('[Encourt] Init error:', error);
        }
    }

    // Main entry: run when DOM is ready
    async function init() {
        const depsOk = await loadDependencies();
        if (!depsOk) return;
        initEncourt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
