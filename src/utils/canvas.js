import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

export function makeScene(elem) {
  var scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 20;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1, 2);

  scene.add(camera);
  const controls = new TrackballControls(camera, elem);
  controls.noZoom = true;
  controls.noPan = true;

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  return { scene, camera, elem,controls };
}

export function setupScene(elem, initFunc) {
  const sceneInfo = makeScene(elem);
  const initSceneFunc =
    initFunc ||
    function () {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ color: "red" });
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
    };
  const mesh = initSceneFunc(THREE, sceneInfo);
  sceneInfo.camera.lookAt(new THREE.Vector3(0, 0, 0));
  sceneInfo.scene.add(mesh);
  sceneInfo.mesh = mesh;
  return sceneInfo;
}

export function getRenderSceneInfo(sceneInfo, renderer) {
  const { scene, camera, elem } = sceneInfo;

  const { left, right, top, bottom, width, height } =
    elem.getBoundingClientRect();
  // 虚拟场景一直在 canvas 之上，因此需要判断是否超出可视范围

  const {
    width: canvasWidth,
    height: canvasHeight,
    left: canvasLeft,
    top: canvasTop,
    bottom: canvasBottom,
  } = renderer.domElement.getBoundingClientRect();

  const isOffScreen =
    bottom < 0 ||
    top > window.innerHeight ||
    right < 0 ||
    left > window.innerWidth;
  if (isOffScreen) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // 裁剪空间
  const cRect = {
    x: left - canvasLeft,
    y: canvasBottom - bottom,
    width: width,
    height: height,
  };
  return cRect;
}


export function setupCanvas(elem){
  // 放置canvas 元素
  const canvas = document.createElement("canvas");
  const parentRect = elem.getBoundingClientRect();
  canvas.width = parentRect.width;
  canvas.height = parentRect.height;
  elem.appendChild(canvas);
  return canvas;
}
