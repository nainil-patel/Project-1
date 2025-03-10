console.log("Third Screening JS loaded");

// Example p5 generative art for the third screening
let thirdArtSketch = (p) => {
  p.setup = function() {
    const artDiv = document.getElementById('ticketArtThird');
    if (!artDiv) return;
    p.createCanvas(artDiv.clientWidth, artDiv.clientHeight);
    p.background(0);
  };

  p.draw = function() {
    p.background(0);
    p.stroke(255, 218, 185);
    p.noFill();
    // Example: random lines
    for (let i = 0; i < 5; i++){
      let x1 = p.random(p.width);
      let y1 = p.random(p.height);
      let x2 = p.random(p.width);
      let y2 = p.random(p.height);
      p.line(x1, y1, x2, y2);
    }
  };

  p.windowResized = function() {
    const artDiv = document.getElementById('ticketArtThird');
    p.resizeCanvas(artDiv.clientWidth, artDiv.clientHeight);
    p.background(0);
  };
};

// Initialize the p5 sketch for third screening
let thirdArtInstance = new p5(thirdArtSketch, document.getElementById('ticketArtThird'));
