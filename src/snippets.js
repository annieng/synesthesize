// DRAW NEW CONSTANT SPLINE

// Instantiate a THREE.ConstantSpline object:
var s = new THREE.ConstantSpline();

// assign the 4 control points:

s.p0 = new THREE.Vector3(.5 - Math.random(), .5 - Math.random(), .5 - Math.random());
s.p1 = new THREE.Vector3(.5 - Math.random(), .5 - Math.random(), .5 - Math.random());
s.p2 = new THREE.Vector3(.5 - Math.random(), .5 - Math.random(), .5 - Math.random());
s.p3 = new THREE.Vector3(.5 - Math.random(), .5 - Math.random(), .5 - Math.random());

// make the calculations of the standard b - spline:
s.calculate();

// specify if you need a constant number of steps or a constant step size:

s.calculateDistances();
s.reticulate({ distancePerStep: .1 });
s.calculateDistances();
s.reticulate({ steps: 500 });

// s.lPoints contains the evenly separated points.Use them to create a line, a mesh or a camera path:

var geometry = new THREE.Geometry();

for (var j = 0; j < s.lPoints.length - 1; j++) {

  var from = s.lPoints[j],
    to = s.lPoints[j + 1];
  geometry.vertices.push(from.clone());
  geometry.vertices.push(to.clone());

}

material = new THREE.LineBasicMaterial({
  color: 0x404040 + Math.random() * 0xbfbfbf,
  linewidth: 4
});

var line = new THREE.Line(geometry, material);
scene.add(line);

// CONSTANT SPLINE CONSTRUCTOR
THREE.ConstantSpline = function () {

  this.p0 = new THREE.Vector3();
  this.p1 = new THREE.Vector3();
  this.p2 = new THREE.Vector3();
  this.p3 = new THREE.Vector3();

  this.tmp = new THREE.Vector3();
  this.res = new THREE.Vector3();
  this.o = new THREE.Vector3();

  this.points = [];
  this.lPoints = [];
  this.steps = [];

  this.inc = .01;
  this.d = 0;

  this.distancesNeedUpdate = false;

};

THREE.ConstantSpline.prototype.calculate = function () {

  this.d = 0;
  this.points = [];

  this.o.copy(this.p0);

  for (var j = 0; j <= 1; j += this.inc) {

    var i = (1 - j);
    var ii = i * i;
    var iii = ii * i;
    var jj = j * j;
    var jjj = jj * j;

    this.res.set(0, 0, 0);

    this.tmp.copy(this.p0);
    this.tmp.multiplyScalar(iii);
    this.res.add(this.tmp);

    this.tmp.copy(this.p1);
    this.tmp.multiplyScalar(3 * j * ii);
    this.res.add(this.tmp);

    this.tmp.copy(this.p2);
    this.tmp.multiplyScalar(3 * jj * i);
    this.res.add(this.tmp);

    this.tmp.copy(this.p3);
    this.tmp.multiplyScalar(jjj);
    this.res.add(this.tmp);

    this.points.push(this.res.clone());

  }

  this.points.push(this.p3.clone());

  this.distancesNeedUpdate = true;

};

THREE.ConstantSpline.prototype.calculateDistances = function () {

  this.steps = [];
  this.d = 0;

  var from, to, td = 0;

  for (var j = 0; j < this.points.length - 1; j++) {

    this.points[j].distance = td;
    this.points[j].ac = this.d;

    from = this.points[j],
      to = this.points[j + 1],
      td = to.distanceTo(from);

    this.d += td;

  }

  this.points[this.points.length - 1].distance = 0;
  this.points[this.points.length - 1].ac = this.d;

}

THREE.ConstantSpline.prototype.reticulate = function (settings) {

  if (this.distancesNeedUpdate) {
    this.calculateDistances();
    this.distancesNeedUpdate = false;
  }

  this.lPoints = [];

  var l = [];

  var steps, distancePerStep;

  if (settings.steps) {
    steps = settings.steps;
    distancePerStep = this.d / steps;
  }

  if (settings.distancePerStep) {
    distancePerStep = settings.distancePerStep;
    steps = this.d / distancePerStep;
  }

  var d = 0,
    p = 0;

  this.lPoints = [];

  var current = new THREE.Vector3();
  current.copy(this.points[0].clone());
  this.lPoints.push(current.clone());

  function splitSegment(a, b, l) {

    var t = b.clone();
    var d = 0;
    t.sub(a);
    var rd = t.length();
    t.normalize();
    t.multiplyScalar(distancePerStep);
    var s = Math.floor(rd / distancePerStep);
    for (var j = 0; j < s; j++) {
      a.add(t);
      l.push(a.clone());
      d += distancePerStep;
    }
    return d;
  }

  for (var j = 0; j < this.points.length; j++) {

    if (this.points[j].ac - d > distancePerStep) {

      d += splitSegment(current, this.points[j], this.lPoints);

    }

  }
  this.lPoints.push(this.points[this.points.length - 1].clone());


};


  // PREVIOUS FUNCTION FOR CREATING QUADRATIC BEZIER TO BE REPLACED ONCE NEW FUNCTION WORKING
  let curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(midiEvent[0]/getRandomInt(15), 0, 0),
    new THREE.Vector3(20, midiEvent[1]/getRandomInt(2), 0),
    new THREE.Vector3(midiEvent[2]/getRandomInt(3), 1, 0)
  );

  let points = curve.getPoints(50);
  let geometry = new THREE.BufferGeometry().setFromPoints(points);

  let material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  let curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject)

