const numIons = 50;
var molecules = [];
var bouncey = true;
var collisionLog = [];

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
  movementHandler()
}

function movementHandler () {
  for (var i=0; i < molecules.length; i++) {
    molecules[i].checkEdges(bouncey);
    molecules[i].collisionHandler(i);
    molecules[i].move();
    // molecules[i].displayDot();
    molecules[i].displayECloud();
  }
  collisionLog.fill(false);
}

function reset(){
  for (var i=0; i < numIons; i++) {
    molecules.push(new ion());
    collisionLog.push(false);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function unitNormal (posA, posB) {
  var normalVec = [(posB[0]-posA[0]), (posB[1]-posA[1])];
  var unitNormal=[];
  for (var i=0; i < normalVec.length; i++){
    unitNormal.push(normalVec[i]/Math.sqrt(Math.pow(normalVec[0],2)+Math.pow(normalVec[1], 2)));
  }
  return unitNormal;
}

function unitTan (unitNormal) {
  var unitTan = [-unitNormal[1], unitNormal[0]];
  return unitTan;
}

function dotProduct(vectorA, vectorB) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
}

function addVectors(vectorA, vectorB) {
  return [vectorA[0]+vectorB[0], vectorA[1]+vectorB[1]];
}

function elasticCollision(molA, molB) {
  let uN= unitNormal(molA.position, molB.position);
  let uT = unitTan(uN);
  let vecANormI = dotProduct(uN, molA.velocity);
  let vecBNormI = dotProduct(uN, molB.velocity);
  let velATanF = dotProduct(uT, molA.velocity);
  let velBTanF = dotProduct(uT, molB.velocity);
  let velANormF = ((vecANormI*(molA.mass-molB.mass)+2*molB.mass*vecBNormI)/(molA.mass+molB.mass));
  let velBNormF = ((vecBNormI*(molB.mass-molA.mass)+2*molA.mass*vecANormI)/(molA.mass+molB.mass));
  let vecANormF = [uN[0]*velANormF, uN[1] * velANormF];
  let vecBNormF = [uN[1]*velBNormF, uN[1] *velBNormF];
  let vecATanF = [uT[0] * velATanF, uT[1]*velATanF];
  let vecBTanF = [uT[0] * velBTanF, uT[1] * velBTanF];
  molA.velocity = addVectors(vecANormF, vecATanF);
  molB.velocity = addVectors(vecBNormF, vecBTanF);
  var dx = Math.abs(molA.position[0])-Math.abs(molB.position[0]);
  var dy = Math.abs(molA.position[1])-Math.abs(molB.position[1]);
  var distance = Math.sqrt(dx * dx + dy * dy)
  while (distance < molA.diameter + molB.diameter){
    molA.move();
    molB.move();
    var dx = Math.abs(molA.position[0])-Math.abs(molB.position[0]);
    var dy = Math.abs(molA.position[1])-Math.abs(molB.position[1]);
    var distance = Math.sqrt(dx * dx + dy * dy)
  }
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



function wallBounce(pos, trav, axisSize, diam){
  if (pos + trav + diam/2> axisSize) {
    return -trav;
  }
  else if (pos + trav - diam/2 <0){
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
  this.diameter = 14;
  this.speed = 1;
  this.ionColor = color(255, 142, 0);
  this.position = [random(width-this.diameter/2)+this.diameter/2, random(height-this.diameter/2)+this.diameter/2];
  this.velocity = [random(-this.speed, this.speed), random(-this.speed, this.speed)];
  this.canvasSize = [windowWidth, windowHeight];


// Check if hitting the wall
  this.checkEdges = function(b) {
    if (b) {
      for (var i=0; i < this.position.length; i++) {
        this.velocity[i] = wallBounce(this.position[i], this.velocity[i], this.canvasSize[i], this.diameter);
      }
    }
    else {
      for (var i=0; i < this.position.length; i++) {
        this.position[i] = wallWrap(this.position[i], this.velocity[i], this.canvasSize[i]);
      }
    }
  }


  this.collisionHandler = function(i) {
    if (collisionLog[i] === false){
      for (var j = i+1; j < molecules.length; j++) {
        var dx = Math.abs(molecules[i].position[0])-Math.abs(molecules[j].position[0]);
        var dy = Math.abs(molecules[i].position[1])-Math.abs(molecules[j].position[1]);
        var distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < molecules[i].diameter + molecules[j].diameter) {
          collisionLog[i] = true;
          collisionLog[j] = true;
          elasticCollision(molecules[i], molecules[j]);
        }
      }
    }  
  }



// change location
  this.move = function() {
    for (var i=0; i < this.position.length; i++){
      this.position[i] += this.velocity[i];
    }
  }


  this.displayECloud = function () {
    var h = 100;
    var eCloudColor = color(255, 142, 0, 50);
    noStroke();
    fill(eCloudColor);
    ellipse (this.position[0],this.position[1], this.diameter, this.diameter)
    for (var r = this.diameter*.5; r > 0; r--) {
      var ionColor = color(255, 142, 0, h);
      h= 100-100/r;
      noStroke();
      fill(ionColor);
      ellipse(this.position[0], this.position[1], r, r);
    }
  }

// display as a dot.
  this.displayDot = function() { 
    fill(this.ionColor);
    ellipse(this.position[0], this.position[1], this.diameter, this.diameter);
    noStroke();
  }
}