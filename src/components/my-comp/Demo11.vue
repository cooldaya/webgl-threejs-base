<template>
  <div class="demo11">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      在不考虑法相的情况下，使用8个点的立方体
      <br />
      涉及属性 index,position,group
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
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    camera.position.set(4, 6, 6);
    // 创建一个空的 BufferGeometry
    const bufferGeometry = new THREE.BufferGeometry();
    const vertices = [
      0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 1, -0.5, 0.5, 1, 0.5,

      -0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 1, -0.5, -0.5, 1, 0.5,
    ];
    bufferGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    ); // 顶点坐标

    // 定义立方体的面的（三角形点位）索引   两个三角-组成一个正方形面，逆时针是正面
    const indices = new Uint16Array([
      0,
      1,
      2,
      2,
      3,
      0, // 右面
      1,
      5,
      6,
      6,
      2,
      1, // 后面
      5,
      4,
      7,
      7,
      6,
      5, // 左面
      4,
      0,
      3,
      3,
      7,
      4, // 正面
      3,
      2,
      6,
      6,
      7,
      3, // 顶面
      4,
      5,
      1,
      1,
      0,
      4, // 底面
    ]);
    bufferGeometry.index = new THREE.BufferAttribute(indices, 1); // 顶点索引

    // 设置分组，start,count 是索引 indices 起始位置和数量
    bufferGeometry.groups = [
      { start: 0, count: 6, materialIndex: 0 }, // 前面
      { start: 6, count: 6, materialIndex: 1 }, // 右面
      { start: 12, count: 6, materialIndex: 2 }, // 后面
      { start: 18, count: 6, materialIndex: 3 }, // 左面
      { start: 24, count: 6, materialIndex: 4 }, // 顶面
      { start: 30, count: 6, materialIndex: 5 }, // 底面
    ];

    // 创建6种不同颜色的材质
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 红色
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 绿色
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // 蓝色
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 黄色
      new THREE.MeshBasicMaterial({ color: 0xff00ff }), // 紫色
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // 青色
    ];
    const cube = new THREE.Mesh(bufferGeometry, materials);
    scene.add(cube);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo11 {
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
<style lang="less">
.demo11 {
}
</style>
