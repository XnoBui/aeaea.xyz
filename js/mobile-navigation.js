/**
 * Enhanced Mobile Navigation for AEAEA Website
 * Handles bottom navigation active states, smooth scrolling, and mobile interactions
 */

class MobileNavigation {
    constructor() {
        this.bottomNav = document.querySelector('.bottom-nav');
        this.navLinks = document.querySelectorAll('.bottom-nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }

    init() {
        if (!this.bottomNav || this.navLinks.length === 0) return;
        
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.updateActiveNavOnLoad();
    }

    setupEventListeners() {
        // Handle nav link clicks with smooth scrolling
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(link);
            });

            // Add touch feedback
            link.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            link.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        });

        // Handle scroll events for active state updates
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100), { passive: true });
        
        // Handle resize events
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
    }

    setupIntersectionObserver() {
        // Use Intersection Observer for better performance
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is 20% from top
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNav(entry.target.id);
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    handleNavClick(clickedLink) {
        const targetId = clickedLink.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) return;

        // Add immediate visual feedback
        this.setActiveNav(targetId);
        
        // Calculate scroll position accounting for fixed headers
        const headerHeight = document.querySelector('nav')?.offsetHeight || 60;
        const bottomNavHeight = this.bottomNav.offsetHeight || 60;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        // Smooth scroll to target
        this.smoothScrollTo(targetPosition);
        
        // Add haptic feedback if supported
        this.triggerHapticFeedback();
    }

    smoothScrollTo(targetPosition) {
        this.isScrolling = true;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Reset scrolling flag after animation
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    handleScroll() {
        if (this.isScrolling) return;
        
        // Find the section currently in view
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let currentSection = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            this.setActiveNav(currentSection);
        }
    }

    setActiveNav(activeId) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        const activeLink = document.querySelector(`.bottom-nav-link[href="#${activeId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updateActiveNavOnLoad() {
        // Set initial active state based on current scroll position
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            this.setActiveNav(targetId);
        } else {
            // Default to first section if no hash
            if (this.sections.length > 0) {
                this.setActiveNav(this.sections[0].id);
            }
        }
    }

    handleTouchStart(e) {
        const link = e.currentTarget;
        link.style.transform = 'translateY(-1px) scale(0.98)';
        link.style.transition = 'transform 0.1s ease';
    }

    handleTouchEnd(e) {
        const link = e.currentTarget;
        setTimeout(() => {
            link.style.transform = '';
            link.style.transition = 'all 0.3s ease';
        }, 100);
    }

    handleResize() {
        // Recalculate positions on resize
        if (window.innerWidth > 768) {
            // Hide bottom nav on desktop
            this.bottomNav.style.display = 'none';
        } else {
            this.bottomNav.style.display = 'flex';
        }
    }

    triggerHapticFeedback() {
        // Trigger haptic feedback on supported devices
        if ('vibrate' in navigator) {
            navigator.vibrate(10); // Very subtle vibration
        }
    }

    // Utility function for throttling events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Public method to destroy the navigation (cleanup)
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick);
            link.removeEventListener('touchstart', this.handleTouchStart);
            link.removeEventListener('touchend', this.handleTouchEnd);
        });
    }
}

// Enhanced Mobile Menu Toggle (for future hamburger menu implementation)
class MobileMenuToggle {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;
        
        if (this.menuToggle) {
            this.init();
        }
    }

    init() {
        this.createToggleButton();
        this.setupEventListeners();
    }

    createToggleButton() {
        // Create hamburger menu button if it doesn't exist
        if (!this.menuToggle) {
            const nav = document.querySelector('nav');
            const toggleButton = document.createElement('button');
            toggleButton.className = 'mobile-menu-toggle';
            toggleButton.innerHTML = '☰';
            toggleButton.setAttribute('aria-label', 'Toggle mobile menu');
            nav.appendChild(toggleButton);
            this.menuToggle = toggleButton;
        }
    }

    setupEventListeners() {
        this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('nav')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.menuToggle.innerHTML = '✕';
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        if (this.navLinks) {
            this.navLinks.style.display = 'flex';
            this.navLinks.style.flexDirection = 'column';
            this.navLinks.style.position = 'absolute';
            this.navLinks.style.top = '100%';
            this.navLinks.style.left = '0';
            this.navLinks.style.right = '0';
            this.navLinks.style.background = 'rgba(20, 20, 20, 0.95)';
            this.navLinks.style.backdropFilter = 'blur(20px)';
            this.navLinks.style.padding = '20px';
            this.navLinks.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }

    closeMenu() {
        this.isOpen = false;
        this.menuToggle.innerHTML = '☰';
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        if (this.navLinks) {
            this.navLinks.style.display = 'none';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        window.mobileNavigation = new MobileNavigation();
        window.mobileMenuToggle = new MobileMenuToggle();
    }
    
    // Re-initialize on resize if needed
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && !window.mobileNavigation) {
            window.mobileNavigation = new MobileNavigation();
            window.mobileMenuToggle = new MobileMenuToggle();
        } else if (window.innerWidth > 768 && window.mobileNavigation) {
            window.mobileNavigation.destroy();
            window.mobileNavigation = null;
        }
    });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileNavigation, MobileMenuToggle };
}
