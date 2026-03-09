// encourt.js - Encourt Website Scripts
// Version: 1.0.0
// Date: 2026-03-06

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
        const cssDependencies = [
            'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css',
        ];
        const scriptDependencies = [
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',
            'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',
            'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js',
        ];
        const hasDeps = cssDependencies.length > 0 || scriptDependencies.length > 0;
        if (!hasDeps) return true;
        try {
            await Promise.all(cssDependencies.map((href) => loadCSS(href)));
            await Promise.all(scriptDependencies.map((src) => loadScript(src)));
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

    // Advanced form validation feature
    function initAdvancedFormValidation() {
        const forms = document.querySelectorAll('[data-form-validate]');

        forms.forEach((formContainer) => {
            const startTime = new Date().getTime();

            const form = formContainer.querySelector('form');
            if (!form) return;

            const validateFields = form.querySelectorAll('[data-validate]');
            const dataSubmit = form.querySelector('[data-submit]');
            if (!dataSubmit) return;

            const realSubmitInput = dataSubmit.querySelector('input[type=\"submit\"]');
            if (!realSubmitInput) return;

            function isSpam() {
                const currentTime = new Date().getTime();
                return currentTime - startTime < 5000;
            }

            // Disable select options with invalid values on page load
            validateFields.forEach(function(fieldGroup) {
                const select = fieldGroup.querySelector('select');
                if (select) {
                    const options = select.querySelectorAll('option');
                    options.forEach(function(option) {
                        if (
                            option.value === '' ||
                            option.value === 'disabled' ||
                            option.value === 'null' ||
                            option.value === 'false'
                        ) {
                            option.setAttribute('disabled', 'disabled');
                        }
                    });
                }
            });

            function isValid(fieldGroup) {
                const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
                if (radioCheckGroup) {
                    const inputs = radioCheckGroup.querySelectorAll(
                        'input[type=\"radio\"], input[type=\"checkbox\"]'
                    );
                    const checkedInputs = radioCheckGroup.querySelectorAll('input:checked');
                    const min = parseInt(radioCheckGroup.getAttribute('min')) || 1;
                    const max =
                        parseInt(radioCheckGroup.getAttribute('max')) || inputs.length;
                    const checkedCount = checkedInputs.length;

                    if (inputs[0].type === 'radio') {
                        return checkedCount >= 1;
                    } else {
                        if (inputs.length === 1) {
                            return inputs[0].checked;
                        }
                        return checkedCount >= min && checkedCount <= max;
                    }
                }

                const input = fieldGroup.querySelector('input, textarea, select');
                if (!input) return false;

                let valid = true;
                const min = parseInt(input.getAttribute('min')) || 0;
                const max = parseInt(input.getAttribute('max')) || Infinity;
                const value = input.value.trim();
                const length = value.length;

                if (input.tagName.toLowerCase() === 'select') {
                    if (
                        value === '' ||
                        value === 'disabled' ||
                        value === 'null' ||
                        value === 'false'
                    ) {
                        valid = false;
                    }
                } else if (input.type === 'email') {
                    // Use native validity so standard emails always pass (avoids regex/cache issues)
                    valid = value.length > 0 && input.validity.valid;
                } else {
                    if (input.hasAttribute('min') && length < min) valid = false;
                    if (input.hasAttribute('max') && length > max) valid = false;
                }

                return valid;
            }

            function updateFieldStatus(fieldGroup) {
                const radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
                if (radioCheckGroup) {
                    const inputs = radioCheckGroup.querySelectorAll(
                        'input[type=\"radio\"], input[type=\"checkbox\"]'
                    );
                    const checkedInputs = radioCheckGroup.querySelectorAll('input:checked');

                    if (checkedInputs.length > 0) {
                        fieldGroup.classList.add('is--filled');
                    } else {
                        fieldGroup.classList.remove('is--filled');
                    }

                    const valid = isValid(fieldGroup);

                    if (valid) {
                        fieldGroup.classList.add('is--success');
                        fieldGroup.classList.remove('is--error');
                    } else {
                        fieldGroup.classList.remove('is--success');
                        const anyInputValidationStarted = Array.from(inputs).some(
                            (input) => input.__validationStarted
                        );
                        if (anyInputValidationStarted) {
                            fieldGroup.classList.add('is--error');
                        } else {
                            fieldGroup.classList.remove('is--error');
                        }
                    }
                    return;
                }

                const input = fieldGroup.querySelector('input, textarea, select');
                if (!input) return;

                const value = input.value.trim();

                if (value) {
                    fieldGroup.classList.add('is--filled');
                } else {
                    fieldGroup.classList.remove('is--filled');
                }

                const valid = isValid(fieldGroup);

                if (valid) {
                    fieldGroup.classList.add('is--success');
                    fieldGroup.classList.remove('is--error');
                } else {
                    fieldGroup.classList.remove('is--success');
                    if (input.__validationStarted) {
                        fieldGroup.classList.add('is--error');
                    } else {
                        fieldGroup.classList.remove('is--error');
                    }
                }
            }

            function validateAndStartLiveValidationForAll() {
                let allValid = true;
                let firstInvalidField = null;

                validateFields.forEach(function(fieldGroup) {
                    const input = fieldGroup.querySelector('input, textarea, select');
                    const radioCheckGroup = fieldGroup.querySelector(
                        '[data-radiocheck-group]'
                    );
                    if (!input && !radioCheckGroup) return;

                    if (input) input.__validationStarted = true;
                    if (radioCheckGroup) {
                        radioCheckGroup.__validationStarted = true;
                        const inputs = radioCheckGroup.querySelectorAll(
                            'input[type=\"radio\"], input[type=\"checkbox\"]'
                        );
                        inputs.forEach(function(input) {
                            input.__validationStarted = true;
                        });
                    }

                    updateFieldStatus(fieldGroup);

                    if (!isValid(fieldGroup)) {
                        allValid = false;
                        if (!firstInvalidField) {
                            firstInvalidField =
                                input || radioCheckGroup.querySelector('input');
                        }
                    }
                });

                if (!allValid && firstInvalidField) {
                    firstInvalidField.focus();
                }

                return allValid;
            }

            validateFields.forEach(function(fieldGroup) {
                const input = fieldGroup.querySelector('input, textarea, select');
                const radioCheckGroup = fieldGroup.querySelector(
                    '[data-radiocheck-group]'
                );

                if (radioCheckGroup) {
                    const inputs = radioCheckGroup.querySelectorAll(
                        'input[type=\"radio\"], input[type=\"checkbox\"]'
                    );
                    inputs.forEach(function(input) {
                        input.__validationStarted = false;

                        input.addEventListener('change', function() {
                            requestAnimationFrame(function() {
                                if (!input.__validationStarted) {
                                    const checkedCount =
                                        radioCheckGroup.querySelectorAll('input:checked')
                                            .length;
                                    const min =
                                        parseInt(radioCheckGroup.getAttribute('min')) || 1;

                                    if (checkedCount >= min) {
                                        input.__validationStarted = true;
                                    }
                                }

                                if (input.__validationStarted) {
                                    updateFieldStatus(fieldGroup);
                                }
                            });
                        });

                        input.addEventListener('blur', function() {
                            input.__validationStarted = true;
                            updateFieldStatus(fieldGroup);
                        });
                    });
                } else if (input) {
                    input.__validationStarted = false;

                    if (input.tagName.toLowerCase() === 'select') {
                        input.addEventListener('change', function() {
                            input.__validationStarted = true;
                            updateFieldStatus(fieldGroup);
                        });
                    } else {
                        input.addEventListener('input', function() {
                            const value = input.value.trim();
                            const length = value.length;
                            const min = parseInt(input.getAttribute('min')) || 0;
                            const max =
                                parseInt(input.getAttribute('max')) || Infinity;

                            if (!input.__validationStarted) {
                                if (input.type === 'email') {
                                    if (isValid(fieldGroup)) input.__validationStarted = true;
                                } else if (
                                    (input.hasAttribute('min') && length >= min) ||
                                    (input.hasAttribute('max') && length <= max)
                                ) {
                                    input.__validationStarted = true;
                                }
                            }

                            if (input.__validationStarted) {
                                updateFieldStatus(fieldGroup);
                            }
                        });

                        input.addEventListener('blur', function() {
                            input.__validationStarted = true;
                            updateFieldStatus(fieldGroup);
                        });
                    }
                }
            });

            dataSubmit.addEventListener('click', function() {
                if (validateAndStartLiveValidationForAll()) {
                    if (isSpam()) {
                        alert('Form submitted too quickly. Please try again.');
                        return;
                    }
                    realSubmitInput.click();
                }
            });

            form.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
                    event.preventDefault();
                    if (validateAndStartLiveValidationForAll()) {
                        if (isSpam()) {
                            alert('Form submitted too quickly. Please try again.');
                            return;
                        }
                        realSubmitInput.click();
                    }
                }
            });
        });
    }

    // Directional button hover feature
    function initDirectionalButtonHover() {
        const buttons = document.querySelectorAll('[data-btn-hover]');
        if (!buttons.length) return;

        function handleHover(event) {
            const button = event.currentTarget;
            const buttonRect = button.getBoundingClientRect();

            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;
            const buttonCenterX = buttonRect.left + buttonWidth / 2;
            const buttonCenterY = buttonRect.top + buttonHeight / 2;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const offsetXFromLeft = ((mouseX - buttonRect.left) / buttonWidth) * 100;
            const offsetYFromTop = ((mouseY - buttonRect.top) / buttonHeight) * 100;

            let offsetXFromCenter =
                ((mouseX - buttonCenterX) / (buttonWidth / 2)) * 50;
            offsetXFromCenter = Math.abs(offsetXFromCenter);

            // Support both .btn__circle and .btn_circle (Webflow can output either)
            const circle =
                button.querySelector('.btn__circle') ||
                button.querySelector('.btn_circle') ||
                button.querySelector('[class*="circle-wrap"] > div');
            if (!circle) return;

            const leftPct = offsetXFromLeft.toFixed(1) + '%';
            const topPct = offsetYFromTop.toFixed(1) + '%';
            const widthPct = (115 + offsetXFromCenter * 2) + '%';

            circle.style.setProperty('left', leftPct);
            circle.style.setProperty('top', topPct);
            circle.style.setProperty('width', widthPct);
        }

        buttons.forEach((button) => {
            button.addEventListener('mouseenter', handleHover);
            button.addEventListener('mouseleave', handleHover);
        });
    }

    // Swiper slider feature
    function initSwiperSlider() {
        if (typeof Swiper === 'undefined') return;
        const swiperSliderGroups = document.querySelectorAll('[data-swiper-group]');
        swiperSliderGroups.forEach((swiperGroup) => {
            const swiperSliderWrap = swiperGroup.querySelector('[data-swiper-wrap]');
            if (!swiperSliderWrap) return;

            const prevButton = swiperGroup.querySelector('[data-swiper-prev]');
            const nextButton = swiperGroup.querySelector('[data-swiper-next]');
            const paginationEl = swiperGroup.querySelector('.swiper-pagination');

            const swiper = new Swiper(swiperSliderWrap, {
                slidesPerView: 1.25,
                speed: 600,
                grabCursor: true,
                breakpoints: {
                    480: { slidesPerView: 1.8 },
                    992: { slidesPerView: 3.5 },
                },
                navigation: {
                    nextEl: nextButton,
                    prevEl: prevButton,
                },
                pagination: paginationEl
                    ? { el: paginationEl, type: 'bullets', clickable: true }
                    : false,
                keyboard: { enabled: true, onlyInViewport: false },
            });
        });
    }

    // Content reveal on scroll feature
    function initContentRevealScroll() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        const ctx = gsap.context(() => {
            document.querySelectorAll('[data-reveal-group]').forEach((groupEl) => {
                const groupStaggerSec =
                    (parseFloat(groupEl.getAttribute('data-stagger')) || 100) / 1000;
                const groupDistance = groupEl.getAttribute('data-distance') || '2em';
                const triggerStart = groupEl.getAttribute('data-start') || 'top 80%';

                const animDuration = 0.8;
                const animEase = 'power4.inOut';

                if (prefersReduced) {
                    gsap.set(groupEl, { clearProps: 'all', y: 0, autoAlpha: 1 });
                    return;
                }

                const directChildren = Array.from(groupEl.children).filter(
                    (el) => el.nodeType === 1
                );

                if (!directChildren.length) {
                    gsap.set(groupEl, { y: groupDistance, autoAlpha: 0 });
                    ScrollTrigger.create({
                        trigger: groupEl,
                        start: triggerStart,
                        once: true,
                        onEnter: () =>
                            gsap.to(groupEl, {
                                y: 0,
                                autoAlpha: 1,
                                duration: animDuration,
                                ease: animEase,
                                onComplete: () => gsap.set(groupEl, { clearProps: 'all' }),
                            }),
                    });
                    return;
                }

                const slots = [];
                directChildren.forEach((child) => {
                    const nestedGroup = child.matches('[data-reveal-group-nested]')
                        ? child
                        : child.querySelector(':scope [data-reveal-group-nested]');

                    if (nestedGroup) {
                        const includeParent =
                            child.getAttribute('data-ignore') === 'false' ||
                            nestedGroup.getAttribute('data-ignore') === 'false';
                        slots.push({
                            type: 'nested',
                            parentEl: child,
                            nestedEl: nestedGroup,
                            includeParent,
                        });
                    } else {
                        slots.push({ type: 'item', el: child });
                    }
                });

                slots.forEach((slot) => {
                    if (slot.type === 'item') {
                        const isNestedSelf = slot.el.matches('[data-reveal-group-nested]');
                        const distance = isNestedSelf
                            ? groupDistance
                            : slot.el.getAttribute('data-distance') || groupDistance;
                        gsap.set(slot.el, { y: distance, autoAlpha: 0 });
                    } else {
                        if (slot.includeParent) {
                            gsap.set(slot.parentEl, {
                                y: groupDistance,
                                autoAlpha: 0,
                            });
                        }

                        const nestedDistance =
                            slot.nestedEl.getAttribute('data-distance') || groupDistance;
                        Array.from(slot.nestedEl.children).forEach((target) => {
                            gsap.set(target, { y: nestedDistance, autoAlpha: 0 });
                        });
                    }
                });

                slots.forEach((slot) => {
                    if (slot.type === 'nested' && slot.includeParent) {
                        gsap.set(slot.parentEl, { y: groupDistance });
                    }
                });

                ScrollTrigger.create({
                    trigger: groupEl,
                    start: triggerStart,
                    once: true,
                    onEnter: () => {
                        const tl = gsap.timeline();

                        slots.forEach((slot, slotIndex) => {
                            const slotTime = slotIndex * groupStaggerSec;

                            if (slot.type === 'item') {
                                tl.to(
                                    slot.el,
                                    {
                                        y: 0,
                                        autoAlpha: 1,
                                        duration: animDuration,
                                        ease: animEase,
                                        onComplete: () =>
                                            gsap.set(slot.el, { clearProps: 'all' }),
                                    },
                                    slotTime
                                );
                            } else {
                                if (slot.includeParent) {
                                    tl.to(
                                        slot.parentEl,
                                        {
                                            y: 0,
                                            autoAlpha: 1,
                                            duration: animDuration,
                                            ease: animEase,
                                            onComplete: () =>
                                                gsap.set(slot.parentEl, {
                                                    clearProps: 'all',
                                                }),
                                        },
                                        slotTime
                                    );
                                }

                                const nestedMs = parseFloat(
                                    slot.nestedEl.getAttribute('data-stagger')
                                );
                                const nestedStaggerSec = isNaN(nestedMs)
                                    ? groupStaggerSec
                                    : nestedMs / 1000;

                                Array.from(slot.nestedEl.children).forEach(
                                    (nestedChild, nestedIndex) => {
                                        tl.to(
                                            nestedChild,
                                            {
                                                y: 0,
                                                autoAlpha: 1,
                                                duration: animDuration,
                                                ease: animEase,
                                                onComplete: () =>
                                                    gsap.set(nestedChild, {
                                                        clearProps: 'all',
                                                    }),
                                            },
                                            slotTime + nestedIndex * nestedStaggerSec
                                        );
                                    }
                                );
                            }
                        });
                    },
                });
            });
        });

        return () => ctx.revert();
    }

    // Initialize all Encourt features
    function initEncourt() {
        try {
            // Add your feature initializers here
            // initSomeFeature();
            initImageCycle();
            initAdvancedFormValidation();
            initDirectionalButtonHover();
            initSwiperSlider();
            initContentRevealScroll();
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
