// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
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

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}





function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

/* exported generateGrid, drawGrid */
/* global placeTile */
let rooms = [];
let minRoomSize = 3;
let maxRoomSize = 5;
let maxNumOfRooms = 6;
let minNumOfRooms = 8;
let hallways = [];
let dungeon = true;
let bossCoords = {x: 0, y: 0}

function generateGrid(numCols, numRows) {
  if (random() > 0.5) {
    dungeon = true;
  } else {
    dungeon = false;
  }
  if (dungeon) {
    minRoomSize = 3;
    maxRoomSize = 5;
    maxNumOfRooms = 6;
    minNumOfRooms = 8;
  } else {
    minRoomSize = 2;
    maxRoomSize = 4;
    maxNumOfRooms = 17;
    minNumOfRooms = 20;
  }
  rooms = [];
  hallways = [];
  let numOfRooms = floor(random(minNumOfRooms, maxNumOfRooms + 1));
  for (let room = 0; room < numOfRooms; room++) {
    generateRoom(numCols, numRows);
  }
  bossCoords.x = floor(random(rooms[0].topWall, rooms[0].bottomWall))
  bossCoords.y = floor(random(rooms[0].leftWall, rooms[0].rightWall))
  console.log(bossCoords.x, bossCoords.y, rooms[0].leftWall, rooms[0].rightWall,rooms[0].topWall, rooms[0].bottomWall)
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      if (isInRoom(i, j)) {
        row.push(".");
      } else {
        row.push("_");
      }
    }
    grid.push(row);
  }
  if (dungeon) {
    generateHallways(grid, numCols, numRows)
  }
  for (let i = 0; i < hallways.length; i++) {
    if (grid[hallways[i][0]] != null) {
      grid[hallways[i][0]][hallways[i][1]] = '.'
    }
  }
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      
      if (grid[i][j] == '_') {
        if (dungeon) {
          placeTile(i, j, (floor(random(4))), 3);
        } else {
          placeTile(i, j, (floor(random(4))), 14);
        }
      } else if (grid[i][j] == '.') {
        if (dungeon) {
          drawContext(grid, i, j, '_',  0, 3);
        } else {
          drawContext(grid, i, j, '_',  8, 18);
        }
        
      }
    }
  }
  noStroke();
  
  if (dungeon) {
    randomSeed(millis())
    fill("red")
    circle(16*bossCoords.x, 16*bossCoords.y, 16);
    let tries = 25
    if (millis() % 2 == 0) {
      for (let i = 0; i < tries; i++) {
      let tempCoords = {x:bossCoords.x, y: bossCoords.y};
      let dir = floor(random(4))
      if (dir == 0) {
        tempCoords.x += 1;
      } else if (dir == 1) {
        tempCoords.x -= 1;
      } else if (dir == 2) {
        tempCoords.y += 1;
      } else { 
        tempCoords.y -= 1;
      }
      
      if (grid[tempCoords.y] != null && grid[tempCoords.y][tempCoords.x] == '.') {
        bossCoords.x = tempCoords.x
        bossCoords.y = tempCoords.y
        break;
      }
    }
    }
    
  } else {
    fill(0,0,0,50)
    for (let i = 0; i < 10; i++) {
      let length = random(50, 100)
      let offset = random(10000000)
      rect((((millis() + offset)/10)%(width+(length)))-(length) , i * height/7, length, 25)
    }
    
  }
  
}

function generateRoom(numCols, numRows) {
  let leftWall = floor(random(1, numCols-minRoomSize));
  let rightWall = floor(random(leftWall+(minRoomSize-1), Math.min(numCols-1, leftWall+ maxRoomSize)));
  let topWall = floor(random(1, numRows-minRoomSize));
  let bottomWall = floor(random(topWall+(minRoomSize-1), Math.min(numRows-1, topWall + maxRoomSize)));
  for(let i = 0; i < rooms.length; i++) {
    if (topWall >= rooms[i].topWall && bottomWall <= rooms[i].bottomWall) {
      generateRoom(numCols, numRows);
      return
    }
    if (leftWall >= rooms[i].leftWall && rightWall <= rooms[i].rightWall) {
      generateRoom(numCols, numRows);
      return
    }
  }
  rooms.push({leftWall: leftWall, rightWall: rightWall, topWall: topWall, bottomWall: bottomWall});
}

function generateHallways() {
  for (let room = 0; room < rooms.length; room++) {
    let x1 = floor(random(rooms[room].leftWall, rooms[room].rightWall))
    let y1 = floor(random(rooms[room].topWall, rooms[room].bottomWall))
    let room2 = -1
    while (room2 == -1 || room2 == room) {
      room2 = floor(random(0, rooms.length))
    }
    let x2 = floor(random(rooms[room2].leftWall, rooms[room2].rightWall))
    let y2 = floor(random(rooms[room2].topWall, rooms[room2].bottomWall))
    while (x1 != x2) {
      if (x1 > x2) {
        x1--
      } else {
        x1++
      }
      hallways.push([x1, y1])
    }
    while (y1 != y2) {
      if (y1 > y2) {
        y1--
      } else {
        y1++
      }
      hallways.push([x1, y1])
    }
  }
}

function isInRoom(x, y) {
  for (let i = 0; i < rooms.length; i++) {
    if (x < rooms[i].leftWall || x > rooms[i].rightWall || y > rooms[i].bottomWall || y < rooms[i].topWall) {
      continue;
    } else {
      return true;
    }
  }
  return false;
}

function gridCheck(grid, i, j, target) {
  if (grid[i] == null || grid[i][j] == null) {
    return true
  }
  if (grid[i][j] == target) {
    return true
  }
  return false
}

function gridCode(grid, i, j, target) {
  let northBit = 0;
  let southBit = 0;
  let eastBit = 0;
  let westBit = 0;
  if (gridCheck(grid, i-1, j, target)) {
    northBit = 1;
  }
  if (gridCheck(grid, i+1, j, target)) {
    southBit = 1;
  }
  if (gridCheck(grid, i, j+1, target)) {
    eastBit = 1;
  }
  if (gridCheck(grid, i, j-1, target)) {
    westBit = 1;
  }
  let bitCode = (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3);
  return bitCode;
}

function drawContext(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code]; 
  if (dungeon) {
    placeTile(i, j, 21 + (floor(random(4))), 21 + (floor(random(4))))
    
  } else {
    placeTile(i, j, (floor(random(4))), 0)
  }
  if (lookup[code][0][0] != null) {
    for(let inner = 0; inner < lookup[code].length; inner++) {
      let [tiOffset2, tjOffset2] = lookup[code][inner];
      placeTile(i, j, ti + tiOffset2, tj + tjOffset2);
    }
    return
  } 
  //placeTile(i, j, (floor(random(4))), 3);
  if (code > 0) {
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  } else if (random() < 0.1) {
    if (dungeon) {
      placeTile(i, j, (floor(random(6))), 28+(floor(random(3))));
    } else {
      placeTile(i, j, 14, 0);
    }
  }
}

const lookup = [
  [0,0],
  [5,0],
  [5,2],
  [[5,0],[5,2]],
  [6,1],
  [6, 0],
  [6,2],
  [[6,0],[6,2]],
  [4,1],
  [4,0],
  [4,2],
  [[4,2], [4,0]],
  [[6,1],[4,1]],
  [[6, 0],[4,0]],
  [[6,2],[4,2]],
  [[5, 0], [5,2], [6,1], [4,1]]
]



