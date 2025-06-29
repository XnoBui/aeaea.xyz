/**
 * HOLOWORLD.COM MOUSE TRACKING ANALYSIS & IMPLEMENTATION
 * =====================================================
 * 
 * Phân tích cách Holoworld.com implement tính năng 3D character theo mouse movement
 * Dựa trên Live2D technology và modern web techniques
 */

// ===== 1. CORE MOUSE TRACKING SYSTEM =====

class HoloworldMouseTracker {
    constructor(characterElement, options = {}) {
        this.character = characterElement;
        this.options = {
            // Sensitivity settings
            rotationSensitivity: options.rotationSensitivity || 15,
            eyeTrackingSensitivity: options.eyeTrackingSensitivity || 8,
            smoothing: options.smoothing || 0.1,
            
            // Animation settings
            transitionDuration: options.transitionDuration || '0.1s',
            breathingEnabled: options.breathingEnabled || true,
            blinkingEnabled: options.blinkingEnabled || true,
            
            // Boundaries
            maxRotationX: options.maxRotationX || 10,
            maxRotationY: options.maxRotationY || 15,
        };
        
        // State variables
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        
        // Window dimensions
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        
        // Animation frame ID
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAnimationLoop();
        
        if (this.options.breathingEnabled) {
            this.startBreathingAnimation();
        }
        
        if (this.options.blinkingEnabled) {
            this.startBlinkingAnimation();
        }
    }
    
    // ===== 2. EVENT LISTENERS =====
    
    setupEventListeners() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (event) => {
            this.updateMousePosition(event);
        });
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.updateWindowDimensions();
        });
        
        // Mouse enter/leave effects
        document.addEventListener('mouseenter', () => {
            this.onMouseEnter();
        });
        
        document.addEventListener('mouseleave', () => {
            this.onMouseLeave();
        });
    }
    
    // ===== 3. MOUSE POSITION CALCULATION =====
    
    updateMousePosition(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        
        // Calculate normalized coordinates (-1 to 1)
        const normalizedX = (this.mouseX / this.windowWidth) * 2 - 1;
        const normalizedY = (this.mouseY / this.windowHeight) * 2 - 1;
        
        // Calculate target rotations
        this.targetRotationY = normalizedX * this.options.rotationSensitivity;
        this.targetRotationX = -normalizedY * this.options.rotationSensitivity;
        
        // Clamp rotations to boundaries
        this.targetRotationX = Math.max(-this.options.maxRotationX, 
                                      Math.min(this.options.maxRotationX, this.targetRotationX));
        this.targetRotationY = Math.max(-this.options.maxRotationY, 
                                      Math.min(this.options.maxRotationY, this.targetRotationY));
        
        // Update eye tracking
        this.updateEyeTracking(normalizedX, normalizedY);
    }
    
    // ===== 4. 3D CHARACTER ROTATION =====
    
    updateCharacterRotation() {
        // Smooth interpolation using lerp (linear interpolation)
        this.currentRotationX = this.lerp(this.currentRotationX, this.targetRotationX, this.options.smoothing);
        this.currentRotationY = this.lerp(this.currentRotationY, this.targetRotationY, this.options.smoothing);
        
        // Apply 3D transformation
        const transform = `
            perspective(1000px) 
            rotateX(${this.currentRotationX}deg) 
            rotateY(${this.currentRotationY}deg)
        `;
        
        this.character.style.transform = transform;
    }
    
    // ===== 5. EYE TRACKING SYSTEM =====
    
    updateEyeTracking(normalizedX, normalizedY) {
        const pupils = this.character.querySelectorAll('.pupil');
        
        pupils.forEach(pupil => {
            const moveX = normalizedX * this.options.eyeTrackingSensitivity;
            const moveY = normalizedY * this.options.eyeTrackingSensitivity;
            
            pupil.style.transform = `
                translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))
            `;
        });
    }
    
    // ===== 6. BREATHING ANIMATION =====
    
    startBreathingAnimation() {
        let breathPhase = 0;
        const breathingSpeed = 0.02;
        const breathingIntensity = 0.015;
        
        const breathe = () => {
            breathPhase += breathingSpeed;
            const breathScale = 1 + Math.sin(breathPhase) * breathingIntensity;
            
            // Apply subtle breathing scale
            const currentTransform = this.character.style.transform || '';
            const breathTransform = `${currentTransform} scale(${breathScale})`;
            
            this.character.style.transform = breathTransform;
            
            setTimeout(breathe, 50);
        };
        
        breathe();
    }
    
    // ===== 7. BLINKING ANIMATION =====
    
    startBlinkingAnimation() {
        const eyes = this.character.querySelectorAll('.eye');
        
        const blink = () => {
            eyes.forEach(eye => {
                eye.style.transform = 'scaleY(0.1)';
                setTimeout(() => {
                    eye.style.transform = 'scaleY(1)';
                }, 150);
            });
            
            // Random blink interval (2-6 seconds)
            const nextBlink = Math.random() * 4000 + 2000;
            setTimeout(blink, nextBlink);
        };
        
        // Start first blink after random delay
        setTimeout(blink, Math.random() * 3000 + 1000);
    }
    
    // ===== 8. ANIMATION LOOP =====
    
    startAnimationLoop() {
        const animate = () => {
            this.updateCharacterRotation();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // ===== 9. UTILITY FUNCTIONS =====
    
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    updateWindowDimensions() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }
    
    onMouseEnter() {
        // Add hover effects
        this.character.style.filter = 'brightness(1.1)';
    }
    
    onMouseLeave() {
        // Reset to neutral position
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.character.style.filter = 'brightness(1)';
    }
    
    // ===== 10. CLEANUP =====
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.updateMousePosition);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
}

// ===== ADVANCED LIVE2D-STYLE FEATURES =====

class Live2DEnhancedTracker extends HoloworldMouseTracker {
    constructor(characterElement, options = {}) {
        super(characterElement, options);
        
        // Enhanced features
        this.facialExpressions = options.facialExpressions || true;
        this.headTiltEnabled = options.headTiltEnabled || true;
        this.bodySwayEnabled = options.bodySwayEnabled || true;
    }
    
    // Enhanced mouse tracking with facial expressions
    updateMousePosition(event) {
        super.updateMousePosition(event);
        
        if (this.facialExpressions) {
            this.updateFacialExpression(event);
        }
        
        if (this.headTiltEnabled) {
            this.updateHeadTilt(event);
        }
        
        if (this.bodySwayEnabled) {
            this.updateBodySway(event);
        }
    }
    
    updateFacialExpression(event) {
        const mouth = this.character.querySelector('.mouth');
        if (!mouth) return;
        
        // Change mouth expression based on mouse position
        const normalizedY = (event.clientY / this.windowHeight) * 2 - 1;
        
        if (normalizedY < -0.3) {
            // Happy expression when mouse is at top
            mouth.style.borderRadius = '40px 40px 0 0';
            mouth.style.borderTop = '3px solid #ff6b6b';
            mouth.style.borderBottom = 'none';
        } else {
            // Normal expression
            mouth.style.borderRadius = '0 0 40px 40px';
            mouth.style.borderTop = 'none';
            mouth.style.borderBottom = '3px solid #ff6b6b';
        }
    }
    
    updateHeadTilt(event) {
        const face = this.character.querySelector('.character-face');
        if (!face) return;
        
        const normalizedX = (event.clientX / this.windowWidth) * 2 - 1;
        const tiltAngle = normalizedX * 5; // Max 5 degrees tilt
        
        face.style.transform = `translateX(-50%) rotate(${tiltAngle}deg)`;
    }
    
    updateBodySway(event) {
        const body = this.character.querySelector('.character-body');
        if (!body) return;
        
        const normalizedX = (event.clientX / this.windowWidth) * 2 - 1;
        const swayAmount = normalizedX * 3; // Max 3px sway
        
        body.style.transform = `translateX(calc(-50% + ${swayAmount}px))`;
    }
}

// ===== USAGE EXAMPLES =====

/**
 * CÁCH SỬ DỤNG:
 * 
 * 1. Basic Implementation:
 * const character = document.getElementById('character');
 * const tracker = new HoloworldMouseTracker(character);
 * 
 * 2. Advanced Implementation with options:
 * const tracker = new HoloworldMouseTracker(character, {
 *     rotationSensitivity: 20,
 *     eyeTrackingSensitivity: 10,
 *     smoothing: 0.15,
 *     breathingEnabled: true,
 *     blinkingEnabled: true
 * });
 * 
 * 3. Live2D Enhanced Version:
 * const enhancedTracker = new Live2DEnhancedTracker(character, {
 *     facialExpressions: true,
 *     headTiltEnabled: true,
 *     bodySwayEnabled: true
 * });
 */

// ===== PERFORMANCE OPTIMIZATION TIPS =====

/**
 * OPTIMIZATION TECHNIQUES USED BY HOLOWORLD:
 * 
 * 1. RequestAnimationFrame: Smooth 60fps animations
 * 2. Linear Interpolation (Lerp): Smooth transitions
 * 3. Throttling: Limit calculation frequency
 * 4. Transform3D: Hardware acceleration
 * 5. Will-change CSS property: Optimize rendering
 * 6. Boundary clamping: Prevent extreme rotations
 * 7. Event delegation: Efficient event handling
 */

// ===== CSS OPTIMIZATION =====

const CSS_OPTIMIZATIONS = `
/* Hardware acceleration */
.character {
    will-change: transform;
    transform-style: preserve-3d;
    backface-visibility: hidden;
}

/* Smooth transitions */
.pupil, .eye {
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* GPU-optimized transforms */
.character {
    transform: translate3d(0, 0, 0);
}
`;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HoloworldMouseTracker,
        Live2DEnhancedTracker
    };
}
