var molecules = [];

function setup() {
 createCanvas(windowWidth, windowHeight);
 for (var i=0; i <50; i++); {
  molecules.push(new atom())
 }
}

function draw() {
  background(51);
  for (var i=0; i < molecules.length; i++) {
    molecules[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function atom() {
  this.x = random(width);
  this.y = random(height);
  var deltaX = random(-this.speed, this.speed);
  var deltaY = random(-this.speed, this.speed);
  this.diameter = 30;
  this.speed = 1;

  this.move = function() {
    this.x += deltaX;
    this.y += deltaY;
  };

  this.display = function() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  };
}