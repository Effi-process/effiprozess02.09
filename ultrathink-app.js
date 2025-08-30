class UltrathinkSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 3;
        this.isTransitioning = false;
        
        this.init();
        this.bindEvents();
        this.startAutoPlay();
    }
    
    init() {
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.progressBar = document.getElementById('progressBar');
        
        // Initialize display
        this.updateDisplay();
        this.updateProgressBar();
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key >= '1' && e.key <= '3') {
                this.goToSlide(parseInt(e.key));
            }
        });
        
        // Mouse wheel navigation
        let isScrolling = false;
        document.addEventListener('wheel', (e) => {
            if (isScrolling) return;
            isScrolling = true;
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
            
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        });
        
        // Touch/Swipe support
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;
            
            let diffX = startX - endX;
            let diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    this.nextSlide();
                } else if (diffX < -50) {
                    this.previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // AI System Visual interactions
        this.initAISystemInteractions();
    }
    
    initAISystemInteractions() {
        const agentNodes = document.querySelectorAll('.agent-node');
        const centralBrain = document.querySelector('.central-brain');
        
        agentNodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                // Highlight connection to brain
                this.highlightConnection(index);
                centralBrain.style.transform = 'scale(1.1)';
            });
            
            node.addEventListener('mouseleave', () => {
                // Reset connections
                this.resetConnections();
                centralBrain.style.transform = 'scale(1)';
            });
        });
    }
    
    highlightConnection(nodeIndex) {
        const connectionLines = document.querySelectorAll('.connection-line');
        connectionLines.forEach((line, index) => {
            if (index === nodeIndex) {
                line.style.opacity = '1';
                line.style.background = 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)';
            } else {
                line.style.opacity = '0.2';
            }
        });
    }
    
    resetConnections() {
        const connectionLines = document.querySelectorAll('.connection-line');
        connectionLines.forEach(line => {
            line.style.opacity = '0.3';
            line.style.background = 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
        });
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const nextSlide = this.currentSlide < this.totalSlides ? this.currentSlide + 1 : 1;
        this.goToSlide(nextSlide);
    }
    
    previousSlide() {
        if (this.isTransitioning) return;
        
        // Navigation zurück zur Effiprocess-Seite, wenn vom ersten Slide zurück navigiert wird
        if (this.currentSlide === 1) {
            window.location.href = 'index.html';
            return;
        }
        
        const prevSlide = this.currentSlide > 1 ? this.currentSlide - 1 : this.totalSlides;
        this.goToSlide(prevSlide);
    }
    
    goToSlide(slideNumber) {
        if (slideNumber === this.currentSlide || this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Remove active class from current slide
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Add active class to new slide
        setTimeout(() => {
            const newSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
            if (newSlideEl) {
                newSlideEl.classList.add('active');
            }
            
            this.updateDisplay();
            this.updateProgressBar();
            this.triggerSlideAnimations();
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        }, 100);
    }
    
    updateDisplay() {
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentSlide.toString().padStart(2, '0');
        }
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = this.totalSlides.toString().padStart(2, '0');
        }
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    triggerSlideAnimations() {
        const currentSlideEl = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (!currentSlideEl) return;
        
        // Animate elements based on slide
        switch (this.currentSlide) {
            case 1:
                this.animateHeroSlide(currentSlideEl);
                break;
            case 2:
                this.animatePhilosophySlide(currentSlideEl);
                break;
            case 3:
                this.animateCapabilitiesSlide(currentSlideEl);
                break;
        }
    }
    
    animateHeroSlide(slide) {
        const elements = slide.querySelectorAll('.section-label, .hero-title, .hero-description, .cta-button');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Animate AI system visual
        const agentNodes = slide.querySelectorAll('.agent-node');
        agentNodes.forEach((node, index) => {
            node.style.opacity = '0';
            node.style.transform = 'scale(0.8) translateY(20px)';
            
            setTimeout(() => {
                node.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                node.style.opacity = '1';
                node.style.transform = 'scale(1) translateY(0)';
            }, 800 + (index * 150));
        });
    }
    
    animatePhilosophySlide(slide) {
        const elements = slide.querySelectorAll('.section-label, .slide-title, .slide-description');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }, index * 200);
        });
        
        const features = slide.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                feature.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, 600 + (index * 150));
        });
    }
    
    animateCapabilitiesSlide(slide) {
        const elements = slide.querySelectorAll('.section-label, .slide-title');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        const cards = slide.querySelectorAll('.capability-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 400 + (index * 200));
        });
    }
    
    startAutoPlay() {
        // Auto advance slides every 8 seconds (optional)
        this.autoPlayTimer = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 8000);
        
        // Pause auto-play on user interaction
        document.addEventListener('click', () => this.pauseAutoPlay());
        document.addEventListener('keydown', () => this.pauseAutoPlay());
        document.addEventListener('touchstart', () => this.pauseAutoPlay());
    }
    
    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    resumeAutoPlay() {
        if (!this.autoPlayTimer) {
            this.startAutoPlay();
        }
    }
}

// Enhanced scroll behavior
function initSmoothScrolling() {
    let isScrolling = false;
    
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// Parallax effects for enhanced visual appeal
function initParallaxEffects() {
    const elements = document.querySelectorAll('.central-brain, .agent-node');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth) - 0.5;
        const yPos = (clientY / innerHeight) - 0.5;
        
        elements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            const x = xPos * speed;
            const y = yPos * speed;
            
            el.style.transform += ` translate3d(${x}px, ${y}px, 0)`;
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new UltrathinkSlider();
    initSmoothScrolling();
    initParallaxEffects();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    console.log('🧠 Ultrathink AI Agent System initialized');
});