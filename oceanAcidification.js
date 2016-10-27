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
    molecules[i].moveWrap();
    molecules[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function wallWrap(pos, trav, axisSize) {
  if (pos + trav > axisSize) {
    return 0;
  }
  else if (pos+trav <0){
    return axisSize;
  }
  else {
    return pos + trav;
  }
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
  this.moveWrap = function() {
    if (this.x + this.travelX > windowWidth) {
      this.x = 0;
    }
    else if (this.x + this.travelX < 0) {
      this.x = windowWidth;
    }
    else {
      this.x += this.travelX;
    }

    if (this.y + this.travelY > windowHeight) {
      this.y = 0;
    }
    else if (this.y + this.travelY <0 ) {
      this.y = windowHeight;
    }
    else {
      this.y += this.travelY;
    }
  };

// display ion in new location
  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}