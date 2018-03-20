import loop from 'raf-loop'
import WAGNER from '@superguigui/wagner'
import BloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'
import resize from 'brindille-resize'
import OrbitControls from './controls/OrbitControls'
import { gui } from './utils/debug'

/* ----------------------------- THREE JS SCENE ----------------------------------------------- */
const THREE = require('three')
const socket = require('socket.io')

/* Custom settings */
const SETTINGS = {
  useComposer: true
}

/* Init renderer and canvas */
const container = document.body
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)

/* Composer for special effects */
const composer = new WAGNER.Composer(renderer)
const bloomPass = new BloomPass()
const fxaaPass = new FXAAPass()

/* Main scene and camera */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 100000)
const controls = new OrbitControls(camera, {element: renderer.domElement, parent: renderer.domElement, distance: 10, phi: Math.PI * 0.5})
camera.position.z = 100000
camera.position.x = 60000
camera.position.y = 90000

/* Lights */
const frontLight = new THREE.PointLight(0xFFFFFF, 1)
const backLight = new THREE.PointLight(0xFFFFFF, 0.5)
scene.add(frontLight)
scene.add(backLight)
frontLight.position.x = 20
backLight.position.x = -20



/* Actual content of the scene */

let hilbertPoints = hilbert3D(new THREE.Vector3(0, 0, 0), 250.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
let i
let material

//Colors with BufferGeometry
let buffGeometry0 = new THREE.BufferGeometry()
let buffGeometry1 = new THREE.BufferGeometry()
let buffGeometry2 = new THREE.BufferGeometry()

let subdivisions = 4;

let position = []
let colorArray0 = []
let colorArray1 = []
let colorArray2 = []

let point = new THREE.Vector3();
let color = new THREE.Color();

let spline = new THREE.CatmullRomCurve3(hilbertPoints);
for (i = 0; i < hilbertPoints.length * subdivisions; i++) {
  let t = i / (hilbertPoints.length * subdivisions);
  spline.getPoint(t, point);
  position.push(point.x, point.y, point.z);
  color.setHSL(0.6, 1.0, Math.max(0, - point.x / 200) + 0.5);
  colorArray0.push(color.r, color.g, color.b);
  color.setHSL(0.9, 1.0, Math.max(0, - point.y / 200) + 0.5);
  colorArray1.push(color.r, color.g, color.b);
  color.setHSL(i / (hilbertPoints.length * subdivisions), 1.0, 0.5);
  colorArray2.push(color.r, color.g, color.b);
}
buffGeometry0.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
buffGeometry1.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
buffGeometry2.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
buffGeometry0.addAttribute('color', new THREE.Float32BufferAttribute(colorArray0, 3));
buffGeometry1.addAttribute('color', new THREE.Float32BufferAttribute(colorArray1, 3));
buffGeometry2.addAttribute('color', new THREE.Float32BufferAttribute(colorArray2, 3));

// Colors with Geometry
let geometry0 = new THREE.Geometry(),
  geometry2 = new THREE.Geometry(),
  geometry3 = new THREE.Geometry();
let colors0 = [],
  colors1 = [],
  colors2 = [];
for (i = 0; i < hilbertPoints.length; i++) {
  geometry0.vertices.push(hilbertPoints[i]);
  colors0[i] = new THREE.Color(0xffffff);
  colors0[i].setHSL(0.6, 1.0, Math.max(0, (200 - hilbertPoints[i].x) / 400) * 0.5 + 0.5);
  colors1[i] = new THREE.Color(0xffffff);
  colors1[i].setHSL(0.3, 1.0, Math.max(0, (200 + hilbertPoints[i].x) / 400) * 0.5);
  colors2[i] = new THREE.Color(0xffffff);
  colors2[i].setHSL(i / hilbertPoints.length, 1.0, 0.5);
}
geometry2.vertices = geometry3.vertices = geometry0.vertices;
geometry0.colors = colors0;
geometry2.colors = colors1;
geometry3.colors = colors2;

// Create lines and add to scene
material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors });
let line, p, scale = 0.3, d = 225;
let parameters = [
  [material, scale * 1, [- d, - d / 2, 0], buffGeometry0],
  [material, scale * 1, [0, - d / 2, 0], buffGeometry1],
  [material, scale * 1, [d, - d / 2, 0], buffGeometry2],
  [material, scale * 1, [- d, d / 2, 0], geometry0],
  [material, scale * 1, [0, d / 2, 0], geometry2],
  [material, scale * 1, [d, d / 2, 0], geometry3],
];
for (i = 0; i < parameters.length; i++) {
  p = parameters[i];
  line = new THREE.Line(p[3], p[0]);
  line.scale.x = line.scale.y = line.scale.z = p[1];
  line.position.x = p[2][0] ;
  line.position.y = p[2][1] ;
  line.position.z = p[2][2] ;
  scene.add(line) 
  animate()
  }
  // animation for line
  function animate() {
    requestAnimationFrame(animate)
    line.rotation.x += 0.01
    line.rotation.y += 0.01
    renderer.render(scene, camera);
  }


// // Input Event Listeners

/* Various event listeners */
resize.addListener(onResize)

/* create and launch main loop */
const engine = loop(render)
engine.start()

/* some stuff with gui */
gui.add(SETTINGS, 'useComposer')

/* -------------------------------------------------------------------------------- */

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth , window.innerHeight)
  composer.setSize(window.innerWidth , window.innerHeight)
}

/**
  Render loop
*/
render()
function render (dt) {
  controls.update()
  if (SETTINGS.useComposer) {
    composer.reset()
    composer.render(scene, camera)
    composer.pass(bloomPass)
    composer.pass(fxaaPass)
    composer.toScreen()
  } else {
    line.rotation.x += 0.01
    line.rotation.y += 0.01
    renderer.render(scene, camera)
  }
}


/* ----------------------------- handling midi data --------------------------------*/
const context = new AudioContext()
const oscillators = {}
let midi, data;

//const socket = io()

// GETTING MIDI ACCESS
navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure)

function onMIDISuccess(midiData) {
  console.log(midiData);
  midi = midiData;
  var allInputs = midi.inputs.values();
  for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
    input.value.onmidimessage = onMIDImessage;
  }
}

function onMIDIFailure() {
  console.warn("Not finding a MIDI controller");
}

// GETTING MIDI DATA
function onMIDImessage(messageData) {
  let midiEvent = messageData.data
  console.log(midiEvent[0], midiEvent[1], midiEvent[2])
  
  // SYNTH SOUNDS

  const note = {
    on: midiEvent[0],
    pitch: midiEvent[1],
    velocity: midiEvent[2]
  }

  play(note);

  // creating new visuals with midi event
  animateCamera()  
  if(midiEvent[0] === 128){
  let newSpline = new ConstantSpline(
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),

    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),
    new THREE.Vector3((.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000, (.5 - Math.random()) * 1000),

    [],
    [],
    [],
    0.1,
    0,
    false
  )
  console.log(newSpline)

  calculate(newSpline)
  calculateDistances(newSpline)
  reticulate(newSpline, {distancePerStep: 10})

  let geometry = new THREE.Geometry()

  for (var j = 0; j < newSpline.lPoints.length - 1; j++) {

    var from = newSpline.lPoints[j],
      to = newSpline.lPoints[j + 1];
    geometry.vertices.push(from.clone());
    geometry.vertices.push(to.clone());

  }

  material = new THREE.LineBasicMaterial({
    color: 0x404040 + Math.random() * 0xbfbfbf,
    linewidth: 4
  });

  var line = new THREE.Line(geometry, material);
  scene.add(line);
  console.log(line)

  // emit to socket
  // socket.emit('midi', note)

  }
}

// camera position animate
function animateCamera() {
  let rotation = 0.4
  camera.position.x = camera.position.x * Math.cos(rotation) + camera.position.z * Math.sin(rotation)
  camera.position.y = camera.position.y * Math.sin(rotation) + camera.position.x * Math.cos(rotation)
  camera.position.z = camera.position.z * Math.cos(rotation) - camera.position.x * Math.sin(rotation)

  camera.position.x += (Math.random() - 0.5) * 2
  camera.position.y += (Math.random() - 0.5) * 2
  camera.position.z += (Math.random() - 0.5) * 2

  console.log('rotation: ' + camera.rotation.x, camera.rotation.y, camera.rotation.z)
  console.log('position: ' + camera.position.x, camera.position.y, camera.position.z)
}

// function to play note on midiEvent message
  function play(note) {
    switch (note.on) {
      case 144:
        noteOn(frequency(note.pitch), note.velocity);
        break;
      case 128:
        noteOff(frequency(note.pitch), note.velocity);
        break;
    }
    function frequency(note) {
      return Math.pow(2, ((note - 69) / 12)) * 440;
    }
    function noteOn(frequency, velocity) {
      var osc = oscillators[frequency] = context.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.connect(context.destination);
      osc.start(context.currentTime);
    }
    function noteOff(frequency, velocity) {
      oscillators[frequency].stop(context.currentTime);
      oscillators[frequency].disconnect();
    }
  }


// setting up ability to receive external notes from other players

socket.on('externalMidi', gotExternalMidiMessage)

function gotExternalMidiMessage(data) {
  let newItem = document.createElement('li')
  newItem.appendChild(document.createTextNode('Note: ' + data.pitch + 'Velocity: ' + data.velocity))
  newItem.className = 'externalMidi'
  document.getElementById('midi-data').prepend(newItem)

  playNote()
}

// Function for 3D Hilbert Curve -- should be moved out of file eventually COME BACK
function hilbert3D(center, size, iterations, v0, v1, v2, v3, v4, v5, v6, v7) {
  // Default Vars
  var center = undefined !== center ? center : new THREE.Vector3(0, 0, 0),
    size = undefined !== size ? size : 10,
    half = size / 2,
    iterations = undefined !== iterations ? iterations : 1,
    v0 = undefined !== v0 ? v0 : 0,
    v1 = undefined !== v1 ? v1 : 1,
    v2 = undefined !== v2 ? v2 : 2,
    v3 = undefined !== v3 ? v3 : 3,
    v4 = undefined !== v4 ? v4 : 4,
    v5 = undefined !== v5 ? v5 : 5,
    v6 = undefined !== v6 ? v6 : 6,
    v7 = undefined !== v7 ? v7 : 7
    ;

  var vec_s = [
    new THREE.Vector3(center.x - half, center.y + half, center.z - half),
    new THREE.Vector3(center.x - half, center.y + half, center.z + half),
    new THREE.Vector3(center.x - half, center.y - half, center.z + half),
    new THREE.Vector3(center.x - half, center.y - half, center.z - half),
    new THREE.Vector3(center.x + half, center.y - half, center.z - half),
    new THREE.Vector3(center.x + half, center.y - half, center.z + half),
    new THREE.Vector3(center.x + half, center.y + half, center.z + half),
    new THREE.Vector3(center.x + half, center.y + half, center.z - half)
  ];

  var vec = [
    vec_s[v0],
    vec_s[v1],
    vec_s[v2],
    vec_s[v3],
    vec_s[v4],
    vec_s[v5],
    vec_s[v6],
    vec_s[v7]
  ];

  // Recurse iterations
  if (--iterations >= 0) {
    var tmp = [];

    Array.prototype.push.apply(tmp, hilbert3D(vec[0], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1));
    Array.prototype.push.apply(tmp, hilbert3D(vec[1], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
    Array.prototype.push.apply(tmp, hilbert3D(vec[2], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
    Array.prototype.push.apply(tmp, hilbert3D(vec[3], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
    Array.prototype.push.apply(tmp, hilbert3D(vec[4], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
    Array.prototype.push.apply(tmp, hilbert3D(vec[5], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
    Array.prototype.push.apply(tmp, hilbert3D(vec[6], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
    Array.prototype.push.apply(tmp, hilbert3D(vec[7], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7));

    // Return recursive call
    return tmp;
  }
  // Return complete Hilbert Curve.
  return vec;
}

// CONSTRUCTOR FOR SPLINE

function ConstantSpline(p0, p1, p2, p3, tmp, res, o, points, lPoints, steps, inc, d, distancesNeedUpdate) {
  this.p0 = p0
  this.p1 = p1
  this.p2 = p2
  this.p3 = p3

  this.tmp = tmp
  this.res = res
  this.o = o

  this.points = points
  this.lPoints = lPoints
  this.steps = steps

  this.inc = inc
  this.d = d

  this.distancesNeedUpdate = distancesNeedUpdate
}

// FUNCTIONS FOR SPLINEDRAW
function calculate(obj) {
  // calculate points
  obj.d = 0;
  obj.points = [];

  obj.o.copy(obj.p0);

  for (var j = 0; j <= 1; j += obj.inc) {

    var i = (1 - j);
    var ii = i * i;
    var iii = ii * i;
    var jj = j * j;
    var jjj = jj * j;

    obj.res.set(0, 0, 0);

    obj.tmp.copy(obj.p0);
    obj.tmp.multiplyScalar(iii);
    obj.res.add(obj.tmp);

    obj.tmp.copy(obj.p1);
    obj.tmp.multiplyScalar(3 * j * ii);
    obj.res.add(obj.tmp);

    obj.tmp.copy(obj.p2);
    obj.tmp.multiplyScalar(3 * jj * i);
    obj.res.add(obj.tmp);

    obj.tmp.copy(obj.p3);
    obj.tmp.multiplyScalar(jjj);
    obj.res.add(obj.tmp);

    obj.points.push(obj.res.clone());

  }

  obj.points.push(obj.p3.clone());

  obj.distancesNeedUpdate = true;
  console.log(obj.points)
}

function calculateDistances(obj) {

  obj.steps = [];
  obj.d = 0;

  var from, to, td = 0;

  for (var j = 0; j < obj.points.length - 1; j++) {

    obj.points[j].distance = td;
    obj.points[j].ac = obj.d;

    from = obj.points[j],
      to = obj.points[j + 1],
      td = to.distanceTo(from);

    obj.d += td;
  }
  obj.points[obj.points.length - 1].distance = 0;
  obj.points[obj.points.length - 1].ac = obj.d;
}

function reticulate(obj, settings) {

  if (obj.distancesNeedUpdate) {
    calculateDistances(obj);
    obj.distancesNeedUpdate = false;
  }

  obj.lPoints = [];

  var l = [];

  var steps, distancePerStep;

  if (settings.steps) {
    steps = settings.steps;
    distancePerStep = obj.d / steps;
  }

  if (settings.distancePerStep) {
    distancePerStep = settings.distancePerStep;
    steps = obj.d / distancePerStep;
  }

  var d = 0,
    p = 0;

  obj.lPoints = [];

  var current = new THREE.Vector3();
  current.copy(obj.points[0].clone());
  obj.lPoints.push(current.clone());

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

  for (var j = 0; j < obj.points.length; j++) {

    if (obj.points[j].ac - d > distancePerStep) {

      d += splitSegment(current, obj.points[j], obj.lPoints);

    }

  }
  obj.lPoints.push(obj.points[obj.points.length - 1].clone());

}