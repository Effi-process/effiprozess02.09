/* =========================================================
   app_clean.js - Effiprocess OHNE Animation (nur Navigation & Features)
   ========================================================= */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ===== SLIDE NAVIGATION ===== */
let slides = [];
let currentSlide = 0;
let transitioning = false;

function refreshSlides() {
  slides = Array.from(document.querySelectorAll('.slide'));
}

function goToSlide(nextIndex) {
  if (!slides.length) refreshSlides();
  if (transitioning) return;
  
  const next = clamp(nextIndex, 0, slides.length - 1);
  if (next === currentSlide) return;

  const prevEl = slides[currentSlide];
  const nextEl = slides[next];

  const dir = next > currentSlide ? 1 : -1;
  document.documentElement.style.setProperty('--dir', String(dir));

  transitioning = true;

  nextEl.classList.add('is-entering');
  void nextEl.offsetWidth;

  prevEl.classList.add('is-leaving');
  prevEl.classList.remove('is-active');

  nextEl.classList.add('is-active');
  nextEl.classList.remove('is-entering');

  // ARIA
  slides.forEach((el, i) => {
    el.setAttribute('aria-hidden', i === next ? 'false' : 'true');
  });

  // Cleanup
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
  setTimeout(cleanup, 600);

  currentSlide = next;

  updateVerticalArrows();
  
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

  // Robust scroll navigation
  let isScrolling = false;
  let scrollTimeout = null;
  let navigationReady = false;
  const SCROLL_COOLDOWN = 800;
  const DELTA_THRESHOLD = 80;
  const STARTUP_DELAY = 1500;
  
  setTimeout(() => {
    navigationReady = true;
    console.log('Navigation enabled');
  }, STARTUP_DELAY);
  
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (!navigationReady || isScrolling || transitioning) return;
    
    const dy = Math.sign(e.deltaY) * Math.abs(e.deltaY);
    if (Math.abs(dy) < DELTA_THRESHOLD) return;
    
    if (currentSlide === 0 && Math.abs(dy) < 120) {
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

/* ===== RELOCATO LOGO ===== */
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

/* ===== LOADING ANIMATION ===== */
function startLoadingAnimation() {
  const progressNumber = document.getElementById('progressNumber');
  const progressFill = document.getElementById('progressFill');
  const loadingScreen = document.getElementById('loadingScreen');
  
  if (!progressNumber || !progressFill || !loadingScreen) {
    console.error('Loading elements not found');
    return;
  }
  
  loadingScreen.style.display = 'flex';
  loadingScreen.style.opacity = '1';
  loadingScreen.classList.remove('fade-out');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 4 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        completeLoading();
      }, 800);
    }
    
    progressNumber.textContent = Math.floor(progress);
    progressFill.style.width = progress + '%';
  }, 80);
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

/* ===== PORTFOLIO GALLERY ===== */
let portfolioIndex = 0;

function updatePortfolioGallery() {
  const portfolioTrack = document.getElementById('portfolioTrack');
  if (!portfolioTrack) return;
  
  portfolioTrack.style.transform = `translateX(${-portfolioIndex * 20}%)`;
  updatePortfolioArrows();
}

function updatePortfolioArrows() {
  const leftBtn = document.getElementById('portfolioPrev');
  const rightBtn = document.getElementById('portfolioNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = portfolioIndex === 0 ? 'none' : 'flex';
  rightBtn.style.display = portfolioIndex === 4 ? 'none' : 'flex';
  
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
  const portfolioTrack = document.getElementById('portfolioTrack');
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
  
  updatePortfolioGallery();
}

/* ===== INTERFACE GALLERY ===== */
let interfaceIndex = 0;

function updateInterfaceGallery() {
  const interfaceTrack = document.getElementById('interfaceTrack');
  if (!interfaceTrack) return;
  
  interfaceTrack.style.transform = `translateX(${-interfaceIndex * 25}%)`;
  updateInterfaceArrows();
}

function updateInterfaceArrows() {
  const leftBtn = document.getElementById('interfacePrev');
  const rightBtn = document.getElementById('interfaceNext');
  if (!leftBtn || !rightBtn) return;

  leftBtn.style.display = interfaceIndex === 0 ? 'none' : 'flex';
  rightBtn.style.display = interfaceIndex === 3 ? 'none' : 'flex';
  
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
  const interfaceTrack = document.getElementById('interfaceTrack');
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
  
  updateInterfaceGallery();
}

/* ===== MAKE FUNCTIONS GLOBAL ===== */
window.goToSlide = goToSlide;
window.goToHome = () => goToSlide(0);
window.switchLanguage = switchLanguage;
window.calculateSavings = calculateSavings;

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App loading (no animation)...');
  
  try {
    startLoadingAnimation();
    refreshSlides();
    console.log('Found', slides.length, 'slides');
    
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen && loadingScreen.style.display !== 'none') {
        completeLoading();
      }
    }, 6000);
  } catch (error) {
    console.error('Initialization error:', error);
    completeLoading();
  }

  // Initialize slides
  setTimeout(() => {
    refreshSlides();
    
    slides.forEach((el, i) => {
      el.classList.remove('is-entering', 'is-leaving', 'is-active', 'active');
      el.style.display = 'block';
      el.style.visibility = 'visible';
      
      if (i === 0) {
        el.classList.add('is-active');
      }
      
      el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
    
    console.log('✅ Slides initialized:', slides.length);
  }, 100);

  bindVerticalArrows();
  bindPortfolioControls();
  bindInterfaceControls();
  initializeNavMenu();
  handleContactForm();
  loadHeaderLogo();
  loadRelocatoLogo();
  
  // Calculator initial state
  setTimeout(() => {
    if (document.getElementById('tasksPerDay')) {
      document.getElementById('hoursSaved').textContent = '--';
      document.getElementById('costSaved').textContent = '--';
    }
  }, 100);
  
  console.log('✅ App initialized (animation handled separately)');
});