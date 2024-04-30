<template>
  <div class="demo16">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";
import * as THREE from "three";
import { getHdr, getImg } from "@/assets/imgs/index.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: false,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const geometry = new THREE.TorusKnotGeometry(4.6, 1.5, 24, 89, 2, 3);
    let material = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    const urls = ['pos-x','neg-x','pos-y','neg-y','pos-z','neg-z'].map(img=>getImg(`cube1/${img}.jpg`));
    threeTool.utils.addSkyBox(urls)
    threeTool._camera.position.set(20, 8, 10);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo16 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
