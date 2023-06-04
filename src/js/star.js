import * as THREE from "three";

export default class Star {
  constructor(scene, position) {
    this.scene = scene;
    this.position = position;
    this.init();
  }
  init() {
    const geometry = new THREE.SphereGeometry(1, 10, 15);
    const material = new THREE.MeshBasicMaterial({
      color: "green",
      wireframe: true,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = 3;
    this.mesh.position.z = 2;
    // Point Light
    const red = new THREE.Color("skyblue");
    const pointLight = new THREE.PointLight(red, 2, 2, 1);
    // light.position.copy(cube.position);
    // pointLight.position.set(-2, 2, 4);
    pointLight.position.copy(this.mesh.position);
    this.scene.add(pointLight);
  }
  move() {}
  draw() {
    this.scene.add(this.mesh);
  }
}
