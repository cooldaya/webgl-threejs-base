<template>
  <div class="demo15">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      使用instancedBufferGeometry绘制多个相同的物体，每个物体的位置、颜色、大小、方向都可以不同
      （rawShaderMaterial）。
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";
import * as THREE from "three";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 500,
  });

  const getTexture = () => {
    // 1. 创建 <canvas> 元素
    const canvas = document.createElement("canvas");

    // 2. 获取 Canvas 2D 渲染上下文
    const ctx = canvas.getContext("2d");

    // 设置 Canvas 大小
    const size = 256; // 纹理大小
    canvas.width = size;
    canvas.height = size;

    // 3. 在上下文中绘制黑白相间的图案
    const tileSize = 32; // 单个瓷砖大小
    ctx.fillStyle = "#ffffff"; // 白色
    ctx.fillRect(0, 0, size, size); // 填充白色背景
    ctx.fillStyle = "#000000"; // 黑色
    ctx.fillRect(0, 0, size, size / 2); // 填充黑色背景

    // 4. 使用 THREE.CanvasTexture 将 Canvas 转换为 Three.js 纹理
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const color = (t) => new THREE.Color(t);
    const randomFloat = (min, max) =>
      (Math.random() * (max - min) + min).toFixed(2);

    const types = [
      [0.4, 0.8, 0.4],
      [0.6, 0.5, 0.6],
      [0.3, 0.3, 1],
    ];

    const count = 100000;
    const distance = 500;
    const desiredHeight = 0.01;

    const buildMaterial = new THREE.MeshBasicMaterial({
      color: "green",
      side: THREE.DoubleSide,
    });
    types.forEach((type) => {
      const buildGeometry = new THREE.BoxGeometry(...type);
      const buildMesh = new THREE.InstancedMesh(
        buildGeometry,
        buildMaterial,
        count
      );
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(
          randomFloat(-distance, distance),
          desiredHeight + (type[1] * 1) / 2,
          randomFloat(-distance, distance)
        );
        dummy.updateMatrix();
        buildMesh.setMatrixAt(i, dummy.matrix);
      }
      scene.add(buildMesh);
    });
  });
  threeTool._scene.fog = new THREE.Fog("#ccc", 1, 16);
  threeTool._controls.maxPolarAngle = 1.57;
  threeTool._controls.minPolarAngle = 0.4;
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo15 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
