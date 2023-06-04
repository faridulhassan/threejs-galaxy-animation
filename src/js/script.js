import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default class App {
  constructor(el = "app") {
    this.el = document.getElementById(el);
    this.primaryColor = 0x001a2d;

    // create a render and set the size
    const sizes = (this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // bind
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.updateStar = this.updateStar.bind(this);
    this.init();
    this.createStars();
    this.render();
    this.eventListeners();
  }
  init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = (this.scene = new THREE.Scene());
    this.scene.fog = new THREE.Fog(this.primaryColor, 80, 140);
    // create a camera, which defines where we're looking at
    const camera = (this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    ));
    // tell the camera where to look
    this.camera.position.set(-43.637905276774276, 33.174599197613293, 40);
    this.camera.lookAt(new THREE.Vector3());

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    }));
    this.renderer.setClearColor(this.primaryColor);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    // add the output of the render function to the HTML
    this.el.appendChild(renderer.domElement);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Moon
    this.moon = null;
    this.createMoon();
    this.createTerrain();
  }
  createMoon() {
    const geometry = new THREE.SphereGeometry(3, 32, 32),
      material = new THREE.MeshPhongMaterial({
        color: 0x26fdd9,
        shininess: 15,
        emissive: 0x2bb2e6,
        emissiveIntensity: 0.8,
        // wireframe: true,
      });
    this.moon = new THREE.Mesh(geometry, material);
    this.moon.position.set(0, 1, -6.5);

    // Moon Light
    const moonLight = (this.moonLight = new THREE.PointLight(0xffffff, 1, 50));
    // moonLight.rotation.x = 2;
    this.scene.add(moonLight);
    /* const pointLightHelper = new THREE.PointLightHelper(moonLight);
    this.scene.add(pointLightHelper); */

    this.moonLight.position.copy(this.moon.position);
    this.scene.add(this.moon);
    const moonlight2 = new THREE.PointLight(0xffffff, 0.6, 150);
    this.scene.add(moonlight2);
    moonlight2.position.x += 10;
    moonlight2.position.y -= 10;
    moonlight2.position.z -= 15;
    /* const pointLightHelper = new THREE.PointLightHelper(moonlight2);
    this.scene.add(pointLightHelper); */
  }
  createTerrain() {
    const geometry = new THREE.PlaneGeometry(150, 150, 50, 50),
      material = new THREE.MeshPhongMaterial({
        color: 0x198257,
        emissive: 0x032f50,
        // transparent: true,
        // opacity: 0.5,
        // wireframe: true,
      });

    let m = new THREE.Matrix4();
    m.makeRotationX(Math.PI * -0.5);
    geometry.applyMatrix4(m);

    let vertices = geometry.attributes.position.array,
      iterationCount = geometry.attributes.position.count;
    let space = 0.09;
    for (let i = 0; i < iterationCount; i++) {
      let x = vertices[i * 3 + 0],
        z = vertices[i * 3 + 2];
      let ratio = noise.simplex3(x * space, z * space, 0);
      vertices[i * 3 + 1] = ratio * 1.7;
    }
    geometry.attributes.position.needsUpdate = true;

    console.log(geometry);
    window.plane = this.plane = new THREE.Mesh(geometry, material);
    this.scene.add(this.plane);
  }
  createStars() {
    const stars = (this.stars = new THREE.Group());

    this.scene.add(stars);

    const starsLights = (this.starsLights = new THREE.Group());

    this.scene.add(starsLights);

    const starsAmount = (this.starsAmount = 20);

    const geometry = new THREE.SphereGeometry(0.5, 16, 16),
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

    for (let i = 0; i < starsAmount; i++) {
      const star = new THREE.Mesh(geometry, material);
      star.position.x = (Math.random() - 0.5) * 150; // 150 equals to plane width
      star.position.z = (Math.random() - 0.5) * 150; // 150 equals to plane height
      let ratio = noise.simplex3(
        star.position.x * 0.09,
        star.position.z * 0.09,
        0
      );
      star.position.y = ratio * 1.7 + 0.09;
      var velX = (Math.random() + 0.1) * 0.1 * (Math.random() < 0.5 ? -1 : 1);
      var velY = (Math.random() + 0.1) * 0.1 * (Math.random() < 0.5 ? -1 : 1);
      star.vel = new THREE.Vector2(velX, velY);
      this.stars.add(star);
      const starLight = new THREE.PointLight(0xffffff, 0.8, 3);
      starLight.position.copy(star.position);
      starLight.position.y += 0.05;
      this.starsLights.add(starLight);
    }
  }
  updateStar(star, i) {
    const area = 75;
    if (star.position.x < -area) {
      star.position.x = area;
    }
    if (star.position.x > area) {
      star.position.x = -area;
    }
    if (star.position.z < -area) {
      star.position.z = area;
    }
    if (star.position.z > area) {
      star.position.z = -area;
    }
    star.position.x += star.vel.x * 0.9;
    star.position.z += star.vel.y * 0.9;
    const ratio = noise.simplex3(
      star.position.x * 0.3,
      star.position.z * 0.3,
      0
    );
    star.position.y = ratio * 0.003;
    this.starsLights.children[i].position.copy(star.position);
    this.starsLights.children[i].position.y += 0.5;
  }
  updateCamera() {
    const area = 100;
    if (this.camera.position.x < -area) {
      this.camera.position.x = area;
    }
    if (this.camera.position.x > area) {
      this.camera.position.x = -area;
    }
    if (this.camera.position.z < -area) {
      this.camera.position.z = area;
    }
    if (this.camera.position.z > area) {
      this.camera.position.z = -area;
    }
    if (this.camera.position.y >= 30) {
      this.camera.position.y = 1;
    }
    this.camera.position.x += 0.3 * 0.02;
    this.camera.position.y += 0.3 * 0.02;
    this.camera.position.z += 0.3 * 0.02;
  }
  resize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  render() {
    requestAnimationFrame(this.render);

    this.controls.update();
    for (let i = 0; i < this.starsAmount; i++) {
      this.updateStar(this.stars.children[i], i);
    }
    // this.camera.position.y = 30;
    // this.camera.position.z = 30;
    // this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  eventListeners() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}

window.THREE = THREE;
