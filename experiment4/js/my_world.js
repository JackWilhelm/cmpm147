"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {
  jump = loadSound('https://cdn.glitch.global/ad7b23f7-38c1-4fba-83fb-6c1b1fb50e23/Q_bertHop.wav?v=1745551490596');
  theme = loadSound(`https://cdn.glitch.me/ad7b23f7-38c1-4fba-83fb-6c1b1fb50e23/Qbert%20(2019)%20Main%20Theme%20extended%20version.mp3?v=1745552133361`)
}

function p3_setup() {}

let worldSeed;
let clicks = {};
let cities = new Map();
let populatedAreas = [];
let platformHeight = 3
let Qbert = {x: null, y:null}
let QbertPrev = {x: null, y:null}
let jump;
let theme;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  clicks = {};
  cities = new Map();
  populatedAreas = [];
  Qbert = {x: null, y:null}
  QbertPrev = {x: null, y:null}
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];



function p3_tileClicked(i, j) {
  if (!populatedAreas.includes(`${i}, ${j}`)) {
    return
  }
  let key = [i, j];
  clicks[key] = 1;
  QbertPrev.x = Qbert.x
  QbertPrev.y = Qbert.y
  Qbert.x = i
  Qbert.y = j
  jump.play()
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  if (!theme.isPlaying()) {
    theme.play()
  }
  
  stroke("white")

  if (XXH.h32("tile:" + [i, j], worldSeed) % 100 == 0) {
    //fill(240, 200);
    if (!cities.has(`${i}, ${j}`)) {
      let rangex = floor(random(2,5))
      let rangey = floor(random(2,5))
      cities.set(`${i}, ${j}`, {rangex: rangex, rangey: rangey})
      for (let x = -rangex; x < rangex+1; x++) {
        let newrangey = min(-abs(x)+rangex,rangey) + max((rangey-rangex),0)
        for (let y = -newrangey; y < newrangey+1; y++) {
          populatedAreas.push(`${i-x}, ${j-y}`)
        }
      }
      if (Qbert.x == null && Qbert.y == null) {
        Qbert.x = i;
        Qbert.y = j;
        QbertPrev.x = i;
        QbertPrev.y = j;
      }
    }
  }
  
  if (!(populatedAreas.includes(`${i}, ${j}`) && populatedAreas.includes(`${i-1}, ${j}`) && populatedAreas.includes(`${i}, ${j-1}`) && populatedAreas.includes(`${i+1}, ${j}`) && populatedAreas.includes(`${i}, ${j+1}`))) {
    if (abs(i+j)%2==1) {
      for (let z = 1; z < 1 + platformHeight; z++) {
        
        if (populatedAreas.includes(`${i-z}, ${j-z}`)) {
          if (populatedAreas.includes(`${i-z+1}, ${j-z}`)) {
            //down left
            fill(48,64,64,255)
            beginShape();
            vertex(0, th);
            vertex(0, -th);
            vertex(-tw, 0);
            vertex(-tw, th*2);
            endShape(CLOSE);
          }
          if (populatedAreas.includes(`${i-z}, ${j-z+1}`)) {
            //down right
            fill(80,175,159,255)
            beginShape();
            vertex(tw, 0);
            vertex(tw, th*2);
            vertex(0, th);
            vertex(0, -th);
            endShape(CLOSE);
          }
          if (!populatedAreas.includes(`${i-z+1}, ${j-z}`)) {
            //upleft
            fill(80,175,159,255)
            beginShape();
            vertex(-tw, -th*2);
            vertex(-tw, 0);
            vertex(0, th);
            vertex(0, -th);
            endShape(CLOSE);
          }
          if (!populatedAreas.includes(`${i-z}, ${j-z+1}`)) {
            //up right
            fill(48,64,64,255)
            beginShape();
            vertex(0, -th);
            vertex(0, th);
            vertex(tw, 0);
            vertex(tw, -2*th);
            endShape(CLOSE);
          }
          break
        } else {
          if (populatedAreas.includes(`${i-z}, ${j-z+1}`)) {
            //down right
            fill(80,175,159,255)
            beginShape();
            vertex(tw, 0);
            vertex(tw, th*2);
            vertex(0, th);
            vertex(0, -th);
            endShape(CLOSE);
          } 
          if (populatedAreas.includes(`${i-z+1}, ${j-z}`)){
            //down left
            fill(48,64,64,255)
            beginShape();
            vertex(0, th);
            vertex(0, -th);
            vertex(-tw, 0);
            vertex(-tw, th*2);
            endShape(CLOSE);
          }
        }
      }    
    }
    
  }
  
}

function p3_drawTileGround(i, j) {
   stroke("white")
  if (populatedAreas.includes(`${i}, ${j}`)) {
    let n = clicks[[i, j]] | 0;
    if (n % 2 == 1) {
      fill(223,223,0,255)
    } else {
      fill(80,64,239,255)
    }
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
  }
  if (Qbert.x == i && Qbert.y == j) {
    drawQbert()
  }
}

function p3_drawSelectedTile(i, j) {
  if (!populatedAreas.includes(`${i}, ${j}`)) {
    return
  }
  noFill();
  stroke("red");
  strokeWeight(2)

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
}

function p3_drawAfter() {
}

function drawQbert() {
  noStroke()
  if (abs(Qbert.x - QbertPrev.x) > abs(Qbert.y - QbertPrev.y)) {
    if (Qbert.x > QbertPrev.x) {
      //downleft
      //legs
      fill(255,112,0,255)
      push()
      translate(-5, -5)
      rect(0,0,3,10)
      translate(7, 0)
      rect(0,0,3,10)
      pop()
      //body
      push()
      translate(0, -12);
      ellipse(0, 0, 20, 20);
      pop()
      //leftEye
      push()
      fill("white")
      translate(-8, -12);
      ellipse(0, 0, 5, 8);
      pop()
      //leftPupil
      push()
      fill("black")
      translate(-8, -12);
      ellipse(0, 0, 2.5, 4);
      pop()
      //nose
      push()
      fill(255,112,0,255)
      translate(-8,-10)
      rotate(0.6)
      rect(0,0,7,10)
      pop()
      //noseHole
      push()
      fill("black")
      translate(-10, -2);
      ellipse(0, 0, 5, 5);
      pop()
      //rightEye
      push()
      fill("white")
      translate(0, -12);
      ellipse(0, 0, 5, 8);
      pop()
      //righPupil
      push()
      fill("black")
      translate(0, -12);
      ellipse(0, 0, 2.5, 4);
      pop()
    } else {
      //upright
      //legs
      fill(255,112,0,255)
      push()
      translate(-5, -5)
      rect(0,0,3,10)
      translate(7, 0)
      rect(0,0,3,10)
      pop()
      //body
      push()
      translate(0, -12);
      ellipse(0, 0, 20, 20);
      pop()
      //nose
      push()
      fill(255,112,0,255)
      translate(2,-7)
      rotate(-0.6)
      rect(0,0,7,10)
      pop()
    }
  } else {
    if (Qbert.y > QbertPrev.y) {
      //downright
      //legs
      fill(255,112,0,255)
      push()
      translate(-5, -5)
      rect(0,0,3,10)
      translate(7, 0)
      rect(0,0,3,10)
      pop()
      //body
      push()
      translate(0, -12);
      ellipse(0, 0, 20, 20);
      pop()
      //rightEye
      push()
      fill("white")
      translate(8, -12);
      ellipse(0, 0, 5, 8);
      pop()
      //righPupil
      push()
      fill("black")
      translate(8, -12);
      ellipse(0, 0, 2.5, 4);
      pop()
      //nose
      push()
      fill(255,112,0,255)
      translate(2,-7)
      rotate(-0.6)
      rect(0,0,7,10)
      pop()
      //noseHole
      push()
      fill("black")
      translate(9.5, -2);
      ellipse(0, 0, 5, 5);
      pop()
      //leftEye
      push()
      fill("white")
      translate(0, -12);
      ellipse(0, 0, 5, 8);
      pop()
      //leftPupil
      push()
      fill("black")
      translate(0, -12);
      ellipse(0, 0, 2.5, 4);
      pop()
  
    } else {
      //upleft
      //legs
      fill(255,112,0,255)
      push()
      translate(-5, -5)
      rect(0,0,3,10)
      translate(7, 0)
      rect(0,0,3,10)
      pop()
      //body
      push()
      translate(0, -12);
      ellipse(0, 0, 20, 20);
      pop()
      //nose
      push()
      fill(255,112,0,255)
      translate(-8,-10)
      rotate(0.9)
      rect(0,0,7,10)
      pop()
    }
  }
  
}
