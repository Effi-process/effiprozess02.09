/* =========================================================
   app_simple.js - Effiprocess mit GARANTIERT funktionierender Animation
   ========================================================= */

// Utility functions
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Global variables
let slides = [];
let currentSlide = 0;
let transitioning = false;
let bubbleAnimation = null;

/* ===== BUBBLE ANIMATION CLASS - IMMER SICHTBAR ===== */
class PermanentBubbleAnimation {
  constructor() {
    console.log('🎨 PermanentBubbleAnimation starting...');
    
    // Canvas Element finden
    this.canvas = document.getElementById('dotAnimation');
    if (!this.canvas) {
      console.error('❌ Canvas "dotAnimation" not found!');
      return;
    }
    
    console.log('✅ Canvas found:', this.canvas);
    
    // 2D Context
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('❌ Canvas context failed');
      return;
    }
    
    console.log('✅ Canvas context ready');
    
    // Animation Variablen
    this.dots = [];
    this.time = 0;
    this.animationId = null;
    
    // Setup
    this.setupCanvas();
    this.createDots();
    this.bindResize();
    
    // Animation sofort starten
    this.startAnimation();
    
    console.log('✅ Animation initialized with', this.dots.length, 'dots');
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
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    
    // Erstelle 1000 Dots
    for (let i = 0; i < 1000; i++) {
      const angle = (i / 1000) * Math.PI * 2 * 3; // Spirale
      const distance = (i / 1000) * radius;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Skip dots too close to center
      if (distance < 100) continue;
      
      const size = 1 + Math.random() * 4;
      const opacity = 0.3 + Math.random() * 0.5;
      
      this.dots.push({
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        baseX: x,
        baseY: y,
        size: size,
        opacity: opacity,
        targetOpacity: opacity,
        angle: angle,
        distance: distance,
        speed: 0.02 + Math.random() * 0.03
      });
    }
    
    console.log(`Created ${this.dots.length} dots`);
  }
  
  bindResize() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createDots();
    });
  }
  
  updateDots() {
    this.time += 0.02;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    for (const dot of this.dots) {
      // Breathing animation
      const breathe = Math.sin(this.time + dot.angle) * 0.1;
      const pulse = Math.sin(this.time * 0.5) * 0.05;
      
      const newDistance = dot.distance * (1 + breathe + pulse);
      dot.targetX = centerX + Math.cos(dot.angle + this.time * dot.speed) * newDistance;
      dot.targetY = centerY + Math.sin(dot.angle + this.time * dot.speed) * newDistance;
      
      // Smooth movement
      dot.x += (dot.targetX - dot.x) * 0.1;
      dot.y += (dot.targetY - dot.y) * 0.1;
      
      // Text cutout nur auf Hero Slide
      if (currentSlide === 0) {
        const heroContainer = document.querySelector('.hero-text-container');
        if (heroContainer) {
          const rect = heroContainer.getBoundingClientRect();
          const dx = dot.x - (rect.left + rect.width / 2);
          const dy = dot.y - (rect.top + rect.height / 2);
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < 200) {
            dot.targetOpacity = 0;
          } else {
            dot.targetOpacity = dot.opacity;
          }
        }
      } else {
        dot.targetOpacity = dot.opacity;
      }
      
      // Smooth opacity
      dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;
    }
  }
  
  draw() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all dots
    for (const dot of this.dots) {
      if (dot.opacity > 0.01) {
        this.ctx.fillStyle = `rgba(160, 120, 200, ${dot.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    const animate = () => {
      try {
        this.updateDots();
        this.draw();
      } catch (error) {
        console.warn('Animation frame error:', error);
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
    console.log('🎨 Animation loop started');
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.log('Animation stopped');
    }
  }
}

/* ===== SLIDE NAVIGATION ===== */
function goToSlide(nextIndex) {
  if (transitioning) return;
  
  const next = clamp(nextIndex, 0, slides.length - 1);
  if (next === currentSlide) return;

  const prevEl = slides[currentSlide];
  const nextEl = slides[next];
  if (!prevEl || !nextEl) return;

  transitioning = true;

  // CSS transitions
  const dir = next > currentSlide ? 1 : -1;
  document.documentElement.style.setProperty('--dir', String(dir));

  nextEl.classList.add('is-entering');
  void nextEl.offsetWidth; // Force reflow

  prevEl.classList.add('is-leaving');
  prevEl.classList.remove('is-active');
  nextEl.classList.add('is-active');
  nextEl.classList.remove('is-entering');

  // Cleanup after transition
  const cleanup = () => {
    if (prevEl.classList.contains('is-leaving')) {
      prevEl.classList.remove('is-leaving');
    }
    transitioning = false;
  };

  const onDone = (e) => {
    if (e.target !== prevEl) return;
    prevEl.removeEventListener('transitionend', onDone);
    cleanup();
  };
  
  prevEl.addEventListener('transitionend', onDone, { once: true });
  setTimeout(cleanup, 600); // Fallback

  currentSlide = next;
  
  // Canvas NIEMALS verstecken
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = 'block !important';
    canvas.style.visibility = 'visible !important';
    canvas.style.opacity = '1 !important';
  }

  updateVerticalArrows();
  updateActiveMenuItem();
}

function updateVerticalArrows() {
  const upBtn = document.querySelector('.nav-vertical .up');
  const downBtn = document.querySelector('.nav-vertical .down');
  if (!upBtn || !downBtn) return;

  upBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
  downBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
}

function bindNavigation() {
  const nav = document.getElementById('navVertical');
  if (!nav) return;

  const upBtn = nav.querySelector('.up');
  const downBtn = nav.querySelector('.down');
  if (!upBtn || !downBtn) return;

  upBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  downBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    switch(e.key){
      case 'ArrowUp':
      case 'PageUp':   goToSlide(currentSlide - 1); break;
      case 'ArrowDown':
      case 'PageDown': goToSlide(currentSlide + 1); break;
      case 'Home':     goToSlide(0); break;
      case 'End':      goToSlide(slides.length - 1); break;
    }
  });

  // Scroll navigation with protection
  let isScrolling = false;
  let scrollTimeout = null;
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (isScrolling || transitioning) return;
    
    // Minimum scroll threshold
    if (Math.abs(e.deltaY) < 50) return;
    
    isScrolling = true;
    
    if (e.deltaY > 0 && currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else if (e.deltaY < 0 && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
    
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 1000);
  }, { passive: false });
}

/* ===== NAVIGATION MENU ===== */
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

/* ===== CALCULATOR ===== */
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

/* ===== CONTACT FORM ===== */
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
      
      formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
      formStatus.style.background = 'rgba(76, 175, 80, 0.1)';
      formStatus.style.color = '#4CAF50';
      formStatus.style.border = '1px solid rgba(76, 175, 80, 0.3)';
      formStatus.style.display = 'block';
      
      contactForm.reset();
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      formStatus.textContent = 'Fehler beim Senden. Bitte versuchen Sie es erneut.';
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

/* ===== LANGUAGE SWITCHER ===== */
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

/* ===== LOADING ANIMATION ===== */
function startLoadingAnimation() {
  const progressNumber = document.getElementById('progressNumber');
  const progressFill = document.getElementById('progressFill');
  
  if (!progressNumber || !progressFill) {
    completeLoading();
    return;
  }
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(completeLoading, 800);
    }
    
    progressNumber.textContent = Math.floor(progress);
    progressFill.style.width = progress + '%';
  }, 80);
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

/* ===== LOGO LOADING ===== */
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
      logoContainer.innerHTML = '<div style="font-size: 1.4rem; font-weight: 700; color: #333; font-family: Arial, sans-serif; letter-spacing: -1px;"><span style="display: inline-block; transform: scaleX(-1);">E</span><span style="color: #a078c8;">P</span></div>';
    }
  }
}

// Utility functions
function goToHome() {
  goToSlide(0);
}

// Make functions globally available
window.goToSlide = goToSlide;
window.goToHome = goToHome;
window.switchLanguage = switchLanguage;
window.calculateSavings = calculateSavings;

/* ===== MAIN INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Effiprocess Loading...');
  
  // Start loading animation
  startLoadingAnimation();
  
  // Initialize slides
  slides = Array.from(document.querySelectorAll('.slide'));
  console.log('Found', slides.length, 'slides');
  
  // Initialize slide states
  setTimeout(() => {
    slides.forEach((el, i) => {
      el.classList.remove('is-entering', 'is-leaving', 'is-active');
      if (i === 0) {
        el.classList.add('is-active');
      }
      el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
    
    console.log('✅ Slides initialized');
  }, 100);

  // IMMEDIATE Canvas setup - no delay
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    // Force visibility with !important equivalent
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
    `;
    
    console.log('🎨 Canvas forced visible with inline styles');
    
    // Initialize animation IMMEDIATELY
    bubbleAnimation = new PermanentBubbleAnimation();
    
    if (bubbleAnimation && bubbleAnimation.dots.length > 0) {
      console.log('🎉 ANIMATION SUCCESSFULLY STARTED!');
    } else {
      console.error('❌ Animation failed to start');
    }
  } else {
    console.error('❌ Canvas element not found');
    // Try again after small delay
    setTimeout(() => {
      const canvas2 = document.getElementById('dotAnimation');
      if (canvas2) {
        console.log('🎨 Canvas found on retry');
        canvas2.style.cssText = `
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
        `;
        bubbleAnimation = new PermanentBubbleAnimation();
      }
    }, 100);
  }

  // Initialize other components
  bindNavigation();
  initializeNavMenu();
  handleContactForm();
  loadHeaderLogo();
  
  // Set initial calculator state
  setTimeout(() => {
    if (document.getElementById('hoursSaved')) {
      document.getElementById('hoursSaved').textContent = '--';
      document.getElementById('costSaved').textContent = '--';
    }
  }, 100);
  
  console.log('✅ Effiprocess fully loaded');
});