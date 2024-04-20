<template>
  <div class="demo10">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="controls">
      <button id="playBtn">播放</button>
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";

import * as THREE from "three";
import getTextureImg from "@/assets/textures/cube6p/getImg.js";
import getModelUrl from "@/assets/models/getModelUrl.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    showGUI: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    camera.position.set(4, 6, 6);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    console.log(geometry)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo10 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .controls {
    position: absolute;
    left: 10px;
    bottom: 10px;
    button {
      background-color: aquamarine;

      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      color: white;

      font-size: 16px;
    }
  }
}
</style>
