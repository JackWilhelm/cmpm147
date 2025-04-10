/* exported setup, draw */

let seed = 239;

const grassColor = "#53502f";
const skyColor = "#fdc327";
const stoneColor = "#3a4b56";
const treeColor = "#214900";
const roadColor = "#3c3334";
const roadLineColor = "#fdc327";
const cloudColor = "#0e217f";
let stripX = 5;
let stripY = 0; //50
let stripPosY = 0;
const baseRoadWidth = 3;
const farRoadWidth = 9;
const treeSpeedY = 0.5;
const treeSpeedX = 4000;
const randomTreeColorChangeAmount = 20;
const randomCloudColorChangeAmount = 35;
const randomStoneColorChangeAmount = 10;
const mountainOffset = 150;
const mountains = 3;
const trees = 100;
let treesYList = [];
let treesXList = [];
const clouds = 30;

const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width()/2, canvasContainer.height()/2);
  let button = createButton("reimagine").mousePressed(() => seed++);
  button.position(canvasContainer.width()/2 + 100, 100);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  
  for (let i = 0; i < trees; i++) {
    let z = 0.75;
    treesYList[i] = lerp(height, height/2, random());
    if (random() < 0.5) {
      treesXList[i] = ((width/farRoadWidth * 5) * ((random() + (millis() / treeSpeedX) / z) % 1)) + (width/farRoadWidth * 4.5);
      treesXList[i] += lerp(0, (1/9) * width, treesYList[i]/height);
    } else {
      treesXList[i] = ((width/farRoadWidth * 5) * -((random() + (millis() / treeSpeedX) / z) % 1)) + (width/farRoadWidth * 4.5);
      treesXList[i] -= lerp(0, (1/9) * width, treesYList[i]/height);
    }
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width()/2, canvasContainer.height()/2);
  // redrawCanvas(); // Redraw everything based on new size
}

function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  fill(skyColor);
  rect(0, 0, width, height / 2);

  for (let i = 0; i < clouds; i++) {
    let newCloudColor = color(
      red(cloudColor) + random(-randomCloudColorChangeAmount, randomCloudColorChangeAmount), 
     green(cloudColor) + random(-randomCloudColorChangeAmount, randomCloudColorChangeAmount), 
     blue(cloudColor) + random(-randomCloudColorChangeAmount, randomCloudColorChangeAmount), 
    random() * 150);
     fill(newCloudColor);
    let z = random(0.1, 0.4);
    let x = width * ((random() + (millis() / 500000.0) / z) % 1);
    let y = random(height/8, height/2);
    let s = random(100, 200);
    ellipse(x, y, s, s - 50);
  }

  fill(grassColor);
  rect(0, height / 2, width, height / 2);
  
  
  fill(roadColor);
  beginShape()
  vertex(width/baseRoadWidth, height);
  vertex(width/farRoadWidth * 4, height/2);
  vertex(width/farRoadWidth * 5, height/2);
  vertex(width/baseRoadWidth * 2, height);
  endShape(CLOSE);
  
  fill(roadLineColor);
  rect(width/2 - stripX/2, height/2 - stripY + stripPosY, stripX, stripY)
  stripPosY += 1.5
  if (stripY < 50) {
    stripY += 1.5
  }
  if (stripY + stripPosY > height) {
    stripPosY = 0
    stripY = 0
  }

  for (let i = 0; i < mountains; i++) {
    let newStoneColor = color(
      red(stoneColor) + random(-randomStoneColorChangeAmount, randomStoneColorChangeAmount), 
     green(stoneColor) + random(-randomStoneColorChangeAmount, randomStoneColorChangeAmount), 
     blue(stoneColor) + random(-randomStoneColorChangeAmount, randomStoneColorChangeAmount));  
  
  fill(newStoneColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =
      height / 2 - (random() * random() * random() * height) / 2 - height / 10;
    y -= (height/mountainOffset) * i;
    y += 25
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);
  } 
  
  for (let i = 0; i < trees; i++) {
    let newTreeColor = color(
      red(treeColor) + random(-randomTreeColorChangeAmount, randomTreeColorChangeAmount), 
     green(treeColor) + random(-randomTreeColorChangeAmount, randomTreeColorChangeAmount), 
     blue(treeColor) + random(-randomTreeColorChangeAmount, randomTreeColorChangeAmount));
      fill(newTreeColor);
    let z = 0.75;
    treesYList[i] += 1.5
    let y = treesYList[i];
    if (treesXList[i] < width/2) {
      treesXList[i] -= 1.25;
      if (treesXList[i] < 0) {
        treesYList[i] = height/2 + (25 * random())
        treesXList[i] = ((width/farRoadWidth * 5) * (random()) + (width/farRoadWidth * 4.5));
        treesXList[i] += lerp(0, (1/9) * width, treesYList[i]/height);
      }
      else {
        random()
        random()
      }
    } else {
      treesXList[i] += 1.25;
      if (treesXList[i] > width) {
        treesYList[i] = height/2 + (25 * random())
        treesXList[i] = ((width/farRoadWidth * 5) * -(random()) + (width/farRoadWidth * 4.5));
        treesXList[i] -= lerp(0, (1/9) * width, treesYList[i]/height);
      }
      else {
        random()
        random()
      }
    }
    if (y > height) {
      if (random() < 0.5) {
        treesYList[i] = height/2 + (25 * random())
        treesXList[i] = ((width/farRoadWidth * 5) * (random()) + (width/farRoadWidth * 4.5));
        treesXList[i] += lerp(0, (1/9) * width, treesYList[i]/height);
      } else {
        treesYList[i] = height/2 + (25 * random())
        treesXList[i] = ((width/farRoadWidth * 5) * -(random()) + (width/farRoadWidth * 4.5));
        treesXList[i] -= lerp(0, (1/9) * width, treesYList[i]/height);
      }
    } else {
      random()
      random()
      random()
    }
    y = treesYList[i]
    let x = treesXList[i];
    let s = lerp(10, 100, (y - (height/2))/(height/2));
    triangle(x, y - s - 20, x - s / 4, y, x + s / 4, y);
  }

  
}
