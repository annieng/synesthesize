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
// initializeVisual()
// function initializeVisual(){
/* Custom settings */
const SETTINGS = {
  useComposer: false
}

/* Init renderer and canvas */
const container = document.body
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setClearColor(0x323232)
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
const camera = new THREE.PerspectiveCamera(50, resize.width / resize.height, 1, 10000)
camera.position.z = 1000
const controls = new OrbitControls(camera, {element: renderer.domElement, parent: renderer.domElement, distance: 10, phi: Math.PI * 0.5})

/* Lights */
const frontLight = new THREE.PointLight(0xFFFFFF, 1)
const backLight = new THREE.PointLight(0xFFFFFF, 0.5)
scene.add(frontLight)
scene.add(backLight)
frontLight.position.x = 20
backLight.position.x = -20

/* Actual content of the scene */

// const torus = new Torus()
// scene.add(torus)

// adding wireframe sphere
var geometry = new THREE.SphereBufferGeometry(5, 5, 5);

var wireframe = new THREE.WireframeGeometry(geometry);

var line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;

scene.add(line);

// adding own torus

var geometry = new THREE.TorusGeometry(15, 3, 45, 10);
var material = new THREE.MeshStandardMaterial({ color: 0xA197C9, roughness: 0.55 })
var torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// initializeVisual()
// function initializeVisual () {
//var hilbertPoints = hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);
// Colors with BufferGeometry
// var buffGeometry0 = new THREE.BufferGeometry(),
//   buffGeometry1 = new THREE.BufferGeometry(),
//   buffGeometry2 = new THREE.BufferGeometry();

// var subdivisions = 6;

// var position = [],
//   colorArray0 = [],
//   colorArray1 = [],
//   colorArray2 = [];

// var point = new THREE.Vector3();
// var color = new THREE.Color();

// var spline = new THREE.CatmullRomCurve3(hilbertPoints);
// for (i = 0; i < hilbertPoints.length * subdivisions; i++) {
//   var t = i / (hilbertPoints.length * subdivisions);
//   spline.getPoint(t, point);
//   position.push(point.x, point.y, point.z);
//   color.setHSL(0.6, 1.0, Math.max(0, - point.x / 200) + 0.5);
//   colorArray0.push(color.r, color.g, color.b);
//   color.setHSL(0.9, 1.0, Math.max(0, - point.y / 200) + 0.5);
//   colorArray1.push(color.r, color.g, color.b);
//   color.setHSL(i / (hilbertPoints.length * subdivisions), 1.0, 0.5);
//   colorArray2.push(color.r, color.g, color.b);
// }
// buffGeometry0.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
// buffGeometry1.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
// buffGeometry2.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
// buffGeometry0.addAttribute('color', new THREE.Float32BufferAttribute(colorArray0, 3));
// buffGeometry1.addAttribute('color', new THREE.Float32BufferAttribute(colorArray1, 3));
// buffGeometry2.addAttribute('color', new THREE.Float32BufferAttribute(colorArray2, 3));
// // Colors with Geometry
// var geometry0 = new THREE.Geometry(),
//   geometry2 = new THREE.Geometry(),
//   geometry3 = new THREE.Geometry();
// var colors0 = [],
//   colors1 = [],
//   colors2 = [];
// for (i = 0; i < hilbertPoints.length; i++) {
//   geometry0.vertices.push(hilbertPoints[i]);
//   colors0[i] = new THREE.Color(0xffffff);
//   colors0[i].setHSL(0.6, 1.0, Math.max(0, (200 - hilbertPoints[i].x) / 400) * 0.5 + 0.5);
//   colors1[i] = new THREE.Color(0xffffff);
//   colors1[i].setHSL(0.3, 1.0, Math.max(0, (200 + hilbertPoints[i].x) / 400) * 0.5);
//   colors2[i] = new THREE.Color(0xffffff);
//   colors2[i].setHSL(i / hilbertPoints.length, 1.0, 0.5);
// }
// geometry2.vertices = geometry3.vertices = geometry0.vertices;
// geometry0.colors = colors0;
// geometry2.colors = colors1;
// geometry3.colors = colors2;
// // Create lines and add to scene
// material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors });
// var line, p, scale = 0.3, d = 225;
// var parameters = [
//   [material, scale * 1.5, [- d, - d / 2, 0], buffGeometry0],
//   [material, scale * 1.5, [0, - d / 2, 0], buffGeometry1],
//   [material, scale * 1.5, [d, - d / 2, 0], buffGeometry2],
//   [material, scale * 1.5, [- d, d / 2, 0], geometry0],
//   [material, scale * 1.5, [0, d / 2, 0], geometry2],
//   [material, scale * 1.5, [d, d / 2, 0], geometry3],
// ];
// for (i = 0; i < parameters.length; i++) {
//   p = parameters[i];
//   line = new THREE.Line(p[3], p[0]);
//   line.scale.x = line.scale.y = line.scale.z = p[1];
//   line.position.x = p[2][0];
//   line.position.y = p[2][1];
//   line.position.z = p[2][2];
//   scene.add(line);
// }
// // Input Event Listeners
// document.addEventListener('mousemove', onDocumentMouseMove, false);
// document.addEventListener('touchstart', onDocumentTouchStart, false);
// document.addEventListener('touchmove', onDocumentTouchMove, false);
// }
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
  camera.aspect = resize.width / resize.height
  camera.updateProjectionMatrix()
  renderer.setSize(resize.width, resize.height)
  composer.setSize(resize.width, resize.height)
}

/**
  Render loop
*/
function render (dt) {
  controls.update()
  if (SETTINGS.useComposer) {
    composer.reset()
    composer.render(scene, camera)
    composer.pass(bloomPass)
    composer.pass(fxaaPass)
    composer.toScreen()
  } else {
    torus.rotation.x += 0.01
    torus.rotation.y += 0.01
    renderer.render(scene, camera)
  }
}


// functions for three scene

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
  console.log(midiEvent)
  
  
  //var newItem = document.createElement('li');
  //newItem.appendChild(document.createTextNode(messageData.data));
  //newItem.className = 'user-midi';
  //document.getElementById('midi-data').prepend(newItem);

  // SYNTH SOUNDS

  const note = {
    on: midiEvent[0],
    pitch: midiEvent[1],
    velocity: midiEvent[2]
  }
  play(note);

  // emit to socket
  socket.emit('midi', note)

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
