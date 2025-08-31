/* =========================================================
   app.js - Effiprocess Navigation & Animation System (robust)
   ========================================================= */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutCubic  = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

/* ===== SLIDE NAVIGATION (dynamisch) ===== */
let slides = [];
let currentSlide = 0;
const idx = { hero: -1, services: -1, problems: -1 };

function refreshSlides() {
  slides = Array.from(document.querySelectorAll('.slide'));
  idx.hero     = slides.findIndex(s => s.classList.contains('hero'));
  idx.services = slides.findIndex(s => s.classList.contains('services'));
  idx.problems = slides.findIndex(s => s.classList.contains('problems'));
}

function isDarkSlide(i) {
  const el = slides[i];
  if (!el) return false;
  return el.classList.contains('problems') || el.dataset.theme === 'dark';
}

let transitioning = false;

function goToSlide(nextIndex) {
  if (!slides.length) refreshSlides();
  if (transitioning) return;
  
  const next = clamp(nextIndex, 0, slides.length - 1);
  if (next === currentSlide) return;

  const prevEl = slides[currentSlide];
  const nextEl = slides[next];

  // Richtung festlegen: runter = +1, hoch = -1
  const dir = next > currentSlide ? 1 : -1;
  document.documentElement.style.setProperty('--dir', String(dir));

  transitioning = true;

  // Enter/Leave-Klassen setzen
  nextEl.classList.add('is-entering');       // Startposition vorbereiten
  // Force reflow, damit der Enter-Start gültig ist bevor wir aktiv schalten
  // (so greifen die Transitions sauber)
  void nextEl.offsetWidth;

  prevEl.classList.add('is-leaving');
  prevEl.classList.remove('is-active');

  nextEl.classList.add('is-active');
  nextEl.classList.remove('is-entering');

  // Header-Theme via Body-Klasse (assuming slide 4 is dark)
  document.body.classList.toggle('is-dark', next === 4);

  // ARIA for screen readers
  slides.forEach((el, i) => {
    el.setAttribute('aria-hidden', i === next ? 'false' : 'true');
  });

  // Nach Ende der Transition aufräumen
  const onDone = (e) => {
    if (e.target !== prevEl) return;
    prevEl.removeEventListener('transitionend', onDone);
    prevEl.classList.remove('is-leaving');
    transitioning = false;
  };
  prevEl.addEventListener('transitionend', onDone, { once: true });

  currentSlide = next;
  
  // Canvas komplett verstecken auf Interface-Seite, AI Agent Seite, Probleme-Seite, Solutions-Seite und Calculator-Seite
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = (currentSlide === 2 || currentSlide === 3 || currentSlide === 4 || currentSlide === 5 || currentSlide === 6) ? 'none' : 'block';
  }

  // Hide header on slide 5 (solutions page), show on all others  
  const header = document.querySelector('.header');
  if (currentSlide === 5) { // Slide 5 only
    header.style.display = 'none';
  } else {
    header.style.display = 'block';
  }

  // Hide all select dropdowns when changing slides
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(select => {
    if (select.parentElement) {
      const parentSlide = select.closest('.slide');
      if (parentSlide) {
        const slideIndex = Array.from(slides).indexOf(parentSlide);
        if (slideIndex !== currentSlide) {
          select.blur(); // Close any open dropdowns
        }
      }
    }
  });

  updateVerticalArrows();
}

function updateVerticalArrows() {
  const upBtn = document.querySelector('.nav-vertical .up');
  const downBtn = document.querySelector('.nav-vertical .down');
  if (!upBtn || !downBtn) return;

  upBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
  downBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
}

function bindVerticalArrows(){
  const nav = document.getElementById('navVertical');
  if (!nav) return;

  const upBtn = nav.querySelector('.up');
  const downBtn = nav.querySelector('.down');
  if (!upBtn || !downBtn) return;

  upBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  downBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

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

  // Robust scroll-to-slide navigation system - ONE slide per scroll gesture
  let isScrolling = false;
  let lastScrollTime = 0;
  const SCROLL_COOLDOWN = 1000; // Time between allowed navigations
  const SCROLL_DEBOUNCE = 50;   // Group rapid scroll events together
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Block all scrolling while in cooldown
    if (isScrolling) return;
    
    const now = Date.now();
    
    // Group rapid scroll events together (debounce)
    if (now - lastScrollTime < SCROLL_DEBOUNCE) return;
    
    // Set scrolling state immediately to prevent multiple triggers
    isScrolling = true;
    lastScrollTime = now;
    
    // Determine direction and navigate exactly like arrow keys
    if (e.deltaY > 0) {
      // Scrolling down - go to next slide
      if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      }
    } else if (e.deltaY < 0) {
      // Scrolling up - go to previous slide  
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
    
    // Reset scrolling state after cooldown
    setTimeout(() => {
      isScrolling = false;
    }, SCROLL_COOLDOWN);
  }, { passive: false });
  
  // Touch support for mobile - also ONE slide per gesture
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchMoved = false;
  
  window.addEventListener('touchstart', (e) => {
    if (isScrolling) return;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    touchMoved = false;
  }, { passive: true });
  
  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    touchMoved = true;
  }, { passive: false });
  
  window.addEventListener('touchend', (e) => {
    if (isScrolling || !touchMoved) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const touchDuration = Date.now() - touchStartTime;
    
    // Only trigger on significant swipes (distance and not too slow)
    if (Math.abs(deltaY) > 80 && touchDuration < 800) {
      isScrolling = true;
      
      if (deltaY > 0 && currentSlide < slides.length - 1) {
        // Swiping up - go to next slide
        goToSlide(currentSlide + 1);
      } else if (deltaY < 0 && currentSlide > 0) {
        // Swiping down - go to previous slide
        goToSlide(currentSlide - 1);
      }
      
      // Same cooldown as wheel scrolling
      setTimeout(() => {
        isScrolling = false;
      }, SCROLL_COOLDOWN);
    }
  }, { passive: true });
}

/* ===== SERVICES CAROUSEL ===== */
let carouselIndex = 0;
let problemsIndex = 0;
let track, problemsTrack;

function updateCarousel() {
  if (!track) return;
  const w = track.getBoundingClientRect().width;
  track.style.transform = `translateX(${-carouselIndex * w}px)`;
  updateCarouselArrows();
}

function updateCarouselArrows() {
  if (!track) return;
  const leftBtn = document.querySelector('[data-action="carousel-prev"]');
  const rightBtn = document.querySelector('[data-action="carousel-next"]');
  const maxIndex = track.children.length - 1;
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = carouselIndex === 0 ? 'none' : 'flex';
  rightBtn.style.display = carouselIndex === maxIndex ? 'none' : 'flex';
}

function bindCarouselControls() {
  const leftBtn  = document.querySelector('[data-action="carousel-prev"]');
  const rightBtn = document.querySelector('[data-action="carousel-next"]');
  if (!track || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener('click', () => {
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel();
  });
  rightBtn.addEventListener('click', () => {
    const maxIndex = track.children.length - 1;
    carouselIndex = Math.min(maxIndex, carouselIndex + 1);
    updateCarousel();
  });

  window.addEventListener('keydown', (e) => {
    if (currentSlide !== idx.services) return;
    if (e.repeat) return;
    if (e.key === 'ArrowLeft')  leftBtn.click();
    if (e.key === 'ArrowRight') rightBtn.click();
  });

  // Fallback, wenn ResizeObserver fehlt
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateCarousel).observe(track);
  } else {
    window.addEventListener('resize', updateCarousel);
  }
}

/* ===== PROBLEMS CAROUSEL ===== */
function updateProblemsCarousel() {
  if (!problemsTrack) return;
  const w = problemsTrack.getBoundingClientRect().width;
  problemsTrack.style.transform = `translateX(${-problemsIndex * w}px)`;
  updateProblemsArrows();
}

function updateProblemsArrows() {
  if (!problemsTrack) return;
  const leftBtn = document.querySelector('[data-action="problems-prev"]');
  const rightBtn = document.querySelector('[data-action="problems-next"]');
  const maxIndex = problemsTrack.children.length - 1;
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = problemsIndex === 0 ? 'none' : 'flex';
  rightBtn.style.display = problemsIndex === maxIndex ? 'none' : 'flex';
}

function bindProblemsControls() {
  const leftBtn = document.querySelector('[data-action="problems-prev"]');
  const rightBtn = document.querySelector('[data-action="problems-next"]');
  if (!problemsTrack || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener('click', () => {
    problemsIndex = Math.max(0, problemsIndex - 1);
    updateProblemsCarousel();
  });
  rightBtn.addEventListener('click', () => {
    const maxIndex = problemsTrack.children.length - 1;
    problemsIndex = Math.min(maxIndex, problemsIndex + 1);
    updateProblemsCarousel();
  });

  window.addEventListener('keydown', (e) => {
    if (currentSlide !== idx.problems) return;
    if (e.repeat) return;
    if (e.key === 'ArrowLeft') leftBtn.click();
    if (e.key === 'ArrowRight') rightBtn.click();
  });

  // Fallback, wenn ResizeObserver fehlt
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateProblemsCarousel).observe(problemsTrack);
  } else {
    window.addEventListener('resize', updateProblemsCarousel);
  }
}

/* ===== BUBBLE ANIMATION ===== */
class OrganicBubbleAnimation {
  constructor() {
    this.canvas = document.getElementById('dotAnimation');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dots = [];
    this.time = 0;
    this.COLOR = { r: 160, g: 120, b: 200 };

    this.setupCanvas();
    this.createOrganicBubble();
    this.bindEvents();
    setTimeout(() => this.animate(), 100);
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createOrganicBubble();
      // Services-Pattern beim Resize neu berechnen
      this.servicesPattern = undefined;
    });
  }

  createOrganicBubble() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const baseRadius = Math.min(this.canvas.width, this.canvas.height) * 0.55;

    this.dots = [];
    const numPoints = 2200; /* deutlich smoother & stabiler */

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - 2 * i / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const distortion = 1 + Math.sin(phi*4)*0.20 + Math.cos(theta*3)*0.15;
      const organic = 0.7 + Math.random()*0.6;
      const radius = baseRadius * distortion * organic;

      const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
      const y = centerY + radius * Math.sin(phi) * Math.sin(theta);

      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distanceFromCenter < 160) continue;

      const maxDistance = baseRadius * 1.2;
      const size = 1 + (distanceFromCenter / maxDistance) * 2;
      const opacity = Math.min(0.9, Math.max(0, (distanceFromCenter - 120) / maxDistance) * 2);

      this.dots.push({
        x, y, targetX: x, targetY: y,
        phi, theta, baseRadius: radius,
        size, targetSize: size, opacity,
        targetOpacity: opacity
      });
    }
  }

  createServicesBoxPattern() {
    const boxPositions = [];
    const W = this.canvas.width, H = this.canvas.height;

    const boxWidth = Math.min(W * 0.7, 900);
    const boxHeight = Math.min(H * 0.45, 350);
    const boxX = (W - boxWidth) / 2;
    const boxY = (H - boxHeight) / 2;
    const cornerRadius = 20;

    const step = 3;

    for (let i = cornerRadius; i <= boxWidth - cornerRadius; i += step) {
      boxPositions.push({ x: boxX + i, y: boxY });
      boxPositions.push({ x: boxX + i, y: boxY + boxHeight });
    }
    for (let i = cornerRadius; i <= boxHeight - cornerRadius; i += step) {
      boxPositions.push({ x: boxX, y: boxY + i });
      boxPositions.push({ x: boxX + boxWidth, y: boxY + i });
    }
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const x = Math.cos(angle) * cornerRadius;
      const y = Math.sin(angle) * cornerRadius;
      boxPositions.push({ x: boxX + cornerRadius + x, y: boxY + cornerRadius + y });
      boxPositions.push({ x: boxX + boxWidth - cornerRadius + x, y: boxY + cornerRadius + y });
      boxPositions.push({ x: boxX + cornerRadius + x, y: boxY + boxHeight - cornerRadius + y });
      boxPositions.push({ x: boxX + boxWidth - cornerRadius + x, y: boxY + boxHeight - cornerRadius + y });
    }

    const dotsY = boxY + 25;
    const dotsStartX = boxX + 35;
    for (let i = 0; i < 3; i++) {
      const dotX = dotsStartX + i * 18;
      for (let angle = 0; angle < Math.PI * 2; angle += 0.6) {
        boxPositions.push({ x: dotX + Math.cos(angle) * 5, y: dotsY + Math.sin(angle) * 5 });
      }
    }

    const plusX = boxX + boxWidth - 35;
    const plusY = boxY + 25;
    const plusSize = 10;
    for (let i = -plusSize; i <= plusSize; i += 2) {
      boxPositions.push({ x: plusX + i, y: plusY });
      boxPositions.push({ x: plusX, y: plusY + i });
    }

    return boxPositions;
  }

  updateBubbleBreathing() {
    if (currentSlide !== idx.hero) return;

    const t = this.time * 0.0002;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    for (const dot of this.dots) {
      const sx = Math.sin(dot.phi) * Math.cos(dot.theta);
      const sy = Math.sin(dot.phi) * Math.sin(dot.theta);

      const main = Math.sin(sx*3 + sy*2 + t*2) * 0.25;
      const sec  = Math.sin(sy*4 - sx*1.5 + t*1.2) * 0.15;
      const pul  = Math.sin(t*0.8) * 0.12;

      const distortion = 1 + main + sec + pul;
      const radius = dot.baseRadius * distortion;

      dot.targetX = centerX + radius * Math.sin(dot.phi) * Math.cos(dot.theta);
      dot.targetY = centerY + radius * Math.sin(dot.phi) * Math.sin(dot.theta);

      const heroContainer = document.querySelector('.hero-text-container');
      if (heroContainer) {
        const rect = heroContainer.getBoundingClientRect();
        const hx = rect.left + rect.width / 2;
        const hy = rect.top + rect.height / 2;
        const hrx = Math.max(150, rect.width * 0.60);
        const hry = Math.max(100, rect.height * 0.60);

        const dx = dot.targetX - hx;
        const dy = dot.targetY - hy;
        const d  = Math.sqrt((dx*dx)/(hrx*hrx) + (dy*dy)/(hry*hry));

        if (d < 0.85) {
          dot.targetOpacity = 0;
        } else if (d < 1.10) {
          const p = (d-0.85)/(1.10-0.85);
          dot.targetOpacity = dot.opacity * 0.6 * Math.sin(p*Math.PI*0.5);
        } else {
          dot.targetOpacity = dot.opacity;
        }
      }
    }
  }

  animate = () => {
    this.time += 16;


    if (currentSlide === idx.hero) {
      this.updateBubbleBreathing();
    } else {
      // Alle anderen Seiten: Animation komplett ausblenden
      for (const dot of this.dots) {
        dot.targetOpacity = 0;
      }
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Nur animieren und zeichnen wenn auf Hero Seite
    if (currentSlide === idx.hero) {
      for (const dot of this.dots) {
        dot.x += (dot.targetX - dot.x) * 0.08;
        dot.y += (dot.targetY - dot.y) * 0.08;
        dot.size += (dot.targetSize - dot.size) * 0.12;
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.06;

        if (currentSlide === idx.hero) {
          const jitter = 0.15;
          dot.x += (Math.random() - 0.5) * jitter;
          dot.y += (Math.random() - 0.5) * jitter;
        }

        if (dot.opacity > 0.01) {
          this.ctx.fillStyle = `rgba(${this.COLOR.r}, ${this.COLOR.g}, ${this.COLOR.b}, ${dot.opacity})`;
          this.ctx.beginPath();
          this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    requestAnimationFrame(this.animate);
  }
}

let bubbleAnimation;

/* ===== LOADING ANIMATION ===== */
function startLoadingAnimation() {
  const progressNumber = document.getElementById('progressNumber');
  const progressFill = document.getElementById('progressFill');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    
    if (progressNumber) progressNumber.textContent = Math.floor(progress);
    if (progressFill) progressFill.style.width = progress + '%';
  }, 80);
}

function completeLoading() {
  const loadingScreen = document.getElementById('loadingScreen');
  const slidesContainer = document.getElementById('slides');
  
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 800);
  }
  
  if (slidesContainer) {
    setTimeout(() => {
      slidesContainer.classList.add('loaded');
    }, 400);
  }
}

/* ===== LOAD LOGO ===== */
async function loadHeaderLogo() {
  try {
    const response = await fetch('./ep_logo.json');
    const logoData = await response.json();
    
    if (logoData.data_uri) {
      const logoContainer = document.getElementById('headerLogoContainer');
      if (logoContainer) {
        const logoImg = document.createElement('img');
        logoImg.src = logoData.data_uri;
        logoImg.alt = 'Effiprocess Logo';
        logoImg.className = 'header-logo-image';
        logoImg.width = 56;
        logoImg.height = 56;
        logoImg.style.width = '56px';
        logoImg.style.height = '56px';
        logoContainer.appendChild(logoImg);
      }
    }
  } catch (error) {
    console.log('Logo could not be loaded:', error);
  }
}

/* ===== LOAD AI ICON ===== */
async function loadAIIcon() {
  try {
    const response = await fetch('./icon.json');
    const iconData = await response.json();
    
    if (iconData.data_uri) {
      // Replace the small document icon with the AI business icon
      const iconContainer = document.getElementById('aiIconContainer');
      if (iconContainer) {
        // Clear existing SVG content
        iconContainer.innerHTML = '';
        
        // Create new image element
        const aiIconImg = document.createElement('img');
        aiIconImg.src = iconData.data_uri;
        aiIconImg.alt = iconData.alt || 'AI Business Icon';
        aiIconImg.style.cssText = `
          width: 280px;
          height: 430px;
          object-fit: contain;
          opacity: 0.6;
          filter: saturate(1.3) brightness(1.1);
        `;
        
        iconContainer.appendChild(aiIconImg);
      }
    }
  } catch (error) {
    console.log('AI Icon could not be loaded:', error);
  }
}

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Start loading animation
  startLoadingAnimation();
  
  // Complete loading after 3 seconds
  setTimeout(() => {
    completeLoading();
  }, 3000);

  refreshSlides();

  // Startzustand: nur Slide 0 aktiv, keine Inline-Styles nötig
  slides.forEach((el, i) => {
    // Clean slate - remove old classes and inline styles
    el.classList.remove('is-entering', 'is-leaving', 'is-active', 'active');
    el.style.display = '';
    el.style.visibility = '';
    el.style.opacity = '';
    el.style.transform = '';
    el.style.filter = '';
    el.style.pointerEvents = '';
    el.style.transition = '';
    el.style.zIndex = '';
    
    // Set initial state
    if (i === 0) {
      el.classList.add('is-active');
    }
    
    // ARIA setup
    el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
  });

  // Header-Theme für Start
  document.body.classList.toggle('is-dark', currentSlide === 4);

  // Carousel DOM holen (falls es existiert)
  track = document.getElementById('servicesTrack');
  problemsTrack = document.getElementById('problemsTrack');

  bindVerticalArrows();
  if (track)          bindCarouselControls();
  if (problemsTrack)  bindProblemsControls();

  goToSlide(0);
  updateCarouselArrows();
  updateProblemsArrows();

  bubbleAnimation = new OrganicBubbleAnimation();
  
  // Load the header logo
  loadHeaderLogo();
  
  // Load the AI icon for slide 3
  loadAIIcon();
});

// Utility function for header click
function goToHome() {
  goToSlide(0);
}

// Calculator function for time savings
function calculateSavings() {
  const tasksPerDay = parseInt(document.getElementById('tasksPerDay').value) || 0;
  const minutesPerTask = parseInt(document.getElementById('minutesPerTask').value) || 0;
  const workDays = parseInt(document.getElementById('workDays').value) || 5;
  const automationPercent = parseInt(document.getElementById('automationPercent').value) || 0;
  const employees = parseInt(document.getElementById('employees').value) || 1;
  
  // Calculate daily time savings per employee (in hours)
  const dailyTimeSavingsPerEmployee = (tasksPerDay * minutesPerTask * automationPercent / 100) / 60;
  
  // Calculate annual hours saved (52 weeks per year)
  const annualHoursSaved = dailyTimeSavingsPerEmployee * workDays * 52 * employees;
  
  // Calculate cost savings (75,000€ per year = ~36€ per hour for 2080 work hours)
  const hourlyRate = 75000 / 2080; // ~36€ per hour
  const annualCostSavings = annualHoursSaved * hourlyRate;
  
  // Update display
  document.getElementById('hoursSaved').textContent = 
    Math.round(annualHoursSaved).toLocaleString() + ' hours';
  document.getElementById('costSaved').textContent = 
    '€' + Math.round(annualCostSavings).toLocaleString();
}

// Calculate on page load with default values
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('tasksPerDay')) {
      calculateSavings();
    }
  }, 100);
});