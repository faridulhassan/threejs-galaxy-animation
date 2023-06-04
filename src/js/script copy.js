import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Star from "./star";
export default class App {
  constructor(el = "app") {
    this.el = document.getElementById(el);
    // bind
    this.draw = this.draw.bind(this);
    this.init();
    this.draw();
  }
  init() {
    const scene = (window.scene = this.scene = new THREE.Scene());
    this.scene.fog = new THREE.Fog(0x001a2d, 80, 140);
    // create a camera, which defines where we're looking at
    const camera = (this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    ));
    // tell the camera where to look
    this.camera.position.set(0, 0, 10);
    // create a render and set the size
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    }));
    // this.renderer.shadowMap.enabled = true;

    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.renderer.setClearColor(new THREE.Color("gray"));
    // add the output of the render function to the HTML
    this.el.appendChild(this.renderer.domElement);

    // controller
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);

    // Geometry
    const boxSize = 0.4;
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: !true,
      opacity: 0.5,
    });
    const cube = (this.cube = new THREE.Mesh(geometry, material));
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.z = 0.3;
    // cube.visible = false;
    this.scene.add(cube);

    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#eee"),
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = Math.PI / 2;
    // plane.castShadow = true;
    this.scene.add(plane);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(new THREE.Color("yellow"), 0.5);
    // this.scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(
      new THREE.Color("#eee"),
      4
    );
    const d = 100;

    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.castShadow = true;
    directionalLight.position.set(-2, 2, 4);
    // this.scene.add(directionalLight);
    const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    // this.scene.add(dirLightHelper);

    // Point Light
    const red = new THREE.Color("skyblue");
    const pointLight = (this.pointLight = new THREE.PointLight(red, 2, 2, 1));
    // light.position.copy(cube.position);
    // pointLight.position.set(-2, 2, 4);
    pointLight.position.copy(cube.position);
    this.scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper(pointLight);
    // this.scene.add(pointLightHelper);

    // Star
    const star = new Star(this.scene);
    star.draw();
  }
  resize() {}
  draw() {
    requestAnimationFrame(this.draw);
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    let speed = 0.01;
    // this.pointLight.position.x += speed;
    this.controller.update();
    this.renderer.render(this.scene, this.camera);
  }
}
