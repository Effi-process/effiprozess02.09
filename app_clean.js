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
    navContact: '07 Kontakt',
    
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
    
    // Problems & Solutions
    problemsTitle: 'Was hält Sie von KI ab?',
    problemsCategory: 'KUNDENBEDENKEN',
    solutionsTitle: 'Wir lösen jede Sorge.',
    solutionsCategory: 'UNSERE LÖSUNGEN',
    
    // Workflow Integration
    workflowCategory: 'WORKFLOW INTEGRATION',
    workflowTitle: 'Wie unsere Services<br/>nahtlos zusammenarbeiten.',
    workflowDescription: 'Moderne Websites bilden das Fundament, intuitive Benutzeroberflächen begeistern Ihre Nutzer und KI-Automatisierung optimiert Ihre Abläufe. Zusammen schaffen sie leistungsstarke digitale Ökosysteme, die mit Ihrem Unternehmenswachstum skalieren.',
    
    // Calculator
    calculatorCategory: 'Kundenerfolgsgeschichten',
    calculatorTitle: 'Echte Ergebnisse von<br/>zufriedenen Kunden.',
    
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
    navContact: '07 Contact',
    
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
    
    // Problems & Solutions
    problemsTitle: 'What holds you back from AI?',
    problemsCategory: 'CUSTOMER CONCERNS',
    solutionsTitle: 'We solve every concern.',
    solutionsCategory: 'OUR SOLUTIONS',
    
    // Workflow Integration
    workflowCategory: 'WORKFLOW INTEGRATION',
    workflowTitle: 'How our services<br/>work together seamlessly.',
    workflowDescription: 'Modern websites provide the foundation, intuitive interfaces engage your users, and AI automation streamlines your operations. Together they create powerful digital ecosystems that scale with your business growth.',
    
    // Calculator
    calculatorCategory: 'Client Success Stories',
    calculatorTitle: 'Real results from<br/>satisfied clients.',
    
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

let currentLanguage = 'de';

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
  
  // Problems & Solutions slide (Slide 4)
  const problemsCategory = document.querySelector('[data-slide="4"] .problems-category');
  if (problemsCategory) problemsCategory.textContent = t.problemsCategory;
  
  const problemsTitle = document.querySelector('[data-slide="4"] .problems-title');
  if (problemsTitle) problemsTitle.innerHTML = t.problemsTitle;
  
  const solutionsCategory = document.querySelector('[data-slide="4"] .solutions-category');
  if (solutionsCategory) solutionsCategory.textContent = t.solutionsCategory;
  
  const solutionsTitle = document.querySelector('[data-slide="4"] .solutions-title');
  if (solutionsTitle) solutionsTitle.innerHTML = t.solutionsTitle;
  
  // Workflow Integration slide (Slide 5)
  const workflowCategory = document.querySelector('[data-slide="5"] .workflow-category');
  if (workflowCategory) workflowCategory.textContent = t.workflowCategory;
  
  const workflowTitle = document.querySelector('[data-slide="5"] .workflow-title');
  if (workflowTitle) workflowTitle.innerHTML = t.workflowTitle;
  
  const workflowDesc = document.querySelector('[data-slide="5"] .workflow-description');
  if (workflowDesc) workflowDesc.textContent = t.workflowDescription;
  
  // Calculator slide (Slide 6)
  const calculatorCategory = document.querySelector('[data-slide="6"] .calculator-category');
  if (calculatorCategory) calculatorCategory.textContent = t.calculatorCategory;
  
  const calculatorTitle = document.querySelector('[data-slide="6"] .calculator-title');
  if (calculatorTitle) calculatorTitle.innerHTML = t.calculatorTitle;
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
  // Keep the green "R" instead of loading image
  console.log('Keeping green R avatar for Relocato');
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