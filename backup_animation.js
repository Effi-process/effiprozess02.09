// BACKUP: Original OrganicBubbleAnimation - Lila Blasen mit Wellenbewegung
class OrganicBubbleAnimation {
    constructor() {
        this.canvas = document.getElementById('dotAnimation');
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mousePos = { x: 0, y: 0 };
        this.currentSection = 0;
        this.scrollProgress = 0;
        this.animationTime = 0;
        
        this.setupCanvas();
        this.createOrganicBubble();
        this.bindEvents();
        // Initialize bubble shape immediately
        this.updateBubbleShape();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createOrganicBubble() {
        // Create organic bubble exactly like LoanPro reference
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        this.dots = [];
        
        // Create organic bubble shape with points distributed from inside to outside
        const numPoints = 5000; // Much more points for very dense bubble
        
        for (let i = 0; i < numPoints; i++) {
            // Use fibonacci spiral for even distribution on sphere
            const phi = Math.acos(1 - 2 * i / numPoints);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            // Create organic, uneven bubble shape (not perfect sphere)
            const baseDistortion = 1 + Math.sin(phi * 4) * 0.2 + Math.cos(theta * 3) * 0.15;
            let radius = baseRadius * baseDistortion;
            
            // Make it more organic and uneven like LoanPro
            const organicFactor = 0.7 + Math.random() * 0.6; // Random radius variation
            radius *= organicFactor;
            
            // 3D coordinates
            const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
            const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // Distance from center (2D) - for opacity calculation
            const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const maxDistance = baseRadius * 1.2;
            
            // Opacity: transparent in center, darker towards edges
            const centerOpacity = Math.max(0, (distanceFromCenter - 120) / maxDistance);
            const finalOpacity = Math.min(0.9, centerOpacity * 2.5); // Stronger opacity
            
            // Size: smaller in center, larger towards edges
            const baseSize = 1 + (distanceFromCenter / maxDistance) * 2;
            
            // Only create points that are not in the very center (text area)
            const skipCenter = distanceFromCenter < 150; // Larger clear center for text
            
            if (!skipCenter) {
                this.dots.push({
                    originalX: x,
                    originalY: y,
                    originalZ: z,
                    x: x,
                    y: y,
                    z: z,
                    phi: phi,
                    theta: theta,
                    baseRadius: radius,
                    distanceFromCenter: distanceFromCenter,
                    baseSize: baseSize,
                    size: baseSize,
                    opacity: finalOpacity, // Start with full opacity immediately
                    targetOpacity: finalOpacity,
                    color: 'rgba(150, 150, 200, ', // Light purple-blue like LoanPro
                    animationDelay: i * 0.5, // Faster appearance
                    isVisible: true, // Show immediately
                    noiseOffset: Math.random() * Math.PI * 2
                });
            }
        }
    }
}