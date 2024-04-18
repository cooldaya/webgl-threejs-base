<template>
  <div class="demo8">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
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
  // threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
  //   const geometry = new THREE.BoxGeometry(1, 1, 1);
  //   const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);

  //   camera.position.set(4, 6, 6);
  // });
  threeTool._scene.add(new THREE.AmbientLight(0xffffff, 5));
  threeTool.utils.importGltfModel({
    dir: "/assets/3d/model/",
    url: "medieval_fantasy_book.glb",
    callback: (gltf) => {
      console.log(gltf);
      threeTool.utils.autoFitCameraToModel(gltf.scene,0.9)
    },
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo8 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
<style lang="less">
.demo8 {
}
</style>
