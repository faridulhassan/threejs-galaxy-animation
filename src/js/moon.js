import * as THREE from "three";

export default class Moon {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }
  init() {
    const geometry = new THREE.SphereGeometry(2, 8, 8),
      material = new THREE.MeshPhongMaterial({
        color: "red",
        shininess: 30,
        emissive: "blue",
        emissiveIntensity: 0.8,
      });
    this.mesh = new THREE.Mesh(geometry, material);
  }
  draw() {
    this.scene.add(this.mesh);
  }
}
