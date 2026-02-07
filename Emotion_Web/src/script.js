import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import GUI from "lil-gui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";

gsap.registerPlugin(ScrollTrigger);
/**
 * Base
 */
// Debug
// const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");
canvas.style.opacity = 0; // Initial opacity

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particles.material.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(4.5, 4, 11);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#ffffff";
renderer.setClearColor(debugObject.clearColor);

/**
 * Create black sphere
 */
// Sphere parameters that can be animated
const sphereParams = {
  radius: 0.02,
  widthSegments: 128,
  heightSegments: 128,
};

const baseGeometry = {};
baseGeometry.instance = new THREE.SphereGeometry(
  sphereParams.radius,
  sphereParams.widthSegments,
  sphereParams.heightSegments,
);

// Add black color attribute
const positionCount = baseGeometry.instance.attributes.position.count;
const colorArray = new Float32Array(positionCount * 3);
colorArray.fill(0); // Black color (0, 0, 0)
baseGeometry.instance.setAttribute(
  "color",
  new THREE.BufferAttribute(colorArray, 3),
);

baseGeometry.count = baseGeometry.instance.attributes.position.count;

/**
 * GPU Compute
 */
// Setup
const gpgpu = {};
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));
gpgpu.computation = new GPUComputationRenderer(
  gpgpu.size,
  gpgpu.size,
  renderer,
);

// Base particles
const baseParticlesTexture = gpgpu.computation.createTexture();

// Function to update base particles texture from geometry
const updateBaseParticlesTexture = (geometry, texture) => {
  const count = geometry.attributes.position.count;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    // Position based on geometry with random offset
    const randomOffsetX = (Math.random() - 0.5) * 0.5;
    const randomOffsetY = (Math.random() - 0.5) * 0.5;
    const randomOffsetZ = (Math.random() - 0.5) * 0.5;

    texture.image.data[i4 + 0] =
      geometry.attributes.position.array[i3 + 0] + randomOffsetX;
    texture.image.data[i4 + 1] =
      geometry.attributes.position.array[i3 + 1] + randomOffsetY;
    texture.image.data[i4 + 2] =
      geometry.attributes.position.array[i3 + 2] + randomOffsetZ;
    texture.image.data[i4 + 3] = Math.random();
  }
  texture.needsUpdate = true;
};

updateBaseParticlesTexture(baseGeometry.instance, baseParticlesTexture);

// Particles variable
gpgpu.particlesVariable = gpgpu.computation.addVariable(
  "uParticles",
  gpgpuParticlesShader,
  baseParticlesTexture,
);
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
  gpgpu.particlesVariable,
]);

// Uniforms
gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(
  baseParticlesTexture,
);
gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence =
  new THREE.Uniform(0.9);
gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength =
  new THREE.Uniform(1.5);
gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency =
  new THREE.Uniform(0.7);

// Init
gpgpu.computation.init();

// Debug
// gpgpu.debug = new THREE.Mesh(
//   new THREE.PlaneGeometry(3, 3),
//   new THREE.MeshBasicMaterial({
//     map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
//       .texture,
//   }),
// );
// gpgpu.debug.position.x = 3;
// gpgpu.debug.visible = false;
// scene.add(gpgpu.debug);

/**
 * Particles
 */
const particles = {};

// Geometry
const particlesUvArray = new Float32Array(baseGeometry.count * 2);
const sizesArray = new Float32Array(baseGeometry.count);

for (let y = 0; y < gpgpu.size; y++) {
  for (let x = 0; x < gpgpu.size; x++) {
    const i = y * gpgpu.size + x;
    const i2 = i * 2;

    // UV
    const uvX = (x + 0.5) / gpgpu.size;
    const uvY = (y + 0.5) / gpgpu.size;

    particlesUvArray[i2 + 0] = uvX;
    particlesUvArray[i2 + 1] = uvY;

    // Size
    sizesArray[i] = Math.random();
  }
}

particles.geometry = new THREE.BufferGeometry();
particles.geometry.setDrawRange(0, baseGeometry.count);
particles.geometry.setAttribute(
  "aParticlesUv",
  new THREE.BufferAttribute(particlesUvArray, 2),
);
particles.geometry.setAttribute(
  "aColor",
  baseGeometry.instance.attributes.color,
);
particles.geometry.setAttribute(
  "aSize",
  new THREE.BufferAttribute(sizesArray, 1),
);

// Material
particles.material = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uSize: new THREE.Uniform(0.07),
    uRadius: new THREE.Uniform(0.02),
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio,
      ),
    ),
    uParticlesTexture: new THREE.Uniform(),
  },
});

// Points
particles.points = new THREE.Points(particles.geometry, particles.material);
scene.add(particles.points);

/**
 * Tweaks
 */
// gui.addColor(debugObject, "clearColor").onChange(() => {
//   renderer.setClearColor(debugObject.clearColor);
// });
// gui
//   .add(particles.material.uniforms.uSize, "value")
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name("uSize");
// gui
//   .add(gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, "value")
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name("uFlowfieldInfluence");
// gui
//   .add(gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, "value")
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name("uFlowfieldStrength");
// gui
//   .add(gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, "value")
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name("uFlowfieldFrequency");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

// Sphere animation parameters
const sphereAnimParams = {
  radius: 0.01,
  canvasOpacity: 0,
};

ScrollTrigger.create({
  trigger: ".transition--black",
  start: "bottom+=200 bottom",
  end: "bottom top",
  scrub: true,
  markers: false,
  id: "sphereAnim",
  onEnter: () => {
    canvas.style.opacity = 1;
  },
  onLeaveBack: () => {
    canvas.style.opacity = 0;
  },
  onUpdate: (self) => {
    const progress = self.progress;
    // Animate radius from 0.02 to 3 - only control radius, particles count fixed
    sphereAnimParams.radius = 0.02 + progress * 0.1;

    // Animate canvas opacity from 0 to 1
    sphereAnimParams.canvasOpacity = progress;
  },
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Update radius uniform for particle scaling
  particles.material.uniforms.uRadius.value = sphereAnimParams.radius;

  // GPGPU Update
  gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime;
  gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime;
  gpgpu.computation.compute();
  particles.material.uniforms.uParticlesTexture.value =
    gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
