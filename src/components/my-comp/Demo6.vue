<template>
  <div class="demo6">
    <div class="canvas-wrap" ref="canvasWrapRef" v-loading="loading" ></div>
    <div class="gui-wrap"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool";
import { onMounted, ref } from "vue";

import * as THREE from "three";
import getTextureImg from "@/assets/textures/cube6p/getImg.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;

  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    loading.value = true;
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    // const materials = Array.from(
    //   { length: 6 },
    //   (_, index) =>
    //     new THREE.MeshBasicMaterial({
    //       map: loader.load(getTextureImg(index + 1)),
    //     })
    // );


    const materials =  Array.from({length:6},(_,index)=>new THREE.MeshBasicMaterial({map:loader.load(`https://picsum.photos/200?${index}`)}));

    const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);
    cube.position.set(0, 2, 0);
    scene.add(cube);

    loadManager.onLoad = () => {
      loading.value = false;
    };
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo6 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
