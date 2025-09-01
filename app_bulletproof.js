/* =========================================================
   BULLETPROOF EFFIPROCESS - ANIMATION NIEMALS VERSTECKEN
   ========================================================= */

console.log('🚀 BULLETPROOF EFFIPROCESS LOADING...');

// ===== GLOBALE VARIABLEN =====
let slides = [];
let currentSlide = 0;
let transitioning = false;
let bubbleAnimation = null;

// ===== SCROLL HANDLING MIT REFS (STABIL) =====
let isScrollingGlobal = false;
let lastScrollTime = 0;
let scrollAccumulator = 0;
let navigationEnabled = false;

const SCROLL_THRESHOLD = 120;  // Mindest-Scroll bevor Slide wechselt
const SCROLL_COOLDOWN = 1200;  // Zeit bis nächster Scroll möglich
const DEBOUNCE_TIME = 50;     // Mindestzeit zwischen Scroll-Events
const STARTUP_DELAY = 2000;   // Verzögerung bevor Scroll aktiv wird

// ===== ULTRA-ROBUSTE BUBBLE ANIMATION =====
class BulletproofBubbleAnimation {
  constructor() {
    console.log('🎨 BulletproofBubbleAnimation initializing...');
    
    this.canvas = document.getElementById('dotAnimation');
    if (!this.canvas) {
      console.error('❌ Canvas not found! Creating one...');
      this.createCanvas();
    }
    
    if (!this.canvas) {
      console.error('❌ Canvas creation failed!');
      return;
    }
    
    console.log('✅ Canvas ready:', this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('❌ Canvas context failed!');
      return;
    }
    
    console.log('✅ Canvas context ready');
    
    // Force canvas visibility immediately and permanently
    this.forceCanvasVisible();
    
    // Animation properties
    this.dots = [];
    this.time = 0;
    this.animationRunning = false;
    
    // Setup
    this.setupCanvas();
    this.createDots();
    this.bindEvents();
    
    // Start animation immediately
    this.startAnimation();
    
    console.log('🎉 ANIMATION INITIALIZED WITH', this.dots.length, 'DOTS');
  }
  
  createCanvas() {
    console.log('Creating new canvas element...');
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dotAnimation';
    this.canvas.className = 'dot-canvas';
    document.body.appendChild(this.canvas);
  }
  
  forceCanvasVisible() {
    if (!this.canvas) return;
    
    // ULTRA-AGGRESSIVE inline styles - can't be overridden
    this.canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 0 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background: transparent !important;
    `;
    
    // Also set attributes
    this.canvas.setAttribute('style', this.canvas.style.cssText);
    
    console.log('🔒 Canvas visibility LOCKED with inline styles');
  }
  
  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height}`);
  }
  
  createDots() {
    this.dots = [];
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.45;
    
    // Create 800 dots in organic spiral
    for (let i = 0; i < 800; i++) {
      const t = i / 800;
      const angle = t * Math.PI * 12; // Spiral
      const radius = t * maxRadius;
      
      // Add organic distortion
      const distortion = 1 + Math.sin(angle * 0.5) * 0.3 + Math.cos(angle * 0.3) * 0.2;
      const finalRadius = radius * distortion;
      
      const x = centerX + Math.cos(angle) * finalRadius;
      const y = centerY + Math.sin(angle) * finalRadius;
      
      // Skip center area
      if (finalRadius < 80) continue;
      
      // Random properties
      const size = 0.5 + Math.random() * 3;
      const baseOpacity = 0.2 + Math.random() * 0.6;
      
      // Purple color variations
      const colorVariation = Math.random();
      let color;
      if (colorVariation < 0.4) {
        color = { r: 180, g: 140, b: 220 }; // Light purple
      } else if (colorVariation < 0.7) {
        color = { r: 160, g: 120, b: 200 }; // Main purple
      } else {
        color = { r: 140, g: 100, b: 180 }; // Dark purple
      }
      
      this.dots.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        targetX: x,
        targetY: y,
        size: size,
        opacity: baseOpacity,
        targetOpacity: baseOpacity,
        maxOpacity: baseOpacity,
        angle: angle,
        radius: finalRadius,
        speed: 0.01 + Math.random() * 0.02,
        color: color
      });
    }
    
    console.log(`✅ Created ${this.dots.length} dots`);
  }
  
  updateAnimation() {
    this.time += 0.016; // ~60fps
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    for (const dot of this.dots) {
      // Organic breathing motion
      const breathe = Math.sin(this.time + dot.angle * 0.1) * 0.15;
      const pulse = Math.sin(this.time * 0.3) * 0.08;
      const wave = Math.sin(this.time * 0.8 + dot.radius * 0.01) * 0.05;
      
      const motion = 1 + breathe + pulse + wave;
      const newRadius = dot.radius * motion;
      
      // Calculate new position
      dot.targetX = centerX + Math.cos(dot.angle + this.time * dot.speed) * newRadius;
      dot.targetY = centerY + Math.sin(dot.angle + this.time * dot.speed) * newRadius;
      
      // Smooth interpolation
      dot.x += (dot.targetX - dot.x) * 0.1;
      dot.y += (dot.targetY - dot.y) * 0.1;
      
      // Text cutout ONLY on Hero slide - full visibility everywhere else
      if (currentSlide === 0) {
        const heroContainer = document.querySelector('.hero-text-container');
        if (heroContainer) {
          const rect = heroContainer.getBoundingClientRect();
          const dx = dot.x - (rect.left + rect.width / 2);
          const dy = dot.y - (rect.top + rect.height / 2);
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < 180) {
            dot.targetOpacity = 0;
          } else if (distance < 250) {
            const fade = (distance - 180) / (250 - 180);
            dot.targetOpacity = dot.maxOpacity * fade;
          } else {
            dot.targetOpacity = dot.maxOpacity;
          }
        }
      } else {
        // FULL VISIBILITY on all other slides
        dot.targetOpacity = dot.maxOpacity;
      }
      
      // Smooth opacity transition
      dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;
    }
  }
  
  draw() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all visible dots
    for (const dot of this.dots) {
      if (dot.opacity > 0.01) {
        const alpha = Math.max(0, Math.min(1, dot.opacity));
        this.ctx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  startAnimation() {
    if (this.animationRunning) return;
    
    this.animationRunning = true;
    
    const animate = () => {
      if (!this.animationRunning) return;
      
      try {
        // Always force canvas visible before each frame
        this.forceCanvasVisible();
        
        this.updateAnimation();
        this.draw();
      } catch (error) {
        console.warn('Animation frame error:', error);
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    console.log('🎨 ANIMATION LOOP STARTED - RUNNING FOREVER');
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createDots();
      console.log('Animation resized');
    });
    
    // Re-force visibility every 100ms as backup
    setInterval(() => {
      this.forceCanvasVisible();
    }, 100);
  }
}

// ===== ROBUSTES SCROLL HANDLING =====
function initRobustScrolling() {
  console.log('🔧 Initializing robust scroll handling...');
  
  // Enable navigation after delay
  setTimeout(() => {
    navigationEnabled = true;
    console.log('✅ Navigation enabled after startup delay');
  }, STARTUP_DELAY);
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Block if navigation disabled, transitioning, or cooling down
    if (!navigationEnabled || transitioning || isScrollingGlobal) {
      return;
    }
    
    const now = Date.now();
    
    // Debounce - ignore rapid fire scrolls
    if (now - lastScrollTime < DEBOUNCE_TIME) {
      return;
    }
    
    lastScrollTime = now;
    
    // Accumulate scroll delta
    scrollAccumulator += e.deltaY;
    
    // Only trigger when threshold is reached
    if (Math.abs(scrollAccumulator) >= SCROLL_THRESHOLD) {
      const direction = scrollAccumulator > 0 ? 1 : -1;
      
      // Reset accumulator
      scrollAccumulator = 0;
      
      // Start cooldown
      isScrollingGlobal = true;
      
      // Navigate
      const targetSlide = currentSlide + direction;
      if (targetSlide >= 0 && targetSlide < slides.length) {
        console.log(`🔄 Scroll navigation: ${currentSlide} → ${targetSlide}`);
        goToSlide(targetSlide);
      }
      
      // End cooldown after delay
      setTimeout(() => {
        isScrollingGlobal = false;
        console.log('✅ Scroll cooldown ended');
      }, SCROLL_COOLDOWN);
    }
    
  }, { passive: false });
}

// ===== SLIDE NAVIGATION (VEREINFACHT) =====
function goToSlide(nextIndex) {
  if (transitioning || !slides.length) return;
  
  const next = Math.max(0, Math.min(slides.length - 1, nextIndex));
  if (next === currentSlide) return;

  const prevEl = slides[currentSlide];
  const nextEl = slides[next];
  if (!prevEl || !nextEl) return;

  console.log(`🔄 Slide transition: ${currentSlide} → ${next}`);
  
  transitioning = true;

  // CSS direction for animations
  const dir = next > currentSlide ? 1 : -1;
  document.documentElement.style.setProperty('--dir', String(dir));

  // Transition classes
  nextEl.classList.add('is-entering');
  void nextEl.offsetWidth; // Force reflow

  prevEl.classList.add('is-leaving');
  prevEl.classList.remove('is-active');
  nextEl.classList.add('is-active');
  nextEl.classList.remove('is-entering');

  // Update current slide immediately
  currentSlide = next;

  // ===== CRITICAL: FORCE CANVAS VISIBLE =====
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 0 !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background: transparent !important;
    `;
    console.log('🔒 Canvas visibility RE-FORCED during slide transition');
  }

  // Cleanup after transition
  const cleanup = () => {
    if (prevEl.classList.contains('is-leaving')) {
      prevEl.classList.remove('is-leaving');
    }
    transitioning = false;
    console.log('✅ Slide transition complete');
  };

  // Listen for transition end
  const onTransitionEnd = (e) => {
    if (e.target !== prevEl) return;
    prevEl.removeEventListener('transitionend', onTransitionEnd);
    cleanup();
  };
  
  prevEl.addEventListener('transitionend', onTransitionEnd, { once: true });
  
  // Fallback timeout
  setTimeout(cleanup, 800);

  // Update UI
  updateVerticalArrows();
  updateActiveMenuItem();
}

// ===== VERTICAL ARROWS =====
function updateVerticalArrows() {
  const upBtn = document.querySelector('.nav-vertical .up');
  const downBtn = document.querySelector('.nav-vertical .down');
  if (!upBtn || !downBtn) return;

  upBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
  downBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
}

function bindVerticalArrows() {
  const nav = document.getElementById('navVertical');
  if (!nav) return;

  const upBtn = nav.querySelector('.up');
  const downBtn = nav.querySelector('.down');
  if (!upBtn || !downBtn) return;

  upBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  downBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.repeat || transitioning) return;
    
    switch(e.key) {
      case 'ArrowUp':
      case 'PageUp':
        goToSlide(currentSlide - 1);
        break;
      case 'ArrowDown':
      case 'PageDown':
        goToSlide(currentSlide + 1);
        break;
      case 'Home':
        goToSlide(0);
        break;
      case 'End':
        goToSlide(slides.length - 1);
        break;
    }
  });
}

// ===== NAVIGATION MENU =====
function initializeNavMenu() {
  const menuToggle = document.getElementById('navMenuToggle');
  const menuDropdown = document.getElementById('navMenuDropdown');
  
  if (!menuToggle || !menuDropdown) return;
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('active');
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-nav-menu')) {
      menuDropdown.classList.remove('active');
    }
  });
  
  updateActiveMenuItem();
}

function updateActiveMenuItem() {
  const menuItems = document.querySelectorAll('.nav-menu-item[onclick]');
  menuItems.forEach(item => {
    item.classList.remove('active');
    
    const onclick = item.getAttribute('onclick');
    const slideMatch = onclick.match(/goToSlide\((\d+)\)/);
    if (slideMatch) {
      const slideNum = parseInt(slideMatch[1]);
      if (slideNum === currentSlide) {
        item.classList.add('active');
      }
    }
  });
}

// ===== LANGUAGE SWITCHER =====
function switchLanguage(lang) {
  const enBtn = document.getElementById('langEN');
  const deBtn = document.getElementById('langDE');
  
  if (lang === 'de') {
    deBtn.style.background = 'rgba(160, 120, 200, 0.1)';
    deBtn.style.color = '#a078c8';
    deBtn.style.borderColor = 'rgba(160, 120, 200, 0.2)';
    
    enBtn.style.background = 'white';
    enBtn.style.color = '#666';
    enBtn.style.borderColor = '#e0e0e0';
  } else {
    enBtn.style.background = 'rgba(160, 120, 200, 0.1)';
    enBtn.style.color = '#a078c8';
    enBtn.style.borderColor = 'rgba(160, 120, 200, 0.2)';
    
    deBtn.style.background = 'white';
    deBtn.style.color = '#666';
    deBtn.style.borderColor = '#e0e0e0';
  }
  
  console.log('Language switched to:', lang);
}

// ===== CALCULATOR =====
function calculateSavings() {
  const tasksPerDay = document.getElementById('tasksPerDay').value;
  const minutesPerTask = document.getElementById('minutesPerTask').value;
  const workDays = document.getElementById('workDays').value;
  const automationPercent = document.getElementById('automationPercent').value;
  const employees = document.getElementById('employees').value;
  
  if (!tasksPerDay || !minutesPerTask || !workDays || !automationPercent || !employees) {
    document.getElementById('hoursSaved').textContent = '--';
    document.getElementById('costSaved').textContent = '--';
    return;
  }
  
  const tasks = parseInt(tasksPerDay);
  const minutes = parseInt(minutesPerTask);
  const days = parseInt(workDays);
  const automation = parseInt(automationPercent);
  const teamSize = parseInt(employees);
  
  const dailyTimeSavingsPerEmployee = (tasks * minutes * automation / 100) / 60;
  const annualHoursSaved = dailyTimeSavingsPerEmployee * days * 52 * teamSize;
  const hourlyRate = 75000 / 2080;
  const annualCostSavings = annualHoursSaved * hourlyRate;
  
  document.getElementById('hoursSaved').textContent = 
    Math.round(annualHoursSaved).toLocaleString() + ' hours';
  document.getElementById('costSaved').textContent = 
    '€' + Math.round(annualCostSavings).toLocaleString();
}

// ===== CONTACT FORM =====
function handleContactForm() {
  const contactForm = document.getElementById('contactFormMain');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatusMain');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    submitButton.textContent = 'Wird gesendet...';
    submitButton.disabled = true;
    formStatus.style.display = 'none';
    
    const formData = {
      name: document.getElementById('contactNameMain').value,
      email: document.getElementById('contactEmailMain').value,
      company: document.getElementById('contactCompanyMain').value || 'Nicht angegeben',
      service: document.getElementById('contactServiceMain').value || 'Nicht angegeben',
      message: document.getElementById('contactMessageMain').value
    };
    
    try {
      console.log('Contact form submission:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden zurück.';
      formStatus.style.background = 'rgba(76, 175, 80, 0.1)';
      formStatus.style.color = '#4CAF50';
      formStatus.style.border = '1px solid rgba(76, 175, 80, 0.3)';
      formStatus.style.display = 'block';
      
      contactForm.reset();
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      formStatus.textContent = 'Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.';
      formStatus.style.background = 'rgba(244, 67, 54, 0.1)';
      formStatus.style.color = '#F44336';
      formStatus.style.border = '1px solid rgba(244, 67, 54, 0.3)';
      formStatus.style.display = 'block';
    } finally {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 6000);
    }
  });
}

// ===== LOGO LOADING =====
async function loadHeaderLogo() {
  try {
    const response = await fetch('./ep_logo.json');
    const logoData = await response.json();
    
    if (logoData.data_uri) {
      const logoContainer = document.getElementById('headerLogoContainer');
      if (logoContainer) {
        const logoImg = document.createElement('img');
        logoImg.src = logoData.data_uri;
        logoImg.alt = logoData.alt || 'Effiprocess Logo';
        logoImg.className = 'header-logo-image';
        logoImg.style.width = '40px';
        logoImg.style.height = '40px';
        logoImg.style.objectFit = 'contain';
        logoContainer.appendChild(logoImg);
      }
    }
  } catch (error) {
    console.log('Logo could not be loaded:', error);
    // Fallback to text logo
    const logoContainer = document.getElementById('headerLogoContainer');
    if (logoContainer) {
      logoContainer.innerHTML = '<div style="font-size: 1.4rem; font-weight: 700; color: #333;"><span style="color: #a078c8;">E</span>P</div>';
    }
  }
}

// ===== LOADING ANIMATION =====
function startLoadingAnimation() {
  const progressNumber = document.getElementById('progressNumber');
  const progressFill = document.getElementById('progressFill');
  const loadingScreen = document.getElementById('loadingScreen');
  
  if (!progressNumber || !progressFill) {
    completeLoading();
    return;
  }
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 6 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(completeLoading, 1000);
    }
    
    progressNumber.textContent = Math.floor(progress);
    progressFill.style.width = progress + '%';
  }, 100);
}

function completeLoading() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 800);
  }
}

// ===== RELOCATO LOGO =====
async function loadRelocatoLogo() {
  try {
    const response = await fetch('./relocato_logo.json');
    const logoData = await response.json();
    
    if (logoData.file && logoData.file.name) {
      const relocatoContainer = document.querySelector('.slide[data-slide="6"]');
      if (relocatoContainer) {
        const testimonials = relocatoContainer.querySelectorAll('[style*="background: white"]');
        for (const testimonial of testimonials) {
          if (testimonial.textContent.includes('Relocato')) {
            const avatarCircle = testimonial.querySelector('[style*="background: linear-gradient(135deg, #bdc887, #d4e195)"]');
            if (avatarCircle) {
              avatarCircle.innerHTML = '';
              const logoImg = document.createElement('img');
              logoImg.src = `./a25b2224-0379-44f4-b9e4-93e865cc091e.png`;
              logoImg.alt = 'Relocato Logo';
              logoImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 12px;
              `;
              avatarCircle.appendChild(logoImg);
            }
            break;
          }
        }
      }
    }
  } catch (error) {
    console.log('Relocato logo could not be loaded:', error);
  }
}

// ===== MAKE FUNCTIONS GLOBAL =====
window.goToSlide = goToSlide;
window.goToHome = () => goToSlide(0);
window.switchLanguage = switchLanguage;
window.calculateSavings = calculateSavings;

// ===== BULLETPROOF INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 BULLETPROOF EFFIPROCESS STARTING...');
  
  // Initialize slides immediately
  slides = Array.from(document.querySelectorAll('.slide'));
  console.log(`Found ${slides.length} slides`);
  
  // Start loading animation
  startLoadingAnimation();
  
  // Initialize slide states
  slides.forEach((el, i) => {
    el.classList.remove('is-entering', 'is-leaving', 'is-active');
    if (i === 0) {
      el.classList.add('is-active');
    }
    el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
  });
  
  console.log('✅ Slides initialized');
  
  // ===== ULTRA-CRITICAL: ANIMATION SETUP =====
  console.log('🎨 STARTING BULLETPROOF ANIMATION...');
  
  // Find or create canvas
  let canvas = document.getElementById('dotAnimation');
  if (!canvas) {
    console.warn('⚠️ Canvas not found, creating new one...');
    canvas = document.createElement('canvas');
    canvas.id = 'dotAnimation';
    canvas.className = 'dot-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  
  // ULTRA-FORCE visibility
  canvas.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 0 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background: transparent !important;
  `;
  
  console.log('🔒 Canvas ULTRA-FORCED visible');
  
  // Create animation instance
  try {
    bubbleAnimation = new BulletproofBubbleAnimation();
    console.log('🎉 BULLETPROOF ANIMATION CREATED!');
    
    // Extra backup - keep forcing visibility
    setInterval(() => {
      const canvas = document.getElementById('dotAnimation');
      if (canvas && canvas.style.display !== 'block') {
        console.warn('⚠️ Canvas was hidden, re-forcing visibility');
        canvas.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none !important;
          z-index: 0 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          background: transparent !important;
        `;
      }
    }, 200);
    
  } catch (error) {
    console.error('❌ Animation creation failed:', error);
  }
  
  // Initialize other components
  bindVerticalArrows();
  initRobustScrolling();
  initializeNavMenu();
  handleContactForm();
  loadHeaderLogo();
  loadRelocatoLogo();
  
  // Calculator initial state
  if (document.getElementById('hoursSaved')) {
    document.getElementById('hoursSaved').textContent = '--';
    document.getElementById('costSaved').textContent = '--';
  }
  
  console.log('🎉 BULLETPROOF EFFIPROCESS FULLY LOADED!');
});