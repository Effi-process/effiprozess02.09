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
  
  // Canvas ALWAYS VISIBLE - NEVER HIDE IT
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
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

  // Robust scroll-to-slide navigation with safeguards
  let isScrolling = false;
  let scrollTimeout = null;
  let navigationReady = false;
  const SCROLL_COOLDOWN = 800;
  const DELTA_THRESHOLD = 80; // Minimum scroll distance to trigger navigation
  const STARTUP_DELAY = 1500; // Delay before navigation becomes active
  
  // Enable navigation after startup delay
  setTimeout(() => {
    navigationReady = true;
    console.log('Navigation enabled after startup delay');
  }, STARTUP_DELAY);
  
  const toPixels = (e) => {
    return e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
  };
  
  const isInsideScrollable = (target) => {
    const el = target;
    const scrollable = el?.closest?.('[data-scrollable="true"], .portfolio-gallery, select') || null;
    if (!scrollable) return false;
    return scrollable.scrollHeight > scrollable.clientHeight;
  };
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Block if not ready, transitioning, or already scrolling
    if (!navigationReady || isScrolling || transitioning) return;
    
    // Block if inside scrollable content
    if (isInsideScrollable(e.target)) return;
    
    // Calculate scroll distance
    const dy = Math.sign(e.deltaY) * Math.abs(toPixels(e));
    if (Math.abs(dy) < DELTA_THRESHOLD) return; // Ignore micro-scrolls
    
    // SPECIAL: Protect Hero slide from accidental navigation
    if (currentSlide === 0 && Math.abs(dy) < 120) {
      console.log('Hero slide protected from small scroll');
      return;
    }
    
    isScrolling = true;
    
    if (dy > 0 && currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else if (dy < 0 && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
    
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

/* ===== PORTFOLIO GALLERY ===== */
let portfolioIndex = 0;
let portfolioTrack;

function updatePortfolioGallery() {
  if (!portfolioTrack) return;
  const w = portfolioTrack.parentElement.getBoundingClientRect().width;
  portfolioTrack.style.transform = `translateX(${-portfolioIndex * 20}%)`;
  updatePortfolioArrows();
}

function updatePortfolioArrows() {
  const leftBtn = document.getElementById('portfolioPrev');
  const rightBtn = document.getElementById('portfolioNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = portfolioIndex === 0 ? 'none' : 'block';
  rightBtn.style.display = portfolioIndex === 4 ? 'none' : 'block';
  
  // Update dots
  const dots = document.querySelectorAll('.portfolio-dot');
  dots.forEach((dot, i) => {
    if (i === portfolioIndex) {
      dot.style.background = '#a078c8';
      dot.classList.add('active');
    } else {
      dot.style.background = '#ddd';
      dot.classList.remove('active');
    }
  });
}

function bindPortfolioControls() {
  portfolioTrack = document.getElementById('portfolioTrack');
  if (!portfolioTrack) return;
  
  const leftBtn = document.getElementById('portfolioPrev');
  const rightBtn = document.getElementById('portfolioNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.addEventListener('click', () => {
    portfolioIndex = Math.max(0, portfolioIndex - 1);
    updatePortfolioGallery();
  });
  
  rightBtn.addEventListener('click', () => {
    portfolioIndex = Math.min(4, portfolioIndex + 1);
    updatePortfolioGallery();
  });
  
  // Dot navigation
  const dots = document.querySelectorAll('.portfolio-dot');
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      portfolioIndex = i;
      updatePortfolioGallery();
    });
  });
  
  // Keyboard support when on services slide
  window.addEventListener('keydown', (e) => {
    if (currentSlide !== 1) return; // Only on services slide
    if (e.repeat) return;
    if (e.key === 'ArrowLeft') leftBtn.click();
    if (e.key === 'ArrowRight') rightBtn.click();
  });

  updatePortfolioGallery();
}

/* ===== INTERFACE GALLERY ===== */
let interfaceIndex = 0;
let interfaceTrack;

function updateInterfaceGallery() {
  if (!interfaceTrack) return;
  interfaceTrack.style.transform = `translateX(${-interfaceIndex * 25}%)`;
  updateInterfaceArrows();
}

function updateInterfaceArrows() {
  const leftBtn = document.getElementById('interfacePrev');
  const rightBtn = document.getElementById('interfaceNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = interfaceIndex === 0 ? 'none' : 'block';
  rightBtn.style.display = interfaceIndex === 3 ? 'none' : 'block';
  
  // Update dots
  const dots = document.querySelectorAll('.interface-dot');
  dots.forEach((dot, i) => {
    if (i === interfaceIndex) {
      dot.style.background = '#a078c8';
      dot.classList.add('active');
    } else {
      dot.style.background = '#ddd';
      dot.classList.remove('active');
    }
  });
}

function bindInterfaceControls() {
  interfaceTrack = document.getElementById('interfaceTrack');
  if (!interfaceTrack) return;
  
  const leftBtn = document.getElementById('interfacePrev');
  const rightBtn = document.getElementById('interfaceNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.addEventListener('click', () => {
    interfaceIndex = Math.max(0, interfaceIndex - 1);
    updateInterfaceGallery();
  });
  
  rightBtn.addEventListener('click', () => {
    interfaceIndex = Math.min(3, interfaceIndex + 1);
    updateInterfaceGallery();
  });
  
  // Dot navigation
  const dots = document.querySelectorAll('.interface-dot');
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      interfaceIndex = i;
      updateInterfaceGallery();
    });
  });
  
  // Keyboard support when on interface slide
  window.addEventListener('keydown', (e) => {
    if (currentSlide !== 2) return; // Only on interface slide
    if (e.repeat) return;
    if (e.key === 'ArrowLeft') leftBtn.click();
    if (e.key === 'ArrowRight') rightBtn.click();
  });

  updateInterfaceGallery();
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
    console.log('OrganicBubbleAnimation constructor called');
    
    this.canvas = document.getElementById('dotAnimation');
    if (!this.canvas) {
      console.error('Canvas element "dotAnimation" not found in DOM!');
      console.log('Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      return;
    }
    
    console.log('Canvas found:', this.canvas);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Canvas 2D context not available');
      return;
    }
    
    console.log('Canvas context obtained');

    this.dots = [];
    this.time = 0;
    this.COLOR = { r: 160, g: 120, b: 200 };

    this.setupCanvas();
    console.log('Canvas setup complete');
    
    this.createOrganicBubble();
    console.log('Organic bubble created with', this.dots.length, 'dots');
    
    this.bindEvents();
    console.log('Events bound');
    
    // Start animation immediately - no delay needed
    this.animate();
    console.log('Animation started');
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
    // ALWAYS RUN - no slide dependency

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

      // Only apply hero text cutout on the hero slide (slide 0)
      if (currentSlide === 0) {
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
      } else {
        // On all other slides, keep full opacity
        dot.targetOpacity = dot.opacity;
      }
    }
  }

  animate = () => {
    // Ensure animation continues even if there are errors
    try {
      this.time += 16;

      // ALWAYS run animation - no slide dependency
      this.updateBubbleBreathing();

      // Always clear the canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // ALWAYS draw animation on all slides
      if (true) {
        for (const dot of this.dots) {
          dot.x += (dot.targetX - dot.x) * 0.08;
          dot.y += (dot.targetY - dot.y) * 0.08;
          dot.size += (dot.targetSize - dot.size) * 0.12;
          dot.opacity += (dot.targetOpacity - dot.opacity) * 0.06;

          // Always add subtle jitter for organic movement
          const jitter = 0.15;
          dot.x += (Math.random() - 0.5) * jitter;
          dot.y += (Math.random() - 0.5) * jitter;

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
  const loadingScreen = document.getElementById('loadingScreen');
  
  if (!progressNumber || !progressFill || !loadingScreen) {
    console.error('Loading elements not found');
    return;
  }
  
  // Ensure loading screen is visible
  loadingScreen.style.display = 'flex';
  loadingScreen.style.opacity = '1';
  loadingScreen.classList.remove('fade-out');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 4 + 2; // Slower, more realistic progress
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      // Auto-complete loading after reaching 100%
      setTimeout(() => {
        completeLoading();
      }, 800); // Longer delay to see the 100%
    }
    
    progressNumber.textContent = Math.floor(progress);
    progressFill.style.width = progress + '%';
  }, 80); // Slower animation for better visibility
}

function completeLoading() {
  const loadingScreen = document.getElementById('loadingScreen');
  const slidesContainer = document.getElementById('slides');
  
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      loadingScreen.style.visibility = 'hidden';
      loadingScreen.style.opacity = '0';
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

/* ===== LOAD RELOCATO LOGO ===== */
async function loadRelocatoLogo() {
  try {
    // Find the Relocato testimonial container
    const relocatoContainer = document.querySelector('.slide[data-slide="6"]');
    if (relocatoContainer) {
      // Find the testimonial with Relocato text
      const testimonials = relocatoContainer.querySelectorAll('[style*="background: white"]');
      for (const testimonial of testimonials) {
        if (testimonial.textContent.includes('Relocato')) {
          // Find the avatar circle with "R"
          const avatarCircle = testimonial.querySelector('[style*="background: linear-gradient(135deg, #bdc887, #d4e195)"]');
          if (avatarCircle) {
            // Replace the "R" with the actual logo
            avatarCircle.innerHTML = '';
            const logoImg = document.createElement('img');
            logoImg.src = './Bildschirmfoto 2025-09-02 um 00.17.11.png';
            logoImg.alt = 'Relocato Logo';
            logoImg.style.cssText = `
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 16px;
            `;
            avatarCircle.appendChild(logoImg);
          }
          break;
        }
      }
    }
  } catch (error) {
    console.log('Relocato logo could not be loaded:', error);
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
    
    // Fallback: Complete loading after 6 seconds if not auto-completed
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('Loading timeout - forcing completion');
        completeLoading();
      }
    }, 6000);
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
  bindPortfolioControls();
  bindInterfaceControls();
  bindLightboxControls();

  // FORCE initial state for animation
  currentSlide = 0;
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
    console.log('Canvas forced visible on initialization');
  }
  
  // Initialize first slide without calling goToSlide to avoid canvas hiding
  if (slides.length > 0) {
    slides[0].classList.add('is-active');
    slides[0].setAttribute('aria-hidden', 'false');
  }
  
  updateCarouselArrows();
  updateProblemsArrows();

  // Initialize bubble animation with error handling and debugging
  try {
    console.log('Attempting to initialize bubble animation...');
    const canvas = document.getElementById('dotAnimation');
    console.log('Canvas element:', canvas);
    
    if (canvas) {
      bubbleAnimation = new OrganicBubbleAnimation();
      console.log('Bubble animation initialized successfully');
    } else {
      console.error('Canvas element "dotAnimation" not found!');
    }
  } catch (error) {
    console.error('Bubble animation failed to initialize:', error);
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
  
  // Load the Relocato logo for testimonial
  try {
    loadRelocatoLogo();
  } catch (error) {
    console.warn('Relocato logo loading failed:', error);
  }
  
  // Initialize EmailJS
  try {
    initializeEmailJS();
  } catch (error) {
    console.warn('EmailJS initialization failed:', error);
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

/* ===== LIGHTBOX FUNCTIONALITY ===== */
let lightboxImages = {
  portfolio: [
    '6BD78E87-B154-478F-843B-7B0B787D22B3.png',
    '3FD85107-B447-46C8-88DA-AFBFE99B888C.png',
    '24D3B85F-56EA-4184-A59F-1F8E6386345E.png',
    'D5E73CA4-6AA4-4F12-BEB8-003CD75B9E44.png',
    '86F92B05-4980-42E2-B975-754811423184.png'
  ],
  interface: [
    'BDDCD0F8-6A26-41B0-9727-3E17D10B246F.jpeg',
    'C6744890-160C-4CA0-9B4F-96EB18E848AE.jpeg',
    'CBACF8D8-F199-4091-8B6C-D0592AEB8EC2.jpeg',
    'EC4885F5-358A-4B44-8843-E4DBFACAA367.jpeg'
  ]
};

let currentLightboxIndex = 0;
let currentGalleryType = 'portfolio';

function openLightbox(index, galleryType) {
  currentLightboxIndex = index;
  currentGalleryType = galleryType;
  
  const modal = document.getElementById('lightboxModal');
  const image = document.getElementById('lightboxImage');
  const counter = document.getElementById('lightboxCounter');
  
  const images = lightboxImages[galleryType];
  
  if (modal && image && counter) {
    image.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    // Restore body scroll
    document.body.style.overflow = 'hidden'; // Keep hidden since we're in slide mode
  }
}

function lightboxPrev() {
  const images = lightboxImages[currentGalleryType];
  currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : images.length - 1;
  updateLightbox();
}

function lightboxNext() {
  const images = lightboxImages[currentGalleryType];
  currentLightboxIndex = currentLightboxIndex < images.length - 1 ? currentLightboxIndex + 1 : 0;
  updateLightbox();
}

function updateLightbox() {
  const image = document.getElementById('lightboxImage');
  const counter = document.getElementById('lightboxCounter');
  const images = lightboxImages[currentGalleryType];
  
  if (image && counter) {
    image.src = images[currentLightboxIndex];
    counter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
  }
}

function bindLightboxControls() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', lightboxPrev);
  if (nextBtn) nextBtn.addEventListener('click', lightboxNext);
  
  // Close on click outside image
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });
  }
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (modal && modal.classList.contains('active')) {
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          lightboxPrev();
          break;
        case 'ArrowRight':
          lightboxNext();
          break;
      }
    }
  });
}

// Make lightbox functions globally available
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

/* ===== LANGUAGE SWITCHER ===== */
const translations = {
  de: {
    // Navigation
    navStart: 'Start',
    navWebsites: 'Moderne Websites',
    navInterfaces: 'Benutzeroberflächen', 
    navAI: 'KI-Automatisierung',
    navProblems: 'Probleme & Lösungen',
    navWorkflow: 'Workflow Integration',
    navCalculator: 'Rechner',
    navContact: 'Kontakt',
    
    // Hero
    heroWebsites: 'Moderne Websites',
    heroInterfaces: 'Benutzeroberflächen',
    heroAI: 'künstliche Intelligenz',
    heroFor: 'für Ihre',
    heroProcesses: 'effizienten Prozesse',
    
    // Services
    servicesCategory: 'WEBSITE SOLUTIONS',
    servicesTitle: 'Moderne Websites, die Ihr<br/>Unternehmen voranbringen.',
    servicesDescription: 'Wir erstellen responsive, hochperformante Websites mit modernsten Technologien. Von der Konzeption bis zur Bereitstellung sorgen wir dafür, dass Ihre digitale Präsenz mit nahtlosen Benutzererfahrungen und leistungsstarken Backend-Lösungen hervorsticht.',
    servicesTech: 'Verwendete Technologien:',
    
    // Interface
    interfaceCategory: 'ANGEPASSTE INTERFACES',
    interfaceTitle: 'Maßgeschneiderte<br/>Benutzeroberflächen für<br/>Ihre spezifischen Anforderungen.',
    interfaceDescription: 'Wir entwickeln Interfaces, die präzise auf Ihre Geschäftsprozesse und Nutzeranforderungen zugeschnitten sind. Durch intensive Analyse Ihrer Workflows schaffen wir intuitive Lösungen, die komplexe Aufgaben vereinfachen und die Produktivität Ihrer Teams maximieren.',
    
    // AI
    aiCategory: 'KI-AGENTEN SYSTEME',
    aiTitle: 'Intelligente Automatisierung,<br/>die komplexe Aufgaben übernimmt.',
    aiDescription1: 'Unsere AI-Agenten übernehmen komplexe Aufgaben teilweise bis vollständig. Sie verstehen Kontext, treffen Entscheidungen und passen sich an Ihre Geschäftsprozesse an.',
    aiDescription2: 'Durch intelligente Integration können wir in verschiedene Programme eintauchen und dort direkt mit AI arbeiten – von Kundenservice über Datenanalyse bis hin zu automatisierten Workflows, die rund um die Uhr für Sie arbeiten.',
    aiCapabilities: 'Kernfähigkeiten',
    
    // Contact
    contactCategory: 'Kontakt',
    contactTitle: 'Bereit, Ihr Unternehmen<br/>zu transformieren?',
    contactDescription1: 'Kontaktieren Sie unser Team, um zu erfahren, wie wir Ihre Prozesse optimieren können.',
    contactDescription2: 'Senden Sie uns eine Nachricht und wir melden uns innerhalb von 24 Stunden zurück.',
    contactButton: 'Kontakt',
    
    // Buttons
    sendMessage: 'Nachricht senden'
  },
  en: {
    // Navigation
    navStart: 'Start',
    navWebsites: 'Modern Websites',
    navInterfaces: 'User Interfaces',
    navAI: 'AI Automation', 
    navProblems: 'Problems & Solutions',
    navWorkflow: 'Workflow Integration',
    navCalculator: 'Calculator',
    navContact: 'Contact',
    
    // Hero
    heroWebsites: 'Modern websites',
    heroInterfaces: 'interfaces',
    heroAI: 'artificial intelligence',
    heroFor: 'for your',
    heroProcesses: 'efficient processes',
    
    // Services
    servicesCategory: 'WEBSITE SOLUTIONS',
    servicesTitle: 'Modern websites that drive<br/>your business forward.',
    servicesDescription: 'We create responsive, high-performance websites with cutting-edge technologies. From concept to deployment, we ensure your digital presence stands out with seamless user experiences and powerful backend solutions.',
    servicesTech: 'Technologies we use:',
    
    // Interface
    interfaceCategory: 'CUSTOM INTERFACES',
    interfaceTitle: 'Tailored<br/>user interfaces for<br/>your specific requirements.',
    interfaceDescription: 'We develop interfaces that are precisely tailored to your business processes and user requirements. Through intensive analysis of your workflows, we create intuitive solutions that simplify complex tasks and maximize your team productivity.',
    
    // AI
    aiCategory: 'AI AGENT SYSTEMS',
    aiTitle: 'Intelligent automation<br/>that takes over complex tasks.',
    aiDescription1: 'Our AI agents take over complex tasks partially to completely. They understand context, make decisions, and adapt to your business processes.',
    aiDescription2: 'Through intelligent integration, we can dive into various programs and work directly with AI there – from customer service via data analysis to automated workflows that work around the clock for you.',
    aiCapabilities: 'Key Capabilities',
    
    // Contact
    contactCategory: 'Contact',
    contactTitle: 'Ready to transform<br/>your business?',
    contactDescription1: 'Contact our team to discover how we can optimize your processes.',
    contactDescription2: 'Send us a message and we will get back to you within 24 hours.',
    contactButton: 'Contact',
    
    // Buttons
    sendMessage: 'Send Message'
  }
};

let currentLanguage = 'de'; // Default language

function switchLanguage(lang) {
  // Update button states
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
  
  currentLanguage = lang;
  updatePageContent(lang);
  console.log('Language switched to:', lang);
}

function updatePageContent(lang) {
  const t = translations[lang];
  
  // Navigation menu
  document.querySelectorAll('.nav-item-title').forEach((el, i) => {
    const keys = ['navStart', 'navWebsites', 'navInterfaces', 'navAI', 'navProblems', 'navWorkflow', 'navCalculator', 'navContact'];
    if (keys[i] && t[keys[i]]) {
      el.textContent = t[keys[i]];
    }
  });
  
  // Hero slide
  const heroElements = document.querySelectorAll('.hero-main-text span');
  if (heroElements.length >= 5) {
    heroElements[0].textContent = t.heroWebsites;
    heroElements[1].textContent = t.heroInterfaces;
    heroElements[2].textContent = t.heroAI;
    heroElements[3].textContent = t.heroFor;
    heroElements[4].textContent = t.heroProcesses;
  }
  
  // Services slide
  const servicesCategory = document.querySelector('[data-slide="1"] .services-category');
  if (servicesCategory) servicesCategory.textContent = t.servicesCategory;
  
  const servicesTitle = document.querySelector('[data-slide="1"] h2');
  if (servicesTitle) servicesTitle.innerHTML = t.servicesTitle;
  
  const servicesDesc = document.querySelector('[data-slide="1"] p');
  if (servicesDesc) servicesDesc.textContent = t.servicesDescription;
  
  const techLabel = document.querySelector('[data-slide="1"] .tech-label');
  if (techLabel) techLabel.textContent = t.servicesTech;
  
  // Interface slide  
  const interfaceCategory = document.querySelector('[data-slide="2"] .interface-category');
  if (interfaceCategory) interfaceCategory.textContent = t.interfaceCategory;
  
  const interfaceTitle = document.querySelector('[data-slide="2"] h2');
  if (interfaceTitle) interfaceTitle.innerHTML = t.interfaceTitle;
  
  const interfaceDesc = document.querySelector('[data-slide="2"] p');
  if (interfaceDesc) interfaceDesc.textContent = t.interfaceDescription;
  
  // AI slide
  const aiCategory = document.querySelector('[data-slide="3"] .ai-category');
  if (aiCategory) aiCategory.textContent = t.aiCategory;
  
  const aiTitle = document.querySelector('[data-slide="3"] h2');
  if (aiTitle) aiTitle.innerHTML = t.aiTitle;
  
  const aiDesc1 = document.querySelector('[data-slide="3"] p:first-of-type');
  if (aiDesc1) aiDesc1.textContent = t.aiDescription1;
  
  const aiDesc2 = document.querySelector('[data-slide="3"] p:last-of-type');
  if (aiDesc2) aiDesc2.textContent = t.aiDescription2;
  
  const aiCap = document.querySelector('[data-slide="3"] h4');
  if (aiCap) aiCap.textContent = t.aiCapabilities;
  
  // Contact slide
  const contactCategory = document.querySelector('[data-slide="7"] .contact-category');
  if (contactCategory) contactCategory.textContent = t.contactCategory;
  
  const contactTitle = document.querySelector('[data-slide="7"] h2');
  if (contactTitle) contactTitle.innerHTML = t.contactTitle;
  
  const contactDesc1 = document.querySelector('[data-slide="7"] p:first-of-type');
  if (contactDesc1) contactDesc1.textContent = t.contactDescription1;
  
  const contactDesc2 = document.querySelector('[data-slide="7"] p:last-of-type');
  if (contactDesc2) contactDesc2.textContent = t.contactDescription2;
  
  // Contact buttons
  document.querySelectorAll('[onclick*="goToSlide(7)"]').forEach(btn => {
    if (btn.textContent.includes('Kontakt') || btn.textContent.includes('Contact')) {
      btn.textContent = t.contactButton;
    }
  });
  
  // Send message button
  const sendBtn = document.querySelector('#contactFormMain button[type="submit"]');
  if (sendBtn) sendBtn.textContent = t.sendMessage;
}

// Make language switcher globally available
window.switchLanguage = switchLanguage;

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

/* ===== EMAILJS CONFIGURATION ===== */
// Initialize EmailJS - you need to register at emailjs.com and get these values
const EMAILJS_CONFIG = {
  SERVICE_ID: 'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // Replace with your EmailJS template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY'     // Replace with your EmailJS public key
};

// Initialize EmailJS when DOM is loaded
function initializeEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log('EmailJS initialized');
  } else {
    console.warn('EmailJS library not loaded');
  }
}

// Contact form handling with EmailJS
function handleContactForm() {
  const contactForm = document.getElementById('contactFormMain');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatusMain');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Wird gesendet...';
    submitButton.disabled = true;
    formStatus.style.display = 'none';
    
    // Get form data
    const formData = {
      name: document.getElementById('contactNameMain').value,
      email: document.getElementById('contactEmailMain').value,
      company: document.getElementById('contactCompanyMain').value || 'Nicht angegeben',
      service: document.getElementById('contactServiceMain').value || 'Nicht angegeben',
      message: document.getElementById('contactMessageMain').value
    };
    
    try {
      // Check if EmailJS is configured
      if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
        // Fallback: Log to console and show success (for testing)
        console.log('Contact form submission (EmailJS not configured):', formData);
        
        // Simulate sending delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden zurück.';
        formStatus.style.background = 'rgba(76, 175, 80, 0.1)';
        formStatus.style.color = '#4CAF50';
        formStatus.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        formStatus.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
      } else {
        // Send email using EmailJS
        const result = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            company: formData.company,
            service: formData.service,
            message: formData.message,
            to_email: 'info@effiprozess.de'
          }
        );
        
        console.log('EmailJS Success:', result);
        
        // Show success message
        formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden zurück.';
        formStatus.style.background = 'rgba(76, 175, 80, 0.1)';
        formStatus.style.color = '#4CAF50';
        formStatus.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        formStatus.style.display = 'block';
        
        // Reset form
        contactForm.reset();
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      
      // Show error message
      formStatus.textContent = 'Entschuldigung, beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.';
      formStatus.style.background = 'rgba(244, 67, 54, 0.1)';
      formStatus.style.color = '#F44336';
      formStatus.style.border = '1px solid rgba(244, 67, 54, 0.3)';
      formStatus.style.display = 'block';
    } finally {
      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      // Hide status message after 6 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 6000);
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