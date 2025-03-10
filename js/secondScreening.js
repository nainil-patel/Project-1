console.log("Second Screening script loaded");

// Optional: Add a p5 generative art sketch for the second screening.
// This sketch will render inside the #ticketArtSecond div.

let secondArtSketch = (p) => {
  p.setup = function() {
    const ticketArtDiv = document.getElementById('ticketArtSecond');
    const w = ticketArtDiv.clientWidth;
    const h = ticketArtDiv.clientHeight;
    p.createCanvas(w, h);
    p.background(0);
  };

  p.draw = function() {
    p.background(0);
    p.stroke(255, 218, 185);
    p.noFill();
    // Example generative art: Draw 5 random circles per frame
    for (let i = 0; i < 5; i++){
      let x = p.random(p.width);
      let y = p.random(p.height);
      let d = p.random(10, 50);
      p.ellipse(x, y, d, d);
    }
  };

  p.windowResized = function() {
    const ticketArtDiv = document.getElementById('ticketArtSecond');
    const w = ticketArtDiv.clientWidth;
    const h = ticketArtDiv.clientHeight;
    p.resizeCanvas(w, h);
    p.background(0);
  };
};

let secondArtInstance = new p5(secondArtSketch, document.getElementById('ticketArtSecond'));

// (Optional) If you need to add any additional JavaScript functionality for the second screening,
// add it below.
