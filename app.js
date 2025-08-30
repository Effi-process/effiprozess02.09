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

function goToSlide(index) {
  if (!slides.length) refreshSlides();
  
  // Prevent navigation beyond last slide
  if (index >= slides.length) {
    return;
  }
  
  currentSlide = clamp(index, 0, slides.length - 1);

  slides.forEach((el, i) => {
    el.style.opacity = (i === currentSlide) ? '1' : '0';
    el.style.zIndex  = (i === currentSlide) ? '100' : '1';
    el.style.pointerEvents = (i === currentSlide) ? 'auto' : 'none';
    el.style.transform = (i === currentSlide) ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)';
    el.style.filter = (i === currentSlide) ? 'blur(0px)' : 'blur(1px)';
  });
  
  // Canvas komplett verstecken auf Interface-Seite, AI Agent Seite, Probleme-Seite und Solutions-Seite
  const canvas = document.getElementById('dotAnimation');
  if (canvas) {
    canvas.style.display = (currentSlide === 2 || currentSlide === 3 || currentSlide === 4) ? 'none' : 'block';
  }

  // Header-Farbe anhand des Slide-Typs, nicht per Index
  const header = document.querySelector('.header');
  const logo = document.querySelector('.header-logo');
  const dark = isDarkSlide(currentSlide);

  // Hide header on slide 5 (solutions page), show on all others  
  if (currentSlide === 4) { // Slide 5 has index 4 (0-based)
    header.style.display = 'none';
  } else {
    header.style.display = 'block';
    header.style.backgroundColor = dark ? '#000000' : '#ffffff';
    header.style.borderBottomColor = dark ? '#333' : '#cccccc';
    if (logo) logo.style.color = dark ? '#ffffff' : '#808080';
  }

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

  // Seite ist „one-pager" → native Scroll verhindern
  ['wheel','touchmove'].forEach(evt =>
    window.addEventListener(evt, e => e.preventDefault(), { passive:false })
  );
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

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Start loading animation
  startLoadingAnimation();
  
  // Complete loading after 3 seconds
  setTimeout(() => {
    completeLoading();
  }, 3000);

  refreshSlides();

  // Anfangszustand für alle Slides
  slides.forEach((el,i) => {
    el.style.transition = 'all 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)';
    el.style.opacity = i===0 ? '1' : '0';
    el.style.zIndex  = i===0 ? '2' : '1';
    el.style.pointerEvents = i===0 ? 'auto' : 'none';
    el.style.transform = i===0 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)';
    el.style.filter = i===0 ? 'blur(0px)' : 'blur(1px)';
  });

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
});

// Utility function for header click
function goToHome() {
  goToSlide(0);
}