import { Object3D, SphereBufferGeometry, WireFrameGeometry, LineSegments } from 'three'

export default class Abstract extends Object3D {
  constructor() {
    super()

    const geometry = new SphereBufferGeometry(10, 10, 10)
    // var wireframe = new WireframeGeometry(geometry);

    // var line = new LineSegments(wireframe);
    // line.material.depthTest = false;
    // line.material.opacity = 0.25;
    // line.material.transparent = true;
    // const material = new MeshStandardMaterial({ color: 0xA197C9, roughness: 0.18, metalness: 0.5 })
    // const mesh = new Mesh(geometry, material)

    this.add(line)
  }
}


// var geometry = new THREE.SphereBufferGeometry(100, 100, 100);

// var wireframe = new THREE.WireframeGeometry(geometry);

// var line = new THREE.LineSegments(wireframe);
// line.material.depthTest = false;
// line.material.opacity = 0.25;
// line.material.transparent = true;

// scene.add(line);