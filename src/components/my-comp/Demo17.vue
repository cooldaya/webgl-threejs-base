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
import { Sky } from "three/addons/objects/Sky.js";
const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    showFullScreenBtn: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const count = 10000 * 10;
    const distance = 100;
    const boxes = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshLambertMaterial(),
      count
    );
    const matrix = new THREE.Matrix4();
    const dcolor = new THREE.Color();
    for (let i = 0; i < count; i++) {
      matrix.setPosition(
        Math.random() * distance - 0.5 * distance,
        Math.random() * distance * 0.5,
        Math.random() * distance - 0.5 * distance
      );
      boxes.setMatrixAt(i, matrix);
      boxes.setColorAt(i, dcolor.setHex(Math.random() * 0xffffff));
    }

    scene.add(boxes);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
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
