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

    // Initialize all Encourt features
    function initEncourt() {
        try {
            // Add your feature initializers here
            // initSomeFeature();
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
