/* exported getInspirations, initDesign, renderDesign, mutateDesign */
let maxSize = 30  
let desiredWidth = 150

function getInspirations() {
  return [
    {
      name: "Amazing Fantasy #15", 
      assetUrl: "https://cdn.glitch.global/81b559b6-1a89-4c20-8b3f-3563d0212b45/Amazing_Fantasy_15.jpg?v=1746556397564",
      credit: "Jack Kirby and Steve Ditko, 1962"
    },
    {
      name: "Incredible Hulk Vol 1 #340", 
      assetUrl: "https://cdn.glitch.global/81b559b6-1a89-4c20-8b3f-3563d0212b45/81txlelN7PL.jpg?v=1746556400162",
      credit: "Todd McFarlane, 1988"
    },
    {
      name: "Action Comics #1", 
      assetUrl: "https://cdn.glitch.global/81b559b6-1a89-4c20-8b3f-3563d0212b45/91PuGJyevfL._UF1000%2C1000_QL80_.jpg?v=1746556582828",
      credit: "Joe Shuster, 1938"
    },
    {
      name: "Spawn #1", 
      assetUrl: "https://cdn.glitch.global/81b559b6-1a89-4c20-8b3f-3563d0212b45/Spawn_01-1.png?v=1746556394654",
      credit: "Todd McFarlane, 1992"
    },
  ];
}

function initDesign(inspiration) {
  let widthRatio = desiredWidth/inspiration.image.width;
  resizeCanvas(desiredWidth, inspiration.image.height*widthRatio);
  let design = {
    bg: 128,
    fg: []
  }
  
  let photo = inspiration.image;

  for(let i = 0; i < 500; i++) {
    let randomX = constrain(randomGaussian(width/2, width/3), 0, width);
    let randomY = constrain(randomGaussian(height/2, height/3), 0, height);
    design.fg.push({xPrime: randomX,
                    yPrime: randomY,
                    x1: randomX + random(-maxSize, maxSize+1),
                    y1: randomY + random(-maxSize, maxSize+1),
                    x2: randomX + random(-maxSize, maxSize+1),
                    y2: randomY + random(-maxSize, maxSize+1),
                    x3: randomX + random(-maxSize, maxSize+1),
                    y3: randomY + random(-maxSize, maxSize+1)},)
  }
  return design;
}

function renderDesign(design, inspiration) {
  let widthRatio = desiredWidth/inspiration.image.width;
  background(design.bg);
  noStroke()
  let photo = inspiration.image;
  for(let tri of design.fg) {
    let photoColor = photo.get((tri.x1 + tri.x2 + tri.x3)/3/widthRatio, (tri.y1 + tri.y2 + tri.y3)/3/widthRatio);
    let alphaColor = color(red(photoColor), green(photoColor), blue(photoColor), lerp(40, 150, getSaturationRGB(photoColor)))
    fill(alphaColor);
    triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3);
  }
}

function mutateDesign(design, inspiration, rate) {
  for(let tri of design.fg) {
    tri.x1 = mut(tri.x1, (-maxSize * (1+rate)) + tri.xPrime , (maxSize * (1+rate)) + tri.xPrime , rate);
    tri.y1 = mut(tri.y1, (-maxSize * (1+rate)) + tri.yPrime , (maxSize * (1+rate)) + tri.yPrime , rate);    
    tri.x2 = mut(tri.x2, (-maxSize * (1+rate)) + tri.xPrime , (maxSize * (1+rate)) + tri.xPrime , rate);
    tri.y2 = mut(tri.y2, (-maxSize * (1+rate)) + tri.yPrime , (maxSize * (1+rate)) + tri.yPrime , rate);    
    tri.x3 = mut(tri.x3, (-maxSize * (1+rate)) + tri.xPrime , (maxSize * (1+rate)) + tri.xPrime , rate);
    tri.y3 = mut(tri.y3, (-maxSize * (1+rate)) + tri.yPrime , (maxSize * (1+rate)) + tri.yPrime , rate);    
  }
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}

function getSaturationRGB(c) {
  let r = red(c);
  let g = green(c);
  let b = blue(c);

  let maxVal = max(r, g);
  maxVal = max(maxVal, b)
  let minVal = min(r, g);
  minVal = min(minVal, b)
  if (maxVal === 0) return 0.1; 
  return (maxVal - minVal) / maxVal;
}
