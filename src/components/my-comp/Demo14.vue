<template>
  <div class="demo14">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <!-- <div class="tip">
      https://juejin.cn/post/7179513419307941949 // 原文链接
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
    const positions = [-2, 2, 0, -2, -2, 0, 2, 2, 0];
    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const COUNT = 10;
    const offsetX = new Array(COUNT).fill(0);
    offsetX.forEach((v, i, a) => (a[i] = i * 10));
    instancedGeometry.setAttribute(
      "offsetX",
      new THREE.InstancedBufferAttribute(new Uint16Array(offsetX), 1)
    );
    const colors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1];
    instancedGeometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 3, false, 2)
    );

    const material = new THREE.RawShaderMaterial({
      vertexShader: `
        precision highp float;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        attribute vec3 position;
        attribute float offsetX;
        attribute vec3 color;

        varying vec4 vColor;

        void main(){
          vec3 _position = position;
          _position.x += offsetX; // 使用offsetX
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(_position, 1.0);

          vColor = vec4(color, 1.0);
        }`,
      fragmentShader: `
        precision highp float;
        varying vec4 vColor;

        void main(){
          gl_FragColor = vColor;
        }`,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(instancedGeometry, material);

    scene.add(mesh);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo14 {
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
    max-width: 300px;
  }
  .text-red {
    color: red;
  }

  .des {
    height: 200px;
    max-width: 300px;
    overflow: scroll;
  }
}
</style>
