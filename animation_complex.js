/* ===== KOMPLEXE BUBBLE ANIMATION MIT TEXT-CUTOUT ===== */

console.log('🎨 Starting COMPLEX bubble animation...');

let complexCanvas = null;
let complexCtx = null;
let complexDots = [];
let animationTime = 0;
let isAnimationRunning = false;

// Verschiedene Lila-Varianten
const PURPLE_VARIANTS = {
  glasig: { r: 200, g: 180, b: 240, alpha: 0.3 },      // Sehr glasig
  normal: { r: 160, g: 120, b: 200, alpha: 0.6 },      // Standard lila
  kräftig: { r: 120, g: 80, b: 160, alpha: 0.8 },      // Kräftiges lila
  dunkel: { r: 100, g: 60, b: 140, alpha: 0.9 },       // Dunkles lila
  hell: { r: 180, g: 140, b: 220, alpha: 0.4 }         // Helles lila
};

function initComplexAnimation() {
  console.log('🎨 Initializing complex animation...');
  
  // Canvas finden oder erstellen
  complexCanvas = document.getElementById('dotAnimation');
  if (!complexCanvas) {
    console.log('Creating canvas...');
    complexCanvas = document.createElement('canvas');
    complexCanvas.id = 'dotAnimation';
    document.body.appendChild(complexCanvas);
  }
  
  // Canvas sichtbar machen - ULTRA FORCE
  complexCanvas.style.position = 'fixed';
  complexCanvas.style.top = '0';
  complexCanvas.style.left = '0';
  complexCanvas.style.width = '100vw';
  complexCanvas.style.height = '100vh';
  complexCanvas.style.pointerEvents = 'none';
  complexCanvas.style.zIndex = '0';
  complexCanvas.style.display = 'block';
  complexCanvas.style.visibility = 'visible';
  complexCanvas.style.opacity = '1';
  complexCanvas.style.background = 'transparent';
  
  console.log('✅ Canvas styled and visible');
  
  // Context holen
  complexCtx = complexCanvas.getContext('2d');
  if (!complexCtx) {
    console.error('❌ No canvas context!');
    return;
  }
  
  console.log('✅ Canvas context ready');
  
  // Canvas-Größe setzen
  setupCanvasSize();
  
  // VIELE Punkte erstellen
  createComplexDots();
  
  // Animation starten
  startComplexAnimation();
  
  console.log('🎉 COMPLEX ANIMATION INITIALIZED!');
}

function setupCanvasSize() {
  complexCanvas.width = window.innerWidth;
  complexCanvas.height = window.innerHeight;
  console.log(`Canvas size: ${complexCanvas.width}x${complexCanvas.height}`);
}

function createComplexDots() {
  console.log('🎨 Creating complex dots...');
  
  complexDots = [];
  const centerX = complexCanvas.width / 2;
  const centerY = complexCanvas.height / 2;
  const maxRadius = Math.min(complexCanvas.width, complexCanvas.height) * 0.6;
  
  // VIELE Punkte erstellen - 2000 Stück!
  for (let i = 0; i < 2000; i++) {
    // Verschiedene Patterns
    let x, y, pattern;
    
    if (i < 800) {
      // Pattern 1: Fibonacci Spirale
      const phi = Math.acos(1 - 2 * i / 800);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = (i / 800) * maxRadius;
      
      x = centerX + radius * Math.sin(phi) * Math.cos(theta);
      y = centerY + radius * Math.sin(phi) * Math.sin(theta);
      pattern = 'fibonacci';
      
    } else if (i < 1400) {
      // Pattern 2: Concentric Circles
      const ringIndex = Math.floor((i - 800) / 100);
      const pointInRing = (i - 800) % 100;
      const ringRadius = 150 + ringIndex * 80;
      const angle = (pointInRing / 100) * Math.PI * 2;
      
      x = centerX + Math.cos(angle) * ringRadius;
      y = centerY + Math.sin(angle) * ringRadius;
      pattern = 'circles';
      
    } else {
      // Pattern 3: Random Organic
      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * (maxRadius - 200);
      const organic = 1 + (Math.random() - 0.5) * 0.5;
      
      x = centerX + Math.cos(angle) * distance * organic;
      y = centerY + Math.sin(angle) * distance * organic;
      pattern = 'organic';
    }
    
    // Skip center area (um Text Platz zu lassen)
    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distanceFromCenter < 200) continue;
    
    // Größe basierend auf Entfernung
    let size;
    if (distanceFromCenter < 300) {
      size = 0.5 + Math.random() * 2; // Kleine Punkte nah am Zentrum
    } else if (distanceFromCenter < 500) {
      size = 1 + Math.random() * 4;   // Mittlere Punkte
    } else {
      size = 2 + Math.random() * 6;   // Große Punkte außen
    }
    
    // Farbe basierend auf Pattern und Größe
    let colorType;
    if (pattern === 'fibonacci') {
      colorType = size < 2 ? 'glasig' : 'normal';
    } else if (pattern === 'circles') {
      colorType = size < 3 ? 'hell' : 'kräftig';
    } else {
      colorType = ['normal', 'kräftig', 'dunkel'][Math.floor(Math.random() * 3)];
    }
    
    const color = PURPLE_VARIANTS[colorType];
    
    complexDots.push({
      x: x,
      y: y,
      targetX: x,
      targetY: y,
      baseX: x,
      baseY: y,
      size: size,
      targetSize: size,
      color: color,
      angle: Math.atan2(y - centerY, x - centerX),
      distance: distanceFromCenter,
      speed: 0.002 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
      pattern: pattern,
      opacity: color.alpha,
      targetOpacity: color.alpha
    });
  }
  
  console.log(`✅ Created ${complexDots.length} complex dots`);
}

function updateComplexDots() {
  animationTime += 0.016;
  
  const centerX = complexCanvas.width / 2;
  const centerY = complexCanvas.height / 2;
  
  for (let i = 0; i < complexDots.length; i++) {
    const dot = complexDots[i];
    
    // Verschiedene Bewegungsmuster
    let motionX = 0, motionY = 0;
    
    if (dot.pattern === 'fibonacci') {
      // Langsame Spirale mit Pulsation
      const spiral = Math.sin(animationTime * 0.3 + dot.phase) * 0.1;
      const pulse = Math.sin(animationTime * 0.5 + i * 0.01) * 0.08;
      const newDistance = dot.distance * (1 + spiral + pulse);
      const newAngle = dot.angle + animationTime * dot.speed;
      
      motionX = centerX + Math.cos(newAngle) * newDistance;
      motionY = centerY + Math.sin(newAngle) * newDistance;
      
    } else if (dot.pattern === 'circles') {
      // Konzentrische Kreise mit Wave
      const wave = Math.sin(animationTime * 0.8 + dot.angle * 3) * 0.15;
      const rotate = Math.sin(animationTime * 0.2) * 0.1;
      const newDistance = dot.distance * (1 + wave);
      const newAngle = dot.angle + animationTime * dot.speed + rotate;
      
      motionX = centerX + Math.cos(newAngle) * newDistance;
      motionY = centerY + Math.sin(newAngle) * newDistance;
      
    } else {
      // Organic random movement
      const chaos1 = Math.sin(animationTime * 0.4 + dot.phase) * 0.2;
      const chaos2 = Math.cos(animationTime * 0.6 + dot.phase * 1.3) * 0.15;
      const chaos3 = Math.sin(animationTime * 0.1 + i * 0.05) * 0.1;
      
      const distortion = 1 + chaos1 + chaos2 + chaos3;
      const newAngle = dot.angle + animationTime * dot.speed * 0.7;
      const newDistance = dot.distance * distortion;
      
      motionX = centerX + Math.cos(newAngle) * newDistance;
      motionY = centerY + Math.sin(newAngle) * newDistance;
    }
    
    // Smooth interpolation zu neuer Position
    dot.targetX = motionX;
    dot.targetY = motionY;
    
    dot.x += (dot.targetX - dot.x) * 0.08;
    dot.y += (dot.targetY - dot.y) * 0.08;
    
    // Text-Cutout: Abstand vom Hero-Text halten
    const heroContainer = document.querySelector('.hero-text-container');
    if (heroContainer && window.currentSlide === 0) {
      const rect = heroContainer.getBoundingClientRect();
      const textCenterX = rect.left + rect.width / 2;
      const textCenterY = rect.top + rect.height / 2;
      const textRadiusX = Math.max(200, rect.width * 0.7);
      const textRadiusY = Math.max(150, rect.height * 0.7);
      
      const dx = dot.x - textCenterX;
      const dy = dot.y - textCenterY;
      const ellipseDistance = Math.sqrt((dx*dx)/(textRadiusX*textRadiusX) + (dy*dy)/(textRadiusY*textRadiusY));
      
      if (ellipseDistance < 0.9) {
        // Zu nah am Text - ausblenden
        dot.targetOpacity = 0;
      } else if (ellipseDistance < 1.2) {
        // Übergangsbereich - fade out
        const fade = (ellipseDistance - 0.9) / (1.2 - 0.9);
        dot.targetOpacity = dot.color.alpha * fade * 0.5;
      } else {
        // Weit genug weg - volle Sichtbarkeit
        dot.targetOpacity = dot.color.alpha;
      }
    } else {
      // Auf anderen Slides oder kein Hero-Container: volle Sichtbarkeit
      dot.targetOpacity = dot.color.alpha;
    }
    
    // Smooth opacity transition
    dot.opacity += (dot.targetOpacity - dot.opacity) * 0.06;
    
    // Größen-Variationen über Zeit
    const sizeWave = Math.sin(animationTime * 0.3 + dot.phase) * 0.2;
    dot.targetSize = dot.size * (1 + sizeWave);
  }
}

function drawComplexDots() {
  if (!complexCtx) return;
  
  // Canvas leeren
  complexCtx.clearRect(0, 0, complexCanvas.width, complexCanvas.height);
  
  // Alle Punkte zeichnen
  for (let i = 0; i < complexDots.length; i++) {
    const dot = complexDots[i];
    
    if (dot.opacity > 0.01) {
      const finalOpacity = Math.max(0, Math.min(1, dot.opacity));
      
      // Gradient für glasige Effekte
      if (dot.color === PURPLE_VARIANTS.glasig) {
        const gradient = complexCtx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.targetSize * 2
        );
        gradient.addColorStop(0, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${finalOpacity})`);
        gradient.addColorStop(1, `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0)`);
        complexCtx.fillStyle = gradient;
      } else {
        complexCtx.fillStyle = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, ${finalOpacity})`;
      }
      
      complexCtx.beginPath();
      complexCtx.arc(dot.x, dot.y, dot.targetSize, 0, Math.PI * 2);
      complexCtx.fill();
      
      // Zusätzlicher Glow-Effekt für größere Punkte
      if (dot.targetSize > 4 && dot.opacity > 0.3) {
        complexCtx.shadowColor = `rgba(${dot.color.r}, ${dot.color.g}, ${dot.color.b}, 0.3)`;
        complexCtx.shadowBlur = dot.targetSize * 2;
        complexCtx.beginPath();
        complexCtx.arc(dot.x, dot.y, dot.targetSize * 0.5, 0, Math.PI * 2);
        complexCtx.fill();
        complexCtx.shadowBlur = 0;
      }
    }
  }
}

function startComplexAnimation() {
  if (isAnimationRunning) return;
  
  isAnimationRunning = true;
  console.log('🎨 Starting complex animation loop...');
  
  function animateComplexFrame() {
    if (!isAnimationRunning) return;
    
    try {
      // Canvas immer sichtbar halten
      if (complexCanvas) {
        complexCanvas.style.display = 'block';
        complexCanvas.style.visibility = 'visible';
        complexCanvas.style.opacity = '1';
      }
      
      updateComplexDots();
      drawComplexDots();
    } catch (error) {
      console.error('Complex animation error:', error);
    }
    
    requestAnimationFrame(animateComplexFrame);
  }
  
  animateComplexFrame();
  console.log('🎉 COMPLEX ANIMATION IS RUNNING!');
}

// Resize handler
function handleComplexResize() {
  if (complexCanvas) {
    setupCanvasSize();
    createComplexDots();
    console.log('Complex animation resized');
  }
}

window.addEventListener('resize', handleComplexResize);

// Export functions
window.initComplexAnimation = initComplexAnimation;
window.stopComplexAnimation = () => {
  isAnimationRunning = false;
  console.log('Complex animation stopped');
};

console.log('✅ Complex animation module loaded');