document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Slideshow functionality
    const slideshow = document.querySelector('.slideshow');
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevButton = document.querySelector('.slideshow-prev');
    const nextButton = document.querySelector('.slideshow-next');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        navDots[index].classList.add('active');
        currentSlide = index;
    }
    
    if (navDots.length > 0) {
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
        
        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }
    
    // Auto-advance slideshow
    let slideshowInterval;
    
    function startSlideshowInterval() {
        slideshowInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    function stopSlideshowInterval() {
        clearInterval(slideshowInterval);
    }
    
    if (slides.length > 0) {
        startSlideshowInterval();
        
        // Pause auto-advance on hover
        slideshow.addEventListener('mouseenter', stopSlideshowInterval);
        slideshow.addEventListener('mouseleave', startSlideshowInterval);
    }

    // Color selector functionality
    const colorOptions = document.querySelectorAll('.color-option');
    const iphoneImage = document.getElementById('iphone-image');
    
    if (colorOptions.length > 0 && iphoneImage) {
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.getAttribute('data-color');
                iphoneImage.src = `images/${color}.jpg`;
                
                colorOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });
    }

    // Modal functionality
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    if (modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
                }
            });
        });
    }
    
    if (modalCloseButtons.length > 0) {
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        });
    }
    
    // Close modal when clicking outside of modal content
    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        });
    }

    // Color showcase in modal
    const colorShowcaseOptions = document.querySelectorAll('.color-showcase-option');
    const modalIphoneImage = document.getElementById('modal-iphone-image');
    
    if (colorShowcaseOptions.length > 0 && modalIphoneImage) {
        colorShowcaseOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = option.getAttribute('data-color');
                modalIphoneImage.src = `images/${color}.jpg`;
                
                colorShowcaseOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });
    }

    // Enhanced section animations with Intersection Observer
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1]
    };
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const section = entry.target;
            const progress = entry.intersectionRatio;
            const isIntersecting = entry.isIntersecting;
            
            // Calculate distance from viewport center
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const distanceFromCenter = Math.abs((rect.top + rect.height / 2) - (viewportHeight / 2));
            const maxDistance = viewportHeight / 2 + rect.height / 2;
            const distanceRatio = 1 - Math.min(distanceFromCenter / maxDistance, 1);
            
            if (isIntersecting) {
                // Add visible class for base animation
                section.classList.add('visible');
                
                // Apply dynamic styles based on scroll position
                const scale = 0.98 + (distanceRatio * 0.02);
                const translateY = (1 - distanceRatio) * 30;
                // const opacity = 0.5 + (distanceRatio * 0.5); // REMOVED Opacity calculation
                
                section.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                // section.style.opacity = opacity; // REMOVED Opacity setting for section
                
                // Animate child elements with staggered timing
                const elements = section.querySelectorAll('.spec-item, .feature-description, h1, h2, h3, p, .button, .learn-more');
                elements.forEach((el, index) => {
                    const delay = index * 100 * (1 - progress);
                    const translateY = (1 - progress) * 20;
                    
                    el.style.transition = `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`;
                    el.style.transform = `translateY(${translateY}px)`;
                    // el.style.opacity = progress; // REMOVED Opacity setting for children
                });
                
                // Special animation for spec items
                const specItems = section.querySelectorAll('.spec-item');
                specItems.forEach((item, index) => {
                    const delay = 200 + (index * 100);
                    const progress = Math.min(distanceRatio * 1.5, 1);
                    
                    setTimeout(() => {
                        item.style.transform = `scale(${0.8 + (progress * 0.2)})`;
                        item.style.opacity = progress;
                    }, delay);
                });
                
                // Animate feature descriptions with fade and slide
                const featureDesc = section.querySelector('.feature-description');
                if (featureDesc) {
                    const delay = specItems.length * 100;
                    setTimeout(() => {
                        featureDesc.style.transform = 'translateY(0)';
                        // featureDesc.style.opacity = distanceRatio; // REMOVED this opacity override
                    }, delay);
                }
            } else {
                // Reset styles when section is not in viewport
                section.classList.remove('visible');
                section.style.transform = 'scale(0.98) translateY(30px)';
                // section.style.opacity = 0.5; // REMOVED Opacity reset for section
                
                const elements = section.querySelectorAll('.spec-item, .feature-description, h1, h2, h3, p, .button, .learn-more');
                elements.forEach(el => {
                    el.style.transform = 'translateY(20px)';
                    // el.style.opacity = 0; // REMOVED Opacity reset for children (CSS handles initial state)
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        sectionObserver.observe(section);
    });

    // Enhanced parallax and scroll-driven animations
    const heroImages = document.querySelectorAll('.hero-image img, .feature-image img');
    let rafId = null;
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        const scrollPosition = window.scrollY;
        const delta = (scrollPosition - lastScrollY) * 0.05;
        lastScrollY = scrollPosition;
        
        heroImages.forEach(img => {
            const parent = img.closest('section');
            const parentRect = parent.getBoundingClientRect();
            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Check if the section is in the viewport
            if (parentRect.top < viewportHeight && parentRect.bottom > 0) {
                // Calculate progress (0 when entering viewport, 1 when leaving)
                const progress = (viewportHeight - parentRect.top) / (viewportHeight + parentHeight);
                
                // Calculate parallax and scale effects
                const parallaxValue = Math.min(Math.max(progress * 30 - 15, -15), 15);
                const scaleValue = 1 + Math.min(Math.abs(progress - 0.5) * 0.1, 0.05);
                const rotateValue = delta * 2;
                
                // Apply smooth transform with subtle rotation based on scroll velocity
                img.style.transform = `
                    translate3d(0, ${parallaxValue}px, 0)
                    scale(${scaleValue})
                    rotate3d(0, 1, 0, ${rotateValue}deg)
                `;
                
                // Add subtle blur effect based on scroll speed
                const blurValue = Math.min(Math.abs(delta) * 2, 3);
                img.style.filter = `blur(${blurValue}px)`;
                
                // Adjust opacity based on visibility
                const opacity = progress < 0.1 || progress > 0.9 
                    ? Math.min(Math.max((progress - 0.1) * 10, 0), 1)
                    : 1;
                img.style.opacity = opacity;
            }
        });
        
        // Enhanced hero section parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            const heroProgress = -heroRect.top / heroRect.height;
            
            if (heroRect.top <= 0 && heroRect.bottom >= 0) {
                const translateY = heroProgress * 50;
                const scale = 1 + Math.abs(heroProgress) * 0.1;
                const opacity = 1 - Math.abs(heroProgress);
                
                hero.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
                hero.style.opacity = Math.max(opacity, 0.3);
            }
        }
        
        // Continue animation loop
        rafId = requestAnimationFrame(updateParallax);
    }
    
    // Start parallax animation
    window.addEventListener('scroll', () => {
        if (rafId === null) {
            rafId = requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
    
    // Stop animation when not scrolling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            // Reset blur effect
            heroImages.forEach(img => {
                img.style.filter = 'blur(0px)';
            });
        }, 150);
    }, { passive: true });

    // Enhanced Apple-style navigation behavior with scroll animations
    const desktopHeader = document.querySelector('.desktop-header');
    const mobileHeader = document.querySelector('.mobile-header');
    let lastScrollTop = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const scrollDelta = scrollTop - lastScrollTop;
        const scrollSpeed = Math.abs(scrollDelta);
        
        // Clear previous timer
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        // Add dynamic blur and opacity based on scroll speed
        const blurValue = Math.min(20, Math.max(10, scrollSpeed * 0.5));
        const opacityValue = Math.min(0.9, Math.max(0.8, 1 - scrollSpeed * 0.001));
        
        // Apply styles to both headers
        const headers = [desktopHeader, mobileHeader];
        headers.forEach(header => {
            if (header) {
                header.style.backdropFilter = `saturate(180%) blur(${blurValue}px)`;
                header.style.backgroundColor = `rgba(0, 0, 0, ${opacityValue})`;
                
                // Enhanced shadow effect
                if (scrollTop > 10) {
                    header.classList.add('scrolled');
                    header.style.boxShadow = `0 1px ${Math.min(10, scrollSpeed * 0.1)}px rgba(0, 0, 0, 0.2)`;
                } else {
                    header.classList.remove('scrolled');
                    header.style.boxShadow = 'none';
                }
            }
        });
        
        // Reset header styles when scroll stops
        scrollTimer = setTimeout(() => {
            headers.forEach(header => {
                if (header) {
                    header.style.backdropFilter = 'saturate(180%) blur(20px)';
                    header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    header.style.boxShadow = scrollTop > 10 ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none';
                }
            });
        }, 150);
        
        lastScrollTop = scrollTop;
    });

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.color-option, .compare-item, .buy-option, .camera-feature, .color-showcase-option');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const siblings = Array.from(element.parentNode.children).filter(child => child !== element);
            siblings.forEach(sibling => {
                sibling.style.opacity = '0.6';
            });
        });
        
        element.addEventListener('mouseleave', () => {
            const siblings = Array.from(element.parentNode.children);
            siblings.forEach(sibling => {
                sibling.style.opacity = '1';
            });
        });
    });


    // Add scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.getElementById('apple-intelligence');
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add CSS for the dynamic classes
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .spec-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .spec-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-description {
            opacity: 0;
            transform: translateY(15px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .feature-description.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        header {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .global-nav, .local-nav {
            transition: transform 0.3s ease;
        }
        
        header.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .color-option, .compare-item, .buy-option {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0px);
            }
        }
        
        .hero h1 {
            animation: float 6s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    // Enhanced Apple-style cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: rgba(0, 113, 227, 0.2);
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 9999;
            transition: width 0.3s, height 0.3s, background-color 0.3s;
            display: none;
            mix-blend-mode: difference;
        }
        
        a:hover ~ .custom-cursor,
        button:hover ~ .custom-cursor,
        .color-option:hover ~ .custom-cursor,
        .color-showcase-option:hover ~ .custom-cursor,
        .nav-dot:hover ~ .custom-cursor,
        .slideshow-prev:hover ~ .custom-cursor,
        .slideshow-next:hover ~ .custom-cursor,
        .modal-close:hover ~ .custom-cursor {
            width: 40px;
            height: 40px;
            background-color: rgba(0, 113, 227, 0.3);
        }
        
        @media (pointer: fine) {
            .custom-cursor {
                display: block;
            }
        }
    `;
    document.head.appendChild(cursorStyle);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    const interactiveElementsForCursor = document.querySelectorAll('a, button, .color-option, .color-showcase-option, .nav-dot, .slideshow-prev, .slideshow-next, .modal-close');
    
    interactiveElementsForCursor.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(0, 113, 227, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'rgba(0, 113, 227, 0.2)';
        });
    });

    // Add sticky local navigation on scroll
    const localNavLinks = document.querySelectorAll('.local-nav-links a');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        // Find the current section
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Highlight the current section in the navigation
        if (currentSection) {
            localNavLinks.forEach(link => {
                link.classList.remove('active');
                
                const href = link.getAttribute('href').substring(1);
                if (href === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Enhanced active class style
    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .local-nav-links a.active {
            opacity: 1;
            color: #fff;
            font-weight: 500;
            position: relative;
        }
        
        .local-nav-links a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            background-color: var(--accent-color);
            border-radius: 50%;
        }
    `;
    document.head.appendChild(activeStyle);

    // Add parallax effect to sections
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                
                const speed = section.getAttribute('data-parallax-speed') || 0.1;
                const yPos = -(scrollPosition - sectionTop) * speed;
                
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
});

// Initialize mobile menu functionality
function initMobileMenu() {
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
    console.log('Toggle mobile menu clicked');
    const body = document.body;
    body.classList.toggle('mobile-menu-open');
    
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        console.log('Mobile menu found');
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
    } else {
        console.log('Mobile menu not found, creating it now');
        createMobileMenu();
        // Try again after creating the menu
        setTimeout(toggleMobileMenu, 100);
    }
}

// Create mobile menu
function createMobileMenu() {
    // Check if mobile menu already exists
    if (document.querySelector('.mobile-menu')) {
        console.log('Mobile menu already exists, not creating a new one');
        return;
    }
    
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
    
    // Add navigation links to mobile menu - only select from desktop header to avoid duplicates
    const navLinks = document.querySelectorAll('.desktop-header .main-nav .nav-link');
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
            
            // Get href attribute
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link
            if (href.startsWith('#')) {
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    toggleMobileMenu();
                    
                    // Smooth scroll to target
                    setTimeout(() => {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            } else {
                // For non-anchor links, navigate to the URL
                window.location.href = href;
            }
        });
        
        mobileMenu.appendChild(mobileLink);
    });
    
    // Add mobile menu to the body
    document.body.appendChild(mobileMenu);
    
    // Add CSS for mobile menu open state
    const style = document.createElement('style');
    style.textContent = `
        body.mobile-menu-open {
            overflow: hidden;
        }
        
        .mobile-menu {
            background-color: rgba(0, 0, 0, 0.9);
        }
        
        .mobile-nav-link {
            display: block;
            width: 100%;
        }
        
        .mobile-nav-link:last-child {
            border-bottom: none;
        }
    `;
    document.head.appendChild(style);
}
