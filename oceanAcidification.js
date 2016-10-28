const numIons = 5;
var molecules = [];
var bouncey = true;

function setup() {
  // Create Canvas
  createCanvas(windowWidth, windowHeight); 
  // Create objects
  reset();
}

function draw() {
  background(51);
  for (var i=0; i < molecules.length; i++) {
    molecules[i].checkEdges(bouncey);
    molecules[i].move();
    // molecules[i].moveBounce();
    molecules[i].display();
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

  // this.moveBounce = function() {
  //   if ((this.newPosY > (windowHeight-20)) || (this.newPosY < 20)) {
  //     this.delY = -this.delY;
  //   }
  //   if ((this.newPosX > (windowWidth-20)) || (this.newPosX < 20)) {
  //     this.delX = -this.delX;
  //   }
  //   this.x =+ this.delX;
  //   this.y =+ this.delY;
  // }

// display ion in new location
  this.display = function() {
    ellipse(this.position[0], this.position[1], this.diameter, this.diameter);
  }
}