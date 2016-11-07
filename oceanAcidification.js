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
    // molecules[i].elasticCollision(i);
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
    unitNormal.push(normalVec[i]/Math.sqrt(Math.pow(unitNormal[0],2)+Math.pow(unitNormal[1], 2)));
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
          this.elasticCollision[this.molecules[i], this.molecules[j]]
        }
      }
    }  
  }

  this.elasticCollision = function (molA, MolB) {
    let unitNormal= unitNormal(molA.position, molB.position);
    let unitTan = unitTan(unitNormal);
    let vecANormI = dotProduct(unitNormal, molA.velocity);
    let vecBNormI = dotProduct(unitNormal, molB.velocity);
    let vecATanF = dotProduct(unitTan, molA.velocity);
    let vecBTanF = dotProduct(unitTan, molB.velocity);
    let vecANormF = (vecANormI(molA.mass-molB.mass)+2*molB.mass*vecBNormI)/(molA.mass+mol.mass);
    let vecBNormF = (vecBNormI(molB.mass-molA.mass)+2*molA.mass*vecANormI)/(molA.mass+molB.mass);
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