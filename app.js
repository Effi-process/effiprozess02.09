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
let leavingSlide = null;

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
  leavingSlide = currentSlide; // Track leaving slide

  // Enter/Leave-Klassen setzen
  nextEl.classList.add('is-entering');       // Startposition vorbereiten
  // Force reflow, damit der Enter-Start gültig ist bevor wir aktiv schalten
  // (so greifen die Transitions sauber)
  void nextEl.offsetWidth;

  prevEl.classList.add('is-leaving');
  prevEl.classList.remove('is-active');

  nextEl.classList.add('is-active');
  nextEl.classList.remove('is-entering');

  // Header-Theme - keine slides mehr als dark
  document.body.classList.remove('is-dark');

  // ARIA for screen readers - keep leaving slide accessible during transition
  slides.forEach((el, i) => {
    const isVisible = (i === next) || (i === leavingSlide);
    el.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
  });

  // Nach Ende der Transition aufräumen - mit Timeout fallback
  const cleanup = () => {
    if (prevEl.classList.contains('is-leaving')) {
      prevEl.classList.remove('is-leaving');
    }
    leavingSlide = null;
    transitioning = false;
  };

  const onDone = (e) => {
    if (e.target !== prevEl) return;
    prevEl.removeEventListener('transitionend', onDone);
    cleanup();
  };
  
  prevEl.addEventListener('transitionend', onDone, { once: true });
  
  // Fallback timeout - ensure cleanup happens even if transitionend doesn't fire
  setTimeout(cleanup, 600);

  currentSlide = next;
  
  // Canvas nur auf Hero-Seite (Slide 0) anzeigen
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    const shouldShow = (currentSlide === 0); // Nur auf Hero-Slide
    canvas.style.display = shouldShow ? 'block' : 'none';
    console.log(`Canvas display: ${shouldShow ? 'block' : 'none'} (slide: ${currentSlide})`);
  }

  // Header ist mit CSS immer sichtbar - keine JavaScript-Manipulation nötig

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
  
  // Update active menu item
  if (typeof updateActiveMenuItem === 'function') {
    updateActiveMenuItem();
  }
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

  // Strict scroll-to-slide navigation - EXACTLY ONE slide per scroll gesture
  let isScrolling = false;
  let scrollTimeout = null;
  const SCROLL_COOLDOWN = 1200; // 1.2 Sekunden Wartezeit zwischen Scroll-Aktionen
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Komplett blockieren während Cooldown
    if (isScrolling) return;
    
    // Sofort blockieren für weitere Scroll-Events
    isScrolling = true;
    
    // Bestimme Richtung und navigiere nur EINEN Slide
    if (e.deltaY > 0 && currentSlide < slides.length - 1) {
      // Runter scrollen - nächste Seite
      goToSlide(currentSlide + 1);
    } else if (e.deltaY < 0 && currentSlide > 0) {
      // Hoch scrollen - vorherige Seite
      goToSlide(currentSlide - 1);
    }
    
    // Reset nach längerer Wartezeit
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
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
    if (!this.canvas) {
      console.warn('Canvas element not found');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.warn('Canvas context not available');
      return;
    }

    this.dots = [];
    this.time = 0;
    this.COLOR = { r: 160, g: 120, b: 200 };

    this.setupCanvas();
    this.createOrganicBubble();
    this.bindEvents();
    
    // Start animation with a small delay to ensure everything is ready
    setTimeout(() => {
      if (this.canvas && this.ctx) {
        this.animate();
      }
    }, 100);
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
    const numPoints = 1800; // Weniger Punkte für bessere Performance mit verschiedenen Größen

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
      
      // Verschiedene Punktgrößen basierend auf zufälliger Verteilung
      const sizeVariation = Math.random();
      let size, sizeCategory;
      
      if (sizeVariation < 0.6) {
        // 60% kleine Punkte (1-3px)
        size = 1 + Math.random() * 2;
        sizeCategory = 'small';
      } else if (sizeVariation < 0.85) {
        // 25% mittlere Punkte (3-8px)
        size = 3 + Math.random() * 5;
        sizeCategory = 'medium';
      } else if (sizeVariation < 0.96) {
        // 11% große Punkte (8-15px)
        size = 8 + Math.random() * 7;
        sizeCategory = 'large';
      } else {
        // 4% extra große Punkte (15-25px)
        size = 15 + Math.random() * 10;
        sizeCategory = 'xlarge';
      }
      
      // Verschiedene Lila-Schattierungen basierend auf Größe
      let color;
      switch(sizeCategory) {
        case 'small':
          color = { r: 180, g: 140, b: 220 }; // Helles Lila
          break;
        case 'medium':
          color = { r: 160, g: 120, b: 200 }; // Standard Lila
          break;
        case 'large':
          color = { r: 140, g: 100, b: 180 }; // Dunkleres Lila
          break;
        case 'xlarge':
          color = { r: 120, g: 80, b: 160 };  // Sehr dunkles Lila
          break;
      }

      const opacity = Math.min(0.8, Math.max(0.1, (distanceFromCenter - 120) / maxDistance) * 1.5);

      this.dots.push({
        x, y, targetX: x, targetY: y,
        phi, theta, baseRadius: radius,
        size, targetSize: size, opacity,
        targetOpacity: opacity,
        color: color,
        sizeCategory: sizeCategory
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
    if (currentSlide !== 0) return; // Direkt Slide 0 prüfen statt idx.hero

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
    // Ensure animation continues even if there are errors
    try {
      this.time += 16;

      if (currentSlide === 0) { // Direkt Slide 0 prüfen
        this.updateBubbleBreathing();
      } else {
        // Alle anderen Seiten: Animation komplett ausblenden
        for (const dot of this.dots) {
          dot.targetOpacity = 0;
        }
      }

      // Always clear the canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // Nur animieren und zeichnen wenn auf Hero Seite (Slide 0)
      if (currentSlide === 0) {
        for (const dot of this.dots) {
          dot.x += (dot.targetX - dot.x) * 0.08;
          dot.y += (dot.targetY - dot.y) * 0.08;
          dot.size += (dot.targetSize - dot.size) * 0.12;
          dot.opacity += (dot.targetOpacity - dot.opacity) * 0.06;

          if (currentSlide === 0) { // Direkt Slide 0 prüfen
            const jitter = 0.15;
            dot.x += (Math.random() - 0.5) * jitter;
            dot.y += (Math.random() - 0.5) * jitter;
          }

          if (dot.opacity > 0.01 && this.ctx) {
            // Verwende die spezifische Farbe des Punktes oder fallback zur Standard-Farbe
            const color = dot.color || this.COLOR;
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${dot.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }
    } catch (error) {
      console.warn('Animation error:', error);
    }

    // Always continue the animation loop
    requestAnimationFrame(this.animate);
  }
}

let bubbleAnimation;

/* ===== LOADING ANIMATION ===== */
function startLoadingAnimation() {
  const progressNumber = document.getElementById('progressNumber');
  const progressFill = document.getElementById('progressFill');
  
  if (!progressNumber || !progressFill) {
    console.error('Loading elements not found');
    completeLoading(); // Skip loading if elements missing
    return;
  }
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      // Auto-complete loading after reaching 100%
      setTimeout(() => {
        completeLoading();
      }, 500);
    }
    
    progressNumber.textContent = Math.floor(progress);
    progressFill.style.width = progress + '%';
  }, 60); // Faster loading
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
  console.log('DOM Content Loaded');
  
  try {
    // Start loading animation
    startLoadingAnimation();
    
    // Initialize slides immediately
    refreshSlides();
    console.log('Found', slides.length, 'slides');
    
    // Fallback: Complete loading after 4 seconds if not auto-completed
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('Loading timeout - forcing completion');
        completeLoading();
      }
    }, 4000);
  } catch (error) {
    console.error('Initialization error:', error);
    completeLoading(); // Force complete on any error
  }

  // Initialize slides after a brief delay to ensure DOM is ready
  setTimeout(() => {
    refreshSlides(); // Refresh slides array
    
    // Startzustand: nur Slide 0 aktiv, alle anderen bereit aber unsichtbar
    slides.forEach((el, i) => {
      // Clean slate - remove old classes and inline styles
      el.classList.remove('is-entering', 'is-leaving', 'is-active', 'active');
      el.style.display = 'block';
      el.style.visibility = 'visible';
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
      
      // Debug output
      console.log(`Slide ${i} (${el.dataset.slide}): initialized`);
    });
    
    console.log('Slides initialized:', slides.length);
  }, 100);

  // Header-Theme für Start - keine dark slides mehr
  document.body.classList.remove('is-dark');

  // Carousel DOM holen (falls es existiert)
  track = document.getElementById('servicesTrack');
  problemsTrack = document.getElementById('problemsTrack');

  bindVerticalArrows();
  if (track)          bindCarouselControls();
  if (problemsTrack)  bindProblemsControls();

  goToSlide(0);
  updateCarouselArrows();
  updateProblemsArrows();
  
  // Ensure canvas is visible on start
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = 'block';
    console.log('Canvas forced visible on initialization');
  }

  // Initialize bubble animation with error handling
  try {
    bubbleAnimation = new OrganicBubbleAnimation();
    console.log('Bubble animation initialized');
  } catch (error) {
    console.warn('Bubble animation failed to initialize:', error);
  }
  
  // Load the header logo
  try {
    loadHeaderLogo();
  } catch (error) {
    console.warn('Logo loading failed:', error);
  }
  
  // Load the AI icon for slide 3
  try {
    loadAIIcon();
  } catch (error) {
    console.warn('AI icon loading failed:', error);
  }
  
  // Initialize navigation menu
  setTimeout(() => {
    initializeNavMenu();
  }, 200);
});

// Utility function for header click
function goToHome() {
  goToSlide(0);
}

/* ===== NAVIGATION MENU ===== */
function initializeNavMenu() {
  const menuToggle = document.getElementById('navMenuToggle');
  const menuDropdown = document.getElementById('navMenuDropdown');
  
  if (!menuToggle || !menuDropdown) return;
  
  // Toggle menu on button click
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-nav-menu')) {
      menuDropdown.classList.remove('active');
    }
  });
  
  // Update active menu item when slide changes
  updateActiveMenuItem();
}

function updateActiveMenuItem() {
  const menuItems = document.querySelectorAll('.nav-menu-item[onclick]');
  menuItems.forEach(item => {
    item.classList.remove('active');
    
    // Extract slide number from onclick attribute
    const onclick = item.getAttribute('onclick');
    const slideMatch = onclick.match(/goToSlide\((\d+)\)/);
    if (slideMatch) {
      const slideNum = parseInt(slideMatch[1]);
      if (slideNum === currentSlide) {
        item.classList.add('active');
        
        // Auto-expand Services group if active slide is a service (1-3)
        if (slideNum >= 1 && slideNum <= 3) {
          const servicesGroup = document.querySelector('.nav-group-title');
          const servicesSubItems = document.getElementById('servicesSubItems');
          if (servicesGroup && servicesSubItems) {
            servicesGroup.classList.add('expanded');
            servicesSubItems.classList.add('expanded');
          }
        }
      }
    }
  });
}

function toggleServicesGroup() {
  const servicesGroup = document.querySelector('.nav-group-title');
  const servicesSubItems = document.getElementById('servicesSubItems');
  
  if (servicesGroup && servicesSubItems) {
    servicesGroup.classList.toggle('expanded');
    servicesSubItems.classList.toggle('expanded');
  }
}

// Make sure the function is globally available
window.toggleServicesGroup = toggleServicesGroup;

// Calculator function for time savings
function calculateSavings() {
  const tasksPerDay = document.getElementById('tasksPerDay').value;
  const minutesPerTask = document.getElementById('minutesPerTask').value;
  const workDays = document.getElementById('workDays').value;
  const automationPercent = document.getElementById('automationPercent').value;
  const employees = document.getElementById('employees').value;
  
  // Check if all fields are selected
  if (!tasksPerDay || !minutesPerTask || !workDays || !automationPercent || !employees) {
    // Hide results if any field is not selected
    document.getElementById('hoursSaved').textContent = '--';
    document.getElementById('costSaved').textContent = '--';
    return;
  }
  
  // Convert to numbers
  const tasks = parseInt(tasksPerDay);
  const minutes = parseInt(minutesPerTask);
  const days = parseInt(workDays);
  const automation = parseInt(automationPercent);
  const teamSize = parseInt(employees);
  
  // Calculate daily time savings per employee (in hours)
  const dailyTimeSavingsPerEmployee = (tasks * minutes * automation / 100) / 60;
  
  // Calculate annual hours saved (52 weeks per year)
  const annualHoursSaved = dailyTimeSavingsPerEmployee * days * 52 * teamSize;
  
  // Calculate cost savings (75,000€ per year = ~36€ per hour for 2080 work hours)
  const hourlyRate = 75000 / 2080; // ~36€ per hour
  const annualCostSavings = annualHoursSaved * hourlyRate;
  
  // Update display
  document.getElementById('hoursSaved').textContent = 
    Math.round(annualHoursSaved).toLocaleString() + ' hours';
  document.getElementById('costSaved').textContent = 
    '€' + Math.round(annualCostSavings).toLocaleString();
}

// Contact form handling
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatus');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    formStatus.style.display = 'none';
    
    // Get form data
    const formData = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      company: document.getElementById('contactCompany').value,
      service: document.getElementById('contactService').value,
      message: document.getElementById('contactMessage').value
    };
    
    try {
      // Simulate email sending (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      formStatus.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
      formStatus.className = 'success';
      formStatus.style.display = 'block';
      
      // Reset form
      contactForm.reset();
      
      // Log form data for now (replace with actual email service)
      console.log('Contact form submission:', formData);
      
    } catch (error) {
      // Show error message
      formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
      formStatus.className = 'error';
      formStatus.style.display = 'block';
      
      console.error('Contact form error:', error);
    } finally {
      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      // Hide status message after 5 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  });
}

// Initialize calculator with empty state
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('tasksPerDay')) {
      // Set initial state to show placeholders
      document.getElementById('hoursSaved').textContent = '--';
      document.getElementById('costSaved').textContent = '--';
    }
    
    // Initialize contact form
    handleContactForm();
  }, 100);
});