const numIons = 20;
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
    molecules[i].checkEdges("bouncey");
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
  // var dx = Math.abs(molA.position[0])-Math.abs(molB.position[0]);
  // var dy = Math.abs(molA.position[1])-Math.abs(molB.position[1]);
  // var distance = Math.sqrt(dx * dx + dy * dy)
  // while (distance < molA.radius + molB.radius){
  //   molA.move();
  //   molB.move();
  //   var dx = Math.abs(molA.position[0])-Math.abs(molB.position[0]);
  //   var dy = Math.abs(molA.position[1])-Math.abs(molB.position[1]);
  //   var distance = Math.sqrt(dx * dx + dy * dy)
  // }
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

function newVel() {
  return [random(-this.speed, this.speed), random(-this.speed, this.speed)]
}

function randNewSidePos(radius){
  let i = Math.floor(Math.random()*4+1);
  switch (i){
    case 1: return [random(width-radius/2)+radius/2, 0];
    case 2: return [random(width-radius/2)+radius/2, height];
    case 3: return [0, random(height-radius/2)+radius/2];
    case 4: return [width, random(height-radius/2)+radius/2];
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
  this.radius = 7;
  this.speed = 1;
  this.ionColor = color(255, 142, 0);
  this.position = [random(width-this.radius/2)+this.radius/2, random(height-this.radius/2)+this.radius/2];
  this.velocity = newVel();
  this.canvasSize = [windowWidth, windowHeight];


// Check if hitting the wall
  this.checkEdges = function(wallType) {
    if (wallType = "infinite") {
      for (var i = 0; i < this.position.length; i++ ) {
        if ((this.position[i] > this.canvasSize[i]) || (this.position[i] < 0)) {
          this.position = randNewSidePos(this.radius);
          this.velocity = newVel();
        }
      }
    }
    else if (wallType = "bouncey") {
      for (var i=0; i < this.position.length; i++) {
        this.velocity[i] = wallBounce(this.position[i], this.velocity[i], this.canvasSize[i], this.radius);
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
        if (distance < molecules[i].radius + molecules[j].radius) {
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
    let d = this.radius*2
    let eCloudBorder = color(255, 142, 0, 80);
    stroke(eCloudBorder);
    noFill();
    ellipse (this.position[0],this.position[1], d, d)
    let eCloudColor = color(255, 142, 0, 50);
    fill(eCloudColor);
    noStroke();
    ellipse (this.position[0],this.position[1], d, d)
    for (var r = d*2/3; r > 0; r--) {
      let h= 100-100/r;
      var ionColor = color(255, 142, 0, h);
      noStroke();
      fill(ionColor);
      ellipse(this.position[0], this.position[1], r, r);
    }
  }

// display as a dot.
  this.displayDot = function() { 
    fill(this.ionColor);
    ellipse(this.position[0], this.position[1], d, this.radius);
    noStroke();
  }
}