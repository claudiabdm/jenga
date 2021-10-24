import {
  BoxGeometry,
  Mesh,
  Color,
  AmbientLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  TextureLoader,
  DirectionalLight,
  MeshStandardMaterial,
  PlaneGeometry,
  DoubleSide,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

import woodColorMap from "/textures/2K-anigre_basecolor.png";
import woodNormalMap from "/textures/2K-anigre_normal.png";
import woodRoughMap from "/textures/2K-anigre_roughness.png";
import woodMetalMap from "/textures/2K-anigre_metallic.png";
import woodAoMap from "/textures/2K-anigre_ao.png";

/**
 * Loaders
 */
const textureLoader = new TextureLoader();
const woodColor = textureLoader.load(woodColorMap);
const woodNormal = textureLoader.load(woodNormalMap);
const woodRough = textureLoader.load(woodRoughMap);
const woodMetal = textureLoader.load(woodMetalMap);
const woodAo = textureLoader.load(woodAoMap);

/**
 * Base
 */

const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new Scene();
scene.background = new Color("white");

const camera = new PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.set(-5, 8, -5);
scene.add(camera);

/**
 * Render
 */
const renderer = new WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 3;
controls.maxDistance = 10;

/**
 * Lights
 */
const ambientLight = new AmbientLight("white", 1);
scene.add(ambientLight);

const directionalLight = new DirectionalLight("white", 0.3);
directionalLight.castShadow = true;
directionalLight.position.x = -5;
directionalLight.position.z = -5;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 15;
scene.add(directionalLight);

/**
 * Objects
 */

createJengaTower();
createFloor();

/**
 * Animation
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function tick() {
  // Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

tick();

function createJengaTower() {
  const blockSize = {
    x: 2.5 / 7.5,
    y: 1.5 / 7.5,
    z: 7.5 / 7.5,
  };
  const box = new BoxGeometry(blockSize.x, blockSize.y, blockSize.z);
  const material = new MeshStandardMaterial({
    map: woodColor,
    normalMap: woodNormal,
    roughnessMap: woodRough,
    metalnessMap: woodMetal,
    aoMap: woodAo,
  });

  let lastPositionY = 0;

  for (let i = 0; i < 18; i++) {
    const currentPostionY = lastPositionY + blockSize.y / 2;

    const block1 = new Mesh(box, material);
    const block2 = new Mesh(box, material);
    const block3 = new Mesh(box, material);

    if (i % 2 === 0) {
      block1.rotation.y = Math.PI * 0.5;
      block2.rotation.y = Math.PI * 0.5;
      block3.rotation.y = Math.PI * 0.5;
      block1.position.set(0, currentPostionY, -blockSize.x - 0.01);
      block2.position.set(0, currentPostionY, 0);
      block3.position.set(0, currentPostionY, blockSize.x + 0.01);
    } else {
      block1.position.set(-blockSize.x - 0.01, currentPostionY, 0);
      block2.position.set(0, currentPostionY, 0);
      block3.position.set(blockSize.x + 0.01, currentPostionY, 0);
    }

    block1.castShadow = true;
    block2.castShadow = true;
    block3.castShadow = true;
    block1.receiveShadow = true;
    block2.receiveShadow = true;
    block3.receiveShadow = true;

    scene.add(block1);
    scene.add(block2);
    scene.add(block3);

    lastPositionY += blockSize.y;
  }
}

function createFloor() {
  const planeGeometry = new PlaneGeometry(10, 10);
  const floor = new Mesh(
    planeGeometry,
    new MeshStandardMaterial({
      color: "#eeeeee",
      metalness: 0.3,
      roughness: 0.4,
      side: DoubleSide,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0.01;
  scene.add(floor);
}
