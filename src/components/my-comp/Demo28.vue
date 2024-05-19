<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { getImg } from "@/assets/imgs";
import { Sky } from "three/addons/objects/Sky.js";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: false,
  });
  threeTool._renderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeTool._renderer.toneMappingExposure = 0.5;

  threeTool._camera.position.set(-10, 4.6, 0); // 相机位置

  const sun = new THREE.Vector3(300, 10, 0); // 太阳光源位置
  let renderTarget;
  const pmremGenerator = new THREE.PMREMGenerator(threeTool._renderer);

  const setWater = (scene) => {
    const distance = 4000;
    const water = new Water(new THREE.PlaneGeometry(distance, distance), {
      waterNormals: new THREE.TextureLoader().load(
        getImg("waternormals.jpg"),
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ), // 法线贴图
      sunDirection: new THREE.Vector3(0,0,0), // 太阳光源方向
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 1.0,
      fog: scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2; // 旋转水面
    water.material.side = THREE.DoubleSide; // 使水面可见
    scene.add(water);
    threeTool.callOn("renderUpdate", () => {
      water.material.uniforms.time.value += (1.0 / 60.0) * 0.3;
    });
    return water;
  };

  const setSky = (scene) => {
    const sky = new Sky();
    sky.scale.setScalar(10000); // 设置天空的缩放比例

    const skyUniforms = sky.material.uniforms;
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;
    sky.material.uniforms["sunPosition"].value.copy(sun);

    return sky;
  };

  const setBox = (scene) => {
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshStandardMaterial({ roughness: 0 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 3, 0);
    scene.add(cube);
    threeTool.callOn("renderUpdate", () => {
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;
      cube.position.y = (Math.sin(Date.now() / 1000) + 0.5) * 3;
    });
  };

  const setLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
    directionalLight.position.set(30, 30, 30);
    scene.add(directionalLight);
  };

  const updateSun = (scene, sky, water) => {
    const sceneEnv = new THREE.Scene();

    // sky.material.uniforms["sunPosition"].value.copy(sun);

    if (renderTarget !== undefined) renderTarget.dispose();
    sceneEnv.add(sky);
    renderTarget = pmremGenerator.fromScene(sceneEnv);
    scene.add(sky);

    scene.environment = renderTarget.texture;
  };

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const sky = setSky(scene);
    const water = setWater(scene);
    setLight(scene);
    updateSun(scene, sky, water);
    setBox(scene);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo21 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
  }
}
</style>
