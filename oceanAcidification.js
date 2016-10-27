const numIons = 50;
var molecules = [];

function setup() {
  // Create Canvas
  createCanvas(windowWidth, windowHeight); 
  // Create objects
  for (var i=0; i < numIons; i++) {
    molecules.push(new ion());
    console.log(i);
  }
}

function draw() {
  background(51);
  for (var i=0; i < molecules.length; i++) {
    molecules[i].move();
    molecules[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Ion class
function ion() {
  this.x = random(width);
  this.y = random(height);
  this.diameter = 12.5;
  this.speed = 1;
  this.travelX = random(-this.speed, this.speed);
  this.travelY = random(-this.speed, this.speed);

// change location
  this.move = function() {
    this.x += this.travelX;
    this.y += this.travelY;
  };

// display ion in new location
  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}