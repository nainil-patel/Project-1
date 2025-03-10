console.log("Script loaded");

// ============================
// Global DOM References
// ============================
const landing = document.getElementById('landing');
const dotWrapper = document.getElementById('dotWrapper');
const finalLayout = document.getElementById('finalLayout');
const p5Container = document.getElementById('p5Container');
const ticketContainer = document.getElementById('ticketContainer');
// NEW: Reference for generative art container (inside ticket phase)
const ticketArtDiv = document.getElementById('ticketArt');

// ============================
// Global Variables for p5 Instances
// ============================
let pixelSketch;  // p5 instance for pixel explosion (Phase 3)
let generativeArt;  // p5 instance for generative art (Phase 4)

// ============================
// Compute Dot Scale
// ============================
const initialDiameter = 20;
function computeTargetScale() {
 const w = window.innerWidth;
 const h = window.innerHeight;
 const diag = Math.sqrt(w * w + h * h);
 return (diag / initialDiameter) * 1.05;
}
let targetScale = computeTargetScale();
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
  
    if (scrollY < T1) {
      // Phase 1: Dot expansion, etc.
      // (Hide p5 container, show landing, etc.)
      hideP5();
    }
    else if (scrollY >= T1 && scrollY < T2) {
      // Phase 2: Final layout fade in.
      hideP5();
    }
    else if (scrollY >= T2 && scrollY < T3) {
      // Phase 3: Pixel explosion.
      // Make sure p5 container is visible:
      showP5();
      // Set targetFactor to 1 when scrolling down (exploded state)
      if (pixelSketch) {
        pixelSketch.targetFactor = 1;
      }
    }
    else {
      // Phase 4: Ticket appears
      hideP5();
      // Other code...
    }
  
    // Additionally, when scrolling upward (for example, when scrollY falls below T2),
    // we want the explosion to reassemble:
    if (scrollY < T2 && pixelSketch) {
      pixelSketch.targetFactor = 0;
    }
  });

// ============================
// Define Scroll Thresholds (in pixels)
// Phase 1: 0..T1 = Dot expansion
// Phase 2: T1..T2 = Final layout (Rewatch + tagline) fade in
// Phase 3: T2..T3 = Pixel explosion via p5
// Phase 4: scrollY >= T3 = Ticket phase (ticket image + generative art)
const T1 = 1000;
const T2 = 1500;
const T3 = 1800;

// ============================
// Scroll Event Handler: Controls the Phases
// ============================
window.addEventListener('scroll', () => {
 const scrollY = window.scrollY;

 if (scrollY < T1) {
 // PHASE 1: Dot Expansion
 let progress = scrollY / T1;
 let scaleNow = 1 + (targetScale - 1) * progress;
 dotWrapper.style.transform = `translate(-50%, -50%) scale(${scaleNow})`;

 // Show landing; hide final layout, p5 container, and ticket container
 landing.style.display = 'block';
 landing.style.opacity = 1;
 finalLayout.style.display = 'none';
 finalLayout.style.opacity = 0;
 hideP5();
 hideTicket();
 }
 else if (scrollY >= T1 && scrollY < T2) {
 // PHASE 2: Final Layout Fade In
 dotWrapper.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
 let progress = (scrollY - T1) / (T2 - T1);
 landing.style.opacity = 1 - progress;
 finalLayout.style.display = 'flex';
 finalLayout.style.opacity = progress;
 hideP5();
 hideTicket();
 }
 else if (scrollY >= T2 && scrollY < T3) {
 // PHASE 3: Pixel Explosion Phase
 landing.style.display = 'none';
 landing.style.opacity = 0;
 finalLayout.style.display = 'none';
 finalLayout.style.opacity = 0;
 hideTicket(); // Ensure ticket stays hidden
 showP5();
 }
 else {
 // PHASE 4: Ticket Phase - Hide p5 canvas, show ticket container (which includes generative art)
 landing.style.display = 'none';
 finalLayout.style.display = 'none';
 hideP5();
 showTicket();
 }
});

// ============================
// p5 Instance Control for Pixel Explosion (Phase 3)
// ============================
function showP5() {
 if (!pixelSketch) {
 p5Container.style.display = 'block';
 pixelSketch = new p5(pixelExplosionSketch, p5Container);
 } else {
 p5Container.style.display = 'block';
 pixelSketch.loop();
 }
}
function hideP5() {
 if (pixelSketch) {
 p5Container.style.display = 'none';
 pixelSketch.noLoop();
 } else {
 p5Container.style.display = 'none';
 }
}

// ============================
// Ticket Phase: Show/Hide Ticket Container & Generative Art (Phase 4)
// ============================
function showTicket() {
 ticketContainer.style.display = 'flex';
 // NEW: Initialize or resume the generative art p5 instance in the #ticketArt div
 if (!generativeArt) {
 generativeArt = new p5(generativeArtSketch, ticketArtDiv);
 } else {
 generativeArt.loop();
 }
}
function hideTicket() {
 ticketContainer.style.display = 'none';
 if (generativeArt) {
 generativeArt.noLoop();
 }
}

// ============================
// p5 Sketch: Pixel Explosion for "Rewatch" (Phase 3)
// ============================
let pixelExplosionSketch = (p) => {
 let particles = [];
 const BUFFER_W = 300;
 const BUFFER_H = 100;
 const WORD = "Rewatch";

 let explodeFactor = 0;
 

 p.setup = function() {
    p.targetFactor = 1; // default to exploded
 p.createCanvas(p.windowWidth, p.windowHeight);
 p.pixelDensity(1);
 p.background(0);
 p.textFont('Poppins');
 p.textSize(80);
 p.textAlign(p.CENTER, p.CENTER);

 // Create offscreen buffer and draw text
 let pg = p.createGraphics(BUFFER_W, BUFFER_H);
 pg.pixelDensity(1);
 pg.textSize(80);
 pg.textAlign(p.CENTER, p.CENTER);
 pg.background(0,0);
 pg.fill(255);
 pg.noStroke();
 pg.text(WORD, BUFFER_W/2, BUFFER_H/2+10);

 pg.loadPixels();
 for (let y = 0; y < BUFFER_H; y++) {
 for (let x = 0; x < BUFFER_W; x++) {
 let idx = 4 * (y * BUFFER_W + x);
 let a = pg.pixels[idx+3];
 if (a > 0) {
 let home = p.createVector(x, y);
 let angle = p.random(p.TWO_PI);
 let dist = p.random(100, 800); // Increase spread as desired
 let exploded = p.createVector(
 x + p.cos(angle) * dist,
 y + p.sin(angle) * dist
 );
 let current = home.copy();
 particles.push({
 homePos: home,
 explodedPos: exploded,
 currentPos: current,
 col: [255, 255, 255, 255] // White color
 });
 }
 }
 }
 };

 p.draw = function() {
 p.background(0);
 // Interpolate explosion factor toward targetFactor
 explodeFactor = p.lerp(explodeFactor, p.targetFactor, 0.1);

 p.push();
 // Center the text buffer in the canvas
 p.translate(p.width/2 - BUFFER_W/2, p.height/2 - BUFFER_H/2);
 p.noStroke();
 for (let pt of particles) {
 let tx = p.lerp(pt.homePos.x, pt.explodedPos.x, explodeFactor);
 let ty = p.lerp(pt.homePos.y, pt.explodedPos.y, explodeFactor);
 pt.currentPos.x = p.lerp(pt.currentPos.x, tx, 0.2);
 pt.currentPos.y = p.lerp(pt.currentPos.y, ty, 0.2);

 // Fade out particles if explodeFactor is high
 let alpha = 255;
 if (explodeFactor > 0.8) {
 alpha = p.map(explodeFactor, 0.8, 1, 255, 100);
 }
 p.fill(pt.col[0], pt.col[1], pt.col[2], alpha);
 p.rect(pt.currentPos.x, pt.currentPos.y, 1, 1);
 }
 p.pop();
 };

 p.windowResized = function() {
 p.resizeCanvas(p.windowWidth, p.windowHeight);
 };
};

// ============================
// p5 Sketch: Generative Art for Ticket (Phase 4)
// ===========================
let generativeArtSketch = (p) => {
 p.setup = function() {
 // Create canvas matching the dimensions of the #ticketArt div
 const ticketArtDiv = document.getElementById('ticketArt');
 const w = ticketArtDiv.clientWidth;
 const h = ticketArtDiv.clientHeight;
 p.createCanvas(w, h);
 p.background(0);
 };

 p.draw = function() {
 p.background(0);
 p.stroke(255, 218, 185);
 p.noFill();
 // Example generative art: Draw 5 random lines per frame
 for (let i = 0; i < 5; i++){
 let x1 = p.random(p.width);
 let y1 = p.random(p.height);
 let x2 = p.random(p.width);
 let y2 = p.random(p.height);
 p.line(x1, y1, x2, y2);
 }
 };

 p.windowResized = function() {
 const ticketArtDiv = document.getElementById('ticketArt');
 const w = ticketArtDiv.clientWidth;
 const h = ticketArtDiv.clientHeight;
 p.resizeCanvas(w, h);
 p.background(0);
 };
};
