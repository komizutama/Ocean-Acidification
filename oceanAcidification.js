const numIons = 50;
var molecules = [];
var bouncey = true;

// http://paletton.com/#uid=73v1c0kllll0W7ob8envysjYfES

function setup() {
  // Create Canvas
  createCanvas(windowWidth, windowHeight); 
  // Create objects
  reset();
}

function draw() {
  var backgroundColor = color(75, 75, 78);
  background(backgroundColor);
  for (var i=0; i < molecules.length; i++) {
    molecules[i].checkEdges(bouncey);
    molecules[i].move();
    // molecules[i].displayDot();
    molecules[i].displayECloud();
  }
}

function reset(){
  for (var i=0; i < numIons; i++) {
    molecules.push(new ion());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function wallWrap(pos, trav, axisSize) {
  if (pos + trav > axisSize) {
    return 0;
  }
  else if (pos + trav <0){
    return axisSize;
  }
  else {
    return pos + trav;
  }
}

function wallBounce(pos, trav, axisSize){
  if (pos + trav > axisSize) {
    return -trav;
  }
  else if (pos + trav <0){
    return -trav;
  }
  else {
    return trav;
  }
}
// Ion class
function ion() {
  this.mass = 1;
  this.charge = 1;
  this.diameter = 12.5;
  this.speed = 1;
  this.ionColor = color(255, 142, 0);
  this.position = [random(width), random(height)];
  this.delta = [random(-this.speed, this.speed), random(-this.speed, this.speed)];
  this.canvasSize = [windowWidth, windowHeight];


// Check if hitting the wall
  this.checkEdges = function(b) {
    if (b) {
      for (var i=0; i < this.position.length; i++) {
        this.delta[i] = wallBounce(this.position[i], this.delta[i], this.canvasSize[i]);
      }
    }
    else {
      for (var i=0; i < this.position.length; i++) {
        this.position[i] = wallWrap(this.position[i], this.delta[i], this.canvasSize[i]);
      }
    }
  }

// change location
  this.move = function() {
    for (var i=0; i < this.position.length; i++){
      this.position[i] += this.delta[i];
    }
  }


  this.displayECloud = function () {
    var h = 100;
    for (var r = this.diameter; r > 0; r--) {
      var ionColor = color(255, 142, 0, h);
      h= 100-r*100/this.diameter;
      noStroke();
      fill(ionColor);
      ellipse(this.position[0], this.position[1], r, r);
    }
  }

// display ion in new location
  this.displayDot = function() { 
    fill(this.ionColor);
    ellipse(this.position[0], this.position[1], this.diameter, this.diameter);
    noStroke();
  }
}