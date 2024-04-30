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
import { getHdr } from "@/assets/imgs/index.js";

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
  threeTool._scene.add(new THREE.AmbientLight(0xffffff, 5));
  threeTool.utils.importGltfModel({
    dir: "/assets/3d/model/",
    url: "medieval_fantasy_book.glb",
    callback: (gltf) => {
      console.log(gltf);
      threeTool.utils.autoFitCameraToModel(gltf.scene, 0.9); // 设置预览模型视角
      threeTool.utils.playGltfAnimation(gltf);
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
