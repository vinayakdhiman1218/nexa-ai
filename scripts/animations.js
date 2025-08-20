// Advanced animations and effects for NEXA AI landing page

class AnimationController {
    constructor() {
        this.animations = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) return;
        
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
        this.setupTextAnimations();
        this.setupLoadingAnimations();
    }
    
    // Enhanced scroll animations
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.scroll;
                    const delay = element.dataset.delay || 0;
                    
                    setTimeout(() => {
                        this.triggerAnimation(element, animationType);
                    }, delay);
                    
                    scrollObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }
    
    // Parallax effects for background elements
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                const xPos = Math.sin(scrollY * 0.001) * 10; // Subtle horizontal movement
                
                element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Enhanced hover animations
    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('[data-hover]');
        
        hoverElements.forEach(element => {
            const hoverType = element.dataset.hover;
            
            element.addEventListener('mouseenter', () => {
                this.triggerHoverAnimation(element, hoverType, 'enter');
            });
            
            element.addEventListener('mouseleave', () => {
                this.triggerHoverAnimation(element, hoverType, 'leave');
            });
        });
    }
    
    // Text animations (typewriter, fade-in words, etc.)
    setupTextAnimations() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            this.createTypewriterEffect(element);
        });
        
        const fadeInTextElements = document.querySelectorAll('[data-text-reveal]');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.createTextRevealEffect(entry.target);
                    textObserver.unobserve(entry.target);
                }
            });
        });
        
        fadeInTextElements.forEach(element => {
            textObserver.observe(element);
        });
    }
    
    // Loading animations
    setupLoadingAnimations() {
        // Add staggered animations to elements on page load
        const elementsToAnimate = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .nav-logo');
        
        elementsToAnimate.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 500); // Stagger by 200ms, start after 500ms
        });
    }
    
    // Trigger specific animation types
    triggerAnimation(element, type) {
        switch (type) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'fadeInLeft':
                this.fadeInLeft(element);
                break;
            case 'fadeInRight':
                this.fadeInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'rotateIn':
                this.rotateIn(element);
                break;
            default:
                this.fadeIn(element);
        }
    }
    
    // Animation methods
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.8s ease-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
    
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    fadeInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    fadeInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    rotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }
    
    // Hover animation methods
    triggerHoverAnimation(element, type, state) {
        switch (type) {
            case 'lift':
                this.liftAnimation(element, state);
                break;
            case 'glow':
                this.glowAnimation(element, state);
                break;
            case 'rotate':
                this.rotateAnimation(element, state);
                break;
            case 'scale':
                this.scaleAnimation(element, state);
                break;
        }
    }
    
    liftAnimation(element, state) {
        if (state === 'enter') {
            element.style.transform = 'translateY(-10px)';
            element.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
        } else {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '';
        }
    }
    
    glowAnimation(element, state) {
        if (state === 'enter') {
            element.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
            element.style.borderColor = 'rgba(0, 212, 255, 0.5)';
        } else {
            element.style.boxShadow = '';
            element.style.borderColor = '';
        }
    }
    
    rotateAnimation(element, state) {
        if (state === 'enter') {
            element.style.transform = 'rotateY(10deg) rotateX(5deg)';
        } else {
            element.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }
    }
    
    scaleAnimation(element, state) {
        if (state === 'enter') {
            element.style.transform = 'scale(1.05)';
        } else {
            element.style.transform = 'scale(1)';
        }
    }
    
    // Text effects
    createTypewriterEffect(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid var(--accent-primary)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        typeWriter();
    }
    
    createTextRevealEffect(element) {
        const words = element.textContent.split(' ');
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 100}ms`;
            
            element.appendChild(span);
            
            // Trigger animation
            requestAnimationFrame(() => {
                setTimeout(() => {
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0)';
                }, 100);
            });
        });
    }
}

// Advanced 3D effects
class ThreeDEffects {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        this.setupMouseTracking();
        this.setup3DCards();
        this.setupParallaxMouse();
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    setup3DCards() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 8;
                const rotateY = (centerX - x) / 8;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
                
                // Add shine effect
                const shine = card.querySelector('.feature-glow');
                if (shine) {
                    const shineX = (x / rect.width) * 100;
                    const shineY = (y / rect.height) * 100;
                    shine.style.background = `
                        radial-gradient(circle at ${shineX}% ${shineY}%, 
                        rgba(255, 255, 255, 0.1) 0%, 
                        transparent 70%)
                    `;
                    shine.style.opacity = '1';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                
                const shine = card.querySelector('.feature-glow');
                if (shine) {
                    shine.style.opacity = '0';
                }
            });
        });
    }
    
    setupParallaxMouse() {
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        document.addEventListener('mousemove', () => {
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.02;
                const x = this.mouse.x * speed * 50;
                const y = this.mouse.y * speed * 50;
                
                element.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Particle system
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || '#00d4ff',
            ...options
        };
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = {
            x: Math.random() * this.container.offsetWidth,
            y: Math.random() * this.container.offsetHeight,
            vx: (Math.random() - 0.5) * this.options.speed,
            vy: (Math.random() - 0.5) * this.options.speed,
            size: Math.random() * this.options.size + 1,
            opacity: Math.random() * 0.5 + 0.2,
            element: this.createElement()
        };
        
        this.particles.push(particle);
        this.container.appendChild(particle.element);
    }
    
    createElement() {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.borderRadius = '50%';
        element.style.background = this.options.color;
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1';
        return element;
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
            particle.vx *= -1;
        }
        if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
            particle.vy *= -1;
        }
        
        // Update element position
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.width = particle.size + 'px';
        particle.element.style.height = particle.size + 'px';
        particle.element.style.opacity = particle.opacity;
    }
    
    animate() {
        this.particles.forEach(particle => {
            this.updateParticle(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation controller
    new AnimationController();
    
    // Initialize 3D effects
    new ThreeDEffects();
    
    // Initialize particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection, {
            count: 30,
            speed: 0.5,
            size: 3,
            color: 'rgba(0, 212, 255, 0.6)'
        });
    }
});
