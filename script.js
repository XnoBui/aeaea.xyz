// SOMA Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initAnimations();
    initNavigation();
    initScrollEffects();
});

// Initialize animations for page elements
function initAnimations() {
    // Animate SOMA logo SVG with a slight delay
    const somaLogo = document.querySelector('.soma-logo-svg');
    if (somaLogo) {
        setTimeout(() => {
            somaLogo.style.opacity = '1';
            somaLogo.style.transform = 'translateY(0)';
        }, 300);
    }

    // Animate hero subtitle with a slight delay
    const heroSubtitle = document.querySelector('.hero-subtitle-jp');
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
    }
    
    // Initialize feature sections with initial reveal
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
    
    // Set up dynamic shimmer effect for main title
    setupDynamicShimmer();
    
    // Do NOT animate intro section on page load - only on scroll
}

// Set up dynamic shimmer effect based on text length
function setupDynamicShimmer() {
    const mainTitle = document.querySelector('.hero-main-title');
    const ctaTitle = document.querySelector('.cta-title');
    const featurePoints = document.querySelectorAll('.feature-point');
    
    if (mainTitle) {
        // Get the text content length
        const textLength = mainTitle.textContent.length;
        // Calculate dynamic spread - adjust multiplier as needed
        const dynamicSpread = Math.max(20, Math.min(60, textLength * 0.8));
        // Set the CSS variable
        mainTitle.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
    }
    
    if (ctaTitle) {
        // Apply similar effect to CTA title
        const textLength = ctaTitle.textContent.length;
        const dynamicSpread = Math.max(20, Math.min(60, textLength * 0.8));
        ctaTitle.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
    }
    
    // Apply shimmer effect to feature points
    if (featurePoints.length > 0) {
        featurePoints.forEach(point => {
            const textLength = point.textContent.length;
            // Use a smaller spread for feature points since they're smaller text
            const dynamicSpread = Math.max(10, Math.min(30, textLength * 0.6));
            point.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
        });
    }
    
    // Recalculate on window resize for responsive behavior
    window.addEventListener('resize', () => {
        if (mainTitle) {
            const textLength = mainTitle.textContent.length;
            // Adjust spread based on viewport width for mobile
            const multiplier = window.innerWidth < 768 ? 0.5 : 0.8;
            const dynamicSpread = Math.max(15, Math.min(60, textLength * multiplier));
            mainTitle.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
        }
        
        if (ctaTitle) {
            const textLength = ctaTitle.textContent.length;
            const multiplier = window.innerWidth < 768 ? 0.5 : 0.8;
            const dynamicSpread = Math.max(15, Math.min(60, textLength * multiplier));
            ctaTitle.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
        }
        
        // Update feature points on resize
        if (featurePoints.length > 0) {
            featurePoints.forEach(point => {
                const textLength = point.textContent.length;
                // Smaller multiplier for mobile
                const multiplier = window.innerWidth < 768 ? 0.4 : 0.6;
                const dynamicSpread = Math.max(8, Math.min(25, textLength * multiplier));
                point.style.setProperty('--shimmer-spread', `${dynamicSpread}px`);
            });
        }
    });
}

// Animate intro section elements (Apple-style)
function animateIntroSection() {
    // Animate main title
    const mainTitle = document.querySelector('.hero-main-title');
    if (mainTitle && !mainTitle.classList.contains('revealed')) {
        mainTitle.classList.add('revealed');
        
        // Animate feature points with staggered delay only after title animation starts
        const featurePoints = document.querySelectorAll('.feature-point');
        featurePoints.forEach((point, index) => {
            setTimeout(() => {
                point.classList.add('revealed');
            }, 800 + (index * 300)); // Slower animation: 800ms delay after title + 300ms between each point
        });
    }
}

// Initialize smooth scrolling for navigation and mobile menu
function initNavigation() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section based on link text
            let targetId;
            const linkText = this.textContent.trim().toLowerCase();
            
            if (linkText === 'whitepaper') {
                targetId = 'feature-shape';
            } else if (linkText === 'connect') {
                targetId = 'collection-section';
            }
            
            if (targetId) {
                const targetSection = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
                if (targetSection) {
                    // Smooth scroll to target
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (document.body.classList.contains('mobile-menu-open')) {
                        toggleMobileMenu();
                    }
                }
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', toggleMobileMenu);
    }
    
    // Create mobile menu if it doesn't exist
    if (!document.querySelector('.mobile-menu')) {
        createMobileMenu();
    }
}

// Toggle mobile menu visibility
function toggleMobileMenu() {
    const body = document.body;
    body.classList.toggle('mobile-menu-open');
    
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        if (body.classList.contains('mobile-menu-open')) {
            mobileMenu.style.display = 'flex';
            setTimeout(() => {
                mobileMenu.style.opacity = '1';
                mobileMenu.style.transform = 'translateY(0)';
            }, 10);
        } else {
            mobileMenu.style.opacity = '0';
            mobileMenu.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 300);
        }
    }
}

// Create mobile menu
function createMobileMenu() {
    // Create mobile menu element
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.display = 'none';
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-20px)';
    mobileMenu.style.position = 'fixed';
    mobileMenu.style.top = '80px';
    mobileMenu.style.left = '0';
    mobileMenu.style.width = '100%';
    mobileMenu.style.padding = '20px';
    mobileMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    mobileMenu.style.backdropFilter = 'blur(20px)';
    mobileMenu.style.WebkitBackdropFilter = 'blur(20px)';
    mobileMenu.style.zIndex = '99';
    mobileMenu.style.flexDirection = 'column';
    mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add navigation links to mobile menu
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    navLinks.forEach(link => {
        const mobileLink = document.createElement('a');
        mobileLink.href = link.href;
        mobileLink.className = 'mobile-nav-link';
        mobileLink.textContent = link.textContent;
        mobileLink.style.color = '#FFFFFF';
        mobileLink.style.textDecoration = 'none';
        mobileLink.style.padding = '15px 0';
        mobileLink.style.fontSize = '14px';
        mobileLink.style.fontWeight = '700';
        mobileLink.style.textTransform = 'uppercase';
        mobileLink.style.letterSpacing = '0.05em';
        mobileLink.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Add click event to mobile links
        mobileLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section based on link text
            let targetId;
            const linkText = this.textContent.trim().toLowerCase();
            
            if (linkText === 'whitepaper') {
                targetId = 'feature-shape';
            } else if (linkText === 'connect') {
                targetId = 'collection-section';
            }
            
            if (targetId) {
                const targetSection = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
                if (targetSection) {
                    // Close mobile menu
                    toggleMobileMenu();
                    
                    // Smooth scroll to target
                    setTimeout(() => {
                        targetSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
        
        mobileMenu.appendChild(mobileLink);
    });
    
    // Add mobile menu to the body
    document.body.appendChild(mobileMenu);
}

// Initialize scroll-based effects
function initScrollEffects() {
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        // Get current scroll position
        const scrollPosition = window.scrollY;
        
        // Parallax effect for hero section background
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrollRelative = scrollPosition;
            if (scrollRelative > 0) {
                heroSection.style.backgroundPositionY = `${scrollRelative * 0.05}px`;
            }
        }
        
        // Reveal elements on scroll
        revealOnScroll();
    });
    
    // Initial check for elements in view
    revealOnScroll();
}

// Animate CTA section elements (similar to intro section)
function animateCtaSection() {
    // Animate CTA title
    const ctaTitle = document.querySelector('.cta-title');
    if (ctaTitle && !ctaTitle.classList.contains('revealed')) {
        ctaTitle.classList.add('revealed');
        
        // Animate description and image container with staggered delay
        const ctaDescription = document.querySelector('.cta-description');
        const ctaImageContainer = document.querySelector('.cta-image-container');
        
        if (ctaDescription) {
            setTimeout(() => {
                ctaDescription.classList.add('revealed');
            }, 300);
        }
        
        if (ctaImageContainer) {
            setTimeout(() => {
                ctaImageContainer.classList.add('revealed');
            }, 600);
        }
    }
}

// Animate Collection section elements (similar to intro section)
function animateCollectionSection() {
    // Animate Collection logo container
    const collectionLogoContainer = document.querySelector('.collection-logo-container');
    if (collectionLogoContainer && !collectionLogoContainer.classList.contains('revealed')) {
        collectionLogoContainer.classList.add('revealed');
        
        // Animate title container and info with staggered delay
        const collectionTitleContainer = document.querySelector('.collection-title-container');
        const collectionInfo = document.querySelector('.collection-info');
        
        if (collectionTitleContainer) {
            setTimeout(() => {
                collectionTitleContainer.classList.add('revealed');
            }, 300);
        }
        
        if (collectionInfo) {
            setTimeout(() => {
                collectionInfo.classList.add('revealed');
            }, 600);
        }
    }
}

// Reveal elements when they come into view
function revealOnScroll() {
    // Select elements to reveal
    const featureItems = document.querySelectorAll('.feature-item');
    const featureTextContainers = document.querySelectorAll('.feature-text-container');
    const featureTitleFrames = document.querySelectorAll('.feature-title-frame');
    const featureDescriptionFrames = document.querySelectorAll('.feature-description-frame');
    const agentItems = document.querySelectorAll('.agent-item img');
    const introSection = document.querySelector('.intro-section');
    const ctaSection = document.querySelector('.cta-section');
    
    // Check if elements are in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
            rect.top >= 0 &&
            rect.bottom >= 0
        );
    };
    
    // Special check for intro section with higher sensitivity
    if (introSection) {
        const rect = introSection.getBoundingClientRect();
        // More sensitive check - trigger when just 10% of the section is visible
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 && 
            rect.bottom >= 0) {
            animateIntroSection();
        }
    }
    
    // Special check for CTA section with higher sensitivity
    if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        // More sensitive check - trigger when just 10% of the section is visible
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 && 
            rect.bottom >= 0) {
            animateCtaSection();
        }
    }
    
    // Special check for Collection section with higher sensitivity
    const collectionSection = document.querySelector('.collection-section');
    if (collectionSection) {
        const rect = collectionSection.getBoundingClientRect();
        // More sensitive check - trigger when just 10% of the section is visible
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 && 
            rect.bottom >= 0) {
            animateCollectionSection();
        }
    }
    
    // Reveal feature items
    featureItems.forEach(item => {
        if (isInViewport(item)) {
            item.classList.add('revealed');
            
            // Also reveal the text container, title frame, and description frame within this feature item
            const textContainer = item.querySelector('.feature-text-container');
            const titleFrame = item.querySelector('.feature-title-frame');
            const descriptionFrame = item.querySelector('.feature-description-frame');
            
            if (textContainer) {
                setTimeout(() => {
                    textContainer.classList.add('revealed');
                }, 200);
            }
            
            if (titleFrame) {
                setTimeout(() => {
                    titleFrame.classList.add('revealed');
                }, 400);
            }
            
            if (descriptionFrame) {
                setTimeout(() => {
                    descriptionFrame.classList.add('revealed');
                }, 600);
            }
        }
    });
    
    // Reveal agent items with staggered delay
    agentItems.forEach((item, index) => {
        if (isInViewport(item)) {
            setTimeout(() => {
                item.classList.add('revealed');
            }, index * 100);
        }
    });
}

// Add hover effects for interactive elements
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add parallax effect for feature images
function parallaxFeatureImages() {
    const featureImages = document.querySelectorAll('.feature-image');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        featureImages.forEach(image => {
            const parent = image.closest('.feature-item');
            if (parent && isElementInViewport(parent)) {
                const moveX = (mouseX - 0.5) * 20;
                const moveY = (mouseY - 0.5) * 20;
                image.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    });
}

// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}

// Initialize parallax effect
parallaxFeatureImages();

// Add a simple preloader
window.addEventListener('load', function() {
    // Hide preloader when page is fully loaded
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    initAnimations();
    
    // Check for elements in view
    revealOnScroll();
});
