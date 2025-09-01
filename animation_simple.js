/* ===== SUPER EINFACHE ANIMATION - GARANTIERT FUNKTIONSFÄHIG ===== */

console.log('🎨 Starting SIMPLE animation system...');

let animationCanvas = null;
let animationCtx = null;
let animationDots = [];
let animationTime = 0;
let animationRunning = false;

function createSimpleAnimation() {
  console.log('🎨 Creating simple animation...');
  
  // Canvas finden oder erstellen
  animationCanvas = document.getElementById('dotAnimation');
  if (!animationCanvas) {
    console.log('Canvas not found, creating new one...');
    animationCanvas = document.createElement('canvas');
    animationCanvas.id = 'dotAnimation';
    document.body.appendChild(animationCanvas);
  }
  
  console.log('✅ Canvas ready:', animationCanvas);
  
  // Canvas sichtbar machen
  animationCanvas.style.position = 'fixed';
  animationCanvas.style.top = '0';
  animationCanvas.style.left = '0';
  animationCanvas.style.width = '100vw';
  animationCanvas.style.height = '100vh';
  animationCanvas.style.pointerEvents = 'none';
  animationCanvas.style.zIndex = '0';
  animationCanvas.style.display = 'block';
  animationCanvas.style.visibility = 'visible';
  animationCanvas.style.opacity = '1';
  
  console.log('✅ Canvas styled');
  
  // Context holen
  animationCtx = animationCanvas.getContext('2d');
  if (!animationCtx) {
    console.error('❌ No canvas context!');
    return;
  }
  
  console.log('✅ Canvas context ready');
  
  // Canvas-Größe setzen
  animationCanvas.width = window.innerWidth;
  animationCanvas.height = window.innerHeight;
  
  console.log(`✅ Canvas size: ${animationCanvas.width}x${animationCanvas.height}`);
  
  // Einfache Punkte erstellen
  createSimpleDots();
  
  // Animation starten
  startSimpleAnimation();
}

function createSimpleDots() {
  console.log('🎨 Creating simple dots...');
  
  animationDots = [];
  const centerX = animationCanvas.width / 2;
  const centerY = animationCanvas.height / 2;
  const radius = Math.min(animationCanvas.width, animationCanvas.height) * 0.4;
  
  // 300 einfache Punkte in Kreis
  for (let i = 0; i < 300; i++) {
    const angle = (i / 300) * Math.PI * 2;
    const distance = 100 + (i / 300) * radius;
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    animationDots.push({
      x: x,
      y: y,
      baseX: x,
      baseY: y,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
      angle: angle,
      distance: distance,
      speed: 0.005 + Math.random() * 0.01
    });
  }
  
  console.log(`✅ Created ${animationDots.length} dots`);
}

function updateSimpleDots() {
  animationTime += 0.016;
  
  const centerX = animationCanvas.width / 2;
  const centerY = animationCanvas.height / 2;
  
  for (let i = 0; i < animationDots.length; i++) {
    const dot = animationDots[i];
    
    // Einfache Rotation + Pulsation
    const newAngle = dot.angle + animationTime * dot.speed;
    const pulse = 1 + Math.sin(animationTime + i * 0.1) * 0.1;
    const newDistance = dot.distance * pulse;
    
    dot.x = centerX + Math.cos(newAngle) * newDistance;
    dot.y = centerY + Math.sin(newAngle) * newDistance;
  }
}

function drawSimpleDots() {
  if (!animationCtx) return;
  
  // Canvas leeren
  animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
  
  // Punkte zeichnen
  for (let i = 0; i < animationDots.length; i++) {
    const dot = animationDots[i];
    
    animationCtx.fillStyle = `rgba(160, 120, 200, ${dot.opacity})`;
    animationCtx.beginPath();
    animationCtx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    animationCtx.fill();
  }
}

function startSimpleAnimation() {
  if (animationRunning) return;
  
  animationRunning = true;
  console.log('🎨 Starting animation loop...');
  
  function animateFrame() {
    if (!animationRunning) return;
    
    try {
      updateSimpleDots();
      drawSimpleDots();
    } catch (error) {
      console.error('Animation error:', error);
    }
    
    requestAnimationFrame(animateFrame);
  }
  
  animateFrame();
  console.log('🎉 ANIMATION IS NOW RUNNING!');
}

function stopSimpleAnimation() {
  animationRunning = false;
  console.log('Animation stopped');
}

// Resize handler
window.addEventListener('resize', () => {
  if (animationCanvas) {
    animationCanvas.width = window.innerWidth;
    animationCanvas.height = window.innerHeight;
    createSimpleDots();
    console.log('Animation resized');
  }
});

// Export für globale Nutzung
window.createSimpleAnimation = createSimpleAnimation;
window.stopSimpleAnimation = stopSimpleAnimation;

console.log('✅ Simple animation module loaded');