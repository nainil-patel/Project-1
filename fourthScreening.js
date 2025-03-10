console.log("Fourth Screening JS loaded");

// Example p5 generative art for the fourth screening
let fourthArtSketch = (p) => {
  p.setup = function() {
    const ticketArtDiv4 = document.getElementById('ticketArt4');
    if (!ticketArtDiv4) return; // safeguard
    p.createCanvas(ticketArtDiv4.clientWidth, ticketArtDiv4.clientHeight);
    p.background(0);
  };

  p.draw = function() {
    p.background(0);
    p.stroke(255, 218, 185);
    p.noFill();
    // Example: random rectangles
    for (let i = 0; i < 5; i++){
      let x = p.random(p.width);
      let y = p.random(p.height);
      let w = p.random(10, 50);
      let h = p.random(10, 50);
      p.rect(x, y, w, h);
    }
  };

  p.windowResized = function() {
    const ticketArtDiv4 = document.getElementById('ticketArt4');
    p.resizeCanvas(ticketArtDiv4.clientWidth, ticketArtDiv4.clientHeight);
    p.background(0);
  };
};

// Attach the p5 sketch to #ticketArt4
let fourthArtInstance = new p5(fourthArtSketch, document.getElementById('ticketArt4'));
