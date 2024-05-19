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
import { Vector3 } from "three";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    usePostprocessing: true,
  });
  const log = console.log;

 
  const setScene = (scene) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    const v3 = new Vector3(1, 2, 3);
    v3.multiplyScalar(2)
    log(v3.randomDirection().length())
  };

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    setScene(scene);
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
