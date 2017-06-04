var points;
var closest;
var midLines;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  frameRate(30);
  textFont("Helvetica");
  textSize(12);
  
  midLines = new Array();
  
  var n = 15;
  points = new Array(n);
  for (var i = 0; i < n; i++) {
    points[i] = createVector(random(100, width-100), random(100, height-100));
  }
  
  Px = sortbyX(points);
  Py = sortbyY(points);
  
  closest = CPR(Px, Py);
}

function draw() {
  clear();
  
  for (var i = 0; i < midLines.length; i++) {
    stroke(30, 150, 60);  
    line(midLines[i][0], 0, midLines[i][0], height);
  }
  
  
  for (var i = 0; i < points.length; i++) {
    noStroke();
    fill(20, 80, 200);
    ellipse(points[i].x, points[i].y, 5, 5);
    
    noStroke();
    fill(0);
    text(round(points[i].x) + ", " + round(points[i].y), points[i].x + 5, points[i].y, 1000, 12);  
  }
  
  stroke(220, 80, 20);
  line(closest[0].x, closest[0].y, closest[1].x, closest[1].y);
  fill(220, 80, 20);
  ellipse(closest[0].x, closest[0].y, 5, 5);
  ellipse(closest[1].x, closest[1].y, 5, 5);
  
  
  
}

function distance(p1, p2) {
  return sqrt(pow(p1.x-p2.x, 2) + pow(p1.y-p2.y, 2));
}
  
function logPoints(P) {
  for (var i = 0; i < P.length; i++)
    console.log(round(P[i].x) + ", " + round(P[i].y));
}

function sortbyX(P) {  
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.x - p2.x;
  });
  return temp;
}

function sortbyY(P) {  
  var temp = P.slice();
  temp.sort(function(p1, p2) {
    return p1.y - p2.y;
  });
  return temp;
}


function CPR(Px, Py) {
  console.log("P.length: " + Px.length);
  logPoints(Px);
  var minDist = 1000000;
  var CP = new Array();
  if (Px.length == 3) {
    if (distance(Px[0], Px[1]) <= minDist) {
      CP = [Px[0], Px[1]];
      minDist = distance(Px[0], Px[1]);
    }
      
    if (distance(Px[1], Px[2]) <= minDist) {
      CP = [Px[1], Px[2]];
      minDist = distance(Px[1], Px[2]);
    }
      
    if (distance(Px[0], Px[2]) <= minDist) {
      CP = [Px[0], Px[2]];
      minDist = distance(Px[0], Px[2]);
    }
    return CP;
  }
  
  if (Px.length == 2) {
    return [Px[0], Px[1]];
  }
  
  // split P from midpoint using x coordinates
  console.log("Midpoint: " + ceil(Px.length/2));
  var Q = Px.slice(0, ceil(Px.length/2));
  var R = Px.slice(ceil(Px.length/2), Px.length);
  
  console.log("Q");
  logPoints(Q);
  console.log("R");
  logPoints(R);
  
  var Qx = sortbyX(Q);
  var Qy = sortbyY(Q);  
  var Rx = sortbyX(R);
  var Ry = sortbyY(R);
  
  console.log("");
  console.log("");
  
  var leftCP = CPR(Q, Qx, Qy);  // (q1, q2) closest pair of points in Q
  console.log("Left CP:");
  logPoints(leftCP);
  
  console.log("+");
  
  var rightCP = CPR(R, Rx, Ry); // (r1, r2) closest pair of points in R
  console.log("Right CP:");
  logPoints(rightCP);
  
  var delta = min(distance(leftCP[0], leftCP[1]), distance(rightCP[0], rightCP[1]));
  console.log("delta: " + delta);
  var xstar = Q[Q.length-1].x;
  midLines.push([xstar, delta]);
  
  // create set S of points within distance delta of line x = xstar
  var S = new Array();
  for (var i = 0; i < Px.length; i++) {
    if (abs(Px[i].x - xstar) <= delta)
      S.push(Px[i]);
  }
  var Sy = sortbyY(S);
  
  console.log("Sy: ");
  logPoints(Sy);
  
  var sminDist = 10000000;
  var s1;
  var s2;
  for (var i = 0; i < Sy.length; i++) {
    for (var j = i+1; j < min(i+16, Sy.length); j++) {
      if (distance(Sy[i], Sy[j]) < sminDist) {
        s1 = Sy[i];
        s2 = Sy[j];
        sminDist = distance(Sy[i], Sy[j]);
      }
    }
  }
  
  if (sminDist < delta) {
    console.log("[s1, s2]: ");
    logPoints([s1, s2]);
    return [s1, s2];
  }
  else if (distance(leftCP[0], leftCP[1]) < distance(rightCP[0], rightCP[1]))
    return leftCP;
  else
    return rightCP;
  
  console.log("NOTHING?!");
  return null;
}