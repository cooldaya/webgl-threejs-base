<template>
  <div class="demo13">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <!-- <div class="tip">
      在不考虑法相的情况下，使用8个点的立方体
      <br />
      涉及属性 index,position,group
    </div> -->
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
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000000; i++) {
      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push(x, y, z);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const sprite = new THREE.TextureLoader().load("/assets/textures/fire_02.png");
    sprite.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.PointsMaterial({
      size: 10,
      sizeAttenuation: true,
      alphaTest: 0.5,
      transparent: true,
      map: sprite, 
    });

    const particles = new THREE.Points(geometry, material);
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
 
    scene.add(particles);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo13 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    right: -10px;
    bottom: 10px;
    background: white;
    transform: translateX(100%);
  }
}
</style>
