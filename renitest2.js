/**
 * Modern Landing Page JavaScript
 * Focuses on performance, accessibility, and user experience
 * Author: Professional Web Developer
 * Version: 2024-2025
 */

'use strict';

// ================================
// Performance Monitoring
// ================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.initializeObservers();
    }

    initializeObservers() {
        // Only initialize if PerformanceObserver is supported
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }

        try {
            // Monitor Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
                this.logMetric('LCP', this.metrics.LCP);
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entry = list.getEntries()[0];
                this.metrics.FID = entry.processingStart - entry.startTime;
                this.logMetric('FID', this.metrics.FID);
            });
            fidObserver.observe({ type: 'first-input', buffered: true });

            // Monitor Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.CLS = clsValue;
                this.logMetric('CLS', this.metrics.CLS);
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

        } catch (error) {
            console.error('Error setting up performance observers:', error);
        }
    }

    logMetric(name, value) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`${name}: ${Math.round(name === 'CLS' ? value * 1000 : value)}${name === 'CLS' ? '' : 'ms'}`);
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// ================================
// Smooth Scrolling Enhancement
// ================================

class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Enhanced smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const href = target.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();

            // Calculate offset for better positioning
            const offset = 80; // Adjust based on any fixed headers
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update focus for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
        });
    }
}

// ================================
// Intersection Observer for Animations
// ================================

class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            // Fallback: just add the class immediately
            this.addFallbackAnimations();
            return;
        }

        this.setupObserver();
        this.observeElements();
    }

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll('.section, .service-item, .benefit-item, .experience-item');
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    addFallbackAnimations() {
        const elementsToAnimate = document.querySelectorAll('.section, .service-item, .benefit-item, .experience-item');
        elementsToAnimate.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}

// ================================
// Contact Form Enhancement
// ================================

class ContactManager {
    constructor() {
        this.initializeContactEvents();
    }

    initializeContactEvents() {
        // Enhance mailto links with tracking
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', this.trackEmailClick.bind(this));
        });

        // Enhance tel links with tracking
        const telLinks = document.querySelectorAll('a[href^="tel:"]');
        telLinks.forEach(link => {
            link.addEventListener('click', this.trackPhoneClick.bind(this));
        });

        // Add hover effects for better UX
        this.addHoverEffects();
    }

    trackEmailClick(e) {
        if (window.gtag) {
            gtag('event', 'email_click', {
                'event_category': 'contact',
                'event_label': 'email_contact'
            });
        }
        console.log('Email contact initiated');
    }

    trackPhoneClick(e) {
        if (window.gtag) {
            gtag('event', 'phone_click', {
                'event_category': 'contact',
                'event_label': 'phone_contact'
            });
        }
        console.log('Phone contact initiated');
    }

    addHoverEffects() {
        const contactButtons = document.querySelectorAll('.btn');
        contactButtons.forEach(button => {
            // Add subtle animation on hover
            button.addEventListener('mouseenter', () => {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    button.style.transform = 'translateY(-2px)';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
}

// ================================
// Accessibility Enhancements
// ================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLinkFunctionality();
        this.enhanceKeyboardNavigation();
        this.addARIAEnhancements();
        this.monitorFocusManagement();
    }

    addSkipLinkFunctionality() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    }

    enhanceKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, [tabindex]');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && element.tabIndex === -1) {
                element.tabIndex = 0;
            }
        });
    }

    addARIAEnhancements() {
        // Add aria-label to buttons with only icons
        const iconButtons = document.querySelectorAll('.btn svg');
        iconButtons.forEach(icon => {
            const button = icon.closest('.btn');
            if (button && !button.hasAttribute('aria-label')) {
                const text = button.textContent.trim();
                if (text) {
                    button.setAttribute('aria-label', text);
                }
            }
        });
    }

    monitorFocusManagement() {
        // Ensure focus is visible for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// ================================
// Error Handling and Logging
// ================================

class ErrorManager {
    constructor() {
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    handleError(event) {
        console.error('JavaScript Error:', {
            message: event.message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
            error: event.error
        });

        // In production, you might want to send this to an error tracking service
        if (window.location.hostname !== 'localhost') {
            // Send to error tracking service (e.g., Sentry, LogRocket)
        }
    }

    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
    }
}

// ================================
// Main Application
// ================================

class ReniLandingPage {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize core modules
            this.modules.errorManager = new ErrorManager();
            this.modules.performanceMonitor = new PerformanceMonitor();
            this.modules.smoothScrollManager = new SmoothScrollManager();
            this.modules.animationManager = new AnimationManager();
            this.modules.contactManager = new ContactManager();
            this.modules.accessibilityManager = new AccessibilityManager();

            this.isInitialized = true;
            console.log('Reni Landing Page initialized successfully');

            // Report initialization time
            const initTime = performance.now();
            console.log(`Initialization completed in ${Math.round(initTime)}ms`);

        } catch (error) {
            console.error('Failed to initialize Reni Landing Page:', error);
        }
    }

    getModule(name) {
        return this.modules[name];
    }

    destroy() {
        // Cleanup method for SPA environments
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        this.modules = {};
        this.isInitialized = false;
    }
}

// ================================
// Initialize Application
// ================================

// Create global instance
const reniLandingPage = new ReniLandingPage();

// Initialize when script loads
reniLandingPage.init().catch(error => {
    console.error('Critical initialization error:', error);
});

// Expose to global scope for debugging
window.ReniLandingPage = reniLandingPage;

// ================================
// Additional Utility Functions
// ================================

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Feature detection utility
function supportsFeature(feature) {
    const features = {
        'webp': () => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        },
        'avif': () => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        },
        'intersection-observer': () => 'IntersectionObserver' in window,
        'service-worker': () => 'serviceWorker' in navigator,
        'local-storage': () => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    return features[feature] ? features[feature]() : false;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ReniLandingPage, debounce, throttle, supportsFeature };
}

// STUNNING HERO INTERACTIONS
document.addEventListener('DOMContentLoaded', function() {
    
    // Create floating particles
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.hero').appendChild(particlesContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Typewriter effect for subtitle
    const subtitles = [
        "Building the future of web experiences",
        "Where innovation meets creativity",
        "Transforming ideas into reality",
        "Next-level digital solutions"
    ];
    
    let subtitleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const subtitle = document.querySelector('.subtitle');
        if (!subtitle) return;
        
        const currentText = subtitles[subtitleIndex];
        
        if (isDeleting) {
            subtitle.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="typewriter"></span>';
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                subtitleIndex = (subtitleIndex + 1) % subtitles.length;
                setTimeout(typeWriter, 500);
                return;
            }
        } else {
            subtitle.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="typewriter"></span>';
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, 2000);
                return;
            }
        }
        
        setTimeout(typeWriter, isDeleting ? 50 : 100);
    }
    
    // Magnetic button effect
    document.querySelectorAll('.hero-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const hero = document.querySelector('.hero');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px)`;
        }
    });
    
    // Smooth scroll on indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize effects
    createParticles();
    setTimeout(typeWriter, 1000);
    
    // Add glow effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.boxShadow = `0 ${8 + scrolled * 0.1}px ${32 + scrolled * 0.1}px rgba(131, 56, 236, ${0.3 + scrolled * 0.001})`;
        }
    });
});
